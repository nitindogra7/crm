import { AuthFrame } from "@/shared/components/auth-frame";
import { AuthFormSkeleton } from "@/shared/components/auth-skeleton";
export default function Loading() { return <AuthFrame mode="onboarding"><div role="status" aria-label="Loading workspace setup"><AuthFormSkeleton mode="sign-up" /></div></AuthFrame>; }
