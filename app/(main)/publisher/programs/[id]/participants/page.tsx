import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProgram } from "@/lib/repositories/programs";
import { listParticipationsByProgram } from "@/lib/repositories/participations";

export default async function PublisherParticipantsPage({
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
    <div>
      <Link
        href={`/publisher/programs/${id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← プログラムに戻る
      </Link>
      <h1 className="mt-4 text-xl font-semibold">参加者一覧: {program.title}</h1>
      {participants.length === 0 ? (
        <p className="mt-4 text-muted-foreground">まだ参加者はいません。</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">名前</th>
                <th className="px-4 py-2 text-left font-medium">メールアドレス</th>
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
    </div>
  );
}
