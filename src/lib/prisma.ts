// =============================================================
// src/lib/prisma.ts
//
// BEST PRACTICE: Singleton Pattern untuk Prisma Client
// Jangan buat PrismaClient baru setiap kali dipanggil!
// Ini mencegah terlalu banyak koneksi ke database.
// =============================================================

import { PrismaClient } from "@prisma/client";

// Deklarasi tipe untuk global object di Node.js
// "declare global" artinya kita menambah definisi tipe ke scope global
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Singleton: gunakan yang sudah ada, atau buat baru
const prisma = global.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_WbzTelsJw1o5@ep-super-haze-ao338x8h.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

// Di mode development, simpan di global agar tidak dibuat ulang
// saat hot-reload (Next.js dev server reload otomatis)
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
