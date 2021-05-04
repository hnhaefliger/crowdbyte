const prompt = document.getElementById('prompt');
const game = document.getElementById('game');
const gameCanvas = game.getContext('2d');

const width = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
const height = document.getElementsByTagName('body')[0].getBoundingClientRect().height;
const centerX = width / 2;
const centerY = height / 2 + 50;

gameCanvas.canvas.width  = width;
gameCanvas.canvas.height = height;

var state = {'option1': 'abcd', 'option2': 'efgh', 'option3': 'ijkl', 'option4': 'nopq', 'option5': 'rstu', 'option6': 'vwxy', 'vote': { 'x': 0, 'y': 0, 'm': 0.1, 'mu': 1, 'charge': 500000, 'v': { 'x': 0, 'y': 0, }, }, 'player': { 'x': 100, 'y': 100, }, }

const roomId = JSON.parse(document.getElementById('room-id').textContent);

const socket = new WebSocket('ws://' + window.location.host + '/ws/room/' + roomId + '/');

socket.onmessage = (message) => {
  state = JSON.parse(message.data);
  drawGame(gameCanvas, state);
}

gameCanvas.canvas.addEventListener("mousemove", (event) => {
  var cRect = gameCanvas.canvas.getBoundingClientRect();
  var canvasX = Math.round(event.clientX - cRect.left) - centerX;
  var canvasY = Math.round(event.clientY - cRect.top) - centerY;

  var dx = canvasX - state.vote.x
  var dy = canvasY - state.vote.y
  var d = Math.sqrt(dx**2 + dy**2);

  if (d < 55) {
    canvasX = state.vote.x + dx / d * 55;
    canvasY = state.vote.y + dy / d * 55;
  }

  state.player = {
      'x': canvasX,
      'y': canvasY,
  };

  socket.send(JSON.stringify(state.player));
  drawGame(gameCanvas, state);
});

drawGame(gameCanvas, state);