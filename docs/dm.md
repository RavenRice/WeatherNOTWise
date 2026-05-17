# WeatherWise Developer Manual
## Project Overview

WeatherWise is a weather-based outfit recommendation web application designed for college students. The application provides real-time weather forecasts, location search functionality, and saved favorite locations using the Open-Meteo API and Supabase database services.

The system consists of frontend pages served using Express, a backend API built using Node.js and Express, a Supabase database used to save favorite locations, and the Open-Meteo API used for weather and location data.

## How to Start the Project

1. Install dependencies:
npm install

2. Create a `.env` file in the root directory:

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000

3. Start the server:
npm run dev

4. Open in browser:
http://localhost:3000

## Prerequisites

- Node.js v18 or later
- npm v9 or later
- Git
- Supabase account

## Installation

Clone repo:
git clone https://github.com/RavenRice/WeatherWise.git
cd WeatherWise

Install dependencies:
npm install

Packages:
- express
- body-parser
- @supabase/supabase-js
- nodemon
- usa-state-validator

## Running the Application

Development:
npm run dev

Production:
npm start

Runs on:
http://localhost:3000

## Running Tests

No automated tests currently exist.

Suggested tests:
- weather API returns valid data
- favorites require all fields
- favorites return correct user data

## API Reference

Base URL:
/api

Server:
http://localhost:3000

### GET /api/weather

Query:
lat (required)
lon (required)

GET /api/weather?lat=38.9897&lon=-76.9378

Response:
{
  "current": {
    "temperature_2m": 72.4,
    "apparent_temperature": 70.1,
    "wind_speed_10m": 9.2
  }
}

Errors:
400 missing lat/lon
502 external API failure

### GET /api/geocode

Query:
name (required)
count (optional)

GET /api/geocode?name=College+Park&count=5

Response:
{
  "results": [
    {
      "name": "College Park",
      "latitude": 38.9897,
      "longitude": -76.9378,
      "country": "United States"
    }
  ]
}

Errors:
400 missing name
502 API failure

### GET /api/favorites

Query:
user_id required

GET /api/favorites?user_id=user123

Response:
{
  "favorites": [
    {
      "id": "uuid",
      "user_id": "user123",
      "name": "College Park",
      "latitude": 38.9897,
      "longitude": -76.9378
    }
  ]
}

### POST /api/favorites

POST body:
{
  "user_id": "user123",
  "name": "College Park",
  "latitude": 38.9897,
  "longitude": -76.9378
}

Response:
{
  "favorite": {
    "id": "uuid",
    "user_id": "user123",
    "name": "College Park"
  }
}

Errors:
400 missing fields
500 database error

### DELETE /api/favorites/:id

DELETE /api/favorites/uuid-here

Response:
{
  "success": true
}

## Known Bugs

- No authentication system
- Favorites can be duplicated
- No automated tests
- Mobile responsiveness can improve
- Depends on Open-Meteo API

## Future Roadmap

- Add user authentication (Supabase Auth)
- Prevent duplicate favorites
- Improve UI responsiveness
- Add outfit recommendation engine
- Add weather alerts
- Add class schedule integration
- Add user preferences

## Deployment
Vercel
Set environment variables in hosting dashboard.

## Contributors
- Paris Johnson
- Raven Rice