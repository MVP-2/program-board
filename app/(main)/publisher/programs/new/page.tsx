import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProgramForm } from "../../_components/program-form";

export default async function NewProgramPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "publisher") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <Button variant="link" size="sm" asChild>
        <Link href="/publisher">← 一覧に戻る</Link>
      </Button>
      <h1 className="text-xl font-semibold">新規プログラムを登録</h1>
      <ProgramForm publisherId={user.id} />
    </div>
  );
}
