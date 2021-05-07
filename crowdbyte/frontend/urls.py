from django.urls import path
from . import views

urlpatterns = [
    path('room', views.join, name='join'),
    path('room/<str:room_id>', views.room, name='room'),
    path('host', views.start, name='start'),
    path('host/<str:room_id>', views.host, name='host'),
]