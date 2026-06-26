/**
 * API Route: /api/shipping
 * Calcula fecha de entrega real considerando feriados y fines de semana
 * Los costos se ingresan y muestran en la MONEDA LOCAL del país seleccionado
 */

import { NextResponse } from "next/server";

// Mapa de países a sus monedas
const countryCurrencies: Record<string, { code: string; name: string }> = {
  CL: { code: "CLP", name: "Peso chileno" },
  AR: { code: "ARS", name: "Peso argentino" },
  PE: { code: "PEN", name: "Sol" },
  BO: { code: "BOB", name: "Boliviano" },
  BR: { code: "BRL", name: "Real" },
  UY: { code: "UYU", name: "Peso uruguayo" },
  MX: { code: "MXN", name: "Peso mexicano" },
  ES: { code: "EUR", name: "Euro" },
};

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function addBusinessDays(
  startDate: Date,
  days: number,
  holidays: string[]
): { date: Date; skippedHolidays: number } {
  let current = new Date(startDate);
  let remaining = days;
  let skippedHolidays = 0;
  const holidaySet = new Set(holidays);

  while (remaining > 0) {
    current.setDate(current.getDate() + 1);
    const dateStr = current.toISOString().split("T")[0];

    if (isWeekend(current)) {
      continue;
    }

    if (holidaySet.has(dateStr)) {
      skippedHolidays++;
      continue;
    }

    remaining--;
  }

  return { date: current, skippedHolidays };
}

export async function POST(request: Request) {
  try {
    const {
      startDate,
      days,
      countryCode = "CL",
      transportCost = 0,
      lodgingCost = 0,
      foodCost = 0,
      otherCost = 0,
    } = await request.json();

    if (!startDate || !days) {
      return NextResponse.json(
        { error: "Faltan parámetros: startDate, days" },
        { status: 400 }
      );
    }

    const year = new Date(startDate).getFullYear();
    const currencyInfo = countryCurrencies[countryCode.toUpperCase()] || {
      code: "USD",
      name: "Dólar",
    };

    // Obtener feriados
    const holidaysResponse = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toUpperCase()}`
    );

    let holidays: any[] = [];
    if (holidaysResponse.ok) {
      const holidaysData = await holidaysResponse.json();
      holidays = holidaysData.map((h: any) => ({
        date: h.date,
        localName: h.localName,
        name: h.name,
        types: h.types || ["Public"],
        fixed: h.fixed,
        global: h.global,
      }));
    }

    const holidayDates = holidays.map((h: any) => h.date);

    const start = new Date(startDate);
    const { date: estimatedDate, skippedHolidays } = addBusinessDays(
      start,
      days,
      holidayDates
    );

    // Los costos YA vienen en moneda local (pesos, soles, etc.)
    const totalCostLocal = transportCost + lodgingCost + foodCost + otherCost;

    return NextResponse.json({
      startDate,
      requestedDays: days,
      estimatedDate: estimatedDate.toISOString().split("T")[0],
      estimatedDateFormatted: estimatedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      businessDays: days,
      holidaysSkipped: skippedHolidays,
      totalCalendarDays: Math.ceil(
        (estimatedDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      ),
      costLocal: Number(totalCostLocal.toFixed(currencyInfo.code === "EUR" ? 2 : 0)),
      currency: currencyInfo.code,
      currencyName: currencyInfo.name,
      countryCode: countryCode.toUpperCase(),
      holidays: holidays,
      breakdown: {
        transport: transportCost,
        lodging: lodgingCost,
        food: foodCost,
        other: otherCost,
        total: totalCostLocal,
      },
    });
  } catch (error: any) {
    console.error("Shipping API error:", error);
    return NextResponse.json(
      { error: "No se pudo calcular la fecha de entrega. Intente más tarde." },
      { status: 500 }
    );
  }
}