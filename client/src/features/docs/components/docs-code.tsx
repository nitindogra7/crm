"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { DocCode } from "../data/docs-data";
import styles from "./docs.module.css";

export function DocsCode({ code }: { code: DocCode }) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.value);
      setFeedback("copied");
    } catch {
      setFeedback("error");
    }
  }

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{code.filename}<span className={styles.language}>{code.language}</span></span>
        <button type="button" onClick={copy} aria-label={"Copy " + code.filename}>
          {feedback === "copied" ? <Check size={14} /> : <Copy size={14} />}
          <span>{feedback === "copied" ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre tabIndex={0} aria-label={code.filename}><code>{code.value}</code></pre>
      <span className="sr-only" role="status">{feedback === "copied" ? "Code copied to clipboard" : ""}</span>
      {feedback === "error" && <p role="alert" className={styles.copyError}>Could not copy. Select the code and copy it manually.</p>}
    </div>
  );
}
