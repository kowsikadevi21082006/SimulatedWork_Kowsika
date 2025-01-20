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
  
  cardArray.sort(() => 0.5 - Math.random());
  
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('#score');
  
  let chosenCards = [];
  let chosenCardIds = [];
  let matchedCards = [];
  let score = 0;
  
  function createBoard() {
    cardArray.forEach((card, index) => {
      const cardElement = document.createElement('img');
      cardElement.setAttribute('src', 'images/blank.png');
      cardElement.setAttribute('data-id', index);
      cardElement.addEventListener('click', flipCard);
      grid.appendChild(cardElement);
    });
  }
  
  function flipCard() {
    const cardId = this.getAttribute('data-id');
    if (!matchedCards.includes(cardId) && chosenCardIds.length < 2 && !chosenCardIds.includes(cardId)) {
      chosenCards.push(cardArray[cardId].name);
      chosenCardIds.push(cardId);
      this.setAttribute('src', cardArray[cardId].img);
  
      if (chosenCards.length === 2) {
        setTimeout(checkForMatch, 500);
      }
    }
  }
  
  function checkForMatch() {
    const cards = document.querySelectorAll('img');
    const [firstId, secondId] = chosenCardIds;
  
    if (chosenCards[0] === chosenCards[1] && firstId !== secondId) {
      cards[firstId].classList.add('hidden');
      cards[secondId].classList.add('hidden');
      matchedCards.push(firstId, secondId);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    } else {
      cards[firstId].setAttribute('src', 'images/blank.png');
      cards[secondId].setAttribute('src', 'images/blank.png');
    }
  
    chosenCards = [];
    chosenCardIds = [];

    if (matchedCards.length === cardArray.length) {
      scoreDisplay.textContent = 'Congratulations! You found all the matches!';
    }
  }
  createBoard();
  