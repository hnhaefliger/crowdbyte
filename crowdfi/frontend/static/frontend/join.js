const roomId = document.getElementById('room-id');
const roomJoin = document.getElementById('room-join');

roomJoin.addEventListener('click', (event) => {
    window.location.replace('http://192.168.1.124:8000/room/' + roomId.value);
});