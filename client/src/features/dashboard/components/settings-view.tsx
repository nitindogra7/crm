"use client";

import { useSearchParams } from "next/navigation";
import { getSettingsSection } from "./settings-navigation";
import { useDashboard } from "../context/dashboard-context";
import { GeneralSettings, EnvironmentSettings, NotificationSettingsPanel, WebhookSettingsPanel, DeliveryLogsPanel } from "./settings-panels";
import styles from "./settings.module.css";

export function SettingsView() {
  const params = useSearchParams();
  const { isLoading } = useDashboard([]);
  const active = getSettingsSection(params.get("tab"));
  const panels = {
    general: <GeneralSettings />,
    origins: <EnvironmentSettings />,
    notifications: <NotificationSettingsPanel />,
    webhooks: <WebhookSettingsPanel />,
    logs: <DeliveryLogsPanel />,
  };

  return (
    <div className={styles.settings}>
      <header className={styles.pageHeader}>
        <h1>Settings</h1>
        <p>Manage your workspace and connected services.</p>
      </header>
      <div className={styles.content}>
        {isLoading ? <div className={styles.panel} role="status" aria-label="Loading settings"><div className={styles.placeholder} /><div className={styles.placeholder} /><div className={styles.placeholder} /></div> : panels[active]}
      </div>
    </div>
  );
}
