const grid = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result');

const width = 15;
let currentShooterIndex = 202;
let alienInvaders = [];
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}
const squares = Array.from(document.querySelectorAll('#grid div'));

squares[currentShooterIndex].classList.add('shooter');

alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24
];

alienInvaders.forEach(invader => squares[invader].classList.add('invader'));

document.addEventListener('keydown', (e) => {
    squares[currentShooterIndex].classList.remove('shooter');
    if (e.key === 'ArrowLeft' && currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1;
    } else if (e.key === 'ArrowRight' && currentShooterIndex % width < width - 1) {
        currentShooterIndex += 1;
    }
    squares[currentShooterIndex].classList.add('shooter');
});

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        if (currentLaserIndex < 0) {
            clearInterval(laserId);
            return;
        }

        if (squares[currentLaserIndex]) {
            squares[currentLaserIndex].classList.add('laser');

            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser', 'invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);

                clearInterval(laserId);
                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved);
                results++;
                resultDisplay.innerHTML = results;
            }
        }
    }

    if (e.key === 'ArrowUp') {
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', shoot);

let direction = 1;
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
        direction = width;
    } else if (direction === width) {
        direction = leftEdge ? 1 : -1;
    }

    alienInvaders.forEach((_, i) => squares[alienInvaders[i]]?.classList.remove('invader'));
    alienInvaders = alienInvaders.map(invader => invader + direction);
    alienInvaders.forEach((_, i) => {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]]?.classList.add('invader');
        }
    });

    if (alienInvaders.some(invader => invader >= squares.length)) {
        resultDisplay.innerHTML = 'Game Over';
        clearInterval(invaderId);
        document.removeEventListener('keydown', shoot);
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = 'You Win!';
        clearInterval(invaderId);
        document.removeEventListener('keydown', shoot);
    }
}

const invaderId = setInterval(moveInvaders, 500);
