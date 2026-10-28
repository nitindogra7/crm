import { Zap, Building, Sparkles, User } from "lucide-react";
import { UseCaseOption, AvatarToneOption } from "../types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export const USE_CASES: UseCaseOption[] = [
  { id: "saas", label: "SaaS & Web App", icon: Zap },
  { id: "agency", label: "Agency & Client Sites", icon: Building },
  { id: "leads", label: "Landing Pages & Leads", icon: Sparkles },
  { id: "personal", label: "Personal Projects", icon: User },
];

export const AVATAR_TONES: AvatarToneOption[] = [
  { id: "zinc", bg: "bg-zinc-800", border: "border-zinc-700", text: "text-white" },
  { id: "emerald", bg: "bg-emerald-950/60", border: "border-emerald-700/60", text: "text-emerald-300" },
  { id: "slate", bg: "bg-slate-800", border: "border-slate-700", text: "text-slate-200" },
  { id: "white", bg: "bg-white", border: "border-white", text: "text-black" },
];
