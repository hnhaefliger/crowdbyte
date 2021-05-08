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

const drawDot = (canvas, x, y, r, color, width=10) => {
  canvas.lineWidth = width;
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.ellipse(x, y, r, r, 0, 0, 2*Math.PI);
  canvas.stroke();
}

const drawText = (canvas, x, y, text, font, color) => {
  canvas.fillStyle = color;
  canvas.font = font;
  canvas.fillText(text, x, y);
}

const drawLine = (canvas, x1, y1, x2, y2, color, width) => {
  canvas.lineWidth = width;
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.moveTo(x1, y1);
  canvas.lineTo(x2, y2);
  canvas.stroke();
}

const drawRect = (canvas, x1, y1, x2, y2, color) => {
  canvas.fillStyle = color;
  canvas.fillRect(x1, y1, x2, y2);
}

const drawGame = (canvas, state) => {
  prompt.innerHTML = state.prompt;

  // reset
  canvas.clearRect(0, 0, canvas.width, canvas.height);
  
  // background
  drawRect(canvas, 0, 0, game.width, game.height, '#252c4a')

  // lines between options
  drawLine(canvas, -200 + centerX + 10, 0 + centerY - 17, -100 + centerX - 10, -173 + centerY + 17, '#21486b', 5);
  drawLine(canvas, -100 + centerX + 20, -173 + centerY, 100 + centerX - 20, -173 + centerY, '#21486b', 5);
  drawLine(canvas, 100 + centerX + 10, -173 + centerY + 17, 200 + centerX - 10, 0 + centerY - 17, '#21486b', 5);
  drawLine(canvas, 200 + centerX - 10, 0 + centerY + 17, 100 + centerX + 10, 173 + centerY - 17, '#21486b', 5);
  drawLine(canvas, 100 + centerX - 20, 173 + centerY, -100 + centerX + 20, 173 + centerY, '#21486b', 5);
  drawLine(canvas, -100 + centerX - 10, 173 + centerY - 17, -200 + centerX + 10, 0 + centerY + 17, '#21486b', 5);

  // options
  drawDot(canvas, -200 + centerX, 0 + centerY, 20, '#1f7eeb', 5);
  drawDot(canvas, -100 + centerX, -173 + centerY, 20, '#1f7eeb', 5);
  drawDot(canvas, 100 + centerX, -173 + centerY, 20, '#1f7eeb', 5);
  drawDot(canvas, 200 + centerX, 0 + centerY, 20, '#1f7eeb', 5);
  drawDot(canvas, 100 + centerX, 173 + centerY, 20, '#1f7eeb', 5);
  drawDot(canvas, -100 + centerX, 173 + centerY, 20, '#1f7eeb', 5);

  // puck
  drawDot(canvas, state.vote.x + centerX, state.vote.y + centerY, 40, '#41935a', 10);

  // answers
  drawText(canvas, -200 + centerX - 60, 0 + centerY - 30, state.option1, '30px Montserrat', '#f3f4f6');
  drawText(canvas, -100 + centerX - 60, -173 + centerY - 30, state.option2, '30px Montserrat', '#f3f4f6');
  drawText(canvas, 100 + centerX - 60, -173 + centerY - 30, state.option3, '30px Montserrat', '#f3f4f6');
  drawText(canvas, 200 + centerX - 60, 0 + centerY - 30, state.option4, '30px Montserrat', '#f3f4f6');
  drawText(canvas, 100 + centerX - 60, 173 + centerY + 50, state.option5, '30px Montserrat', '#f3f4f6');
  drawText(canvas, -100 + centerX - 60, 173 + centerY + 50, state.option6, '30px Montserrat', '#f3f4f6');

  // player
  drawDot(canvas, state.player.x + centerX, state.player.y + centerY, 15, '41935a', 10);

  // boundary
  //drawDot(canvas, 0 + centerX, 0 + centerY, 340, '#ed4f77', 5);
}

const roomId = JSON.parse(document.getElementById('room-id').textContent);

const socket = new WebSocket('wss://' + window.location.host + '/ws/room/' + roomId + '/');

socket.onmessage = (message) => {
  state = JSON.parse(message.data);
  drawGame(gameCanvas, state);
}

socket.onclose = () => {
  window.location.replace('/room');
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
