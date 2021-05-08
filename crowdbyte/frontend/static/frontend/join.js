const roomId = document.getElementById('room-id');
const roomJoin = document.getElementById('room-join');

roomJoin.addEventListener('click', (event) => {
    window.location.replace('/room/' + roomId.value);
});