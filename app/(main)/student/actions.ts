"use server";

import { revalidatePath } from "next/cache";
import { participate } from "@/lib/repositories/participations";
import { createClient } from "@/lib/supabase/server";

export async function participateAction(
  programId: string,
  _formData?: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "student") {
    return;
  }
  await participate(programId, user.id);
  revalidatePath("/student");
  revalidatePath(`/student/programs/${programId}`);
  revalidatePath("/student/my");
}
