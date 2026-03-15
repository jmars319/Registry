import path from "node:path";
import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

loadEnvFile(path.resolve("../../.env"));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.mjs"
  },
  datasource: {
    url: env("DATABASE_URL")
  }
});
