"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  Save,
  Trash2,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * MÓDULO 6: Control de Pagos con Registro Real
 *
 * Permite registrar pagos de socios, guardar historial en localStorage,
 * y ver estadísticas de recaudación.
 */

interface Payment {
  id: string;
  memberName: string;
  month: string;
  amount: number;
  status: "pagado" | "pendiente" | "atrasado";
  date: string | null;
  createdAt: string;
}

const MEMBERS = [
  "Ana María Rojas",
  "Carlos Pérez",
  "Laura Fernández",
  "Diego Morales",
  "Valentina Soto",
  "José Herrera",
  "María José López",
  "Pedro Castillo",
];

const MONTHS = [
  "Enero 2026",
  "Febrero 2026",
  "Marzo 2026",
  "Abril 2026",
  "Mayo 2026",
  "Junio 2026",
  "Julio 2026",
  "Agosto 2026",
  "Septiembre 2026",
  "Octubre 2026",
  "Noviembre 2026",
  "Diciembre 2026",
];

const STORAGE_KEY = "folclore-payments";

const statusConfig = {
  pagado: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Pagado" },
  pendiente: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pendiente" },
  atrasado: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Atrasado" },
};

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");

  // Formulario
  const [memberName, setMemberName] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"pagado" | "pendiente" | "atrasado">("pagado");
  const [paymentDate, setPaymentDate] = useState("");

  // Cargar pagos guardados
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPayments(JSON.parse(saved));
      } catch {
        console.error("Error al cargar pagos");
      }
    }
  }, []);

  // Guardar en localStorage
  const savePayments = (newPayments: Payment[]) => {
    setPayments(newPayments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPayments));
  };

  const handleAddPayment = () => {
    if (!memberName || !month || !amount) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      memberName,
      month,
      amount: parseFloat(amount),
      status,
      date: status === "pagado" ? paymentDate || new Date().toISOString().split("T")[0] : null,
      createdAt: new Date().toISOString(),
    };

    savePayments([newPayment, ...payments]);

    // Limpiar formulario
    setMemberName("");
    setMonth("");
    setAmount("");
    setStatus("pagado");
    setPaymentDate("");
    setShowForm(false);
  };

  const deletePayment = (id: string) => {
    if (!confirm("¿Eliminar este pago?")) return;
    savePayments(payments.filter((p) => p.id !== id));
  };

  // Filtrar y buscar
  const filtered =
    filter === "todos" ? payments : payments.filter((p) => p.status === filter);

  const searched = filtered.filter(
    (p) =>
      p.memberName.toLowerCase().includes(search.toLowerCase()) ||
      p.month.toLowerCase().includes(search.toLowerCase())
  );

  // Estadísticas
  const totalCollected = payments
    .filter((p) => p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pendiente" || p.status === "atrasado")
    .reduce((sum, p) => sum + p.amount, 0);
  const paidCount = payments.filter((p) => p.status === "pagado").length;
  const totalCount = payments.length;
  const paymentRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <header className="bg-teal-800 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-teal-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Control de Pagos</h1>
              <p className="text-teal-200 text-sm">Registro de cuotas de socios</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <p className="text-sm text-green-600 font-medium">Recaudado</p>
            <p className="text-2xl font-bold text-green-800">
              ${new Intl.NumberFormat("es-ES").format(totalCollected)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <p className="text-sm text-yellow-600 font-medium">Pendiente</p>
            <p className="text-2xl font-bold text-yellow-800">
              ${new Intl.NumberFormat("es-ES").format(totalPending)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Tasa de pago</p>
            <p className="text-2xl font-bold text-blue-800">{paymentRate}%</p>
            <p className="text-xs text-blue-500">{paidCount} de {totalCount} pagos</p>
          </div>
        </div>

        {/* Botón agregar */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
        >
          {showForm ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancelar" : "Registrar nuevo pago"}
        </button>

        {/* Formulario de registro */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-teal-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              Registrar pago de cuota
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Socio *</label>
                <select
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Seleccionar socio...</option>
                  {MEMBERS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mes *</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Seleccionar mes...</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 15000"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="atrasado">Atrasado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de pago {status === "pagado" && "*"}
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  required={status === "pagado"}
                />
              </div>
            </div>

            <button
              onClick={handleAddPayment}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar pago
            </button>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar socio o mes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            {["todos", "pagado", "pendiente", "atrasado"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === s ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-teal-50"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de pagos */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-200 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-teal-800">
              Historial de pagos ({payments.length} registros)
            </h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <CreditCard className="w-12 h-12 mx-auto mb-3" />
              <p>No hay pagos registrados</p>
              <p className="text-sm mt-1">Haz clic en "Registrar nuevo pago" para comenzar</p>
            </div>
          ) : searched.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3" />
              <p>No se encontraron pagos con estos filtros</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {searched.map((payment) => {
                const config = statusConfig[payment.status];
                const Icon = config.icon;
                return (
                  <div key={payment.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.memberName}</p>
                      <p className="text-sm text-gray-500">{payment.month}</p>
                      {payment.date && (
                        <p className="text-xs text-gray-400">
                          Pagado el: {new Date(payment.date).toLocaleDateString("es-ES")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">
                        ${new Intl.NumberFormat("es-ES").format(payment.amount)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <button
                        onClick={() => deletePayment(payment.id)}
                        className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}