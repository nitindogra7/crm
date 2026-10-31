"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DialogLayer } from "@/shared/components/dialog-layer";
import { DocsHeader } from "./docs-header";
import { DocsSidebar } from "./docs-sidebar";
import { DocsGuideView } from "./docs-guide-view";
import { DocsHubView } from "./docs-hub-view";
import { findDocPage } from "../data/docs-data";
import styles from "./docs.module.css";

export function DocsView() {
  const params = useSearchParams();
  const page = findDocPage(params.get("guide"));
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const search = useCallback((value: string) => setQuery(value), []);
  const navigate = useCallback((id: string) => {
    setQuery("");
    setMenuOpen(false);
    window.history.pushState(null, "", id === "quickstart" ? "/docs" : "/docs?guide=" + encodeURIComponent(id));
    main.current?.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let hash = "";
      try { hash = decodeURIComponent(window.location.hash.slice(1)); } catch { /* Ignore a malformed fragment. */ }
      const target = hash ? document.getElementById(hash) : null;
      if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
      else main.current?.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [page?.id, query]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  function section(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + encodeURIComponent(id));
  }

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">Skip to documentation</a>
      <DocsHeader searchQuery={query} onSearch={search} onOpenMenu={() => setMenuOpen(true)} onHome={() => navigate("quickstart")} />
      <aside className={styles.sidebar}><DocsSidebar activeId={page?.id} onNavigate={navigate} /></aside>
      {menuOpen && <DialogLayer label="Documentation navigation" onClose={() => setMenuOpen(false)} className={styles.mobileOverlay}><div className={styles.backdrop} aria-hidden="true" onClick={() => setMenuOpen(false)} /><aside className={styles.mobileSidebar}><DocsSidebar activeId={page?.id} onNavigate={navigate} onClose={() => setMenuOpen(false)} /></aside></DialogLayer>}
      <main ref={main} id="main-content" tabIndex={-1} className={styles.main}>
        {query.trim() ? <DocsHubView query={query.trim()} onNavigate={navigate} onClear={() => setQuery("")} /> : page ? <DocsGuideView page={page} onNavigate={navigate} onSection={section} /> : <div className={styles.notFound}><p className={styles.eyebrow}>Documentation</p><h1>Guide not found</h1><p>This guide may have moved. Choose a topic from the navigation, or start with the setup guide.</p><button type="button" onClick={() => navigate("quickstart")}>Get started</button></div>}
      </main>
    </div>
  );
}
