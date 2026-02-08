import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasParticipated } from "@/lib/repositories/participations";
import { getProgram } from "@/lib/repositories/programs";
import { createClient } from "@/lib/supabase/server";
import { ParticipateButton } from "./_components/participate-button";

export default async function StudentProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "student") {
    redirect("/login");
  }

  const program = await getProgram(id);
  if (!program) notFound();
  if (program.status !== "open") {
    return (
      <div className="space-y-6">
        <Button variant="link" size="sm" asChild>
          <Link href="/student">← 一覧へ</Link>
        </Button>
        <h1 className="text-xl font-semibold">{program.title}</h1>
        <Badge variant="secondary">締切</Badge>
        <p className="text-muted-foreground">
          このプログラムは締め切られています。
        </p>
      </div>
    );
  }

  const alreadyParticipated = await hasParticipated(id, user.id);

  return (
    <div className="space-y-6">
      <Button variant="link" size="sm" asChild>
        <Link href="/student">← 一覧へ</Link>
      </Button>
      <article className="space-y-4">
        <h1 className="text-xl font-semibold">{program.title}</h1>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                概要・説明
              </h2>
              <p className="mt-1 whitespace-pre-wrap">{program.description}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                課題テーマ
              </h2>
              <p className="mt-1">{program.theme}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                期間・実施形態
              </h2>
              <p className="mt-1">{program.periodFormat}</p>
            </div>
          </CardContent>
        </Card>
        {alreadyParticipated ? (
          <Alert className="border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-800">
            <AlertDescription>参加申込済みです。</AlertDescription>
          </Alert>
        ) : (
          <ParticipateButton programId={id} />
        )}
      </article>
    </div>
  );
}
