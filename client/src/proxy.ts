import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { findDocPage, docHref } from "@/features/docs/data/docs-data";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)"]);
const handleAuth = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname === "/docs" || req.nextUrl.pathname.startsWith("/docs/")) {
    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const legacy = segments.length === 1 && req.nextUrl.searchParams.has("guide");
    const queryGuides = req.nextUrl.searchParams.getAll("guide");
    let id: string | null = legacy ? queryGuides[0] : segments[1] || null;
    try { id = id ? decodeURIComponent(id) : null; } catch { id = "__invalid__"; }
    const page = findDocPage(id);
    if (!page || segments.length > 2 || (legacy && queryGuides.length !== 1)) {
      // Rewrite to the statically generated 404 before React starts streaming.
      return NextResponse.rewrite(new URL("/seo-guide-not-found", req.url), {
        status: 404, headers: { "X-Robots-Tag": "noindex, follow" },
      });
    }
    if (legacy || req.nextUrl.pathname !== docHref(page.id)) {
      const destination = req.nextUrl.clone();
      destination.pathname = docHref(page.id);
      destination.searchParams.delete("guide");
      return NextResponse.redirect(destination, 308);
    }
    // Public documentation must not run authentication middleware.
    return NextResponse.next();
  }
  return handleAuth(req, event);
}

export const config = {
  matcher: ["/docs/:path*", "/__clerk/:path*", "/dashboard(.*)", "/onboarding(.*)", "/sign-in(.*)", "/sign-up(.*)", "/(api|trpc)(.*)"],
};
