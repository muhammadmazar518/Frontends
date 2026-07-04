import React, { useState, useEffect } from "react";

const WEATHER_API_KEY = "066719477ade4350b7f100338261106";

const getColor = (condition) => {
  if (!condition) return "#38bdf8";
  const c = condition.toLowerCase();
  if (c.includes("sunny")) return "#fbbf24";
  if (c.includes("clear")) return "#38bdf8";
  if (c.includes("thunder")) return "#7c3aed";
  if (c.includes("snow")) return "#bae6fd";
  if (c.includes("rain") || c.includes("drizzle")) return "#3b82f6";
  if (c.includes("cloud") || c.includes("overcast")) return "#94a3b8";
  if (c.includes("mist") || c.includes("fog")) return "#9ca3af";
  return "#38bdf8";
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const fetchWeather = async (query) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${query}&days=5&aqi=no`
      );
      if (!res.ok) throw new Error("City not found. Please try another name.");
      const data = await res.json();
      setWeather(data.current);
      setForecast(data.forecast.forecastday);
      setLocation(`${data.location.name}, ${data.location.country}`);
    } catch (err) {
      setError(err.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always default to Lahore
    fetchWeather("Lahore");
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) fetchWeather(searchCity.trim());
  };

  const accentColor = weather ? getColor(weather.condition.text) : "#38bdf8";

  return (
    <div>
      <h1 className="text-white text-[30px] font-extrabold mb-2 tracking-tight">
        Weather
      </h1>
      <p className="text-black text-sm mb-6">
        Live weather for your current location
      </p>

      {/* Search Row */}
      <div className="flex items-center gap-2.5 mb-6 flex-wrap">
        <span className="text-[18px]">📍</span>
        <input
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search another city..."
          className="flex-1 min-w-[200px] px-3.5 py-[11px] bg-[#161824] border border-[#1e2130] rounded-[10px] text-white text-sm outline-none"
        />
        <button
          onClick={handleSearch}
          style={{ background: accentColor }}
          className="px-[22px] py-[11px] border-none rounded-[10px] text-[#0d0f14] font-bold text-sm cursor-pointer shrink-0"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchCity("");
            fetchWeather("Lahore");
          }}
          className="px-4 py-[11px] border border-[#1e2130] rounded-[10px] bg-[#161824] text-gray-400 text-[13px] font-semibold cursor-pointer shrink-0"
        >
          📍 Lahore
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-[3px] border-[#1e2130] border-t-sky-400 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-black text-sm">Fetching weather...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-[#1f0a0a] border border-red-900 text-red-300 px-4 py-3 rounded-[10px] text-sm mb-5">
          {error}
        </div>
      )}

      {/* Main Weather Card */}
      {weather && !loading && (
        <>
          <div
            className="bg-[#161824] border border-[#1e2130] rounded-2xl p-7 flex gap-8 mb-7 flex-wrap"
            style={{ borderTop: `4px solid ${accentColor}` }}
          >
            {/* Left */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-1.5 mb-3">
                <span>📍</span>
                <span className="text-gray-400 text-[13px] font-semibold">
                  {location}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={`https:${weather.condition.icon}`}
                  alt={weather.condition.text}
                  className="w-16 h-16"
                />
                <span
                  className="text-[64px] font-extrabold tracking-[-2px]"
                  style={{ color: accentColor }}
                >
                  {weather.temp_c}°C
                </span>
              </div>
              <p className="text-white text-lg font-semibold m-0 mb-1">
                {weather.condition.text}
              </p>
              <p className="text-gray-500 text-sm m-0 mb-1.5">
                Feels like {weather.feelslike_c}°C
              </p>
              <p className="text-gray-600 text-[11px] m-0">
                Last updated: {weather.last_updated}
              </p>
            </div>

            {/* Right — Stats Grid */}
            <div className="grid grid-cols-2 gap-3 content-start">
              {[
                { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
                { label: "Wind Speed", value: `${weather.wind_kph} km/h`, icon: "💨" },
                { label: "Visibility", value: `${weather.vis_km} km`, icon: "👁" },
                { label: "UV Index", value: weather.uv, icon: "☀️" },
                { label: "Pressure", value: `${weather.pressure_mb} mb`, icon: "🌡" },
                { label: "Cloud Cover", value: `${weather.cloud}%`, icon: "☁️" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 bg-[#0d0f14] p-3 rounded-[10px]"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-gray-500 text-[11px] font-semibold m-0 mb-0.5">
                      {item.label}
                    </p>
                    <p
                      className="text-[15px] font-bold m-0"
                      style={{ color: accentColor }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast */}
          {forecast.length > 0 && (
            <div>
              <h2 className="text-white text-base font-bold mb-3.5">
                5-Day Forecast
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {forecast.map((day) => (
                  <div
                    key={day.date}
                    className="bg-[#161824] border border-[#1e2130] rounded-xl p-4 text-center"
                  >
                    <p className="text-gray-400 text-[11px] font-semibold m-0 mb-2">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <img
                      src={`https:${day.day.condition.icon}`}
                      alt={day.day.condition.text}
                      className="w-12 mx-auto"
                    />
                    <p className="text-white text-[11px] leading-snug my-1.5">
                      {day.day.condition.text}
                    </p>
                    <div className="flex justify-center gap-2 mb-2">
                      <span
                        className="text-base font-bold"
                        style={{ color: accentColor }}
                      >
                        {day.day.maxtemp_c}°
                      </span>
                      <span className="text-base font-bold text-gray-500">
                        {day.day.mintemp_c}°
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>💧 {day.day.avghumidity}%</span>
                      <span>💨 {day.day.maxwind_kph}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Weather;