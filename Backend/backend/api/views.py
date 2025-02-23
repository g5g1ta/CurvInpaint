from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView
from rest_framework_simplejwt.views import (
TokenObtainPairView,
TokenRefreshView
)
import uuid
from rest_framework import generics
from .serializers import CustomTokenObtainSerializer, UserSerializer, PhotoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .models import Image as ImageModel
from rest_framework.response import Response
from rest_framework import status
import cv2
import numpy as np
import urllib
from rest_framework.parsers import MultiPartParser, FormParser
import os
import numpy as np
import cv2
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from PIL import Image, ImageDraw
from rest_framework.views import APIView
import json
import base64
from io import BytesIO
import requests
import io
from dotenv import load_dotenv


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainView(TokenObtainPairView):
    serializer_class = CustomTokenObtainSerializer
    permission_classes = [AllowAny]

class GetUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class InpaintImageView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        original_image = request.FILES.get('original_image')
        mask_image = request.FILES.get('mask_image')

        if not original_image or not mask_image:
            return Response({"error": "Original_image and mask cannot be null!!!"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            original_image_pil = Image.open(original_image).convert('RGB')
            original_image_cv = np.array(original_image_pil)

            mask_image_pil = Image.open(mask_image).convert('L')
            mask_image_cv = np.array(mask_image_pil)

            mask_image_cv = cv2.resize(mask_image_cv, (original_image_cv.shape[1], original_image_cv.shape[0]))


            _, mask_image_cv = cv2.threshold(mask_image_cv, 1, 255, cv2.THRESH_BINARY)


            inpainted_image_cv = cv2.inpaint(original_image_cv, mask_image_cv, 3, cv2.INPAINT_TELEA)


            inpainted_image_pil = Image.fromarray(inpainted_image_cv)
            buffered = BytesIO()
            inpainted_image_pil.save(buffered, format="PNG")
            inpainted_image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
            inpainted_image_data_uri = f"data:image/png;base64,{inpainted_image_base64}"

            return Response({"inpainted_image": inpainted_image_data_uri}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during inpainting: {str(e)}")
            return Response({"error": "An error occurred during image processing."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

load_dotenv()
API_URL = os.getenv("API_URL")
headers = {"Authorization": f"Bearer {os.getenv("API_TOKEN")}"}

class GenerateImageV3(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        prompt = request.data.get("prompt")
        user_id = request.data.get("user_id")
        style = request.data.get("style")
        shape = request.data.get("shape")
        mask = request.FILES.get("mask")

        print("Hello")
        if not prompt:
            return Response({"error": "No prompt provided"}, status=400)

        if not user_id:
            return Response({"error": "No user ID provided"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        def query(payload):
            try:
                response = requests.post(API_URL, headers=headers, json=payload)
                response.raise_for_status()
                return response.content
            except requests.exceptions.RequestException as e:
                return None


        image_bytes = query({
            "inputs": f"{prompt} Make it {style}",
            "parameters": {
                "num_inference_steps": 25
            }
        })

        if image_bytes is None:
            return Response({"error": "Failed to fetch image from API"}, status=500)

        try:

            image = Image.open(BytesIO(image_bytes))
            width, height = image.size
            if shape == 'circular':

                mask = Image.new('L', (width, height), 0)
                draw = ImageDraw.Draw(mask)
                draw.ellipse((0, 0, width, height), fill=255)

                image.putalpha(mask)
            if shape == 'custom' and mask:
                mask_image = Image.open(mask)
                mask_image = mask_image.convert("L")
                mask_image = mask_image.resize((width, height))
                image.putalpha(mask_image)

            buffered = BytesIO()
            image.save(buffered, format="PNG")
            image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
            image_data_url = f"data:image/png;base64,{image_base64}"

            return Response({
                "image": image_data_url
            }, status=200)

        except Exception as e:
            return Response({"error": f"Failed to process image: {str(e)}"}, status=500)


class SaveGeneratedImage(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        image_base64 = request.data.get("image_base64")

        if not user_id:
            return Response({"error": "No user ID provided"}, status=400)

        if not image_base64:
            return Response({"error": "No image provided"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        try:

            image_data = base64.b64decode(image_base64.split(',')[1])
            image = Image.open(BytesIO(image_data))


            unique_filename = f"{uuid.uuid4().hex}.png"
            image_path = os.path.join(settings.MEDIA_ROOT, 'user_images', unique_filename)
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            image.save(image_path, format="PNG")


            new_image = ImageModel.objects.create(
                user=user,
                image=unique_filename,
                caption=f"Generated image for {user.username}",
            )

            return Response({
                "image_url": f"/media/user_images/{unique_filename}",
                "image_id": new_image.id
            }, status=200)

        except Exception as e:
            return Response({"error": f"Failed to save image: {str(e)}"}, status=500)
class GetUserByName(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        name = request.query_params.get('username')

        if name:
            users = User.objects.filter(username__icontains=name)
        else:
            return Response({"error: No user was found"})

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
class GetPhotosOfUser(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = request.query_params.get('user_id')

        if user_id:
            pictures = ImageModel.objects.filter(user_id=user_id)
        else:
            return Response({"error": "No user"})
        serializer = PhotoSerializer(pictures, many=True)
        data = serializer.data
        for picture in data:
            picture['image'] = picture['image'].split('/')[-1]
        return Response(data)