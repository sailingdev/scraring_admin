from datetime import datetime

from django.contrib.auth.models import User, AbstractUser
from django.db import models


# Create your models here.

class RPassword(models.Model):
    email = models.CharField(max_length=255)
    token = models.CharField(max_length=255)
    date = models.DateTimeField(default=datetime.now())


class CustomUser(AbstractUser):
    pass
    photo = models.CharField(max_length=255)
    phonenumber = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    status = models.CharField(max_length=10, blank=True, null=True)


class MinedData(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.TextField(blank=True, null=True)
    price = models.CharField(max_length=100, blank=True, null=True)
    currency = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    phonenumber = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    time = models.DateTimeField(blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)
    view_number = models.CharField(max_length=255, blank=True, null=True)
    site = models.CharField(max_length=255, blank=True, null=True)
    image_folder = models.CharField(max_length=50, blank=True, null=True)
    product_id = models.CharField(max_length=50, blank=True, null=True)
    image_name = models.CharField(max_length=50, blank=True, null=True)
    posted_at = models.CharField(max_length=100, blank=True, null=True)
    month = models.CharField(max_length=50, blank=True, null=True)


class EmailSettings(models.Model):
    smtp_port = models.CharField(max_length=25, blank=True, null=True)
    smtp_host = models.CharField(max_length=25, blank=True, null=True)
    smtp_email = models.CharField(max_length=50, blank=True, null=True)
    smtp_password = models.CharField(max_length=50, blank=True, null=True)
    isEnabledSmtp = models.CharField(max_length=10, blank=True, null=True)
    isEnabledSmtpSSL = models.CharField(max_length=10, blank=True, null=True)


class TwilioAccountSettings(models.Model):
    twilio_account_sid = models.CharField(max_length=100, blank=True, null=True)
    twilio_auth_token = models.CharField(max_length=255, blank=True, null=True)
    twilio_sms_number = models.CharField(max_length=100, blank=True, null=True)


class FacebookAccountKitSettings(models.Model):
    fb_app_id = models.CharField(max_length=100, blank=True, null=True)
    fb_secret_id = models.CharField(max_length=255, blank=True, null=True)


class SiteList(models.Model):
    site_name = models.CharField(max_length=255, blank=True, null=True)
    site_url = models.CharField(max_length=255, blank=True, null=True)
    scraped_status = models.CharField(max_length=50, blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    directory_name = models.CharField(max_length=200, blank=True, null=True)
    cron_time = models.DateTimeField(blank=True, null=True)
    cron_status = models.CharField(max_length=50, blank=False, null=False, default="Stop", editable=False)
