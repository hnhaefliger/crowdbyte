from django.shortcuts import render
from django.http import HttpResponse

def start(request):
    return render(request, 'frontend/start.html')

def join(request):
    return render(request, 'frontend/join.html')

def room(request, room_id):
    return render(request, 'frontend/room.html', {
        'room_id': room_id
    })

def host(request, room_id):
    return render(request, 'frontend/host.html', {
        'room_id': room_id
    })

def cert(request):
    return HttpResponse('bPBXnTTIHP-0dTFV52yTu1KtUfZ1nBtg-Lp5uMkY-0M.gDZ5atBUq--CVc08u9jv_1_j8_bRh62ypuVIS1XgapU')