import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * IP-based Rate Limiter for Public Form Submissions
 * Mitigates spam flood attacks and brute-force submissions.
 * Default: 30 submissions per 15 minutes per IP.
 */
export const publicFormRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === "test" ? 1000 : 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req: Request) => {
    // Only allow test bypass in test environment to prevent production rate limit evasion
    if (process.env.NODE_ENV === "test" && req.headers["x-test-bypass"] === "qa-test") return true;
    return false;
  },
  handler: (req: Request, res: Response) => {
    const isJson =
      req.headers["content-type"]?.includes("application/json") ||
      req.headers.accept?.includes("application/json");

    if (!isJson && req.headers.accept?.includes("text/html")) {
      res.status(429).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Submission Limit Exceeded</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
              .card { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); max-width: 420px; text-align: center; }
              h1 { font-size: 1.25rem; color: #dc2626; margin-bottom: 0.75rem; }
              p { color: #64748b; font-size: 0.95rem; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Rate Limit Exceeded</h1>
              <p>Too many form submissions received from your IP address. Please wait a few minutes before trying again.</p>
            </div>
          </body>
        </html>
      `);
      return;
    }

    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "Too many form submissions from this IP address. Please wait a few minutes before submitting again.",
      retryAfterMinutes: 15,
    });
  },
});

/**
 * Fast Burst Limiter
 * Blocks automated scripts submitting rapid-fire payloads (>5 requests in 10s from same IP)
 */
export const publicFormBurstLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  limit: process.env.NODE_ENV === "test" ? 500 : 6,
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req: Request) => {
    if (process.env.NODE_ENV === "test" && req.headers["x-test-bypass"] === "qa-test") return true;
    return false;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Submission received too rapidly",
      message: "Please wait a few seconds between form submissions.",
    });
  },
});

