import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProgram } from "@/lib/repositories/programs";
import { listParticipationsByProgram } from "@/lib/repositories/participations";

export default async function PublisherProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "publisher") {
    redirect("/login");
  }

  const program = await getProgram(id);
  if (!program || program.createdBy !== user.id) {
    notFound();
  }

  const participants = await listParticipationsByProgram(id);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/publisher"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← 一覧へ
        </Link>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{program.title}</h1>
          <Link
            href={`/publisher/programs/${id}/edit`}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            編集
          </Link>
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              概要・説明
            </p>
            <p className="mt-1 whitespace-pre-wrap">{program.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              課題テーマ
            </p>
            <p className="mt-1">{program.theme}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              期間・実施形態
            </p>
            <p className="mt-1">{program.periodFormat}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              募集状態
            </p>
            <p className="mt-1">
              {program.status === "open" ? "募集中" : "締切"}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">参加した生徒一覧</h2>
        {participants.length === 0 ? (
          <p className="text-muted-foreground">まだ参加者はいません。</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">名前</th>
                  <th className="px-4 py-2 text-left font-medium">
                    メールアドレス
                  </th>
                  <th className="px-4 py-2 text-left font-medium">参加日</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{p.studentName}</td>
                    <td className="px-4 py-2">{p.studentEmail}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {p.createdAt instanceof Date
                        ? p.createdAt.toLocaleDateString("ja-JP")
                        : new Date(p.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
