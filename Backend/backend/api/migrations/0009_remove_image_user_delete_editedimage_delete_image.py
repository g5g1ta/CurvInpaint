# Generated by Django 5.1.4 on 2025-01-19 13:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_delete_imagev2_delete_imagev3_editedimage_image_mask'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='user',
        ),
        migrations.DeleteModel(
            name='EditedImage',
        ),
        migrations.DeleteModel(
            name='Image',
        ),
    ]
