const APIController = (function () {
  const clientID = "";
  const clientSecret = "";

  const _getToken = async () => {
    const result = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic" + btoa(clientID + ":" + clientSecret),
      },
      body: ("grant_type" = "client_credentials"),
    });
    const data = await result.json();
    return data.access_token;
  };
  const _getGenres = async (token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
      {
        method: "GET",
        headers: { Authorization: "Bearer" + token },
      }
    );
    const data = await result.json();
    return data.catagories.items;
  };
  const _getPlaylistByGenre = async (token, genreId) => {
    const limit = 10;
    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer" + token },
      }
    );
    const data = await result.json();
    return data.playlists.items;
  };
  const _getTracks = async (token, tracksEndPoint) => {
    const limit = 10;
    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: "GET",
      headers: { Authorization: "Bearer" + token },
    });
    const data = await result.json();
    return data.items;
  };
  const _getTrack = async (token, trackEndPoint) => {
    const limit = 10;
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer" + token },
    });
    const data = await result.json();
    return data;
  };
  return {
    getToken() {
      return _getToken();
    },
    getGenres(token) {
      return _getGenres(token);
    },
    getPlaylistByGenre(token, genreId) {
      return _getPlaylistByGenre(token, genreId);
    },
    getTracks(token, tracksEndPoint) {
      return _getTracks(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint);
    },
  };
})();

const APPController = (function (UICtrl, APICtrl) {
  const DOMInputs = UICtrl.inputField();

  const loadGenres = async () => {
    const token = await APICtrl.getToken();
    UICtrl.storeToken(token);
    const genres = await APICtrl.getGenres(token);
    genres.forEach((element) => UICtrl.createGenre(element.name, element.id));
  };
  DOMInputs.genre.addEventListener("change", async () => {
    UICtrl.resetPlaylist();
    const token = UICtrl.getStored().token;
    const genreSelect = UICtrl.inputField().genre;
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
    console.log(playlists);
    playlists.forEach((p) => UICtrl.createPlaylist(p.name, p.tracks.href));
  });
  DOMInputs.submit.addEventListener("click", async (e) => {
    e.preventDefault();
    UICtrl.resetTracks();
    const token = UICtrl.getStoredToken().token;
    const playlistSelect = UICtrl.inputField().playlist;
    const tracksEndPoint =
      playlistSelect.options[playlistSelect.selectedIndex].value;
    const tracks = await APICtrl.getTracks(token, tracksEndPoint);
    tracks.forEach((el) => UICtrl.createTrack(el.track.href, el.track.name));
  });
  DOMInputs.tracks.addEventListener("click", async (e) => {
    e.preventDefault();
    UICtrl.resetTrackDetail();
    const token = UICtrl.getStoredToken().token;
    const trackEndpoint = e.target.id;
    const track = await APICtrl.getTrack(token, trackEndpoint);
    //  UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
  });
  return {
    init() {
      console.log("App is starting");
      loadGenres();
    },
  };
})(UIController, APIController);
APPController.init();
