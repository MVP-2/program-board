import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listParticipationsByProgram } from "@/lib/repositories/participations";
import { getProgram } from "@/lib/repositories/programs";
import { createClient } from "@/lib/supabase/server";

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
  if (!user || (user.app_metadata.role as string) !== "publisher") {
    redirect("/login");
  }

  const program = await getProgram(id);
  if (!program || program.createdBy !== user.id) {
    notFound();
  }

  const participants = await listParticipationsByProgram(id);

  return (
    <div className="space-y-8">
      <Button variant="link" size="sm" asChild>
        <Link href="/publisher">← 一覧へ</Link>
      </Button>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{program.title}</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/publisher/programs/${id}/edit`}>編集</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
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
              <div className="mt-1">
                {program.status === "open" ? (
                  <Badge variant="default">募集中</Badge>
                ) : (
                  <Badge variant="secondary">締切</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">参加した生徒一覧</h2>
        {participants.length === 0 ? (
          <p className="text-muted-foreground">まだ参加者はいません。</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名前</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>参加日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.studentName}</TableCell>
                    <TableCell>{p.studentEmail}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.createdAt instanceof Date
                        ? p.createdAt.toLocaleDateString("ja-JP")
                        : new Date(p.createdAt).toLocaleDateString("ja-JP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
