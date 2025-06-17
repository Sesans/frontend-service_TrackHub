import { autoCompleteSuggest, likeSong } from "./api.js";
import { isUserLogged, navigateToSong } from "./songs-router.js";

export function createSongCard(song, index){
    const card = document.createElement('a');
    card.className = 'music-card';
    const likeIconClass = song.liked ? 'fas':'far';
    const likedClass = song.liked ? 'liked':'';

    card.innerHTML = `
        <div class="song-index"><span>${index + 1}. </span></div>
        <div class="card-content">
            <div class="card-redirect">
                <div class="card-title">${song.title}</div>
                <div class="card-album">${song.artist}</div>
            </div>
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

    card.querySelector('.card-redirect').addEventListener('click', () => navigateToSong(song.id));
    card.querySelector('.like-btn').addEventListener('click', async(e) => {
        if(!isUserLogged()){
            showLoginModal();
            return;
        }
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

export function createSongDetails(song){
    document.querySelector('.song-title').textContent = song.title;
    document.querySelector('.song-artist').textContent = song.artist;

    const formattedLyrics = song.lyrics
        .split('/n/n')
        .map(verse =>
            verse
            .split('/n')
            .map(line => `<p class="verse">${line}</p>`)
            .join('')
        )
        .map(block => `<div class="verse-block">${block}</div>`)
        .join('');

    document.querySelector('.lyrics').innerHTML = formattedLyrics;
}

export function toggleShowMore(hasNext){
    const btn = document.querySelector('.show-btn');
    if(!hasNext){
        btn.classList.add('hide-btn');
    }else{
        btn.classList.remove('hide-btn');
    }
}

export async function toggleSuggestionList(input){
    const list = document.querySelector('.suggestion-list');
    const inputElement = document.querySelector('.search-bar');

    if (!input.trim()) {
        list.innerHTML = '';
        list.classList.remove('visible');
        inputElement.classList.remove('remove-bottom');
        return;
    }
    try{
        const response = await autoCompleteSuggest(input);

        if(response.ok){
            const suggestData = await response.json();
            
            if(suggestData.length > 0){
                list.innerHTML = '';
                suggestData.forEach(song => {
                    const li = document.createElement('li');
                    li.classList.add('suggestion-item');

                    const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(escapedInput, 'ig');

                    const highlightedTitle = song.title.replace(regex, match => `<mark>${match}</mark>`);
                    const highlightedArtist = song.artist.replace(regex, match => `<mark>${match}</mark>`);
                    li.innerHTML = `<li>${highlightedTitle} - ${highlightedArtist}</li>`

                    li.setAttribute('tabindex', '0');
                    li.addEventListener('click', () =>{
                        if(song.id){
                            window.location.href = `/pages/feed-page.html?songId=${song.id}`;
                        }else{
                            console.error('song id not found: ', song);
                        }
                    });

                    li.addEventListener('keydown', (e) =>{
                        if(e.key === 'Enter'){
                            if(song.id)
                                window.location.href = `/pages/song.html?id=${song.id}`
                        }
                    });

                    list.appendChild(li); 
                });

                list.classList.add('visible');
                inputElement.classList.add('remove-bottom');
            } else{
                list.innerHTML = '';
                list.classList.remove('visible');
                inputElement.classList.remove('remove-bottom');
            }
        }
    }catch(error){
        console.log('Error in suggestion list', error);
        list.innerHTML = '';
    }
}

function showLoginModal(){
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
    <div class="modal-content">
        <p>You need to be logged in to like a song!</p>
        <a href="/pages/login.html" class="modal-login-btn">Login</a>
    </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.remove();
    });
}