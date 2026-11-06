import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`ApplyNow API listening on port ${env.PORT}`);
});

const shutdown = (signal: string): void => {
  console.log(`${signal} received. Closing HTTP server.`);

  server.close(async (error) => {
    if (error) {
      console.error("Error while closing HTTP server.");
      process.exitCode = 1;
    }

    try {
      await prisma.$disconnect();
    } catch {
      console.error("Error while disconnecting from the database.");
      process.exitCode = 1;
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
