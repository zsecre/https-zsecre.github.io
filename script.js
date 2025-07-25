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
    const hokIdInput = document.getElementById('hok-id');
    const userIcon = document.getElementById('user-icon');
    const sideNav = document.getElementById('side-nav');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const userMlbbId = document.getElementById('user-mlbb-id');
    const userZoneId = document.getElementById('user-zone-id');
    const userHokId = document.getElementById('user-hok-id');
    const historyToggle = document.getElementById('history-toggle');
    const historyContent = document.getElementById('history-content');
    const logoutButton = document.getElementById('logout-button');
    const mlbbIcon = document.getElementById('mlbb-icon');
    const hokIcon = document.getElementById('hok-icon');
    const gameTitle = document.getElementById('game-title');
    const gameDescription = document.getElementById('game-description');
    const loginTitle = document.getElementById('login-title');
    const mlbbLogin = document.getElementById('mlbb-login');
    const hokLogin = document.getElementById('hok-login');
    const gameSelectionContainer = document.getElementById('game-selection-container');

    let currentUser = null;
    let selectedGame = 'mlbb';

    const mlbbPrizes = [];
    for (let i = 1; i <= 25; i++) {
        if (i === 13) {
            mlbbPrizes.push({value: '1163', image: 'https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/1163.png'});
        } else if (i % 2 === 0) {
            mlbbPrizes.push({value: 'X'});
        } else if (i % 5 === 0) {
            mlbbPrizes.push({value: '112', image: 'https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/112.png'});
        } else {
            mlbbPrizes.push({value: '5', image: 'https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/5.png'});
        }
    }

    const hokPrizes = [];
    for (let i = 1; i <= 25; i++) {
        if (i === 13) {
            hokPrizes.push({value: '1440', image: 'https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/1440.png'});
        } else if (i % 2 === 0) {
            hokPrizes.push({value: 'X'});
        } else if (i % 5 === 0) {
            hokPrizes.push({value: '288', image: 'https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/288.png'});
        } else {
            hokPrizes.push({value: '32', image: 'https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/32.png'});
        }
    }

    let prizes = mlbbPrizes;

    function createGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const item = document.createElement('div');
            item.classList.add('grid-item');
            if (prizes[i].value === 'X') {
                item.textContent = 'X';
                item.classList.add('x-prize');
            } else {
                if (prizes[i].value === '1163' || prizes[i].value === '1440') {
                    item.classList.add('premium-prize');
                }
                const img = document.createElement('img');
                img.src = prizes[i].image;
                item.appendChild(img);
                const p = document.createElement('p');
                p.innerHTML = `<b>${prizes[i].value} ${selectedGame === 'mlbb' ? 'Diamonds' : 'Tokens'}</b>`;
                item.appendChild(p);
            }
            gridContainer.appendChild(item);
        }
    }

    function updateUserStatus() {
        if (currentUser) {
            userIcon.style.color = '#4CAF50';
            spinButton.textContent = `Spin ${currentUser.spinChance}`;
            if (selectedGame === 'mlbb') {
                userMlbbId.parentElement.style.display = 'block';
                userZoneId.parentElement.style.display = 'block';
                userHokId.parentElement.style.display = 'none';
                userMlbbId.textContent = currentUser.mlbbId || '';
                userZoneId.textContent = currentUser.zoneId || '';
            } else {
                userMlbbId.parentElement.style.display = 'none';
                userZoneId.parentElement.style.display = 'none';
                userHokId.parentElement.style.display = 'block';
                userHokId.textContent = currentUser.hokId || '';
            }
            populateHistory();
        } else {
            userIcon.style.color = 'white';
            spinButton.textContent = 'Spin';
            sideNav.style.width = '0';
        }
    }

    function populateHistory() {
        historyContent.innerHTML = '';
        if (currentUser && currentUser.history) {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            const th1 = document.createElement('th');
            const th2 = document.createElement('th');
            const th3 = document.createElement('th');
            th1.textContent = 'Result';
            th2.textContent = 'Date';
            th3.textContent = 'Status';
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            thead.appendChild(tr);
            table.appendChild(thead);
            currentUser.history.forEach(item => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                if (item.result === 'X') {
                    td1.textContent = 'Loss';
                    td3.textContent = 'No reward';
                } else {
                    td1.textContent = `Win (${item.result} ${selectedGame === 'mlbb' ? 'Diamonds' : 'Tokens'})`;
                    td3.textContent = 'Processing';
                }
                td2.textContent = new Date(item.date).toLocaleString();
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            historyContent.appendChild(table);
        }
    }

    loginButton.addEventListener('click', () => {
        const mlbbId = mlbbIdInput.value.trim();
        const zoneId = zoneIdInput.value.trim();
        const hokId = hokIdInput.value.trim();
        let userId = selectedGame === 'mlbb' ? mlbbId : hokId;
        let collection = selectedGame === 'mlbb' ? 'mlbb_users' : 'hok_users';

        if(userId) {
            const userRef = db.collection(collection).doc(userId);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    currentUser = doc.data();
                    currentUser.id = doc.id;
                } else {
                    currentUser = {
                        id: userId,
                        spinChance: 3,
                        history: []
                    };
                    if(selectedGame === 'mlbb') {
                        currentUser.mlbbId = mlbbId;
                        currentUser.zoneId = zoneId;
                    } else {
                        currentUser.hokId = hokId;
                    }
                    userRef.set(currentUser);
                }
                loginModal.style.display = 'none';
                updateUserStatus();
            }).catch((error) => {
                console.error("Error getting document:", error);
            });
        } else {
             alert('Please enter a valid ID.');
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
        const winningPrize = prizes[winningIndex].value;

        const historyEntry = {
            result: winningPrize,
            date: new Date().toISOString()
        };

        currentUser.history.unshift(historyEntry);
        if (currentUser.history.length > 5) {
            currentUser.history.pop();
        }

        let collection = selectedGame === 'mlbb' ? 'mlbb_users' : 'hok_users';
        db.collection(collection).doc(currentUser.id).update({
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
                    prizeMessage.textContent = `You won ${winningPrize} ${selectedGame === 'mlbb' ? 'Diamonds' : 'Tokens'}!`;
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

    function switchGame(game) {
        selectedGame = game;
        if(game === 'mlbb') {
            gameSelectionContainer.style.backgroundImage = "url('https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/arlot.jpeg')";
            gameTitle.textContent = 'Mobile Legends Diamond Spin';
            gameDescription.textContent = 'Spin to win Mobile Legends: Bang Bang Diamonds for free (3 free spins per day).';
            loginTitle.textContent = 'Login to MLBB';
            mlbbLogin.style.display = 'block';
            hokLogin.style.display = 'none';
            prizes = mlbbPrizes;
            mlbbIcon.classList.add('active-game');
            hokIcon.classList.remove('active-game');
        } else {
            gameSelectionContainer.style.backgroundImage = "url('https://raw.githubusercontent.com/zsecre/victoreum/refs/heads/main/ying.jpeg')";
            gameTitle.textContent = 'Honor of Kings Token Spin';
            gameDescription.textContent = 'Spin to win Honor of Kings Tokens for free (3 free spins per day).';
            loginTitle.textContent = 'Login to HOK';
            mlbbLogin.style.display = 'none';
            hokLogin.style.display = 'block';
            prizes = hokPrizes;
            hokIcon.classList.add('active-game');
            mlbbIcon.classList.remove('active-game');
        }
        createGrid();
        currentUser = null;
        updateUserStatus();
    }

    mlbbIcon.addEventListener('click', () => switchGame('mlbb'));
    hokIcon.addEventListener('click', () => switchGame('hok'));

    switchGame('mlbb');
});
