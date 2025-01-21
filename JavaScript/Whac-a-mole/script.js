const squares = document.querySelectorAll('.square');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const mole = document.querySelector('.mole');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;

function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole');
  });

  const randomSquare = squares[Math.floor(Math.random() * squares.length)];
  randomSquare.classList.add('mole');
  hitPosition = randomSquare.id; 
}

squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (square.id === hitPosition) {
      result++;
      scoreDisplay.textContent = result; 
      hitPosition = null; 
    }
  });
});

function moveMole() {
  timerId = setInterval(randomSquare, 700); 
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
