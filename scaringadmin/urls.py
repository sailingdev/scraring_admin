from django.conf.urls.static import static
from django.urls import path

from Scaring import settings
from scaringadmin import views

urlpatterns = [
    path('signin', views.sign_in, name='sign_in'),
    path('signup', views.sign_up, name='sign_up'),
    path('signout', views.sign_out, name='sign_out'),
    path('forgetpassword', views.forgetpassword, name='forgetpassword'),
    path('password-reset/<str:token>', views.admin_password_reset, name='admin_password_reset'),
    path('password-save/', views.admin_password_reset_post, name='admin_password_reset_post'),
    path('phonenumberverify', views.phonenumberverify, name='phonenumberverify'),

    path('sendEmailApi', views.sendEmailApi, name='sendEmailApi'),
    path('imageDownloadApi', views.imageDownloadApi, name='imageDownloadApi'),

    path('success', views.success_page, name='success'),
    path('accountKit', views.accountKit, name='accountKit'),

    # -------------------- ADMIN DASHBOARD -----------------------
    path('', views.index, name='admin_index'),
    path('users', views.userList, name='users'),
    path('sites', views.sites, name='sites'),
    path('data', views.data, name='data'),
    path('addUser', views.addUser, name='addUser'),
    path('editUser', views.editUser, name='editUser'),
    path('getUser', views.getUser, name='getUser'),
    path('deleteUser', views.deleteUser, name='deleteUser'),
    path('getMinedData', views.getMinedData, name='getMinedData'),
    path('blockUser', views.blockUser, name='blockUser'),
    path('scarpingSettings', views.scarpingSettings, name='scarpingSettings'),
    path('apiSettings', views.apiSettings, name='apiSettings'),
    path('emailSettings', views.emailSettings, name='emailSettings'),
    path('smsSettings', views.smsSettings, name='smsSettings'),
    path('scraperSettings', views.scraperSettings, name='scraperSettings'),
    path('addSite', views.addSite, name='addSite'),
    path('getSite', views.getSite, name='getSite'),
    path('editSite', views.editSite, name='editSite'),
    path('deleteSite', views.deleteSite, name='deleteSite'),
    path('updateCronJobStatus', views.updateCronJobStatus, name='updateCronJobStatus'),
    path('update_email_setting', views.update_email_setting, name='update_email_setting'),
    path('updateTwilio', views.updateTwilio, name='updateTwilio'),
    path('getEveyMonthData', views.getEveyMonthData, name='updateTwilio'),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
