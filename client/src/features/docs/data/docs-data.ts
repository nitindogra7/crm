export interface DocRequirement {
  name: string;
  type: "mandatory" | "optional" | "recommended";
  description: string;
  example: string;
  whyNeeded: string;
}

export interface StatusCodeInfo {
  code: number;
  status: string;
  meaning: string;
  description: string;
  sampleResponse: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  callout?: {
    type: "note" | "tip" | "important" | "warning";
    text: string;
  };
  code?: {
    language: string;
    filename?: string;
    snippet: string;
  };
  tips?: string[];
}

export interface DetailedGuide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge?: string;
  icon: string;
  breadcrumbs: string[];
  agentPrompt: string;
  overview: string;
  steps: GuideStep[];
  tableOfContents: { id: string; label: string }[];
  nextGuide?: { id: string; title: string };
  prevGuide?: { id: string; title: string };
}

export interface FrameworkItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  category: "frontend" | "nocode" | "backend";
}

export interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  guideId?: string;
}

export interface OverviewSection {
  id: string;
  title: string;
  description: string;
  linkText?: string;
  linkGuideId?: string;
  cards: FeatureCardItem[];
}

export const DOCS_CONFIG = {
  version: "v1.4.0",
  lastUpdated: "October 2026",
  baseEndpointUrl: "https://api.infraly.com/api/forms-and-api/f",
  shortEndpointUrl: "https://api.infraly.com/api/f",
  apiCaptureUrl: "https://api.infraly.com/api/v1/leads",
};

export const FRAMEWORK_ITEMS: FrameworkItem[] = [
  { id: "react", name: "React", icon: "react", description: "Modern React with hooks and state", category: "frontend" },
  { id: "nextjs", name: "Next.js", icon: "nextjs", description: "App Router & Server Actions", category: "frontend" },
  { id: "vue", name: "Vue.js", icon: "vue", description: "Composition API script setup", category: "frontend" },
  { id: "nuxt", name: "Nuxt", icon: "nuxt", description: "Nuxt 3 full-stack hydration", category: "frontend" },
  { id: "svelte", name: "SvelteKit", icon: "svelte", description: "Reactive forms & actions", category: "frontend" },
  { id: "angular", name: "Angular", icon: "angular", description: "ReactiveFormsModule & HttpClient", category: "frontend" },
  { id: "html", name: "Plain HTML5", icon: "html", description: "Static HTML zero JavaScript", category: "frontend" },
  { id: "webflow", name: "Webflow", icon: "webflow", description: "Visual designer form block", category: "nocode" },
  { id: "framer", name: "Framer", icon: "framer", description: "Framer interactive form component", category: "nocode" },
  { id: "wordpress", name: "WordPress", icon: "wordpress", description: "Elementor & Contact Form 7", category: "nocode" },
  { id: "python", name: "Python", icon: "python", description: "Flask, FastAPI, Requests", category: "backend" },
  { id: "nodejs", name: "Node.js", icon: "nodejs", description: "Express, Fetch, Axios server", category: "backend" },
  { id: "curl", name: "cURL & REST", icon: "curl", description: "Direct HTTP terminal capture", category: "backend" },
];

export const CORE_PLATFORM_CARDS: FeatureCardItem[] = [
  {
    id: "endpoints",
    title: "Form Endpoints",
    description: "Instant public endpoint URLs for your forms. Point any form action to infraly with zero backend code.",
    icon: "zap",
    badge: "POST",
    guideId: "html",
  },
  {
    id: "honeypot",
    title: "Silent Honeypot",
    description: "Frictionless anti-spam trap. Quarantines 99% of spam bots silently without frustrating CAPTCHAs.",
    icon: "shield",
    badge: "Anti-Spam",
    guideId: "honeypot",
  },
  {
    id: "crm-pipeline",
    title: "Leads CRM Pipeline",
    description: "Ingestion engine with automatic deduplication, lead score calculation, and workspace status tracking.",
    icon: "database",
    badge: "Realtime",
    guideId: "architecture",
  },
  {
    id: "extra-fields",
    title: "Dynamic Extra Fields",
    description: "Capture budget, company, timeline, teamSize dynamically into JSON buckets without database schema changes.",
    icon: "database",
    guideId: "checklist",
  },
  {
    id: "redirects",
    title: "Custom Redirects",
    description: "Provide a seamless branded thank-you experience via _next redirects or structured JSON responses.",
    icon: "curl",
    guideId: "react",
  },
  {
    id: "rest-api",
    title: "REST API & Webhooks",
    description: "Headless lead ingestion via live API keys with automatic event dispatching to your team webhooks.",
    icon: "curl",
    badge: "v1/leads",
    guideId: "curl",
  },
];

export const SPAM_SECURITY_CARDS: FeatureCardItem[] = [
  {
    id: "disposable-email",
    title: "Disposable Email Quarantine",
    description: "Cross-checks submissions against 5,000+ temporary burner email domains and flags them automatically.",
    icon: "shield",
    guideId: "honeypot",
  },
  {
    id: "honeypot-trap",
    title: "Silent Honeypot Trap",
    description: "Invisible to real human visitors. Bots fill the hidden _gotcha input and get quarantined safely.",
    icon: "shield",
    guideId: "honeypot",
  },
  {
    id: "cors-protection",
    title: "CORS & Domain Rules",
    description: "Wildcard CORS support enabled for all form endpoints so you can test smoothly from localhost or production.",
    icon: "curl",
    guideId: "architecture",
  },
  {
    id: "rate-limiting",
    title: "Anti-Abuse Rate Limiting",
    description: "Automatic IP burst throttling protects your workspace from DDoS floods and automated scrapers.",
    icon: "zap",
    guideId: "status-codes",
  },
];

export const EXPLORE_MORE_CARDS: FeatureCardItem[] = [
  {
    id: "status-codes",
    title: "HTTP Status Codes Reference",
    description: "Complete guide to handling 200 (Success), 202 (Quarantined), 302 (Redirect), 401, 403, and 404 responses.",
    icon: "curl",
    guideId: "status-codes",
  },
  {
    id: "mandatory-checklist",
    title: "Mandatory vs Optional Checklist",
    description: "Strict guide on required form attributes (method, action, email, name) and optional enhancements.",
    icon: "shield",
    guideId: "checklist",
  },
  {
    id: "faqs",
    title: "Frequently Asked Questions",
    description: "Instant answers on CORS headers, custom domain redirects, CRM integrations, and spam quarantine.",
    icon: "database",
    guideId: "faq",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting Guide",
    description: "Step-by-step resolution for common submission issues, CORS flags, and missing input names.",
    icon: "zap",
    guideId: "faq",
  },
];

