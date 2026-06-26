/**
 * API Route: /api/weather
 * Consulta el clima usando OpenWeatherMap
 * La API key se lee de variables de entorno (process.env.OPENWEATHER_API_KEY)
 * NUNCA se expone en el frontend
 *
 * Recibe: { city: string }
 * Retorna: { temp, description, humidity, wind, icon, recommendation }
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { city } = await request.json();

    if (!city) {
      return NextResponse.json(
        { error: "Falta el parámetro: city" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      // Fallback: si no hay key, retornamos datos simulados para demo
      // En producción, esto debería retornar error 500
      return NextResponse.json({
        temp: 22,
        description: "cielo despejado",
        humidity: 65,
        wind: 12,
        icon: "01d",
        recommendation: "Ropa ligera, protector solar",
        city: city,
        fallback: true,
        note: "Usando datos de demostración. Configure OPENWEATHER_API_KEY en .env.local para datos reales.",
      });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=es`
    );

    if (!response.ok) {
      throw new Error("Error al consultar el clima");
    }

    const data = await response.json();

    // Generar recomendación de vestimenta basada en temperatura
    const temp = data.main.temp;
    let recommendation = "";

    if (temp < 5)
      recommendation = "🧥 Abrigo pesado, gorro y guantes";
    else if (temp < 15)
      recommendation = "🧥 Chaqueta o sweater";
    else if (temp < 25)
      recommendation = "👕 Ropa ligera, llevar una chaqueta por si acaso";
    else recommendation = "👕 Ropa muy ligera, protector solar, gorra";

    return NextResponse.json({
      temp: Math.round(temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed),
      icon: data.weather[0].icon,
      recommendation,
      city: data.name,
      country: data.sys.country,
    });
  } catch (error: any) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el clima. Intente más tarde." },
      { status: 500 }
    );
  }
}