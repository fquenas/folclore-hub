/**
 * API Route: /api/exchange
 * Consulta tipos de cambio usando api.exchangerate.fun (gratis, sin key)
 * Recibe: { from: string, to: string, amount: number }
 * Retorna: { result: number, rate: number, from: string, to: string }
 *
 * NOTA DE SEGURIDAD: Esta API no requiere key, pero si usáramos una que sí,
 * la key iría en process.env.NOMBRE_KEY y NUNCA en el frontend.
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { from, to, amount } = await request.json();

    if (!from || !to || !amount) {
      return NextResponse.json(
        { error: "Faltan parámetros: from, to, amount" },
        { status: 400 }
      );
    }

    // Llamada a la API de divisas (gratis, sin key)
    const response = await fetch(
      `https://api.exchangerate.fun/latest?base=${from.toUpperCase()}`
    );

    if (!response.ok) {
      throw new Error("Error al consultar tasas de cambio");
    }

    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];

    if (!rate) {
      return NextResponse.json(
        { error: `Moneda ${to} no soportada` },
        { status: 400 }
      );
    }

    const result = amount * rate;

    return NextResponse.json({
      result: Number(result.toFixed(2)),
      rate: Number(rate.toFixed(4)),
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount,
      date: data.date,
    });
  } catch (error: any) {
    console.error("Exchange API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la tasa de cambio. Intente más tarde." },
      { status: 500 }
    );
  }
}