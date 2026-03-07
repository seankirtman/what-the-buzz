import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function requireAtRuntime(moduleName: string) {
  return (eval("require") as NodeRequire)(moduleName);
}

export function isSortOrderUnsupportedError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("Unknown argument `sortOrder`")
  );
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const usePostgres =
    url.startsWith("postgresql://") || url.startsWith("postgres://");

  if (usePostgres) {
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  const sqliteAdapterModule = [
    "@prisma",
    ["adapter", "better", "sqlite3"].join("-"),
  ].join("/");
  const { PrismaBetterSqlite3 } = requireAtRuntime(sqliteAdapterModule);
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
