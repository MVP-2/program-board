"use server";

import { db } from "@/db/drizzle";
import { participations, programs, students } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function listParticipationsByProgram(programId: string) {
  return db
    .select({
      id: participations.id,
      userId: participations.userId,
      createdAt: participations.createdAt,
      studentName: students.name,
      studentEmail: students.email,
    })
    .from(participations)
    .innerJoin(students, eq(participations.userId, students.id))
    .where(eq(participations.programId, programId))
    .orderBy(participations.createdAt);
}

export async function listMyParticipationsWithProgram(userId: string) {
  return db
    .select({
      participationId: participations.id,
      participatedAt: participations.createdAt,
      programId: programs.id,
      programTitle: programs.title,
      programStatus: programs.status,
    })
    .from(participations)
    .innerJoin(programs, eq(participations.programId, programs.id))
    .where(eq(participations.userId, userId))
    .orderBy(participations.createdAt);
}

export async function listParticipationsByUser(userId: string) {
  return db
    .select()
    .from(participations)
    .where(eq(participations.userId, userId));
}

export async function participate(programId: string, userId: string) {
  await db
    .insert(participations)
    .values({ programId, userId })
    .onConflictDoNothing();
}

export async function hasParticipated(programId: string, userId: string) {
  const [row] = await db
    .select({ id: participations.id })
    .from(participations)
    .where(
      and(
        eq(participations.programId, programId),
        eq(participations.userId, userId)
      )
    )
    .limit(1);
  return !!row;
}
