document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const animeList = document.getElementById('animeList');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    let hasNextPage = true;

    const apiUrl = 'https://consumet-api-two-nu.vercel.app/meta/anilist/popular';

    async function fetchAnime(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayAnime(data.results);
            currentPage = data.currentPage;
            hasNextPage = data.hasNextPage;
            setupPagination();
        } catch (error) {
            console.error('Error fetching anime:', error);
        }
    }

    function displayAnime(animeData) {
        animeList.innerHTML = '';
        animeData.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');

            const animeImage = document.createElement('img');
            animeImage.src = anime.image;
            animeImage.alt = anime.title.romaji;

            const animeTitle = document.createElement('h3');
            animeTitle.textContent = anime.title.romaji;

            animeCard.appendChild(animeImage);
            animeCard.appendChild(animeTitle);

            animeCard.addEventListener('click', () => {
                window.location.href = `watch.html?id=${anime.id}`;
            });

            animeList.appendChild(animeCard);
        });
    }

    function setupPagination() {
        pagination.innerHTML = '';

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                fetchAnime(`${apiUrl}?page=${currentPage - 1}`);
            });
            pagination.appendChild(prevButton);
        }

        if (hasNextPage) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                fetchAnime(`${apiUrl}?page=${currentPage + 1}`);
            });
            pagination.appendChild(nextButton);
        }
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const searchUrl = `https://consumet-api-two-nu.vercel.app/meta/anilist/${searchTerm}`;
            fetchAnime(searchUrl);
        }
    });

    fetchAnime(apiUrl);
});
