# Generated by Django 5.1.4 on 2024-12-08 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_remove_editedimage_image_mask'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageV2',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.ImageField(upload_to='')),
                ('rmbg_img', models.ImageField(blank=True, upload_to='images_rmbg')),
            ],
        ),
    ]
