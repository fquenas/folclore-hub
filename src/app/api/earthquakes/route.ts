/**
 * API Route: /api/earthquakes
 * Consulta sismos recientes usando USGS (gratis, sin key)
 *
 * Recibe: { days?: number, minMagnitude?: number }
 * Retorna: { earthquakes: Array<{ place, magnitude, time, coordinates, url }> }
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { days = 7, minMagnitude = 4.0 } = await request.json();

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=${minMagnitude}&orderby=time`
    );

    if (!response.ok) {
      throw new Error("Error al consultar sismos");
    }

    const data = await response.json();

    const earthquakes = data.features.map((feature: any) => ({
      place: feature.properties.place,
      magnitude: feature.properties.mag,
      time: new Date(feature.properties.time).toISOString(),
      coordinates: feature.geometry.coordinates,
      depth: feature.geometry.coordinates[2],
      url: feature.properties.url,
      tsunami: feature.properties.tsunami === 1,
      alert: feature.properties.alert, // green, yellow, orange, red
    }));

    return NextResponse.json({
      count: earthquakes.length,
      earthquakes,
      period: { startDate, endDate },
    });
  } catch (error: any) {
    console.error("Earthquakes API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener datos sísmicos. Intente más tarde." },
      { status: 500 }
    );
  }
}