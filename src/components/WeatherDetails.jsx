
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
} from "lucide-react";

function Detail({ icon: Icon, label, value, hint }) {
  return (
    <div className="detail-card rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
        <Icon size={17} className="text-sky-400" />
        <span>{label}</span>
      </div>
      <p className="mt-4 text-xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export default function WeatherDetails({
  humidity,
  wind,
  visibility,
  pressure,
  sunrise,
  sunset,
}) {
  return (
    <section>
      <h3 className="section-title mb-4">Today's highlights</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Detail
          icon={Droplets}
          label="Humidity"
          value={`${humidity ?? "—"}%`}
          hint="Relative humidity"
        />
        <Detail
          icon={Wind}
          label="Wind speed"
          value={`${wind ?? "—"} km/h`}
          hint="Near surface"
        />
        <Detail
          icon={Eye}
          label="Visibility"
          value={visibility == null ? "—" : `${visibility} km`}
          hint="Estimated visibility"
        />
        <Detail
          icon={Gauge}
          label="Pressure"
          value={pressure == null ? "—" : `${pressure} hPa`}
          hint="Sea-level pressure"
        />
        <Detail
          icon={Sunrise}
          label="Sunrise"
          value={sunrise || "—"}
          hint="Local time"
        />
        <Detail
          icon={Sunset}
          label="Sunset"
          value={sunset || "—"}
          hint="Local time"
        />
      </div>
    </section>
  );
}
