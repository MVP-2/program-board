"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteProgramAction } from "../actions";

export function DeleteProgramButton({
  programId,
  publisherId,
}: {
  programId: string;
  publisherId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleClick() {
    const ok = window.confirm(
      "本当に削除しますか？\n参加した生徒の申込データも同時に削除されます。",
    );
    if (!ok) return;

    setIsDeleting(true);
    const result = await deleteProgramAction(programId, publisherId);
    if (result?.success) {
      router.push("/publisher");
      router.refresh();
    } else {
      alert(result?.error ?? "削除に失敗しました");
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={isDeleting}
      onClick={handleClick}
    >
      {isDeleting ? "削除中…" : "削除"}
    </Button>
  );
}
