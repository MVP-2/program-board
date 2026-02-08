import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { programs } from "./programs";

export const participations = pgTable(
  "participations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("participations_program_user").on(t.programId, t.userId)]
);
