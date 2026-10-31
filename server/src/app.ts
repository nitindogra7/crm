import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { prisma } from "./prisma";
import { onboardingRouter } from "./modules/onboarding/onboarding.routes";
import { formsAndApiRouter } from "./modules/forms & api/formsAndApi.routes";
import { formsAndApiController } from "./modules/forms & api/formsAndApi.controller";
import { leadsRouter } from "./modules/leads/leads.routes";
import { publicFormRateLimiter, publicFormBurstLimiter } from "./middleware/rateLimiter";
import { dynamicFormCorsMiddleware } from "./middleware/corsOriginVerifier";

const app: Application = express();

// Trust reverse proxy (Cloudflare, AWS ALB, Nginx) so client IP is accurately extracted for rate limiting
app.set("trust proxy", 1);

// Open CORS for public form ingestion & submission endpoints
const publicSubmissionCors = cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "Accept"],
});

// Allowed origins for dashboard management & authenticated user operations
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/+$/, ""),
  "https://onecompiler.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

const dashboardCors = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "Accept"],
});

// Fast path matcher for public form ingestion & health check routes
const publicPathPrefixes = [
  "/api/forms-and-api/f",
  "/api/forms-and-api/submit",
  "/api/forms/f",
  "/api/forms/submit",
  "/api/v1/f",
  "/api/f",
  "/api/v1/leads",
  "/v1/leads",
];

function isPublicRoute(path: string): boolean {
  if (path === "/health") return true;
  for (let i = 0; i < publicPathPrefixes.length; i++) {
    const prefix = publicPathPrefixes[i];
    if (path === prefix || path.startsWith(prefix + "/")) {
      return true;
    }
  }
  return false;
}

// Smart CORS routing: Public forms & lead endpoints undergo dynamic environment CORS & origin verification;
// Authenticated dashboard management routes are restricted to the verified frontend origin.
app.use((req, res, next) => {
  if (isPublicRoute(req.path)) {
    dynamicFormCorsMiddleware(req, res, next);
  } else {
    dashboardCors(req, res, next);
  }
});

// Fast-path Health Check: Execute before cookie parsing, body allocation, and auth validation
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`select 1`;
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check database failure:", error);
    res.status(503).json({ ok: false, error: "Database unavailable" });
  }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Scoped Clerk Authentication: Run JWT verification only for authenticated dashboard routes
const clerkAuth = clerkMiddleware();
app.use((req, res, next) => {
  if (isPublicRoute(req.path)) {
    return next();
  }
  return clerkAuth(req, res, next);
});

// Mounted Routes
app.use("/api/onboarding", onboardingRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/forms-and-api/leads", leadsRouter);
app.use("/api/forms/leads", leadsRouter);
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
app.all("/api/v1/leads", publicFormBurstLimiter, publicFormRateLimiter, (req, res) => {
  formsAndApiController.submitForm(req, res);
});
app.all("/v1/leads", publicFormBurstLimiter, publicFormRateLimiter, (req, res) => {
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