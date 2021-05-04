import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings
from uuid import uuid4

def format_state_for_player(state, playerid):
    return {
        'option1': state['option1'],
        'option2': state['option2'],
        'option3': state['option3'],
        'option4': state['option4'],
        'option5': state['option5'],
        'option6': state['option6'],
        'vote': state['vote'],
        'player': state['players'][playerid],
    }

class ClientConsumer(WebsocketConsumer):
    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        
        if self.room_id in settings.GAME_STATES:
            self.room_group_name = 'game_%s' % self.room_id

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.uid = uuid4().hex

            settings.GAME_STATES[self.room_id]['players'][self.uid] = {
                'x': 1000,
                'y': 1000,
            }

            self.accept()

            self.send(text_data=json.dumps({
                format_state_for_player(settings.GAME_STATES[self.room_id], self.uid)
            }))

        else:
            self.close()

    def disconnect(self, close_code):
        try:
            del settings.GAME_STATES[self.room_id]['players'][self.uid]

        except:
            pass

    def receive(self, data):
        data = json.loads(data)
        
        settings.GAME_STATES[self.room_id]['players'][self.uid] = {
            'x': data['x'],
            'y': data['y'],
        }

    def chat_message(self, data):
        pass

class HostConsumer(WebsocketConsumer):
    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        
        self.room_group_name = 'game_%s' % self.room_id

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.uid = uuid4().hex

        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, data):
        data = json.loads(data)
        
        if data['type'] == 'setup':
            settings.GAME_STATES[self.room_id] = {
                'option1': '',
                'option2': '',
                'option3': '',
                'option4': '',
                'option5': '',
                'option6': '',
                'vote': {
                    'x': 0,
                    'y': 0,
                    'm': 0.1,
                    'mu': 1,
                    'charge': 500000,
                    'v': {
                        'x': 0,
                        'y': 0,
                    },
                },
                'players': {},
            }

            self.send(text_data=json.dumps({
                settings.GAME_STATES[self.room_id]
            }))

        elif data['type'] == 'start':
            pass

    def chat_message(self, data):
        pass