"use client";
import Link from "@/shared/components/app-link";
export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
 return <section role="alert" className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><p className="mb-2 text-sm font-semibold text-blue-600">Something went wrong</p><h1 className="text-2xl font-semibold text-slate-900">We could not open this page</h1><p className="mt-3 text-sm text-slate-600">Try loading it again, or return to your overview.</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={reset} className="rounded-xl bg-[var(--ui-action)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ui-action-hover)]">Try again</button><Link href="/dashboard" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Back to overview</Link></div></section>;
}
