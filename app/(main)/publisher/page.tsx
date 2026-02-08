import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listProgramsByPublisher } from "@/lib/repositories/programs";

export default async function PublisherPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "publisher") {
    redirect("/login");
  }

  const programsList = await listProgramsByPublisher(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">掲載側</h1>
        <Link
          href="/publisher/programs/new"
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          プログラムを登録
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">登録したプログラム一覧</h2>
        {programsList.length === 0 ? (
          <p className="text-muted-foreground">
            まだプログラムが登録されていません。
          </p>
        ) : (
          <ul className="space-y-2">
            {programsList.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded border p-3">
                <div className="flex-1">
                  <Link
                    href={`/publisher/programs/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {p.status === "open" ? "募集中" : "締切"}
                  </p>
                </div>
                <Link
                  href={`/publisher/programs/${p.id}/participants`}
                  className="text-sm text-primary hover:underline"
                >
                  参加者一覧
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
