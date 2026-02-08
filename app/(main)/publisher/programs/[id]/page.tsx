import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProgram } from "@/lib/repositories/programs";
import { ProgramForm } from "../../_components/program-form";

export default async function PublisherProgramPage({
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

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Link href="/publisher" className="text-sm text-muted-foreground hover:underline">
          ← 一覧へ
        </Link>
        <Link
          href={`/publisher/programs/${id}/participants`}
          className="text-sm text-primary hover:underline"
        >
          参加者一覧
        </Link>
      </div>
      <h1 className="text-xl font-semibold">プログラムを編集</h1>
      <ProgramForm
        publisherId={user.id}
        programId={id}
        defaultValues={{
          title: program.title,
          description: program.description,
          theme: program.theme,
          periodFormat: program.periodFormat,
          status: program.status as "open" | "closed",
        }}
      />
    </div>
  );
}
