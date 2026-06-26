"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Truck,
  DollarSign,
  Clock,
  CheckCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Bus,
  Hotel,
  Utensils,
  Receipt,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isWeekend,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * MÓDULO 3: Planificador de Eventos con Calendario Visual
 * Los costos se ingresan y muestran en la MONEDA LOCAL del país seleccionado
 */

interface Holiday {
  date: string;
  localName: string;
  name: string;
}

interface CostBreakdown {
  transport: number;
  lodging: number;
  food: number;
  other: number;
  total: number;
}

interface ShippingResult {
  startDate: string;
  requestedDays: number;
  estimatedDate: string;
  estimatedDateFormatted: string;
  businessDays: number;
  holidaysSkipped: number;
  totalCalendarDays: number;
  costLocal: number;
  currency: string;
  currencyName: string;
  countryCode: string;
  holidays: Holiday[];
  breakdown: CostBreakdown;
}

// Mapa de países a monedas para el frontend
const countryCurrencies: Record<string, { code: string; name: string; symbol: string }> = {
  CL: { code: "CLP", name: "Peso chileno", symbol: "$" },
  AR: { code: "ARS", name: "Peso argentino", symbol: "$" },
  PE: { code: "PEN", name: "Sol", symbol: "S/" },
  BO: { code: "BOB", name: "Boliviano", symbol: "Bs" },
  BR: { code: "BRL", name: "Real", symbol: "R$" },
  UY: { code: "UYU", name: "Peso uruguayo", symbol: "$U" },
  MX: { code: "MXN", name: "Peso mexicano", symbol: "$" },
  ES: { code: "EUR", name: "Euro", symbol: "€" },
};

