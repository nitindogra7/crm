import type { ReactNode } from "react";
import Link from "@/shared/components/app-link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import styles from "./auth-frame.module.css";

export type AuthMode = "sign-in" | "sign-up" | "onboarding";
const content = {
  "sign-in": { label: "Welcome back", title: "Every connection,\none clear view.", description: "Your forms, leads, and next steps. Right where you left them." },
  "sign-up": { label: "A fresh start", title: "Big ideas start\nwith a connection.", description: "A simpler way to capture leads and grow what you are building." },
  onboarding: { label: "Make it yours", title: "A little setup.\nA world of possibility.", description: "Bring your forms and your team into one calm, connected workspace." },
};

export function AuthFrame({ mode, children, account }: { mode: AuthMode; children: ReactNode; account?: ReactNode }) {
  const scene = content[mode];
  return <div className={styles.frame} data-mode={mode}>
    <aside className={styles.visual}>
      <div className={styles.caption}><span className={styles.badge}><i />{scene.label}</span><h2>{scene.title}</h2><p>{scene.description}</p></div>
      <span className={styles.visualFoot}>Less busywork. More possibility.</span>
    </aside>
    <section className={styles.panel}>
      <header className={styles.header}><Brand />{account ? <div className={styles.account}>{account}</div> : <Link href="/" className={styles.back}>Back to website <ArrowUpRight size={14} /></Link>}</header>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footer}>Infraly &middot; Built for your next connection</footer>
    </section>
  </div>;
}
