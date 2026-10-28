import {
  FormItem,
  LeadItem,
  SpamItem,
  ApiKeyItem,
  WebhookConfig,
  DeliveryLogItem,
  WorkspaceConfig,
  NotificationSettings,
} from "../types";

// Helper to calculate realistic relative ISO timestamps
function getRelativeDate(daysAgo: number, hoursAgo = 0, minutesAgo = 0): string {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysAgo,
    now.getHours() - hoursAgo,
    now.getMinutes() - minutesAgo
  );
  return target.toISOString();
}

export const INITIAL_WORKSPACE: WorkspaceConfig = {
  name: "Acme Studio",
  slug: "acme-studio",
  ownerEmail: "alex@acmestudio.design",
  plan: "Free Tier",
  avatarTone: "zinc",
  createdAt: getRelativeDate(30),
};

export const INITIAL_FORMS: FormItem[] = [
  {
    id: "form_portfolio",
    name: "Portfolio Contact",
    slug: "portfolio-contact",
    endpointUrl: "https://api.salenova.com/v1/f/portfolio-contact",
    enabled: true,
    leadCount: 14,
    spamCount: 3,
    createdAt: getRelativeDate(25),
    redirectUrl: "https://acmestudio.design/thank-you",
    fields: [
      { id: "f1", name: "name", label: "Full Name", type: "text", required: true },
      { id: "f2", name: "email", label: "Email Address", type: "email", required: true },
      { id: "f3", name: "company", label: "Company / Studio", type: "text", required: false },
      { id: "f4", name: "message", label: "Project Details", type: "textarea", required: true },
    ],
  },
  {
    id: "form_travzo",
    name: "Travzo Waitlist",
    slug: "travzo-waitlist",
    endpointUrl: "https://api.salenova.com/v1/f/travzo-waitlist",
    enabled: true,
    leadCount: 28,
    spamCount: 6,
    createdAt: getRelativeDate(18),
    redirectUrl: "https://travzo.travel/waitlist-confirmed",
    fields: [
      { id: "f5", name: "name", label: "Traveler Name", type: "text", required: true },
      { id: "f6", name: "email", label: "Email Address", type: "email", required: true },
      { id: "f7", name: "destination", label: "Dream Destination", type: "text", required: false },
      { id: "f8", name: "message", label: "Travel Preferences", type: "textarea", required: false },
    ],
  },
  {
    id: "form_demo",
    name: "Demo Request",
    slug: "demo-request",
    endpointUrl: "https://api.salenova.com/v1/f/demo-request",
    enabled: true,
    leadCount: 9,
    spamCount: 2,
    createdAt: getRelativeDate(12),
    redirectUrl: "https://acmestudio.design/calendar",
    fields: [
      { id: "f9", name: "name", label: "Work Name", type: "text", required: true },
      { id: "f10", name: "email", label: "Work Email", type: "email", required: true },
      { id: "f11", name: "team_size", label: "Team Size", type: "text", required: true },
      { id: "f12", name: "message", label: "Current Workflow Challenges", type: "textarea", required: true },
    ],
  },
];

