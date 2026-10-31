"use client";

import { ArrowRight, Search } from "lucide-react";
import { DOC_PAGES } from "../data/docs-data";
import styles from "./docs.module.css";

export function DocsHubView({ query, onNavigate, onClear }: { query: string; onNavigate: (id: string) => void; onClear: () => void }) {
  const terms = query.toLowerCase().trim().split(/\s+/);
  const matches = DOC_PAGES.filter(page => {
    const text = [page.title, page.description, ...page.sections.flatMap(section => [section.title, ...(section.paragraphs || []), ...(section.table?.rows.flat() || [])])].join(" ").toLowerCase();
    return terms.every(term => text.includes(term));
  });

  return <div className={styles.searchResults}><p className={styles.eyebrow}>Search documentation</p><h1>Results for &ldquo;{query}&rdquo;</h1><p role="status">{matches.length} {matches.length === 1 ? "guide" : "guides"} found</p>{matches.length ? <div className={styles.resultList}>{matches.map(page => <a href={"/docs?guide=" + page.id} key={page.id} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate(page.id); }}><span className={styles.eyebrow}>{page.group}</span><h2>{page.title}<ArrowRight size={17} /></h2><p>{page.description}</p></a>)}</div> : <div className={styles.noResults}><Search size={23} /><h2>No guides match your search</h2><p>Try a term such as forms, origins, API keys, or errors.</p><button type="button" onClick={onClear}>Clear search</button></div>}</div>;
}
