"use client";

import { useState } from "react";
import { DocsCode } from "./docs-code";
import styles from "./docs.module.css";

function isFormUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol)
      && !url.username && !url.password && !url.search && !url.hash
      && /^\/api\/forms-and-api\/f\/[^/]+\/?$/.test(url.pathname)
      && !/YOUR_FORM_SLUG/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function DocsAgentPrompt() {
  const [endpoint, setEndpoint] = useState("");
  const value = endpoint.trim();
  const valid = isFormUrl(value);
  const prompt = [
    "Connect the contact form in this website project to Infraly.",
    "Public form URL: " + value,
    "First inspect this project's framework, existing form, and styling. If you cannot access the project or edit the form, tell me what access or files you need. Preserve the existing design and unrelated features.",
    'Implementation requirements:\n1. Send name, email, and message to the exact public form URL above using POST. Preserve existing custom fields as additional top-level values. Do not invent a backend host or replace the form slug.\n2. Public browser submissions do not need an API key or dashboard login. Do not add secret keys to frontend code.\n3. For a native HTML form, use action and method="POST" with the default application/x-www-form-urlencoded encoding. For JavaScript, send JSON with Content-Type: application/json and Accept: application/json. Do not send multipart/form-data or file attachments.\n4. Use labelled fields and browser validation, including a required email input of type email. Include an empty hidden _gotcha honeypot with autocomplete off and tabIndex -1.\n5. With JavaScript, disable Send while submitting and provide accessible sending, success, review, and failure feedback. HTTP 200 with status "success" means added to Leads. HTTP 202 with status "quarantined" means received for review in Spam Shield; response.ok alone is insufficient. Handle message or error fields and network failures without losing the visitor\'s input.\n6. Do not automatically retry: a timeout may already have saved the message, and the API does not deduplicate. Rate limits return HTTP 429; wait before another attempt.\n7. For a native HTML thank-you redirect, use the form\'s saved Redirect URL; a hidden _next field is not supported. JSON requests return JSON, so handle navigation in the application after checking the result.',
    'Verification and handoff:\n- Run the relevant checks available in this project and list what you verified. Do not claim that delivery to my inbox was tested unless it was actually observed.\n- Ask me before sending a real submission; I will supply the test details. Help me confirm it in Leads in the same workspace and environment, refreshing first and checking Spam Shield if needed.\n- Before launch, remind me to save the Production origin under Settings > Environments & Origins, use the Production form URL on the published website, and test from that live website. Development and Production data are separate.\n- Summarise the files changed, any remaining setup, and how I can publish the website change in plain language.'
  ].join("\n\n");

  return (
    <div className={styles.promptBuilder}>
      <label htmlFor="agent-form-url">Your public form URL</label>
      <p id="agent-form-url-help">From your form card in Forms &amp; APIs. No API key needed.</p>
      <input
        id="agent-form-url"
        type="url"
        value={endpoint}
        onChange={event => setEndpoint(event.target.value)}
        placeholder="Paste your copied form URL"
        autoComplete="off"
        spellCheck={false}
        aria-describedby={value && !valid ? "agent-form-url-help agent-form-url-error" : "agent-form-url-help"}
        aria-invalid={Boolean(value && !valid)}
      />
      {value && !valid && <p id="agent-form-url-error" className={styles.promptError} role="status">That does not look like a form URL. Copy the full address from your form card.</p>}
      {valid ? <DocsCode key={value} code={{ language: "text", filename: "AI setup prompt", value: prompt }} /> : <p className={styles.promptHint}>Paste your URL above to unlock the copy button.</p>}
    </div>
  );
}
