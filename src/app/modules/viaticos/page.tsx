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

// Estructura antigua (sin forecast)
interface OldWeatherResult {
  temp: number;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
  recommendation: string;
  city: string;
  country: string;
  fallback?: boolean;
  note?: string;
}

// Estructura nueva (con forecast)
interface NewWeatherResult {
  city: string;
  country: string;
  source: string;
  note?: string;
  forecast: ForecastDay[];
}

type WeatherResult = OldWeatherResult | NewWeatherResult;

interface ViaticosData {
  exchange: ExchangeResult | null;
  weather: WeatherResult | null;
  error: string | null;
}

// Type guard para verificar si es estructura nueva
function isNewWeather(data: WeatherResult): data is NewWeatherResult {
  return "forecast" in data && Array.isArray(data.forecast);
}

// Convertir estructura antigua a forecast
function oldToForecast(data: OldWeatherResult): ForecastDay[] {
  const today = new Date().toISOString().split("T")[0];
  return [{
    date: today,
    temp: data.temp,
    tempMin: data.temp - 5,
    tempMax: data.temp + 3,
    description: data.description,
    humidity: data.humidity,
    wind: data.wind,
    windDeg: 180,
    windGust: Math.round(data.wind * 1.5),
    windDirection: "S",
    icon: data.icon || "01d",
    isToday: true,
  }];
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

  // Obtener forecast compatible con ambas estructuras
  const getForecast = (weather: WeatherResult | null): ForecastDay[] | null => {
    if (!weather) return null;
    if (isNewWeather(weather)) return weather.forecast;
    return oldToForecast(weather as OldWeatherResult);
  };

  // Obtener ciudad compatible
  const getCity = (weather: WeatherResult | null): string => {
    if (!weather) return "";
    if (isNewWeather(weather)) return weather.city;
    return (weather as OldWeatherResult).city || "";
  };

  // Obtener nota compatible
  const getNote = (weather: WeatherResult | null): string | undefined => {
    if (!weather) return undefined;
    if (isNewWeather(weather)) return weather.note;
    return (weather as OldWeatherResult).note;
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