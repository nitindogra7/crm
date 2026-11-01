"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "@/shared/components/app-link";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleCheck, Code2, FileText, Globe2, Inbox, Layers3, Menu, Plus, Sparkles, Sun, X } from "lucide-react";
import styles from "./marketing-landing-page.module.css";

const questions = [
  { q: "What can I do with Infraly?", a: "Connect your website forms to a dedicated lead inbox. Keep names, contact details, and messages together, filter spam, and track each enquiry from new to contacted to qualified." },
  { q: "Will it work with my existing website?", a: "Yes. Keep your website and connect its forms to Infraly. It is a one-time setup that whoever looks after your website can help with. After that, you can read and organise enquiries yourself." },
  { q: "Do I need to build a form backend?", a: "No. Infraly handles receiving submissions and organising them in your inbox. Connect your website form to your Infraly endpoint to start collecting enquiries." },
  { q: "How does spam protection work?", a: "Incoming messages are checked for spam. Flagged submissions go to a separate area so they stay out of your lead inbox. You can still review them whenever you need to." },
  { q: "Can I start for free?", a: "Yes. The Free plan is available now. Pro and Business are planned options; paid subscriptions are not available yet. You can create a free account today." },
];
const plans = [
  { name: "Free", price: "$0", description: "A simple home for your first website leads.", features: ["Website enquiry inbox", "Contact details in one place", "Lead status tracking", "Spam filtering and review"], available: true },
  { name: "Pro", price: "$5", description: "Planned tools for a clearer view of your leads.", features: ["Everything in Free", "Enquiry activity over time", "Enquiries grouped by form", "Spreadsheet exports"], available: false },
  { name: "Business", price: "$12", description: "Planned tools for managing more enquiries.", features: ["Everything in Pro", "Manage enquiries across forms", "Source, status, and date filters", "Bulk enquiry updates"], available: false },
];
const navigation = [["How it works", "#how-it-works"], ["Features", "#features"], ["Pricing", "#pricing"], ["FAQs", "#questions"], ["Docs", "/docs"]];

function Brand() {
  return <Link href="/" className={styles.brand} aria-label="Infraly home"><span className={styles.brandMark}><Sun size={20} strokeWidth={2.5} /></span>infraly<span className={styles.brandDot}>.</span></Link>;
}
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ y: reduced ? 0 : 18 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduced ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
function Badge({ children, icon = <Sparkles size={12} /> }: { children: ReactNode; icon?: ReactNode }) {
  return <span className={styles.badge}>{icon}{children}</span>;
}
function SectionHeading({ badge, title, description }: { badge: string; title: ReactNode; description?: string }) {
  return <Reveal className={styles.sectionHeading}><Badge>{badge}</Badge><h2>{title}</h2>{description && <p>{description}</p>}</Reveal>;
}

