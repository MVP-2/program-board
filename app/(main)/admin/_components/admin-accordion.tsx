"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

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
    <details className="group" open={defaultOpen}>
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
  createPublisherContent: ReactNode;
  listStudentsContent: ReactNode;
  listPublishersContent: ReactNode;
};

export function AdminAccordion({
  programListContent,
  createStudentContent,
  createPublisherContent,
  listStudentsContent,
  listPublishersContent,
}: AdminAccordionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg divide-y divide-border">
        <AccordionItem title="掲載状況（プログラム一覧）" defaultOpen>
          {programListContent}
        </AccordionItem>
        <AccordionItem title="アカウント作成: 生徒">
          {createStudentContent}
        </AccordionItem>
        <AccordionItem title="アカウント作成: 掲載者">
          {createPublisherContent}
        </AccordionItem>
        <AccordionItem title="一覧: 生徒">{listStudentsContent}</AccordionItem>
        <AccordionItem title="一覧: 掲載者">
          {listPublishersContent}
        </AccordionItem>
      </div>

      <Button variant="outline" size="sm" asChild>
        <Link href="/admin/csv">
          CSV 出力（生徒一覧・掲載者一覧をすべて出力）
        </Link>
      </Button>
    </div>
  );
}
