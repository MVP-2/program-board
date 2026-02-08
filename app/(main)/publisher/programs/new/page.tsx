import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
      <h1 className="text-xl font-semibold">プログラムを登録</h1>
      <ProgramForm publisherId={user.id} />
    </div>
  );
}
