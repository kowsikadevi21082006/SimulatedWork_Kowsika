const grid = document.querySelector('.grid');
const rows = Array.from(document.querySelectorAll('.row'));
const startPauseBtn = document.getElementById('start-pause');
const message = document.getElementById('message');
const scoreDisplay = document.createElement('p');
const livesDisplay = document.createElement('p');

let currentIndex = 7;
let isGameRunning = false;
let gameInterval = null;
let timeRemaining = 20;
let lives = 3;
let score = 0;
let obstacles = [];
let powerUps = [];

scoreDisplay.id = 'score';
livesDisplay.id = 'lives';
document.body.insertBefore(scoreDisplay, grid);
document.body.insertBefore(livesDisplay, grid);

rows[currentIndex].classList.add('frog');

const jumpSound = new Audio('./sounds/jump.mp3');
const collideSound = new Audio('./sounds/collide.mp3');
const goalSound = new Audio('./sounds/goal.mp3');
const bgMusic = new Audio('./sounds/bg-music.mp3');
bgMusic.loop = true;

function moveFrog(e) {
  if (!isGameRunning) return;

  rows[currentIndex].classList.remove('frog');
  switch (e.key) {
    case 'ArrowLeft':
      if (currentIndex > 0) currentIndex -= 1;
      break;
    case 'ArrowRight':
      if (currentIndex < rows.length - 1) currentIndex += 1;
      break;
    case 'ArrowUp':
      if (currentIndex > 0) currentIndex -= 1;
      break;
    case 'ArrowDown':
      if (currentIndex < rows.length - 1) currentIndex += 1;
      break;
  }
  jumpSound.play();
  rows[currentIndex].classList.add('frog');
  checkGameStatus();
}

function startPauseGame() {
  if (isGameRunning) {
    clearInterval(gameInterval);
    bgMusic.pause();
    isGameRunning = false;
    message.textContent = 'Game Paused';
  } else {
    bgMusic.play();
    message.textContent = '';
    isGameRunning = true;
    gameInterval = setInterval(gameLoop, 1000);
  }
}

function gameLoop() {
  timeRemaining -= 1;
  if (timeRemaining <= 0) {
    endGame('Time is up! You lose!');
  }
  moveObstacles();
  spawnObstacles();
  spawnPowerUps();
  checkCollisions();
  updateScoreAndLives();
}

function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.position -= obstacle.speed;
    if (obstacle.position < 0) {
      obstacles.splice(index, 1);
    }
  });
}

function spawnObstacles() {
  const obstacleTypes = ['car', 'log', 'boat'];
  const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  const speed = Math.random() * 0.5 + 0.5;
  const position = rows.length - 1;
  obstacles.push({ type, speed, position });
}

function spawnPowerUps() {
  if (Math.random() < 0.1) {
    const position = Math.floor(Math.random() * rows.length);
    powerUps.push({ type: 'invincibility', position });
  }
}

function checkCollisions() {
  const currentRow = rows[currentIndex];
  if (obstacles.some(ob => ob.position === currentIndex)) {
    lives -= 1;
    collideSound.play();
    if (lives <= 0) endGame('You lost all lives! Game Over!');
  }
  const powerUp = powerUps.find(pu => pu.position === currentIndex);
  if (powerUp) {
    if (powerUp.type === 'invincibility') {
      powerUps.splice(powerUps.indexOf(powerUp), 1);
    }
  }
}

function checkGameStatus() {
  const currentRow = rows[currentIndex];
  if (currentRow.classList.contains('c1')) {
    endGame('You were hit by a car! You lose!');
  } else if (
    currentRow.classList.contains('l4') ||
    currentRow.classList.contains('l5') ||
    currentRow.classList.contains('lf2') ||
    currentRow.classList.contains('lf3')
  ) {
    endGame('You fell into the river! You lose!');
  } else if (currentRow.classList.contains('starting-block')) {
    score += 100;
    goalSound.play();
    endGame('Congratulations! You reached the goal and won!');
  }
}

function updateScoreAndLives() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
}

function endGame(messageText) {
  clearInterval(gameInterval);
  isGameRunning = false;
  bgMusic.pause();
  message.textContent = messageText;
  document.removeEventListener('keydown', moveFrog);
}

startPauseBtn.addEventListener('click', startPauseGame);
document.addEventListener('keydown', moveFrog);
