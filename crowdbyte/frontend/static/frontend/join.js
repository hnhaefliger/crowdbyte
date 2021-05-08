const roomId = document.getElementById('room-id');
const roomJoin = document.getElementById('room-join');

roomJoin.addEventListener('click', (event) => {
    window.location.replace('/room/' + roomId.value);
});

document.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    roomJoin.click();
  }
});