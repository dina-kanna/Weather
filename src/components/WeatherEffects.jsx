import { useMemo } from "react";

export default function WeatherEffects({ condition = "rain" }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 0.6 + Math.random() * 0.9,
        delay: Math.random() * 4,
        height: 14 + Math.random() * 22,
        opacity: 0.15 + Math.random() * 0.4,
      })),
    []
  );

  const isRain = [
    "rain",
    "drizzle",
    "storm",
    "thunder",
  ].some((word) =>
    String(condition).toLowerCase().includes(word)
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-screen overflow-hidden"
      aria-hidden="true"
    >
      {isRain &&
        drops.map((drop) => (
          <span
            key={drop.id}
            className="rain-drop absolute -top-[60px] w-[2px] rounded-full"
            style={{
              left: `${drop.left}%`,
              height: `${drop.height}px`,
              opacity: drop.opacity,
              animationDuration: `${drop.duration}s`,
              animationDelay: `${drop.delay}s`,
            }}
          />
        ))}

      <div className="rain-mist absolute inset-0" />
    </div>
  );
}