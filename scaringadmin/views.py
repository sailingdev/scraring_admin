import json
import os
import random
import string
from datetime import datetime, timedelta

from urllib.request import urlopen

import requests
from accountkitlogin.views import login_status
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core import serializers
from django.core.files.storage import FileSystemStorage
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q, Count
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.conf import settings as conf_settings

# Create your views here.

# ===================================== ADMIN USERS SIGN IN PAGE =========================================
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client

from Scaring import settings
from scaringadmin.models import RPassword, CustomUser, MinedData, SiteList, EmailSettings, TwilioAccountSettings


def sign_in(request):
    if request.method == "GET":
        return render(request, 'auth/login.html')

    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = CustomUser.objects.filter(username=email)
        if not user:
            messages.add_message(request, messages.ERROR, 'No Registered!')
            return redirect('/signin')
        else:
            request.session["password"] = password
            request.session["email"] = email
            return HttpResponseRedirect('/phonenumberverify')


# ===================================== FORGET PASSWORD RANDOM TOKEN GENERATE ============================
def random_string(str_length=15):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(str_length))


# =================================== ADMIN FORGET PASSWORD PAGE =========================================
def forgetpassword(request):
    if request.method == "GET":
        return render(request, 'auth/forgetpassword.html')

    if request.method == "POST":
        email = request.POST.get('email')
        user = CustomUser.objects.filter(email=email)
        if user:
            user = user[0]
            token = random_string()
            RPassword.objects.filter(email=email).delete()
            reset = RPassword(
                email=email,
                token=token
            )
            reset.save()

            subject = 'Reset Password'
            message = ' You need to reset your password.'
            email_from = conf_settings.EMAIL_HOST_USER
            recipient_list = [email, ]

            message = EmailMultiAlternatives(subject, message, email_from, recipient_list)
            html_template = get_template("email/forget_password_email.html").render({
                'username': user.first_name, 'token': token})
            message.attach_alternative(html_template, "text/html")
            message.send()

            return render(request, 'auth/forgetpassword.html', {'success': 'Email Sent!'})
        else:
            return render(request, 'auth/forgetpassword.html', {'error': 'Email does not exist!'})


# =================================== Send Email API ==========================================
@csrf_exempt
def sendEmailApi(request):
    email = request.POST.get("to")
    subject = 'Scraping is ended'
    message = request.POST["message"]
    email_from = conf_settings.EMAIL_HOST_USER
    recipient_list = [email, ]
    try:
        message = EmailMultiAlternatives(subject, message, email_from, recipient_list)
        # html_template = get_template("email/forget_password_email.html").render({
        #     'username': "yy", 'token': "dd"})
        # message.attach_alternative(html_template, "text/html")
        message.send()
        error_message = ""
        error_code = 0
    except Exception as e:
        error_code = 403
        error_message = e

    response = {
        'error_message': error_message,
        'error_code': error_code,
    }
    return HttpResponse(json.dumps(response), content_type='application/json')


# =================================== Image download api ================================================
@csrf_exempt
def imageDownloadApi(request):
    image_url = request.POST['image_url']
    image_name = request.POST['image_name']
    image_folder = request.POST['image_folder']
    try:
        with open('media/scraped_imgs/' + image_folder + '/' + image_name, 'wb') as handle:
            response = requests.get(image_url, stream=True)

            if not response.ok:
                print(response)

            for block in response.iter_content(1024):
                if not block:
                    break

                handle.write(block)

        error_message = ""
        error_code = 0
    except Exception as e:
        error_message = e
        error_code = 403

    response = {
        'error_message': error_message,
        'error_code': error_code,
    }
    return HttpResponse(json.dumps(response), content_type='application/json')


# =================================== ADMIN RESET PASSWORD PAGE ==========================================
def admin_password_reset(request, token):
    check_token = RPassword.objects.filter(token=token)
    if check_token:
        email = check_token[0].email
        user = CustomUser.objects.filter(email=email)
        user = user[0]
        return render(request, 'auth/resetpassword.html', {'user': user, 'status': True})
    else:
        return render(request, 'auth/resetpassword.html', {'invalid': True})