export const MANDATORY_REQUIREMENTS: DocRequirement[] = [
  {
    name: "POST HTTP Method",
    type: "mandatory",
    description: "Your form must use the POST HTTP method. GET requests are reserved for endpoint status checks.",
    example: '<form action="https://api.infraly.com/api/forms-and-api/f/your-slug" method="POST">',
    whyNeeded: "Form submissions contain sensitive lead data that must be transmitted securely in the HTTP body, not in browser query URLs.",
  },
  {
    name: "Valid Endpoint Action URL",
    type: "mandatory",
    description: "The form 'action' attribute must point to your unique form slug or form ID endpoint generated in your infraly dashboard.",
    example: 'action="https://api.infraly.com/api/forms-and-api/f/contact-sales"',
    whyNeeded: "Routes the submission to your isolated tenant dashboard and updates your form analytics counter.",
  },
  {
    name: "Contact Email Input",
    type: "mandatory",
    description: "At least one input field named 'email', 'senderEmail', or 'workEmail' with a valid email syntax.",
    example: '<input type="email" name="email" required />',
    whyNeeded: "A lead cannot be contacted without an email address. Submissions without a valid email are quarantined as spam.",
  },
  {
    name: "Input 'name' Attributes",
    type: "mandatory",
    description: "Every HTML input must have a unique 'name' attribute. Inputs without a 'name' attribute are ignored by standard browsers.",
    example: '<input type="text" name="fullName" placeholder="Your Name" />',
    whyNeeded: "Browsers serialize form keys using the 'name' attribute. Without it, the data is never sent over the wire.",
  },
  {
    name: "Silent Honeypot (_gotcha)",
    type: "recommended",
    description: "A hidden text field that humans cannot see, but automated web scrapers and spam bots fill in automatically.",
    example: '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none !important;" />',
    whyNeeded: "Catches 99% of spam bots silently, moving them into the Quarantine table with zero CAPTCHA friction for real users.",
  },
  {
    name: "Custom Redirect URL (_next)",
    type: "optional",
    description: "Where to redirect the user after a successful HTML form submission. Can also be set in your infraly dashboard.",
    example: '<input type="hidden" name="_next" value="https://mysite.com/thank-you" />',
    whyNeeded: "Gives website visitors a polished thank-you experience on your own branded domain.",
  },
  {
    name: "Custom Data Fields",
    type: "optional",
    description: "Send any custom field names (budget, company, timeline, teamSize) without pre-configuring a database schema.",
    example: '<input type="text" name="company_budget" value="$10,000" />',
    whyNeeded: "All non-core fields are dynamically preserved into the lead's JSON extraFields bucket and shown in the detail drawer.",
  },
];

export const HTTP_STATUS_CODES: StatusCodeInfo[] = [
  {
    code: 200,
    status: "OK (Success)",
    meaning: "Lead captured cleanly and stored in the Leads CRM table.",
    description: "The submission passed all validation and anti-spam heuristics. Workspace lead counter is incremented.",
    sampleResponse: `{\n  "success": true,\n  "status": "success",\n  "message": "Lead captured successfully"\n}`,
  },
  {
    code: 202,
    status: "Accepted (Quarantined)",
    meaning: "Submission received but flagged by anti-spam heuristics into Quarantine.",
    description: "Triggered by honeypot filled, disposable email domain, or malformed email syntax. Prevents bot loops.",
    sampleResponse: `{\n  "success": false,\n  "status": "quarantined",\n  "message": "Submission received and quarantined for security inspection"\n}`,
  },
  {
    code: 302,
    status: "Found (Redirect)",
    meaning: "Submission accepted and browser redirected to custom redirectUrl.",
    description: "Standard HTML forms that do not specify Accept: application/json are smoothly redirected to your thank-you page.",
    sampleResponse: `HTTP/1.1 302 Found\nLocation: https://yourdomain.com/thank-you`,
  },
  {
    code: 401,
    status: "Unauthorized",
    meaning: "Invalid, expired, or revoked API key.",
    description: "Sent when an API request to /api/v1/leads provides an invalid or missing x-api-key header.",
    sampleResponse: `{\n  "success": false,\n  "status": "rejected",\n  "message": "Invalid, expired, or revoked API key"\n}`,
  },
  {
    code: 403,
    status: "Forbidden",
    meaning: "Origin mismatch or form paused.",
    description: "In production mode, the Origin/Referer header did not match your configured Production Origin, or the form is paused.",
    sampleResponse: `{\n  "success": false,\n  "status": "rejected",\n  "message": "Form submissions are currently paused by workspace owner"\n}`,
  },
  {
    code: 404,
    status: "Not Found",
    meaning: "Form slug or endpoint ID does not exist.",
    description: "Verify that the slug in your form action URL matches the slug in your dashboard.",
    sampleResponse: `{\n  "success": false,\n  "status": "rejected",\n  "message": "Target form endpoint or API key not found"\n}`,
  },
];

