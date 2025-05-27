export async function fetchSongs(page, size, sortBy = 'LIKE_COUNT', direction = 'DESC') {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8082/music/search?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    const headers = {
        'Content-type': 'application/json',
    };
    
    if(token){
        headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(url, {headers});
    if(!response.ok) throw new Error('Error fetching songs');
    return await response.json();
}

export async function likeSong(songId, method = 'POST') {
    const token = localStorage.getItem('token');
    const likeResponse = await fetch(`http://localhost:8082/likes/${songId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });

    return likeResponse;
}