import { drizzle } from 'drizzle-orm/d1';
import * as schema from "@shared/schema";

export type DbType = ReturnType<typeof drizzle>;

export function createDb(connection: D1Database) {
  return drizzle(connection, { schema });
}
