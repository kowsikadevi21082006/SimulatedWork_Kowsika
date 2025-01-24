const grid = document.getElementById('grid');
const currentPlayerText = document.getElementById('currentPlayer');
const resetButton = document.getElementById('resetButton');
const playerOneScoreText = document.getElementById('playerOneScore');
const playerTwoScoreText = document.getElementById('playerTwoScore');

const rows = 6;
const cols = 7;
let currentPlayer = 'player-one';
let gameActive = true;
let playerOneScore = 0;
let playerTwoScore = 0;

for (let i = 0; i < rows * cols; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-index', i);
  grid.appendChild(cell);
}

const cells = document.querySelectorAll('.cell');

function checkBoard() {
  const winningArrays = [
    ...Array(rows).flatMap((_, r) =>
      Array(cols - 3).fill(0).map((_, c) => [
        r * cols + c,
        r * cols + c + 1,
        r * cols + c + 2,
        r * cols + c + 3,
      ])
    ),
    ...Array(rows - 3).flatMap((_, r) =>
      Array(cols).fill(0).map((_, c) => [
        r * cols + c,
        (r + 1) * cols + c,
        (r + 2) * cols + c,
        (r + 3) * cols + c,
      ])
    ),
    ...Array(rows - 3).flatMap((_, r) =>
      Array(cols - 3).fill(0).map((_, c) => [
        r * cols + c,
        (r + 1) * cols + c + 1,
        (r + 2) * cols + c + 2,
        (r + 3) * cols + c + 3,
      ])
    ),
    ...Array(rows - 3).flatMap((_, r) =>
      Array(cols - 3).fill(0).map((_, c) => [
        r * cols + c + 3,
        (r + 1) * cols + c + 2,
        (r + 2) * cols + c + 1,
        (r + 3) * cols + c,
      ])
    ),
  ];

  for (let arr of winningArrays) {
    const [a, b, c, d] = arr;
    if (
      cells[a].classList.contains(currentPlayer) &&
      cells[b].classList.contains(currentPlayer) &&
      cells[c].classList.contains(currentPlayer) &&
      cells[d].classList.contains(currentPlayer)
    ) {
      gameActive = false;
      alert(`${currentPlayer === 'player-one' ? 'Player One' : 'Player Two'} Wins!`);
      updateScore();
      return;
    }
  }

  if ([...cells].every(cell => cell.classList.contains('player-one') || cell.classList.contains('player-two'))) {
    alert('It\'s a Draw!');
    gameActive = false;
  }
}

function updateScore() {
  if (currentPlayer === 'player-one') {
    playerOneScore++;
    playerOneScoreText.textContent = playerOneScore;
  } else {
    playerTwoScore++;
    playerTwoScoreText.textContent = playerTwoScore;
  }
}

function resetGame() {
  cells.forEach(cell => {
    cell.classList.remove('player-one', 'player-two');
  });
  currentPlayer = 'player-one';
  currentPlayerText.textContent = "Player One's Turn";
  gameActive = true;
}

function handleCellClick(event) {
  if (!gameActive) return;

  const index = parseInt(event.target.getAttribute('data-index'));
  const columnIndex = index % cols;
  let placed = false;

  for (let r = rows - 1; r >= 0; r--) {
    const cellIndex = r * cols + columnIndex;
    const cell = cells[cellIndex];
    if (!cell.classList.contains('player-one') && !cell.classList.contains('player-two')) {
      cell.classList.add(currentPlayer);
      placed = true;
      break;
    }
  }

  if (placed) {
    checkBoard();
    currentPlayer = currentPlayer === 'player-one' ? 'player-two' : 'player-one';
    currentPlayerText.textContent = `${currentPlayer === 'player-one' ? "Player One's" : "Player Two's"} Turn`;
  }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
