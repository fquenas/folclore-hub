/**
 * API Route: /api/exchange
 * Consulta tipos de cambio. Intenta API externa primero, fallback a datos locales.
 * Recibe por query: ?from=CLP&to=USD&amount=100000
 * Retorna: { result, rate, from, to, amount, date, source }
 */

import { NextResponse } from "next/server";

// Tasas de fallback (aproximadas, actualizar según necesidad)
const FALLBACK_RATES: Record<string, Record<string, number>> = {
  CLP: { USD: 0.0011, EUR: 0.0010, ARS: 1.05, BRL: 0.0063 },
  USD: { CLP: 910, EUR: 0.92, ARS: 950, BRL: 5.1 },
  EUR: { USD: 1.09, CLP: 990, ARS: 1035, BRL: 5.55 },
  ARS: { USD: 0.00105, CLP: 0.95, EUR: 0.00097, BRL: 0.0054 },
  BRL: { USD: 0.196, CLP: 158, EUR: 0.18, ARS: 185 },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")?.toUpperCase();
    const to = searchParams.get("to")?.toUpperCase();
    const amountParam = searchParams.get("amount");

    if (!from || !to) {
      return NextResponse.json(
        { error: "Faltan parámetros: from, to" },
        { status: 400 }
      );
    }

    const amount = amountParam ? parseFloat(amountParam) : 1;
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser un número mayor a 0" },
        { status: 400 }
      );
    }

    let rate: number | null = null;
    let source = "";

    // Intento 1: API externa exchangerate.fun
    try {
      const response = await fetch(
        `https://api.exchangerate.fun/latest?base=${from}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.rates && data.rates[to]) {
          rate = data.rates[to];
          source = "exchangerate.fun";
        }
      }
    } catch (e) {
      console.log("API externa falló, usando fallback...");
    }

    // Intento 2: Fallback local
    if (!rate && FALLBACK_RATES[from] && FALLBACK_RATES[from][to]) {
      rate = FALLBACK_RATES[from][to];
      source = "fallback-local";
    }

    // Si no hay tasa, error
    if (!rate) {
      return NextResponse.json(
        { error: `No se pudo obtener tasa para ${from} → ${to}` },
        { status: 400 }
      );
    }

    const result = amount * rate;

    return NextResponse.json({
      result: Number(result.toFixed(2)),
      rate: Number(rate.toFixed(6)),
      from,
      to,
      amount,
      date: new Date().toISOString().split("T")[0],
      source,
    });

  } catch (error: any) {
    console.error("Exchange API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la tasa de cambio. Intente más tarde." },
      { status: 500 }
    );
  }
}