"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  DollarSign,
  AlertTriangle,
  Truck,
  Users,
  CalendarDays,
  CreditCard,
  UserPlus,
  BookOpen,
  Image as ImageIcon,
  Music,
  LogOut,
  User,
  Shield,
  Crown,
} from "lucide-react";

export default function HomePage() {
  const { user, profile, role, signOut, loading } = useAuth();

  const modules = [
    {
      id: "viaticos",
      name: "Viáticos Internacionales",
      description: "Conversión de divisas y clima del destino para giras internacionales",
      icon: DollarSign,
      href: "/modules/viaticos",
      color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
      iconColor: "text-emerald-600",
      minRole: "miembro",
    },
    {
      id: "alertas",
      name: "Monitor de Alertas Sísmicas",
      description: "Sismos recientes con alerta si hay clima adverso en la zona",
      icon: AlertTriangle,
      href: "/modules/alertas",
      color: "bg-red-50 border-red-200 hover:border-red-400",
      iconColor: "text-red-600",
      minRole: "miembro",
    },
    {
      id: "logistica",
      name: "Planificador de Eventos",
      description: "Cálculo de fechas considerando feriados y días no hábiles",
      icon: Truck,
      href: "/modules/logistica",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      iconColor: "text-blue-600",
      minRole: "miembro",
    },
    {
      id: "asistencia",
      name: "Control de Asistencia",
      description: "Registro de asistencia a ensayos y eventos del grupo",
      icon: Users,
      href: "/modules/asistencia",
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      iconColor: "text-purple-600",
      minRole: "directiva",
    },
    {
      id: "calendario",
      name: "Calendario de Eventos",
      description: "Próximas presentaciones, ensayos y giras programadas",
      icon: CalendarDays,
      href: "/modules/calendario",
      color: "bg-amber-50 border-amber-200 hover:border-amber-400",
      iconColor: "text-amber-600",
      minRole: "miembro",
    },
    {
      id: "pagos",
      name: "Control de Pagos",
      description: "Estado de cuotas mensuales de los socios del grupo",
      icon: CreditCard,
      href: "/modules/pagos",
      color: "bg-teal-50 border-teal-200 hover:border-teal-400",
      iconColor: "text-teal-600",
      minRole: "directiva",
    },
    {
      id: "registro",
      name: "Registro de Socios",
      description: "Formulario de inscripción para nuevos miembros",
      icon: UserPlus,
      href: "/modules/registro",
      color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
      iconColor: "text-indigo-600",
      minRole: "miembro",
    },
    {
      id: "directorio",
      name: "Directorio de Miembros",
      description: "Lista de socios activos con filtros y búsqueda",
      icon: BookOpen,
      href: "/modules/directorio",
      color: "bg-rose-50 border-rose-200 hover:border-rose-400",
      iconColor: "text-rose-600",
      minRole: "miembro",
    },
    {
      id: "galeria",
      name: "Galería de Presentaciones",
      description: "Fotos y videos de eventos y presentaciones pasadas",
      icon: ImageIcon,
      href: "/modules/galeria",
      color: "bg-cyan-50 border-cyan-200 hover:border-cyan-400",
      iconColor: "text-cyan-600",
      minRole: "miembro",
    },
  ];

  const getRoleIcon = () => {
    if (role === "super_admin") return <Crown className="w-4 h-4 text-yellow-500" />;
    if (role === "directiva") return <Shield className="w-4 h-4 text-blue-500" />;
    return <User className="w-4 h-4 text-gray-500" />;
  };

  const getRoleLabel = () => {
    if (role === "super_admin") return "Super Admin";
    if (role === "directiva") return "Directiva";
    return "Miembro";
  };

  const canAccessModule = (minRole: string) => {
    if (!role) return false;
    const hierarchy = { miembro: 1, directiva: 2, super_admin: 3 };
    const userLevel = hierarchy[role as keyof typeof hierarchy] || 0;
    const requiredLevel = hierarchy[minRole as keyof typeof hierarchy] || 0;
    return userLevel >= requiredLevel;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-amber-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Music className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Grupo Folclórico</h1>
          <p className="text-gray-600 mb-6">Hub de Operaciones</p>
          <Link
            href="/login"
            className="bg-amber-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-amber-900 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 p-3 rounded-full">
                <Music className="w-8 h-8 text-amber-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Grupo Folclórico</h1>
                <p className="text-amber-200 mt-1">Hub de Operaciones - Panel Central</p>
              </div>
            </div>
            
            {/* User info */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{profile?.full_name || user.email}</p>
                <p className="text-xs text-amber-300 flex items-center justify-end gap-1">
                  {getRoleIcon()} {getRoleLabel()}
                </p>
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-lg hover:bg-amber-800 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-3">
            Bienvenido al Panel de Control
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desde aquí puedes acceder a todas las herramientas de gestión del
            grupo folclórica. Cada módulo está conectado a APIs reales para
            brindarte información actualizada.
          </p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const hasAccess = canAccessModule(module.minRole);

            return (
              <Link
                key={module.id}
                href={hasAccess ? module.href : "#"}
                className={`block rounded-xl border-2 p-6 transition-all duration-300 ${
                  hasAccess
                    ? `${module.color} hover:shadow-xl hover:-translate-y-1`
                    : "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                }`}
                onClick={(e) => !hasAccess && e.preventDefault()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-white shadow-sm ${module.iconColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      hasAccess
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasAccess ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`}
                    ></span>
                    {hasAccess ? "Acceso" : "Bloqueado"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {module.description}
                </p>
                {!hasAccess && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    Requiere rol: {module.minRole}
                  </p>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-amber-800">
                  <span>{hasAccess ? "Abrir módulo" : "Sin acceso"}</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Grupo Folclórico - Sistema de Gestión 2026</p>
          <p className="mt-1">
            Tecnologías: Next.js + Tailwind CSS + Supabase + APIs Reales
          </p>
        </div>
      </main>
    </div>
  );
}