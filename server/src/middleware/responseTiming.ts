import { performance } from "node:perf_hooks";
import type { RequestHandler } from "express";
export const responseTiming: RequestHandler = (_req, res, next) => {
  const started = performance.now();
  const originalWriteHead = res.writeHead;
  res.writeHead = function (this: typeof res, ...args: Parameters<typeof originalWriteHead>) {
    if (!res.headersSent) res.setHeader("Server-Timing", "app;dur=" + (performance.now() - started).toFixed(1));
    return originalWriteHead.apply(this, args);
  } as typeof originalWriteHead;
  next();
};
