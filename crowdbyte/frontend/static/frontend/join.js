const roomId = document.getElementById('room-id');
const roomJoin = document.getElementById('room-join');

roomJoin.addEventListener('click', (event) => {
    window.location.replace('https://crowdbyte.herokuapp.com/room/' + roomId.value);
});