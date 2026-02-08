"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { participateAction } from "../../../actions";

export function ParticipateButton({ programId }: { programId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!window.confirm("本当に参加しますか？")) return;

    setPending(true);
    try {
      await participateAction(programId);
      router.refresh();
    } catch (_e) {
      alert("参加申込に失敗しました");
    }
    setPending(false);
  }

  return (
    <Button type="button" disabled={pending} onClick={handleClick}>
      {pending ? "送信中…" : "参加する"}
    </Button>
  );
}
