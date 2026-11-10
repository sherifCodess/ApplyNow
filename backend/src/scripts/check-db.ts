import { prisma } from "../lib/prisma.js";

const checkDatabase = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Runtime database connection successful.");
  } catch {
    console.error("Runtime database connection failed.");
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

await checkDatabase();
