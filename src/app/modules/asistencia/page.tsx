"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Save,
  History,
  FileText,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  FileCheck,
  UsersRound,
} from "lucide-react";

/**
 * MÓDULO 4: Control de Asistencia con Justificación e Historial
 *
 * Los registros se guardan en localStorage para persistencia.
 * El historial muestra: Presentes, Ausentes, Justificados y Total por evento.
 */

interface MemberAttendance {
  memberId: number;
  present: boolean | null;
  justification?: string;
}

interface AttendanceRecord {
  id: string;
  eventName: string;
  eventDate: string;
  createdAt: string;
  attendances: MemberAttendance[];
  presentCount: number;
  absentCount: number;
  justifiedCount: number;
  totalAttendees: number;
}

interface Member {
  id: number;
  name: string;
  role: string;
}

const MEMBERS: Member[] = [
  { id: 1, name: "Ana María Rojas", role: "Bailarina principal" },
  { id: 2, name: "Carlos Pérez", role: "Músico - Guitarra" },
  { id: 3, name: "Laura Fernández", role: "Bailarina" },
  { id: 4, name: "Diego Morales", role: "Músico - Acordeón" },
  { id: 5, name: "Valentina Soto", role: "Vestuario" },
  { id: 6, name: "José Herrera", role: "Director" },
  { id: 7, name: "María José López", role: "Bailarina" },
  { id: 8, name: "Pedro Castillo", role: "Músico - Tambor" },
];

const STORAGE_KEY = "folclore-attendance-records";

