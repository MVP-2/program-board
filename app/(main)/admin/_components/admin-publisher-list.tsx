import type { PublisherItem } from "../actions";

export function AdminPublisherList({
  initialList,
}: {
  initialList: PublisherItem[];
}) {
  if (initialList.length === 0) {
    return (
      <p className="text-muted-foreground">掲載者はまだいません。</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-2 text-left font-medium">メールアドレス</th>
            <th className="px-4 py-2 text-left font-medium">名前</th>
          </tr>
        </thead>
        <tbody>
          {initialList.map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              <td className="px-4 py-2">{p.email}</td>
              <td className="px-4 py-2">{p.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
