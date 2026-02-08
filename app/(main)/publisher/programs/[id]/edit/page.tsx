import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProgram } from "@/lib/repositories/programs";
import { createClient } from "@/lib/supabase/server";
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
  if (!user || (user.app_metadata.role as string) !== "publisher") {
    redirect("/login");
  }

  const program = await getProgram(id);
  if (!program || program.createdBy !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="link" size="sm" asChild>
        <Link href={`/publisher/programs/${id}`}>← 詳細に戻る</Link>
      </Button>
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
