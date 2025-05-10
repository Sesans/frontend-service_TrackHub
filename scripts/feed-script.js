document.addEventListener("DOMContentLoaded", () =>{
  const feed = document.querySelector('#music-feed');

  async function loadSongs() {
    try {
      const response = await fetch('http://localhost:8082/music/list')
      const songs = await response.json();
      
      songs.forEach(song => {
        const card = document.createElement('a');
        card.className = 'music-card';
        card.innerHTML = `
          <img src="music_img.jpg" alt="music cover">
          <div class="card-content">
            <div class="card-title">${song.title}</div>
            <div class="card-composer">${song.compositor}</div>
            <div class="card-buttons">
              <button>Like</button>
              <button>Share</button>
            </div>
          </div>
        `;
        feed.appendChild(card);
      });
  
    } catch (error) {
      console.log('Não foi possível carregar as músicas', error);
    }
  }
  
  loadSongs();
});