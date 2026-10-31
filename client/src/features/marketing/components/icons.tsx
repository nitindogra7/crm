import React from "react";
import Image from "next/image";

export function InfralyLogo({
  className = "w-7 h-7",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      src="/favicon.ico"
      alt="Infraly Logo"
      width={32}
      height={32}
      unoptimized
      style={style}
      className={`object-contain ${className}`}
      priority
    />
  );
}

export function ShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

export function InboxIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 4h14l3 10v6H2v-6zM2 14h6l2 3h4l2-3h6" />
    </svg>
  );
}

export function PlusIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MenuIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function LayersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5" />
    </svg>
  );
}

export function PlayIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 6 9 6-9 6z" />
    </svg>
  );
}

export type IconName =
  | "logo"
  | "bolt"
  | "shield"
  | "cpu"
  | "bell"
  | "db"
  | "code"
  | "mail"
  | "lock"
  | "hook"
  | "term"
  | "chk"
  | "layers"
  | "brief"
  | "cur"
  | "star"
  | "arrow"
  | "copy"
  | "menu"
  | "x"
  | "plus"
  | "vercel"
  | "openai"
  | "linear"
  | "github"
  | "tailwind"
  | "astro"
  | "rupee";

interface LegacyIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = "w-[14px] h-[14px]", ...props }: LegacyIconProps) {
  switch (name) {
    case "logo":
      return <InfralyLogo className={className} style={props.style} />;
    case "shield":
      return <ShieldIcon className={className} />;
    case "mail":
    case "inbox" as unknown as IconName:
      return <InboxIcon className={className} />;
    case "plus":
      return <PlusIcon className={className} />;
    case "menu":
      return <MenuIcon className={className} />;
    case "layers":
      return <LayersIcon className={className} />;
    case "chk":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M7 7h10v10M7 17 17 7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