function HeroPreview() {
  const [selectedMonth, setSelectedMonth] = useState(5);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const performance = Array.from({ length: 48 }, (_, index) => ({
    total: 24 + (index * 17 + index % 5 * 13) % 72,
    good: 12 + (index * 11 + index % 3 * 7) % 34,
  }));
  function arcPath(start: number, end: number) {
    const point = (fraction: number) => {
      const angle = Math.PI * (1 - fraction);
      return `${160 + 117 * Math.cos(angle)} ${177 - 117 * Math.sin(angle)}`;
    };
    return `M ${point(start)} A 117 117 0 0 1 ${point(end)}`;
  }
  return (
    <div className={styles.previewTriptych} id="see-it-in-action" role="group" aria-label="Example website lead dashboard">
      <Reveal className={`${styles.signalPanel} ${styles.corePanel}`} delay={0.1}>
        <svg viewBox="0 0 340 156" role="img" aria-label="Example lead status breakdown: 92 leads, 30 percent new, 46 percent contacted, 24 percent qualified">
          <defs>
            <linearGradient id="vital-blue" x2="0" y2="1"><stop stopColor="#99b9ff" /><stop offset="1" stopColor="#548cf1" /></linearGradient>
            <linearGradient id="vital-purple" x2="0" y2="1"><stop stopColor="#b4a7ff" /><stop offset="1" stopColor="#8572ed" /></linearGradient>
            <linearGradient id="vital-cyan" x2="0" y2="1"><stop stopColor="#84e0fa" /><stop offset="1" stopColor="#13bde9" /></linearGradient>
          </defs>
          <text x="13" y="25" className={styles.chartTitle}>Lead Status</text>
          <circle cx="113" cy="21" r="3.6" fill="none" stroke="#8b8b91" strokeWidth=".7" /><text x="112.2" y="23" fontSize="5" fill="#8b8b91">i</text>
          <text x="320" y="23" fill="#777" fontSize="13">···</text>
          <text x="13" y="69" className={styles.vitalScore}>92</text>
          <rect x="13" y="80" width="34" height="15" rx="7" fill="#fff0f1" /><text x="18" y="90.5" fontSize="8" fill="#c67c87">Leads</text><text x="53" y="90.5" fontSize="8" fill="#8b8b92">this month</text>
          {[["New 30%", 13, 113, "#6295f5"], ["Contacted 46%", 77, 113, "#9a83f3"], ["Qualified 24%", 13, 128, "#20c6e9"]].map(([label, x, y, color]) => <g key={label}><rect x={Number(x)} y={Number(y) - 5} width="5" height="5" rx="1" fill={String(color)} /><text x={Number(x) + 9} y={Number(y)} fontSize="7" fill="#8b8b92">{label}</text></g>)}
          {[{ x: 200, count: 4, color: "blue" }, { x: 236, count: 5, color: "purple" }, { x: 272, count: 3, color: "cyan" }].map(column => <g key={column.color}>{Array.from({ length: column.count }, (_, index) => <rect key={index} x={column.x} y={130 - index * 21} width="31" height="17" rx="4" fill={`url(#vital-${column.color})`} stroke="#ffffff" strokeOpacity=".55" strokeWidth=".7" />)}</g>)}
        </svg>
      </Reveal>
      <Reveal className={styles.insightsPanel}>
        <div className={styles.insightsInner}>
          <svg viewBox="0 0 320 300" role="img" aria-label="Example lead inbox overview: 92 website leads this month, 42 contacted, 22 qualified">
            <defs>
              <linearGradient id="insights-blue" x1="40" y1="175" x2="170" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#73a7fa" /><stop offset="1" stopColor="#9bb6fa" /></linearGradient>
              <linearGradient id="insights-purple" x1="160" y1="60" x2="270" y2="130" gradientUnits="userSpaceOnUse"><stop stopColor="#b5aafa" /><stop offset="1" stopColor="#a28ff1" /></linearGradient>
              <linearGradient id="insights-cyan" x1="265" y1="125" x2="280" y2="177" gradientUnits="userSpaceOnUse"><stop stopColor="#8cdefa" /><stop offset="1" stopColor="#50cbed" /></linearGradient>
              <filter id="arc-softness" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35" /></filter>
            </defs>
            <text x="10" y="24" className={styles.insightsTitle}>Your Website Leads</text><text x="299" y="23" fontSize="13" fill="#666">⋮</text>
            <path d="M 43 177 A 117 117 0 0 1 277 177" stroke="#f0f3fa" strokeWidth="13" fill="none" />
            {[{ color: "blue", start: 0, end: 0.53 }, { color: "purple", start: 0.545, end: 0.835 }, { color: "cyan", start: 0.855, end: 1 }].map(arc => <g key={arc.color}><path d={arcPath(arc.start, arc.end)} stroke={`url(#insights-${arc.color})`} strokeWidth="11" strokeLinecap="round" fill="none" /><path d={arcPath(arc.start, arc.end)} transform="translate(0 -2)" stroke="#ffffff" strokeOpacity=".35" strokeWidth="2" fill="none" filter="url(#arc-softness)" /></g>)}
            <path d="M 61 177 A 99 99 0 0 1 160 78" stroke="#0795a8" strokeWidth="3.3" strokeLinecap="round" fill="none" /><circle cx="160" cy="78" r="5" fill="#cce8ed" stroke="#7bbec9" strokeWidth="1" /><circle cx="160" cy="78" r="2" fill="#0595a7" />
            <rect x="124" y="93" width="74" height="17" rx="8.5" fill="#fff" stroke="#f3f4f6" /><circle cx="133" cy="101.5" r="1.6" fill="#0795a8" /><text x="139" y="104" fontSize="6.3" fill="#6f7277">Website Enquiries</text>
            <text x="160" y="143" textAnchor="middle" className={styles.visitorValue}>92</text><text x="160" y="162" textAnchor="middle" fontSize="9" fill="#343437">Leads This Month</text>
            {[["New", 48, "#6f9ff7"], ["Contacted", 132, "#9b83ec"], ["Qualified", 202, "#50c9e8"]].map(([label, x, color]) => <g key={label}><circle cx={Number(x)} cy="197" r="2.6" fill={String(color)} /><text x={Number(x) + 7} y="200" fontSize="7.4" fill="#939398">{label}</text></g>)}
            {[{ x: 10, title: "Contacted Leads", value: "42" }, { x: 165, title: "Qualified Leads", value: "22" }].map(metric => <g key={metric.title}><rect x={metric.x} y="239" width="145" height="51" rx="6" fill="#fafafa" stroke="#e9e9ed" /><text x={metric.x + 72.5} y="257" textAnchor="middle" fontSize="7.5" fill="#88888e">{metric.title} ⓘ</text><text x={metric.x + 72.5} y="279" textAnchor="middle" fontSize="18" fill="#242426" letterSpacing="-.5">{metric.value}</text></g>)}
          </svg>
        </div>
      </Reveal>
      <Reveal className={`${styles.signalPanel} ${styles.performancePanel}`} delay={0.2}>
        <svg viewBox="0 0 340 169" role="img" aria-label={`Example form submissions. Selected month: ${months[selectedMonth]}`}>
          <text x="13" y="23" className={styles.chartTitle}>Form Submissions</text><circle cx="143" cy="20" r="2.6" fill="none" stroke="#a6a6ac" strokeWidth=".7" />
          <rect x="279" y="12" width="27" height="13" rx="4" fill="#fafafa" /><text x="289" y="21" fontSize="6" fill="#7b7b82">1Y</text><text x="319" y="22" fontSize="13" fill="#777">···</text>
          {[0, 1, 2, 3, 4].map(tick => <g key={tick}><line x1="13" y1={43 + tick * 23} x2="313" y2={43 + tick * 23} stroke="#f3f3f6" strokeWidth=".6" /><text x="319" y={46 + tick * 23} fontSize="5.5" fill="#a6a6ad">{100 - tick * 25}</text></g>)}
          {performance.map((bar, index) => <g key={index}><rect x={13 + index * 6.2} y={135 - bar.total} width="3" height={bar.total} rx="1.3" fill="#a394f7" /><rect x={13 + index * 6.2} y={135 - bar.good} width="3" height={bar.good} rx="1.3" fill="#38c7e9" /><rect x={13 + index * 6.2} y="130" width="3" height="5" fill="#13b8e0" /></g>)}
          {months.map((month, index) => <g key={month}><text x={24 + index * 24.6} y="146" textAnchor="middle" fontSize="5.5" fill="#93939b">{month}</text><rect x={13 + index * 24.6} y="35" width="24.6" height="115" fill="transparent" role="button" tabIndex={0} aria-label={`View ${month} submissions`} aria-pressed={selectedMonth === index} onMouseEnter={() => setSelectedMonth(index)} onFocus={() => setSelectedMonth(index)} onClick={() => setSelectedMonth(index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedMonth(index); } }} className={styles.monthTarget} /></g>)}
          <g className={styles.performanceTooltip} pointerEvents="none" transform={`translate(${Math.min(193, Math.max(40, 13 + selectedMonth * 24.6))},75)`}>
            <rect width="103" height="47" rx="5" fill="#fff" fillOpacity=".97" stroke="#eeedf4" /><text x="7" y="10" fontSize="5.5" fill="#8f8f98">{months[selectedMonth]}, 2026</text>
            {[["Accepted", "68", "#35c5e7"], ["Spam", "18", "#a594f5"], ["Rate limited", "6", "#dad5fa"]].map(([label, value, color], index) => <g key={label}><circle cx="8" cy={19 + index * 9} r="1.6" fill={color} /><text x="13" y={21 + index * 9} fontSize="5" fill="#777780">{label}</text><text x="95" y={21 + index * 9} textAnchor="end" fontSize="5" fill="#777780">{value}</text></g>)}
          </g>
          <text x="325" y="161" textAnchor="end" fontSize="5.5" fill="#aeb0b7">Example submission data</text>
        </svg>
      </Reveal>
    </div>
  );
}
function PerformanceRadar() {
  function points(scale: number, values = [1, 1, 1, 1, 1, 1]) {
    return values.map((value, index) => {
      const angle = (index * 60 - 120) * Math.PI / 180;
      return `${164 + Math.cos(angle) * 68 * scale * value},${102 + Math.sin(angle) * 68 * scale * value}`;
    }).join(" ");
  }
  return <div className={`${styles.analyticsScene} ${styles.radarScene}`}>
    <div className={styles.sceneOrbits} aria-hidden="true" />
    <div className={styles.radarCard}>
      <svg viewBox="0 0 330 278" role="img" aria-label="Example enquiries by form, comparing this month with last month">
        <defs><linearGradient id="radar-progress"><stop stopColor="#8eb6ff" /><stop offset="1" stopColor="#4b89f6" /></linearGradient></defs>
        <text x="12" y="22" fontSize="11" fill="#4c4c51">Enquiries by Form</text><text x="111" y="22" fontSize="8" fill="#96969c">ⓘ</text><text x="303" y="21" fontSize="14" fill="#777">···</text>
        {[1, .8, .6, .4, .2].map(scale => <polygon key={scale} points={points(scale)} fill="none" stroke="#e8edf5" strokeWidth=".6" />)}
        {Array.from({ length: 6 }, (_, index) => { const point = points(1).split(" ")[index].split(","); return <line key={index} x1="164" y1="102" x2={point[0]} y2={point[1]} stroke="#edf0f6" strokeWidth=".6" />; })}
        <polygon points={points(1, [.95, .99, .94, .65, .99, .96])} fill="#b5eef21a" stroke="#87d8e8" strokeWidth="1" />
        <polygon points={points(1, [.77, .67, .82, .91, .89, .71])} fill="#b8d0fb6e" stroke="#8ca9ef" strokeWidth="1" />
        {[points(1, [.95, .99, .94, .65, .99, .96]), points(1, [.77, .67, .82, .91, .89, .71])].map((polygon, series) => <g key={series}>{polygon.split(" ").map((point, index) => <circle key={index} cx={point.split(",")[0]} cy={point.split(",")[1]} r="1.1" fill={series ? "#899feb" : "#70d4de"} />)}</g>)}
        <g fontSize="7" fill="#77777d"><text x="127" y="34" textAnchor="middle">Contact</text><text x="201" y="34" textAnchor="middle">Demo</text><text x="239" y="105">Quote</text><text x="191" y="183" textAnchor="middle">Consultation</text><text x="104" y="165" textAnchor="middle">Callback</text><text x="50" y="105" textAnchor="middle">Other</text></g>
        <line x1="87" y1="201" x2="98" y2="201" stroke="#9dc8f4" strokeWidth="2" /><text x="102" y="204" fontSize="7" fill="#8e939c">This Month</text><line x1="175" y1="201" x2="186" y2="201" stroke="#8ad5bd" strokeWidth="2" strokeDasharray="2 1" /><text x="190" y="204" fontSize="7" fill="#8e939c">Last Month</text>
        {Array.from({ length: 51 }, (_, index) => <line key={index} x1={13 + index * 6.05} y1="225" x2={13 + index * 6.05} y2="246" stroke="#d8d8dc" strokeWidth="2" />)}
        <rect x="12" y="225" width="185" height="21" rx="5" fill="url(#radar-progress)" /><text x="105" y="239" fontSize="10" textAnchor="middle" fill="white">70 leads</text><line x1="201" y1="215" x2="201" y2="250" stroke="#5894f2" strokeWidth="1.4" /><circle cx="201" cy="219" r="2" fill="#5894f2" /><path d="m 198 218 3 -5 3 5" fill="#5894f2" /><line x1="316" y1="209" x2="316" y2="250" stroke="#b9b9c0" strokeWidth="1" />
        <text x="12" y="263" fontSize="7.5" fill="#36363b">Example monthly enquiries</text><text x="317" y="263" textAnchor="end" fontSize="7.5" fill="#36363b">100</text>
      </svg>
    </div>
  </div>;
}

