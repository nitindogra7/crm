import { Activity, Bell, Globe, User, Webhook } from "lucide-react";

export const SETTINGS_SECTIONS = [
  { id: "general", available: true, label: "General", icon: User },
  { id: "origins", available: true, label: "Environments", icon: Globe },
  { id: "notifications", available: false, label: "Notifications", icon: Bell },
  { id: "webhooks", available: false, label: "Webhooks", icon: Webhook },
  { id: "logs", available: false, label: "Delivery logs", icon: Activity },
] as const;

export function getSettingsSection(tab: string | null) {
  return SETTINGS_SECTIONS.find(section => section.id === tab)?.id ?? "general";
}
