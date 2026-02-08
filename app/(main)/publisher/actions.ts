"use server";

import { revalidatePath } from "next/cache";
import { createProgram, updateProgram } from "@/lib/repositories/programs";
import { createClient } from "@/lib/supabase/server";

async function ensurePublisher() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "publisher") {
    return null;
  }
  return user.id;
}

export async function createProgramAction(
  publisherId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const userId = await ensurePublisher();
  if (!userId || userId !== publisherId) {
    return { error: "掲載側のみ実行できます" };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const theme = (formData.get("theme") as string)?.trim();
  const periodFormat = (formData.get("periodFormat") as string)?.trim();
  const status = (formData.get("status") as string) === "closed" ? "closed" : "open";

  if (!title || !description || !theme || !periodFormat) {
    return { error: "必須項目を入力してください" };
  }

  await createProgram(publisherId, {
    title,
    description,
    theme,
    periodFormat,
    status,
  });
  revalidatePath("/publisher");
  return { success: true };
}

export async function updateProgramAction(
  programId: string,
  publisherId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const userId = await ensurePublisher();
  if (!userId || userId !== publisherId) {
    return { error: "掲載側のみ実行できます" };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const theme = (formData.get("theme") as string)?.trim();
  const periodFormat = (formData.get("periodFormat") as string)?.trim();
  const status = (formData.get("status") as string) === "closed" ? "closed" : "open";

  const updated = await updateProgram(programId, publisherId, {
    title,
    description,
    theme,
    periodFormat,
    status,
  });
  if (!updated) return { error: "プログラムが見つからないか、編集権限がありません" };
  revalidatePath("/publisher");
  revalidatePath(`/publisher/programs/${programId}`);
  return { success: true };
}
