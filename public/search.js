const API = "http://localhost:3000";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const favoritesDiv = document.getElementById("favorites");

const USER_ID = "student-user";

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value;
  if (!query) return;

  const res = await fetch(`${API}/api/geocode?name=${query}`);
  const data = await res.json();

  resultsDiv.innerHTML = "";

  (data.results || []).forEach(location => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${location.name}</h3>
      <p>${location.country}</p>

      <button onclick="getWeather(${location.latitude}, ${location.longitude})">
        Weather
      </button>

      <button onclick="saveFavorite('${location.name}', ${location.latitude}, ${location.longitude})">
        Save
      </button>
    `;

    resultsDiv.appendChild(div);
  });
});

async function getWeather(lat, lon) {

  const res = await fetch(
    `${API}/api/weather?latitude=${lat}&longitude=${lon}`
  );

  const data = await res.json();

  alert(`Temp: ${data.current.temperature_2m}°F`);
}

async function loadFavorites() {
  const res = await fetch(`${API}/api/favorites?user_id=${USER_ID}`);
  const data = await res.json();

  favoritesDiv.innerHTML = "";

  (data.favorites || []).forEach(f => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${f.name}</h3>
      <button onclick="deleteFavorite(${f.id})">Delete</button>
    `;

    favoritesDiv.appendChild(div);
  });
}

async function deleteFavorite(id) {
  await fetch(`${API}/api/favorites/${id}`, { method: "DELETE" });
  loadFavorites();
}

loadFavorites();