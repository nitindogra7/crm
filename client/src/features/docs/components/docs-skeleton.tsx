import styles from "./docs.module.css";

export function DocsSkeleton() {
  return <div className={styles.shell} role="status" aria-label="Loading documentation"><div className={styles.header}><span className={styles.brand}>infraly <span className={styles.docsLabel}>/ Docs</span></span></div><aside className={styles.sidebar} aria-hidden="true"><div className={styles.sidebarContent}>{Array.from({ length: 9 }, (_, index) => <div key={index} className={styles.skeletonLine} />)}</div></aside><main className={styles.main}><div className={styles.readingLayout}><div aria-hidden="true"><div className={styles.skeletonLine} style={{ height: "2rem", width: "55%", marginBottom: "2rem" }} />{Array.from({ length: 7 }, (_, index) => <div key={index} className={styles.skeletonLine} />)}</div></div></main><span className="sr-only">Loading documentation...</span></div>;
}
