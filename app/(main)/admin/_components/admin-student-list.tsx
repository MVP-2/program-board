import type { InferSelectModel } from "drizzle-orm";
import type { students } from "@/db/schema";

type Student = InferSelectModel<typeof students>;

export function AdminStudentList({
  initialList,
}: {
  initialList: Student[];
}) {
  if (initialList.length === 0) {
    return (
      <p className="text-muted-foreground">生徒はまだ登録されていません。</p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-2 text-left font-medium">メールアドレス</th>
            <th className="px-4 py-2 text-left font-medium">名前</th>
            <th className="px-4 py-2 text-left font-medium">登録日</th>
          </tr>
        </thead>
        <tbody>
          {initialList.map((s) => (
            <tr key={s.id} className="border-b last:border-0">
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {s.createdAt instanceof Date
                  ? s.createdAt.toLocaleDateString("ja-JP")
                  : new Date(s.createdAt).toLocaleDateString("ja-JP")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
