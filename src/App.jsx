
import { useCallback, useEffect, useState } from "react";
import {
  CloudSun,
  Sun,
  Moon,
  RefreshCw,
  Thermometer,
  Clock3,
} from "lucide-react";

import WeatherEffects from "./components/WeatherEffects";
import CurrentWeather, {
  getCondition,
} from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import LoadingScreen from "./components/LoadingScreen";
import SearchBar from "./components/SearchBar";
import StatusBar from "./components/StatusBar";

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";
const REVERSE_GEOCODING_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

const RECENT_CITIES_KEY = "weather-recent-cities";
const THEME_KEY = "weather-theme";
const MAX_RECENT_CITIES = 4;
const INTRO_DURATION = 2000;

function toDisplayTemp(value, unit) {
  if (value == null || Number.isNaN(Number(value))) return 0;
  return unit === "F" ? (value * 9) / 5 + 32 : value;
}

function formatTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
}

function formatUpdatedTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRecentCities() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(RECENT_CITIES_KEY) || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function getPlaceKey(place) {
  if (
    Number.isFinite(Number(place.latitude)) &&
    Number.isFinite(Number(place.longitude))
  ) {
    return `${Number(place.latitude).toFixed(3)},${Number(
      place.longitude
    ).toFixed(3)}`;
  }

  return `${place.city}-${place.country}`.toLowerCase();
}

async function getCoordinatesForCity(name) {
  const url = new URL(GEOCODING_URL);

  url.searchParams.set("name", name);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not search for that city.");
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) {
    throw new Error(
      "City not found. Check the spelling and try again."
    );
  }

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    city: result.name,
    country: result.country || result.admin1 || "",
  };
}

async function getCityFromCoordinates(latitude, longitude) {
  const url = new URL(REVERSE_GEOCODING_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("localityLanguage", "en");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not identify your city.");
  }

  const data = await response.json();

  return {
    city:
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      "Local Area",
    country: data.countryName || "",
  };
}

async function getWeather(latitude, longitude) {
  const url = new URL(WEATHER_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);

  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "pressure_msl",
    ].join(",")
  );

  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
      "visibility",
    ].join(",")
  );

  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
    ].join(",")
  );

  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather service is unavailable.");
  }

  const data = await response.json();

  if (!data.current || !data.hourly || !data.daily) {
    throw new Error(
      "Weather data is incomplete. Please try again."
    );
  }

  return data;
}

