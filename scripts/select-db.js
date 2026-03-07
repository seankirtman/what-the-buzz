#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const url = process.env.DATABASE_URL || "";
const usePostgres =
  url.startsWith("postgresql://") || url.startsWith("postgres://");

// On Vercel, we must use PostgreSQL (SQLite doesn't work in serverless)
if (process.env.VERCEL === "1" && !usePostgres) {
  console.error(
    "Error: DATABASE_URL must be a PostgreSQL connection string on Vercel.\n" +
      "Add DATABASE_URL in Vercel: Settings → Environment Variables.\n" +
      "Get a free DB at https://neon.tech or https://vercel.com/storage/postgres"
  );
  process.exit(1);
}

const root = path.join(__dirname, "..");
const src = usePostgres
  ? "prisma/schema.postgresql.prisma"
  : "prisma/schema.sqlite.prisma";
const dest = "prisma/schema.prisma";

fs.copyFileSync(path.join(root, src), path.join(root, dest));
console.log(`Using ${usePostgres ? "PostgreSQL" : "SQLite"} schema`);
