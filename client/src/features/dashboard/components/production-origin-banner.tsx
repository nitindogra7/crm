"use client";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Link from "@/shared/components/app-link";
import { useDashboard } from "../context/dashboard-context";
import styles from "./settings.module.css";

export function ProductionOriginBanner() {
  const pathname = usePathname();
  const { currentEnvironment, workspace } = useDashboard(["currentEnvironment", "workspace"]);
  if (pathname.startsWith("/dashboard/settings") || currentEnvironment !== "production" || workspace.productionOrigin) return null;
  return <div className={styles.originBanner}><div><strong>Add your production website</strong><p>Set a website origin before accepting live submissions.</p></div><Link href="/dashboard/settings?tab=origins">Set up origin<ArrowUpRight size={14}/></Link></div>;
}
