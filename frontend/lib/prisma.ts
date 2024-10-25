import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple Prisma client instances in development
  // eslint-disable-next-line no-unused-vars,no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export const db = prisma;
