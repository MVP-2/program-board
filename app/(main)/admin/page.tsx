import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { listStudents } from "@/lib/repositories/students";
import { listAllPrograms } from "@/lib/repositories/programs";
import { listPublishers } from "./actions";
import { AdminStudentList } from "./_components/admin-student-list";
import { AdminPublisherList } from "./_components/admin-publisher-list";
import { CreateStudentForm } from "./_components/create-student-form";
import { CreateAdminForm } from "./_components/create-admin-form";
import { AdminAccordion } from "./_components/admin-accordion";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "admin") {
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
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2 text-left font-medium">プログラム名</th>
              <th className="px-4 py-2 text-left font-medium">募集状態</th>
            </tr>
          </thead>
          <tbody>
            {programList.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">
                  {p.status === "open" ? "募集中" : "締切"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">管理者</h1>

      <AdminAccordion
        programListContent={programListContent}
        createStudentContent={<CreateStudentForm />}
        createAdminContent={<CreateAdminForm />}
        listStudentsContent={<AdminStudentList initialList={studentList} />}
        listPublishersContent={
          <AdminPublisherList initialList={publisherList} />
        }
      />
    </div>
  );
}