export const FAQS_DATA: FaqItem[] = [
  {
    category: "General",
    question: "Do I need to create a database schema before adding custom fields?",
    answer: "No. infraly uses a dynamic schema-less extraFields storage engine. Any custom inputs on your HTML form (e.g. company, budget, timeline, favoriteColor) are automatically captured and displayed in your lead detail drawer.",
  },
  {
    category: "General",
    question: "Can I receive submissions from multiple domains or localhost?",
    answer: "Yes! All public form ingestion routes have open CORS enabled (Access-Control-Allow-Origin: *). You can test from localhost, staging, or production domains without CORS errors.",
  },
  {
    category: "Security",
    question: "How does the silent honeypot protect my forms from spam?",
    answer: "Spam bots read HTML code and greedily fill out every input they find. By adding a hidden field like name='_gotcha', bots fill it while human users cannot see it. infraly intercepts this and silently quarantines the bot submission into your Spam table without triggering any alerts.",
  },
  {
    category: "Security",
    question: "What happens if a bot submits a fake email address?",
    answer: "infraly performs automated email syntax checks and cross-references disposable email provider blocklists (Mailinator, GuerrillaMail, 10MinuteMail). If an invalid or temporary email is detected, the lead is quarantined so your sales inbox stays pristine.",
  },
  {
    category: "Integration",
    question: "How do I redirect users to my own thank-you page after submitting?",
    answer: "You can either configure the 'Redirect URL' in your Form settings inside the infraly dashboard, or include a hidden input in your HTML: <input type='hidden' name='_next' value='https://yourdomain.com/thank-you' />.",
  },
  {
    category: "Integration",
    question: "Can I use infraly as a headless API with React Hook Form or Zod?",
    answer: "Absolutely. Send a standard fetch() POST request with 'Content-Type': 'application/json' and 'Accept': 'application/json'. You will receive a structured JSON response with status, message, and success flags.",
  },
];

