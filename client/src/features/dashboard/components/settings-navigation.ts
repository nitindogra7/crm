import { Activity, Bell, Globe, User, Webhook } from "lucide-react";

export const SETTINGS_SECTIONS = [
  { id: "general", label: "General", icon: User },
  { id: "origins", label: "Environments", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "logs", label: "Delivery logs", icon: Activity },
] as const;

export function getSettingsSection(tab: string | null) {
  return SETTINGS_SECTIONS.find(section => section.id === tab)?.id ?? "general";
}