export default function App() {
  const [cityInput, setCityInput] = useState("");

  const [place, setPlace] = useState({
    city: "Chennai",
    country: "India",
    latitude: 13.0827,
    longitude: 80.2707,
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState(getSavedTheme);
  const [recentCities, setRecentCities] =
    useState(getRecentCities);
  const [lastUpdated, setLastUpdated] = useState("");

  const [progress, setProgress] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  // Loading screen progress: 0% to 100% in 3 seconds.
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(
        100,
        Math.floor((elapsed / INTRO_DURATION) * 100)
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(interval);
        setIntroDone(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Load weather for a selected place.
  const loadPlace = useCallback(
    async (nextPlace, remember = true) => {
      setLoading(true);
      setError("");

      try {
        const data = await getWeather(
          nextPlace.latitude,
          nextPlace.longitude
        );

        setPlace(nextPlace);
        setWeather(data);
        setLastUpdated(formatUpdatedTime());

        if (remember) {
          setRecentCities((previous) => {
            const nextKey = getPlaceKey(nextPlace);

            const updated = [
              nextPlace,
              ...previous.filter(
                (item) => getPlaceKey(item) !== nextKey
              ),
            ].slice(0, MAX_RECENT_CITIES);

            try {
              localStorage.setItem(
                RECENT_CITIES_KEY,
                JSON.stringify(updated)
              );
            } catch {
              // Continue without local storage.
            }

            return updated;
          });
        }
      } catch (err) {
        setError(
          err.message ||
            "Unable to load weather. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load Chennai on startup.
  useEffect(() => {
    loadPlace(
      {
        city: "Chennai",
        country: "India",
        latitude: 13.0827,
        longitude: 80.2707,
      },
      false
    );
  }, [loadPlace]);

  // Persist the selected theme.
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // The theme still works if storage is unavailable.
    }
  }, [theme]);

  // Toggle between dark and light themes.
  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  async function handleSearch(value) {
    const query = value.trim();

    if (!query) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextPlace = await getCoordinatesForCity(query);
      setCityInput("");
      await loadPlace(nextPlace, true);
    } catch (err) {
      setError(err.message || "Unable to find that city.");
      setLoading(false);
    }
  }

  // Detect the device location.
  function handleLocation() {
    if (!navigator.geolocation) {
      setError(
        "Your browser does not support location detection."
      );
      return;
    }

    if (!window.isSecureContext) {
      setError(
        "Location access requires HTTPS or localhost."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        let locationName = {
          city: "Current Location",
          country: "",
        };

        try {
          const resolved = await getCityFromCoordinates(
            latitude,
            longitude
          );

          if (resolved?.city) {
            locationName = resolved;
          }
        } catch {
          // Use the fallback name if reverse geocoding fails.
        }

        await loadPlace(
          {
            ...locationName,
            latitude,
            longitude,
          },
          true
        );
      },
      (geoError) => {
        let message;

        switch (geoError.code) {
          case 1:
            message =
              "Location permission denied. Allow location access in your browser settings.";
            break;
          case 2:
            message =
              "Your location is unavailable. Enable device location services and try again.";
            break;
          case 3:
            message =
              "Location request timed out. Please try My Location again.";
            break;
          default:
            message =
              "Could not detect your current location.";
        }

        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        maximumAge: 0,
      }
    );
  }

  function handleRecentCity(recent) {
    if (!loading) {
      loadPlace(recent, false);
    }
  }

  const current = weather?.current;
  const hourly = weather?.hourly;
  const daily = weather?.daily;

  const condition = getCondition(
    current?.weather_code ?? 0
  );

  const currentHourIndex = hourly
    ? Math.max(
        0,
        hourly.time.findIndex(
          (time) => time >= current?.time
        )
      )
    : 0;

  const hourlyTimes = hourly
    ? hourly.time.slice(
        currentHourIndex,
        currentHourIndex + 12
      )
    : [];

  const hourlyTemperatures = hourly
    ? hourly.temperature_2m
        .slice(currentHourIndex, currentHourIndex + 12)
        .map((value) => toDisplayTemp(value, unit))
    : [];

  const hourlyCodes = hourly
    ? hourly.weather_code.slice(
        currentHourIndex,
        currentHourIndex + 12
      )
    : [];

  const hourlyPrecipitation = hourly
    ? hourly.precipitation_probability.slice(
        currentHourIndex,
        currentHourIndex + 12
      )
    : [];

  const visibilityIndex = hourly
    ? Math.max(
        0,
        hourly.time.findIndex(
          (time) => time >= current?.time
        )
      )
    : 0;

  const visibilityValue =
    hourly?.visibility?.[visibilityIndex];

  const todayDate = current?.time
    ? new Date(current.time).toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  // Show the intro until progress is complete and initial
  // weather has loaded (or its request has failed).
  const showIntro =
    !introDone || (loading && !weather);

  return (
    <div
      className={`app-shell ${theme} min-h-screen`}
      data-theme={theme}
    >
      {showIntro ? (
        <LoadingScreen progress={progress} />
      ) : (
        <>
          <WeatherEffects condition={condition} />

          <div className="relative z-10 mx-auto max-w-full px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
            <header className="mb-6 flex items-center justify-between gap-2 sm:mb-8">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 sm:h-11 sm:w-11 sm:rounded-2xl">
                  <CloudSun size={22} />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
                    Clarity
                    <span className="text-sky-400">
                      Weather
                    </span>
                  </h1>

                  <p className="muted-text truncate text-[11px] sm:text-xs">
                    A clearer view of your day
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {/* Temperature unit selector */}
                <div className="flex items-center rounded-full border border-slate-300/20 bg-slate-500/10 p-0.5 sm:p-1">
                  <button
                    type="button"
                    onClick={() => setUnit("C")}
                    aria-label="Use Celsius"
                    aria-pressed={unit === "C"}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition sm:px-3 sm:py-1.5 sm:text-sm ${
                      unit === "C"
                        ? "bg-sky-500 text-white"
                        : "text-current opacity-70 hover:opacity-100"
                    }`}
                  >
                    °C
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnit("F")}
                    aria-label="Use Fahrenheit"
                    aria-pressed={unit === "F"}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition sm:px-3 sm:py-1.5 sm:text-sm ${
                      unit === "F"
                        ? "bg-sky-500 text-white"
                        : "text-current opacity-70 hover:opacity-100"
                    }`}
                  >
                    °F
                  </button>
                </div>

                {/* Dark / Light mode toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${
                    theme === "dark" ? "light" : "dark"
                  } mode`}
                  aria-pressed={theme === "light"}
                  title={`Switch to ${
                    theme === "dark" ? "light" : "dark"
                  } mode`}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300/20 bg-slate-500/10 px-3 transition hover:bg-slate-500/20"
                >
                  {theme === "dark" ? (
                    <Sun
                      size={18}
                      className="text-amber-400"
                    />
                  ) : (
                    <Moon
                      size={18}
                      className="text-indigo-500"
                    />
                  )}

                  <span className="hidden text-sm font-medium sm:inline">
                    {theme === "dark" ? "Light" : "Dark"}
                  </span>
                </button>
              </div>
            </header>

            <main className="space-y-7">
              <section className="space-y-3">
                <SearchBar
                  city={cityInput}
                  setCity={setCityInput}
                  onSearch={handleSearch}
                  onLocation={handleLocation}
                  loading={loading}
                />

                <StatusBar
                  loading={loading}
                  error={error}
                  lastUpdated={lastUpdated}
                />

                {recentCities.length > 0 && (
                  <div className="pt-2">
                    <div className="muted-text mb-3 flex items-center gap-2 text-xs font-medium">
                      <Clock3 size={14} />
                      <span>Recent locations</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentCities.map((recent) => (
                        <button
                          key={getPlaceKey(recent)}
                          type="button"
                          onClick={() =>
                            handleRecentCity(recent)
                          }
                          disabled={loading}
                          title={`${recent.city}, ${recent.country}`}
                          className="flex items-center gap-2 rounded-full border border-slate-300/20 bg-slate-500/5 px-3 py-2 text-sm transition hover:border-sky-400/50 hover:bg-sky-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Clock3
                            size={13}
                            className="text-sky-400"
                          />
                          <span>{recent.city}</span>

                          {recent.country && (
                            <span className="muted-text text-xs">
                              {recent.country}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {weather ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
                    <CurrentWeather
                      city={place.city}
                      country={place.country}
                      temperature={toDisplayTemp(
                        current?.temperature_2m,
                        unit
                      )}
                      feelsLike={toDisplayTemp(
                        current?.apparent_temperature,
                        unit
                      )}
                      conditionCode={current?.weather_code}
                      unit={unit}
                      date={todayDate}
                      loading={loading}
                    />

                    <WeatherDetails
                      humidity={
                        current?.relative_humidity_2m
                      }
                      wind={Math.round(
                        current?.wind_speed_10m ?? 0
                      )}
                      visibility={
                        visibilityValue == null
                          ? null
                          : (
                              visibilityValue / 1000
                            ).toFixed(1)
                      }
                      pressure={
                        current?.pressure_msl == null
                          ? null
                          : Math.round(
                              current.pressure_msl
                            )
                      }
                      sunrise={formatTime(
                        daily?.sunrise?.[0]
                      )}
                      sunset={formatTime(
                        daily?.sunset?.[0]
                      )}
                    />
                  </div>

                  <section className="glass-card p-5 sm:p-6">
                    <HourlyForecast
                      times={hourlyTimes}
                      temperatures={hourlyTemperatures}
                      codes={hourlyCodes}
                      precipitation={hourlyPrecipitation}
                      unit={unit}
                    />
                  </section>

                  <section className="glass-card p-5 sm:p-6">
                    <WeeklyForecast
                      days={daily?.time || []}
                      maxTemps={(
                        daily?.temperature_2m_max || []
                      ).map((value) =>
                        toDisplayTemp(value, unit)
                      )}
                      minTemps={(
                        daily?.temperature_2m_min || []
                      ).map((value) =>
                        toDisplayTemp(value, unit)
                      )}
                      codes={daily?.weather_code || []}
                    />
                  </section>

                  <footer className="muted-text flex flex-col items-center justify-between gap-3 border-t border-slate-300/20 pt-5 text-xs sm:flex-row">
                    <p>
                      Weather forecasts powered by Open-Meteo.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        loadPlace(place, false)
                      }
                      disabled={loading}
                      className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-slate-500/10 disabled:opacity-50"
                    >
                      <RefreshCw
                        size={14}
                        className={
                          loading ? "animate-spin" : ""
                        }
                      />
                      Refresh weather
                    </button>
                  </footer>
                </>
              ) : (
                <div className="glass-card p-8 text-center">
                  <Thermometer
                    className="mx-auto mb-3 text-sky-400"
                    size={34}
                  />

                  <h2 className="text-lg font-semibold">
                    Weather unavailable
                  </h2>

                  <p className="muted-text mt-2 text-sm">
                    {error ||
                      "Search for a city or try refreshing the weather."}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      loadPlace(place, false)
                    }
                    disabled={loading}
                    className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                  >
                    Try again
                  </button>
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
