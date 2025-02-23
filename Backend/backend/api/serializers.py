from urllib.parse import uses_relative

import cv2 as cv
import numpy as np
import urllib
from django.db.models import IntegerField
from rest_framework.response import Response

from .models import User, Image
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['email'] = user.email
        token['username'] = user.username

        return token
class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["image"]

