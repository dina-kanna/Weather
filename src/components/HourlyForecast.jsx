
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
} from "lucide-react";

function getIcon(code) {
  if (code === 0) return Sun;
  if (code === 1 || code === 2) return CloudSun;
  if ([3, 45, 48].includes(code)) return Cloud;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code))
    return CloudRain;
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return CloudSnow;
  if ([95, 96, 99].includes(code)) return CloudLightning;
  return CloudSun;
}

export default function HourlyForecast({
  times = [],
  temperatures = [],
  codes = [],
  precipitation = [],
  unit = "C",
}) {
  const count = times.length;
  const cardWidth = 96;
  const gap = 12;
  const step = cardWidth + gap;
  const chartWidth = Math.max(
    1,
    count * step - gap
  );

  // Convert rain probabilities into curve coordinates.
  const points = times.map((_, index) => {
    const rain = Math.max(
      0,
      Math.min(100, Number(precipitation[index]) || 0)
    );

    return {
      x: index * step + cardWidth / 2,
      y: 64 - rain * 0.45,
      rain,
    };
  });

  // Smooth cubic Bézier curve through hourly points.
  const curve = points.length
    ? points.reduce((path, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;

        const previous = points[index - 1];
        const mid = (previous.x + point.x) / 2;

        return (
          path +
          ` C ${mid} ${previous.y}, ${mid} ${point.y}, ${point.x} ${point.y}`
        );
      }, "")
    : "";

  const area = points.length
    ? `${curve} L ${points[points.length - 1].x} 80 L ${points[0].x} 80 Z`
    : "";

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-white sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Hourly forecast
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Temperature & rain probability
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-400">
          <Droplets size={15} />
          Rain %
        </div>
      </div>

      <div className="overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="relative"
          style={{ minWidth: `${chartWidth}px` }}
        >
          {/* Rain probability curve */}
          <div className="relative mb-2 h-24">
            <svg
              viewBox={`0 0 ${chartWidth} 80`}
              className="absolute inset-0 h-full w-full overflow-visible"
              preserveAspectRatio="none"
              role="img"
              aria-label="Hourly precipitation probability curve"
            >
              <defs>
                <linearGradient
                  id="rainAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#38bdf8"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor="#38bdf8"
                    stopOpacity="0.01"
                  />
                </linearGradient>
              </defs>

              {[20, 40, 60].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 5"
                />
              ))}

              {points.length > 1 && (
                <path d={area} fill="url(#rainAreaGradient)" />
              )}

              {points.length > 1 && (
                <path
                  d={curve}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {points.map((point, index) => (
                <g key={times[index]}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <text
                    x={point.x}
                    y={Math.max(11, point.y - 12)}
                    textAnchor="middle"
                    fill="#7dd3fc"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {point.rain}%
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Hourly weather cards */}
          <div className="flex gap-3">
            {times.map((time, index) => {
              const Icon = getIcon(codes[index]);
              const rain = Number(precipitation[index]) || 0;

              const label = new Date(time).toLocaleTimeString(
                [],
                { hour: "numeric" }
              );

              const rainy = rain >= 40;

              return (
                <div
                  key={time}
                  className={`flex min-w-24 flex-col items-center rounded-2xl border px-3 py-4 transition duration-300 hover:-translate-y-1 ${
                    rainy
                      ? "border-sky-400/30 bg-sky-400/[0.09]"
                      : "border-white/[0.08] bg-white/[0.03]"
                  }`}
                  style={{ width: `${cardWidth}px` }}
                >
                  <span className="text-xs font-semibold text-slate-400">
                    {index === 0 ? "Now" : label}
                  </span>

                  <div
                    className={`my-4 ${
                      rainy ? "text-sky-400" : "text-amber-300"
                    }`}
                  >
                    <Icon size={30} strokeWidth={1.7} />
                  </div>

                  <span className="text-xl font-black">
                    {Number.isFinite(Number(temperatures[index]))
                      ? `${Math.round(Number(temperatures[index]))}°${unit}`
                      : "--"}
                  </span>

                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-sky-400">
                    <Droplets size={12} />
                    {rain > 0 ? `${Math.round(rain)}%` : "0%"}
                  </div>

                  <span className="mt-2 text-[10px] text-slate-500">
                    {rain >= 60
                      ? "High rain"
                      : rain >= 30
                      ? "Possible rain"
                      : rain > 0
                      ? "Low chance"
                      : "Dry"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="h-2 w-2 rounded-full bg-sky-400" />
        Rain probability changes by hour
      </div>
    </section>
  );
}
