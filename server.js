require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


app.get("/", (req, res) => {
  res.send("WeatherWise server is running 🚀");
});


app.get("/api/geocode", async (req, res) => {
  const { name } = req.query;

  if (!name) return res.json({ results: [] });

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;

  const response = await fetch(url);
  const data = await response.json();

  res.json(data);
});


app.get("/api/weather", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&forecast_days=5&timezone=auto`;

  const response = await fetch(url);
  const data = await response.json();

  res.json(data);
});

app.get("/api/favorites", async (req, res) => {
  const { user_id } = req.query;

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

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, name, latitude, longitude }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ favorite: data[0] });
});

app.delete("/api/favorites/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`WeatherWise running on http://localhost:${PORT}`);
});