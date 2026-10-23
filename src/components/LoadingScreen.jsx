
import { CloudSun, Sparkles, CloudRain, Droplets } from "lucide-react";

export default function LoadingScreen({ progress = 0 }) {
  const percentage = Math.max(0, Math.min(100, progress));

  const raindrops = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    left: `${(index * 37 + 3) % 100}%`,
    delay: `${-((index * 17) % 60) / 10}s`,
    duration: `${0.65 + ((index * 13) % 14) / 10}s`,
    height: `${12 + ((index * 7) % 17)}px`,
    opacity: 0.2 + ((index * 11) % 6) / 10,
  }));

  const mistParticles = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    top: `${10 + ((index * 19) % 80)}%`,
    delay: `${-index * 1.7}s`,
    duration: `${12 + (index % 5) * 3}s`,
    width: `${180 + (index % 4) * 100}px`,
  }));

  return (
    <div className="weather-intro fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden text-white">
      <style>{`
        .weather-intro {
          isolation: isolate;
          background:
            radial-gradient(ellipse at 50% 42%, #123e69 0%, transparent 40%),
            radial-gradient(ellipse at 15% 15%, #102c50 0%, transparent 45%),
            linear-gradient(145deg, #020610, #081426 55%, #020617);
        }

        .intro-grid {
          position: absolute;
          inset: -50%;
          z-index: -3;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(56,189,248,.075) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,.075) 1px, transparent 1px);
          background-size: 48px 48px;
          transform: perspective(550px) rotateX(62deg) translateY(20%);
          transform-origin: center;
          mask-image: linear-gradient(transparent, black 30%, black 70%, transparent);
          animation: intro-grid-move 8s linear infinite;
        }

        .intro-aurora {
          position: absolute;
          top: 10%;
          left: 15%;
          width: 70vw;
          height: 70vw;
          max-width: 650px;
          max-height: 650px;
          border-radius: 50%;
          filter: blur(75px);
          opacity: .17;
          pointer-events: none;
          z-index: -2;
          background: conic-gradient(from 0deg, #0ea5e9, #6366f1, #14b8a6, #0ea5e9);
          animation: intro-aurora 12s ease-in-out infinite alternate;
        }

        /* Rain layer */
        .rain-layer {
          position: absolute;
          inset: -30px;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
          perspective: 500px;
        }

        .rain-drop {
          position: absolute;
          top: -50px;
          width: 1.5px;
          border-radius: 0 0 5px 5px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(186,230,253,.2) 15%,
            rgba(125,211,252,.85) 75%,
            rgba(224,242,254,.95)
          );
          box-shadow: 0 0 5px rgba(56,189,248,.25);
          animation: rain-fall linear infinite;
          will-change: transform;
        }

        .rain-drop:nth-child(3n) {
          width: 1px;
          opacity: .45;
          filter: blur(.3px);
        }

        .rain-drop:nth-child(5n) {
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(56,189,248,.15),
            rgba(186,230,253,.8)
          );
        }

        .rain-drop:nth-child(7n) {
          filter: blur(.7px);
        }

        .rain-mist {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .mist-cloud {
          position: absolute;
          left: -30%;
          height: 100px;
          border-radius: 50%;
          background: rgba(125,211,252,.045);
          filter: blur(35px);
          animation: mist-drift linear infinite;
          will-change: transform;
        }

        .rain-haze {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(2,6,23,.06), transparent 35%, rgba(2,6,23,.42)),
            linear-gradient(90deg, rgba(2,6,23,.22), transparent 25%, transparent 75%, rgba(2,6,23,.22));
        }

        /* Occasional distant lightning */
        .lightning-flash {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: rgba(147,197,253,.13);
          opacity: 0;
          animation: lightning 9s linear infinite;
        }

        /* Ground-level water reflections */
        .water-ground {
          position: absolute;
          left: -10%;
          right: -10%;
          bottom: -12%;
          height: 38%;
          z-index: 0;
          pointer-events: none;
          opacity: .5;
          background:
            radial-gradient(ellipse at 50% 100%, rgba(14,165,233,.2), transparent 65%),
            repeating-linear-gradient(
              176deg,
              transparent 0 13px,
              rgba(125,211,252,.045) 14px,
              transparent 16px 27px
            );
          transform: perspective(400px) rotateX(35deg);
          transform-origin: bottom;
          animation: water-shimmer 4s ease-in-out infinite alternate;
          mask-image: linear-gradient(transparent, black 30%, black);
        }

        .water-ripple {
          position: absolute;
          bottom: 8%;
          left: var(--ripple-left);
          width: var(--ripple-size);
          height: 12px;
          border: 1px solid rgba(125,211,252,.4);
          border-radius: 50%;
          transform: rotateX(55deg);
          animation: ripple-expand 2.6s ease-out infinite;
          animation-delay: var(--ripple-delay);
          pointer-events: none;
        }

        /* 3D weather planet */
        .intro-orb {
          position: relative;
          width: 190px;
          height: 190px;
          flex-shrink: 0;
          perspective: 800px;
          animation: intro-float 5s ease-in-out infinite;
        }

        .intro-orb-glow {
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          background: #38bdf8;
          filter: blur(42px);
          opacity: .27;
          animation: intro-glow 3s ease-in-out infinite alternate;
        }

        .intro-planet {
          position: absolute;
          inset: 17px;
          overflow: hidden;
          border-radius: 50%;
          background:
            radial-gradient(ellipse at 27% 23%, rgba(186,230,253,.95), transparent 9%),
            radial-gradient(ellipse at 28% 25%, #38bdf8 0%, #0879b6 20%, #123a75 48%, #07152f 75%);
          box-shadow:
            inset -18px -8px 35px rgba(0,0,0,.78),
            inset 5px 5px 18px rgba(186,230,253,.35),
            0 0 24px rgba(56,189,248,.28),
            0 0 65px rgba(14,165,233,.16);
          transform: rotateX(-12deg);
        }

        .intro-planet::before {
          content: "";
          position: absolute;
          inset: -15%;
          width: 130%;
          background: repeating-linear-gradient(
            0deg,
            transparent 0 13px,
            rgba(125,211,252,.20) 14px,
            transparent 16px 27px
          );
          border-radius: 50%;
          animation: intro-surface 10s linear infinite;
        }

        .intro-planet::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(ellipse at 22% 20%, rgba(255,255,255,.3), transparent 28%),
            linear-gradient(110deg, transparent 25%, rgba(56,189,248,.14) 46%, transparent 65%);
        }

        .intro-cloud {
          position: absolute;
          z-index: 2;
          color: #e0f2fe;
          filter: drop-shadow(0 0 14px rgba(125,211,252,.8));
        }

        .intro-cloud-one {
          top: 40px;
          left: -4px;
          animation: intro-cloud-one 6s ease-in-out infinite;
        }

        .intro-cloud-two {
          right: -9px;
          bottom: 35px;
          opacity: .7;
          animation: intro-cloud-two 7s ease-in-out infinite;
        }

        .intro-orbit {
          position: absolute;
          inset: -1px;
          border: 1px solid rgba(125,211,252,.35);
          border-radius: 50%;
          transform: rotateX(66deg) rotateZ(-25deg);
          box-shadow: 0 0 18px rgba(56,189,248,.08);
        }

        .intro-orbit-two {
          inset: -14px;
          border-color: rgba(99,102,241,.38);
          transform: rotateX(68deg) rotateZ(50deg);
        }

        .intro-orbit-dot {
          position: absolute;
          top: 11%;
          left: 14%;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #a5f3fc;
          box-shadow: 0 0 12px 3px rgba(56,189,248,.65);
        }

        .intro-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #bae6fd;
          box-shadow: 0 0 10px 2px rgba(56,189,248,.6);
          animation: intro-particle 4s ease-in-out infinite;
        }

        .intro-progress-track {
          height: 6px;
          overflow: hidden;
          border: 1px solid rgba(125,211,252,.18);
          border-radius: 999px;
          background: rgba(148,163,184,.13);
          box-shadow: inset 0 1px 4px rgba(0,0,0,.3);
        }

        .intro-progress-fill {
          position: relative;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #0ea5e9, #67e8f9, #818cf8);
          box-shadow: 0 0 14px rgba(56,189,248,.7);
          transition: width 100ms linear;
        }

        .intro-progress-fill::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent);
          animation: intro-shimmer 1.3s linear infinite;
        }

        .intro-text-glow {
          text-shadow: 0 0 24px rgba(56,189,248,.18);
        }

        .intro-rain-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(186,230,253,.75);
          font-size: 10px;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .intro-rain-icon {
          animation: rain-icon-pulse 2s ease-in-out infinite;
        }

        @keyframes rain-fall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(12deg);
          }
          100% {
            transform: translate3d(-100px, 115vh, 0) rotate(12deg);
          }
        }

        @keyframes mist-drift {
          from { transform: translateX(0) translateY(0); }
          to { transform: translateX(150vw) translateY(-25px); }
        }

        @keyframes lightning {
          0%, 91%, 92%, 94%, 100% { opacity: 0; }
          91.2% { opacity: .45; }
          91.5% { opacity: .04; }
          92.1% { opacity: .2; }
          92.4% { opacity: 0; }
        }

        @keyframes ripple-expand {
          0% { opacity: 0; transform: scale(.25) rotateX(55deg); }
          20% { opacity: .6; }
          100% { opacity: 0; transform: scale(2.8) rotateX(55deg); }
        }

        @keyframes water-shimmer {
          from { transform: perspective(400px) rotateX(35deg) translateY(0); }
          to { transform: perspective(400px) rotateX(35deg) translateY(-8px); }
        }

        @keyframes rain-icon-pulse {
          0%, 100% { transform: translateY(0); opacity: .65; }
          50% { transform: translateY(2px); opacity: 1; }
        }

        @keyframes intro-grid-move {
          from { background-position: 0 0; }
          to { background-position: 0 48px; }
        }

        @keyframes intro-aurora {
          from { transform: translate(-8%, -4%) scale(.9) rotate(0deg); }
          to { transform: translate(8%, 6%) scale(1.12) rotate(35deg); }
        }

        @keyframes intro-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-11px) rotate(2deg); }
        }

        @keyframes intro-glow {
          from { opacity: .18; transform: scale(.85); }
          to { opacity: .38; transform: scale(1.12); }
        }

        @keyframes intro-surface {
          from { transform: translateX(-14%); }
          to { transform: translateX(14%); }
        }

        @keyframes intro-cloud-one {
          0%, 100% { transform: translate(0, 0) rotate(-5deg); }
          50% { transform: translate(8px, -10px) rotate(4deg); }
        }

        @keyframes intro-cloud-two {
          0%, 100% { transform: translate(0, 0) scale(.92); }
          50% { transform: translate(-9px, 8px) scale(1.04); }
        }

        @keyframes intro-particle {
          0%, 100% { opacity: .2; transform: translateY(8px) scale(.7); }
          50% { opacity: 1; transform: translateY(-12px) scale(1.4); }
        }

        @keyframes intro-shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }

        @media (max-width: 480px) {
          .intro-orb {
            width: 165px;
            height: 165px;
          }

          .rain-drop {
            opacity: .55;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .weather-intro *,
          .weather-intro *::before,
          .weather-intro *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* Moving 3D background */}
      <div className="intro-grid" />
      <div className="intro-aurora" />

      {/* Soft moving mist */}
      <div className="rain-mist">
        {mistParticles.map((mist) => (
          <span
            key={mist.id}
            className="mist-cloud"
            style={{
              top: mist.top,
              width: mist.width,
              animationDelay: mist.delay,
              animationDuration: mist.duration,
            }}
          />
        ))}
      </div>

      {/* Falling rain */}
      <div className="rain-layer" aria-hidden="true">
        {raindrops.map((drop) => (
          <span
            key={drop.id}
            className="rain-drop"
            style={{
              left: drop.left,
              height: drop.height,
              animationDelay: drop.delay,
              animationDuration: drop.duration,
              opacity: drop.opacity,
            }}
          />
        ))}
      </div>

      {/* Rainy atmosphere and distant lightning */}
      <div className="rain-haze" />
      <div className="lightning-flash" />

      {/* Wet ground reflections and ripples */}
      <div className="water-ground" />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className="water-ripple"
            style={{
              "--ripple-left": `${8 + index * 11}%`,
              "--ripple-size": `${25 + (index % 3) * 14}px`,
              "--ripple-delay": `${-index * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Floating light particles */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            className="intro-particle"
            style={{
              left: `${(index * 37 + 9) % 100}%`,
              top: `${(index * 53 + 7) % 100}%`,
              animationDelay: `${(index % 7) * -0.6}s`,
              animationDuration: `${3 + (index % 4)}s`,
              opacity: 0.3 + (index % 5) * 0.12,
            }}
          />
        ))}
      </div>

      {/* Main 3D weather planet */}
      <div className="intro-orb z-[3] mb-8">
        <div className="intro-orb-glow" />

        <div className="intro-orbit">
          <span className="intro-orbit-dot" />
        </div>

        <div className="intro-orbit intro-orbit-two">
          <span className="intro-orbit-dot" />
        </div>

        <div className="intro-planet" />

        <CloudSun
          className="intro-cloud intro-cloud-one"
          size={43}
          strokeWidth={1.3}
        />

        <CloudRain
          className="intro-cloud intro-cloud-two"
          size={34}
          strokeWidth={1.3}
        />
      </div>

      {/* Branding and loading status */}
      <div className="relative z-10 flex flex-col items-center px-5 text-center">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-300/80">
          <Sparkles size={13} />
          Your weather companion
          <Sparkles size={13} />
        </div>

        <h1 className="intro-text-glow text-3xl font-bold tracking-tight sm:text-4xl">
          Clarity
          <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Weather
          </span>
        </h1>

        <p className="mt-3 text-sm tracking-wide text-slate-400">
          A clearer view of your day
        </p>

        {/* Rain animation indicator */}
        <div className="intro-rain-label mt-5">
          <Droplets className="intro-rain-icon" size={14} />
          <span>Live weather atmosphere</span>
        </div>

        {/* Progress */}
        <div className="mt-7 w-64 max-w-[80vw] sm:w-72">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Preparing your forecast
            </span>
            <span className="font-semibold tabular-nums text-cyan-300">
              {percentage}%
            </span>
          </div>

          <div
            className="intro-progress-track"
            role="progressbar"
            aria-label="Loading weather"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
          >
            <div
              className="intro-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="live-dot" />
            <span className="animate-pulse">
              Gathering live weather data...
            </span>
          </div>
        </div>
      </div>

      <p className="absolute bottom-6 z-10 text-[10px] tracking-[0.2em] text-slate-600">
        FORECAST • CONDITIONS • CLARITY
      </p>
    </div>
  );
}
