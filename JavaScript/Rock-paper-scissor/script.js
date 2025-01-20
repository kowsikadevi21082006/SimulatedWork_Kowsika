const resultDisplay = document.getElementById('result');
const buttons = document.querySelectorAll('button');

const choices = ['rock', 'paper', 'scissors'];

function playGame(playerChoice) {

  const computerChoice = choices[Math.floor(Math.random() * 3)];

  let result = '';
  if (playerChoice === computerChoice) {
    result = "It's a tie!";
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    result = 'You win!';
  } else {
    result = 'You lose!';
  }

  resultDisplay.textContent = `You chose ${playerChoice}, Computer chose ${computerChoice}. ${result}`;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    playGame(button.id);
  });
});