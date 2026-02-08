import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProgram } from "@/lib/repositories/programs";
import { ProgramForm } from "../../../_components/program-form";

export default async function PublisherProgramEditPage({
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
      <Link
        href={`/publisher/programs/${id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← 詳細に戻る
      </Link>
      <h1 className="mt-4 text-xl font-semibold">プログラムを編集</h1>
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