# =================================== ADMIN RESET PASSWORD PAGE ==========================================
def admin_password_reset_post(request):
    if request.method == "POST":
        user_id = request.POST.get('id')
        password = request.POST.get('password')
        cpassword = request.POST.get('password1')

        if len(password) < 6:
            return render(request, 'auth/resetpassword.html', {'error': 'Password should be over 6 characters.'})

        if password != cpassword:
            return render(request, 'auth/resetpassword.html', {'error': 'Password does not match.'})

        password = make_password(password)
        user = CustomUser.objects.get(pk=user_id)
        user.password = password
        user.save()

        RPassword.objects.filter(email=user.email).delete()
        return redirect('/signin')


# =================================== phonenumber verify ==========================================
def phonenumberverify(request):
    if request.method == "GET":
        email = request.session["email"]
        verifycode = random_number(6)

        user = CustomUser.objects.get(username=email)
        phonenumber = user.phonenumber

        print(phonenumber)

        try:
            to = phonenumber
            twilio = TwilioAccountSettings.objects.get(id=1)
            twilio_sid = twilio.twilio_account_sid
            auth_token = twilio.twilio_auth_token
            sms_number = twilio.twilio_sms_number

            client = Client(twilio_sid, auth_token)
            response = client.messages.create(
                body=verifycode,
                to=to, from_=sms_number)
            messages.add_message(request, messages.SUCCESS, 'successfully sent.')
        except Exception as e:
            messages.add_message(request, messages.ERROR, e)
        return render(request, 'auth/phonenumberverify.html',
                      {"verifycode": verifycode})

    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(username=email, password=password)
        if user is not None:
            if user.status == "0":
                return render(request, 'auth/login.html', {'error': 'You are blocked!'})
            login(request, user)
            return HttpResponseRedirect('/')
        else:
            return render(request, 'auth/login.html', {'error': 'User info does not match!'})


# =================================== generate verify code ==========================================
def random_number(length=6):
    """
    Create a random integer with given length.
    For a length of 3 it will be between 100 and 999.
    For a length of 4 it will be between 1000 and 9999.
    """
    return random.randint(10 ** (length - 1), (10 ** (length) - 1))


# =================================== phonenumber verify ==========================================
def sign_up(request):
    if request.method == "GET":
        return render(request, 'auth/register.html')

    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get('email')
        password = request.POST.get('password')
        cpassword = request.POST.get('password1')
        phonenumber = request.POST.get("phonenumber")
        address = request.POST.get("address")

        email_qs = CustomUser.objects.filter(username=email)
        if email_qs.exists():
            return render(request, 'auth/register.html', {'error': 'Email already exist.'})

        if len(password) < 6:
            return render(request, 'auth/register.html', {'error': 'Password should be over 6 characters.'})

        if password != cpassword:
            return render(request, 'auth/register.html', {'error': 'Password does not match.'})

        password = make_password(password)

        user = CustomUser(
            first_name=username,
            username=email,
            email=email,
            password=password,
            phonenumber=phonenumber,
            address=address
        )
        user.save()

        user = authenticate(username=email, password=cpassword)

        login(request, user)

        return HttpResponseRedirect('/')


def addUser(request):
    if request.method == "GET":
        return render(request, 'auth/register.html')

    if request.method == "POST":
        username = request.POST.get("full_name")
        email = request.POST.get('email')
        password = request.POST.get('password')
        phonenumber = request.POST.get("phonenumber")
        address = request.POST.get("address")
        photo = ''

        if request.FILES.get("photo"):
            photo = request.FILES.get("photo")
            fs = FileSystemStorage()
            time = datetime.now().strftime('%Y%m%d%H%M%S')
            filename1 = time + photo.name
            filename_url = fs.save('img/users/' + filename1, photo)
            uploaded_file_url = fs.url(filename_url)
            photo = filename1

        email_qs = CustomUser.objects.filter(username=email)
        if email_qs.exists():
            return render(request, 'auth/register.html', {'error': 'Email already exist.'})

        if len(password) < 6:
            return render(request, 'auth/register.html', {'error': 'Password should be over 6 characters.'})

        password = make_password(password)

        try:
            user = CustomUser(
                first_name=username,
                username=email,
                email=email,
                password=password,
                phonenumber=phonenumber,
                address=address,
                photo=photo
            )

            user.save()
            messages.add_message(request, messages.SUCCESS, 'successfully saved.')
        except Exception as e:
            messages.add_message(request, messages.ERROR, e)
        return HttpResponseRedirect('/users')


