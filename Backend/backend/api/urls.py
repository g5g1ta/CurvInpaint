from django.contrib import admin
from django.urls import path, include

from api.views import CreateUserView

from api.views import CustomTokenObtainView
from rest_framework_simplejwt.views import TokenRefreshView

from api.views import GetUsersView

from django.conf.urls.static import static
from django.conf import settings


from api.views import InpaintImageView

from api.views import GenerateImageV3

from api.views import SaveGeneratedImage

from api.views import GetUserByName

from api.views import GetPhotosOfUser

urlpatterns = [
    path("register/", CreateUserView.as_view()),
    path("token/", CustomTokenObtainView.as_view()),
    path("token/refresh", TokenRefreshView.as_view()),
    path("inpaint/", InpaintImageView.as_view()),
    path("generateImageV3/", GenerateImageV3.as_view()),
    path("saveImage/", SaveGeneratedImage.as_view()),
    path("GetUserByName/", GetUserByName.as_view()),
    path("GetPhotosByUser/", GetPhotosOfUser.as_view())

]

