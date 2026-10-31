import { LucideIcon } from "lucide-react";

export type TeamSize = "solo" | "2-10" | "11-50" | "50+";

export interface UseCaseOption {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface TeamSizeOption {
  id: TeamSize;
  label: string;
  sublabel?: string;
}

export interface OnboardingFormValues {
  name: string;
  useCase: string;
  teamSize: TeamSize;
}
