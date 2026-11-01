"use client";
import Link from "@/shared/components/app-link";
export default function PageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-dvh place-items-center bg-slate-50 px-6"><section role="alert" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h1 className="text-2xl font-semibold text-slate-900">We could not open this page</h1><p className="mt-3 text-sm text-slate-600">Please try loading it again.</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={reset} className="rounded-xl bg-[var(--ui-action)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ui-action-hover)]">Try again</button><Link href="/" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Go to home</Link></div></section></main>;
}
