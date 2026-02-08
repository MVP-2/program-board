"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminAccount } from "../actions";

export function CreateAdminForm() {
  const [state, formAction, isPending] = useActionState(
    createAdminAccount,
    {}
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="name">名前</Label>
        <Input
          id="name"
          name="name"
          placeholder="管理者名"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">初期パスワード</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="6文字以上"
          required
          minLength={6}
          className="mt-1"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "作成中…" : "管理者アカウントを作成"}
      </Button>
    </form>
  );
}
