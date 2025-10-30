import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || "https://jpgrjyysxeboeaksousa.supabase.co") as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZ3JqeXlzeGVib2Vha3NvdXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTIxMzAsImV4cCI6MjA3NTI2ODEzMH0.dObkaVito9FrgiBFHMbGNF7AkNrlggsQqr-M4_63dxs") as string;

export const supabaseEnabled: boolean = Boolean(
  typeof supabaseUrl === "string" &&
    supabaseUrl &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey,
);

let client: SupabaseClient | null = null;
if (supabaseEnabled) {
  client = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

export const supabase = client;