export const DETAILED_GUIDES: Record<string, DetailedGuide> = {
  react: {
    id: "react",
    title: "Use infraly with React & Next.js",
    subtitle: "Capture inbound leads directly into your infraly CRM using React state or Next.js App Router with zero page reload.",
    category: "Frontend Quickstarts",
    badge: "React 18+ / Next 14+",
    icon: "react",
    breadcrumbs: ["Docs", "Frontend Quickstarts", "React & Next.js"],
    agentPrompt: `Help me integrate infraly with React:
1. Create a lead capture form with name, email, and message inputs
2. Add a silent honeypot <input name="_gotcha" tabIndex={-1} className="hidden" />
3. POST JSON payload to https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG
4. Handle loading state and render a clean success confirmation`,
    overview:
      "This quickstart shows you how to integrate infraly into your React or Next.js application. You'll build a frictionless lead capture component with automatic honeypot spam protection, asynchronous submission, and instant CRM ingestion.",
    tableOfContents: [
      { id: "step-1", label: "1. Obtain Form Slug" },
      { id: "step-2", label: "2. Create Contact Component" },
      { id: "step-3", label: "3. Add Silent Honeypot" },
      { id: "step-4", label: "4. Handle Submit State" },
      { id: "step-5", label: "5. Verify Lead in CRM" },
      { id: "tips", label: "Implementation Notes" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Obtain your Form Endpoint Slug",
        description:
          "Sign in to your infraly dashboard and go to Forms & API. Create a new form or copy the slug of an existing form (e.g. contact-sales). Your public form action URL will look like:",
        callout: {
          type: "tip",
          text: "You can test with any slug during development. Requests sent with Accept: application/json receive instant JSON confirmation.",
        },
        code: {
          language: "bash",
          snippet: "https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG",
        },
      },
      {
        stepNumber: 2,
        title: "Create the React Form Component",
        description:
          "Create a new component file `components/ContactForm.tsx`. We will maintain asynchronous status states (`idle`, `loading`, `success`, `error`) to give visitors immediate feedback.",
        code: {
          language: "tsx",
          filename: "components/ContactForm.tsx",
          snippet: `"use client";

import React, { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit lead");
      }

      setStatus("success");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
        <h3 className="text-emerald-400 font-semibold text-lg">Thank You!</h3>
        <p className="text-zinc-300 text-sm mt-1">Your message was received. Our team will contact you shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors"
        >
          Send another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* 1. Silent Honeypot Trap (Invisible to humans, catches spam bots) */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* 2. Core Lead Attributes */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Jane Doe"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:border-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">Work Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="jane@company.com"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:border-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">Message</label>
        <textarea
          name="message"
          rows={3}
          required
          placeholder="How can we help your business?"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:border-emerald-500 outline-none"
        />
      </div>

      {/* 3. Optional Arbitrary Custom Fields */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">Estimated Budget</label>
        <select
          name="budget"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:border-emerald-500 outline-none"
        >
          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
          <option value="$5,000 - $20,000">$5,000 - $20,000</option>
          <option value="$20,000+">$20,000+</option>
        </select>
      </div>

      {status === "error" && (
        <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2.5 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black text-sm font-semibold transition-all disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Send Message"}
      </button>
    </form>
  );
}`,
        },
      },
      {
        stepNumber: 3,
        title: "Add the Silent Honeypot Trap",
        description:
          "Include a hidden input named `_gotcha`. Legitimate human users will not see or interact with it. Automated spam scrapers fill out all inputs indiscriminately. When infraly detects a filled honeypot, the submission is isolated directly into your Quarantine table.",
        code: {
          language: "tsx",
          snippet: `<input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />`,
        },
        callout: {
          type: "note",
          text: "Never add a placeholder or required attribute to the _gotcha field so real users are never affected.",
        },
      },
      {
        stepNumber: 4,
        title: "Submit and Handle Response State",
        description:
          "Make sure your `fetch` request passes headers `Accept: application/json`. This instructs the infraly ingestion cluster to return a 200 JSON payload instead of an HTTP 302 browser redirect.",
        code: {
          language: "json",
          snippet: `// HTTP 200 Success Response
{
  "success": true,
  "status": "success",
  "message": "Lead captured successfully"
}`,
        },
      },
      {
        stepNumber: 5,
        title: "Test and Verify Inbound Lead",
        description:
          "Submit a test message through your React form. Switch over to your infraly Dashboard → Leads CRM table. You will see your new contact appear instantly with all core fields and custom extra fields captured.",
        callout: {
          type: "tip",
          text: "You can click any lead row in your CRM table to inspect custom parameters (such as budget, source, campaign) in the detail drawer.",
        },
      },
    ],
    nextGuide: { id: "vue", title: "Vue.js & Nuxt" },
    prevGuide: { id: "html", title: "Plain HTML5" },
  },

  nextjs: {
    id: "nextjs",
    title: "Use infraly with Next.js",
    subtitle: "Integrate infraly with Next.js App Router, Server Actions, or Client Components seamlessly.",
    category: "Frontend Quickstarts",
    badge: "Next.js 14 / 15",
    icon: "nextjs",
    breadcrumbs: ["Docs", "Frontend Quickstarts", "Next.js"],
    agentPrompt: `Help me integrate infraly with Next.js App Router:
1. Create a contact form with Next.js Server Actions or Client Component
2. Point submission to infraly endpoint https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG
3. Include silent honeypot anti-spam trap
4. Handle validation and toast feedback`,
    overview:
      "Next.js offers both Client Components and Server Actions for form handling. infraly supports both out of the box with zero configuration.",
    tableOfContents: [
      { id: "step-1", label: "1. Get Endpoint Slug" },
      { id: "step-2", label: "2. Server Action or Client Form" },
      { id: "step-3", label: "3. Anti-Spam Protection" },
      { id: "step-4", label: "4. Deployment & CORS" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Obtain Form Endpoint Slug",
        description: "Grab your form slug from your infraly dashboard or use your workspace slug.",
        code: {
          language: "bash",
          snippet: "NEXT_PUBLIC_infraly_ENDPOINT=https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG",
        },
      },
      {
        stepNumber: 2,
        title: "Create App Router Form Component",
        description: "Build an interactive client component with instant user feedback.",
        code: {
          language: "tsx",
          filename: "app/contact/page.tsx",
          snippet: `"use client";

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return <div className="text-emerald-400 font-semibold p-4">Thank you! Your lead is in our CRM.</div>;
  }

  return (
    <form action={handleAction} className="space-y-3 max-w-sm">
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} />
      <input type="text" name="name" required placeholder="Name" className="w-full p-2 bg-zinc-900 border rounded" />
      <input type="email" name="email" required placeholder="Email" className="w-full p-2 bg-zinc-900 border rounded" />
      <textarea name="message" placeholder="Message" className="w-full p-2 bg-zinc-900 border rounded" />
      <button type="submit" disabled={loading} className="w-full py-2 bg-white text-black font-semibold rounded">
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}`,
        },
      },
      {
        stepNumber: 3,
        title: "Deployment on Vercel or Node",
        description: "Deploy your Next.js application anywhere. infraly has CORS wildcard headers preconfigured, meaning zero CORS issues on preview domains, staging, or production.",
      },
    ],
    nextGuide: { id: "vue", title: "Vue 3 & Nuxt" },
    prevGuide: { id: "react", title: "React" },
  },

  html: {
    id: "html",
    title: "Use infraly with Plain HTML5",
    subtitle: "The simplest, fastest way to capture leads. Zero JavaScript, zero npm packages, and zero server maintenance.",
    category: "Frontend Quickstarts",
    badge: "Pure HTML5",
    icon: "html",
    breadcrumbs: ["Docs", "Frontend Quickstarts", "Plain HTML5"],
    agentPrompt: `Help me integrate infraly with Plain HTML:
1. Create a static HTML5 form with method="POST"
2. Set action="https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG"
3. Add hidden <input name="_gotcha"> honeypot
4. Add <input name="_next" value="https://mysite.com/thank-you"> for custom redirect`,
    overview:
      "If you have a static website, landing page, Hugo, Jekyll, or Astro site, you don't need any JavaScript. Simply point your HTML form action to infraly and optionally add a `_next` redirect.",
    tableOfContents: [
      { id: "step-1", label: "1. Obtain Form Endpoint URL" },
      { id: "step-2", label: "2. Paste Form Markup" },
      { id: "step-3", label: "3. Configure Redirect (_next)" },
      { id: "step-4", label: "4. Test In Browser" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Obtain Form Endpoint URL",
        description: "Copy your form action URL from your infraly dashboard.",
        code: {
          language: "html",
          snippet: `<form action="https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG" method="POST">`,
        },
      },
      {
        stepNumber: 2,
        title: "Paste Production HTML5 Markup",
        description: "Here is the complete production-ready HTML5 contact form with anti-spam honeypot and redirect support:",
        code: {
          language: "html",
          filename: "index.html",
          snippet: `<!-- Production HTML5 Contact Form -->
<form 
  action="https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG" 
  method="POST"
  class="contact-form"
>
  <!-- Anti-Spam Silent Honeypot (Invisible to humans) -->
  <input 
    type="text" 
    name="_gotcha" 
    tabindex="-1" 
    autocomplete="off" 
    style="display:none !important;" 
  />

  <!-- Optional Custom Redirect to your thank-you page -->
  <input type="hidden" name="_next" value="https://yourdomain.com/thank-you" />

  <!-- Core Fields -->
  <div>
    <label for="name">Your Name</label>
    <input type="text" id="name" name="name" required placeholder="Alex Mercer" />
  </div>

  <div>
    <label for="email">Work Email</label>
    <input type="email" id="email" name="email" required placeholder="alex@company.com" />
  </div>

  <div>
    <label for="message">Project Details</label>
    <textarea id="message" name="message" rows="4" placeholder="Tell us about your project..."></textarea>
  </div>

  <!-- Custom Arbitrary Fields (Captured automatically) -->
  <div>
    <label for="budget">Estimated Budget</label>
    <select id="budget" name="budget">
      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
      <option value="$5,000 - $20,000">$5,000 - $20,000</option>
      <option value="$20,000+">$20,000+</option>
    </select>
  </div>

  <button type="submit">Send Message</button>
</form>`,
        },
      },
      {
        stepNumber: 3,
        title: "Configure Redirect URL",
        description: "When users submit the HTML form, standard browsers follow an HTTP 302 redirect. Providing `<input type='hidden' name='_next' value='https://...'>` sends them smoothly to your custom branded page.",
      },
      {
        stepNumber: 4,
        title: "Publish & Verify",
        description: "Open your HTML file in any browser, fill in the form, and submit. You will immediately be redirected to your thank-you page and the lead will appear in your infraly Leads CRM table.",
      },
    ],
    nextGuide: { id: "react", title: "React & Next.js" },
    prevGuide: { id: "architecture", title: "Architecture" },
  },

  vue: {
    id: "vue",
    title: "Use infraly with Vue 3 & Nuxt",
    subtitle: "Composition API script setup with reactive state, honeypot protection, and instant lead persistence.",
    category: "Frontend Quickstarts",
    badge: "Vue 3 / Nuxt 3",
    icon: "vue",
    breadcrumbs: ["Docs", "Frontend Quickstarts", "Vue.js"],
    agentPrompt: `Help me integrate infraly with Vue 3:
1. Build a <script setup lang="ts"> contact component
2. Reactive form state with name, email, message, and _gotcha honeypot
3. POST JSON to https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG
4. Display thank-you alert when completed`,
    overview:
      "Integrate infraly with Vue 3 or Nuxt 3 using modern Composition API, reactive state management, and async fetch.",
    tableOfContents: [
      { id: "step-1", label: "1. Obtain Form Slug" },
      { id: "step-2", label: "2. Vue 3 Component" },
      { id: "step-3", label: "3. Nuxt 3 Considerations" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Obtain Form Slug",
        description: "Locate your form slug in the infraly dashboard under Forms & API.",
      },
      {
        stepNumber: 2,
        title: "Create Vue Component",
        description: "Create `ContactForm.vue` with Vue 3 `<script setup>` syntax:",
        code: {
          language: "vue",
          filename: "ContactForm.vue",
          snippet: `<script setup lang="ts">
import { ref, reactive } from 'vue';

const form = reactive({
  name: '',
  email: '',
  message: '',
  budget: '$5,000 - $10,000',
  _gotcha: '', // Silent honeypot
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMsg = ref('');

async function submitForm() {
  isSubmitting.value = true;
  errorMsg.value = '';

  try {
    const res = await fetch('https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Submission failed');
    }

    isSuccess.value = true;
  } catch (err: any) {
    errorMsg.value = err.message || 'Network error occurred';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div v-if="isSuccess" class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
    <h3 class="text-emerald-400 font-semibold text-lg">Message Sent!</h3>
    <p class="text-zinc-300 text-sm mt-1">We received your inquiry and will be in touch shortly.</p>
  </div>

  <form v-else @submit.prevent="submitForm" class="space-y-4 max-w-md">
    <!-- Silent Honeypot -->
    <input v-model="form._gotcha" type="text" tabindex="-1" style="display:none;" />

    <input v-model="form.name" type="text" required placeholder="Name" class="w-full p-2.5 bg-zinc-900 border rounded-lg text-white" />
    <input v-model="form.email" type="email" required placeholder="Email" class="w-full p-2.5 bg-zinc-900 border rounded-lg text-white" />
    <textarea v-model="form.message" placeholder="Message" class="w-full p-2.5 bg-zinc-900 border rounded-lg text-white" />

    <p v-if="errorMsg" class="text-xs text-rose-400">{{ errorMsg }}</p>
    <button :disabled="isSubmitting" type="submit" class="w-full py-2.5 bg-emerald-400 text-black font-semibold rounded-lg">
      {{ isSubmitting ? 'Sending...' : 'Submit Lead' }}
    </button>
  </form>
</template>`,
        },
      },
      {
        stepNumber: 3,
        title: "Nuxt 3 SSR & Hydration",
        description: "Works natively in both client-side and server-rendered Nuxt 3 environments without hydration mismatches.",
      },
    ],
    nextGuide: { id: "svelte", title: "SvelteKit" },
    prevGuide: { id: "react", title: "React & Next.js" },
  },

  svelte: {
    id: "svelte",
    title: "Use infraly with Svelte & SvelteKit",
    subtitle: "Ultra-lean reactive form handling with two-way bindings or SvelteKit form actions.",
    category: "Frontend Quickstarts",
    badge: "Svelte 4 / 5",
    icon: "svelte",
    breadcrumbs: ["Docs", "Frontend Quickstarts", "Svelte"],
    agentPrompt: `Help me integrate infraly with Svelte:
1. Bind name, email, message, and _gotcha variables
2. POST to infraly endpoint
3. Toggle reactive success state`,
    overview: "Svelte's lightweight reactivity makes lead capture extremely fast with negligible bundle footprint.",
    tableOfContents: [
      { id: "step-1", label: "1. Form Slug" },
      { id: "step-2", label: "2. Svelte Component" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Form Slug",
        description: "Copy your target form slug from the infraly dashboard.",
      },
      {
        stepNumber: 2,
        title: "Create Svelte Component",
        description: "Add this reactive form to your Svelte or SvelteKit route:",
        code: {
          language: "svelte",
          snippet: `<script lang="ts">
  let name = '';
  let email = '';
  let message = '';
  let _gotcha = '';
  let loading = false;
  let success = false;
  let error = '';

  async function handleSend() {
    loading = true;
    error = '';

    try {
      const res = await fetch('https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, message, _gotcha })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      success = true;
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

{#if success}
  <div class="p-4 rounded-xl bg-emerald-500/10 text-emerald-400">Thank you! Your submission has been captured.</div>
{:else}
  <form on:submit|preventDefault={handleSend} class="space-y-3">
    <input bind:value={_gotcha} type="text" tabindex="-1" style="display:none;" />
    <input bind:value={name} placeholder="Your Name" required class="w-full p-2 rounded bg-zinc-900 border text-white" />
    <input bind:value={email} type="email" placeholder="Your Email" required class="w-full p-2 rounded bg-zinc-900 border text-white" />
    <textarea bind:value={message} placeholder="Message" class="w-full p-2 rounded bg-zinc-900 border text-white"></textarea>
    
    {#if error}<p class="text-rose-400 text-xs">{error}</p>{/if}
    <button type="submit" disabled={loading} class="w-full py-2 bg-emerald-400 text-black font-semibold rounded">
      {loading ? 'Submitting...' : 'Send Message'}
    </button>
  </form>
{/if}`,
        },
      },
    ],
    nextGuide: { id: "angular", title: "Angular" },
    prevGuide: { id: "vue", title: "Vue 3 & Nuxt" },
  },

  angular: {
    id: "angular",
    title: "Use infraly with Angular",
    subtitle: "Standalone Angular component with ReactiveFormsModule and HttpClient integration.",
    category: "Frontend Quickstarts",
    badge: "Angular 16+",
    icon: "angular",
    breadcrumbs: ["Docs", "Frontend Quickstarts", "Angular"],
    agentPrompt: `Help me integrate infraly with Angular Reactive Forms:
1. Build standalone ContactFormComponent
2. Use HttpClient to POST form data to infraly
3. Validate email and include silent honeypot`,
    overview: "Angular's reactive forms provide strong typing, synchronous validation, and clean observable flows.",
    tableOfContents: [
      { id: "step-1", label: "1. Component Setup" },
      { id: "step-2", label: "2. Form Submission" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Create Standalone Component",
        description: "Set up ReactiveFormsModule and HttpClient in your component:",
        code: {
          language: "typescript",
          filename: "contact-form.component.ts",
          snippet: `import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: \`
    <form [formGroup]="leadForm" (ngSubmit)="onSubmit()" class="space-y-3">
      <input type="text" formControlName="_gotcha" style="display:none;" />
      
      <input type="text" formControlName="name" placeholder="Name" class="w-full p-2 bg-zinc-900 rounded border text-white" />
      <input type="email" formControlName="email" placeholder="Email" class="w-full p-2 bg-zinc-900 rounded border text-white" />
      <textarea formControlName="message" placeholder="Message" class="w-full p-2 bg-zinc-900 rounded border text-white"></textarea>

      <button type="submit" [disabled]="loading || leadForm.invalid" class="w-full py-2 bg-emerald-400 text-black font-semibold rounded">
        {{ loading ? 'Sending...' : 'Submit Lead' }}
      </button>
    </form>
  \`
})
export class ContactFormComponent {
  leadForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.leadForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: [''],
      _gotcha: ['']
    });
  }

  onSubmit() {
    if (this.leadForm.invalid) return;
    this.loading = true;

    this.http.post('https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG', this.leadForm.value)
      .subscribe({
        next: () => {
          alert('Lead Captured Successfully!');
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}`,
        },
      },
    ],
    nextGuide: { id: "nocode", title: "Webflow & Framer" },
    prevGuide: { id: "svelte", title: "SvelteKit" },
  },

  nocode: {
    id: "nocode",
    title: "Webflow, Framer, and WordPress",
    subtitle: "Capture inbound leads directly from visual website builders without writing custom backend code.",
    category: "No-Code & Visual Builders",
    badge: "No-Code",
    icon: "webflow",
    breadcrumbs: ["Docs", "No-Code", "Webflow & Framer"],
    agentPrompt: `Help me configure infraly in Webflow or Framer:
1. Paste form action URL into form settings
2. Set method to POST
3. Add embed for _gotcha honeypot`,
    overview:
      "If your marketing site is built with Webflow, Framer, or WordPress Elementor, you can ingest leads effortlessly into your infraly CRM pipeline.",
    tableOfContents: [
      { id: "webflow", label: "Webflow Configuration" },
      { id: "framer", label: "Framer Configuration" },
      { id: "wordpress", label: "WordPress & Elementor" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Webflow Configuration",
        description: "In Webflow Designer, select your Form Block element. In the Form Settings (D) panel on the right sidebar:",
        code: {
          language: "text",
          snippet: `Action: https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG
Method: POST

Inside the form block, add an HTML Embed element:
<input type="text" name="_gotcha" tabindex="-1" style="display:none !important;" />`,
        },
      },
      {
        stepNumber: 2,
        title: "Framer Configuration",
        description: "Select the Framer Form component. Under Form Controls, set the Action to your infraly URL and Method to POST.",
      },
      {
        stepNumber: 3,
        title: "WordPress (Elementor / Contact Form 7)",
        description: "In Elementor Form widget: under 'Actions After Submit', select 'Webhook', and paste your infraly endpoint URL. All field keys are mapped and ingested automatically.",
      },
    ],
    nextGuide: { id: "curl", title: "cURL & REST API" },
    prevGuide: { id: "angular", title: "Angular" },
  },

  curl: {
    id: "curl",
    title: "cURL, Node.js & Python REST API",
    subtitle: "Headless lead ingestion from backend servers, cron workers, mobile apps, and webhooks using live API keys.",
    category: "REST API & Ingestion",
    badge: "REST API",
    icon: "curl",
    breadcrumbs: ["Docs", "REST API", "cURL & Backend"],
    agentPrompt: `Show me how to send leads to infraly via REST API:
1. Public form endpoint POST /api/forms-and-api/f/{slug}
2. Authenticated CRM capture POST /api/v1/leads with x-api-key
3. Provide cURL, Node.js, and Python code examples`,
    overview:
      "infraly provides two ingestion routes: public form ingestion via slug, and authenticated direct CRM ingestion via live API keys (`sln_live_...`).",
    tableOfContents: [
      { id: "public-curl", label: "1. Public Slug Ingestion" },
      { id: "authenticated-api", label: "2. Authenticated API Key Capture" },
      { id: "python-node", label: "3. Python & Node.js Recipes" },
      { id: "responses", label: "4. Response Formats" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Public Form Ingestion via Slug",
        description: "Call your public form endpoint without headers or API keys. Ideal for client-side forms and static landing pages:",
        code: {
          language: "bash",
          snippet: `curl -X POST https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.io",
    "message": "Interested in enterprise plan",
    "budget": "$15,000",
    "source": "Landing Page V2"
  }'`,
        },
      },
      {
        stepNumber: 2,
        title: "Authenticated Direct Capture via Live API Key",
        description: "Submit leads directly into your CRM table from backend services with full score attribution:",
        code: {
          language: "bash",
          snippet: `curl -X POST https://api.infraly.com/api/v1/leads \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sln_live_your_workspace_api_key" \\
  -d '{
    "name": "David Miller",
    "email": "david@acme.com",
    "message": "Direct server webhook inbound",
    "leadScore": 95,
    "company": "Acme Global",
    "phone": "+1 (555) 234-5678"
  }'`,
        },
      },
      {
        stepNumber: 3,
        title: "Python (Requests / FastAPI) Example",
        description: "Submit leads effortlessly in Python scripts, background workers, or Celery tasks:",
        code: {
          language: "python",
          snippet: `import requests

url = "https://api.infraly.com/api/forms-and-api/f/YOUR_FORM_SLUG"
payload = {
    "name": "Alexander Stone",
    "email": "alex@stonecapital.com",
    "message": "Inquiring about institutional liquidity",
    "dealSize": "$250,000"
}
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.status_code, response.json())`,
        },
      },
    ],
    nextGuide: { id: "honeypot", title: "Silent Honeypot Shield" },
    prevGuide: { id: "nocode", title: "Webflow & Framer" },
  },

  honeypot: {
    id: "honeypot",
    title: "Silent Honeypot & Anti-Spam Protection",
    subtitle: "Protect your forms from automated scrapers, bot loops, and disposable email domains with zero human friction.",
    category: "Spam & Security",
    badge: "Zero CAPTCHA",
    icon: "shield",
    breadcrumbs: ["Docs", "Spam & Security", "Honeypot Shield"],
    agentPrompt: `Explain infraly's silent honeypot mechanism:
1. How does the _gotcha input work?
2. Why is it better than annoying CAPTCHAs?
3. What happens to quarantined submissions?`,
    overview:
      "CAPTCHAs reduce form conversion rates by up to 40%. infraly uses passive heuristics including silent honeypot traps and disposable email domain quarantine to stop bots invisibly.",
    tableOfContents: [
      { id: "how-it-works", label: "1. How Honeypots Work" },
      { id: "implementation", label: "2. Drop-in Implementation" },
      { id: "disposable-domains", label: "3. Disposable Email Quarantine" },
      { id: "managing-quarantine", label: "4. Managing Quarantine in CRM" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "The Silent Honeypot Principle",
        description:
          "Automated spam bots parse raw HTML code and greedily fill out every input element. Humans browse with visual CSS where the field is hidden and skipped.",
        code: {
          language: "html",
          snippet: `<!-- Hidden honeypot input -->
<input 
  type="text" 
  name="_gotcha" 
  tabindex="-1" 
  autocomplete="off" 
  style="display:none !important;" 
/>`,
        },
      },
      {
        stepNumber: 2,
        title: "Zero Friction for Genuine Visitors",
        description:
          "Because genuine users never interact with the hidden input, their submissions pass instantly with HTTP 200 OK. If a submission arrives with text in `_gotcha`, infraly immediately flags it as spam.",
      },
      {
        stepNumber: 3,
        title: "Disposable Domain Quarantine",
        description:
          "Submissions from temporary burner emails (e.g. Mailinator, GuerrillaMail, 10MinuteMail) are quarantined automatically, protecting your lead score calculations.",
      },
      {
        stepNumber: 4,
        title: "Inspect Quarantined Leads in Dashboard",
        description:
          "Quarantined submissions appear in your dedicated Spam / Quarantine table. You can inspect the payload and rescue any false positive back into active leads with one click.",
      },
    ],
    nextGuide: { id: "checklist", title: "Mandatory Checklist" },
    prevGuide: { id: "curl", title: "REST API & cURL" },
  },

  checklist: {
    id: "checklist",
    title: "Mandatory vs Optional Requirements Checklist",
    subtitle: "Everything you need to verify before deploying your form to production.",
    category: "Getting Started",
    badge: "Checklist",
    icon: "shield",
    breadcrumbs: ["Docs", "Getting Started", "Requirements Checklist"],
    agentPrompt: `What are the mandatory requirements for infraly forms?
1. POST method
2. Action URL
3. Email field
4. Input name attributes`,
    overview:
      "Review this checklist to make sure your form captures leads smoothly without configuration errors.",
    tableOfContents: [
      { id: "mandatory-rules", label: "Mandatory Rules" },
      { id: "recommended-rules", label: "Recommended Rules" },
      { id: "optional-features", label: "Optional Enhancements" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "HTTP Method Must Be POST",
        description: "Forms must use method='POST'. GET requests are reserved for endpoint status checks.",
        code: {
          language: "html",
          snippet: `<form method="POST" action="...">`,
        },
      },
      {
        stepNumber: 2,
        title: "Valid Form Action URL",
        description: "Ensure the form points to your unique slug or ID from your dashboard.",
        code: {
          language: "html",
          snippet: `action="https://api.infraly.com/api/forms-and-api/f/your-slug"`,
        },
      },
      {
        stepNumber: 3,
        title: "Contact Email Field Required",
        description: "Provide at least one input named `email` with valid email syntax.",
        code: {
          language: "html",
          snippet: `<input type="email" name="email" required />`,
        },
      },
      {
        stepNumber: 4,
        title: "Input 'name' Attributes",
        description: "All inputs must have unique `name` attributes. Inputs without `name` are ignored by browsers during submission.",
      },
    ],
    nextGuide: { id: "status-codes", title: "Status Codes Reference" },
    prevGuide: { id: "honeypot", title: "Silent Honeypot" },
  },

  "status-codes": {
    id: "status-codes",
    title: "HTTP Status Codes & Error Reference",
    subtitle: "Complete reference for response codes returned by infraly form ingestion and REST APIs.",
    category: "REST API & Ingestion",
    badge: "HTTP Codes",
    icon: "curl",
    breadcrumbs: ["Docs", "REST API", "Status Codes"],
    agentPrompt: `List the HTTP status codes returned by infraly:
200 OK, 202 Quarantined, 302 Redirect, 401 Unauthorized, 403 Forbidden, 404 Not Found`,
    overview: "Understand every possible response status code to handle errors and redirects smoothly in your frontend or server code.",
    tableOfContents: [
      { id: "code-200", label: "200 OK (Success)" },
      { id: "code-202", label: "202 Accepted (Quarantine)" },
      { id: "code-302", label: "302 Found (Redirect)" },
      { id: "code-401", label: "401 Unauthorized" },
      { id: "code-403", label: "403 Forbidden" },
      { id: "code-404", label: "404 Not Found" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "200 OK - Lead Captured Successfully",
        description: "The submission passed all validation checks and was cleanly saved to your CRM table.",
        code: {
          language: "json",
          snippet: `{\n  "success": true,\n  "status": "success",\n  "message": "Lead captured successfully"\n}`,
        },
      },
      {
        stepNumber: 2,
        title: "202 Accepted - Quarantined Submission",
        description: "Triggered when a honeypot field is filled or a disposable email is detected. Prevents bot retry loops.",
        code: {
          language: "json",
          snippet: `{\n  "success": false,\n  "status": "quarantined",\n  "message": "Submission received and quarantined for security inspection"\n}`,
        },
      },
      {
        stepNumber: 3,
        title: "302 Found - Custom Redirect",
        description: "Standard HTML forms without `Accept: application/json` are redirected smoothly to your thank-you page.",
      },
      {
        stepNumber: 4,
        title: "401 Unauthorized - Invalid API Key",
        description: "Sent when an authenticated REST API call provides an invalid or revoked `x-api-key` header.",
      },
    ],
    nextGuide: { id: "faq", title: "Frequently Asked Questions" },
    prevGuide: { id: "checklist", title: "Mandatory Checklist" },
  },

  architecture: {
    id: "architecture",
    title: "How infraly Ingestion Works",
    subtitle: "Under the hood: spam filtering, custom fields extraction, and database persistence in milliseconds.",
    category: "Getting Started",
    badge: "Architecture",
    icon: "database",
    breadcrumbs: ["Docs", "Getting Started", "Architecture"],
    agentPrompt: `Explain how infraly processes incoming form submissions under the hood:
1. Public ingestion cluster & CORS handling
2. Passive anti-spam heuristics
3. Dynamic extraFields extraction
4. Persistence into tenant CRM tables`,
    overview:
      "infraly operates a global, multi-tenant lead ingestion pipeline designed for high availability, zero latency spikes, and automated bot neutralization.",
    tableOfContents: [
      { id: "flow-1", label: "1. Request Ingestion" },
      { id: "flow-2", label: "2. Passive Anti-Spam" },
      { id: "flow-3", label: "3. Schema-Free ExtraFields" },
      { id: "flow-4", label: "4. CRM Persistence & Webhooks" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Edge Ingestion & Wildcard CORS",
        description: "Incoming requests hit the infraly API gateway. CORS headers are returned automatically, allowing submissions from any origin or localhost.",
      },
      {
        stepNumber: 2,
        title: "Silent Anti-Spam Heuristics",
        description: "The engine checks the silent honeypot input, email syntax, and disposable domain blocklists in < 15ms. Clean leads proceed; spam is quarantined.",
      },
      {
        stepNumber: 3,
        title: "Dynamic Schema-Free Extraction",
        description: "Core fields (name, email, message, company) are mapped to primary table columns. All other attributes are packaged into a structured JSON `extraFields` payload.",
      },
      {
        stepNumber: 4,
        title: "CRM Persistence & Notifications",
        description: "The lead is saved with tenant isolation, incrementing workspace counters and firing configured outbound webhooks.",
      },
    ],
    nextGuide: { id: "html", title: "Plain HTML5 Guide" },
    prevGuide: { id: "status-codes", title: "Status Codes" },
  },

  faq: {
    id: "faq",
    title: "Frequently Asked Questions & Troubleshooting",
    subtitle: "Common questions regarding CORS, custom domains, spam quarantine, and schema migrations.",
    category: "Help & Troubleshooting",
    badge: "Help",
    icon: "database",
    breadcrumbs: ["Docs", "Help", "FAQs"],
    agentPrompt: `List answers to common infraly questions:
1. Do I need schema migrations? (No)
2. Does CORS work on localhost? (Yes)
3. How does the honeypot work?
4. How do I redirect after submission?`,
    overview:
      "Find quick answers to common questions about setting up and operating forms with infraly.",
    tableOfContents: [
      { id: "general", label: "General Questions" },
      { id: "security", label: "Security & Spam" },
      { id: "troubleshooting", label: "Troubleshooting Tips" },
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Do I need to configure a database schema first?",
        description: "No! infraly uses a dynamic schema-less extraFields storage engine. Any inputs on your form (budget, timeline, company, etc.) are captured automatically.",
      },
      {
        stepNumber: 2,
        title: "Can I receive submissions from multiple domains or localhost?",
        description: "Yes! Open CORS is enabled for all form ingestion endpoints. You can test from localhost, staging, or custom production domains with zero errors.",
      },
      {
        stepNumber: 3,
        title: "How do I redirect users to my own thank-you page?",
        description: "Either set the Redirect URL in your Form Settings inside the infraly dashboard, or add `<input type='hidden' name='_next' value='https://yourdomain.com/thank-you' />` in your HTML.",
      },
      {
        stepNumber: 4,
        title: "What if my submission isn't appearing?",
        description: "1. Check your Spam / Quarantine tab in the dashboard.\n2. Ensure your form has method='POST'.\n3. Ensure inputs have a 'name' attribute.\n4. Check browser developer tools Network tab for error codes.",
      },
    ],
    nextGuide: { id: "react", title: "React Quickstart" },
    prevGuide: { id: "checklist", title: "Checklist" },
  },
};

