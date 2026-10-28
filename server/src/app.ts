import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { prisma } from "./prisma";
import { onboardingRouter } from "./modules/onboarding/onboarding.routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`select 1`;
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check database failure:", error);
    res.status(503).json({ ok: false, error: "Database unavailable" });
  }
});

app.use("/api/onboarding", onboardingRouter);

// Global Error Handler
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error caught by server:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

export { app };
export default app;
