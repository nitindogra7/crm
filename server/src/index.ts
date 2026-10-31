import "dotenv/config";
import { app } from "./app";
import { prisma } from "./prisma";

const port = Number(process.env.PORT ?? 4000);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  // Hard timeout to force exit if active Keep-Alive connections do not terminate
  const forceExitTimeout = setTimeout(() => {
    console.error("Graceful shutdown timed out after 5000ms. Forcing exit.");
    process.exit(1);
  }, 5000);
  forceExitTimeout.unref();

  server.close(async (err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
    }
    try {
      await prisma.$disconnect();
      console.log("Prisma client disconnected successfully.");
      clearTimeout(forceExitTimeout);
      process.exit(0);
    } catch (dbErr) {
      console.error("Error disconnecting Prisma on shutdown:", dbErr);
      clearTimeout(forceExitTimeout);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));