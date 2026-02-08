"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { programs } from "@/db/schema";

export async function listAllPrograms() {
  return db.select().from(programs).orderBy(desc(programs.createdAt));
}

export async function listProgramsByPublisher(createdBy: string) {
  return db
    .select()
    .from(programs)
    .where(eq(programs.createdBy, createdBy))
    .orderBy(programs.createdAt);
}

export async function listOpenPrograms() {
  return db
    .select()
    .from(programs)
    .where(eq(programs.status, "open"))
    .orderBy(programs.createdAt);
}

export async function getProgram(id: string) {
  const [row] = await db
    .select()
    .from(programs)
    .where(eq(programs.id, id))
    .limit(1);
  return row ?? null;
}

export async function createProgram(
  createdBy: string,
  data: {
    title: string;
    description: string;
    theme: string;
    periodFormat: string;
    status: "open" | "closed";
  },
) {
  const [row] = await db
    .insert(programs)
    .values({
      createdBy,
      title: data.title,
      description: data.description,
      theme: data.theme,
      periodFormat: data.periodFormat,
      status: data.status,
    })
    .returning();
  return row;
}

export async function updateProgram(
  id: string,
  publisherId: string,
  data: Partial<{
    title: string;
    description: string;
    theme: string;
    periodFormat: string;
    status: "open" | "closed";
  }>,
) {
  const [row] = await db
    .update(programs)
    .set(data)
    .where(eq(programs.id, id))
    .returning();
  if (!row || row.createdBy !== publisherId) return null;
  return row;
}

export async function deleteProgram(id: string, publisherId: string) {
  const program = await getProgram(id);
  if (!program || program.createdBy !== publisherId) return false;
  await db.delete(programs).where(eq(programs.id, id));
  return true;
}