export default function AsistenciaPage() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [attendances, setAttendances] = useState<MemberAttendance[]>(
    MEMBERS.map((m) => ({ memberId: m.id, present: null, justification: "" }))
  );
  const [saved, setSaved] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  // Cargar registros guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch {
        console.error("Error al cargar registros");
      }
    }
  }, []);

  const toggleAttendance = (memberId: number, present: boolean) => {
    setAttendances((prev) =>
      prev.map((a) =>
        a.memberId === memberId
          ? { ...a, present, justification: present ? "" : a.justification }
          : a
      )
    );
    setSaved(false);
  };

  const updateJustification = (memberId: number, justification: string) => {
    setAttendances((prev) =>
      prev.map((a) =>
        a.memberId === memberId ? { ...a, justification } : a
      )
    );
    setSaved(false);
  };

  const presentCount = attendances.filter((a) => a.present === true).length;
  const absentCount = attendances.filter((a) => a.present === false).length;
  const justifiedCount = attendances.filter(
    (a) => a.present === false && a.justification && a.justification.trim() !== ""
  ).length;
  const pendingCount = attendances.filter((a) => a.present === null).length;
  const totalAttendees = presentCount + absentCount;
  const percentage =
    MEMBERS.length > 0
      ? Math.round((presentCount / MEMBERS.length) * 100)
      : 0;

  const handleSave = () => {
    if (!eventName || !eventDate) {
      alert("Por favor ingresa el nombre y fecha del evento");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      eventName,
      eventDate,
      createdAt: new Date().toISOString(),
      attendances: [...attendances],
      presentCount,
      absentCount,
      justifiedCount,
      totalAttendees,
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    // Limpiar formulario
    setEventName("");
    setEventDate("");
    setAttendances(
      MEMBERS.map((m) => ({ memberId: m.id, present: null, justification: "" }))
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteRecord = (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getMemberName = (id: number) =>
    MEMBERS.find((m) => m.id === id)?.name || "";

  const getMemberRole = (id: number) =>
    MEMBERS.find((m) => m.id === id)?.role || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-purple-800 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-purple-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Control de Asistencia</h1>
              <p className="text-purple-200 text-sm">
                Registro de ensayos y eventos con justificación
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Evento info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Información del evento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del evento/ensayo *
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Ej: Ensayo general - Cueca"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Estadísticas del evento actual */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-green-700">{presentCount}</p>
            <p className="text-xs text-green-600">Presentes</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-red-700">{absentCount}</p>
            <p className="text-xs text-red-600">Ausentes</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{justifiedCount}</p>
            <p className="text-xs text-blue-600">Justificados</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-yellow-700">{pendingCount}</p>
            <p className="text-xs text-yellow-600">Pendientes</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-purple-700">{percentage}%</p>
            <p className="text-xs text-purple-600">Asistencia</p>
          </div>
        </div>

        {/* Lista de miembros */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-purple-100 border-b border-purple-200">
            <h2 className="font-semibold text-purple-800">Marcar asistencia</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {MEMBERS.map((member) => {
              const attendance = attendances.find(
                (a) => a.memberId === member.id
              );
              const isAbsent = attendance?.present === false;

              return (
                <div key={member.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAttendance(member.id, true)}
                        className={`p-2 rounded-lg transition-colors ${
                          attendance?.present === true
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-400 hover:bg-green-100"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleAttendance(member.id, false)}
                        className={`p-2 rounded-lg transition-colors ${
                          attendance?.present === false
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-400 hover:bg-red-100"
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Campo de justificación (solo si está ausente) */}
                  {isAbsent && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-red-600 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Justificación de ausencia *
                      </label>
                      <textarea
                        value={attendance?.justification || ""}
                        onChange={(e) =>
                          updateJustification(member.id, e.target.value)
                        }
                        placeholder="Ej: Enfermedad, viaje familiar, trabajo..."
                        rows={2}
                        className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-red-50"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Guardar */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-8 ${
            saved
              ? "bg-green-600 text-white"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          <Save className="w-5 h-5" />
          {saved ? "✓ Guardado exitosamente" : "Guardar registro de asistencia"}
        </button>

        {/* Historial */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-800">
                Historial de asistencias ({records.length} registros)
              </h2>
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {showHistory && (
            <div className="divide-y divide-gray-100">
              {records.length === 0 && (
                <p className="p-4 text-gray-500 text-center">
                  No hay registros guardados
                </p>
              )}

              {records.map((record) => (
                <div key={record.id} className="p-4 hover:bg-gray-50">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedRecord(
                        expandedRecord === record.id ? null : record.id
                      )
                    }
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.eventName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.eventDate).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Estadísticas del evento en el historial */}
                      <div className="hidden md:flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                          <UserCheck className="w-3 h-3" />
                          {record.presentCount}
                        </span>
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded">
                          <UserX className="w-3 h-3" />
                          {record.absentCount}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          <FileCheck className="w-3 h-3" />
                          {record.justifiedCount}
                        </span>
                        <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          <UsersRound className="w-3 h-3" />
                          Total: {record.totalAttendees}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecord(record.id);
                        }}
                        className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedRecord === record.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Estadísticas móviles (solo visible en pantallas pequeñas) */}
                  <div className="flex md:hidden flex-wrap gap-2 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                      <UserCheck className="w-3 h-3" />
                      {record.presentCount} presentes
                    </span>
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded">
                      <UserX className="w-3 h-3" />
                      {record.absentCount} ausentes
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <FileCheck className="w-3 h-3" />
                      {record.justifiedCount} justificados
                    </span>
                    <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      <UsersRound className="w-3 h-3" />
                      Total: {record.totalAttendees}
                    </span>
                  </div>

                  {/* Detalle del registro */}
                  {expandedRecord === record.id && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Detalle de asistencias
                      </h4>
                      {record.attendances.map((att) => {
                        const member = MEMBERS.find(
                          (m) => m.id === att.memberId
                        );
                        if (!member) return null;

                        return (
                          <div
                            key={att.memberId}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {att.present === true ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : att.present === false ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border-2 border-gray-300" />
                              )}
                              <span className="text-gray-700">{member.name}</span>
                              <span className="text-gray-400 text-xs">
                                {member.role}
                              </span>
                            </div>
                            {att.present === false && att.justification && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                Justificado: {att.justification}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}