function ConversionOverview() {
  const [selected, setSelected] = useState<number | null>(null);
  const channels = [{ label: "New", value: "30%", color: "#6e9bf4", top: 140 }, { label: "Contacted", value: "46%", color: "#9b87f1", top: 120 }, { label: "Qualified", value: "24%", color: "#2bc2e4", top: 99 }];
  return <div className={`${styles.analyticsScene} ${styles.conversionScene}`}><div className={styles.sceneOrbits} aria-hidden="true" /><div className={styles.conversionCard}>
    <svg viewBox="0 0 330 234" role="group" aria-label="Example lead status overview: 92 enquiries, 30 percent new, 46 percent contacted, 24 percent qualified">
      <defs>{channels.map((channel, index) => <linearGradient key={channel.label} id={`conversion-line-${index}`} x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor={channel.color} /></linearGradient>)}</defs>
      <text x="12" y="23" fontSize="14" fill="#2e2e33" letterSpacing="-.6">Lead Status Overview</text><text x="188" y="23" fontSize="10" fill="#96969e">ⓘ</text>
      <text x="12" y="57" fontSize="27" letterSpacing="-.8" fill="#29292e">92</text><rect x="94" y="39" width="49" height="18" rx="9" fill="#effff5" stroke="#b8e9d0" /><text x="118.5" y="51" textAnchor="middle" fontSize="8" fill="#43b37e">Leads</text><text x="12" y="77" fontSize="9" fill="#52525a">Website enquiries this month</text>
      {channels.map((channel, index) => { const x = 13 + index * 106; return <g key={channel.label}>
        <line x1={x} y1={channel.top} x2={x} y2="178" stroke="#c7c9d6" strokeWidth=".7" strokeDasharray="1 2" /><circle cx={x} cy={channel.top} r="1.7" fill={channel.color} />
        <rect x={x + 9} y={channel.top - 1} width="31" height="14" rx="7" fill="#fff" stroke={channel.color} strokeOpacity=".3" /><text x={x + 24.5} y={channel.top + 9} textAnchor="middle" fontSize="8" fill={channel.color}>{channel.value}</text>
        <text x={x + 1} y="181" fontSize="9" fill="#505058" letterSpacing="-.4">{channel.label}</text><rect x={x} y="191" width="81" height="4" rx="2" fill={`url(#conversion-line-${index})`} stroke={channel.color} strokeWidth=".7" />
        {selected === index && <rect x={x - 3} y="188" width="87" height="10" rx="4" fill={channel.color} fillOpacity=".1" />}
        <rect x={x - 3} y="89" width="96" height="111" fill="transparent" role="button" tabIndex={0} aria-label={`${channel.label}: ${channel.value}`} aria-pressed={selected === index} onClick={() => setSelected(selected === index ? null : index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(selected === index ? null : index); } }} className={styles.conversionTarget} />
      </g>; })}
      <rect x="12" y="207" width="306" height="23" rx="11.5" fill="#fafafa" stroke="#e9e9ed" /><rect x="21" y="215" width="7" height="7" rx="1" fill="#8a8a91" /><path d="m 22.5 218 1.5 1.5 2.5 -3" stroke="white" strokeWidth="1" fill="none" /><text x="34" y="222" fontSize="8" fill="#76767d" aria-live="polite">{selected === null ? "Track each enquiry from new to qualified" : `${channels[selected].label}: ${channels[selected].value} of example leads`}</text>
    </svg>
  </div></div>;
}
function IntegrationStrip({ second = false }: { second?: boolean }) {
  return <div className={styles.integrationStrip} aria-label={second ? "Lead follow-up stages" : "Website form examples"}>
    {second ? <><span><Inbox size={15} />New</span><span><Check size={15} />Contacted</span><span><CircleCheck size={15} />Qualified</span></> : <><span><FileText size={15} />Contact</span><span><Globe2 size={15} />Demo</span><span><FileText size={15} />Quote</span></>}
  </div>;
}

