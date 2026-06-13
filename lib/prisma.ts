import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Singleton pattern to prevent too many Prisma Client instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // Gunakan adapter Neon serverless untuk environment produksi (Vercel)
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
  prismaInstance = new PrismaClient({ adapter });
} else {
  // Gunakan adapter Pg standar untuk development agar pool koneksi ter-reuse
  if (!globalForPrisma.prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
