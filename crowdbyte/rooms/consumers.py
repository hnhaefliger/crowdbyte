import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings
from uuid import uuid4
import math
import threading
import time

def game_simulation(state, dt):
    fdx, fdy = 0, 0

    for player in state['players']:
        dx = state['players'][player]['x'] - state['vote']['x']
        dy = state['players'][player]['y'] - state['vote']['y']
        d = math.sqrt(dx**2 + dy**2)

        if d < 55:
            state['players'][player]['x'] = state['vote']['x'] + dx / d * 55
            state['players'][player]['y'] = state['vote']['y'] + dy / d * 55

        f = state['vote']['charge'] / d**2
        fdx += dx / d * f
        fdy += dy / d * f

    f = math.sqrt(fdx**2 + fdy**2)
    drag = 9.81 * state['vote']['m'] * state['vote']['mu']

    fdx -= fdx / f * drag
    fdy -= fdy / f * drag

    state['vote']['v']['x'] += fdx / state['vote']['m'] * dt
    state['vote']['v']['y'] += fdy / state['vote']['m'] * dt

    state['vote']['x'] += state['vote']['v']['x'] * dt
    state['vote']['y'] += state['vote']['v']['y'] * dt

    d = math.sqrt(state['vote']['x']**2 + state['vote']['y']**2)

    if d > 300:
        state['vote']['v']['x'] = 0
        state['vote']['v']['y'] = 0
        state['vote']['x'] = state['vote']['x'] / d * 300
        state['vote']['y'] = state['vote']['y'] / d * 300

    return state

def check_winner(state):
  for position in settings.POSITIONS:
    dx = position[0] - state['vote']['x']
    dy = position[1] - state['vote']['y']
    d = math.sqrt(dx**2 + dy**2)

    if d < 10:
      return True

  return False

def update_game(game_id):
    settings.GAME_STATES[game_id] = game_simulation(settings.GAME_STATES[game_id], 1/20)
        
    if check_winner(settings.GAME_STATES[game_id]):
        settings.GAME_HOSTS[game_id].close()

        return True

    else:
        for socket in settings.GAME_PLAYERS[game_id]:
            socket.send(json.dumps(format_state_for_player(settings.GAME_STATES[game_id], socket.uid)))

        settings.GAME_HOSTS[game_id].send(json.dumps(settings.GAME_STATES[game_id]))

        return False

def game_loop(game_id):
    seconds = 60
    fps = 20

    def wrapper():
        return update_game(game_id)
    
    set_interval(1/fps, wrapper, seconds*fps)
    
def set_interval(t, function, i):
    if i > 0:
        def wrapper():
            thread = set_interval(t, function, i-1)
            if function():
                thread.cancel()
    
        timer = threading.Timer(t, wrapper)
        timer.start()
        
        return timer

def format_state_for_player(state, playerid):
    return {
        'prompt': state['prompt'],
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

            settings.GAME_PLAYERS[self.room_id].append(self)
            settings.GAME_HOSTS[self.room_id].send(json.dumps(settings.GAME_STATES[self.room_id]))
            self.send(json.dumps(format_state_for_player(settings.GAME_STATES[self.room_id], self.uid)))

        else:
            self.close()

    def disconnect(self, close_code):
        try:
            del settings.GAME_STATES[self.room_id]['players'][self.uid]
            settings.GAME_PLAYERS[self.room_id].remove(self)
            settings.GAME_HOSTS[self.room_id].send(json.dumps(settings.GAME_STATES[self.room_id]))

        except:
            pass

    def receive(self, text_data=''):
        data = json.loads(text_data)
        
        try:
            settings.GAME_STATES[self.room_id]['players'][self.uid] = {
                'x': data['x'],
                'y': data['y'],
            }

            settings.GAME_HOSTS[self.room_id].send(json.dumps(settings.GAME_STATES[self.room_id]))

        except:
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
        for socket in settings.GAME_PLAYERS[self.room_id]:
            socket.close()

        del settings.GAME_PLAYERS[self.room_id], settings.GAME_HOSTS[self.room_id], settings.GAME_STATES[self.room_id]

    def receive(self, text_data=''):
        data = json.loads(text_data)
        
        if data['type'] == 'setup':
            settings.GAME_STATES[self.room_id] = {
                'prompt': data['prompt'],
                'option1': data['option1'],
                'option2': data['option2'],
                'option3': data['option3'],
                'option4': data['option4'],
                'option5': data['option5'],
                'option6': data['option6'],
                'vote': {
                    'x': 0,
                    'y': 0,
                    'm': data['m'],
                    'mu': data['mu'],
                    'charge': data['charge'],
                    'v': {
                        'x': 0,
                        'y': 0,
                    },
                },
                'players': {},
            }
            
            settings.GAME_HOSTS[self.room_id] = self
            settings.GAME_PLAYERS[self.room_id] = []

            self.send(json.dumps(settings.GAME_STATES[self.room_id]))

        elif data['type'] == 'start':
            threading.Thread(target=game_loop, args=(self.room_id,), daemon=False).start()
