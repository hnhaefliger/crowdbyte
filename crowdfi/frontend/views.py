from django.shortcuts import render

def room(request, room_id):
    return render(request, 'frontend/room.html', {
        'room_id': room_id
    })

def host(request, room_id):
    return render(request, 'frontend/host.html', {
        'room_id': room_id
    })