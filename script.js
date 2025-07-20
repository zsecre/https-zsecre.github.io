document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAcBatoz7cjHfim0hZ_EyBlRrBIUGFpT9I",
        authDomain: "victoreum-drop.firebaseapp.com",
        databaseURL: "https://victoreum-drop-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "victoreum-drop",
        storageBucket: "victoreum-drop.appspot.com",
        messagingSenderId: "714962354429",
        appId: "1:714962354429:web:e316f6ddcfdd3f3e89be94",
        measurementId: "G-K3EZR48TR9"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const gridContainer = document.getElementById('grid-container');
    const spinButton = document.getElementById('spin-button');
    const prizeModal = document.getElementById('prize-modal');
    const prizeMessage = document.getElementById('prize-message');
    const closeButton = document.querySelector('.close-button');
    const loginModal = document.getElementById('login-modal');
    const loginButton = document.getElementById('login-button');
    const mlbbIdInput = document.getElementById('mlbb-id');
    const zoneIdInput = document.getElementById('zone-id');
    const userIcon = document.getElementById('user-icon');
    const sideNav = document.getElementById('side-nav');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const userMlbbId = document.getElementById('user-mlbb-id');
    const userZoneId = document.getElementById('user-zone-id');
    const historyToggle = document.getElementById('history-toggle');
    const historyContent = document.getElementById('history-content');
    const logoutButton = document.getElementById('logout-button');

    let currentUser = null;

    const prizes = [];
    for (let i = 1; i <= 25; i++) {
        if (i === 13) {
            prizes.push('1163');
        } else if (i % 2 === 0) {
            prizes.push('X');
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
            if (prizes[i] === 'X') {
                item.classList.add('x-prize');
            }
            gridContainer.appendChild(item);
        }
    }

    function updateUserStatus() {
        if (currentUser) {
            userIcon.style.color = '#4CAF50'; // Green when logged in
            spinButton.textContent = `Spin ${currentUser.spinChance}`;
            userMlbbId.textContent = currentUser.mlbbId;
            userZoneId.textContent = currentUser.zoneId;
            populateHistory();
        } else {
            userIcon.style.color = 'white'; // Default color
            spinButton.textContent = 'Spin';
            sideNav.style.width = '0';
        }
    }

    function populateHistory() {
        historyContent.innerHTML = '';
        if (currentUser && currentUser.history) {
            currentUser.history.forEach(item => {
                const p = document.createElement('p');
                p.textContent = `${item.result} - ${new Date(item.date).toLocaleDateString()}`;
                historyContent.appendChild(p);
            });
        }
    }

    loginButton.addEventListener('click', () => {
        const mlbbId = mlbbIdInput.value.trim();
        const zoneId = zoneIdInput.value.trim();

        if (mlbbId && zoneId) {
            const userRef = db.collection('users').doc(mlbbId);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    currentUser = doc.data();
                    currentUser.mlbbId = mlbbId;
                } else {
                    currentUser = {
                        mlbbId: mlbbId,
                        zoneId: zoneId,
                        spinChance: 3,
                        history: []
                    };
                    userRef.set(currentUser);
                }
                loginModal.style.display = 'none';
                updateUserStatus();
            }).catch((error) => {
                console.error("Error getting document:", error);
            });
        } else {
            alert('Please enter a valid MLBB ID and Zone ID.');
        }
    });

    spinButton.addEventListener('click', () => {
        if (!currentUser) {
            loginModal.style.display = 'block';
        } else if (currentUser.spinChance > 0) {
            spin();
        } else {
            alert('You have no spins left!');
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        updateUserStatus();
    });

    async function spin() {
        spinButton.disabled = true;
        currentUser.spinChance--;
        const squares = Array.from(document.querySelectorAll('.grid-item'));
        const winningIndex = Math.floor(Math.random() * 25);
        const winningPrize = prizes[winningIndex];

        const historyEntry = {
            result: winningPrize,
            date: new Date().toISOString()
        };

        currentUser.history.unshift(historyEntry);
        if (currentUser.history.length > 5) {
            currentUser.history.pop();
        }

        db.collection('users').doc(currentUser.mlbbId).update({
            spinChance: currentUser.spinChance,
            history: currentUser.history
        });

        updateUserStatus();

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
                const prizeModalTitle = prizeModal.querySelector('h2');
                if (winningPrize === 'X') {
                    prizeModalTitle.textContent = 'Oops!';
                    prizeMessage.textContent = 'Better luck next time';
                } else {
                    prizeModalTitle.textContent = 'Congratulations!';
                    prizeMessage.textContent = `You won ${winningPrize} diamonds!`;
                }
                prizeModal.style.display = 'block';
                spinButton.disabled = false;
            }, 1000);
        }, 3000);
    }

    closeButton.addEventListener('click', () => {
        prizeModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == prizeModal || event.target == loginModal) {
            prizeModal.style.display = 'none';
            loginModal.style.display = 'none';
        }
    });

    userIcon.addEventListener('click', () => {
        if (currentUser) {
            sideNav.style.width = '250px';
        }
    });

    closeNavBtn.addEventListener('click', () => {
        sideNav.style.width = '0';
    });

    historyToggle.addEventListener('click', () => {
        if (historyContent.style.display === 'block') {
            historyContent.style.display = 'none';
        } else {
            historyContent.style.display = 'block';
        }
    });

    createGrid();
    updateUserStatus();
});