function MarketingFooter() {
  const [newsletterNotice, setNewsletterNotice] = useState(false);
  function subscribe(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setNewsletterNotice(true); }
  return <footer className={styles.referenceFooter}><div className={styles.footerLandscape} aria-hidden="true" /><div className={styles.referenceFooterInner}>
    <div className={styles.footerIntroRow}><div className={styles.referenceFooterBrand}><Brand /><p>The simple home for your website forms<br />and every lead that comes next.</p></div><div className={styles.newsletter}><label htmlFor="newsletter-email">Subscribe to our newsletter</label><form onSubmit={subscribe}><input id="newsletter-email" type="email" required autoComplete="email" placeholder="Enter your email" aria-describedby={newsletterNotice ? "newsletter-notice" : undefined} /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={18} /></button></form>{newsletterNotice && <p id="newsletter-notice" role="status">Newsletter sign-up is coming soon. You can create a free account today.</p>}</div></div>
    <div className={styles.footerLinkGrid}><nav aria-label="Products"><h3>Products</h3><a href="#main-content">Overview</a><a href="#how-it-works">Website forms</a><Link href="/dashboard" navigation>Lead inbox</Link><a href="#features">Lead activity</a><a href="#pricing">Plans & pricing</a></nav><nav aria-label="Features"><h3>Features</h3><a href="#how-it-works">Form submissions</a><Link href="/docs">Website integration</Link><a href="#features">Lead management</a><Link href="/docs">Spam protection</Link><a href="#features">Status tracking</a></nav><nav aria-label="Resources"><h3>Resources</h3><Link href="/docs">Documentation</Link><a href="#questions">Questions & answers</a><a href="#features">Product overview</a><a href="#how-it-works">Getting started</a><a href="#pricing">Compare plans</a></nav><nav aria-label="Support"><h3>Support</h3><Link href="/docs">Help center</Link><a href="#questions">Common questions</a><Link href="/dashboard" navigation>Create an account</Link></nav></div>
    <div className={styles.referenceFooterBottom}><span>©Copyright {new Date().getFullYear()} Infraly</span><Link href="/docs">Privacy & security</Link></div>
  </div></footer>;
}
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className={styles.faqSection} id="questions"><div className={`${styles.container} ${styles.faqLayout}`}><Reveal className={styles.faqIntro}><Badge>Good to know</Badge><h2>A few questions.<br />Clear answers.</h2><p>How setup, spam filtering, and the free plan work.</p><Link navigation href="/dashboard">Let’s get you started <ArrowUpRight size={15} /></Link></Reveal><Reveal className={styles.faqList}>{questions.map((item, index) => <div className={`${styles.faqItem} ${open === index ? styles.faqOpen : ""}`} key={item.q}><h3><button type="button" aria-expanded={open === index} aria-controls={`answer-${index}`} id={`question-${index}`} onClick={() => setOpen(open === index ? null : index)}>{item.q}<Plus size={17} /></button></h3><div id={`answer-${index}`} role="region" aria-labelledby={`question-${index}`} hidden={open !== index}><p>{item.a}</p></div></div>)}</Reveal></div></section>;
}

