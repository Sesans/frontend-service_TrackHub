import { loadSong, loadSongList } from "./loadComponent.js";

export function handleSongRoute(){
    const params = new URLSearchParams(window.location.search);
    const songId = params.get('songId');
    const root = document.getElementById('songs-content');
    root.innerHTML = '';

    if(songId){
        loadSong(songId, root).then(() =>{
            document.getElementById('song-title')?.focus();
        });
    }else{
        loadSongList(root).then(() =>{
            document.getElementById('music-feed')?.focus();
        });
    }
}

export function navigateToSong(id){
    history.pushState({}, '', `/pages/feed-page.html?songId=${id}`);
    handleSongRoute();
}

export function navigateBackToList(){
    history.pushState({}, '', `/pages/feed-page.html`);
    handleSongRoute();
}

if(window.location.pathname.includes('/feed-page.html')){
    window.addEventListener('popstate', handleSongRoute);
    handleSongRoute();
}

export function isUserLogged(){
    return !!localStorage.getItem('token');
}