from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<room_id>\w+)/$', consumers.ClientConsumer.as_asgi()),
    re_path(r'ws/host/(?P<room_id>\w+)/$', consumers.HostConsumer.as_asgi()),
]