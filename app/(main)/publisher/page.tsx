import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getParticipationCountsByProgramIds } from "@/lib/repositories/participations";
import { listProgramsByPublisher } from "@/lib/repositories/programs";
import { createClient } from "@/lib/supabase/server";

export default async function PublisherPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "publisher") {
    redirect("/login");
  }

  const programsList = await listProgramsByPublisher(user.id);
  const participationCounts = await getParticipationCountsByProgramIds(
    programsList.map((p) => p.id),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">掲載側</h1>
        <Button asChild>
          <Link href="/publisher/programs/new">新規プログラムを登録</Link>
        </Button>
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
              <li key={p.id}>
                <Card>
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <span className="font-medium">{p.title}</span>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {p.status === "open" ? (
                          <Badge variant="default">募集中</Badge>
                        ) : (
                          <Badge variant="secondary">締切</Badge>
                        )}
                        <span>参加者: {participationCounts[p.id] ?? 0} 名</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/publisher/programs/${p.id}`}>詳細</Link>
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
