const prompt = document.getElementById('prompt');
const game = document.getElementById('game');
const gameCanvas = game.getContext('2d');

const width = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
const height = document.getElementsByTagName('body')[0].getBoundingClientRect().height;
const centerX = width / 2;
const centerY = height / 2 + 50;

gameCanvas.canvas.width  = width;
gameCanvas.canvas.height = height;

var state = {'option1': 'abcd', 'option2': 'efgh', 'option3': 'ijkl', 'option4': 'nopq', 'option5': 'rstu', 'option6': 'vwxy', 'vote': { 'x': 0, 'y': 0, 'm': 0.1, 'mu': 1, 'charge': 500, 'v': { 'x': 0, 'y': 0, }, }, 'player': { 'x': 100, 'y': 100, }, }

const drawDot = (canvas, x, y, r, color) => {
  canvas.fillStyle = color;
  canvas.beginPath();
  canvas.ellipse(x, y, r, r, 0, 0, 2*Math.PI);
  canvas.fill();
}

const drawText = (canvas, x, y, text, color) => {
  canvas.fillStyle = color;
  canvas.fillText(text, x, y);
}

const drawGame = (canvas, state) => {
  canvas.font = "30px Montserrat";
  gameCanvas.fillStyle = '#f0ebcc';
  gameCanvas.fillRect(0, 0, game.width, game.height);

  drawDot(canvas, state.vote.x + centerX, state.vote.y + centerY, 40, '#344fa1');
  drawDot(canvas, -200 + centerX, 0 + centerY, 20, '#3f3697');
  drawDot(canvas, -100 + centerX, -173 + centerY, 20, '#3f3697');
  drawDot(canvas, 100 + centerX, -173 + centerY, 20, '#3f3697');
  drawDot(canvas, 200 + centerX, 0 + centerY, 20, '#3f3697');
  drawDot(canvas, 100 + centerX, 173 + centerY, 20, '#3f3697');
  drawDot(canvas, -100 + centerX, 173 + centerY, 20, '#3f3697');

  drawText(canvas, -200 + centerX - 60, 0 + centerY - 30, state.option1, '#3f3697');
  drawText(canvas, -100 + centerX - 60, -173 + centerY - 30, state.option2, '#3f3697');
  drawText(canvas, 100 + centerX - 60, -173 + centerY - 30, state.option3, '#3f3697');
  drawText(canvas, 200 + centerX - 60, 0 + centerY - 30, state.option4, '#3f3697');
  drawText(canvas, 100 + centerX - 60, 173 + centerY + 50, state.option5, '#3f3697');
  drawText(canvas, -100 + centerX - 60, 173 + centerY + 50, state.option6, '#3f3697');

  drawDot(canvas, state.player.x + centerX, state.player.y + centerY, 15, 'green');

  canvas.fillStyle = '#3f3697';
  canvas.beginPath();
  canvas.ellipse(0 + centerX, 0 + centerY, 340, 340, 0, 0, 2*Math.PI);
  canvas.stroke();
}

const roomId = JSON.parse(document.getElementById('room-id').textContent);

const socket = new WebSocket('ws://' + window.location.host + '/ws/room/' + roomId + '/');

socket.onmessage = (message) => {
  state = JSON.parse(message.data);
  drawGame(gameCanvas, state);
}

socket.onclose = () => {
  console.log('socket closed');
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