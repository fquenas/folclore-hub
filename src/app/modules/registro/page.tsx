"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  User,
  Briefcase,
  MessageSquare,
} from "lucide-react";

/**
 * MÓDULO 7: Registro de Nuevos Socios
 *
 * Contexto folclórico: Formulario de inscripción para nuevos miembros
 * con validación en tiempo real de campos obligatorios.
 */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  role: string;
  experience: string;
  motivation: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegistroPage() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    role: "",
    experience: "",
    motivation: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.firstName.trim()) errs.firstName = "Nombre es obligatorio";
    if (!data.lastName.trim()) errs.lastName = "Apellido es obligatorio";
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Email inválido";
    if (!data.phone.match(/^\+?[\d\s-]{8,}$/)) errs.phone = "Teléfono inválido";
    if (!data.birthDate) errs.birthDate = "Fecha de nacimiento es obligatoria";
    if (!data.role) errs.role = "Selecciona un rol";
    if (data.motivation.length < 20) errs.motivation = "Mínimo 20 caracteres";
    return errs;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setTouched((prev) => new Set(prev).add(field));
    setErrors(validate(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = new Set(Object.keys(form));
    setTouched(allTouched);
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Registro exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Bienvenido/a {form.firstName}. Hemos recibido tu solicitud y te contactaremos pronto.
          </p>
          <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-indigo-800 text-white py-6 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Registro de Socios</h1>
              <p className="text-indigo-200 text-sm">Únete al grupo folclórico</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  touched.has("firstName") && errors.firstName ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Tu nombre"
              />
              {touched.has("firstName") && errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
              <input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  touched.has("lastName") && errors.lastName ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Tu apellido"
              />
              {touched.has("lastName") && errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                touched.has("email") && errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="tu@email.com"
            />
            {touched.has("email") && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" /> Teléfono *
              </label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  touched.has("phone") && errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="+56 9 1234 5678"
              />
              {touched.has("phone") && errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <User className="w-4 h-4" /> Fecha de nacimiento *
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  touched.has("birthDate") && errors.birthDate ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {touched.has("birthDate") && errors.birthDate && (
                <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Rol de interés *
            </label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                touched.has("role") && errors.role ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Selecciona...</option>
              <option value="bailarin">Bailarín/a</option>
              <option value="musico">Músico</option>
              <option value="vestuario">Vestuario</option>
              <option value="maquillaje">Maquillaje</option>
              <option value="logistica">Logística</option>
            </select>
            {touched.has("role") && errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia previa</label>
            <textarea
              value={form.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="¿Has bailado o tocado en otros grupos?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> ¿Por qué quieres unirte? *
            </label>
            <textarea
              value={form.motivation}
              onChange={(e) => handleChange("motivation", e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                touched.has("motivation") && errors.motivation ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Cuéntanos tu motivación (mín. 20 caracteres)"
            />
            {touched.has("motivation") && errors.motivation && (
              <p className="text-red-500 text-xs mt-1">{errors.motivation}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{form.motivation.length} caracteres</p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Enviar solicitud
          </button>
        </form>
      </main>
    </div>
  );
}