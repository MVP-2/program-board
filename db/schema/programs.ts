import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const programStatusEnum = ["open", "closed"] as const;

export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  theme: text("theme").notNull(),
  periodFormat: text("period_format").notNull(),
  status: text("status", { enum: programStatusEnum }).notNull().default("open"),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdateFn(
    () => new Date(),
  ),
});
