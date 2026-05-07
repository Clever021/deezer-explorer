const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("artist-name");
const resultsStatus = document.getElementById("results-status");
const resultsList = document.getElementById("results-list");

const DEEZER_BASE_URL = "https://api.deezer.com";
const PROXY_BASE_URL = "https://corsproxy.io/?";
const COVER_FALLBACK_SRC =
  "https://via.placeholder.com/250x250?text=No+Cover";

let selectedArtistId = null;
let selectedArtistName = "";
let selectedAlbumId = null;

function buildProxyUrl(path) {
  const deezerUrl = `${DEEZER_BASE_URL}${path}`;
  return `${PROXY_BASE_URL}${encodeURIComponent(deezerUrl)}`;
}

function renderArtists(artists) {
  resultsList.innerHTML = "";

  for (const artist of artists) {
    const listItem = document.createElement("li");
    listItem.textContent = artist.name;
    listItem.dataset.artistId = String(artist.id);
    listItem.dataset.artistName = artist.name;
    listItem.tabIndex = 0;
    listItem.role = "button";
    listItem.setAttribute("aria-label", `Select artist ${artist.name}`);

    listItem.addEventListener("click", () => {
      selectArtist(artist.id, artist.name);
    });

    listItem.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      selectArtist(artist.id, artist.name);
    });

    resultsList.appendChild(listItem);
  }
}

function renderAlbums(albums) {
  resultsList.innerHTML = "";

  for (const album of albums) {
    const listItem = document.createElement("li");
    listItem.dataset.albumId = String(album.id);
    listItem.tabIndex = 0;
    listItem.role = "button";
    listItem.setAttribute("aria-label", `Select album ${album.title}`);

    const coverImage = document.createElement("img");
    coverImage.src = album.cover_medium || album.cover || COVER_FALLBACK_SRC;
    coverImage.alt = `${album.title} cover`;
    coverImage.width = 120;
    coverImage.height = 120;
    coverImage.loading = "lazy";
    coverImage.addEventListener("error", () => {
      coverImage.src = COVER_FALLBACK_SRC;
    });

    const title = document.createElement("p");
    title.textContent = album.title;

    listItem.appendChild(coverImage);
    listItem.appendChild(title);

    listItem.addEventListener("click", () => {
      selectAlbum(album.id, album.title);
    });

    listItem.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      selectAlbum(album.id, album.title);
    });

    resultsList.appendChild(listItem);
  }
}

function selectArtist(artistId, artistName) {
  selectedArtistId = artistId;
  selectedArtistName = artistName;
  selectedAlbumId = null;
  void loadAlbumsByArtistId(artistId);
}

function selectAlbum(albumId, albumTitle) {
  selectedAlbumId = albumId;
  resultsStatus.textContent = `Selected album: ${albumTitle} (id: ${selectedAlbumId})`;
}

async function loadAlbumsByArtistId(artistId) {
  resultsStatus.textContent = `Loading albums for ${selectedArtistName}...`;
  resultsList.innerHTML = "";

  try {
    const response = await fetch(buildProxyUrl(`/artist/${artistId}/albums`));

    if (!response.ok) {
      throw new Error("Album request failed");
    }

    const data = await response.json();
    const albums = Array.isArray(data.data) ? data.data : [];

    if (albums.length === 0) {
      resultsStatus.textContent = `No albums found for ${selectedArtistName}.`;
      return;
    }

    resultsStatus.textContent = `Showing ${albums.length} album(s) for ${selectedArtistName}.`;
    renderAlbums(albums);
  } catch (error) {
    resultsStatus.textContent = "Could not load albums. Try selecting the artist again.";
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    resultsStatus.textContent = "Type an artist name to start.";
    resultsList.innerHTML = "";
    return;
  }

  resultsStatus.textContent = "Searching...";
  resultsList.innerHTML = "";
  
  try {
    const response = await fetch(
      buildProxyUrl(`/search/artist?q=${encodeURIComponent(query)}`)
    );
  
    if (!response.ok) {
      throw new Error("Request failed");
    }
  
    const data = await response.json();
    const artists = Array.isArray(data.data)
      ? data.data.map((artist) => ({
          id: artist.id,
          name: artist.name,
        }))
      : [];
  
    if (artists.length === 0) {
      resultsStatus.textContent = "No artists found.";
      return;
    }
  
    resultsStatus.textContent = `Showing ${artists.length} result(s).`;
    renderArtists(artists);
  } catch (error) {
    resultsStatus.textContent = "API unavailable. Showing fallback artists.";
  
    renderArtists([
      { id: 75798, name: "Adele" },
      { id: 13, name: "Eminem" },
      { id: 246791, name: "The Weeknd" },
      { id: 1424602, name: "Drake" },
      { id: 1424821, name: "Matuê" },
    ]);
  }
  });