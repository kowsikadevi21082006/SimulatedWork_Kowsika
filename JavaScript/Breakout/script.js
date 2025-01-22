const board = document.getElementById('board');
const user = document.getElementById('user');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');

const boardWidth = 600;
const boardHeight = 400;
const blockWidth = 80;
const blockHeight = 20;
const ballDiameter = 20;
const userWidth = 100;

let xDirection = 2;
let yDirection = 2;
let timerId;
let score = 0;
let currentPosition = [260, 10];
let ballCurrentPosition = [290, 50];

const blocks = [];
const blockRows = 3;
const blockCols = 6;

function createBlocks() {
  for (let row = 0; row < blockRows; row++) {
    for (let col = 0; col < blockCols; col++) {
      const block = document.createElement('div');
      block.classList.add('block');
      block.style.left = `${col * blockWidth + 10}px`;
      block.style.top = `${row * blockHeight + 10}px`;
      blocks.push({
        element: block,
        bottomLeft: [col * blockWidth + 10, row * blockHeight + 10],
        bottomRight: [col * blockWidth + blockWidth + 10, row * blockHeight + 10],
        topLeft: [col * blockWidth + 10, row * blockHeight + blockHeight + 10],
        topRight: [col * blockWidth + blockWidth + 10, row * blockHeight + blockHeight + 10],
      });
      board.appendChild(block);
    }
  }
}
createBlocks();

function drawUser() {
  user.style.left = `${currentPosition[0]}px`;
  user.style.bottom = `${currentPosition[1]}px`;
}

function drawBall() {
  ball.style.left = `${ballCurrentPosition[0]}px`;
  ball.style.bottom = `${ballCurrentPosition[1]}px`;
}

function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) currentPosition[0] -= 10;
      break;
    case 'ArrowRight':
      if (currentPosition[0] < boardWidth - userWidth) currentPosition[0] += 10;
      break;
  }
  drawUser();
}
document.addEventListener('keydown', moveUser);
function checkForCollisions() {
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      blocks[i].element.remove();
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      if (blocks.length === 0) {
        scoreDisplay.textContent = 'You Win!';
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
      }
    }
  }
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter || // Right wall
    ballCurrentPosition[0] <= 0 ||                        // Left wall
    ballCurrentPosition[1] >= boardHeight - ballDiameter  // Top wall
  ) {
    changeDirection();
  }
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + userWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.textContent = 'You Lose!';
    document.removeEventListener('keydown', moveUser);
  }
}
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
  } else if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
  } else if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
  } else if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
  }
}
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

function startGame() {
  timerId = setInterval(moveBall, 20);
}
startGame();