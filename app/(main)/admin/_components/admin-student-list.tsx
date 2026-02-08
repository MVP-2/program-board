import type { InferSelectModel } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { students } from "@/db/schema";

type Student = InferSelectModel<typeof students>;

export function AdminStudentList({ initialList }: { initialList: Student[] }) {
  if (initialList.length === 0) {
    return (
      <p className="text-muted-foreground">生徒はまだ登録されていません。</p>
    );
  }
  return (
    <Table className="[&_tr]:border-border/50">
      <TableHeader>
        <TableRow>
          <TableHead>メールアドレス</TableHead>
          <TableHead>名前</TableHead>
          <TableHead>登録日</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialList.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.email}</TableCell>
            <TableCell>{s.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {s.createdAt instanceof Date
                ? s.createdAt.toLocaleDateString("ja-JP")
                : new Date(s.createdAt).toLocaleDateString("ja-JP")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
