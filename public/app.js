const API = "http://localhost:3000";

async function loadWeather() {
  try {
    const res = await fetch(`${API}/api/weather?latitude=38.9&longitude=-77`);
    const data = await res.json();

    renderCurrent(data);
    renderChart(data);
    renderTips(data);

  } catch (err) {
    console.error(err);
    document.getElementById("current-weather").innerHTML =
      "Failed to load weather.";
  }
}

function renderCurrent(data) {
  const temp = data?.current?.temperature_2m;

  document.getElementById("current-weather").innerHTML =
    `<h3>${temp}°</h3><p>Live weather</p>`;
}

function renderChart(data) {
  const ctx = document.getElementById("forecastChart");

  const labels = data?.daily?.time || [];
  const temps = data?.daily?.temperature_2m_max || [];

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Max Temp",
        data: temps
      }]
    }
  });
}

function renderTips(data) {
    const temp = data?.current?.temperature_2m;
    const rain = data?.current?.precipitation || 0;
    const wind = data?.current?.wind_speed_10m || 0;
  
    let outfitTip = "";
    let commuteTip = "";
  
    if (rain > 0.2) {
      outfitTip = "Rain is expected today. Wear waterproof clothing and bring an umbrella.";
    } 
    else if (temp <= 10 && wind > 15) {
      outfitTip = "Cold and windy conditions. Wear a heavy coat and layer your clothing.";
    } 
    else if (temp <= 10) {
      outfitTip = "Cold weather. Wear a warm coat and layered clothing.";
    } 
    else if (temp <= 20) {
      outfitTip = "Cool weather. A light jacket or hoodie is recommended.";
    } 
    else if (temp <= 30) {
      outfitTip = "Mild weather. Light clothing is appropriate.";
    } 
    else {
      outfitTip = "Hot weather. Wear light breathable clothing and stay hydrated.";
    }
  
    if (wind > 20) {
      outfitTip += " Strong winds may make it feel colder outside.";
    }
  
    if (rain > 0.2) {
      commuteTip = "Expect slower traffic and possible transit delays due to rain.";
    } 
    else if (wind > 20) {
      commuteTip = "Windy conditions may affect driving and biking stability.";
    } 
    else if (temp >= 30) {
      commuteTip = "Hot conditions may increase fatigue during travel. Plan extra breaks if commuting long distances.";
    } 
    else if (temp <= 5) {
      commuteTip = "Very cold conditions may lead to slower travel times and possible delays.";
    } 
    else {
      commuteTip = "Normal travel conditions expected with minimal delays.";
    }
  
    document.getElementById("tips").innerHTML =
      `<strong>Outfit Recommendation:</strong><p>${outfitTip}</p><br><strong>Commute Advice:</strong><p>${commuteTip}</p>`;
  }
 

loadWeather();