const participants = document.getElementById('participants');
const prompt = document.getElementById('prompt');
const gameid = document.getElementById('roomid');
const start = document.getElementById('startbtn');
const gameCanvas = game.getContext('2d');

const width = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
const height = document.getElementsByTagName('body')[0].getBoundingClientRect().height;
const centerX = width / 2;
const centerY = height / 2 + 50;

gameCanvas.canvas.width  = width;
gameCanvas.canvas.height = height;

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

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
  participants.innerHTML = Object.keys(state.players).length + ' Players';
    
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

  // players
  Object.keys(state.players).forEach(player => {
    drawDot(canvas, state.players[player].x + centerX, state.players[player].y + centerY, 15, '#41935a', 10);
  });

  // boundary
  //drawDot(canvas, 0 + centerX, 0 + centerY, 340, '#ed4f77', 5);
}

const roomId = JSON.parse(document.getElementById('room-id').textContent);

const socket = new WebSocket('wss://' + window.location.host + '/ws/host/' + roomId + '/');

gameid.innerHTML = roomId;

socket.onopen = () => {
  socket.send(JSON.stringify({
    'type': 'setup',
    'prompt': findGetParameter('prompt'),
    'option1': findGetParameter('answer1'),
    'option2': findGetParameter('answer2'),
    'option3': findGetParameter('answer3'),
    'option4': findGetParameter('answer4'),
    'option5': findGetParameter('answer5'),
    'option6': findGetParameter('answer6'),
    'm': parseFloat(findGetParameter('m')),
    'mu': parseFloat(findGetParameter('mu')),
    'charge': parseFloat(findGetParameter('charge')),
  }));
};

socket.onmessage = (message) => {
  drawGame(gameCanvas, JSON.parse(message.data));
}

socket.onclose = () => {
  console.log('socket closed');
}

socket.onmessage = (error) => {
  console.log(error);
}

start.addEventListener('click', (event) => {
  socket.send(JSON.stringify({'type': 'start'}));
});
