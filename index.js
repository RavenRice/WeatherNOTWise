const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


app.get("/api/favorites", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id is required" });

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ favorites: data });
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, name, latitude, longitude } = req.body;
  if (!user_id || !name || latitude == null || longitude == null) {
    return res.status(400).json({ error: "user_id, name, latitude, longitude are required" });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, name, latitude, longitude }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ favorite: data[0] });
});


app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "lat and lon are required" });

  const meteoURL = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${lat}&longitude=${lon}`
    + `&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max`
    + `&hourly=temperature_2m,precipitation_probability,weather_code`
    + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,cloud_cover,precipitation,rain,wind_speed_10m,weather_code`
    + `&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&forecast_days=5&timezone=auto`;

  try {
    const response = await fetch(meteoURL);
    if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get("/api/geocode", async (req, res) => {
  const { name, count = 8 } = req.query;
  if (!name) return res.status(400).json({ error: "name is required" });

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});


app.delete("/api/favorites/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("favorites").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`WeatherWise server running on port ${PORT}`);
});
