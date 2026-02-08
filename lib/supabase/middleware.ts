import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export type AppRole = "admin" | "publisher" | "student";

const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin",
  publisher: "/publisher",
  student: "/student",
};

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && request.nextUrl.pathname === "/") {
    const role = (user.app_metadata.role as AppRole) ?? "student";
    const home = ROLE_HOME[role] ?? ROLE_HOME.student;
    const res = NextResponse.redirect(new URL(home, request.url));
    response.cookies.getAll().forEach((c) => {
      res.cookies.set(c.name, c.value);
    });
    return res;
  }

  if (user) {
    const role = (user.app_metadata.role as AppRole) ?? "student";
    const path = request.nextUrl.pathname;
    if (path.startsWith("/admin") && role !== "admin") {
      const res = NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
      response.cookies.getAll().forEach((c) => {
        res.cookies.set(c.name, c.value);
      });
      return res;
    }
    if (path.startsWith("/publisher") && role !== "publisher") {
      const res = NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
      response.cookies.getAll().forEach((c) => {
        res.cookies.set(c.name, c.value);
      });
      return res;
    }
    if (path.startsWith("/student") && role !== "student") {
      const res = NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
      response.cookies.getAll().forEach((c) => {
        res.cookies.set(c.name, c.value);
      });
      return res;
    }
  }

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth/");

  if (!user && !isAuthRoute) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.getAll().forEach((c) => {
      res.cookies.set(c.name, c.value);
    });
    return res;
  }

  return response;
}
