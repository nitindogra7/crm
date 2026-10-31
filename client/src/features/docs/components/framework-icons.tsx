import React from "react";

export interface TechIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export function TechIcon({ name, className = "w-5 h-5", ...props }: TechIconProps) {
  switch (name.toLowerCase()) {
    case "react":
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none" {...props}>
          <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
          <g stroke="#00d8ff" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case "nextjs":
    case "next":
      return (
        <svg viewBox="0 0 180 180" className={className} fill="none" {...props}>
          <circle cx="90" cy="90" r="86" fill="black" stroke="white" strokeWidth="6" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="white"
          />
          <path d="M115 54H127V126H115V54Z" fill="white" />
        </svg>
      );

    case "vue":
      return (
        <svg viewBox="0 0 256 221" className={className} {...props}>
          <path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="#41B883" />
          <path d="M0 0l128 220.8L256 0h-51.2L128 132.48 49.92 0H0z" fill="#41B883" />
          <path d="M50 0l78 133 78-133h-47l-31 53-31-53H50z" fill="#34495E" />
        </svg>
      );

    case "nuxt":
      return (
        <svg viewBox="0 0 256 185" className={className} fill="none" {...props}>
          <path
            d="M152.124 184.821c4.542 0 8.653-2.428 10.828-6.388L211.238 92.5c2.115-3.852 2.062-8.549-.14-12.355-2.203-3.806-6.305-6.145-10.72-6.145h-40.407L138.83 36.196c-2.185-3.93-6.326-6.385-10.803-6.385-4.478 0-8.618 2.455-10.804 6.385L7.29 216.711"
            fill="none"
          />
          <path
            d="M128.027 29.811c-4.478 0-8.618 2.455-10.804 6.385L9.933 227.086c-2.164 3.888-2.144 8.613.053 12.482s6.345 6.223 10.804 6.223h89.873c4.502 0 8.583-2.385 10.774-6.302l18.895-33.727 18.91 33.727c2.19 3.917 6.272 6.302 10.774 6.302h76.048c4.46 0 8.608-2.354 10.805-6.223s2.217-8.594.053-12.482L199.63 92.5c-2.186-3.93-6.326-6.385-10.803-6.385h-40.407L138.83 36.196c-2.185-3.93-6.326-6.385-10.803-6.385z"
            fill="#00DC82"
          />
        </svg>
      );

    case "svelte":
      return (
        <svg viewBox="0 0 106 128" className={className} fill="none" {...props}>
          <path
            d="M93.38 21.05C82.16 7.6 64.21 1.25 46.85 4.5 30.68 7.55 17.5 19.34 12.3 34.62c-6.84 20.09-.8 41.6 14.88 54.91-4.22 8.78-2.58 19.3 4.22 26.38 9.53 9.93 24.32 12.92 37.15 7.51 12.55-5.3 21.08-16.7 22.86-30.08.38-2.88.2-5.78-.51-8.58 10.95-7.38 17.76-19.46 17.92-32.61.16-12.18-5.35-23.75-15.44-31.1z"
            fill="#FF3E00"
          />
          <path
            d="M48.16 111.45c-8.62 1.6-17.55-.38-24.52-5.46-3.84-2.8-5.2-7.7-3.34-12.01 1.83-4.22 6.32-6.72 10.9-6.07 1.34.19 2.65.61 3.88 1.25 2.58 1.34 4.8 3.25 7.62 4.1 6.54 1.96 13.68-.02 18.23-5.06 4.74-5.26 5.6-12.75 2.16-18.89-3.48-6.19-10.15-9.87-17.2-10.02-8.52-.18-16.76-3.8-22.65-9.96-7.85-8.21-10.96-19.8-8.28-30.82 2.67-11.02 10.6-20.07 21.08-24.06 10.74-4.1 22.89-2.58 32.32 4.04 4.26 2.99 7.42 7.21 9.08 12.12 1.66 4.9.95 10.32-1.95 14.63-2.91 4.31-7.85 6.78-13.06 6.53-2.59-.12-5.13-.91-7.32-2.28-2.67-1.68-4.99-3.99-8.11-4.88-5.26-1.5-10.93.07-14.73 4.08-3.78 4-4.66 9.88-2.22 14.76 2.45 4.89 7.42 7.96 12.87 8.24 8.78.46 17.26 4.24 23.23 10.63 7.85 8.41 10.83 20.3 7.91 31.57-2.9 11.26-11.23 20.4-22.14 24.3-3.69 1.33-7.61 2.03-11.53 2.05-.04 0-.08 0-.12.01z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "angular":
      return (
        <svg viewBox="0 0 250 250" className={className} fill="none" {...props}>
          <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
          <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
          <path
            d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M142,135h-34l17-40.9L142,135z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "html":
    case "html5":
      return (
        <svg viewBox="0 0 512 512" className={className} fill="none" {...props}>
          <path d="M413.6 447L70.4 447 38.4 88.6 473.6 88.6z" fill="#E44D26" />
          <path d="M256 422.4l127.3-35.3 26.5-298.5H256z" fill="#F16529" />
          <path d="M256 208.5h-55.8l-3.8-43.2H256V122H152.8l11.5 129.5H256zm0 131.6l-.6.2-46.7-12.6-3-33.6h-43.2l5.9 66.2 87 24.2.6-.2z" fill="#EBEBEB" />
          <path d="M256 208.5v43.2h52l-4.9 55-47.1 12.7v44.9l87.1-24.1 12.3-131.7zm0-86.5v43.3h99.8l3.8-43.3z" fill="#FFFFFF" />
        </svg>
      );

    case "webflow":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#146EF5" {...props}>
          <path d="M17.85 4.85h-4.3l-2.4 7.6-2.4-7.6H4.45L2 14.5h3.9l1.4-4.8 2.2 7h3.9l2.2-7 1.4 4.8h3.9l-3.05-9.65z" />
          <path d="M22 9.7h-3.3l-1.3 4.8h3.3z" />
        </svg>
      );

    case "framer":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#0055FF" {...props}>
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
        </svg>
      );

    case "wordpress":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#21759B" {...props}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-8.8 10a8.7 8.7 0 0 1 2.2-5.8l5.2 14.3A8.8 8.8 0 0 1 3.2 12zm8.8 8.8a8.7 8.7 0 0 1-3.1-.6l3.3-9.6 3.4 9.3a8.7 8.7 0 0 1-3.6.9zm1.3-13.4c.7 0 1.3-.1 1.3-.1l.1.5s-.6.1-1.3.1c-.9 0-1.5.6-1.5 1.5 0 .7.4 1.4.8 2.1l2.4 7.1-2.2-6.5a14.7 14.7 0 0 0-1-2.9 2.5 2.5 0 0 1 1.4-1.8zm6.5 4.6a8.7 8.7 0 0 1 .4 2.8 8.7 8.7 0 0 1-2.5 6.1l4-11.5c.1.9.1 1.8.1 2.6z" />
        </svg>
      );

