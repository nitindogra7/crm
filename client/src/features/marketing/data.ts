export interface NavLink {
  label: string;
  href: string;
}

export interface TrustedCategory {
  label: string;
  sublabel?: string;
  icon?: string;
}

export interface AdaptabilityCard {
  title: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
  colSpan: string;
}

export interface PricingPlan {
  name: string;
  badge?: string;
  sub: string;
  price: string;
  period: string;
  isPopular: boolean;
  available: boolean;
  features: string[];
  btnVariant: "outline" | "gradient";
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  tag?: string;
  avatar: string;
}

export interface FooterLink {
  label: string;
  href?: string;
  action?: "inquiry";
}

export interface MarketingData {
  brand: {
    name: string;
    tagline: string;
    ariaLabel: string;
  };
  navbar: {
    brandName: string;
    links: NavLink[];
    loginText: string;
    ctaText: string;
  };
  hero: {
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    rating: {
      score: string;
      reviews: string;
    };
    trustedBy: {
      title: string;
      highlight: string;
      suffix: string;
      items: TrustedCategory[];
    };
  };
  adaptability: {
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    cards: {
      setup: AdaptabilityCard & { adminLabel: string; memberLabel: string };
      global: AdaptabilityCard & { locations: string[] };
      teamwork: AdaptabilityCard & { userBadge: { name: string; timestamp: string } };
    };
  };
  integrationsDark: {
    headline: string;
    headlineApps: string;
    headlineGradient: string;
    headlineExperience: string;
    description: string;
    ctaText: string;
  };
  monitorDark: {
    headline: string;
    headlineUser: string;
    headlineGradient: string;
    headlineTime: string;
    description: string;
    ctaText: string;
  };
  faq: {
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    items: FaqItem[];
  };
  pricing: {
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    plans: PricingPlan[];
  };
  testimonials: {
    headline: string;
    headlineHighlight: string;
    subtitle: string;
    featured: TestimonialItem;
    stacked: {
      top: TestimonialItem;
      bottom: TestimonialItem;
    };
    secondary: TestimonialItem;
  };
  footer: {
    banner: {
      headline: string;
      headlineHighlight: string;
      primaryCta: string;
      secondaryCta: string;
    };
    exploreLinks: FooterLink[];
    communityLinks: FooterLink[];
    supportLinks: FooterLink[];
    newsletter: {
      placeholder: string;
      buttonText: string;
      successMessage: string;
    };
    copyright: string;
    legalLinks: FooterLink[];
  };
  dialogs: {
    defaultTitle: string;
    planTitlePrefix: string;
    defaultDescription: string;
    planDescriptionTemplate: (plan: string) => string;
    toastCaptured: (name: string) => string;
  };
}