export const INITIAL_LEADS: LeadItem[] = [
  // Today's leads
  {
    id: "lead_101",
    name: "Marcus Vance",
    email: "marcus.vance@solarcraft.io",
    formId: "form_demo",
    formName: "Demo Request",
    source: "Website embed",
    status: "New",
    receivedAt: getRelativeDate(0, 0, 24), // 24 mins ago
    message: "We're expanding our sales engineering cohort to 25 reps. Need to see how Salenova aggregates incoming inquiry streams directly without requiring Zapier or complex webhooks.",
    extraFields: {
      team_size: "20-50 people",
      budget: "$5,000/mo",
    },
    metadata: {
      ip: "198.51.100.44",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      referrer: "https://twitter.com/solarcraft",
    },
  },
  {
    id: "lead_102",
    name: "Sophie Chen",
    email: "sophie@nomadnest.co",
    formId: "form_travzo",
    formName: "Travzo Waitlist",
    source: "Next.js form",
    status: "New",
    receivedAt: getRelativeDate(0, 2, 10), // 2 hours ago
    message: "Just signed up for early access! We have 40 remote travelers in our Bali coliving collective who would love early pilot onboarding.",
    extraFields: {
      destination: "Bali & Lisbon",
    },
    metadata: {
      ip: "103.22.201.88",
      referrer: "https://producthunt.com/posts/travzo",
    },
  },
  {
    id: "lead_103",
    name: "Elena Rostova",
    email: "elena@atelier-rostova.com",
    formId: "form_portfolio",
    formName: "Portfolio Contact",
    source: "Website embed",
    status: "Contacted",
    receivedAt: getRelativeDate(0, 4, 45), // 4 hours ago
    message: "Hey Alex! Loved your case study on fintech typography. We are redesigning our luxury gallery e-commerce site for Art Basel in December and need design system support.",
    extraFields: {
      company: "Atelier Rostova",
      timeline: "Q4 2026",
    },
    metadata: {
      ip: "172.56.21.90",
      referrer: "https://readcv.com/alex",
    },
  },

  // This week's leads
  {
    id: "lead_104",
    name: "Liam O'Connor",
    email: "liam@fintechforge.ie",
    formId: "form_demo",
    formName: "Demo Request",
    source: "Direct API",
    status: "New",
    receivedAt: getRelativeDate(1, 6, 0), // Yesterday
    message: "Requesting enterprise demo for our 15-person marketing team. Looking to replace Formspree across 8 micro-sites.",
    extraFields: {
      team_size: "10-25 people",
      use_case: "Replacing legacy form providers",
    },
    metadata: {
      ip: "89.101.44.12",
      referrer: "https://google.com/search",
    },
  },
  {
    id: "lead_105",
    name: "Anika Sharma",
    email: "anika@wanderlustguild.com",
    formId: "form_travzo",
    formName: "Travzo Waitlist",
    source: "Webflow site",
    status: "Contacted",
    receivedAt: getRelativeDate(2, 3, 30), // 2 days ago
    message: "Signing up my travel photography club (120 active members). Interested in group perks and verified guide recommendations.",
    extraFields: {
      destination: "Patagonia & Iceland",
    },
    metadata: {
      ip: "49.36.18.204",
      referrer: "https://instagram.com",
    },
  },
  {
    id: "lead_106",
    name: "Julian Sterling",
    email: "julian@sterlingmedia.studio",
    formId: "form_portfolio",
    formName: "Portfolio Contact",
    source: "Website embed",
    status: "Contacted",
    receivedAt: getRelativeDate(3, 8, 15), // 3 days ago
    message: "Looking for a senior front-end contractor for a 3-month design system overhaul. 40 hrs/week starting next month. Fully remote.",
    extraFields: {
      company: "Sterling Media",
      contract_length: "3 Months",
    },
    metadata: {
      ip: "216.58.214.14",
      referrer: "https://layers.to/work",
    },
  },
  {
    id: "lead_107",
    name: "Mateo Silva",
    email: "mateo@altitudelabs.br",
    formId: "form_travzo",
    formName: "Travzo Waitlist",
    source: "Direct API",
    status: "New",
    receivedAt: getRelativeDate(4, 1, 20), // 4 days ago
    message: "Super excited for Travzo launch! Hope you include offline itineraries and currency splitters.",
    extraFields: {
      destination: "Kyoto & Seoul",
    },
    metadata: {
      ip: "189.40.72.19",
    },
  },

  // Earlier leads (Past month)
  {
    id: "lead_108",
    name: "Claire Dubois",
    email: "claire@lumieremag.fr",
    formId: "form_portfolio",
    formName: "Portfolio Contact",
    source: "Website embed",
    status: "Contacted",
    receivedAt: getRelativeDate(9, 5, 0),
    message: "Inquiry about commission rates for editorial interactive layouts. We publish biannual features on minimalist architecture.",
    extraFields: {
      company: "Lumiere Magazine",
    },
  },
  {
    id: "lead_109",
    name: "David Kross",
    email: "david@nordictech.se",
    formId: "form_demo",
    formName: "Demo Request",
    source: "Direct API",
    status: "Contacted",
    receivedAt: getRelativeDate(14, 11, 0),
    message: "We need custom webhook payloads and privacy compliance in the EU. Would love a 20-minute run-through.",
    extraFields: {
      team_size: "50+ people",
    },
  },
  {
    id: "lead_110",
    name: "Tariq Al-Mansoor",
    email: "tariq@desertbloom.ae",
    formId: "form_travzo",
    formName: "Travzo Waitlist",
    source: "Next.js form",
    status: "Contacted",
    receivedAt: getRelativeDate(18, 4, 0),
    message: "Booking corporate retreat logistics for our regional advisory board in Oman.",
    extraFields: {
      destination: "Salalah, Oman",
    },
  },
  {
    id: "lead_111",
    name: "Hannah Becker",
    email: "hannah@beckerarch.de",
    formId: "form_portfolio",
    formName: "Portfolio Contact",
    source: "Website embed",
    status: "Contacted",
    receivedAt: getRelativeDate(22, 7, 0),
    message: "Request for tender on studio brand identity and web showcase.",
    extraFields: {
      company: "Becker Architektur",
    },
  },
];

