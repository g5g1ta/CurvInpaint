import os.path

import numpy as np
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import TextField, CASCADE
from rest_framework.fields import EmailField, CharField
from rest_framework_simplejwt.models import TokenUser
from io import BytesIO
import PIL
import cv2
import urllib

class User(AbstractUser):
    email = models.EmailField(unique=True)
    password = models.TextField()
    username = models.CharField(max_length=30)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [""]

class CustomTokenUser(TokenUser):
    def email(self):
        return self.token.email
    def username(self):
        return self.token.username
class Image(models.Model):
    user = models.ForeignKey(User, related_name='images', on_delete=CASCADE)
    image = models.ImageField(upload_to='user_images/')  # This will save the images in the 'media/user_images' folder
    caption = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Optionally, you can modify the image here, such as resizing or applying filters, before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image {self.id} for user {self.user.username}"
