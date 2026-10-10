import React from "react";

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
  | "supabase"
  | "openai"
  | "linear"
  | "github"
  | "tailwind"
  | "astro";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = "w-[14px] h-[14px]", ...props }: IconProps) {
  switch (name) {
    case "logo":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3a9 9 0 1 0 9 9" fill="none" />
          <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "bolt":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M13 3 5 14h6l-1 7 8-11h-6z" />
        </svg>
      );
    case "shield":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "cpu":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </svg>
      );
    case "bell":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4" />
        </svg>
      );
    case "db":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3 3 7 3s7-1.3 7-3" />
        </svg>
      );
    case "code":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      );
    case "mail":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "lock":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "hook":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
          <circle cx="12" cy="6" r="3" />
          <path d="m12 9-3.5 6M10 17h4M13.5 8.5l3 6" />
        </svg>
      );
    case "term":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 10 3 2-3 2M12 15h5" />
        </svg>
      );
    case "chk":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="m5 12 5 5 9-10" />
        </svg>
      );
    case "layers":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5" />
        </svg>
      );
    case "brief":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M9 8V5h6v3" />
        </svg>
      );
    case "cur":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="m4 3 7 17 2.5-7.5L21 10z" />
        </svg>
      );
    case "star":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "arrow":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "copy":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      );
    case "menu":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M4 9h16M4 15h16" />
        </svg>
      );
    case "x":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "plus":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "vercel":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          {...props}
        >
          <path d="M12 2L22 19.5H2L12 2Z" />
        </svg>
      );
    case "supabase":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          {...props}
        >
          <path d="M12.5 2L4 13.5H11L9.5 22L19 9.5H11.5L12.5 2Z" />
        </svg>
      );
    case "openai":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M7 12h10" />
        </svg>
      );
    case "linear":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M3 3l18 18M3 12l9 9M12 3l9 9" />
        </svg>
      );
    case "github":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case "tailwind":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          {...props}
        >
          <path d="M12 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 3-2.3 5-1.7 1.2.4 2 1.2 3 2.1 1.5 1.5 3.2 3.3 7 3.3 3.3 0 5.3-1.7 6-5-1.3 1.7-3 2.3-5 1.7-1.2-.4-2-1.2-3-2.1-1.6-1.5-3.3-3.3-7-3.3zM6 13c-3.3 0-5.3 1.7-6 5 1.3-1.7 3-2.3 5-1.7 1.2.4 2 1.2 3 2.1 1.5 1.5 3.2 3.3 7 3.3 3.3 0 5.3-1.7 6-5-1.3 1.7-3 2.3-5 1.7-1.2-.4-2-1.2-3-2.1-1.6-1.5-3.3-3.3-7-3.3z" />
        </svg>
      );
    case "astro":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          <path d="M12 3L7 19l5-3 5 3L12 3z" />
          <path d="M9.5 14h5" />
        </svg>
      );
    default:
      return null;
  }
}
