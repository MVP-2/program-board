import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProgramForm } from "../../_components/program-form";

export default async function NewProgramPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "publisher") {
    redirect("/login");
  }

  return (
    <div>
      <Link
        href="/publisher"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← 一覧に戻る
      </Link>
      <h1 className="mt-4 text-xl font-semibold">新規プログラムを登録</h1>
      <ProgramForm publisherId={user.id} />
    </div>
  );
}
