const auth = "563492ad6f91700001000001662c3fad697f412186d1a822197569f6";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let nextPage = 2;
let fetchLink;
let searchActive;

// Event Listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchValue) {
    searchActive = searchValue;
    searchPhotos(searchActive);
  }
  searchValue = "";
});
more.addEventListener("click", () => {
  forMore();
});

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

async function generatePhotos(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <img src=${photo.src.large}></img>
        `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated/?page=1&per_page=15";
  const data = await fetchApi(fetchLink);
  generatePhotos(data);
}

async function searchPhotos(query) {
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&page=1&per_page=15`;
  clear();
  const data = await fetchApi(fetchLink);
  generatePhotos(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function forMore() {
  if (searchActive) {
    fetchLink = `https://api.pexels.com/v1/search?query=${searchActive}&page=${nextPage}&per_page=15`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated/?page=${nextPage}&per_page=15`;
  }
  nextPage++;
  const data = await fetchApi(fetchLink);
  generatePhotos(data);
}

curatedPhotos();
