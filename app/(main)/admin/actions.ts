"use server";

import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { db } from "@/db/drizzle";
import { students } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createStudentAccount(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const password = (formData.get("password") as string) ?? "";

  if (!email || !name || !password) {
    return { error: "メールアドレス・名前・パスワードを入力してください" };
  }
  if (password.length < 6) {
    return { error: "パスワードは6文字以上にしてください" };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user: me },
  } = await supabase.auth.getUser();
  const role = me?.app_metadata["role"];
  if (role !== "admin") {
    return { error: "管理者のみ実行できます" };
  }

  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return { error: "サーバー設定エラー" };

  const admin = createSupabaseAdmin(url, key);
  const { data: newUser, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: "student" },
    });

  if (createError) {
    if (createError.message.includes("already been registered"))
      return { error: "このメールアドレスは既に登録されています" };
    return { error: createError.message };
  }
  if (!newUser.user) return { error: "ユーザー作成に失敗しました" };

  await db
    .insert(students)
    .values({
      id: newUser.user.id,
      email: newUser.user.email ?? email,
      name,
    })
    .onConflictDoNothing();

  revalidatePath("/admin");
  return {};
}
