import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { listStudents } from "@/lib/repositories/students";
import { listPublishers } from "../actions";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "admin") {
    const url = process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3000";
    return NextResponse.redirect(new URL("/login", url));
  }

  const [students, publishers] = await Promise.all([
    listStudents(),
    listPublishers(),
  ]);

  const header =
    "種別,ID,メールアドレス,名前,登録日\n";

  const studentRows = students.map(
    (s) =>
      `生徒,${s.id},${escapeCsv(s.email)},${escapeCsv(s.name)},${formatDate(s.createdAt)}`
  );
  const publisherRows = publishers.map(
    (p) => `掲載者,${p.id},${escapeCsv(p.email)},${escapeCsv(p.name)},`
  );

  const csv = header + studentRows.join("\n") + "\n" + publisherRows.join("\n");
  const bom = "\uFEFF";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="admin_export.csv"',
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
