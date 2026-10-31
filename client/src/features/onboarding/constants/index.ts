import { Building2, Briefcase, Rocket, Globe } from "lucide-react";
import { UseCaseOption, TeamSizeOption } from "../types";

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
  {
    id: "company",
    label: "Company / Team",
    description: "Capture inbound sales leads, inquiries & customer requests",
    icon: Building2,
  },
  {
    id: "agency",
    label: "Agency / Freelancer",
    description: "Manage client projects, quote forms & consultation bookings",
    icon: Briefcase,
  },
  {
    id: "saas",
    label: "Startup / SaaS",
    description: "Collect product waitlists, demo requests & user feedback",
    icon: Rocket,
  },
  {
    id: "personal",
    label: "Personal / Creator",
    description: "Portfolio contact forms, newsletters & personal side projects",
    icon: Globe,
  },
];

export const TEAM_SIZES: TeamSizeOption[] = [
  { id: "solo", label: "Just me", sublabel: "Solo creator" },
  { id: "2-10", label: "2 – 10", sublabel: "Small team" },
  { id: "11-50", label: "11 – 50", sublabel: "Growing team" },
  { id: "50+", label: "50+", sublabel: "Enterprise" },
];
