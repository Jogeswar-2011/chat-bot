"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
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
from django.urls import path
from projectapp import views as project_views
from chatbot import views as chatbot_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("villages/", project_views.village_list, name="village-list"),
    path("villages/<int:pk>/", project_views.village_detail, name="village-detail"),
    path("chat/", chatbot_views.chat_view, name="chat-view"),
    path("maps/search/", chatbot_views.maps_search_view, name="maps-search-view"),
]
