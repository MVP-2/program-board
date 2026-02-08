"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProgramAction, updateProgramAction } from "../actions";
import { DeleteProgramButton } from "./delete-program-button";

type ProgramFormProps = {
  publisherId: string;
  programId?: string;
  defaultValues?: {
    title: string;
    description: string;
    theme: string;
    periodFormat: string;
    status: "open" | "closed";
  };
};

export function ProgramForm({
  publisherId,
  programId,
  defaultValues,
}: ProgramFormProps) {
  const router = useRouter();
  const isEdit = !!programId;
  const [state, formAction, isPending] = useActionState(
    isEdit && programId
      ? updateProgramAction.bind(null, programId, publisherId)
      : createProgramAction.bind(null, publisherId),
    {}
  );

  useEffect(() => {
    if (state?.success && !isEdit) {
      router.push("/publisher");
      router.refresh();
    } else if (state?.success && isEdit && programId) {
      router.push(`/publisher/programs/${programId}`);
      router.refresh();
    }
  }, [state?.success, isEdit, programId, router]);

  return (
    <form action={formAction} className="mt-4 max-w-xl space-y-4">
      <div>
        <Label htmlFor="title">プログラム名</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">概要・説明</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <Label htmlFor="theme">課題テーマ</Label>
        <Input
          id="theme"
          name="theme"
          defaultValue={defaultValues?.theme}
          placeholder="例: 自分らしさや多様性を尊重する社会を作るためには？"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="periodFormat">期間・実施形態</Label>
        <Input
          id="periodFormat"
          name="periodFormat"
          defaultValue={defaultValues?.periodFormat}
          placeholder="例: 2ヶ月・週1回・全7〜9講"
          required
          className="mt-1"
        />
      </div>
      {isEdit && (
        <div>
          <Label>募集状態</Label>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="open"
                defaultChecked={defaultValues?.status === "open"}
              />
              募集中
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="closed"
                defaultChecked={defaultValues?.status === "closed"}
              />
              締切
            </label>
          </div>
        </div>
      )}
      {!isEdit && (
        <input type="hidden" name="status" value="open" />
      )}
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "保存中…" : isEdit ? "更新" : "登録"}
        </Button>
        {isEdit && programId && (
          <DeleteProgramButton
            programId={programId}
            publisherId={publisherId}
          />
        )}
      </div>
    </form>
  );
}