export function MarketingLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  return <div className={styles.page}>
    <a href="#main-content" className={styles.skipLink}>Skip to content</a>
    <header className={styles.header}><div className={`${styles.container} ${styles.navInner}`}><Brand /><nav className={styles.desktopNav} aria-label="Main navigation">{navigation.map(([label, href]) => <a href={href} key={href}>{label}{label === "Features" && <ChevronDown size={11} />}</a>)}</nav><div className={styles.navActions}><Link navigation href="/dashboard" className={styles.signIn}>Log in</Link><Link navigation href="/dashboard" className={styles.smallButton}>Get started <ArrowUpRight size={13} /></Link></div><button type="button" className={styles.menuToggle} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div><AnimatePresence>{menuOpen && <motion.nav className={styles.mobileNav} id="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>{navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={14} /></a>)}<Link navigation href="/dashboard">Log in <ArrowUpRight size={14} /></Link></motion.nav>}</AnimatePresence></header>
    <main id="main-content">
      <section className={styles.hero}><div className={styles.heroTexture} aria-hidden="true" /><div className={styles.container}><Reveal className={styles.heroCopy}><Badge icon={<span className={styles.liveDot} />}>Website forms + a simple CRM</Badge><h1>Turn website enquiries<br />into <span>your next customers.</span></h1><p>Infraly collects your form submissions in one lead inbox.<br className={styles.desktopBreak} /> Filter spam, see who needs a reply, and track every follow-up.</p><div className={styles.heroActions}><Link navigation href="/dashboard" className={styles.primaryButton}>Get started free <ArrowRight size={16} /></Link><Link navigation href="/dashboard" className={styles.secondaryButton}>Explore dashboard</Link></div><span className={styles.heroNote}>Start with a free account. Connect your existing website.</span></Reveal><HeroPreview /><div className={styles.audience}><p>For businesses, agencies, and developers who get enquiries through their websites.</p><div><span><Globe2 />Independent businesses</span><span><Layers3 />Studios & agencies</span><span><Code2 />Developers & makers</span><span><Sparkles />Service providers</span></div></div></div></section>
      <section className={styles.workflowSection} id="how-it-works"><div className={styles.container}><SectionHeading badge="How it works" title={<>Your website collects enquiries.<br />Infraly keeps them organised.</>} description="Connect a form, receive leads, and keep track of your follow-ups." /><div className={styles.workflow}>{[
        { icon: FileText, title: "Connect your website form", text: "Create a form in Infraly and add its submission URL to your website. No form backend to build.", step: "01" },
        { icon: Inbox, title: "Receive enquiries in one inbox", text: "See each person’s name, contact details, and message together. Review flagged spam separately.", step: "02" },
        { icon: CircleCheck, title: "Follow up with a clear next step", text: "Mark leads as new, contacted, or qualified so you know who still needs a reply.", step: "03" },
      ].map((item, index) => <Reveal className={styles.workflowCard} key={item.step} delay={index * 0.07}><span className={styles.stepNumber}>{item.step}</span><span className={styles.featureIcon}><item.icon size={22} strokeWidth={1.6} /></span><h3>{item.title}</h3><p>{item.text}</p><div className={styles.stepProgress} aria-hidden="true">{[0, 1, 2].map(step => <i key={step} className={step <= index ? styles.progressActive : ""} />)}</div></Reveal>)}</div></div></section>
      <section className={styles.featuresSection} id="features"><div className={styles.container}><SectionHeading badge="Features" title={<>Less time sorting enquiries.<br />More time winning customers.</>} /><div className={styles.referenceFeatureRows}>
        <Reveal className={styles.referenceFeatureRow}><div className={styles.referenceFeatureCopy}><h3>Every form. Every enquiry.<br />One place to manage it.</h3><p>Bring contact forms, demo requests, and quote enquiries into Infraly. Find the right lead by form, status, or date, with contact details and messages ready to review.</p><span className={styles.featureConnector} aria-hidden="true" /><IntegrationStrip /></div><div className={styles.referenceFeatureVisual} id="form-demo"><PerformanceRadar /></div></Reveal>
        <Reveal className={styles.referenceFeatureRow}><div className={styles.referenceFeatureCopy}><h3>Know who needs a reply.<br />Keep spam out of the way.</h3><p>Track each lead from new to contacted to qualified. Keep flagged spam in a separate inbox, so you can focus on real enquiries and review suspicious messages when needed.</p><span className={styles.featureConnector} aria-hidden="true" /><IntegrationStrip second /></div><div className={styles.referenceFeatureVisual}><ConversionOverview /></div></Reveal>
      </div><p className={styles.referenceDataNote}>Example lead data shown for illustration.</p></div></section>
      <section className={styles.pricingSection} id="pricing"><div className={styles.container}><SectionHeading badge="Pricing" title={<>Start collecting leads.<br />Start for free.</>} /><div className={styles.pricingGrid}>{plans.map((plan, index) => <Reveal key={plan.name} delay={index * 0.06} className={`${styles.priceCard} ${index === 1 ? styles.priceFeatured : ""}`}>{index === 1 && <span className={styles.planLabel}>Coming soon</span>}<h3>{plan.name}</h3><p className={styles.planDescription}>{plan.description}</p><div className={styles.price}><strong>{plan.price}</strong><span>/ month</span></div><div className={styles.priceDivider} /><span className={styles.includedLabel}>What’s included</span><ul>{plan.features.map(feature => <li key={feature}><Check size={14} />{feature}</li>)}</ul>{plan.available ? <Link navigation href="/dashboard" className={styles.secondaryButton}>Get started free <ArrowRight size={14} /></Link> : <Link navigation href="/dashboard" className={index === 1 ? styles.primaryButton : styles.secondaryButton}>{plan.name} coming soon <ArrowRight size={14} /></Link>}</Reveal>)}</div><p className={styles.pricingNote} id="plan-availability">Free is available today. Pro and Business are planned subscriptions; paid checkout is coming soon.</p></div></section>
      <Faq />
      <section className={styles.referenceCta}><div className={styles.referenceCtaOrbit} aria-hidden="true" /><Reveal className={styles.referenceCtaInner}><h2>Your next customer could be<br />one form submission away.</h2><p>Connect your website to Infraly and give every enquiry<br />a clear place in your follow-up list.</p><div className={styles.heroActions}><Link navigation href="/dashboard" className={styles.primaryButton}>Get started free <ArrowRight size={15} /></Link><Link navigation href="/dashboard" className={styles.secondaryButton}>Explore dashboard</Link></div></Reveal></section>
    </main>
    <MarketingFooter />
  </div>;
}