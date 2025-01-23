const grid = document.querySelector('.grid');
const rows = Array.from(document.querySelectorAll('.row'));
const startPauseBtn = document.getElementById('start-pause');
const message = document.getElementById('message');
let currentIndex = 7;
let isGameRunning = false;
let gameInterval = null;
let timeRemaining = 20;

rows[currentIndex].classList.add('frog');

function moveFrog(e) {
  rows[currentIndex].classList.remove('frog');

  switch (e.key) {
    case 'ArrowLeft':
      if (currentIndex > 0 && currentIndex % 1 !== 0) currentIndex -= 1;
      break;
    case 'ArrowRight':
      if (currentIndex < rows.length - 1 && currentIndex % 1 !== 1) currentIndex += 1;
      break;
    case 'ArrowUp':
      if (currentIndex > 0) currentIndex -= 1; // Move up a row
      break;
    case 'ArrowDown':
      if (currentIndex < rows.length - 1) currentIndex += 1; // Move down a row
      break;
  }

  rows[currentIndex].classList.add('frog');
  checkGameStatus();
}

function startPauseGame() {
  if (isGameRunning) {
    clearInterval(gameInterval);
    isGameRunning = false;
    message.textContent = 'Game Paused';
  } else {
    message.textContent = '';
    isGameRunning = true;
    gameInterval = setInterval(() => {
      timeRemaining -= 1;
      if (timeRemaining === 0) {
        endGame('Time is up! You lose!');
      }
    }, 1000);
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
    endGame('Congratulations! You reached the goal and won!');
  }
}
function endGame(messageText) {
  clearInterval(gameInterval);
  isGameRunning = false;
  message.textContent = messageText;
  document.removeEventListener('keydown', moveFrog);
}

startPauseBtn.addEventListener('click', startPauseGame);
document.addEventListener('keydown', moveFrog);
