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
let lives = 3;
let currentPosition = [260, 10];
let ballCurrentPosition = [290, 50];
let ballSpeed = 20;
let balls = [{ position: [...ballCurrentPosition], element: ball }];

const blocks = [];
const blockRows = 3;
const blockCols = 6;

const powerUps = []; 
const powerUpTypes = ['increasePaddle', 'extraLife', 'speedUp'];

const hitSound = new Audio('hit.mp3');
const powerUpSound = new Audio('powerup.mp3');
const loseSound = new Audio('lose.mp3');
const winSound = new Audio('win.mp3');

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

function drawBall(ballObj) {
  ballObj.element.style.left = `${ballObj.position[0]}px`;
  ballObj.element.style.bottom = `${ballObj.position[1]}px`;
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

function spawnPowerUp(block) {
  if (Math.random() > 0.7) { 
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up');
    powerUp.style.left = `${block.bottomLeft[0]}px`;
    powerUp.style.bottom = `${block.bottomLeft[1]}px`;
    powerUp.dataset.type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    board.appendChild(powerUp);
    powerUps.push({ element: powerUp, position: [block.bottomLeft[0], block.bottomLeft[1]], type: powerUp.dataset.type });
  }
}

function applyPowerUp(type) {
  switch (type) {
    case 'increasePaddle':
      user.style.width = '150px';
      setTimeout(() => (user.style.width = `${userWidth}px`), 10000);
      break;
    case 'extraLife':
      lives++;
      break;
    case 'speedUp':
      ballSpeed = Math.max(10, ballSpeed - 5);
      break;
  }
  powerUpSound.play();
}

function movePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.position[1] -= 2;
    powerUp.element.style.bottom = `${powerUp.position[1]}px`;

    if (
      powerUp.position[0] > currentPosition[0] &&
      powerUp.position[0] < currentPosition[0] + userWidth &&
      powerUp.position[1] > currentPosition[1] &&
      powerUp.position[1] < currentPosition[1] + blockHeight
    ) {
      applyPowerUp(powerUp.type);
      powerUp.element.remove();
      powerUps.splice(index, 1);
    }

    if (powerUp.position[1] <= 0) {
      powerUp.element.remove();
      powerUps.splice(index, 1);
    }
  });
}

function checkForCollisions() {
  balls.forEach((ballObj) => {
    for (let i = 0; i < blocks.length; i++) {
      if (
        ballObj.position[0] > blocks[i].bottomLeft[0] &&
        ballObj.position[0] < blocks[i].bottomRight[0] &&
        ballObj.position[1] + ballDiameter > blocks[i].bottomLeft[1] &&
        ballObj.position[1] < blocks[i].topLeft[1]
      ) {
        blocks[i].element.remove();
        blocks.splice(i, 1);
        spawnPowerUp(blocks[i]);
        changeDirection();
        score++;
        scoreDisplay.textContent = `Score: ${score} Lives: ${lives}`;
        if (blocks.length === 0) {
          scoreDisplay.textContent = 'You Win!';
          winSound.play();
          clearInterval(timerId);
          document.removeEventListener('keydown', moveUser);
        }
      }
    }

    if (
      ballObj.position[0] >= boardWidth - ballDiameter || 
      ballObj.position[0] <= 0 ||                        
      ballObj.position[1] >= boardHeight - ballDiameter  
    ) {
      changeDirection();
    }

    if (
      ballObj.position[0] > currentPosition[0] &&
      ballObj.position[0] < currentPosition[0] + userWidth &&
      ballObj.position[1] > currentPosition[1] &&
      ballObj.position[1] < currentPosition[1] + blockHeight
    ) {
      changeDirection();
    }

    if (ballObj.position[1] <= 0) {
      loseSound.play();
      balls.splice(balls.indexOf(ballObj), 1);
      if (balls.length === 0) {
        lives--;
        scoreDisplay.textContent = `Score: ${score} Lives: ${lives}`;
        if (lives <= 0) {
          scoreDisplay.textContent = 'You Lose!';
          clearInterval(timerId);
          document.removeEventListener('keydown', moveUser);
        } else {
          balls.push({ position: [...ballCurrentPosition], element: ball });
        }
      }
    }
  });
}

function changeDirection() {
  xDirection = -xDirection;
  yDirection = -yDirection;
  hitSound.play();
}

function moveBall() {
  balls.forEach((ballObj) => {
    ballObj.position[0] += xDirection;
    ballObj.position[1] += yDirection;
    drawBall(ballObj);
  });
  movePowerUps();
  checkForCollisions();
}

function startGame() {
  timerId = setInterval(moveBall, ballSpeed);
}
startGame();