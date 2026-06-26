"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  Activity,
  CloudRain,
  MapPin,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

/**
 * MÓDULO 2: Monitor de Alertas Sísmicas 🚨🌧️
 *
 * Contexto del proyecto folclórico: Cuando el grupo planea giras o eventos
 * al aire libre, es crucial saber si hay actividad sísmica en la zona
 * combinada con clima adverso que podría dificultar evacuaciones o ayuda.
 *
 * Este módulo:
 * 1. Muestra los últimos sismos significativos desde USGS
 * 2. Si un sismo fue magnitud 6.0+ Y hay clima adverso (lluvia/tormenta) en la zona,
 *    activa una alerta visual roja: "⚠️ PRIORIDAD DE AYUDA HUMANA"
 */

interface Earthquake {
  place: string;
  magnitude: number;
  time: string;
  coordinates: number[];
  depth: number;
  url: string;
  tsunami: boolean;
  alert: string | null;
  weatherAlert?: boolean;
  weatherDescription?: string;
}

interface AlertasData {
  count: number;
  earthquakes: Earthquake[];
  period: { startDate: string; endDate: string };
  highPriorityAlerts: Earthquake[];
}

export default function AlertasPage() {
  const [days, setDays] = useState(7);
  const [minMagnitude, setMinMagnitude] = useState(4.0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AlertasData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEarthquakes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/earthquakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, minMagnitude }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al cargar datos");
      }

      // Si magnitud >= 6.0, consultamos clima en esa zona
      const enrichedEarthquakes = await Promise.all(
        result.earthquakes.map(async (eq: Earthquake) => {
          if (eq.magnitude >= 6.0) {
            try {
              const weatherRes = await fetch("/api/weather", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  city:
                    eq.place.split("of")[1]?.trim() ||
                    eq.place.split(",")[0]?.trim() ||
                    eq.place,
                }),
              });
              const weather = await weatherRes.json();

              // Clima adverso: lluvia, tormenta, nieve intensa
              const adverseWeather = [
                "rain",
                "thunderstorm",
                "snow",
                "drizzle",
              ];
              const isAdverse = adverseWeather.some((w) =>
                weather.description?.toLowerCase().includes(w)
              );

              return {
                ...eq,
                weatherAlert: isAdverse,
                weatherDescription: weather.description,
              };
            } catch {
              return eq;
            }
          }
          return eq;
        })
      );

      const highPriority = enrichedEarthquakes.filter(
        (eq: Earthquake) => eq.magnitude >= 6.0 && eq.weatherAlert
      );

      setData({
        ...result,
        earthquakes: enrichedEarthquakes,
        highPriorityAlerts: highPriority,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
  }, []);

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7.0) return "bg-red-600 text-white";
    if (mag >= 6.0) return "bg-orange-500 text-white";
    if (mag >= 5.0) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };

  const getAlertLevel = (alert: string | null) => {
    switch (alert) {
      case "red":
        return { color: "bg-red-100 text-red-800", label: "Alerta Roja" };
      case "orange":
        return {
          color: "bg-orange-100 text-orange-800",
          label: "Alerta Naranja",
        };
      case "yellow":
        return {
          color: "bg-yellow-100 text-yellow-800",
          label: "Alerta Amarilla",
        };
      default:
        return { color: "bg-green-100 text-green-800", label: "Sin alerta" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-red-800 text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Monitor de Alertas Sísmicas
              </h1>
              <p className="text-red-200 text-sm">
                Sismos recientes + alerta de clima adverso
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Días atrás
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value={1}>1 día</option>
                <option value={7}>7 días</option>
                <option value={14}>14 días</option>
                <option value={30}>30 días</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Magnitud mínima
              </label>
              <select
                value={minMagnitude}
                onChange={(e) => setMinMagnitude(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value={3.0}>3.0+</option>
                <option value={4.0}>4.0+</option>
                <option value={5.0}>5.0+</option>
                <option value={6.0}>6.0+</option>
                <option value={7.0}>7.0+</option>
              </select>
            </div>
            <button
              onClick={fetchEarthquakes}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Consultando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="text-red-600 font-medium">Cargando sismos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <p className="text-red-700 text-center font-medium">{error}</p>
            <button
              onClick={fetchEarthquakes}
              className="text-sm text-red-600 hover:text-red-800 underline font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reintentar
            </button>
          </div>
        )}

        {/* Alertas de Alta Prioridad */}
        {data && data.highPriorityAlerts.length > 0 && (
          <div className="bg-red-600 text-white rounded-xl p-6 mb-8 shadow-lg animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-xl font-bold">
                ⚠️ PRIORIDAD DE AYUDA HUMANA
              </h2>
            </div>
            <p className="text-red-100 mb-4">
              Se detectaron {data.highPriorityAlerts.length} sismo(s) de
              magnitud 6.0+ con clima adverso en la zona. Esto dificulta
              operaciones de rescate y evacuación.
            </p>
            <div className="space-y-2">
              {data.highPriorityAlerts.map((eq, i) => (
                <div
                  key={i}
                  className="bg-red-700 rounded-lg p-3 flex items-center gap-3"
                >
                  <CloudRain className="w-5 h-5" />
                  <span className="font-semibold">M{eq.magnitude}</span>
                  <span>{eq.place}</span>
                  <span className="text-red-200 text-sm">
                    ({eq.weatherDescription})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Sismos */}
        {data && !loading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Sismos encontrados: {data.count}
              </h2>
              <p className="text-sm text-gray-500">
                Periodo: {data.period.startDate} al {data.period.endDate}
              </p>
            </div>

            <div className="space-y-4">
              {data.earthquakes.map((eq, i) => {
                const alertInfo = getAlertLevel(eq.alert);
                const isHighPriority =
                  eq.magnitude >= 6.0 && eq.weatherAlert;

                return (
                  <div
                    key={i}
                    className={`bg-white rounded-xl shadow-md p-5 border-l-4 transition-all hover:shadow-lg ${
                      isHighPriority
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${getMagnitudeColor(
                            eq.magnitude
                          )}`}
                        >
                          {eq.magnitude.toFixed(1)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {eq.place}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(eq.time).toLocaleString("es-ES")}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Profundidad: {eq.depth.toFixed(1)} km
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${alertInfo.color}`}
                        >
                          {alertInfo.label}
                        </span>
                        {eq.tsunami && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            🌊 Alerta de tsunami
                          </span>
                        )}
                        {eq.weatherAlert && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1">
                            <CloudRain className="w-3 h-3" />
                            Clima adverso
                          </span>
                        )}
                      </div>
                    </div>

                    {isHighPriority && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-medium text-sm">
                          ⚠️ PRIORIDAD DE AYUDA HUMANA: Sismo mayor + clima
                          adverso detectado
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}