import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/__clerk/:path*",
    "/dashboard(.*)",
    "/onboarding(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/(api|trpc)(.*)",
  ],
};
