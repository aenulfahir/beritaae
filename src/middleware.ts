import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip middleware if env vars are not available
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    // Get user - this also refreshes the session if needed
    let user = null;
    let authError = null;

    try {
      const result = await supabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    } catch (err) {
      // Network error - allow request to proceed
      console.warn("[Middleware] Auth network error:", err);
    }

    // If session expired, try to refresh it
    if (authError && authError.message?.includes("expired")) {
      try {
        const { data: refreshData } = await supabase.auth.refreshSession();
        user = refreshData.user;
      } catch (refreshErr) {
        console.warn("[Middleware] Session refresh failed:", refreshErr);
      }
    }

    // Log auth errors but don't block the request
    if (authError && authError.message !== "Auth session missing!") {
      console.warn("[Middleware] Auth error:", authError.message);
    }

    // Protected routes that require authentication
    const protectedRoutes = ["/admin", "/saved", "/notifications"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    );

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Redirect to home if accessing auth pages while logged in
    const authRoutes = ["/login", "/register"];
    const isAuthRoute = authRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    );

    if (isAuthRoute && user) {
      const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/";
      const url = request.nextUrl.clone();
      url.pathname = redirectTo;
      url.searchParams.delete("redirectTo");
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    // On any error, allow the request to proceed
    // The client-side auth will handle the session
    console.warn("[Middleware] Error:", err);
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
