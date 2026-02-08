"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-b last:border-b-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium hover:underline [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-4 pt-0">{children}</div>
    </details>
  );
}

type AdminAccordionProps = {
  programListContent: ReactNode;
  createStudentContent: ReactNode;
  createAdminContent: ReactNode;
  listStudentsContent: ReactNode;
  listPublishersContent: ReactNode;
};

export function AdminAccordion({
  programListContent,
  createStudentContent,
  createAdminContent,
  listStudentsContent,
  listPublishersContent,
}: AdminAccordionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border">
        <AccordionItem title="掲載状況（プログラム一覧）" defaultOpen>
          {programListContent}
        </AccordionItem>
        <AccordionItem title="アカウント作成: 生徒">
          {createStudentContent}
        </AccordionItem>
        <AccordionItem title="アカウント作成: 管理者">
          {createAdminContent}
        </AccordionItem>
        <AccordionItem title="一覧: 生徒">{listStudentsContent}</AccordionItem>
        <AccordionItem title="一覧: 掲載者">
          {listPublishersContent}
        </AccordionItem>
      </div>

      <Link
        href="/admin/csv"
        className="w-fit rounded-md border px-3 py-2 text-sm hover:bg-accent"
      >
        CSV 出力（生徒一覧・掲載者一覧をすべて出力）
      </Link>
    </div>
  );
}
