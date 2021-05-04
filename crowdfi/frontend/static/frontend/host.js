const prompt = document.getElementById('prompt');
const game = document.getElementById('game');
const gameCanvas = game.getContext('2d');

const width = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
const height = document.getElementsByTagName('body')[0].getBoundingClientRect().height;
const centerX = width / 2;
const centerY = height / 2 + 50;

gameCanvas.canvas.width  = width;
gameCanvas.canvas.height = height;

const positions = [
  [200, 0],
  [-200, 0],
  [-100, 173],
  [-100, -173],
  [100, 173],
  [100, -173],
]

var state = {
    'option1': 'abcd',
    'option2': 'efgh',
    'option3': 'ijkl',
    'option4': 'nopq',
    'option5': 'rstu',
    'option6': 'vwxy',
    'vote': {
        'x': 0,
        'y': 0,
        'm': 0.1,
        'mu': 1,
        'charge': 500000,
        'v': {
            'x': 0,
            'y': 0,
        },
    },
    'player': {
        'x': 100,
        'y': 100,
    },
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

    drawGame(gameCanvas, state);
});

const physics = (state, dt) => {
  var f, dx, dy, fdx, fdy, theta, drag, d;

  dx = state.player.x - state.vote.x
  dy = state.player.y - state.vote.y
  d = Math.sqrt(dx**2 + dy**2);

  if (d < 55) {
    state.player.x = state.vote.x + dx / d * 55;
    state.player.y = state.vote.y + dy / d * 55;
  }

  dx = state.player.x - state.vote.x;
  dy = state.player.y - state.vote.y;
  d = dx**2 + dy**2;

  f = state.vote.charge / d;
  fdx = dx / d * f;
  fdy = dy / d * f;

  drag = 9.81 * state.vote.m * state.vote.mu;

  fdx -= dx / d * drag;
  fdy -= dy / d * drag;

  state.vote.v.x += fdx / state.vote.m * dt;
  state.vote.v.y += fdy / state.vote.m * dt;

  state.vote.x += state.vote.v.x * dt;
  state.vote.y += state.vote.v.y * dt

  d = Math.sqrt(state.vote.x**2 + state.vote.y**2);

  if (d > 300) {
    state.vote.v.x = 0;
    state.vote.v.y = 0;
    state.vote.x = state.vote.x / d * 300;
    state.vote.y = state.vote.y / d * 300;
  }

  return state;
}

const checkWinner = (state) => {
  var winner = false;

  positions.forEach((position) => {
    var dx = position[0] - state.vote.x;
    var dy = position[1] - state.vote.y;
    var d = Math.sqrt(dx**2 + dy**2);

    if (d < 10) {
      winner = true;
    }
  });

  return winner;
}

const updateGame = () => {
  state = physics(state, 1/20);
  drawGame(gameCanvas, state);

  if (checkWinner(state)) {
    console.log('a');
    clearInterval(interval);
  }
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

const interval = setInterval(updateGame, 1000/20);

setTimeout(() => {
  clearInterval(interval);
}, 60000);

// client version

const roomId = JSON.parse(document.getElementById('room-id').textContent);

const socket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/host/'
  + roomId
  + '/'
);