# ===================================== ADMIN USER EDIT ================================================
def editUser(request):
    userid = request.POST.get("userid")
    username = request.POST.get("full_name")
    email = request.POST.get('email')
    password = request.POST.get('password')
    phonenumber = request.POST.get("phonenumber")
    address = request.POST.get("address")
    photo = ''

    if len(password) < 6:
        messages.add_message(request, messages.ERROR, 'Password should be over 6 characters.')
        return HttpResponseRedirect('/users')

    password = make_password(password)

    if request.FILES.get("photo"):
        photo = request.FILES.get("photo")
        fs = FileSystemStorage()
        time = datetime.now().strftime('%Y%m%d%H%M%S')
        filename1 = time + photo.name
        filename_url = fs.save('img/users/' + filename1, photo)
        uploaded_file_url = fs.url(filename_url)
        photo = filename1

    try:
        user = CustomUser.objects.get(pk=userid)
        user.first_name = username
        user.username = email
        user.email = email
        user.password = password
        user.phonenumber = phonenumber
        user.address = address
        if photo != '':
            user.photo = photo
        user.save()
        messages.add_message(request, messages.SUCCESS, 'successfully edited.')
    except Exception as e:
        messages.add_message(request, messages.ERROR, e)

    return HttpResponseRedirect('/users')


def deleteUser(request):
    userid = request.POST.get("userid")

    try:
        user = CustomUser.objects.get(pk=int(userid))
        user.delete()
        messages.add_message(request, messages.SUCCESS, 'successfully deleted.')
    except Exception as e:
        messages.add_message(request, messages.ERROR, e)

    return HttpResponseRedirect('/users')


# ===================================== Block User ================================================
def blockUser(request):
    userid = request.POST.get("block_userid")
    print(userid)
    try:
        user = CustomUser.objects.get(pk=int(userid))
        user.status = "0"
        user.save()
        messages.add_message(request, messages.SUCCESS, 'successfully blocked.')
    except Exception as e:
        messages.add_message(request, messages.ERROR, e)

    return HttpResponseRedirect('/users')


# ===================================== ADMIN USER GET ================================================
def getUser(request):
    userid = request.GET.get('userid')
    user = CustomUser.objects.get(id=userid)

    response = {
        'first_name': user.first_name,
        'username': user.email,
        'password': user.password,
        'phonenumber': user.phonenumber,
        'address': user.address,
        'photo': user.photo
    }

    return HttpResponse(json.dumps(response), content_type='application/json')


# ===================================== ADMIN USER LOGOUT ================================================
@login_required(login_url='/signin')
def sign_out(request):
    logout(request)
    return HttpResponseRedirect('/signin')


# ===================================== ADMIN DASHBOARD PAGE =============================================
@login_required(login_url='/signin')
def index(request):
    user_count = CustomUser.objects.all().count()

    return render(request, 'dashboard/index.html',
                  # {
                  #     'everyMonthDataNumbers': mindedDatas,
                  #     'eight': eight
                  #  }
                  )


