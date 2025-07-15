document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.getElementById('videoContainer');
    const episodeList = document.getElementById('episodeList');

    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    const apiUrl = `https://consumet-api-two-nu.vercel.app/meta/anilist/info/${animeId}`;

    async function fetchAnimeInfo(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayEpisodes(data.episodes);
            if (data.episodes.length > 0) {
                fetchEpisode(data.episodes[0].id);
            }
        } catch (error) {
            console.error('Error fetching anime info:', error);
        }
    }

    function displayEpisodes(episodes) {
        episodeList.innerHTML = '';
        episodes.forEach(episode => {
            const episodeButton = document.createElement('button');
            episodeButton.textContent = `Episode ${episode.number}`;
            episodeButton.addEventListener('click', () => {
                fetchEpisode(episode.id);
            });
            episodeList.appendChild(episodeButton);
        });
    }

    async function fetchEpisode(episodeId) {
        try {
            const response = await fetch(`https://consumet-api-two-nu.vercel.app/meta/anilist/watch/${episodeId}`);
            const data = await response.json();
            playVideo(data.sources[0].url);
        } catch (error) {
            console.error('Error fetching episode:', error);
        }
    }

    function playVideo(videoUrl) {
        videoContainer.innerHTML = `
            <video controls width="100%">
                <source src="${videoUrl}" type="application/x-mpegURL">
            </video>
        `;
    }

    fetchAnimeInfo(apiUrl);
});
