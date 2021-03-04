import {
  getToken,
  getAllCategories,
  getCategoryPlaylist,
  getTracks,
  getTrack,
  searchTrack,
} from "./model.js";

// UI Var

function browseContent() {
  let browseContainer = document.querySelector(".browse-container");
  let rowContainer = document.querySelector(".row");
  let spinnerContainer = document.querySelector(".spinner-container");

  activeSpinner(spinnerContainer);

  document.addEventListener("DOMContentLoaded", setUpCategory);

  async function setUpCategory() {
    //   Get Token From API
    let tokenData = await getToken();
    // Get All Categories from API
    let allCategories = await getAllCategories(tokenData);
    let allCategoriesData = allCategories.categories.items;
    activeSpinner(spinnerContainer);
    allCategoriesData.forEach((category) => {
      let colDiv = document.createElement("div");
      colDiv.classList.add("col-3");
      colDiv.classList.add("displays");
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
    deactivateSpinner(spinnerContainer);
  }

  async function setUpPlaylist(e) {
    if (e.target.classList.contains("displays")) {
      //
      rowContainer.innerHTML = "";
      activeSpinner(spinnerContainer);
      let tokenData = await getToken();
      let categoriesPlaylists = await getCategoryPlaylist(
        tokenData,
        e.target.id
      );
      let playlists = categoriesPlaylists.playlists.items;

      rowContainer.innerHTML = ` <div class="browse-caption col-12">Playlists</div>`;
      browseContainer.classList.add("playlists");
      playlists.forEach((playlist) => {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-3");
        colDiv.classList.add("displays");
        colDiv.setAttribute("id", playlist.id);
        colDiv.setAttribute("rec", playlist.name);
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
    } else {
      console.log("Invalid Area");
    }
  }

  async function setUpTracks(e) {
    if (e.target.classList.contains("displays")) {
      activeSpinner(spinnerContainer);
      let token = await getToken();
      let tracks = await getTracks(token, e.target.id);
      let playlistName = e.target.getAttribute("rec");

      browseContainer.innerHTML = `<div class="row main-container">
        <div class="browse-caption col-12 caption-reduced">${playlistName}</div>
        <div class="row tracks-section">
          <div class="col-4 tracks-container">
          </div>
          <div class="col-6 tracks-detail">
            <div class="row p-0 info-top">
              <div class="col-4 picture-section"></div>
              <div class="col-8 track-info-container">
                <div class="track-name"></div>
                <div class="artist-name"></div>
                <div class="album-name"></div>
              </div>
              <div class="col-3 icon-container-play p-0 m-0">
              
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
        let iTag = document.createElement("i");
        iTag.classList.add("fas");
        iTag.classList.add("fa-heart");
        if (searchTrack(track.track)) {
          iTag.classList.add("red");
        }
        rowDiv.appendChild(iTag);
        tracksContainer.append(rowDiv);
      });
      removeClass(browseContainer, "tracks");
      addClass(browseContainer, "track");
      browseContainer.removeEventListener("click", setUpTracks);
      browseContainer.addEventListener("click", setUpTrackInfo);
      deactivateSpinner(spinnerContainer);
    } else if (e.target.classList.contains("fa-heart")) {
      console.log("Fav");
    } else {
    }
  }

  async function setUpTrackInfo(e) {
    // If tracks are selected
    if (e.target.classList.contains("track-section")) {
      activeSpinner(spinnerContainer);
      let token = await getToken();
      let track = await getTrack(token, e.target.id);

      console.log(track);
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
      console.log(track);

      trackDetail.innerHTML = `<div class="row p-0 info-top">
                <div class="col-4 picture-section">
                <img
                    src=${track.album.images[0].url}
                    alt=""
                  />
                </div>
                <div class="col-8 track-info-container">
                  <div class="track-name">${track.name}</div>
                  <div class="artist-name">${artistsNames}</div>
                  <div class="album-name">${track.album.name}</div>
                </div>
                <div class="col-3 icon-container-play p-0 m-0">
                 <a href=${track.external_urls.spotify} target="_blank" class="redirect-play" > <i class="far fa-play-circle"></i> </a>
                </div>`;
      deactivateSpinner(spinnerContainer);
    }
    // If favorites is touched
    else if (e.target.classList.contains("fa-heart")) {
      let token = await getToken();
      let track = await getTrack(token, e.target.parentElement.id);
      let allArtists = track.artists;
      let artistsNames = "";
      if (allArtists.length == 1) {
        artistsNames = allArtists[0].name;
      } else {
        allArtists.forEach((artist) => {
          artistsNames += `${artist.name} ,`;
        });
      }
      let data = {
        trackName: track.name,
        artistsName: artistsNames,
        albumName: track.album.name,
        id: track.id,
      };
      addItem(data, e.target);
    }
  }

  (async function searchInfo() {
    let token = await getToken();
    let result = await searchTrack(token, "Muse");
    console.log(result);
  })();
}

function addItem(itemToAdd, heart) {
  let arrayValue = JSON.parse(getItems());
  if (arrayValue == null) {
    arrayValue = [];
  } else if (searchDB(itemToAdd)) {
    let newValues = [];
    let oldValues = JSON.parse(getItems());
    for (let i = 0; i < oldValues.length; i++) {
      if (oldValues[i].id == itemToAdd.id) {
        continue;
      } else {
        newValues.push(oldValues[i]);
        localStorage.setItem("Favorites", JSON.stringify(newValues));
        heart.classList.remove("red");
      }
    }
    console.log(newValues);
    return;
  }
  arrayValue.push(itemToAdd);
  localStorage.setItem("Favorites", JSON.stringify(arrayValue));
  heart.classList.add("red");
  console.log("Added");
}

function getItems() {
  return localStorage.getItem("Favorites");
}

function searchDB(itemToAdd) {
  let found = false;
  let values = JSON.parse(getItems());
  for (let i = 0; i < values.length; i++) {
    if (values[i].id == itemToAdd.id) {
      console.log("Item Found");
      found = true;
      break;
    }
    console.log("Item Not found");
  }
  return found;
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

function searchPage() {
  let searchBar = document.querySelector(".search-bar");
  searchBar.addEventListener("keyup", (e) => {});
}
export { browseContent };
