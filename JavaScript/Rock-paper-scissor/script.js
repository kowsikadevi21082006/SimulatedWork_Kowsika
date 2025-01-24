const choices = ['rock', 'paper', 'scissors'];
let wins = 0;
let losses = 0;
let ties = 0;

const winSound = new Audio('./Audio/win.mp3');
const loseSound = new Audio('./Audio/lose.mp3');
const tieSound = new Audio('./Audio/tie.mp3');

function getRandomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    return 'win';
  } else {
    return 'lose';
  }
}

function updateScoreboard(result) {
  if (result === 'win') {
    wins++;
    winSound.play();
  } else if (result === 'lose') {
    losses++;
    loseSound.play();
  } else {
    ties++;
    tieSound.play();
  }
  document.getElementById('wins').textContent = `Wins: ${wins}`;
  document.getElementById('losses').textContent = `Losses: ${losses}`;
  document.getElementById('ties').textContent = `Ties: ${ties}`;
}

function playGame(playerChoice) {
  const computerChoice = getRandomChoice();

  document.getElementById('player-choice').textContent = `Player Choice: ${playerChoice}`;
  document.getElementById('computer-choice').textContent = `Computer Choice: ${computerChoice}`;

  const result = determineWinner(playerChoice, computerChoice);
  let resultMessage;
  if (result === 'win') {
    resultMessage = 'You Win!';
  } else if (result === 'lose') {
    resultMessage = 'You Lose!';
  } else {
    resultMessage = "It's a Tie!";
  }
  document.getElementById('game-result').textContent = `Result: ${resultMessage}`;

  updateScoreboard(result);
}

const buttons = document.querySelectorAll('.choice');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    playGame(button.id);
  });
});
