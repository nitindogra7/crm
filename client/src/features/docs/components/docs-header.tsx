"use client";

import { useEffect, useRef } from "react";
import { Brand } from "@/shared/components/brand";
import Link from "@/shared/components/app-link";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import styles from "./docs.module.css";

interface DocsHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onOpenMenu: () => void;
  onHome: () => void;
}

export function DocsHeader({ searchQuery, onSearch, onOpenMenu, onHome }: DocsHeaderProps) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editing = target.matches('input, textarea, select, [contenteditable="true"]');
      if ((event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !editing)) {
        event.preventDefault();
        input.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === input.current) {
        onSearch("");
        input.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onSearch]);

  return (
    <header className={styles.header}>
      <div className={styles.headerBrand}>
        <button type="button" className={styles.menuButton} onClick={onOpenMenu} aria-label="Open documentation navigation"><Menu size={19} /></button>
        <Brand />
        <span className={styles.brandDivider}>/</span>
        <Link href="/docs" className={styles.docsLabel} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onHome(); }}>Docs</Link>
      </div>
      <div className={styles.search}>
        <Search size={16} aria-hidden="true" />
        <input ref={input} type="search" aria-label="Search documentation" placeholder="Search documentation..." value={searchQuery} onChange={event => onSearch(event.target.value)} />
        {searchQuery ? <button type="button" onClick={() => onSearch("")} aria-label="Clear search"><X size={15} /></button> : <kbd>Ctrl K</kbd>}
      </div>
      <Link navigation href="/dashboard" className={styles.dashboardLink}>Dashboard <ArrowUpRight size={15} /></Link>
    </header>
  );
}
