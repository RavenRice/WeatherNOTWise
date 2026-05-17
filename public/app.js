const API = "http://localhost:3000";

async function loadWeather() {
  try {

    const res = await fetch(
      `${API}/api/weather?latitude=38.9&longitude=-77`
    );

    const data = await res.json();

    renderCurrentWeather(data);
    renderChart(data);
    renderTips(data);

  } catch (err) {
    console.error(err);

    document.getElementById("current-weather").innerHTML =
      "Failed to load weather.";
  }
}


function renderCurrentWeather(data) {

  const weatherDiv = document.getElementById("current-weather");

  if (!data || !data.current) {
    weatherDiv.innerHTML = "<p>Weather unavailable.</p>";
    return;
  }

  const temp = data.current.temperature_2m;
  const wind = data.current.wind_speed_10m;
  const rain = data.current.precipitation;

  weatherDiv.innerHTML = `
    <h3>${temp}°F</h3>
    <p>Live weather conditions</p>
    <p>Wind Speed: ${wind} mph</p>
    <p>Rain: ${rain} in</p>
  `;
}


function renderChart(data) {

  const ctx = document.getElementById("forecastChart");

  new Chart(ctx, {
    type: "line",

    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],

      datasets: [
        {
          label: "Max Temp °F",
          data: data.daily.temperature_2m_max
        },
        {
          label: "Min Temp °F",
          data: data.daily.temperature_2m_min
        }
      ]
    }
  });
}


function renderTips(data) {

  const temp = data.current.temperature_2m;
  const rain = data.current.precipitation;
  const wind = data.current.wind_speed_10m;

  let outfitTip = "";
  let commuteTip = "";

  if (rain > 0.2) {
    outfitTip =
      "Rain is expected today. Bring an umbrella.";
  }

  else if (temp <= 50) {
    outfitTip =
      "Cold weather. Wear a coat or hoodie.";
  }

  else if (temp <= 75) {
    outfitTip =
      "Mild weather. Light clothing is fine.";
  }

  else {
    outfitTip =
      "Hot weather. Stay hydrated and wear light clothes.";
  }

  if (wind > 20) {
    commuteTip =
      "Strong winds may affect driving conditions.";
  }

  else if (rain > 0.2) {
    commuteTip =
      "Rain may slow traffic today.";
  }

  else {
    commuteTip =
      "Travel conditions look normal.";
  }

  document.getElementById("tips").innerHTML = `
    <strong>Outfit Recommendation:</strong>
    <p>${outfitTip}</p>

    <br>

    <strong>Commute Advice:</strong>
    <p>${commuteTip}</p>
  `;
}

loadWeather();