function CalendarView({
  currentMonth,
  holidays,
  startDate,
  estimatedDate,
  onMonthChange,
}: {
  currentMonth: Date;
  holidays: Holiday[];
  startDate: string | null;
  estimatedDate: string | null;
  onMonthChange: (date: Date) => void;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const holidayDates = new Set(holidays.map((h) => h.date));
  const holidayMap = new Map(holidays.map((h) => [h.date, h]));

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const startDateObj = startDate ? new Date(startDate) : null;
  const estimatedDateObj = estimatedDate ? new Date(estimatedDate) : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-gray-800 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <button
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((wd) => (
          <div key={wd} className="text-center text-xs font-semibold text-gray-500 py-2">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const dateStr = format(d, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(d, monthStart);
          const isWeekendDay = isWeekend(d);
          const isHoliday = holidayDates.has(dateStr);
          const holidayInfo = holidayMap.get(dateStr);
          const isStart = startDateObj && isSameDay(d, startDateObj);
          const isEnd = estimatedDateObj && isSameDay(d, estimatedDateObj);
          const isInRange =
            startDateObj &&
            estimatedDateObj &&
            d > startDateObj &&
            d < estimatedDateObj &&
            !isWeekendDay &&
            !isHoliday;

          return (
            <div
              key={i}
              className={`
                relative min-h-[60px] p-1 rounded-lg text-sm border transition-all
                ${!isCurrentMonth ? "bg-gray-50 text-gray-300" : ""}
                ${isCurrentMonth && !isWeekendDay && !isHoliday ? "bg-white text-gray-800 hover:bg-gray-50" : ""}
                ${isWeekendDay && isCurrentMonth ? "bg-red-50 text-red-400" : ""}
                ${isHoliday && isCurrentMonth ? "bg-amber-100 text-amber-800 border-amber-300" : ""}
                ${isStart ? "ring-2 ring-blue-500 bg-blue-100 font-bold" : ""}
                ${isEnd ? "ring-2 ring-green-500 bg-green-100 font-bold" : ""}
                ${isInRange ? "bg-blue-50" : ""}
              `}
              title={
                isHoliday && holidayInfo
                  ? `${holidayInfo.localName} - ${holidayInfo.name}`
                  : isWeekendDay
                  ? "Fin de semana"
                  : ""
              }
            >
              <span className="block text-center font-medium">{format(d, "d")}</span>
              {isHoliday && holidayInfo && (
                <span className="block text-[8px] text-center text-amber-700 leading-tight mt-1 truncate">
                  {holidayInfo.localName}
                </span>
              )}
              {isStart && (
                <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-blue-500 text-white rounded-b">
                  Inicio
                </span>
              )}
              {isEnd && (
                <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-green-500 text-white rounded-b">
                  Evento
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
          <span>Inicio</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
          <span>Evento</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
          <span>Feriado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-50 text-red-400 rounded"></div>
          <span>Fin de semana</span>
        </div>
      </div>
    </div>
  );
}

export default function LogisticaPage() {
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("");
  const [countryCode, setCountryCode] = useState("CL");
  
  const [transportCost, setTransportCost] = useState("");
  const [lodgingCost, setLodgingCost] = useState("");
  const [foodCost, setFoodCost] = useState("");
  const [otherCost, setOtherCost] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Obtener la moneda del país seleccionado
  const currentCurrency = countryCurrencies[countryCode] || { code: "USD", name: "Dólar", symbol: "$" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !days) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          days: parseInt(days),
          countryCode,
          transportCost: parseFloat(transportCost) || 0,
          lodgingCost: parseFloat(lodgingCost) || 0,
          foodCost: parseFloat(foodCost) || 0,
          otherCost: parseFloat(otherCost) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al calcular");
      }

      setResult(data);
      setCurrentMonth(new Date(startDate));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatear número con separador de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Planificador de Eventos</h1>
              <p className="text-blue-200 text-sm">
                Calendario visual + Costos en moneda local
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Formulario y Resultados */}
          <div className="space-y-6">
            {/* Formulario */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Planificar ensayo o presentación
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fecha y días */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Días hábiles necesarios
                    </label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      placeholder="Ej: 5"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* País */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CL">Chile (CLP)</option>
                    <option value="AR">Argentina (ARS)</option>
                    <option value="PE">Perú (PEN)</option>
                    <option value="BO">Bolivia (BOB)</option>
                    <option value="BR">Brasil (BRL)</option>
                    <option value="UY">Uruguay (UYU)</option>
                    <option value="MX">México (MXN)</option>
                    <option value="ES">España (EUR)</option>
                  </select>
                </div>

                {/* Costos personalizados en moneda local */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Costos del evento ({currentCurrency.name})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Bus className="w-3 h-3" />
                        Transporte ({currentCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        value={transportCost}
                        onChange={(e) => setTransportCost(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Hotel className="w-3 h-3" />
                        Hospedaje ({currentCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        value={lodgingCost}
                        onChange={(e) => setLodgingCost(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        Comida ({currentCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        value={foodCost}
                        onChange={(e) => setFoodCost(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Receipt className="w-3 h-3" />
                        Otros ({currentCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        value={otherCost}
                        onChange={(e) => setOtherCost(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Calculando..." : "Calcular Fecha y Costos"}
                </button>
              </form>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-blue-600 font-medium">Calculando...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <p className="text-red-700 text-center font-medium">{error}</p>
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
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Resultado del cálculo
                </h3>

                {/* Fecha estimada */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Fecha estimada de evento
                  </p>
                  <p className="text-xl font-bold text-blue-800">
                    {result.estimatedDateFormatted}
                  </p>
                  <p className="text-sm text-blue-500 mt-1">
                    {result.estimatedDate}
                  </p>
                </div>

                {/* Info de días */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Días hábiles</p>
                    <p className="text-lg font-bold text-gray-800">{result.businessDays}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Días calendario</p>
                    <p className="text-lg font-bold text-gray-800">{result.totalCalendarDays}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600">Feriados saltados</p>
                    <p className="text-lg font-bold text-amber-800">{result.holidaysSkipped}</p>
                  </div>
                </div>

                {/* Desglose de costos en moneda local */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Desglose de costos ({result.currencyName})
                  </h4>
                  <div className="space-y-2 text-sm">
                    {result.breakdown.transport > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Bus className="w-4 h-4" /> Transporte
                        </span>
                        <span className="font-medium">
                          {currentCurrency.symbol}{formatNumber(result.breakdown.transport)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.lodging > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Hotel className="w-4 h-4" /> Hospedaje
                        </span>
                        <span className="font-medium">
                          {currentCurrency.symbol}{formatNumber(result.breakdown.lodging)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.food > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Utensils className="w-4 h-4" /> Comida
                        </span>
                        <span className="font-medium">
                          {currentCurrency.symbol}{formatNumber(result.breakdown.food)}
                        </span>
                      </div>
                    )}
                    {result.breakdown.other > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Receipt className="w-4 h-4" /> Otros
                        </span>
                        <span className="font-medium">
                          {currentCurrency.symbol}{formatNumber(result.breakdown.other)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center font-bold text-gray-800">
                      <span>Total</span>
                      <span>
                        {currentCurrency.symbol}{formatNumber(result.costLocal)} {result.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recomendación */}
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <p className="font-medium mb-1">💡 Recomendación:</p>
                  <p>
                    Programa el ensayo o presentación con al menos 1 día de
                    margen por imprevistos climáticos o logísticos.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Calendario Visual */}
          <div>
            <CalendarView
              currentMonth={currentMonth}
              holidays={result?.holidays || []}
              startDate={result?.startDate || null}
              estimatedDate={result?.estimatedDate || null}
              onMonthChange={setCurrentMonth}
            />
          </div>
        </div>
      </main>
    </div>
  );
}