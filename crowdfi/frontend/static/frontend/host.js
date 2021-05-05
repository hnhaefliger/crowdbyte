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
  prompt.innerHTML = state.prompt;
  participants.innerHTML = Object.keys(state.players).length + ' Players';
  
  canvas.clearRect(0, 0, canvas.width, canvas.height);

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

  Object.keys(state.players).forEach(player => {
    drawDot(canvas, state.players[player].x + centerX, state.players[player].y + centerY, 15, 'green');
  });

  canvas.fillStyle = '#3f3697';
  canvas.beginPath();
  canvas.ellipse(0 + centerX, 0 + centerY, 340, 340, 0, 0, 2*Math.PI);
  canvas.stroke();
}

const roomId = JSON.parse(document.getElementById('room-id').textContent);

const socket = new WebSocket('ws://' + window.location.host + '/ws/host/' + roomId + '/');

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

start.addEventListener('click', (event) => {
  socket.send(JSON.stringify({'type': 'start'}));
});