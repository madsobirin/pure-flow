import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

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
  // Gunakan inisialisasi lokal standar untuk development agar reload cepat
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;
