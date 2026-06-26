"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Play,
  X,
  Filter,
} from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  date: string;
  location: string;
  type: "foto" | "video";
  thumbnail: string;
  description: string;
}

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: "Festival Nacional de la Cueca 2025",
    date: "2025-09-15",
    location: "Rancagua, Chile",
    type: "foto",
    thumbnail: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=300&fit=crop",
    description: "Presentación ganadora del primer lugar en categoría adultos.",
  },
  {
    id: 2,
    title: "Gira Región de O'Higgins",
    date: "2025-11-20",
    location: "Santa Cruz, Chile",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    description: "Documental de la gira de 3 días por la región.",
  },
  {
    id: 3,
    title: "Encuentro Folclórico Binacional",
    date: "2025-04-10",
    location: "Mendoza, Argentina",
    type: "foto",
    thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
    description: "Intercambio cultural con grupos argentinos de zamba y chacarera.",
  },
  {
    id: 4,
    title: "Aniversario 15 años del grupo",
    date: "2024-08-30",
    location: "Santiago, Chile",
    type: "foto",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    description: "Celebración con ex miembros y presentación especial de conmemoración.",
  },
  {
    id: 5,
    title: "Festival del Huaso de Olmué",
    date: "2026-01-25",
    location: "Olmué, Chile",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
    description: "Presentación en el escenario principal del festival.",
  },
  {
    id: 6,
    title: "Taller de vestuario tradicional",
    date: "2025-06-12",
    location: "Sede La Pintana",
    type: "foto",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    description: "Documentación del proceso de confección de polleras y chamantos.",
  },
];

export default function GaleriaPage() {
  const [filter, setFilter] = useState<"todos" | "foto" | "video">("todos");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const filtered = filter === "todos" ? MOCK_GALLERY : MOCK_GALLERY.filter((g) => g.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <header className="bg-cyan-800 text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-cyan-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Galería de Presentaciones</h1>
              <p className="text-cyan-200 text-sm">Memoria visual del grupo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {(["todos", "foto", "video"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === f ? "bg-cyan-600 text-white" : "bg-white text-gray-600 hover:bg-cyan-50"
              }`}
            >
              {f === "todos" ? "Todos" : f === "foto" ? "Fotos" : "Videos"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="w-6 h-6 text-cyan-600 fill-current" />
                    </div>
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === "video" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.type === "video" ? "VIDEO" : "FOTO"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString("es-ES")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3" />
            <p>No hay elementos en esta categoría</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.thumbnail} alt={selected.title} className="w-full h-64 md:h-80 object-cover" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {selected.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4">
                    <Play className="w-10 h-10 text-cyan-600 fill-current" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selected.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selected.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selected.location}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{selected.description}</p>
              {selected.type === "video" && (
                <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  🎬 El video se reproduciría aquí en la versión con backend de almacenamiento.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}