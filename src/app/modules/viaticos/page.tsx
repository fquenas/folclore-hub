"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Plane,
  ThermometerSun,
  MapPin,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

/**
 * MÓDULO 1: Viáticos Internacionales 💸🌤️
 *
 * Contexto del proyecto folclórico: Cuando el grupo viaja al extranjero
 * para presentaciones internacionales, los integrantes necesitan saber
 * cuánto dinero llevar en dólares y qué ropa empacar según el clima.
 *
 * Este módulo hace DOS llamadas paralelas desde el backend:
 * 1. Conversión de divisas (API ExchangeRate)
 * 2. Clima del destino (API Weather)
 *
 * NOTA DE SEGURIDAD: Las API keys NUNCA están en el frontend.
 * Todo pasa por las API Routes de Next.js que usan variables de entorno.
 */

interface ExchangeResult {
  result: number;
  rate: number;
  from: string;
  to: string;
  amount: number;
  date: string;
}

interface WeatherResult {
  temp: number;
  description: string;
  humidity: number;
  wind: number;
  recommendation: string;
  city: string;
  country: string;
  fallback?: boolean;
  note?: string;
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
      // Llamada 1: Conversión de divisas
      const exchangeRes = await fetch("/api/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount),
        }),
      });

      const exchangeData = exchangeRes.ok
        ? await exchangeRes.json()
        : null;
      const exchangeError = !exchangeRes.ok
        ? (await exchangeRes.json()).error
        : null;

      // Llamada 2: Clima del destino
      const weatherRes = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      const weatherData = weatherRes.ok
        ? await weatherRes.json()
        : null;
      const weatherError = !weatherRes.ok
        ? (await weatherRes.json()).error
        : null;

      const globalError = exchangeError || weatherError || null;

      setResult({
        exchange: exchangeData?.error ? null : exchangeData,
        weather: weatherData?.error ? null : weatherData,
        error: globalError,
      });
    } catch (err: any) {
      setResult({
        exchange: null,
        weather: null,
        error: "Error de conexión. Verifique su conexión a internet.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Plane className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Viáticos Internacionales</h1>
              <p className="text-emerald-200 text-sm">
                Conversión de divisas + Clima del destino
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Planifica tu viaje
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto
                </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    De
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    A
                  </label>
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

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-emerald-600 font-medium">Cargando...</p>
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <p className="text-red-700 text-center font-medium">
              {result.error}
            </p>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="text-sm text-red-600 hover:text-red-800 underline font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reintentar
            </button>
          </div>
        )}

        {/* Resultados */}
        {result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resultado Divisas */}
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
                      {new Intl.NumberFormat("es-ES").format(
                        result.exchange.amount
                      )}{" "}
                      {result.exchange.from}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tasa de cambio</span>
                    <span className="font-semibold">
                      1 {result.exchange.from} = {result.exchange.rate}{" "}
                      {result.exchange.to}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-lg px-3">
                    <span className="text-emerald-800 font-medium">
                      Total convertido
                    </span>
                    <span className="text-2xl font-bold text-emerald-700">
                      {new Intl.NumberFormat("es-ES").format(
                        result.exchange.result
                      )}{" "}
                      {result.exchange.to}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Tasa actualizada: {result.exchange.date}
                  </p>
                </div>
              </div>
            )}

            {/* Resultado Clima */}
            {result.weather && (
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ThermometerSun className="w-5 h-5 text-orange-500" />
                  Clima en {result.weather.city}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-orange-600">
                      {result.weather.temp}°C
                    </div>
                    <div className="text-gray-600 capitalize">
                      {result.weather.description}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-500">Humedad</span>
                      <p className="font-semibold">
                        {result.weather.humidity}%
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-500">Viento</span>
                      <p className="font-semibold">
                        {result.weather.wind} m/s
                      </p>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 mt-3">
                    <p className="text-sm font-medium text-orange-800">
                      👕 Recomendación de vestimenta:
                    </p>
                    <p className="text-orange-700 mt-1">
                      {result.weather.recommendation}
                    </p>
                  </div>
                  {result.weather.fallback && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      ⚠️ {result.weather.note}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}