"use server";

import { db } from "@/db/drizzle";
import { students } from "@/db/schema";

export async function listStudents() {
  return db.select().from(students).orderBy(students.createdAt);
}