def getEveyMonthData(request):
    this_year = datetime.now().year
    print(this_year)

    one = MinedData.objects.filter(time__year=this_year).filter(month='1').count()
    two = MinedData.objects.filter(time__year=this_year).filter(month='2').count()
    three = MinedData.objects.filter(time__year=this_year).filter(month='3').count()
    four = MinedData.objects.filter(time__year=this_year).filter(month='4').count()
    five = MinedData.objects.filter(time__year=this_year).filter(month='5').count()
    six = MinedData.objects.filter(time__year=this_year).filter(month='6').count()
    seven = MinedData.objects.filter(time__year=this_year).filter(month='7').count()
    eight = MinedData.objects.filter(time__year=this_year).filter(month='8').count()
    nine = MinedData.objects.filter(time__year=this_year).filter(month='9').count()
    ten = MinedData.objects.filter(time__year=this_year).filter(month='10').count()
    eleven = MinedData.objects.filter(time__year=this_year).filter(month='11').count()
    twelve = MinedData.objects.filter(time__year=this_year).filter(month='12').count()

    mindedDatas = [
        one,
        two,
        three,
        four,
        five,
        six,
        seven,
        eight,
        nine,
        ten,
        eleven,
        twelve
    ]

    return HttpResponse(json.dumps(mindedDatas), content_type='application/json')


# @login_required(login_url='/signin')
def userList(request):
    users = CustomUser.objects.all()
    return render(request, 'dashboard/users/users.html', {'users': users})


@login_required(login_url='/signin')
def sites(request):
    sites = SiteList.objects.all()
    return render(request, 'dashboard/sites/sites.html', {"sites": sites})


@login_required(login_url='/signin')
def data(request):
    return render(request, 'dashboard/data/data.html')


def getMinedData(request):
    columns = ["id", "title", "description", "image", "price", "currency", "location", "category", "username",
               "phonenumber", "posted_at", "email"]
    totalData = MinedData.objects.count()
    totalFieltered = totalData

    limit = int(request.POST.get("length"))
    start = int(request.POST.get("start"))
    order = columns[int(request.POST.get("order[0][column]"))]
    dir = request.POST['order[0][dir]']
    dirr = ""
    if dir == "asc":
        dirr = ""
    else:
        dirr = "-"

    print(limit)

    if request.POST["search[value]"] == "":
        datas = MinedData.objects.order_by(dirr + order).all()[start:start + limit]
    else:
        search = request.POST["search[value]"]
        datas = MinedData.objects.filter(title__contains=search).filter(~Q(description=search)).order_by(
            dirr + order).all()[start:start + limit]
        totalFieltered = MinedData.objects.filter(title__contains=search).filter(~Q(description=search)).count()

    result = []
    if datas:
        for item in datas:
            nestedData = {
                'title': item.title,
                'description': item.description,
                'image': item.image,
                'price': item.price,
                'currency': item.currency,
                'location': item.location,
                'category': item.category,
                'username': item.username,
                'phonenumber': item.phonenumber,
                'email': item.email,
                'posted_at': item.posted_at
            }
            result.append(nestedData)

    response = {
        'draw': int(request.POST['draw']),
        'recordsTotal': int(totalData),
        'recordsFiltered': int(totalFieltered),
        'data': result,
    }
    return HttpResponse(json.dumps(response), content_type='application/json')


@login_required(login_url='/signin')
def scarpingSettings(request):
    return render(request, 'dashboard/settings/scarpingsettings.html')


@login_required(login_url='/signin')
def apiSettings(request):
    return render(request, 'dashboard/settings/apiSettings.html')


@login_required(login_url='/signin')
def scraperSettings(request):
    return render(request, 'dashboard/settings/scarpingsettings.html')


@login_required(login_url='/signin')
def emailSettings(request):
    setting_email = EmailSettings.objects.first()
    print(setting_email.smtp_port)
    return render(request, 'dashboard/settings/emailSettings.html', {"setting_email": setting_email})


def addSite(request):
    site_name = request.POST["site_name"]
    site_url = request.POST["site_url"]
    directory_name = request.POST["directory_name"]
    cron_time = request.POST["cron_time"]

    directory = "media/scraped_imgs/" + directory_name

    if not os.path.exists(directory):
        os.mkdir(directory)
        messages.add_message(request, messages.SUCCESS, directory_name + 'is created.')
    else:
        messages.add_message(request, messages.ERROR, directory_name + ' already exists.')
        return HttpResponseRedirect('/sites')

    siteList = SiteList(
        site_name=site_name,
        site_url=site_url,
        directory_name=directory_name,
        cron_time=cron_time
    )
    siteList.save()
    return HttpResponseRedirect('/sites')


