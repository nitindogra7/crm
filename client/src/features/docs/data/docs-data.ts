export interface DocCode {
  language: string;
  filename: string;
  value: string;
}

export interface DocSection {
  id: string;
  title: string;
  paragraphs?: string[];
  steps?: { title: string; description: string }[];
  code?: DocCode;
  table?: { columns: string[]; rows: string[][] };
  callout?: { title: string; text: string; tone?: "note" | "warning" };
}

export interface DocPage {
  id: string;
  title: string;
  description: string;
  group: "Start here" | "Integrations" | "Reference";
  sections: DocSection[];
}

// Use the same configured backend as the dashboard. Do not assume a hosted API domain.
export const DOCS_API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");
export const PUBLIC_FORM_PATH = "/api/forms-and-api/f/YOUR_FORM_SLUG";
export const PUBLIC_FORM_URL = DOCS_API_BASE + PUBLIC_FORM_PATH;

export const DOC_PAGES: DocPage[] = [
  {
    id: "quickstart", title: "Get started", group: "Start here",
    description: "Connect a form to Infraly, send a submission, and find it in your lead inbox.",
    sections: [
      { id: "create-a-form", title: "1. Create your endpoint", steps: [
        { title: "Open Forms & APIs", description: "Choose your workspace and select Development while you build your integration." },
        { title: "Create a form", description: "Give it a name, review the fields, and create the endpoint. The form belongs to the environment you choose." },
        { title: "Copy the endpoint URL", description: "Copy the URL from the form card or its integration tab. Use that exact URL in place of YOUR_FORM_SLUG in these examples." },
      ] },
      { id: "send-a-submission", title: "2. Send a test submission", paragraphs: ["A public form endpoint accepts POST requests without a dashboard login or an API key. Start with an email address you control. Send JSON for API clients or URL-encoded data for a native HTML form."], code: {
        language: "bash", filename: "Terminal", value: "curl --request POST \"" + PUBLIC_FORM_URL + "\" \\\n  --header \"Content-Type: application/json\" \\\n  --header \"Accept: application/json\" \\\n  --data '{\"name\":\"Alex Rivera\",\"email\":\"alex@example.com\",\"message\":\"Hello from my website\"}'",
      }, callout: { title: "Use your copied endpoint", text: "The examples use the backend URL configured for this app. Your form endpoint in Forms & APIs is the source of truth for the host and slug." } },
      { id: "check-your-inbox", title: "3. Check the result", paragraphs: ["A clean JSON submission returns HTTP 200 with status set to success. Open Leads in the same workspace and environment to inspect it. If the response is HTTP 202 with status quarantined, inspect Spam Shield instead.", "The dashboard does not subscribe to a live submission stream. Refresh the page if a submission sent from your website is not visible yet."] },
      { id: "go-live", title: "4. Move to production", paragraphs: ["Configure your website origin in Settings, under Environments & Origins. Create or choose a Production form and copy its endpoint into your deployed site. Development and Production forms keep their submissions separate."] },
    ],
  },
  {
    id: "html", title: "HTML forms", group: "Integrations",
    description: "Submit directly from your website with a standard HTML form and no client-side JavaScript.",
    sections: [
      { id: "form-markup", title: "Add the form", paragraphs: ["Set method to POST and action to your copied form endpoint. The browser sends application/x-www-form-urlencoded by default. Field names determine how values appear in the lead record."], code: {
        language: "html", filename: "contact.html", value: "<form action=\"" + PUBLIC_FORM_URL + "\" method=\"POST\">\n  <label for=\"name\">Name</label>\n  <input id=\"name\" name=\"name\" autocomplete=\"name\" required />\n\n  <label for=\"email\">Email</label>\n  <input id=\"email\" name=\"email\" type=\"email\"\n         autocomplete=\"email\" required />\n\n  <label for=\"message\">Message</label>\n  <textarea id=\"message\" name=\"message\" required></textarea>\n\n  <input type=\"text\" name=\"_gotcha\" tabindex=\"-1\"\n         autocomplete=\"off\" hidden />\n\n  <button type=\"submit\">Send message</button>\n</form>",
      } },
      { id: "after-submission", title: "Choose what happens next", paragraphs: ["Without a redirect, a successful native browser submission displays the API confirmation page. To use your own thank-you page, open the form details and save a Redirect URL before publishing.", "The redirect is configured on the form. A hidden _next input does not control redirects in the current API. Use a full HTTPS URL for a thank-you page hosted on your website; a relative redirect is resolved against the API host."], callout: { title: "Inspect quarantined submissions", text: "A configured HTML redirect may also be used after quarantine. A thank-you redirect alone does not prove the submission was added to Leads; check Leads or Spam Shield." } },
      { id: "supported-encoding", title: "Supported request formats", paragraphs: ["Use the default URL-encoded form submission or send JSON with JavaScript. The current server does not parse multipart uploads, so file uploads and forms with enctype=multipart/form-data are not supported."], table: { columns: ["Content type", "Use"], rows: [["application/x-www-form-urlencoded", "Native HTML forms"], ["application/json", "JavaScript and server integrations"], ["multipart/form-data", "Not supported"]] } },
    ],
  },
  {
    id: "react", title: "React & JavaScript", group: "Integrations",
    description: "Keep visitors on your page and handle accepted, quarantined, and failed submissions explicitly.",
    sections: [
      { id: "submit-with-fetch", title: "Submit with fetch", paragraphs: ["This React example also works in a Next.js client component. Replace the endpoint with the URL copied from Forms & APIs. Public browser forms do not need a secret API key."], code: {
        language: "tsx", filename: "ContactForm.tsx", value: "\"use client\";\n\nimport { useState, type FormEvent } from \"react\";\n\nexport function ContactForm() {\n  const [sending, setSending] = useState(false);\n  const [feedback, setFeedback] = useState(\"\");\n\n  async function submit(event: FormEvent<HTMLFormElement>) {\n    event.preventDefault();\n    if (sending) return;\n    const form = event.currentTarget;\n    const values = new FormData(form);\n    setSending(true);\n    setFeedback(\"\");\n\n    try {\n      const response = await fetch(\"" + PUBLIC_FORM_URL + "\", {\n        method: \"POST\",\n        headers: {\n          \"Content-Type\": \"application/json\",\n          Accept: \"application/json\",\n        },\n        body: JSON.stringify(Object.fromEntries(values)),\n        signal: AbortSignal.timeout(15000),\n      });\n      const result = await response.json();\n\n      if (response.status === 202 && result.status === \"quarantined\") {\n        setFeedback(\"Your message was received for review.\");\n        form.reset();\n      } else if (response.ok && result.status === \"success\") {\n        setFeedback(\"Thanks! Your message has been sent.\");\n        form.reset();\n      } else {\n        throw new Error(result.message || result.error || \"Please try again.\");\n      }\n    } catch (error) {\n      setFeedback(error instanceof Error ? error.message : \"Please try again.\");\n    } finally {\n      setSending(false);\n    }\n  }\n\n  return (\n    <form onSubmit={submit}>\n      <label>Name <input name=\"name\" required /></label>\n      <label>Email <input name=\"email\" type=\"email\" required /></label>\n      <label>Message <textarea name=\"message\" required /></label>\n      <input name=\"_gotcha\" hidden tabIndex={-1} autoComplete=\"off\" />\n      <button disabled={sending}>{sending ? \"Sending...\" : \"Send\"}</button>\n      <p role=\"status\">{feedback}</p>\n    </form>\n  );\n}",
      } },
      { id: "handle-the-response", title: "Handle the response status", paragraphs: ["HTTP 202 is a successful HTTP response, so response.ok is true. It means the submission was quarantined, not added to Leads. Check the status field as well as response.ok.", "JSON requests receive JSON even if the form has a Redirect URL. Navigate to a thank-you page in your application after you confirm the result."], callout: { title: "A timeout may still have saved the submission", text: "Requests are not deduplicated. After a connection failure, inspect the inbox before retrying automatically to avoid duplicate leads.", tone: "warning" } },
      { id: "other-frameworks", title: "Use another frontend", paragraphs: ["The endpoint is framework-independent. Use the same POST URL, headers, fields, and response handling from Vue, Svelte, Angular, or plain JavaScript. No Infraly frontend SDK is required."] },
    ],
  },
  {
    id: "server", title: "Server integrations", group: "Integrations",
    description: "Send submissions from a backend with an environment-specific API key.",
    sections: [
      { id: "create-a-key", title: "Create an API key", paragraphs: ["Open Forms & APIs, switch to the intended environment, and select the API Key tab. Generate a key and store it in a server environment variable. A key belongs to one workspace and environment.", "Use x-api-key for submission authentication. Never embed a workspace API key in a public HTML form or frontend bundle."], callout: { title: "Management requests use dashboard authentication", text: "Submission API keys do not grant access to private dashboard management routes. Those routes use Clerk authentication." } },
      { id: "send-from-your-server", title: "Send from your server", paragraphs: ["POST to /api/v1/leads with a key to create an unassigned lead in the key's workspace. Include formSlug if the submission should belong to a particular form. The form and key must belong to the same workspace and environment."], code: {
        language: "bash", filename: "Terminal", value: "curl --request POST \"" + DOCS_API_BASE + "/api/v1/leads\" \\\n  --header \"Content-Type: application/json\" \\\n  --header \"x-api-key: $INFRALY_API_KEY\" \\\n  --data '{\"formSlug\":\"YOUR_FORM_SLUG\",\"name\":\"Alex Rivera\",\"email\":\"alex@example.com\",\"message\":\"Sent from my server\"}'",
      } },
      { id: "production-keys", title: "Production requests", paragraphs: ["Production workspaces require a configured Production Origin, including for server-to-server requests. A valid matching API key allows server requests that do not send Origin or Referer. If either header is sent, its value must match an allowed origin.", "A key authenticated response can include leadId or spamId. Anonymous public form responses omit these internal identifiers."] },
      { id: "rotate-a-key", title: "Rotate a key", paragraphs: ["Regenerating a key invalidates the previous key. Update your server environment variable and redeploy your integration. Revoking a key prevents future requests using that key; existing lead records remain."] },
    ],
  },
  {
    id: "fields", title: "Fields & payloads", group: "Reference",
    description: "Understand core fields, custom values, and the difference between a form definition and submission validation.",
    sections: [
      { id: "core-fields", title: "Core submission fields", table: { columns: ["Field", "Behavior"], rows: [["email", "Use a valid email address. Missing or malformed addresses are quarantined."], ["name", "Contact name. Falls back to Anonymous Contact when absent."], ["message", "Submission text. Defaults to an empty string."], ["source", "Optional attribution label; otherwise inferred from the request."], ["_gotcha", "Optional honeypot. Keep this field empty."], ["formSlug / formId", "Optional routing fields for /api/v1/leads with an API key."]] } },
      { id: "custom-values", title: "Add custom fields", paragraphs: ["Send additional top-level properties such as company, budget, or projectType. Non-empty values that are not reserved fields are stored in the lead's extraFields. Objects and arrays are serialized to strings."], code: { language: "json", filename: "Request body", value: "{\n  \"name\": \"Alex Rivera\",\n  \"email\": \"alex@example.com\",\n  \"message\": \"I would like a quote\",\n  \"company\": \"Rivera Studio\",\n  \"budget\": \"5000\",\n  \"projectType\": \"Website\"\n}" } },
      { id: "field-definitions", title: "Form field definitions", paragraphs: ["The dashboard can describe text, email, textarea, tel, and number fields, including a required flag. These definitions help you build your form. The current public ingestion handler does not enforce that entire configured schema.", "Use native browser validation and validate untrusted input in any server integration you own. The ingestion handler separately checks email format and spam signals."] },
      { id: "request-size", title: "Request limits", paragraphs: ["JSON and URL-encoded request bodies are limited to 1 MB. Oversized requests receive HTTP 413. The public submission API does not accept file attachments."] },
    ],
  },
  {
    id: "environments", title: "Environments & origins", group: "Reference",
    description: "Keep test data separate and configure which websites can submit to production endpoints.",
    sections: [
      { id: "development", title: "Development", paragraphs: ["Development submissions are stored separately from Production submissions. Public development endpoints allow cross-origin browser requests. An explicitly configured per-form Allowed Domains list still restricts unkeyed submissions.", "Switching the dashboard environment changes which records you inspect. Each form retains its own environment; use the endpoint for the form you intend to submit to."] },
      { id: "production", title: "Production", paragraphs: ["Open Settings > Environments & Origins and save your website origin, such as https://example.com. Production submissions are rejected until a Production Origin is configured.", "Browser submissions must send a matching Origin or Referer. The backend accepts the workspace production origin, workspace additional allowed origins, or the target form's Allowed Domains."] },
      { id: "matching-rules", title: "Origin matching rules", table: { columns: ["Configured value", "Matches"], rows: [["https://example.com", "That exact scheme, hostname, and port. Does not automatically include subdomains."], ["example.com", "The hostname and its subdomains, where a hostname allowlist is supported."], ["*.example.com", "The root hostname and its subdomains."], ["http://localhost:3000", "That exact local origin. Another port is a different origin."]] }, callout: { title: "Use an origin, not a page URL", text: "The browser origin is scheme + hostname + port. The path /contact does not distinguish one browser origin from another." } },
      { id: "debug-cors", title: "Debug an origin error", paragraphs: ["Check the exact Origin header in your browser's Network panel, then compare it with the saved workspace origin. Confirm that the form and API key use the intended environment. A production key does not bypass an explicit mismatched Origin header."] },
    ],
  },
  {
    id: "spam", title: "Spam protection", group: "Reference",
    description: "Understand which submissions are quarantined and how to review legitimate messages.",
    sections: [
      { id: "honeypot", title: "Add a honeypot", paragraphs: ["Include an empty _gotcha input hidden from visitors. A filled honeypot causes the submission to be quarantined. The handler also recognizes _hp, honeypot, website_url_check, and bot_field."], code: { language: "html", filename: "contact.html", value: "<input type=\"text\" name=\"_gotcha\" hidden\n       tabindex=\"-1\" autocomplete=\"off\" />" } },
      { id: "other-checks", title: "Other quarantine checks", paragraphs: ["The handler checks for missing or malformed email addresses and a small configured list of disposable email domains. An optional client timestamp in _form_time, _timestamp, or _render_time can flag a submission made less than 1.2 seconds after rendering.", "These are heuristic checks. They do not guarantee that all spam is detected or all legitimate submissions are accepted."], callout: { title: "A quarantined request is not an API failure", text: "JSON responses use HTTP 202 and status quarantined. Do not repeatedly retry the same payload; review it in Spam Shield." } },
      { id: "review-and-rescue", title: "Review and rescue", paragraphs: ["Open Spam Shield in the matching workspace and environment. Inspect the detection reason and payload. Rescue a legitimate submission to move it to Leads with status New."] },
      { id: "rate-limits", title: "Submission rate limits", table: { columns: ["Limit", "Scope"], rows: [["6 requests per 10 seconds", "Burst limit per client IP"], ["30 requests per 15 minutes", "Sustained limit per client IP"]] }, paragraphs: ["Exceeding either limit returns HTTP 429. Wait before retrying, and do not put automatic retry loops on public forms. These are the current non-test server limits."] },
    ],
  },
  {
    id: "responses", title: "Responses & errors", group: "Reference",
    description: "Reference for JSON submission responses and the steps to take when a request is rejected.",
    sections: [
      { id: "accepted-response", title: "Accepted submission", code: { language: "json", filename: "HTTP 200", value: "{\n  \"success\": true,\n  \"status\": \"success\",\n  \"statusCode\": 200,\n  \"message\": \"Lead captured successfully\"\n}" }, paragraphs: ["Authenticated submissions may also include leadId. A configured redirectUrl may appear when the target form has one. Public anonymous responses omit internal record identifiers."] },
      { id: "quarantined-response", title: "Quarantined submission", code: { language: "json", filename: "HTTP 202", value: "{\n  \"success\": false,\n  \"status\": \"quarantined\",\n  \"statusCode\": 202,\n  \"message\": \"Submission received and quarantined for security inspection\"\n}" }, paragraphs: ["The request was received but flagged for review. Inspect Spam Shield instead of treating HTTP 202 as a clean lead. An authenticated response may include spamId."] },
      { id: "status-codes", title: "Status code reference", table: { columns: ["Code", "Meaning", "What to check"], rows: [["200", "Accepted", "The lead is stored in the target environment."], ["202", "Quarantined", "Review the submission in Spam Shield."], ["400", "Invalid request", "Check that the body is valid JSON or URL-encoded data."], ["401", "Invalid API key", "Check for a mistyped or revoked submission key."], ["403", "Submission rejected", "Check paused forms, origin rules, workspace ownership, and key environment."], ["404", "Target not found", "Copy the current form endpoint again; verify its ID or slug."], ["405", "Wrong method", "Use POST on /api/v1/leads."], ["413", "Body too large", "Reduce the request body below 1 MB."], ["429", "Rate limited", "Wait before sending another request."], ["500", "Server error", "Check server health and logs before retrying."]] } },
      { id: "error-body", title: "Read the response body", paragraphs: ["Error responses can contain message, error, or both. Show a useful message to the visitor and keep the HTTP status available in your server logs. CORS failures may prevent browser JavaScript from reading the response; inspect the Network panel."] },
    ],
  },
  {
    id: "troubleshooting", title: "Troubleshooting", group: "Reference",
    description: "Work through common integration problems with concrete checks.",
    sections: [
      { id: "missing-lead", title: "My submission is missing", steps: [
        { title: "Inspect the HTTP response", description: "Confirm the request was actually sent. HTTP 200 with status success indicates a clean submission; HTTP 202 means quarantine." },
        { title: "Check the workspace and environment", description: "The endpoint belongs to one form and environment. Select the same workspace and environment in the dashboard." },
        { title: "Refresh the inbox", description: "Refresh after an external submission. Open Spam Shield if the message is not in Leads." },
      ] },
      { id: "forbidden", title: "My request returns 403", paragraphs: ["Make sure the form is enabled. In Production, save the Production Origin and verify the browser Origin matches it. For keyed requests, confirm that the API key and form belong to the same workspace and environment."] },
      { id: "payload-format", title: "My fields are empty", paragraphs: ["Use name, email, and message as the core field names. For JSON, send Content-Type: application/json and JSON.stringify your payload. For HTML, use method=POST and the default URL-encoded encoding. Do not submit multipart data or files."] },
      { id: "redirects", title: "My thank-you redirect is not working", paragraphs: ["Save the Redirect URL in the form details. _next is not used by the current ingestion handler. Fetch requests using JSON return JSON; handle navigation in your application after checking the response."] },
      { id: "duplicate-submissions", title: "I see duplicate leads", paragraphs: ["The submission API currently has no idempotency key or automatic deduplication. Disable your submit control while a request is pending and avoid blind retries after timeouts."] },
    ],
  },
];

export const DOC_GROUPS = ["Start here", "Integrations", "Reference"] as const;

// Preserve older guide links while moving to the verified reference structure.
export const GUIDE_ALIASES: Record<string, string> = {
  nextjs: "react", vue: "html", nuxt: "html", svelte: "html", angular: "html",
  webflow: "html", framer: "html", wordpress: "html", python: "server",
  nodejs: "server", curl: "server", honeypot: "spam", checklist: "fields",
  architecture: "quickstart", "status-codes": "responses", cors: "environments",
  nocode: "html", faq: "troubleshooting",
};

export function findDocPage(id: string | null): DocPage | undefined {
  const target = id ? GUIDE_ALIASES[id] || id : "quickstart";
  return DOC_PAGES.find(page => page.id === target);
}
