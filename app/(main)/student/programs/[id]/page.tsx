import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProgram } from "@/lib/repositories/programs";
import { hasParticipated } from "@/lib/repositories/participations";
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
  if (!user || (user.app_metadata["role"] as string) !== "student") {
    redirect("/login");
  }

  const program = await getProgram(id);
  if (!program) notFound();
  if (program.status !== "open") {
    return (
      <div>
        <Link href="/student" className="text-sm text-muted-foreground hover:underline">
          ← 一覧へ
        </Link>
        <h1 className="mt-4 text-xl font-semibold">{program.title}</h1>
        <p className="mt-4 text-muted-foreground">このプログラムは締め切られています。</p>
      </div>
    );
  }

  const alreadyParticipated = await hasParticipated(id, user.id);

  return (
    <div>
      <Link href="/student" className="text-sm text-muted-foreground hover:underline">
        ← 一覧へ
      </Link>
      <article className="mt-4 space-y-4">
        <h1 className="text-xl font-semibold">{program.title}</h1>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">概要・説明</h2>
          <p className="mt-1 whitespace-pre-wrap">{program.description}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">課題テーマ</h2>
          <p className="mt-1">{program.theme}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">期間・実施形態</h2>
          <p className="mt-1">{program.periodFormat}</p>
        </div>
        {alreadyParticipated ? (
          <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            参加申込済みです。
          </p>
        ) : (
          <ParticipateButton programId={id} />
        )}
      </article>
    </div>
  );
}
