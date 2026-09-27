import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";
import { getMockSupabaseClient } from "./mock";

/**
 * Supabase client for use in Client Components ("use client").
 * Reads the public URL/anon key only — never the service role key.
 * Falls back to an in-memory stub if Supabase credentials are not configured.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || !url.startsWith("http")) {
    return getMockSupabaseClient() as any;
  }

  try {
    return createBrowserClient<Database>(url, anonKey);
  } catch {
    return getMockSupabaseClient() as any;
  }
}
