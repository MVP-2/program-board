import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listAllPrograms } from "@/lib/repositories/programs";
import { listStudents } from "@/lib/repositories/students";
import { createClient } from "@/lib/supabase/server";
import { AdminAccordion } from "./_components/admin-accordion";
import { AdminPublisherList } from "./_components/admin-publisher-list";
import { AdminStudentList } from "./_components/admin-student-list";
import { CreatePublisherForm } from "./_components/create-publisher-form";
import { CreateStudentForm } from "./_components/create-student-form";
import { listPublishers } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata.role as string) !== "admin") {
    redirect("/login");
  }

  const [studentList, programList, publisherList] = await Promise.all([
    listStudents(),
    listAllPrograms(),
    listPublishers(),
  ]);

  const programListContent =
    programList.length === 0 ? (
      <p className="text-muted-foreground">プログラムはまだありません。</p>
    ) : (
      <Table className="[&_tr]:border-border/50">
        <TableHeader>
          <TableRow>
            <TableHead>プログラム名</TableHead>
            <TableHead>募集状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programList.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>
                {p.status === "open" ? (
                  <Badge variant="default">募集中</Badge>
                ) : (
                  <Badge variant="secondary">締切</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">管理者</h1>

      <AdminAccordion
        programListContent={programListContent}
        createStudentContent={<CreateStudentForm />}
        createPublisherContent={<CreatePublisherForm />}
        listStudentsContent={<AdminStudentList initialList={studentList} />}
        listPublishersContent={
          <AdminPublisherList initialList={publisherList} />
        }
      />
    </div>
  );
}
