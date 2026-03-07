import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const url = process.env.DATABASE_URL || "";
const usePostgres =
  url.startsWith("postgresql://") || url.startsWith("postgres://");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: usePostgres ? "prisma/migrations_pg" : "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
