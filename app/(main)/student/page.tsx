import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { listParticipationsByUser } from "@/lib/repositories/participations";
import { listOpenPrograms } from "@/lib/repositories/programs";
import { createClient } from "@/lib/supabase/server";

export default async function StudentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "student") {
    redirect("/login");
  }

  const [programs, myParticipations] = await Promise.all([
    listOpenPrograms(),
    listParticipationsByUser(user.id),
  ]);
  const participatedProgramIds = new Set(
    myParticipations.map((p) => p.programId),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">探究プログラム一覧</h1>
        <Button variant="link" size="sm" asChild>
          <Link href="/student/my">参加したプログラム</Link>
        </Button>
      </div>

      {programs.length === 0 ? (
        <p className="text-muted-foreground">
          現在募集中のプログラムはありません。
        </p>
      ) : (
        <ul className="space-y-3">
          {programs.map((p) => (
            <li key={p.id}>
              <Link href={`/student/programs/${p.id}`} className="block">
                <Card className="transition-colors hover:bg-accent/50">
                  <CardHeader className="p-4 pb-2">
                    <span className="font-medium">{p.title}</span>
                    <CardDescription className="line-clamp-1">
                      {p.theme}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {p.periodFormat} · 募集中
                      </span>
                      {participatedProgramIds.has(p.id) && (
                        <Badge variant="success">参加済み</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
