const videoPlayer = document.getElementById('player');
const channelList = document.getElementById('channel-list');
const loadMoreBtn = document.getElementById('load-more');
const iptvUrlInput = document.getElementById('iptv-url');
const loadUrlBtn = document.getElementById('load-url');
let channels = [];
let displayedChannels = 0;
const channelsPerPage = 10;

async function loadChannels(m3uUrl) {
    try {
        const response = await fetch(`/channels?url=${encodeURIComponent(m3uUrl)}`);
        channels = await response.json();
        channelList.innerHTML = ''; // Limpiar la lista anterior
        displayedChannels = 0;
        displayChannels();
    } catch (error) {
        console.error('Error loading channels:', error);
        alert('Error al cargar los canales. Verifica el enlace.');
    }
}

function displayChannels() {
    const nextChannels = channels.slice(displayedChannels, displayedChannels + channelsPerPage);
    nextChannels.forEach(channel => {
        const div = document.createElement('div');
        div.className = 'channel';
        div.textContent = channel.name;
        div.onclick = () => {
            videoPlayer.src = channel.url;
            videoPlayer.play();
        };
        channelList.appendChild(div);
    });
    displayedChannels += nextChannels.length;

    if (displayedChannels >= channels.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

loadUrlBtn.addEventListener('click', () => {
    const m3uUrl = iptvUrlInput.value.trim();
    if (m3uUrl) {
        loadChannels(m3uUrl);
    } else {
        alert('Por favor, ingresa un enlace IPTV válido.');
    }
});

loadMoreBtn.addEventListener('click', displayChannels);
