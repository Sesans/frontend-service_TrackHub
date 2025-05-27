export function createSongCard(song, index){
    const card = document.createElement('a');
    card.className = 'music-card';
    const likeIconClass = song.liked ? 'fas':'far';
    const likedClass = song.liked ? 'liked':'';

    card.innerHTML = `
          <div class="song-index"><span>${index + 1}. </span></div>
          <div class="card-content">
            <div class="card-title">${song.title}</div>
            <div class="card-album">${song.artist}</div>
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

    card.querySelector('.like-btn').addEventListener('click', async(e) => {
        e.preventDefault();

        const likeBtn = e.currentTarget;
        const isLiked = likeBtn.classList.contains('liked');
        const likeSpan = likeBtn.querySelector('.like-span');
        const icon = likeBtn.querySelector('i');
        let count = parseInt(likeSpan.textContent);
        const method = song.liked ? 'DELETE' : 'POST';
        
        try{
            const likeResponse = await likeSong(song.id, method);
            
            if(likeResponse.ok){
                if(isLiked){
                    likeBtn.classList.remove('liked');
                    icon.classList.replace('fas', 'far');
                    likeSpan.textContent = count - 1;
                    song.liked = false;
                } else{
                    likeBtn.classList.add('liked');
                    icon.classList.replace('far', 'fas');
                    likeSpan.textContent = count + 1;
                    song.liked = true;
                }   
            }
        } catch(error){
          console.error('Error in like:', error);
        }
    });
    return card;
}

export function toggleShowMore(hasNext){
    const btn = document.querySelector('.show-btn');
    if(!hasNext){
        btn.classList.add('hide-btn');
    }else{
        btn.classList.remove('hide-btn');
    }
}