export const marketingData: MarketingData = {
  brand: {
    name: "Infraly",
    tagline: "Developer-First Form Endpoints, Spam Shield & Inbound Lead Inbox",
    ariaLabel: "Infraly home",
  },
  navbar: {
    brandName: "Infraly",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#integrations" },
      { label: "Analytics", href: "#analytics" },
      { label: "Pricing", href: "#pricing" },
    ],
    loginText: "Login",
    ctaText: "Try for free",
  },
  hero: {
    headline: "Capture every lead,",
    headlineHighlight: "without building a backend.",
    subtitle:
      "Turn any HTML form or frontend component into a live endpoint in seconds. Collect clean leads, block bot spam with silent honeypots, and forward payloads via webhooks—with zero backend code.",
    primaryCta: "Try for free",
    secondaryCta: "Docs",
    rating: {
      score: "5.0",
      reviews: "Loved by Freelancers & Agencies",
    },
    trustedBy: {
      title: "Used by",
      highlight: "freelancers, digital agencies,",
      suffix: "and modern builders worldwide.",
      items: [
        { label: "Digital Agencies", sublabel: "Client Form Stacks", icon: "agency" },
        { label: "Freelance Devs", sublabel: "Zero Backend Setup", icon: "code" },
        { label: "Web Studios", sublabel: "Framer & Webflow Forms", icon: "studio" },
        { label: "Indie Founders", sublabel: "Instant Inbound Leads", icon: "rocket" },
        { label: "Growth Marketers", sublabel: "Spam-Free Submissions", icon: "chart" },
      ],
    },
  },
  adaptability: {
    headline: "Form infrastructure designed to fit your workflow,",
    headlineHighlight: "from first submit to scale.",
    subtitle:
      "Infraly handles form ingestion, silent spam filtering, and lead organization so you don't have to build custom form handlers or maintain database servers.",
    cards: {
      setup: {
        title: "Instant Form Endpoints",
        description:
          "Point any form action or fetch request directly to your Infraly endpoint URL. Supports custom redirect URLs and parses custom fields automatically.",
        adminLabel: "Admin",
        memberLabel: "Member",
      },
      global: {
        title: "Multi-Workspace Isolation",
        description:
          "Create separate workspaces for different client projects, landing pages, or domains with isolated endpoints, forms, and API keys.",
        locations: ["Indonesia", "Japan", "Korea"],
      },
      teamwork: {
        title: "Spam Shield & Lead Pipeline",
        description:
          "Triage clean leads, update contact status from New to Contacted, and rescue quarantined submissions with a single click.",
        userBadge: {
          name: "Rayhan",
          timestamp: "16:32:24",
        },
      },
    },
  },
  integrationsDark: {
    headline: "Easily connects with your",
    headlineApps: "stack",
    headlineGradient: "for a seamless",
    headlineExperience: "lead workflow.",
    description:
      "Capture submissions from Next.js, React, Webflow, Framer, or static HTML in seconds. Dispatch verified leads instantly to Slack, Zapier, or your database via Webhooks—while silent honeypots stop spam automatically.",
    ctaText: "Explore Documentation",
  },
  monitorDark: {
    headline: "Monitor form traffic & spam",
    headlineUser: "quarantine",
    headlineGradient: "in real",
    headlineTime: "time.",
    description:
      "Track submission volume, clean leads versus quarantined spam, and conversion rates across all your forms. Export detailed CSV reports anytime.",
    ctaText: "Learn More",
  },
  faq: {
    headline: "Frequently asked",
    headlineHighlight: "questions.",
    subtitle: "Everything you need to know about Infraly features, APIs, and form endpoints.",
    items: [
      {
        q: "How do I connect my frontend forms to Infraly?",
        a: "Simply set your form's action attribute to your Infraly endpoint URL (e.g. POST /api/f/{slug}) or send a POST request with JSON using fetch(). Infraly automatically captures standard fields (name, email, message) and stores all additional custom fields without extra schema configuration.",
        colSpan: "md:col-span-7",
      },
      {
        q: "How does the silent honeypot protect against spam?",
        a: "Add a hidden input field named _gotcha or _hp to your form. Legitimate users will leave it empty, but automated spam bots will fill it. Infraly silently quarantines those submissions along with disposable email domains, keeping your lead inbox 100% clean without annoying CAPTCHAs.",
        colSpan: "md:col-span-5",
      },
      {
        q: "What happens if a legitimate submission is flagged as spam?",
        a: "Suspicious submissions are quarantined in your Spam Shield instead of being discarded. You can inspect the sender IP, User-Agent, and raw JSON payload at any time, and click 'Rescue Lead' to instantly restore it to your active Leads inbox.",
        colSpan: "md:col-span-5",
      },
      {
        q: "Can I forward leads to webhooks or submit via REST API?",
        a: "You can capture leads directly using your workspace API key (x-api-key). Webhook forwarding is coming soon and is currently disabled.",
        colSpan: "md:col-span-7",
      },
    ],
  },
  pricing: {
  "headline": "Plans for",
  "headlineHighlight": "forms and leads.",
  "subtitle": "From your first website form to a workspace for every client.",
  "plans": [
    {
      "name": "Starter",
      "sub": "Form capture and a lead inbox for your website.",
      "price": "Free",
      "period": "forever",
      "available": true,
      "isPopular": false,
      "features": [
        "Public form endpoints",
        "Lead inbox and status tracking",
        "Honeypot and email checks",
        "Custom thank-you redirects",
        "Lead export to CSV"
      ],
      "btnVariant": "outline"
    },
    {
      "name": "Pro",
      "badge": "More visibility",
      "sub": "Submission insights and spam review for your team.",
      "price": "$5",
      "available": false,
      "period": "/ month",
      "isPopular": true,
      "features": [
        "Everything in Starter",
        "Custom fields for your forms",
        "Spam review and lead rescue",
        "Submission trends and source analytics",
        "Separate test and production data"
      ],
      "btnVariant": "gradient"
    },
    {
      "name": "Business",
      "sub": "Client workspaces and server integrations in one place.",
      "price": "$12",
      "available": false,
      "period": "/ month",
      "isPopular": false,
      "features": [
        "Everything in Pro",
        "Multiple client workspaces",
        "Environment-specific API keys",
        "Server-to-server lead submissions",
        "Production website origin controls"
      ],
      "btnVariant": "outline"
    }
  ]
},
  testimonials: {
    headline: "Hear directly from businesses that",
    headlineHighlight: "succeed with Infraly.",
    subtitle: "Discover how modern teams automate form capture and convert more leads.",
    featured: {
      quote:
        "Infraly replaced our custom form backend scripts in minutes. The honeypot filter caught hundreds of bot submissions silently, and the lead status tracking keeps our follow-up process organized.",
      name: "Esther Howard",
      role: "Operations Director",
      tag: "Clean lead inbox, zero bot spam.",
      avatar: "/testimonials/avatar-esther.png",
    },
    stacked: {
      top: {
        quote: "We point our Next.js and static landing page forms straight to Infraly endpoints. It captures all our custom fields with zero server maintenance.",
        name: "Guy Hawkins",
        role: "Lead Frontend Architect",
        avatar: "/testimonials/avatar-guy.png",
      },
      bottom: {
        quote: "The Spam Shield and one-click lead rescue feature give us total confidence that we never lose an inquiry, while webhooks keep our tools in sync.",
        name: "Robert Fox",
        role: "Founder & Developer",
        avatar: "/testimonials/avatar-fox.png",
      },
    },
    secondary: {
      quote:
        "Having instant form endpoints, webhook signatures, and built-in CSV exports out of the box saved our team weeks of building repetitive form backend infrastructure.",
      name: "Jacob Jones",
      role: "Engineering Lead",
      tag: "Saved weeks of backend setup.",
      avatar: "/testimonials/avatar-jacob.png",
    },
  },
  footer: {
    banner: {
      headline: "Stop building form backends from scratch.",
      headlineHighlight: "Start capturing clean leads with Infraly.",
      primaryCta: "Try for free",
      secondaryCta: "Docs",
    },
    exploreLinks: [
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonials", href: "#testimonials" },
    ],
    communityLinks: [
      { label: "Blog", href: "#blog" },
      { label: "Resources", href: "#resources" },
      { label: "Partners", href: "#partners" },
      { label: "Contact", action: "inquiry" },
    ],
    supportLinks: [
      { label: "Help Center", href: "/docs" },
      { label: "FAQs", href: "#faq" },
      { label: "Documentation", href: "/docs" },
    ],
    newsletter: {
      placeholder: "Email",
      buttonText: "Subscribe",
      successMessage: "✓ Thanks for subscribing!",
    },
    copyright: "© Infraly 2026. All rights reserved.",
    legalLinks: [
      { label: "Terms of Service", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
    ],
  },
  dialogs: {
    defaultTitle: "Request an Infraly demo",
    planTitlePrefix: "Get started with ",
    defaultDescription: "See how Infraly captures form submissions, blocks spam with silent honeypots, and organizes your inbound leads.",
    planDescriptionTemplate: (plan: string) =>
      `Experience our ${plan} plan capabilities. Submit a test form to see Infraly in action.`,
    toastCaptured: (name: string) =>
      `Thanks ${name}! Your demo submission was captured in Infraly.`,
  },
};
