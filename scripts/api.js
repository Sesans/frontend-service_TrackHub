export async function fetchSongs(page, size, sortBy = 'LIKE_COUNT', direction = 'DESC') {
    const url = `http://localhost:8082/music/search?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if(token){
        headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(url, {headers});
    if(!response.ok) throw new Error('Error fetching songs');
    return await response.json();
}

export async function getSong(id) {
    const url = `http://localhost:8082/music/${id}`;
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };

    if(token){
        headers['Authorization'] = 'Bearer ' + token;
    }
    const getResponse = await fetch(url, {headers});
    if(!getResponse.ok) throw new Error('Error fetching songs');
    return await getResponse.json();
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

export async function autoCompleteSuggest(query) {
    if(!query.trim()) return;
    const suggestResponse = await fetch(`http://localhost:8082/music/autocomplete?query=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return suggestResponse;
}