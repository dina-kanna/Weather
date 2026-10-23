import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-react";

function getWeather(code) {
  if (code === 0) return { Icon: Sun, label: "Sunny" };

  if (code === 1 || code === 2)
    return { Icon: CloudSun, label: "Partly cloudy" };

  if (code === 3)
    return { Icon: Cloud, label: "Overcast" };

  if ([45, 48].includes(code))
    return { Icon: CloudFog, label: "Foggy" };

  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code))
    return { Icon: CloudRain, label: "Rainy" };

  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { Icon: CloudSnow, label: "Snowy" };

  if ([95, 96, 99].includes(code))
    return { Icon: CloudLightning, label: "Thunderstorm" };

  return { Icon: CloudSun, label: "Cloudy" };
}

export default function WeeklyForecast({
  days = [],
  maxTemps = [],
  minTemps = [],
  codes = [],
}) {
  const temperatures = days.map((_, index) => ({
    min: Number(minTemps[index]),
    max: Number(maxTemps[index]),
  }));

  const lowest = Math.min(
    ...temperatures.map((temp) => temp.min).filter(Number.isFinite)
  );

  const highest = Math.max(
    ...temperatures.map((temp) => temp.max).filter(Number.isFinite)
  );

  const range = Math.max(highest - lowest, 1);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            7-Day Forecast
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Weather for the week ahead
          </p>
        </div>

        <div className="rounded-2xl bg-sky-100 p-3 dark:bg-sky-400/10">
          <Sun className="text-amber-500" size={24} />
        </div>
      </div>

      <div className="grid gap-3">
        {days.map((day, index) => {
          const { Icon, label } = getWeather(codes[index]);
          const date = new Date(`${day}T12:00:00`);

          const weekday =
            index === 0
              ? "Today"
              : date.toLocaleDateString("en-US", {
                  weekday: "short",
                });

          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          const min = temperatures[index].min;
          const max = temperatures[index].max;

          const left = Number.isFinite(min)
            ? ((min - lowest) / range) * 100
            : 0;

          const width =
            Number.isFinite(min) && Number.isFinite(max)
              ? Math.max(((max - min) / range) * 100, 5)
              : 5;

          return (
            <div
              key={day}
              className="group grid grid-cols-[1fr_1.3fr_1fr] items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-sky-400/40"
            >
              {/* Day and date */}
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {weekday}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formattedDate}
                </p>
              </div>

              {/* Weather condition */}
              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-400/10">
                  <Icon
                    size={25}
                    strokeWidth={1.8}
                    className={
                      codes[index] === 0
                        ? "text-amber-500"
                        : [95, 96, 99].includes(codes[index])
                          ? "text-purple-500"
                          : [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(
                                codes[index]
                              )
                            ? "text-blue-500"
                            : "text-sky-500"
                    }
                  />
                </div>

                <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                  {label}
                </span>
              </div>

              {/* Temperature range */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {Number.isFinite(min) ? `${Math.round(min)}°` : "—"}
                </span>

                <div className="relative hidden h-2 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 sm:block">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-amber-400"
                    style={{
                      left: `${left}%`,
                      width: `${Math.min(width, 100 - left)}%`,
                    }}
                  />
                </div>

                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {Number.isFinite(max) ? `${Math.round(max)}°` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}