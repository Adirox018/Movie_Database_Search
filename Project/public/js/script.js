const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7098f6b35990f9109bffe0d1fc61c8ed&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=7098f6b35990f9109bffe0d1fc61c8ed&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

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

const toggleMode = document.getElementById("toggleMode");
const body = document.body;

// Load previously saved mode
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggleMode.textContent = "☀️ Light Mode";
} else {
  body.classList.add("light-mode");
  toggleMode.textContent = "🌙 Dark Mode";
}

// Toggle on button click
toggleMode.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    toggleMode.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    toggleMode.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  }
});
