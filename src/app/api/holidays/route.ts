/**
 * API Route: /api/holidays
 * Consulta feriados usando Nager.Date (gratis, sin key)
 *
 * Recibe: { countryCode: string, year?: number }
 * Retorna: { holidays: Array<{ date, localName, name, types }> }
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { countryCode = "CL", year = new Date().getFullYear() } =
      await request.json();

    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toUpperCase()}`
    );

    if (!response.ok) {
      throw new Error("Error al consultar feriados");
    }

    const data = await response.json();

    const holidays = data.map((h: any) => ({
      date: h.date,
      localName: h.localName,
      name: h.name,
      types: h.types || ["Public"],
      fixed: h.fixed,
      global: h.global,
    }));

    return NextResponse.json({
      countryCode: countryCode.toUpperCase(),
      year,
      count: holidays.length,
      holidays,
    });
  } catch (error: any) {
    console.error("Holidays API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener feriados. Intente más tarde." },
      { status: 500 }
    );
  }
}