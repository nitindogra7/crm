import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { prisma } from "./prisma";
import { onboardingRouter } from "./modules/onboarding/onboarding.routes";
import { formsAndApiRouter } from "./modules/forms & api/formsAndApi.routes";
import { formsAndApiController } from "./modules/forms & api/formsAndApi.controller";

const app: Application = express();

// Open CORS for public form ingestion & submission endpoints
const publicSubmissionCors = cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
});

// Allowed origins for dashboard management & authenticated user operations
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

const dashboardCors = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
});

// Smart CORS routing: Public forms endpoints accept all origins; authenticated routes restrict to frontend
app.use((req, res, next) => {
  const isPublicFormRoute =
    req.path.startsWith("/api/forms-and-api/f/") ||
    req.path === "/api/forms-and-api/f" ||
    req.path.startsWith("/api/forms-and-api/submit/") ||
    req.path === "/api/forms-and-api/submit" ||
    req.path === "/api/forms-and-api/simulate" ||
    req.path.startsWith("/api/forms/f/") ||
    req.path === "/api/forms/f" ||
    req.path.startsWith("/api/forms/submit/") ||
    req.path === "/api/forms/submit" ||
    req.path === "/api/forms/simulate" ||
    req.path.startsWith("/api/v1/f/") ||
    req.path === "/api/v1/f" ||
    req.path.startsWith("/api/f/") ||
    req.path === "/api/f" ||
    req.path.startsWith("/api/v1/leads") ||
    req.path === "/api/v1/leads" ||
    req.path.startsWith("/v1/leads") ||
    req.path === "/v1/leads" ||
    req.path === "/health";

  if (isPublicFormRoute) {
    publicSubmissionCors(req, res, next);
  } else {
    dashboardCors(req, res, next);
  }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Mounted Routes
app.use("/api/onboarding", onboardingRouter);
app.use("/api/forms-and-api", formsAndApiRouter);
app.use("/api/forms", formsAndApiRouter);

// Public form endpoint aliases for direct HTML form actions
app.use("/api/v1/f", (req, res, next) => {
  req.url = `/f${req.url}`;
  formsAndApiRouter(req, res, next);
});
app.use("/api/f", (req, res, next) => {
  req.url = `/f${req.url}`;
  formsAndApiRouter(req, res, next);
});
app.all("/api/v1/leads", (req, res) => {
  formsAndApiController.submitForm(req, res);
});
app.all("/v1/leads", (req, res) => {
  formsAndApiController.submitForm(req, res);
});

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