export const INITIAL_SPAM: SpamItem[] = [
  {
    id: "spam_201",
    senderName: "Crypto Booster Pro",
    senderEmail: "promo994@disposable-inbox.biz",
    formId: "form_portfolio",
    formName: "Portfolio Contact",
    receivedAt: getRelativeDate(0, 1, 15), // Today, 1 hour ago
    disposition: "Rejected",
    reason: "Disposable email",
    messageSnippet: "Boost your site traffic by 10,000% overnight with guaranteed Tier-1 backlinks and Web3 PR blasts! Click here...",
    rawPayload: {
      name: "Crypto Booster Pro",
      email: "promo994@disposable-inbox.biz",
      message: "Boost your site traffic by 10,000% overnight...",
      _gotcha: "",
    },
    triggerRule: "Rule #3: Block throwaway & disposable email domains (disposable-inbox.biz)",
    metadata: {
      ip: "45.142.122.9",
      userAgent: "Python-urllib/3.9",
    },
  },
  {
    id: "spam_202",
    senderName: "Web Crawler Spider Bot",
    senderEmail: "spider@auto-harvest.net",
    formId: "form_travzo",
    formName: "Travzo Waitlist",
    receivedAt: getRelativeDate(0, 3, 50), // Today, 3 hours ago
    disposition: "Quarantined",
    reason: "Honeypot filled",
    messageSnippet: "Submitted automated form test value via headless chromium script with hidden honeypot field populated.",
    rawPayload: {
      name: "Web Crawler Spider Bot",
      email: "spider@auto-harvest.net",
      destination: "Global",
      _gotcha: "I am a hidden bot trap field that real humans never fill",
    },
    triggerRule: "Rule #1: Silent Honeypot Trap field `_gotcha` contained text input",
    metadata: {
      ip: "185.220.101.5",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HeadlessChrome/119.0.0.0",
    },
  },
  {
    id: "spam_203",
    senderName: "Best SEO Rankers",
    senderEmail: "ranking@fast-seo-service.org",
    formId: "form_demo",
    formName: "Demo Request",
    receivedAt: getRelativeDate(1, 4, 10), // Yesterday
    disposition: "Quarantined",
    reason: "Repetitive content",
    messageSnippet: "Dear webmaster, your domain ranking is falling behind competitors. We analyzed your page tags and discovered critical flaws...",
    rawPayload: {
      name: "Best SEO Rankers",
      email: "ranking@fast-seo-service.org",
      team_size: "1",
      message: "Dear webmaster, your domain ranking is falling behind competitors...",
    },
    triggerRule: "Rule #5: Content matches high-frequency bulk marketing spam heuristics (>98% match across 40 tenants)",
    metadata: {
      ip: "194.26.29.112",
    },
  },
  {
    id: "spam_204",
    senderName: "Spam Script Runner 14",
    senderEmail: "bot14@massping.ru",
    formId: "form_portfolio",
    formName: "Portfolio Contact",
    receivedAt: getRelativeDate(3, 2, 0),
    disposition: "Rejected",
    reason: "Rate limit exceeded",
    messageSnippet: "Automated burst of 60 POST requests within 10 seconds from identical subnet.",
    rawPayload: {
      name: "Spam Script Runner 14",
      email: "bot14@massping.ru",
      message: "test test test 123",
    },
    triggerRule: "Rule #2: IP subnet rate limit exceeded (60 req/min threshold breached)",
    metadata: {
      ip: "91.240.118.4",
    },
  },
  {
    id: "spam_205",
    senderName: "Temporary Guest",
    senderEmail: "inbox7718@tempmail.ninja",
    formId: "form_travzo",
    formName: "Travzo Waitlist",
    receivedAt: getRelativeDate(5, 7, 0),
    disposition: "Rejected",
    reason: "Disposable email",
    messageSnippet: "Testing waitlist signup from burner mailbox.",
    rawPayload: {
      name: "Temporary Guest",
      email: "inbox7718@tempmail.ninja",
    },
    triggerRule: "Rule #3: Block throwaway & disposable email domains (tempmail.ninja)",
    metadata: {
      ip: "109.236.81.2",
    },
  },
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: "key_1",
    name: "Production Web Hook",
    keyPrefix: "sln_live_49f8...",
    fullKeyMock: "sln_live_49f8a2e091b6c8d7410f92",
    createdAt: getRelativeDate(25),
    lastUsedAt: getRelativeDate(0, 0, 24), // Used 24m ago
    revoked: false,
  },
  {
    id: "key_2",
    name: "Staging / Localhost Form Test",
    keyPrefix: "sln_test_88bc...",
    fullKeyMock: "sln_test_88bc91127ea044bb7139d1",
    createdAt: getRelativeDate(18),
    lastUsedAt: getRelativeDate(1, 4, 0),
    revoked: false,
  },
  {
    id: "key_3",
    name: "Legacy Next.js API Route",
    keyPrefix: "sln_live_12ea...",
    fullKeyMock: "sln_live_12ea773010f992a7620bc3",
    createdAt: getRelativeDate(45),
    lastUsedAt: getRelativeDate(12),
    revoked: true,
  },
];

