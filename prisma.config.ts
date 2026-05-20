// prisma.config.ts
// Prisma v7 memindahkan konfigurasi database ke file ini
// File schema.prisma tidak lagi mendukung url = env("DATABASE_URL")

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_WbzTelsJw1o5@ep-super-haze-ao338x8h.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
