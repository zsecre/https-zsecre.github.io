document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const spinButton = document.getElementById('spin-button');
    const prizeModal = document.getElementById('prize-modal');
    const prizeWon = document.getElementById('prize-won');
    const closeButton = document.querySelector('.close-button');

    const prizes = [];
    for (let i = 1; i <= 25; i++) {
        if (i === 13) {
            prizes.push('1163');
        } else if (i % 2 === 0) {
            prizes.push('Better luck next time');
        } else if (i % 5 === 0) {
            prizes.push('112');
        } else {
            prizes.push('5');
        }
    }

    function createGrid() {
        for (let i = 0; i < 25; i++) {
            const item = document.createElement('div');
            item.classList.add('grid-item');
            item.textContent = prizes[i];
            gridContainer.appendChild(item);
        }
    }

    async function spin() {
        spinButton.disabled = true;
        const squares = Array.from(document.querySelectorAll('.grid-item'));
        const winningIndex = Math.floor(Math.random() * 25);
        const winningPrize = prizes[winningIndex];

        let currentIndex = 0;
        const interval = setInterval(() => {
            squares.forEach(square => square.classList.remove('active'));
            squares[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % 25;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            squares.forEach(square => square.classList.remove('active'));
            squares[winningIndex].classList.add('active');
            setTimeout(() => {
                prizeWon.textContent = winningPrize;
                prizeModal.style.display = 'block';
                spinButton.disabled = false;
            }, 1000);
        }, 3000);
    }

    spinButton.addEventListener('click', spin);

    closeButton.addEventListener('click', () => {
        prizeModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == prizeModal) {
            prizeModal.style.display = 'none';
        }
    });

    createGrid();
});
