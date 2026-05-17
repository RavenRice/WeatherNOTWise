const API = "http://localhost:3000";

async function loadWeather() {
  const weatherBox = document.getElementById("current-weather");
  const tipsBox = document.getElementById("tips");

  try {
    const res = await fetch(`${API}/api/weather?latitude=38.9&longitude=-77`);
    const data = await res.json();

    if (!data || !data.current) {
      weatherBox.innerHTML = "<p>Weather data not available right now.</p>";
      tipsBox.innerHTML = "<p>Tips unavailable.</p>";
      return;
    }

    renderCurrentWeather(data);
    renderChart(data);
    renderTips(data);
  } catch (err) {
    weatherBox.innerHTML = "<p>Failed to load weather.</p>";
    tipsBox.innerHTML = "<p>Failed to load tips.</p>";
  }
}

function renderCurrentWeather(data) {
  const weatherDiv = document.getElementById("current-weather");
  const temp = data.current?.temperature_2m;
  const wind = data.current?.wind_speed_10m;
  const rain = data.current?.precipitation;

  weatherDiv.innerHTML = `
    <h3>${temp ?? "--"}°F</h3>
    <p>Live weather conditions</p>
    <p>Wind Speed: ${wind ?? "--"} mph</p>
    <p>Rain: ${rain ?? "--"} in</p>
  `;
}

function renderChart(data) {
  const canvas = document.getElementById("forecastChart");
  if (!canvas) return;

  if (!data?.daily?.temperature_2m_max || !data?.daily?.temperature_2m_min) return;

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
      datasets: [
        {
          label: "Max Temp °F",
          data: data.daily.temperature_2m_max,
          borderWidth: 2
        },
        {
          label: "Min Temp °F",
          data: data.daily.temperature_2m_min,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}

function renderTips(data) {
  if (!data?.current) return;

  const temp = data.current.temperature_2m;
  const rain = data.current.precipitation;
  const wind = data.current.wind_speed_10m;

  let outfitTip;
  let commuteTip;

  if (rain > 0.2) {
    outfitTip = "Rain is expected. Bring an umbrella and wear water resistant shoes.";
  } else if (temp <= 50) {
    outfitTip = "It is cold outside. Wear a warm jacket and dress in layers.";
  } else if (temp <= 75) {
    outfitTip = "The weather is mild. Light clothing should feel comfortable.";
  } else {
    outfitTip = "It is very warm today. Wear light clothing and stay hydrated.";
  }

  if (wind > 20) {
    commuteTip = "Strong wind may make travel less comfortable. Plan a little extra time.";
  } else if (rain > 0.2) {
    commuteTip = "Rain may slow your commute. Leave early if possible.";
  } else {
    commuteTip = "Travel conditions look normal today.";
  }

  document.getElementById("tips").innerHTML = `
    <strong>Outfit:</strong>
    <p>${outfitTip}</p>

    <strong>Commute:</strong>
    <p>${commuteTip}</p>
  `;
}
loadWeather();