export const DOC_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Connect your first form in less than 60 seconds without server maintenance.",
    sections: [
      { id: "architecture", title: "How Ingestion Works", guideId: "architecture" },
      { id: "checklist", title: "Requirements Checklist", badge: "Important", guideId: "checklist" },
    ],
  },
  {
    id: "frontend-integrations",
    title: "Frontend Frameworks",
    description: "Copy-paste integration recipes for all popular frontend stacks.",
    sections: [
      { id: "react", title: "React & Next.js", badge: "Popular", guideId: "react" },
      { id: "nextjs", title: "Next.js App Router", guideId: "nextjs" },
      { id: "vue", title: "Vue.js & Nuxt", guideId: "vue" },
      { id: "svelte", title: "SvelteKit", guideId: "svelte" },
      { id: "angular", title: "Angular", guideId: "angular" },
      { id: "html", title: "Plain HTML5", badge: "Zero JS", guideId: "html" },
      { id: "nocode", title: "Webflow & Framer", guideId: "nocode" },
    ],
  },
  {
    id: "rules-and-protection",
    title: "Spam & Security Shield",
    description: "Silent honeypots, disposable email quarantine, and field handling.",
    sections: [
      { id: "honeypot", title: "Silent Honeypot Trap", badge: "Recommended", guideId: "honeypot" },
    ],
  },
  {
    id: "rest-api",
    title: "REST API & Ingestion",
    description: "Submit leads directly from your server, mobile app, or webhook integration.",
    sections: [
      { id: "curl", title: "cURL, Node.js & Python", guideId: "curl" },
      { id: "status-codes", title: "HTTP Status Codes & Errors", guideId: "status-codes" },
    ],
  },
  {
    id: "help-and-faq",
    title: "Help & Troubleshooting",
    description: "Frequently asked questions and common configuration pitfalls.",
    sections: [
      { id: "faq", title: "Frequently Asked Questions", guideId: "faq" },
    ],
  },
];
