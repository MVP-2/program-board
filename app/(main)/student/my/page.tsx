import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listMyParticipationsWithProgram } from "@/lib/repositories/participations";

export default async function StudentMyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "student") {
    redirect("/login");
  }

  const list = await listMyParticipationsWithProgram(user.id);

  return (
    <div>
      <Link href="/student" className="text-sm text-muted-foreground hover:underline">
        ← プログラム一覧へ
      </Link>
      <h1 className="mt-4 text-xl font-semibold">参加したプログラム</h1>
      {list.length === 0 ? (
        <p className="mt-4 text-muted-foreground">まだ参加したプログラムはありません。</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {list.map((p) => (
            <li key={p.participationId}>
              <Link
                href={`/student/programs/${p.programId}`}
                className="block rounded border p-3 hover:bg-accent/50"
              >
                <span className="font-medium">{p.programTitle}</span>
                <p className="text-sm text-muted-foreground">
                  {p.programStatus === "open" ? "募集中" : "締切"} · 参加日:{" "}
                  {p.participatedAt instanceof Date
                    ? p.participatedAt.toLocaleDateString("ja-JP")
                    : new Date(p.participatedAt).toLocaleDateString("ja-JP")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
