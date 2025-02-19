"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView,UserList
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",views.index, name="index"),
    path("login/",views.index, name="login"),
    path("projects/", views.projects, name="project_details"),
    path("logout/", auth_views.logout_then_login, name="logout"),
    path("time_entries/", views.time_entry, name="time_entries"),
    path('api/user/create/', CreateUserView.as_view(), name='create_user'),
    path("api/token/", TokenObtainPairView.as_view(), name="get_auth_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="get_refresh_token"),
    path("api/users/", UserList.as_view(), name="user_list"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path('password_reset/', 
         auth_views.PasswordResetView.as_view(template_name='registration/password_reset_view.html'), 
         name='password_reset'),
    path("password_change/", auth_views.PasswordChangeView.as_view(
                                                                   success_url="/time_entries/"), name="password_change"),
    path("", include("django.contrib.auth.urls")),
]
