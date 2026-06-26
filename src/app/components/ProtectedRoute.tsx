"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "miembro" | "directiva" | "super_admin";
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (!loading && user && requiredRole && role) {
      const roleHierarchy = {
        miembro: 1,
        directiva: 2,
        super_admin: 3,
      };

      const userLevel = roleHierarchy[role] || 0;
      const requiredLevel = roleHierarchy[requiredRole] || 0;

      if (userLevel < requiredLevel) {
        router.push("/");
      }
    }
  }, [user, role, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-amber-700 animate-spin" />
        <p className="text-amber-800 font-medium">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}