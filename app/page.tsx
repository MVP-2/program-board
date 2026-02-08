import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/middleware";

const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin",
  publisher: "/publisher",
  student: "/student",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const role = (user.app_metadata["role"] as AppRole) ?? "student";
  redirect(ROLE_HOME[role] ?? "/student");
}
