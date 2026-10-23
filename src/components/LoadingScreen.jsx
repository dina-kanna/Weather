
import { useEffect, useId, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
} from "lucide-react";
import WeatherScene from "./WeatherScene";

export default function LoadingScreen({ progress = 0 }) {
  const progressId = useId();
  const [reducedMotion, setReducedMotion] = useState(false);

  const value = Math.round(
    Math.max(0, Math.min(100, Number(progress) || 0))
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);

    return () => media.removeEventListener?.("change", update);
  }, []);

  return (
    <main className="relative isolate flex min-h-screen min-h-[100svh] flex-col justify-between overflow-hidden bg-[#020b1b] px-5 py-6 font-sans text-white sm:px-8 sm:py-10 lg:px-14">
      {/* Animated 3D weather background */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <WeatherScene reducedMotion={reducedMotion} />
      </div>

      {/* Dark cinematic overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,8,24,0.42),transparent_35%,rgba(2,8,24,0.35)_58%,rgba(1,6,18,0.96)),radial-gradient(ellipse_at_center,transparent_20%,rgba(1,6,18,0.4)_100%)]"
      />

      {/* Branding */}
      <header className="z-10 flex items-center gap-3 sm:gap-4">
        <CloudSun
          size={42}
          strokeWidth={1.5}
          className="shrink-0 text-sky-100"
        />

        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Clarity<span className="text-sky-400">Weather</span>
          </h1>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Real Weather. Real Time.
          </p>
        </div>
      </header>

      {/* Main loading content */}
      <section className="mx-auto mt-auto w-full max-w-[640px] pt-28 text-center sm:pt-36">
        <div className="flex items-center justify-center gap-3 text-[9px] tracking-[0.25em] text-sky-100 sm:gap-4 sm:text-[10px] sm:tracking-[0.4em]">
          <span className="h-px w-5 bg-sky-400 sm:w-7" />
          <span>YOUR WEATHER COMPANION</span>
          <span className="h-px w-5 bg-sky-400 sm:w-7" />
        </div>

        <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.06em] drop-shadow-[0_0_30px_rgba(14,165,233,0.25)] sm:text-6xl lg:text-7xl">
          Clarity<span className="text-sky-400">Weather</span>
        </h2>

        <p className="mt-3 text-base text-slate-300 sm:text-xl">
          A clearer view of your day
        </p>

        {/* Progress bar */}
        <div className="mx-auto mt-10 w-full max-w-[590px] text-left sm:mt-12">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm sm:text-base">
            <label htmlFor={progressId} className="font-medium">
              {value === 100
                ? "Your forecast is ready"
                : "Preparing your forecast"}
            </label>

            <strong className="tabular-nums text-sky-300">
              {value}%
            </strong>
          </div>

          <div
            id={progressId}
            role="progressbar"
            aria-label="Loading weather forecast"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            className="h-4 overflow-hidden rounded-full border border-sky-200/60 bg-slate-800/80 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-200 shadow-[0_0_18px_#11bfff] ${
                reducedMotion ? "" : "transition-[width] duration-300 ease-out"
              }`}
              style={{ width: `${value}%` }}
            />
          </div>

          <div
            className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-300 sm:gap-4 sm:text-base"
            aria-live="polite"
          >
            <CloudRain
              size={30}
              strokeWidth={1.6}
              className="shrink-0 text-sky-300"
            />
            <span>
              {value === 100
                ? "Your weather is ready."
                : "Gathering live weather data..."}
            </span>
          </div>
        </div>

        {/* Feature labels */}
        <footer className="mx-auto mt-12 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-4 pb-3 sm:mt-16 sm:gap-x-8">
          <div className="flex items-center gap-2 text-sky-300 sm:gap-3">
            <CloudSun size={21} />
            <span className="text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]">
              FORECAST
            </span>
          </div>

          <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#34d4ff]" />

          <div className="flex items-center gap-2 text-sky-300 sm:gap-3">
            <Cloud size={21} />
            <span className="text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]">
              CONDITIONS
            </span>
          </div>

          <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_10px_#34d4ff]" />

          <div className="flex items-center gap-2 text-sky-300 sm:gap-3">
            <Wind size={21} />
            <span className="text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]">
              CLARITY
            </span>
          </div>
        </footer>
      </section>
    </main>
  );
}
