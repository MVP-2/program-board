"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function MainHeader() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="flex items-center justify-between">
      <a href="/" className="font-semibold">
        program-board
      </a>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ログアウト
      </button>
    </nav>
  );
}
