import {
  getToken,
  getAllCategories,
  getCategoryPlaylist,
  getTracks,
  getTrack,
} from "./model.js";

// UI Var

function browseContent() {
  let browseContainer = document.querySelector(".browse-container");
  let rowContainer = document.querySelector(".row");
  let spinnerContainer = document.querySelector(".spinner-container");

  document.addEventListener("DOMContentLoaded", setUpCategory);

  async function setUpCategory() {
    //   Get Token From API
    let tokenData = await getToken();
    // Get All Categories from API
    let allCategories = await getAllCategories(tokenData);
    let allCategoriesData = allCategories.categories.items;

    allCategoriesData.forEach((category) => {
      let colDiv = document.createElement("div");
      colDiv.classList.add("col-3");
      colDiv.setAttribute("id", category.id);

      colDiv.style.backgroundImage = `url(${category.icons[0].url})`;

      colDiv.innerText = category.name;

      deactivateSpinner(spinnerContainer);
      rowContainer.appendChild(colDiv);
    });

    removeClass(browseContainer, "category");
    addClass(browseContainer, "playlist");

    document.removeEventListener("DOMContentLoaded", setUpCategory);

    browseContainer.addEventListener("click", setUpPlaylist);
  }
  async function setUpPlaylist(e) {
    activeSpinner(spinnerContainer);
    rowContainer.innerHTML = "";

    let tokenData = await getToken();
    let categoriesPlaylists = await getCategoryPlaylist(tokenData, e.target.id);

    let playlists = categoriesPlaylists.playlists.items;

    rowContainer.innerHTML = ` <div class="browse-caption col-12">Playlists</div>`;

    browseContainer.classList.add("playlists");
    playlists.forEach((playlist) => {
      let colDiv = document.createElement("div");
      colDiv.classList.add("col-3");
      colDiv.setAttribute("id", playlist.id);
      colDiv.style.backgroundImage = `url(${playlist.images[0].url})`;
      colDiv.innerText = playlist.name;

      spinnerContainer.style.opacity = "0";
      rowContainer.appendChild(colDiv);
    });

    removeClass(browseContainer, "playlist");
    addClass(browseContainer, "tracks");
    browseContainer.removeEventListener("click", setUpPlaylist);
    browseContainer.addEventListener("click", setUpTracks);
    deactivateSpinner(spinnerContainer);
  }

  async function setUpTracks(e) {
    activeSpinner(spinnerContainer);
    let token = await getToken();
    let tracks = await getTracks(token, e.target.id);
    browseContainer.innerHTML = `<div class="row main-container">
        <div class="browse-caption col-12 caption-reduced">Playlist Name</div>
        <div class="row tracks-section">
          <div class="col-4 tracks-container">
           
          </div>
          <div class="col-6 tracks-detail">
            <div class="row p-0 info-top">
              <div class="col-4 picture-section"></div>
              <div class="col-5 track-info-container">
                <div class="track-name">Track Name</div>
                <div class="artist-name">Artist Name</div>
                <div class="album-name">Album Name</div>
              </div>
              <div class="col-3 icon-container-play p-0 m-0">
               <a> <i class="far fa-play-circle"></i></a>
              </div>
            </div>
          
          </div>
        </div>`;
    let tracksContainer = document.querySelector(".tracks-container");

    let allTracks = tracks.items;

    allTracks.forEach((track) => {
      let rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      rowDiv.classList.add("track-section");
      let textNode = document.createTextNode(track.track.name);
      rowDiv.appendChild(textNode);
      rowDiv.setAttribute("id", track.track.id);
      tracksContainer.append(rowDiv);
    });
    removeClass(browseContainer, "tracks");
    addClass(browseContainer, "track");
    browseContainer.removeEventListener("click", setUpTracks);
    browseContainer.addEventListener("click", setUpTrackInfo);
    deactivateSpinner(spinnerContainer);
  }

  async function setUpTrackInfo(e) {
    activeSpinner(spinnerContainer);
    let token = await getToken();
    let track = await getTrack(token, e.target.id);
    let trackDetail = document.querySelector(".tracks-detail");
    let allArtists = track.artists;
    let artistsNames = "";
    if (allArtists.length == 1) {
      artistsNames = allArtists[0].name;
    } else {
      allArtists.forEach((artist) => {
        artistsNames += `${artist.name} ,`;
      });
    }

    console.log(track.album.images[0].url);

    trackDetail.innerHTML = `<div class="row p-0 info-top">
              <div class="col-4 picture-section">
              <img
                  src=${track.album.images[0].url}
                  alt=""
                />
              </div>
              <div class="col-5 track-info-container">
                <div class="track-name">${track.name}</div>
                <div class="artist-name">${artistsNames}</div>
                <div class="album-name">${track.album.name}</div>
              </div>
              <div class="col-3 icon-container-play p-0 m-0">
               <a> <i class="far fa-play-circle"></i></a>
              </div>`;
  }
  deactivateSpinner(spinnerContainer);
}

function addClass(addTo, addClass) {
  addTo.classList.add(addClass);
}

function removeClass(removeFrom, removeClass) {
  removeFrom.classList.remove(removeClass);
}
function activeSpinner(spinnerContainer) {
  spinnerContainer.style.opacity = "1";
  spinnerContainer.style.display = "flex";
}

function deactivateSpinner(spinnerContainer) {
  spinnerContainer.style.opacity = "0";
  spinnerContainer.style.display = "none";
  spinnerContainer.style.pointerEvents = "none";
}
export { browseContent };
