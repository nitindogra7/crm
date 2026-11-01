import Link from "@/shared/components/app-link";
export default function NotFound() {
 return <main className="grid min-h-dvh place-items-center bg-slate-50 px-6 text-center"><div className="max-w-md space-y-5"><p className="text-sm font-semibold text-blue-600">404 - Page not found</p><h1 className="text-3xl text-slate-900">Let us get you back on track</h1><p className="text-slate-600">This page may have moved or the address may be incorrect.</p><Link href="/dashboard" className="inline-flex rounded-xl bg-[var(--ui-action)] px-5 py-3 font-semibold text-white hover:bg-[var(--ui-action-hover)]">Go to dashboard</Link></div></main>;
}
