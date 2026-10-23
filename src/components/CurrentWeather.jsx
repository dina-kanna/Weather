
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Thermometer,
  MapPin,
  Wind,
  CalendarDays,
  Sparkles,
} from "lucide-react";

function weatherInfo(code) {
  if (code === 0) return { label: "Clear sky", Icon: Sun };
  if (code === 1) return { label: "Mainly clear", Icon: Sun };
  if (code === 2) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if ([45, 48].includes(code))
    return { label: "Foggy", Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code))
    return { label: "Drizzle", Icon: CloudRain };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { label: "Rain showers", Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { label: "Snowfall", Icon: CloudSnow };
  if ([95, 96, 99].includes(code))
    return { label: "Thunderstorm", Icon: CloudLightning };

  return { label: "Current conditions", Icon: CloudSun };
}

export function getCondition(code) {
  if (code === 0 || code === 1) return "clear";
  if ([2, 3, 45, 48].includes(code)) return "cloudy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "cloudy";
}

export default function CurrentWeather({
  city,
  country,
  temperature,
  feelsLike,
  conditionCode,
  unit = "C",
  date,
  loading = false,
}) {
  const { label, Icon } = weatherInfo(conditionCode);
  const condition = getCondition(conditionCode);

  const backgrounds = {
    clear: "from-orange-400/25 via-amber-500/10 to-slate-950",
    cloudy: "from-slate-400/25 via-indigo-500/10 to-slate-950",
    rain: "from-sky-500/30 via-blue-600/15 to-slate-950",
    snow: "from-cyan-300/20 via-sky-500/10 to-slate-950",
    storm: "from-violet-500/30 via-indigo-600/20 to-slate-950",
  };

  const iconColors = {
    clear: "text-amber-300",
    cloudy: "text-slate-200",
    rain: "text-sky-300",
    snow: "text-cyan-200",
    storm: "text-violet-300",
  };

  const isRainy = condition === "rain";
  const isClear = condition === "clear";

  return (
    <section
      className={`relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${
        backgrounds[condition]
      } p-5 text-white shadow-2xl shadow-black/20 sm:p-8 lg:p-10`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-indigo-400/10 blur-[70px]" />

      {/* Decorative weather illustration */}
      <div className="pointer-events-none absolute right-0 top-16 opacity-[0.07] sm:right-8 sm:top-6">
        <Icon size={220} strokeWidth={0.7} />
      </div>

      {isClear && (
        <div className="pointer-events-none absolute right-10 top-10 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />
      )}

      {isRainy && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(110deg, transparent 0px, transparent 28px, rgba(125,211,252,0.25) 29px, transparent 30px)",
            backgroundSize: "60px 100px",
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-xl">
              <span
                className={`h-2 w-2 rounded-full ${
                  loading ? "animate-pulse bg-amber-300" : "bg-emerald-400"
                }`}
              />
              {loading ? "Updating weather" : "Current weather"}
            </div>

            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              <MapPin size={20} className="text-sky-300" />
              {city || "Your location"}
            </h2>

            <p className="mt-1 pl-7 text-sm text-white/55">
              {country || "Local forecast"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <CalendarDays size={14} />
              Today
            </div>
            <p className="mt-1 text-sm font-semibold">
              {date || "Current conditions"}
            </p>
          </div>
        </div>

        {/* Main temperature area */}
        <div className="my-9 grid items-center gap-8 sm:my-12 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div
              className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-md sm:h-36 sm:w-36 ${
                isClear ? "shadow-[0_0_55px_rgba(251,191,36,0.10)]" : ""
              }`}
            >
              <div className="absolute inset-2 rounded-[1.5rem] border border-white/[0.05]" />
              <Icon
                size={76}
                strokeWidth={1.2}
                className={`${iconColors[condition]} ${
                  isClear ? "animate-pulse" : ""
                } drop-shadow-[0_0_20px_rgba(125,211,252,0.15)] sm:h-24 sm:w-24`}
              />
              {isRainy && (
                <span className="absolute bottom-3 right-3 rounded-full bg-sky-400/20 p-1.5 text-sky-200">
                  <CloudRain size={17} />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-start">
                <span className="text-7xl font-extralight leading-none tracking-[-0.08em] sm:text-8xl">
                  {loading || temperature == null
                    ? "--"
                    : Math.round(temperature)}
                </span>
                <span className="ml-2 mt-1 text-3xl font-light text-white/55">
                  °{unit}
                </span>
              </div>

              <p className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
                {loading ? "Getting conditions..." : label}
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
                <Sparkles size={14} />
                {isClear
                  ? "A little sunshine goes a long way"
                  : isRainy
                  ? "Clouds and rain in your area"
                  : condition === "snow"
                  ? "A chilly winter atmosphere"
                  : condition === "storm"
                  ? "Stormy conditions"
                  : "Here's what's happening outside"}
              </p>
            </div>
          </div>

          {/* Feels-like panel */}
          <div className="min-w-0 rounded-3xl border border-white/10 bg-black/15 p-5 backdrop-blur-xl sm:min-w-44">
            <div className="flex items-center gap-2 text-sm text-white/55">
              <Thermometer size={17} />
              Feels like
            </div>

            <p className="mt-3 text-4xl font-light tracking-tight">
              {loading || feelsLike == null
                ? "--"
                : `${Math.round(feelsLike)}°${unit}`}
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${
                  isClear
                    ? "bg-amber-300"
                    : isRainy
                    ? "bg-sky-300"
                    : "bg-indigo-300"
                }`}
                style={{ width: isClear ? "75%" : isRainy ? "45%" : "55%" }}
              />
            </div>

            <p className="mt-2 text-xs text-white/40">
              Perceived temperature
            </p>
          </div>
        </div>

        {/* Bottom summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm">
            <p className="flex items-center gap-2 text-xs text-white/50">
              <Thermometer size={15} />
              Actual temperature
            </p>
            <p className="mt-2 text-lg font-semibold">
              {loading || temperature == null
                ? "--"
                : `${Math.round(temperature)}°${unit}`}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm">
            <p className="flex items-center gap-2 text-xs text-white/50">
              <Wind size={15} />
              Conditions
            </p>
            <p className="mt-2 truncate text-lg font-semibold">
              {loading ? "Loading..." : label}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm sm:col-span-1">
            <p className="flex items-center gap-2 text-xs text-white/50">
              <MapPin size={15} />
              Location
            </p>
            <p className="mt-2 truncate text-lg font-semibold">
              {city || "Not available"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-xs text-white/40">
          <span>Weather at a glance</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                loading ? "bg-amber-300" : "bg-emerald-400"
              }`}
            />
            {loading ? "Refreshing..." : "Latest available data"}
          </span>
        </div>
      </div>
    </section>
  );
}
