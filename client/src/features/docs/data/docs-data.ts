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
  agentPrompt?: boolean;
  collapsible?: boolean;
  links?: { title: string; description: string; href: string }[];
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
    "id": "quickstart",
    "title": "Your first lead, in 3 steps",
    "group": "Start here",
    "description": "Send website enquiries straight to your Infraly inbox.",
    "sections": [
      {
        "id": "how-it-works",
        "title": "A simple journey",
        "steps": [
          {
            "title": "Your website",
            "description": "A visitor sends a message."
          },
          {
            "title": "Infraly",
            "description": "We receive the details."
          },
          {
            "title": "Your inbox",
            "description": "You follow up in Leads."
          }
        ]
      },
      {
        "id": "create-a-form",
        "title": "1. Create a form",
        "paragraphs": [
          "Open Forms & APIs, click Create form, and choose Development for testing. Copy the form URL."
        ],
        "links": [
          {
            "title": "Create a form",
            "description": "In your dashboard",
            "href": "/dashboard/forms"
          }
        ]
      },
      {
        "id": "send-a-submission",
        "title": "2. Connect your website",
        "paragraphs": [
          "Give that URL to your AI assistant or website designer. It tells your form where to send messages."
        ],
        "links": [
          {
            "title": "Use the AI prompt",
            "description": "Paste your URL. Copy. Done.",
            "href": "/docs?guide=ai-agent"
          }
        ]
      },
      {
        "id": "check-your-inbox",
        "title": "3. Send a test",
        "paragraphs": [
          "Send one message from your website. Open Leads in Development and refresh. Missing? Check Spam Shield."
        ],
        "links": [
          {
            "title": "Open Leads",
            "description": "Find your test message",
            "href": "/dashboard/leads"
          }
        ]
      },
      {
        "id": "choose-your-path",
        "title": "Another way to connect?",
        "links": [
          {
            "title": "Website builder",
            "description": "For visual website editors",
            "href": "/docs?guide=website-builders"
          },
          {
            "title": "Write your own code",
            "description": "Copy the HTML example",
            "href": "/docs?guide=html"
          }
        ]
      },
      {
        "id": "go-live",
        "title": "Ready for real visitors?",
        "collapsible": true,
        "steps": [
          {
            "title": "Add your website address",
            "description": "Settings > Environments & Origins. Save an address like https://example.com, without a page path."
          },
          {
            "title": "Use a Production form",
            "description": "Create a form with Production selected. Replace the test URL on your live website with its URL."
          },
          {
            "title": "Check one live message",
            "description": "Publish your website, send a test, and look in Leads with Production selected."
          }
        ],
        "links": [
          {
            "title": "Open website settings",
            "description": "Add your live website address",
            "href": "/dashboard/settings?tab=origins"
          }
        ]
      },
      {
        "id": "need-help",
        "title": "Need a hand?",
        "links": [
          {
            "title": "Something isn?t working",
            "description": "Quick fixes",
            "href": "/docs?guide=troubleshooting"
          },
          {
            "title": "What does that word mean?",
            "description": "Simple definitions",
            "href": "/docs?guide=glossary"
          }
        ]
      }
    ]
  },
  {
    "id": "ai-agent",
    "title": "Let AI connect your form",
    "group": "Start here",
    "description": "Paste your form URL. Copy the prompt. Give it to your website?s AI assistant.",
    "sections": [
      {
        "id": "before-you-prompt",
        "title": "1. Copy your form URL",
        "paragraphs": [
          "Find it on your form card in Forms & APIs. Use a Development form while testing."
        ],
        "links": [
          {
            "title": "Find my form URL",
            "description": "Open Forms & APIs",
            "href": "/dashboard/forms"
          }
        ]
      },
      {
        "id": "copy-your-prompt",
        "title": "2. Get your prompt",
        "agentPrompt": true
      },
      {
        "id": "after-the-ai-finishes",
        "title": "3. Let your assistant do the work",
        "paragraphs": [
          "Paste the prompt into the AI tool that can edit your website. When it finishes, send a test and check Leads in the same environment."
        ],
        "links": [
          {
            "title": "Ready to go live?",
            "description": "Follow the launch checklist",
            "href": "/docs#go-live"
          }
        ]
      },
      {
        "id": "ai-cannot-connect",
        "title": "The AI needs help?",
        "collapsible": true,
        "paragraphs": [
          "Share the exact error message with your assistant. Tell it which environment you used and whether you checked Spam Shield."
        ],
        "links": [
          {
            "title": "Find a fix",
            "description": "Common connection problems",
            "href": "/docs?guide=troubleshooting"
          }
        ]
      }
    ]
  },
  {
    "id": "website-builders",
    "title": "Using a website builder?",
    "group": "Integrations",
    "description": "You need a form that can send messages to a custom URL.",
    "sections": [
      {
        "id": "check-your-builder",
        "title": "Check your form settings",
        "paragraphs": [
          "Look for ?form action? or ?custom HTML? in your website editor. If you cannot find either, ask your designer or builder?s support team."
        ]
      },
      {
        "id": "connect-builder",
        "title": "Choose your option",
        "links": [
          {
            "title": "I can add custom HTML",
            "description": "Copy the example and replace its form URL.",
            "href": "/docs?guide=html"
          },
          {
            "title": "My designer will handle it",
            "description": "Give them the short brief below.",
            "href": "/docs?guide=website-builders#designer-handoff"
          },
          {
            "title": "I need a server connection",
            "description": "Technical setup for your developer.",
            "href": "/docs?guide=server"
          }
        ]
      },
      {
        "id": "designer-handoff",
        "title": "Copy a brief for your designer",
        "code": {
          "language": "text",
          "filename": "Designer brief",
          "value": "Connect my website contact form to Infraly using the public form URL I provide.\n\nSend name, email, and message with POST using JSON or URL-encoded data. No public API key is needed. Keep my current design and add clear sending, success, and error feedback. File uploads are not supported.\n\nTreat HTTP 200 with status success as a lead; HTTP 202 with status quarantined means review in Spam Shield. Avoid automatic retries or duplicate clicks.\n\nHelp me check a test in Leads in the matching environment. Before launch, configure the Production website origin and use a Production form URL."
        }
      },
      {
        "id": "builder-test",
        "title": "Check it works",
        "paragraphs": [
          "Send a message from your website. Refresh Leads in the matching environment. Check Spam Shield if it is missing."
        ]
      }
    ]
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
  "id": "glossary",
  "title": "Words explained",
  "group": "Reference",
  "description": "The terms you will see in Infraly, explained in everyday language.",
  "sections": [
    {
      "id": "everyday-definitions",
      "title": "What these words mean",
      "table": {
        "columns": [
          "Word",
          "Meaning"
        ],
        "rows": [
          [
            "Lead",
            "A person who has contacted your business. Their submitted details appear in Leads."
          ],
          [
            "Form URL / endpoint",
            "The receiving address your website sends form details to. Copy it from a form card in Forms & APIs. Opening it like a normal web page does not submit a message."
          ],
          [
            "Workspace",
            "A space for one business or project, containing its forms, leads, and settings."
          ],
          [
            "Submission",
            "One set of details sent through a form, such as a name, email, and message."
          ],
          [
            "Development",
            "The environment for testing. Messages here stay separate from your live leads."
          ],
          [
            "Production",
            "The environment for real visitors on your published website."
          ],
          [
            "Origin",
            "Your website address including https:// and any port, without a page path. For example, https://example.com."
          ],
          [
            "API key",
            "A secret used by a server integration. A direct public website form does not need one."
          ],
          [
            "Spam Shield / quarantine",
            "A review area for messages flagged by spam checks. Rescue a legitimate message to move it to Leads."
          ],
          [
            "POST",
            "The request method a form uses to send details to its receiving address."
          ],
          [
            "JSON",
            "A text format code can use to send details as named values, such as email and message."
          ],
          [
            "Redirect / thank-you page",
            "A page visitors are taken to after sending a form."
          ],
          [
            "CORS",
            "Browser rules about sending data between website addresses. A blocked request may mean the live website address needs to be allowed."
          ]
        ]
      }
    },
    {
      "id": "back-to-setup",
      "title": "Ready to try it?",
      "links": [
        {
          "title": "Start the setup guide",
          "description": "Create a form, connect your website, and find your first message.",
          "href": "/docs"
        }
      ]
    }
  ]
},
  {
    "id": "troubleshooting",
    "title": "Quick fixes",
    "group": "Reference",
    "description": "Choose the problem you see.",
    "sections": [
      {
        "id": "missing-lead",
        "title": "My message is missing",
        "paragraphs": [
          "Select the same workspace and environment as your form, then refresh Leads. Still missing? Check Spam Shield and rescue the message if it is legitimate."
        ]
      },
      {
        "id": "forbidden",
        "title": "The form says blocked or forbidden",
        "paragraphs": [
          "Check the form is Active in Forms & APIs. For a live site, save its exact website address in Settings > Environments & Origins, including https:// and www if used."
        ]
      },
      {
        "id": "payload-format",
        "title": "Some details are empty",
        "paragraphs": [
          "Ask your designer or AI assistant to check the field names are name, email, and message. File uploads are not supported."
        ]
      },
      {
        "id": "redirects",
        "title": "My thank-you page does not open",
        "paragraphs": [
          "Save the full thank-you page URL in the form settings. If the form uses JavaScript, ask your designer to open that page after a successful response."
        ]
      },
      {
        "id": "duplicate-submissions",
        "title": "I see the same message twice",
        "paragraphs": [
          "Ask your designer to disable Send while the form is sending and remove automatic retries. A slow request may already have saved the message."
        ]
      }
    ]
  },
];

export const DOC_GROUPS = ["Start here", "Integrations", "Reference"] as const;

// Preserve older guide links while moving to the verified reference structure.
export const GUIDE_ALIASES: Record<string, string> = {
  nextjs: "react", vue: "html", nuxt: "html", svelte: "html", angular: "html",
  webflow: "html", framer: "html", wordpress: "html", python: "server",
  nodejs: "server", curl: "server", honeypot: "spam", checklist: "fields",
  architecture: "quickstart", "status-codes": "responses", cors: "environments",
  nocode: "website-builders", ai: "ai-agent", faq: "troubleshooting",
};

export function findDocPage(id: string | null): DocPage | undefined {
  const target = id ? GUIDE_ALIASES[id] || id : "quickstart";
  return DOC_PAGES.find(page => page.id === target);
}
