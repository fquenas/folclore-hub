/**
 * API Route: /api/exchange
 * Consulta tipos de cambio usando api.exchangerate.fun (gratis, sin key, soporta CLP/ARS/COP)
 * Recibe por query: ?from=CLP&to=USD&amount=100000
 * Retorna: { result, rate, from, to, amount, date }
 */

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // 1. Extraer query params de la URL
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const amountParam = searchParams.get("amount");

    // 2. Validar parámetros obligatorios
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

    console.log(`🔄 Consultando tasa: ${from.toUpperCase()} → ${to.toUpperCase()}, monto: ${amount}`);

    // 3. Llamada a exchangerate.fun (gratis, sin key, soporta CLP/ARS/COP/etc)
    const response = await fetch(
      `https://api.exchangerate.fun/latest?base=${from.toUpperCase()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en API externa:", response.status, errorText);
      throw new Error(`Error ${response.status} al consultar tasas de cambio`);
    }

    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];

    if (!rate) {
      console.error("❌ Moneda no encontrada:", to, "Rates disponibles:", Object.keys(data.rates || {}).slice(0, 10));
      return NextResponse.json(
        { error: `Moneda ${to} no soportada por el servicio de cambio` },
        { status: 400 }
      );
    }

    // 4. Calcular resultado
    const result = amount * rate;

    console.log("✅ Tasa obtenida:", { from, to, rate, result });

    // 5. Retornar respuesta exitosa
    return NextResponse.json({
      result: Number(result.toFixed(2)),
      rate: Number(rate.toFixed(4)),
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount,
      date: data.date || new Date().toISOString().split("T")[0],
    });

  } catch (error: any) {
    console.error("💥 Exchange API error:", error);
    return NextResponse.json(
      { error: "No se pudo obtener la tasa de cambio. Intente más tarde." },
      { status: 500 }
    );
  }
}