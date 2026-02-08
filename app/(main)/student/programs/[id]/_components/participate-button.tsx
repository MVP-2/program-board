"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { participateAction } from "../../../actions";

export function ParticipateButton({ programId }: { programId: string }) {
  const { pending } = useFormStatus();

  return (
    <form action={participateAction.bind(null, programId)}>
      <Button type="submit" disabled={pending}>
        {pending ? "送信中…" : "参加する"}
      </Button>
    </form>
  );
}
