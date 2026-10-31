import { AuthFormSkeleton } from "@/shared/components/auth-skeleton";
export default function Loading() { return <main role="status" aria-label="Loading workspace setup" className="flex min-h-dvh items-center justify-center p-6"><div className="w-full max-w-md"><AuthFormSkeleton mode="sign-up" /></div></main>; }
