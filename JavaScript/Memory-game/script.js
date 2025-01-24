const cardArray = [
  { name: 'cat', img: 'images/catpng.png' },
  { name: 'dog', img: 'images/dogpng.webp' },
  { name: 'fish', img: 'images/fishpng.png' },
  { name: 'bird', img: 'images/birdpng.png' },
  { name: 'rabbit', img: 'images/rabbitpng.png' },
  { name: 'turtle', img: 'images/turtlepng.png' },
  { name: 'cat', img: 'images/catpng.png' },
  { name: 'dog', img: 'images/dogpng.webp' },
  { name: 'fish', img: 'images/fishpng.png' },
  { name: 'bird', img: 'images/birdpng.png' },
  { name: 'rabbit', img: 'images/rabbitpng.png' },
  { name: 'turtle', img: 'images/turtlepng.png' },
];

let timer;
let elapsedTime = 0;
let difficulty = 'easy';
let bestTime = localStorage.getItem('bestTime') || 'N/A';

const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const bestTimeDisplay = document.querySelector('#best-time');

let chosenCards = [];
let chosenCardIds = [];
let matchedCards = [];
let score = 0;

function initializeGame() {
  setDifficulty(difficulty);

  cardArray.sort(() => 0.5 - Math.random());
  createBoard();

  startTimer();
}

function setDifficulty(level) {
  if (level === 'easy') {
    grid.style.width = '320px';
    cardArray.splice(12);
  } else if (level === 'medium') {
    grid.style.width = '480px';
    cardArray.splice(20); 
  } else if (level === 'hard') {
    grid.style.width = '640px';
  }
}

function createBoard() {
  grid.innerHTML = '';
  cardArray.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-id', index);

    const frontFace = document.createElement('img');
    frontFace.classList.add('front-face');
    frontFace.setAttribute('src', 'images/blank.png');

    const backFace = document.createElement('img');
    backFace.classList.add('back-face');
    backFace.setAttribute('src', card.img);

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);
    cardElement.addEventListener('click', flipCard);

    grid.appendChild(cardElement);
  });
}

function flipCard() {
  const cardId = this.getAttribute('data-id');
  if (
    !matchedCards.includes(cardId) &&
    chosenCardIds.length < 2 &&
    !chosenCardIds.includes(cardId)
  ) {
    this.classList.add('flipped');
    chosenCards.push(cardArray[cardId].name);
    chosenCardIds.push(cardId);

    if (chosenCards.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }
}

function checkForMatch() {
  const cards = document.querySelectorAll('.card');
  const [firstId, secondId] = chosenCardIds;

  if (chosenCards[0] === chosenCards[1] && firstId !== secondId) {
    matchedCards.push(firstId, secondId);
    cards[firstId].classList.add('hidden');
    cards[secondId].classList.add('hidden');
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    cards[firstId].classList.remove('flipped');
    cards[secondId].classList.remove('flipped');
  }

  chosenCards = [];
  chosenCardIds = [];

  if (matchedCards.length === cardArray.length) {
    clearInterval(timer);
    checkBestTime();
    scoreDisplay.textContent = 'Congratulations! You found all the matches!';
  }
}

function startTimer() {
  timerDisplay.textContent = `Time: 0s`;
  elapsedTime = 0;
  timer = setInterval(() => {
    elapsedTime++;
    timerDisplay.textContent = `Time: ${elapsedTime}s`;
  }, 1000);
}

function checkBestTime() {
  if (bestTime === 'N/A' || elapsedTime < parseInt(bestTime)) {
    bestTime = elapsedTime;
    localStorage.setItem('bestTime', bestTime);
  }
  bestTimeDisplay.textContent = `Best Time: ${bestTime}s`;
}

document.querySelector('#difficulty').addEventListener('change', (event) => {
  difficulty = event.target.value;
  resetGame();
});

function resetGame() {
  clearInterval(timer);
  score = 0;
  matchedCards = [];
  chosenCards = [];
  chosenCardIds = [];
  scoreDisplay.textContent = 'Score: 0';
  initializeGame();
}

bestTimeDisplay.textContent = `Best Time: ${bestTime}s`;
initializeGame();