export const INITIAL_WEBHOOK: WebhookConfig = {
  id: "wh_1",
  url: "https://api.acmestudio.design/webhooks/salenova",
  enabled: true,
  events: {
    leadCreated: true,
    spamQuarantined: false,
  },
  secret: "whsec_98f24bc109a744e8bc29",
};

export const INITIAL_NOTIFICATIONS: NotificationSettings = {
  emailAlertsEnabled: true,
  alertEmail: "alex@acmestudio.design",
  dailyDigest: false,
  spamAlerts: true,
};

export const INITIAL_DELIVERY_LOGS: DeliveryLogItem[] = [
  {
    id: "log_1",
    type: "webhook",
    destination: "https://api.acmestudio.design/webhooks/salenova",
    event: "lead.created",
    status: "success",
    statusCode: 200,
    latencyMs: 84,
    timestamp: getRelativeDate(0, 0, 24),
  },
  {
    id: "log_2",
    type: "email",
    destination: "alex@acmestudio.design",
    event: "lead.notification",
    status: "success",
    statusCode: 250,
    latencyMs: 142,
    timestamp: getRelativeDate(0, 0, 24),
  },
  {
    id: "log_3",
    type: "webhook",
    destination: "https://api.acmestudio.design/webhooks/salenova",
    event: "lead.created",
    status: "success",
    statusCode: 200,
    latencyMs: 91,
    timestamp: getRelativeDate(0, 2, 10),
  },
  {
    id: "log_4",
    type: "email",
    destination: "alex@acmestudio.design",
    event: "lead.notification",
    status: "success",
    statusCode: 250,
    latencyMs: 118,
    timestamp: getRelativeDate(0, 4, 45),
  },
  {
    id: "log_5",
    type: "webhook",
    destination: "https://api.acmestudio.design/webhooks/salenova",
    event: "lead.created",
    status: "failed",
    statusCode: 504,
    latencyMs: 5002,
    timestamp: getRelativeDate(1, 6, 0),
    errorDetail: "504 Gateway Timeout: Endpoint did not respond within 5000ms deadline",
  },
];
