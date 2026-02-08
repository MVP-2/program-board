"use server";

import { count, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { participations, programs, students } from "@/db/schema";
import { and } from "drizzle-orm";

export async function getParticipationCountsByProgramIds(
  programIds: string[]
): Promise<Record<string, number>> {
  if (programIds.length === 0) return {};
  const rows = await db
    .select({
      programId: participations.programId,
      count: count(),
    })
    .from(participations)
    .where(inArray(participations.programId, programIds))
    .groupBy(participations.programId);
  const result: Record<string, number> = {};
  for (const id of programIds) result[id] = 0;
  for (const row of rows) result[row.programId] = Number(row.count);
  return result;
}

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
