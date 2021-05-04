from django.urls import path
from . import views

urlpatterns = [
    path('room/<str:room_id>', views.room, name='room'),
    path('host/<str:room_id>', views.host, name='host'),
]