"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  DollarSign,
  Plane,
  ThermometerSun,
  MapPin,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Wind,
  Navigation,
  Zap,
} from "lucide-react";

const TemperatureChart = dynamic(
  () => import("@/app/components/WeatherCharts").then((mod) => mod.TemperatureChart),
  { 
    ssr: false, 
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Cargando gráfico...</div> 
  }
);

const WindChart = dynamic(
  () => import("@/app/components/WeatherCharts").then((mod) => mod.WindChart),
  { 
    ssr: false, 
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Cargando gráfico...</div> 
  }
);

interface ExchangeResult {
  result: number;
  rate: number;
  from: string;
  to: string;
  amount: number;
  date: string;
}

interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  humidity: number;
  wind: number;
  windDeg: number;
  windGust: number;
  windDirection: string;
  icon: string;
  isToday: boolean;
}

interface WeatherResult {
  city: string;
  country: string;
  source: string;
  note?: string;
  forecast: ForecastDay[];
}

interface ViaticosData {
  exchange: ExchangeResult | null;
  weather: WeatherResult | null;
  error: string | null;
}

export default function ViaticosPage() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("CLP");
  const [toCurrency, setToCurrency] = useState("USD");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViaticosData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !city) return;

    setLoading(true);
    setResult(null);

    try {
      const exchangeRes = await fetch(
        `/api/exchange?from=${encodeURIComponent(fromCurrency)}&to=${encodeURIComponent(toCurrency)}&amount=${encodeURIComponent(amount)}`,
        { method: "GET" }
      );

      let exchangeData = null;
      let exchangeError = null;

      if (exchangeRes.ok) {
        exchangeData = await exchangeRes.json();
        if (exchangeData.error) {
          exchangeError = exchangeData.error;
          exchangeData = null;
        }
      } else {
        const err = await exchangeRes.json().catch(() => ({ error: "Error desconocido" }));
        exchangeError = err.error || `Error ${exchangeRes.status}`;
      }

      const weatherRes = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`,
        { method: "GET" }
      );

      let weatherData = null;
      let weatherError = null;

      if (weatherRes.ok) {
        weatherData = await weatherRes.json();
        if (weatherData.error) {
          weatherError = weatherData.error;
          weatherData = null;
        }
      } else {
        const err = await weatherRes.json().catch(() => ({ error: "Error desconocido" }));
        weatherError = err.error || `Error ${weatherRes.status}`;
      }

      const globalError = exchangeError || weatherError || null;

      setResult({
        exchange: exchangeData,
        weather: weatherData,
        error: globalError,
      });
    } catch (err: any) {
      console.error("Error:", err);
      setResult({
        exchange: null,
        weather: null,
        error: "Error de conexión. Verifique su conexión a internet.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string, isToday: boolean) => {
    if (isToday) return "Hoy";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      "01d": "☀️", "01n": "🌙",
      "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️",
      "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️",
      "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️",
    };
    return iconMap[iconCode] || "🌡️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="bg-emerald-800 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Plane className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Viáticos Internacionales</h1>
              <p className="text-emerald-200 text-sm">Conversión de divisas + Pronóstico del destino</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Planifica tu viaje
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 500000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CLP">CLP ($)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ARS">ARS ($)</option>
                    <option value="BRL">BRL (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">A</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CLP">CLP ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ARS">ARS ($)</option>
                    <option value="BRL">BRL (R$)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Ciudad de destino
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Buenos Aires, Madrid, México"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Consultando..." : "Consultar Divisas y Clima"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-emerald-600 font-medium">Cargando...</p>
          </div>
        )}

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <p className="text-red-700 text-center font-medium">{result.error}</p>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="text-sm text-red-600 hover:text-red-800 underline font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reintentar
            </button>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {result.exchange && (
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Conversión de Divisas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Monto original</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat("es-ES").format(result.exchange.amount)} {result.exchange.from}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tasa de cambio</span>
                      <span className="font-semibold">
                        1 {result.exchange.from} = {result.exchange.rate} {result.exchange.to}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-lg px-3">
                      <span className="text-emerald-800 font-medium">Total convertido</span>
                      <span className="text-2xl font-bold text-emerald-700">
                        {new Intl.NumberFormat("es-ES").format(result.exchange.result)} {result.exchange.to}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">Tasa actualizada: {result.exchange.date}</p>
                  </div>
                </div>
              )}

              {result.weather && result.weather.forecast && (
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-orange-500" />
                    Clima en {result.weather.city} — Hoy
                  </h3>
                  {result.weather.forecast
                    .filter((day) => day.isToday)
                    .map((day) => (
                      <div key={day.date} className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{getWeatherIcon(day.icon)}</div>
                          <div>
                            <div className="text-5xl font-bold text-orange-600">{day.temp}°C</div>
                            <div className="text-gray-600 capitalize">{day.description}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="text-gray-500 block">Humedad</span>
                            <span className="font-semibold text-lg">{day.humidity}%</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="text-gray-500 block">Viento</span>
                            <span className="font-semibold text-lg">{day.wind} m/s</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="text-gray-500 block">Máx/Mín</span>
                            <span className="font-semibold text-lg">{day.tempMax}°/{day.tempMin}°</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {result.weather.note && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-3">⚠️ {result.weather.note}</p>
                  )}
                </div>
              )}
            </div>

            {result.weather && result.weather.forecast && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ThermometerSun className="w-5 h-5 text-orange-500" />
                  Pronóstico de Temperatura (3 días)
                </h3>
                <TemperatureChart forecast={result.weather.forecast} formatDate={formatDate} />
              </div>
            )}

            {result.weather && result.weather.forecast && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  Reporte de Vientos (3 días)
                </h3>
                <WindChart forecast={result.weather.forecast} formatDate={formatDate} />
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left p-3 font-medium text-gray-600">Día</th>
                        <th className="text-center p-3 font-medium text-gray-600">Velocidad</th>
                        <th className="text-center p-3 font-medium text-gray-600">Dirección</th>
                        <th className="text-center p-3 font-medium text-gray-600">Ráfagas</th>
                        <th className="text-center p-3 font-medium text-gray-600">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.weather.forecast.map((day) => (
                        <tr key={day.date} className={`border-b ${day.isToday ? "bg-orange-50" : ""}`}>
                          <td className="p-3 font-medium">
                            {formatDate(day.date, day.isToday)}
                            {day.isToday && <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">HOY</span>}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Wind className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold">{day.wind} m/s</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Navigation
                                className="w-4 h-4 text-gray-500"
                                style={{ transform: `rotate(${day.windDeg}deg)` }}
                              />
                              <span>{day.windDirection} ({day.windDeg}°)</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Zap className="w-4 h-4 text-red-500" />
                              <span className="font-semibold text-red-600">{day.windGust} m/s</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {day.wind < 10 ? (
                              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">Leve</span>
                            ) : day.wind < 20 ? (
                              <span className="text-yellow-600 text-xs bg-yellow-100 px-2 py-1 rounded">Moderado</span>
                            ) : (
                              <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded">Fuerte</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.weather && result.weather.forecast && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.weather.forecast.map((day) => (
                  <div
                    key={day.date}
                    className={`bg-white rounded-xl shadow-md p-4 border-2 ${
                      day.isToday ? "border-orange-400" : "border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {formatDate(day.date, day.isToday)}
                      </span>
                      {day.isToday && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">HOY</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{getWeatherIcon(day.icon)}</span>
                      <div>
                        <div className="text-3xl font-bold text-gray-800">{day.temp}°C</div>
                        <div className="text-sm text-gray-500 capitalize">{day.description}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Máx/Mín</span>
                        <span className="font-medium">{day.tempMax}° / {day.tempMin}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Humedad</span>
                        <span className="font-medium">{day.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Viento</span>
                        <span className="font-medium">{day.wind} m/s {day.windDirection}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ráfagas</span>
                        <span className="font-medium text-red-600">{day.windGust} m/s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}