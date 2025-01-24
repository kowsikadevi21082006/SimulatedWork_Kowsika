const squares = document.querySelectorAll('.square');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const moleImages = ['mole', 'bonus-mole'];

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let moleSpeed = 700;
let levelThreshold = 5;

function randomSquare() {
  squares.forEach((square) => {
    square.className = 'square';
  });

  const randomSquare = squares[Math.floor(Math.random() * squares.length)];
  const moleType = Math.random() < 0.1 ? 'bonus-mole' : 'mole';
  randomSquare.classList.add(moleType);
  hitPosition = { id: randomSquare.id, type: moleType };
}

squares.forEach((square) => {
  square.addEventListener('mousedown', () => {
    if (square.id === hitPosition?.id) {
      if (hitPosition.type === 'bonus-mole') {
        result += 3;
      } else {
        result++;
      }
      scoreDisplay.textContent = result;
      hitPosition = null; 
      square.className = 'square'; 
      adjustDifficulty();
    }
  });
});

function moveMole() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(randomSquare, moleSpeed);
}

function adjustDifficulty() {
  if (result > 0 && result % levelThreshold === 0) {
    moleSpeed = Math.max(300, moleSpeed - 50); 
    moveMole(); 
  }
}

function countDown() {
  currentTime--;
  timeLeftDisplay.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(timerId);
    clearInterval(countDownTimerId);
    alert(`Game Over! Your final score is ${result}`);
  }
}

moveMole();
const countDownTimerId = setInterval(countDown, 1000);
