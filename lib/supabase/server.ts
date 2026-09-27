import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { Database } from "@/lib/types/database";
import { getMockSupabaseServerClient, type MockUser } from "./mock";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = await cookies();

  let cookieUser: MockUser | null = null;
  try {
    const raw = cookieStore.get("nx_mock_user")?.value;
    if (raw) {
      cookieUser = JSON.parse(decodeURIComponent(raw));
    }
  } catch {
    //
  }

  if (!url || !anonKey || !url.startsWith("http")) {
    return getMockSupabaseServerClient(cookieUser) as any;
  }

  try {
    return createServerClient<Database>(url, anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components cannot always mutate cookies.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Server Components cannot always mutate cookies.
          }
        },
      },
    });
  } catch {
    return getMockSupabaseServerClient(cookieUser) as any;
  }
}
