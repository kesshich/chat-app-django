from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListChats.as_view()),
    path('create/', views.CreateChat.as_view()),
    path('<int:id>/messages/', views.MessagesHandler.as_view())
]