const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7098f6b35990f9109bffe0d1fc61c8ed&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=7098f6b35990f9109bffe0d1fc61c8ed&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupOverview = document.getElementById("popup-overview");
const popupRating = document.getElementById("popup-rating");
const closeBtn = document.getElementById("closePopup");
const addToFavoritesBtn = document.getElementById("addToFavoritesBtn");
const myFavoritesBtn = document.getElementById("myFavoritesBtn");

let currentMovie = {};

returnMovies(APILINK);

function returnMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      main.innerHTML = "";
      data.results.forEach(movie => {
        const div_card = document.createElement('div');
        div_card.className = 'card';

        const title = document.createElement('h3');
        title.innerText = movie.title;

        const image = document.createElement('img');
        image.className = 'thumbnail';
        image.src = IMG_PATH + movie.backdrop_path;

        div_card.appendChild(image);
        div_card.appendChild(title);

        div_card.addEventListener("click", () => {

          popupImg.src = IMG_PATH + movie.backdrop_path;
          popupTitle.textContent = movie.title;
          popupOverview.textContent = movie.overview || "No description available.";
          popupRating.innerHTML = `<strong>⭐ Rating:</strong> ${movie.vote_average} / 10`;
          popup.style.display = "block";

          currentMovie = {
            title: movie.title,
            image: IMG_PATH + movie.backdrop_path

          };
        });

        main.appendChild(div_card);
      });
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchItem = search.value.trim();
  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
});

document.getElementById('refreshButton').addEventListener('click', function (event) {
  event.preventDefault();
  returnMovies(APILINK);
});

// ================== Light / Dark Mode ===================
const toggleMode = document.getElementById("toggleMode");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggleMode.textContent = "☀️Mode";
} else {
  body.classList.add("light-mode");
  toggleMode.textContent = "🌙Mode";
}

toggleMode.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    toggleMode.textContent = "🌙Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    toggleMode.textContent = "☀️Mode";
    localStorage.setItem("theme", "dark");
  }
});

// ================== Popup Close Logic ===================
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

// ================== Add to Favorites ===================
addToFavoritesBtn.addEventListener("click", () => {
  console.log("Sending favorite:", currentMovie); // for debugging
  fetch('/add-favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentMovie)
  })
  .then(res => {
    return res.text();
  })
  .then(text => {
    if (text === "Added") alert("✅ Added to favorites!");
    else alert("❌ " + text);
  })
  .catch(err => {
    console.error("Fetch error:", err);
    alert("❌ Network error");
  });
});


// ================== Go to My Favorites Page ===================
myFavoritesBtn.addEventListener("click", () => {
  window.location.href = "/favorites";
});
