import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PublisherItem } from "../actions";

export function AdminPublisherList({
  initialList,
}: {
  initialList: PublisherItem[];
}) {
  if (initialList.length === 0) {
    return <p className="text-muted-foreground">掲載者はまだいません。</p>;
  }

  return (
    <Table className="[&_tr]:border-border/50">
      <TableHeader>
        <TableRow>
          <TableHead>メールアドレス</TableHead>
          <TableHead>名前</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialList.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.email}</TableCell>
            <TableCell>{p.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
