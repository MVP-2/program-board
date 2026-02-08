import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { listMyParticipationsWithProgram } from "@/lib/repositories/participations";
import { createClient } from "@/lib/supabase/server";

export default async function StudentMyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "student") {
    redirect("/login");
  }

  const list = await listMyParticipationsWithProgram(user.id);

  return (
    <div className="space-y-6">
      <Button variant="link" size="sm" asChild>
        <Link href="/student">← プログラム一覧へ</Link>
      </Button>
      <h1 className="text-xl font-semibold">参加したプログラム</h1>
      {list.length === 0 ? (
        <p className="text-muted-foreground">
          まだ参加したプログラムはありません。
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((p) => (
            <li key={p.participationId}>
              <Link href={`/student/programs/${p.programId}`} className="block">
                <Card className="transition-colors hover:bg-accent/50">
                  <CardHeader className="p-4 pb-2">
                    <span className="font-medium">{p.programTitle}</span>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {p.programStatus === "open" ? (
                        <Badge variant="default">募集中</Badge>
                      ) : (
                        <Badge variant="secondary">締切</Badge>
                      )}
                      <span>
                        参加日:{" "}
                        {p.participatedAt instanceof Date
                          ? p.participatedAt.toLocaleDateString("ja-JP")
                          : new Date(p.participatedAt).toLocaleDateString(
                              "ja-JP",
                            )}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
