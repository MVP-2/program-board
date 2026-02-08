import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env["POSTGRES_URL"] ??
  (process.env["NODE_ENV"] !== "production"
    ? "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
    : undefined);

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL");
}

const client = postgres(connectionString, {
  max: 5,
  prepare: false,
});

export const db = drizzle(client, { schema, casing: "snake_case" });
