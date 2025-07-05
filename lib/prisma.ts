import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in serverless environment
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// In development, store prisma instance globally to prevent hot reloading issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Handle cleanup on process termination
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});