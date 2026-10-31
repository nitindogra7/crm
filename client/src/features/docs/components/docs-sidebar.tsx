"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "@/shared/components/app-link";
import { DOC_GROUPS, DOC_PAGES } from "../data/docs-data";
import styles from "./docs.module.css";

interface DocsSidebarProps {
  activeId?: string;
  onNavigate: (id: string) => void;
  onClose?: () => void;
}

export function DocsSidebar({ activeId, onNavigate, onClose }: DocsSidebarProps) {
  return (
    <div className={styles.sidebarContent}>
      {onClose && <div className={styles.mobileNavHeader}><span>Documentation</span><button type="button" onClick={onClose} aria-label="Close documentation navigation"><X size={19} /></button></div>}
      <nav aria-label="Documentation">
        {DOC_GROUPS.map(group => (
          <div key={group} className={styles.navGroup}>
            <p>{group}</p>
            {DOC_PAGES.filter(page => page.group === group).map(page => (
              <a key={page.id} href={page.id === "quickstart" ? "/docs" : "/docs?guide=" + page.id} aria-current={activeId === page.id ? "page" : undefined} onClick={event => {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                event.preventDefault(); onNavigate(page.id); onClose?.();
              }}>{page.title}</a>
            ))}
          </div>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <p>Ready to connect your form?</p>
        <Link navigation href="/dashboard/forms">Open Forms & APIs <ArrowUpRight size={14} /></Link>
      </div>
    </div>
  );
}
