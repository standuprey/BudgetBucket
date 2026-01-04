import { defineConfig } from "drizzle-kit";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL, ensure the database is provisioned");
// }

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "1e3701a4d6989b31e392f281387724d4",
    databaseId: "fdde84f6-de32-43ed-bae5-b959ed2c23db",
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
