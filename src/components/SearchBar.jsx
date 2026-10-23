
import { Search, MapPin, ArrowRight, X } from "lucide-react";

export default function SearchBar({
  city,
  setCity,
  onSearch,
  onLocation,
  loading,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    const value = city.trim();

    if (value && !loading) {
      onSearch(value);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-sky-950/30 backdrop-blur-2xl sm:p-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/70 px-4 py-3.5 transition-all duration-300 focus-within:border-sky-400 focus-within:bg-slate-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400 transition group-focus-within:bg-sky-400/20">
            <Search size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="city-search"
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400"
            >
              Explore weather
            </label>

            <input
              id="city-search"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter your city..."
              aria-label="Search city"
              autoComplete="off"
              className="w-full border-0 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500 focus:ring-0"
            />
          </div>

          {city && (
            <button
              type="button"
              onClick={() => setCity("")}
              disabled={loading}
              aria-label="Clear city"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Current Location */}
        <button
          type="button"
          onClick={onLocation}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/70 px-5 py-4 text-sm font-medium text-slate-200 transition duration-300 hover:border-sky-400/50 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MapPin size={18} className="text-sky-400" />
          <span>My location</span>
        </button>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-7 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sky-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{loading ? "Searching..." : "Search weather"}</span>
          {!loading && (
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </button>
      </div>

      <p className="mt-3 px-1 text-xs text-slate-500">
        <MapPin size={12} className="mr-1 inline text-sky-400" />
        Discover current weather conditions for any city.
      </p>
    </form>
  );
}
