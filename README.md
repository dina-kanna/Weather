# Clarity Weather

A responsive, live weather dashboard built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

- Current conditions, feels-like temperature, humidity, wind, visibility, pressure, and precipitation
- Sunrise and sunset times, local date and time
- City search with recent locations and browser geolocation
- 48-hour hourly forecast and seven-day outlook
- Celsius/Fahrenheit and light/dark mode controls
- Weather-reactive animated backgrounds for clear, cloudy, rainy, stormy, foggy, and snowy conditions
- Responsive layout and reduced-motion support
- Live weather and geocoding from Open-Meteo; no API key required

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or run the linter with `npm run lint`.

Geolocation requires browser permission and a secure context (HTTPS or localhost). Weather and city search require an internet connection.
