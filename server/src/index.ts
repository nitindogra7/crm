import "dotenv/config";
import { app } from "./app";
import { prisma } from "./prisma";

const port = Number(process.env.PORT ?? 4000);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Prisma client disconnected successfully.");
      process.exit(0);
    } catch (err) {
      console.error("Error disconnecting Prisma on shutdown:", err);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));