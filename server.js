require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const fetchFn = global.fetch || ((...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args)));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

app.get("/", (req, res) => {
  res.send("WeatherWise server running ✅");
});

app.get("/api/geocode", async (req, res) => {
  const { name, count = 5 } = req.query;
  if (!name) return res.json({ results: [] });

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`;
    const response = await fetchFn(url);
    const data = await response.json();
    res.json(data || { results: [] });
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed", details: err.message });
  }
});

app.get("/api/weather", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: "temperature_2m,precipitation,wind_speed_10m",
      daily: "temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      forecast_days: "5",
      timezone: "auto"
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const response = await fetchFn(url);

    if (!response.ok) {
      const text = await response.text();
      console.error("Open-Meteo error:", response.status, text);
      return res.status(502).json({
        error: "Open-Meteo request failed",
        status: response.status,
        details: text
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Weather route error:", err);
    return res.status(500).json({
      error: "Weather failed",
      details: err.message
    });
  }
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, name, latitude, longitude } = req.body;

  if (!user_id || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, name, latitude, longitude }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ favorite: data?.[0] });
});

app.get("/api/favorites", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.json({ favorites: [] });

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ favorites: data || [] });
});

app.delete("/api/favorites/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("favorites").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`WeatherWise running on http://localhost:${PORT}`);
});