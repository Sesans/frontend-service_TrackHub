import { fetchSongs, getSong } from "./api.js";
import { createSongCard, createSongDetails, toggleShowMore } from "./dom.js";
import { loadHeader } from "./loadComponent.js";
import { handleSongRoute } from "./songs-router.js";

document.addEventListener("DOMContentLoaded", () =>{
  loadHeader();
  handleSongRoute();
});

export function setupFeed(){
  let currentPage = 0;
  const pageSize = 10;

  async function loadSongs(){
    let songs;
    let hasNext;

    if (currentPage === 0) {
      const cached = sessionStorage.getItem('cachedSongs');
      if(cached){
        const parsed = JSON.parse(cached);
        songs = parsed.songs;
        hasNext = parsed.hasNext;

        songs.forEach((song, index) => {
          const card = createSongCard(song, index + currentPage * pageSize);
          document.querySelector('#music-feed').appendChild(card);
        });

        toggleShowMore(hasNext);
        currentPage++;
        return;
      }
    }
    
    try{
      const data = await fetchSongs(currentPage, pageSize);
      songs = data.songs;
      hasNext = data.hasNext;

      if(currentPage === 0){
        sessionStorage.setItem('cachedSongs', JSON.stringify(data));
      }

      songs.forEach((song, index) => {
        const card = createSongCard(song, index + currentPage * pageSize);
        document.querySelector('#music-feed').appendChild(card);
      });

      toggleShowMore(hasNext);
      currentPage++;
    }catch(error){
      console.error("Error loading songs", error);
    }
  }
  loadSongs();

  document.querySelector('.show-btn').addEventListener('click', () =>{
  loadSongs();
  });
}

export async function setupSongDetail(songId){
  try{
    const data = await getSong(songId);
    createSongDetails(data);
  }catch(error){
    console.error('Error loading song: ', error);
  }


}