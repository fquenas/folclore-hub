"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Music,
  Plus,
  Search,
} from "lucide-react";

/**
 * MÓDULO 5: Calendario de Eventos
 *
 * Contexto folclórico: Visualización de próximas presentaciones,
 * ensayos, giras y festivales donde participa el grupo.
 *
 * Elegí este módulo porque una organización folclórica vive de
 * eventos y necesita una vista clara de su agenda para coordinar
 * logística, vestuario y disponibilidad de miembros.
 */

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "ensayo" | "presentacion" | "gira" | "festival";
  description: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Ensayo general - Cueca chilena",
    date: "2026-06-28",
    time: "19:00",
    location: "Sede cultural La Pintana",
    type: "ensayo",
    description: "Preparación para festival de julio. Traer vestuario completo.",
  },
  {
    id: 2,
    title: "Festival Folclórico Internacional",
    date: "2026-07-15",
    time: "20:00",
    location: "Teatro Municipal de Valparaíso",
    type: "festival",
    description: "Presentación principal del año. Llegar 2 horas antes.",
  },
  {
    id: 3,
    title: "Gira - Región del Biobío",
    date: "2026-08-05",
    time: "18:30",
    location: "Gimnasio Municipal de Concepción",
    type: "gira",
    description: "3 días de gira. Coordinar transporte y hospedaje.",
  },
  {
    id: 4,
    title: "Ensayo - Jota aragonesa",
    date: "2026-06-30",
    time: "19:00",
    location: "Sede cultural La Pintana",
    type: "ensayo",
    description: "Nueva coreografía. Traer zapatos de ensayo.",
  },
  {
    id: 5,
    title: "Presentación Día Nacional del Cuequero",
    date: "2026-07-07",
    time: "12:00",
    location: "Plaza de Armas, Santiago",
    type: "presentacion",
    description: "Evento al aire libre. Revisar pronóstico del tiempo.",
  },
];

const typeConfig = {
  ensayo: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Ensayo",
    icon: Clock,
  },
  presentacion: {
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Presentación",
    icon: Music,
  },
  gira: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    label: "Gira",
    icon: MapPin,
  },
  festival: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    label: "Festival",
    icon: CalendarDays,
  },
};

export default function CalendarioPage() {
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");

  const filtered =
    filter === "todos"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.type === filter);

  const searched = filtered.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...searched].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <header className="bg-amber-800 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-amber-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Calendario de Eventos</h1>
              <p className="text-amber-200 text-sm">Próximas presentaciones y ensayos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar evento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-2">
            {["todos", "ensayo", "presentacion", "gira", "festival"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === type
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-600 hover:bg-amber-50"
                }`}
              >
                {type === "todos" ? "Todos" : typeConfig[type as keyof typeof typeConfig].label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          {sorted.map((event) => {
            const config = typeConfig[event.type];
            const Icon = config.icon;
            const isPast = new Date(event.date) < new Date();

            return (
              <div
                key={event.id}
                className={`bg-white rounded-xl shadow-md p-5 border-l-4 transition-all hover:shadow-lg ${
                  isPast ? "opacity-60 border-gray-300" : "border-amber-500"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                    {isPast && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                        Finalizado
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {new Date(event.date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {event.location}
                </p>
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  {event.description}
                </p>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3" />
            <p>No hay eventos en esta categoría</p>
          </div>
        )}
      </main>
    </div>
  );
}