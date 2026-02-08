import { redirect } from "next/navigation";

export default async function PublisherParticipantsRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/publisher/programs/${id}`);
}
