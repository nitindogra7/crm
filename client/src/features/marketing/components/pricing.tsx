import Link from "@/shared/components/app-link";
import { ArrowRight, Check } from "lucide-react";
import { marketingData } from "../data";
import styles from "./pricing.module.css";

export function Pricing() {
  const { pricing } = marketingData;
  return <section id="pricing" className={styles.section}>
    <div className={styles.container}>
      <header className={styles.heading}><p>Plan preview</p><h2>{pricing.headline} <span>{pricing.headlineHighlight}</span></h2><div>{pricing.subtitle}</div></header>
      <div className={styles.grid}>{pricing.plans.map(plan=><article key={plan.name} className={[styles.card,!plan.available?styles.unavailable:"",plan.isPopular?styles.featured:""].join(" ")}>
        <header><div className={styles.planName}><h3>{plan.name}</h3>{(!plan.available || plan.badge)&&<span>{plan.available ? plan.badge : "Coming soon"}</span>}</div><p>{plan.sub}</p><div className={styles.price}><strong>{plan.price}</strong><span>{plan.period}</span></div></header>
        <ul>{plan.features.map(feature=><li key={feature}><Check size={15}/><span>{feature}</span></li>)}</ul>
        {plan.available ? <Link href="/dashboard" className={styles.primaryCta}>Get started free<ArrowRight size={15}/></Link> : <button type="button" className={styles.secondaryCta} disabled aria-label={`${plan.name} plan coming soon`}>Coming soon</button>}
      </article>)}</div>
      <p className={styles.availability}>Starter is free. Pro and Business are coming soon; paid checkout is not available yet.</p>
    </div>
  </section>;
}
