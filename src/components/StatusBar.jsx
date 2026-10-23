
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function StatusBar({
  loading = false,
  error = "",
  lastUpdated = "",
}) {
  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-500"
      >
        <AlertCircle size={17} className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      {loading ? (
        <>
          <RefreshCw size={14} className="animate-spin" />
          <span>Updating weather…</span>
        </>
      ) : (
        <>
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>
            {lastUpdated
              ? `Last updated ${lastUpdated}`
              : "Connected to live weather data"}
          </span>
        </>
      )}
    </div>
  );
}
