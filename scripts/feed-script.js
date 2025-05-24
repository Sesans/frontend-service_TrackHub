document.addEventListener("DOMContentLoaded", () =>{
  const token = localStorage.getItem('token');
  const feed = document.querySelector('#music-feed');

  async function loadSongs() {
    try {
      const header = {
        'Content-type': 'application/json',
      }
      if(token){
        header['Authorization'] = 'Bearer ' + token;
      }
      console.log(token);
      const response = await fetch('http://localhost:8082/music/list', {
        method: 'GET',
        headers: header,
      });

      const songs = await response.json();
      
      songs.forEach((song, index) => {
        const card = document.createElement('a');
        const likeIconClass = song.liked ? 'fas' : 'far';
        const likedClass = song.liked ? 'liked' : '';
        console.log(likedClass);

        card.className = 'music-card';
        card.innerHTML = `
          <div class="song-index"><span>${index}. </span></div>
          <div class="card-content">
            <div class="card-title">${song.title}</div>
            <div class="card-album">${song.album}</div>
            <div class="card-buttons">
              <button class="like-btn ${likedClass}">
              <i class="${likeIconClass} fa-heart"></i> 
              <span class="like-span">${song.likeCount}</span>
              </button>
              <button>
              <i class="far fa-comment"></i> 
              <span>${song.commentCount}</span>
              </button>
            </div>
          </div>
        `;


        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', async (e) =>{
          e.preventDefault();

          const isLiked = likeBtn.classList.contains('liked');
          const likeSpan = likeBtn.querySelector('.like-span');
          const icon = likeBtn.querySelector('i');
          let count = parseInt(likeSpan.textContent);
          const method = song.liked ? 'DELETE' : 'POST';
          
          try{
            const likeResponse = await fetch(`http://localhost:8082/likes/${song.id}`, {
              method: method,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            });
            
            if(likeResponse.ok){
              if(isLiked){
                likeBtn.classList.remove('liked');
                icon.classList.replace('fas', 'far');
                likeSpan.textContent = count - 1;
              } else{
                likeBtn.classList.add('liked');
                icon.classList.replace('far', 'fas');
                likeSpan.textContent = count + 1;
              }
            } else{
              console.error('Erro ao curtir música:', likeResponse.status);
            }

          } catch(error){
            console.error('Erro na requisição de like:', error);
          }
        });

        feed.appendChild(card);
      });
  
    } catch (error) {
      console.log('Não foi possível carregar as músicas', error);
    }
  }
  
  loadSongs();
});