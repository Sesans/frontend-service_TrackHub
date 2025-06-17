import { toggleSuggestionList } from "./dom.js";
import { setupFeed, setupSongDetail } from "./feed-script.js";
import { isUserLogged, navigateBackToList } from "./songs-router.js";

export async function loadHeader(){
  const container = document.getElementById('header-container');
  if(!container)
    return;

  try{
    const response = await fetch('/components/header.html');
    const html = await response.text();
    container.innerHTML = html;
  }catch(error){
    console.error('Error loading header:', error);
  }
  const accountBtn = document.querySelector('.account-btn a');

  if(isUserLogged()){
    accountBtn.textContent = 'Perfil';
    accountBtn.setAttribute('href', '/pages/profile.html');
  }

  const input = document.querySelector('.search-bar');
  input.addEventListener('input', debounce((e) => toggleSuggestionList(e.target.value), 300));
}

export async function loadSongList(root){
  if(!root) return;

  try{
    const response = await fetch('/components/songListComponent.html');
    const html = await response.text();
    root.innerHTML = html;

    setupFeed();

  }catch(error){
    console.error('Error loading song list', error);
  }
}

export async function loadSong(songId, root){
  if(!songId) return;

  try{
    const response = await fetch('/components/songDetailComponent.html');
    const html = await response.text();
    root.innerHTML = html;

    const backBtn = document.getElementById('back-to-list').addEventListener('click', navigateBackToList);

    setupSongDetail(songId);
  }catch(error){
    console.error('Error loading song list', error);
  }
}

function debounce(func, delay){
  let timer;
  return (...args) =>{
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
  };
}