//const MOCK_ARTISTS = [
  //"Daft Punk",
  //"Adele",
  //"Coldplay",
 // "Linkin Park",
 // "Beyonce",
 // "Arctic Monkeys",
 // "Bruno Mars",
 // "The Weeknd",
 // "Matue",
//];


const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("artist-name");
const resultsStatus = document.getElementById("results-status");
const resultsList = document.getElementById("results-list");

function renderArtists(artists) {
  resultsList.innerHTML = "";

  for (const artist of artists) {
    const listItem = document.createElement("li");
    listItem.textContent = artist;
    resultsList.appendChild(listItem);
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

  resultsStatus.textContent = "Searching...";
  resultsList.innerHTML = "";
  
  try {
    const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`;
   const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(deezerUrl)}`;
  
    const response = await fetch(proxyUrl);
  
    if (!response.ok) {
      throw new Error("Request failed");
    }
  
    const data = await response.json();
  
    const artists = data.data.map((artist) => artist.name);
  
    if (artists.length === 0) {
      resultsStatus.textContent = "No artists found.";
      return;
    }
  
    resultsStatus.textContent = `Showing ${artists.length} result(s).`;
    renderArtists(artists);
  } catch (error) {
    resultsStatus.textContent = "Could not load results. Try again.";
  }
});
