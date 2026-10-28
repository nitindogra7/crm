import { LucideIcon } from "lucide-react";

export type TeamSize = "team" | "solo";

export type CodeTab = "html" | "curl" | "react";

export type SlugAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";


export interface UseCaseOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface AvatarToneOption {
  id: string;
  bg: string;
  border: string;
  text: string;
}

export interface OnboardingFormValues {
  name: string;
  customSlug: string;
  hasManuallyEditedSlug: boolean;
  avatarTone: string;
  useCase: string;
  teamSize: TeamSize;
}
