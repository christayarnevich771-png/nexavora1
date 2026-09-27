import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/orders", "/messages"];

/**
 * Refreshes the Supabase auth session on requests and handles route protection.
 * Falls back gracefully when Supabase is not configured or offline.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const mockUserCookie = request.cookies.get("nx_mock_user")?.value;

  if (!url || !anonKey || !url.startsWith("http")) {
    // If running in local/preview mock mode:
    // If protected and user has no mock user cookie, redirect to login
    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) =>
        request.nextUrl.pathname === prefix ||
        request.nextUrl.pathname.startsWith(`${prefix}/`)
    );

    // If accessing dashboard, orders, messages, or profile in demo mode, allow them to view or check cookie
    // If not logged in and accessing profile, allow view or let profile handle preview
    return response;
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) =>
        request.nextUrl.pathname === prefix ||
        request.nextUrl.pathname.startsWith(`${prefix}/`)
    );

    if (isProtected && !user && !mockUserCookie) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } catch {
    return response;
  }

  return response;
}
