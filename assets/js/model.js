async function getToken() {
  const clientId = "69b5143b7be746089690eeac9adb1804";
  const clientSecret = "b4b8fea09b6a4983ad2cabefd49fe8bf";
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
}

async function getAllCategories(token) {
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?country=US&locale=sv_US`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );

  const data = await result.json();
  return data;
}

async function getCategoryPlaylist(token, categoryID) {
  let result = await fetch(
    `https://api.spotify.com/v1/browse/categories/${categoryID}/playlists`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );

  const data = await result.json();
  return data;
}

async function getTracks(token, playlistID) {
  let result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );

  const data = await result.json();
  return data;
}

async function getTrack(token, trackID) {
  let result = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
  });

  const data = await result.json();
  return data;
}

async function searchTrack(token, query) {
  let result = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track%2Cartist`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );

  const data = await result.json();
  return data;
}

export {
  getToken,
  getAllCategories,
  getCategoryPlaylist,
  getTracks,
  getTrack,
  searchTrack,
};
