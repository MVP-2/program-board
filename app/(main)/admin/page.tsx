import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { listStudents } from "@/lib/repositories/students";
import { listAllPrograms } from "@/lib/repositories/programs";
import { AdminStudentList } from "./_components/admin-student-list";
import { CreateStudentForm } from "./_components/create-student-form";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata["role"] as string) !== "admin") {
    redirect("/login");
  }

  const [studentList, programList] = await Promise.all([
    listStudents(),
    listAllPrograms(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">管理者</h1>
        <a
          href="/admin/csv"
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          CSV 出力
        </a>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">掲載状況（プログラム一覧）</h2>
        {programList.length === 0 ? (
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
                    <td className="px-4 py-2">{p.status === "open" ? "募集中" : "締切"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">生徒アカウント作成</h2>
        <CreateStudentForm />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">生徒一覧</h2>
        <AdminStudentList initialList={studentList} />
      </section>
    </div>
  );
}
