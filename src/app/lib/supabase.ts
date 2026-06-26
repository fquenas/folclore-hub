/**
 * Cliente de Supabase para autenticación y base de datos
 */

import { createClient } from "@supabase/supabase-js";

// URL correcta de Supabase (hardcodeada para producción)
const supabaseUrl = "https://nzkmtklwbasukxdwzxyn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56a210a2x3YmFzdWt4ZHd6eHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDE0NDEsImV4cCI6MjA5Nzk3NzQ0MX0.hWHas9LpyCnInyNxkxCW_C0m9vQARyX1JuR8PIu4M4k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos de usuario/roles
export type UserRole = "super_admin" | "directiva" | "miembro";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}