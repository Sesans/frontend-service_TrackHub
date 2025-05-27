import { fetchSongs, likeSong } from "./api.js";
import { createSongCard, toggleShowMore } from "./dom.js";

document.addEventListener("DOMContentLoaded", () =>{
  let currentPage = 0;
  const pageSize = 10;

  async function loadSongs(page) {
    try{
      const data = await fetchSongs(currentPage, pageSize);
      data.songs.forEach((song, index) => {
        const card = createSongCard(song, index + currentPage * pageSize);
        document.querySelector('#music-feed').appendChild(card);
      });

      toggleShowMore(data.hasNext);
      currentPage++;
    }catch(error){
      console.error("Error loading songs", error);
    }
  }
  loadSongs();

  document.querySelector('.show-btn').addEventListener('click', () =>{
    loadSongs();
  });
});