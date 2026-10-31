"use client";

import { ArrowLeft, ArrowRight, Hash } from "lucide-react";
import type { DocPage } from "../data/docs-data";
import { DOC_PAGES } from "../data/docs-data";
import { DocsCode } from "./docs-code";
import styles from "./docs.module.css";

interface DocsGuideViewProps {
  page: DocPage;
  onNavigate: (id: string) => void;
  onSection: (id: string) => void;
}

export function DocsGuideView({ page, onNavigate, onSection }: DocsGuideViewProps) {
  const index = DOC_PAGES.findIndex(item => item.id === page.id);
  const previous = DOC_PAGES[index - 1];
  const next = DOC_PAGES[index + 1];

  return (
    <div className={styles.readingLayout}>
      <article className={styles.article} aria-labelledby="doc-title">
        <header className={styles.articleHeader}>
          <div className={styles.breadcrumb}><span>Documentation</span><span>/</span><span>{page.group}</span></div>
          <h1 id="doc-title">{page.title}</h1>
          <p>{page.description}</p>
        </header>
        {page.sections.map(section => (
          <section id={section.id} key={section.id} className={styles.section} aria-labelledby={section.id + "-title"}>
            <h2 id={section.id + "-title"}>
              <a href={"#" + section.id} onClick={event => { event.preventDefault(); onSection(section.id); }}>{section.title}<Hash size={16} aria-hidden="true" /></a>
            </h2>
            {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.steps && <ol className={styles.steps}>{section.steps.map((step, stepIndex) => <li key={step.title}><span className={styles.stepNumber}>{stepIndex + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>}
            {section.code && <DocsCode key={page.id + section.id} code={section.code} />}
            {section.table && <div className={styles.tableWrap} tabIndex={0} aria-label={section.title + " table"}><table><caption className="sr-only">{section.title}</caption><thead><tr>{section.table.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cellIndex === 0 ? <code>{cell}</code> : cell}</td>)}</tr>)}</tbody></table></div>}
            {section.callout && <aside className={section.callout.tone === "warning" ? styles.warning : styles.note}><h3>{section.callout.title}</h3><p>{section.callout.text}</p></aside>}
          </section>
        ))}
        <footer className={styles.pageFooter}>
          {previous ? <a href={"/docs?guide=" + previous.id} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate(previous.id); }}><span><ArrowLeft size={14} /> Previous</span><strong>{previous.title}</strong></a> : <span />}
          {next && <a href={"/docs?guide=" + next.id} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate(next.id); }}><span>Next <ArrowRight size={14} /></span><strong>{next.title}</strong></a>}
        </footer>
        <p className={styles.articleEnd}>Infraly documentation</p>
      </article>
      <aside className={styles.toc} aria-label="On this page"><p>On this page</p><nav>{page.sections.map(section => <a key={section.id} href={"#" + section.id} onClick={event => { event.preventDefault(); onSection(section.id); }}>{section.title}</a>)}</nav></aside>
    </div>
  );
}
