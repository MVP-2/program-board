import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listOpenPrograms } from "@/lib/repositories/programs";

export default async function StudentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "student") {
    redirect("/login");
  }

  const programs = await listOpenPrograms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">探究プログラム一覧</h1>
        <Link
          href="/student/my"
          className="text-sm text-primary hover:underline"
        >
          参加したプログラム
        </Link>
      </div>

      {programs.length === 0 ? (
        <p className="text-muted-foreground">現在募集中のプログラムはありません。</p>
      ) : (
        <ul className="space-y-3">
          {programs.map((p) => (
            <li key={p.id}>
              <Link
                href={`/student/programs/${p.id}`}
                className="block rounded-lg border p-4 hover:bg-accent/50"
              >
                <span className="font-medium">{p.title}</span>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {p.theme}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.periodFormat} · 募集中
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
