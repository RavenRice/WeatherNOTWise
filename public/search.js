const API = "http://localhost:3000";

window.onload = () => {
  document.getElementById("searchBtn").onclick = searchLocation;
  loadFavorites();
};

async function searchLocation() {
  const input = document.getElementById("searchInput").value.trim();
  const results = document.getElementById("results");

  if (!input) {
    results.innerHTML = "Enter a location.";
    return;
  }

  results.innerHTML = "Loading...";

  const res = await fetch(`${API}/api/geocode?name=${encodeURIComponent(input)}`);
  const data = await res.json();

  results.innerHTML = "";

  if (!data.results || data.results.length === 0) {
    results.innerHTML = "No results found";
    return;
  }

  data.results.forEach(place => {
    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <h3>${place.name}${place.country ? `, ${place.country}` : ""}</h3>
      <p>${place.latitude}, ${place.longitude}</p>
      <button onclick="getWeather(${place.latitude}, ${place.longitude})">Weather</button>
      <button onclick='saveFav("${place.name.replace(/"/g, '\\"')}", ${place.latitude}, ${place.longitude})'>Save</button>
    `;
    results.appendChild(div);
  });
}

async function getWeather(lat, lon) {
  const weatherBox = document.getElementById("current-weather");
  const tipsBox = document.getElementById("tips");
  const chartCanvas = document.getElementById("forecastChart");

  const res = await fetch(`${API}/api/weather?latitude=${lat}&longitude=${lon}`);
  const data = await res.json();

  if (!data.current) {
    weatherBox.innerHTML = "<p>Weather not available.</p>";
    tipsBox.innerHTML = "<p>Tips not available.</p>";
    return;
  }

  weatherBox.innerHTML = `
    <h3>${data.current.temperature_2m ?? "--"}°F</h3>
    <p>Wind: ${data.current.wind_speed_10m ?? "--"} mph</p>
    <p>Rain: ${data.current.precipitation ?? "--"} in</p>
  `;

  let tip = "Normal outfit ";
  if (data.current.precipitation > 0.2) tip = "Bring umbrella ☔";
  else if (data.current.temperature_2m < 50) tip = "Wear jacket ";

  tipsBox.innerHTML = tip;

  if (window.chart) window.chart.destroy();

  if (chartCanvas && data.daily?.temperature_2m_max && data.daily?.temperature_2m_min) {
    window.chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          { label: "Max", data: data.daily.temperature_2m_max },
          { label: "Min", data: data.daily.temperature_2m_min }
        ]
      }
    });
  }
}

async function saveFav(name, lat, lon) {
  await fetch(`${API}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "demo",
      name,
      latitude: lat,
      longitude: lon
    })
  });

  loadFavorites();
}

async function loadFavorites() {
  const box = document.getElementById("favorites");
  const res = await fetch(`${API}/api/favorites?user_id=demo`);
  const data = await res.json();

  box.innerHTML = "";

  (data.favorites || []).forEach(fav => {
    const div = document.createElement("div");
    div.className = "favorite-card";
    div.innerHTML = `
      <p>${fav.name}</p>
      <button onclick="getWeather(${fav.latitude}, ${fav.longitude})">Load</button>
    `;
    box.appendChild(div);
  });
}