    case "python":
      return (
        <svg viewBox="0 0 128 128" className={className} fill="none" {...props}>
          <path
            d="M63.5 8C33 8 35 21.2 35 21.2v13.6h29.2v4.2H23.5S8 37.3 8 67.8c0 30.5 13.5 29.5 13.5 29.5h8.1V83.6s-.4-16.2 15.9-16.2h28.7s15.3.3 15.3-14.8V23.5S91.8 8 63.5 8zm-15.6 9c3 0 5.4 2.4 5.4 5.4s-2.4 5.4-5.4 5.4-5.4-2.4-5.4-5.4 2.4-5.4 5.4-5.4z"
            fill="#3776AB"
          />
          <path
            d="M64.5 120c30.5 0 28.5-13.2 28.5-13.2V93.2H63.8v-4.2h40.7s15.5 1.7 15.5-28.8c0-30.5-13.5-29.5-13.5-29.5h-8.1v13.7s.4 16.2-15.9 16.2H43.8s-15.3-.3-15.3 14.8v29.1s-2.3 15.5 26 15.5zm15.6-9c-3 0-5.4-2.4-5.4-5.4s2.4-5.4 5.4-5.4 5.4 2.4 5.4 5.4-2.4 5.4-5.4 5.4z"
            fill="#FFD438"
          />
        </svg>
      );

    case "nodejs":
    case "node":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#5FA04E" {...props}>
          <path d="M12 2L3 7.2v10.6l9 5.2 9-5.2V7.2L12 2zm-1 16.2H9.2v-5.6l-2.4 2-1.1-1.3 3.6-3h1.7v7.9zm6.1-2.4c0 1.5-1 2.5-2.6 2.5-1.5 0-2.4-.9-2.5-2.2l1.6-.2c.1.6.4 1 1 1 .5 0 .8-.3.8-.8 0-.5-.4-.7-1.1-1-1.2-.5-1.9-1.1-1.9-2.2 0-1.3 1-2.2 2.3-2.2 1.3 0 2.2.8 2.3 2l-1.6.2c-.1-.5-.3-.8-.8-.8-.4 0-.7.3-.7.7 0 .4.3.6 1 1 1.3.5 2 1.1 2 2z" />
        </svg>
      );

    case "curl":
    case "terminal":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );

    case "database":
    case "db":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );

    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );

    case "bolt":
    case "zap":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

