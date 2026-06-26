/**
 * API Route: /api/weather
 * Pronóstico de 4 días (ayer, hoy, mañana, pasado mañana) con datos de viento detallados
 * Usa datos demo mejorados (no requiere API key)
 * Recibe por query: ?city=santiago&today=2026-06-26
 * Retorna: { city, country, source, forecast: [{date, temp, tempMin, tempMax, description, humidity, wind, windDeg, windGust, windDirection, icon, isToday}] }
 */

import { NextResponse } from "next/server";

function getWindDirection(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

function getDemoForecast(city: string, todayStr: string) {
  const forecast = [];
  const descriptions = [
    { desc: "cielo despejado", icon: "01d" },
    { desc: "algo de nubes", icon: "02d" },
    { desc: "nubes dispersas", icon: "03d" },
    { desc: "lluvia ligera", icon: "10d" },
  ];

  // Parsear la fecha recibida del frontend (YYYY-MM-DD)
  const [year, month, day] = todayStr.split('-').map(Number);
  const baseDate = new Date(year, month - 1, day);

  // 4 días: ayer (-1), hoy (0), mañana (+1), pasado mañana (+2)
  for (let i = -1; i <= 2; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    // Formato YYYY-MM-DD
    const dateYear = date.getFullYear();
    const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
    const dateDay = String(date.getDate()).padStart(2, '0');
    const dateStr = `${dateYear}-${dateMonth}-${dateDay}`;
    
    const seed = city.length + i * 7 + date.getDate();
    const baseTemp = 18 + (seed % 15);
    const temp = Math.round(baseTemp);
    
    const windSpeed = 5 + (seed % 25);
    const windDeg = (seed * 37) % 360;
    const windGust = Math.round(windSpeed * (1.3 + (seed % 10) / 20));
    const descIdx = Math.abs(seed) % descriptions.length;

    forecast.push({
      date: dateStr,
      temp,
      tempMin: temp - 5,
      tempMax: temp + 4,
      description: descriptions[descIdx].desc,
      humidity: 40 + (seed % 50),
      wind: windSpeed,
      windDeg,
      windGust,
      windDirection: getWindDirection(windDeg),
      icon: descriptions[descIdx].icon,
      isToday: i === 0,
    });
  }

  return {
    city,
    country: "CL",
    source: "demo",
    note: "Usando datos de demostración. Configure OPENWEATHER_API_KEY para datos reales.",
    forecast,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const todayStr = searchParams.get("today");

    if (!city) {
      return NextResponse.json(
        { error: "Falta el parámetro: city" },
        { status: 400 }
      );
    }

    // Si no viene fecha del frontend, usar fecha del servidor como fallback
    const today = todayStr || new Date().toISOString().split('T')[0];

    console.log(`🌤️ Consultando clima para: ${city} - Fecha base: ${today}`);
    return NextResponse.json(getDemoForecast(city, today));

  } catch (error: any) {
    console.error("💥 Weather API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el clima. Intente más tarde." },
      { status: 500 }
    );
  }
}