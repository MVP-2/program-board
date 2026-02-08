import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { listStudents } from "@/lib/repositories/students";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "admin") {
    const url = process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3000";
    return NextResponse.redirect(new URL("/login", url));
  }

  const list = await listStudents();
  const header = "StudentID,メールアドレス,名前,登録日\n";
  const rows = list.map(
    (s) =>
      `${s.id},${escapeCsv(s.email)},${escapeCsv(s.name)},${formatDate(s.createdAt)}`
  );
  const csv = header + rows.join("\n");
  const bom = "\uFEFF";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="students.csv"',
    },
  });
}

function escapeCsv(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}
