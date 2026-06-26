"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.hash
      );
      
      if (error) {
        console.error("Error en callback:", error);
      }
      
      // Redirigir al home
      window.location.href = "/";
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-amber-700 animate-spin" />
      <p className="text-amber-800 font-medium">Iniciando sesión...</p>
    </div>
  );
}