def getSite(request):
    site_id = request.GET.get('siteid')
    site = SiteList.objects.get(id=site_id)

    response = {
        'site_name': site.site_name,
        'site_url': site.site_url,
        'directory_name': site.directory_name,
    }

    return HttpResponse(json.dumps(response), content_type='application/json')


# ===================================== Site EDIT ================================================
def editSite(request):
    site_id = request.POST['siteid']
    site_name = request.POST.get("site_name")
    site_url = request.POST.get("site_url")
    directory_name = request.POST["directory_name"]
    cron_time = request.POST["cron_time"]

    try:
        directory = "media/scraped_imgs/" + directory_name
        if not os.path.exists(directory):
            os.mkdir(directory)

        site = SiteList.objects.get(pk=site_id)
        site.site_name = site_name
        site.site_url = site_url
        site.directory_name = directory_name
        site.cron_time = cron_time
        site.save()
        messages.add_message(request, messages.SUCCESS, 'successfully edited.')
    except Exception as e:
        messages.add_message(request, messages.ERROR, e)

    return HttpResponseRedirect('/sites')


# =====================================  UpdateCronJobStatus ================================================
def updateCronJobStatus(request):
    site_id = request.POST['siteid']
    cron_status = request.POST["cron_status"]

    try:
        site = SiteList.objects.get(pk=site_id)
        site.cron_status = cron_status
        site.save()
        messages.add_message(request, messages.SUCCESS, 'successfully updated.')
    except Exception as e:
        messages.add_message(request, messages.ERROR, e)

    return HttpResponseRedirect('/sites')


# ===================================== Site Delete ================================================
def deleteSite(request):
    site_id = request.POST.get("siteid")

    try:
        user = SiteList.objects.get(pk=int(site_id))
        directory_name = user.directory_name
        directory = "media/scraped_imgs/" + directory_name
        # if os.path.exists(directory):
        #     os.removedirs(directory)

        user.delete()
        messages.add_message(request, messages.SUCCESS, 'successfully deleted.')
    except Exception as e:
        messages.add_message(request, messages.ERROR, e)

    return HttpResponseRedirect('/sites')


# ===================================== Email Setting ================================================
def update_email_setting(request):
    smtp_port = request.POST["smtp_port"]
    smtp_host = request.POST["smtp_host"]
    smtp_email = request.POST["smtp_email"]
    smtp_password = request.POST["smtp_password"]
    smtp_id = request.POST["smtp_id"]
    emailSetting = EmailSettings.objects.get(id=smtp_id)
    emailSetting.smtp_port = smtp_port
    emailSetting.smtp_host = smtp_host
    emailSetting.smtp_email = smtp_email
    emailSetting.smtp_password = smtp_password
    emailSetting.save()
    return HttpResponseRedirect('/emailSettings')


# ===================================== SMS Settings ================================================
@login_required(login_url='/signin')
def smsSettings(request):
    twilio = TwilioAccountSettings.objects.first()
    return render(request, 'dashboard/settings/smsSettings.html', {"twilio": twilio})


def updateTwilio(request):
    sid = request.POST["twilio_sid"]
    auth_token = request.POST["twilio_auth_token"]
    sms_number = request.POST["twilio_sms_number"]
    id = request.POST["id"]
    twilio = TwilioAccountSettings.objects.get(id=id)
    twilio.twilio_account_sid = sid
    twilio.twilio_auth_token = auth_token
    twilio.twilio_sms_number = sms_number
    twilio.save()
    return HttpResponseRedirect("/smsSettings")


@csrf_exempt
def success_page(request):
    context = login_status(request)

def accountKit(request):
    return render(request, 'auth/accountKit.html')
