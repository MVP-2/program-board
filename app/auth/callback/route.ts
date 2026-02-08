import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { students } from "@/db/schema";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.app_metadata.role as string | undefined;
  if (role === "student") {
    const name =
      (user.user_metadata.name as string | undefined)?.trim() ?? "未設定";
    const email = user.email ?? "";
    await db
      .insert(students)
      .values({ id: user.id, email, name })
      .onConflictDoNothing();
  }

  return NextResponse.redirect(new URL(next, request.url));
}
