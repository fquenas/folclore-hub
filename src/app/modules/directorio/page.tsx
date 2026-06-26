"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Filter,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  role: string;
  area: string;
  email: string;
  phone: string;
  joinedYear: number;
  active: boolean;
}

const MOCK_MEMBERS: Member[] = [
  { id: 1, name: "Ana María Rojas", role: "Bailarina principal", area: "Danza", email: "ana@grupo.cl", phone: "+56912345678", joinedYear: 2020, active: true },
  { id: 2, name: "Carlos Pérez", role: "Guitarrista", area: "Música", email: "carlos@grupo.cl", phone: "+56923456789", joinedYear: 2019, active: true },
  { id: 3, name: "Laura Fernández", role: "Bailarina", area: "Danza", email: "laura@grupo.cl", phone: "+56934567890", joinedYear: 2022, active: true },
  { id: 4, name: "Diego Morales", role: "Acordeonista", area: "Música", email: "diego@grupo.cl", phone: "+56945678901", joinedYear: 2018, active: true },
  { id: 5, name: "Valentina Soto", role: "Diseñadora vestuario", area: "Vestuario", email: "vale@grupo.cl", phone: "+56956789012", joinedYear: 2021, active: true },
  { id: 6, name: "José Herrera", role: "Director artístico", area: "Dirección", email: "jose@grupo.cl", phone: "+56967890123", joinedYear: 2015, active: true },
  { id: 7, name: "María José López", role: "Bailarina", area: "Danza", email: "mj@grupo.cl", phone: "+56978901234", joinedYear: 2023, active: false },
  { id: 8, name: "Pedro Castillo", role: "Percusionista", area: "Música", email: "pedro@grupo.cl", phone: "+56989012345", joinedYear: 2020, active: true },
];

export default function DirectorioPage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("todas");

  const areas = ["todas", ...Array.from(new Set(MOCK_MEMBERS.map((m) => m.area)))];

  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    const matchesArea = areaFilter === "todas" || m.area === areaFilter;
    return matchesSearch && matchesArea && m.active;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <header className="bg-rose-800 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-rose-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Directorio de Miembros</h1>
              <p className="text-rose-200 text-sm">Socios activos del grupo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o rol..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a === "todas" ? "Todas las áreas" : a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-rose-600 font-medium">{member.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {member.area}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">Miembro desde {member.joinedYear}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  {member.email}
                </a>
                <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  {member.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3" />
            <p>No se encontraron miembros</p>
          </div>
        )}
      </main>
    </div>
  );
}