import React from "react";
import Link from "next/link";
import { marketingData } from "../data";

export function IntegrationsDark() {
  const { integrationsDark } = marketingData;

  return (
    <section className="bg-black text-white py-20 sm:py-28 lg:py-32 relative overflow-hidden" id="integrations">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline, Copy & Actions */}
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold tracking-tight text-white leading-[1.16]">
              {integrationsDark.headline}
              <br />
              {integrationsDark.headlineApps}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5977f6] via-[#637df2] to-[#7b8ef8]">
                {integrationsDark.headlineGradient}
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5977f6] via-[#637df2] to-[#7b8ef8]">
                {integrationsDark.headlineExperience}
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-[460px]">
              {integrationsDark.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/docs"
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-98 inline-flex items-center gap-1.5"
              >
                {integrationsDark.ctaText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-sm font-normal border border-white/15 transition-all hover:border-white/30 active:scale-98 inline-flex items-center justify-center"
              >
                Get API Endpoint
              </Link>
            </div>
          </div>

          {/* Right Column: Infraly Integration Hub Diagram */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-[480px] aspect-[460/380] relative">
              <svg
                viewBox="0 0 460 380"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle node glow filter */}
                  <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
                  </filter>

                  {/* Center squircle glow */}
                  <filter id="center-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#3b82f6" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* --- CONNECTING LINES --- */}
                {/* Center to Top (Slack) */}
                <line
                  x1="230"
                  y1="162"
                  x2="230"
                  y2="74"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                />

                {/* Center to Bottom (Webhooks) */}
                <line
                  x1="230"
                  y1="218"
                  x2="230"
                  y2="306"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                />

                {/* Left Branch: Center -> React (Middle) */}
                <line
                  x1="202"
                  y1="190"
                  x2="97"
                  y2="190"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                />

                {/* Left Branch: Center -> Next.js (Top Left) */}
                <path
                  d="M 97 90 H 135 C 160 90 162 190 185 190"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* Left Branch: Center -> HTML5 (Bottom Left) */}
                <path
                  d="M 97 290 H 135 C 160 290 162 190 185 190"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* Right Branch: Center -> Framer (Middle) */}
                <line
                  x1="258"
                  y1="190"
                  x2="363"
                  y2="190"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                />

                {/* Right Branch: Center -> Webflow (Top Right) */}
                <path
                  d="M 275 190 C 298 190 300 90 325 90 H 363"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* Right Branch: Center -> Zapier (Bottom Right) */}
                <path
                  d="M 275 190 C 298 190 300 290 325 290 H 363"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* --- CENTER HUB SQUIRCLE (INFRALY ENGINE) --- */}
                {/* Outer concentric rounded border */}
                <rect
                  x="200"
                  y="160"
                  width="60"
                  height="60"
                  rx="16"
                  stroke="rgba(59, 130, 246, 0.35)"
                  strokeWidth="1"
                  fill="none"
                />

                {/* Inner central squircle */}
                <rect
                  x="205"
                  y="165"
                  width="50"
                  height="50"
                  rx="12"
                  fill="#0c111a"
                  stroke="rgba(59, 130, 246, 0.6)"
                  strokeWidth="1.2"
                  filter="url(#center-soft-glow)"
                />

                {/* Center Infraly Hub Live Endpoint Logo */}
                <image
                  href="/favicon.ico"
                  x="216"
                  y="176"
                  width="28"
                  height="28"
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* --- 8 ECOSYSTEM INTEGRATION NODES --- */}

                {/* 1. TOP: Slack (Instant Team Lead Alerts) */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="230"
                    cy="50"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="1.2"
                  />
                  <g transform="translate(219, 39) scale(0.92)">
                    <path
                      d="M4.622 13.9a2.318 2.318 0 0 1-2.311 2.314A2.318 2.318 0 0 1 0 13.9a2.317 2.317 0 0 1 2.311-2.31h2.311v2.31zM5.787 13.9a2.317 2.317 0 0 1 2.311-2.31 2.317 2.317 0 0 1 2.311 2.31v5.787a2.318 2.318 0 0 1-2.311 2.313 2.318 2.318 0 0 1-2.311-2.313V13.9z"
                      fill="#E01E5A"
                    />
                    <path
                      d="M8.098 4.622a2.318 2.318 0 0 1-2.311-2.311A2.318 2.318 0 0 1 8.098 0a2.318 2.318 0 0 1 2.311 2.311v2.311H8.098zM8.098 5.787a2.318 2.318 0 0 1 2.311 2.311 2.318 2.318 0 0 1-2.311 2.311H2.311A2.318 2.318 0 0 1 0 8.098a2.318 2.318 0 0 1 2.311-2.311h5.787z"
                      fill="#36C5F0"
                    />
                    <path
                      d="M17.378 8.098a2.318 2.318 0 0 1 2.311-2.311A2.318 2.318 0 0 1 22 8.098a2.318 2.318 0 0 1-2.311 2.311h-2.311V8.098zM16.213 8.098a2.318 2.318 0 0 1-2.311 2.311 2.317 2.317 0 0 1-2.311-2.311V2.311A2.318 2.318 0 0 1 13.902 0a2.318 2.318 0 0 1 2.311 2.311v5.787z"
                      fill="#2EB67D"
                    />
                    <path
                      d="M13.902 17.378a2.318 2.318 0 0 1 2.311 2.311A2.318 2.318 0 0 1 13.902 22a2.317 2.317 0 0 1-2.311-2.311v-2.311h2.311zM13.902 16.213a2.317 2.317 0 0 1-2.311-2.311 2.316 2.316 0 0 1 2.311-2.311h5.787A2.317 2.317 0 0 1 22 13.902a2.318 2.318 0 0 1-2.311 2.311h-5.787z"
                      fill="#ECB22E"
                    />
                  </g>
                  <text x="230" y="19" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontWeight="500" fontFamily="sans-serif">
                    Slack
                  </text>
                </g>

                {/* 2. BOTTOM: Webhooks (Real-Time HTTP Event Dispatch) */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="230"
                    cy="330"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(168, 85, 247, 0.4)"
                    strokeWidth="1.2"
                  />
                  {/* Webhook icon */}
                  <g transform="translate(219, 319) scale(0.92)">
                    <path
                      d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c0-2.21 1.79-4 4-4h4"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 8h6c1.1 0 2-.9 2-2a4 4 0 0 1 7.8 1.1A4 4 0 0 1 18 11h-4"
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="18" cy="11" r="1.5" fill="#e9d5ff" />
                    <circle cx="6" cy="13" r="1.5" fill="#e9d5ff" />
                  </g>
                  <text x="230" y="368" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontWeight="500" fontFamily="sans-serif">
                    Webhooks
                  </text>
                </g>

                {/* 3. TOP-LEFT: Next.js */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="73"
                    cy="90"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="1.2"
                  />
                  {/* Next.js N Logo */}
                  <g transform="translate(61, 78) scale(0.133)">
                    <circle cx="90" cy="90" r="86" fill="black" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                    <path
                      d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                      fill="white"
                    />
                    <path d="M115 54H127V126H115V54Z" fill="white" />
                  </g>
                  <text x="73" y="127" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    Next.js
                  </text>
                </g>

                {/* 4. MID-LEFT: React */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="73"
                    cy="190"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(0, 216, 255, 0.35)"
                    strokeWidth="1.2"
                  />
                  {/* React Atom Logo */}
                  <g transform="translate(73, 190) scale(1.05)">
                    <circle cx="0" cy="0" r="2.2" fill="#00d8ff" />
                    <g stroke="#00d8ff" strokeWidth="1.1" fill="none">
                      <ellipse rx="11" ry="4.2" />
                      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                    </g>
                  </g>
                  <text x="73" y="227" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    React
                  </text>
                </g>

                {/* 5. BOTTOM-LEFT: Plain HTML5 */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="73"
                    cy="290"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(227, 79, 38, 0.35)"
                    strokeWidth="1.2"
                  />
                  {/* HTML5 Shield Logo */}
                  <g transform="translate(61.5, 277.5) scale(0.045)">
                    <path fill="#E34F26" d="M71,460 L30,0 481,0 440,460 255,512" />
                    <path fill="#EF652A" d="M256,472 L407,430 443,62 256,62" />
                    <path fill="#EBEBEB" d="M256,208 L181,208 176,150 256,150 256,94 255,94 114,94 128,264 256,264 z M256,356 L255,356 193,339 189,293 133,293 141,385 255,417 256,417 z" />
                    <path fill="#FFFFFF" d="M255,208 L255,264 329,264 322,339 255,357 255,417 370,385 371,384 384,236 386,208 386,208 z M255,94 L255,122 255,150 391,150 396,94 z" />
                  </g>
                  <text x="73" y="327" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    HTML5
                  </text>
                </g>

                {/* 6. TOP-RIGHT: Webflow */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="387"
                    cy="90"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(20, 110, 245, 0.35)"
                    strokeWidth="1.2"
                  />
                  {/* Webflow W Logo */}
                  <g transform="translate(376, 79) scale(0.92)">
                    <path d="M17.85 4.85h-4.3l-2.4 7.6-2.4-7.6H4.45L2 14.5h3.9l1.4-4.8 2.2 7h3.9l2.2-7 1.4 4.8h3.9l-3.05-9.65z" fill="#146EF5" />
                    <path d="M22 9.7h-3.3l-1.3 4.8h3.3z" fill="#146EF5" />
                  </g>
                  <text x="387" y="127" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    Webflow
                  </text>
                </g>

                {/* 7. MID-RIGHT: Framer */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="387"
                    cy="190"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(0, 85, 255, 0.35)"
                    strokeWidth="1.2"
                  />
                  {/* Framer Geometric Logo */}
                  <g transform="translate(377, 179) scale(0.85)">
                    <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#0055FF" />
                  </g>
                  <text x="387" y="227" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    Framer
                  </text>
                </g>

                {/* 8. BOTTOM-RIGHT: Zapier */}
                <g filter="url(#node-shadow)" className="cursor-pointer">
                  <circle
                    cx="387"
                    cy="290"
                    r="24"
                    fill="#0e131d"
                    stroke="rgba(255, 79, 0, 0.35)"
                    strokeWidth="1.2"
                  />
                  {/* Zapier Asterisk Starburst Logo */}
                  <g transform="translate(375, 278) scale(1)">
                    <rect x="2" y="10.5" width="20" height="3" rx="1.5" fill="#FF4F00" />
                    <rect x="2" y="10.5" width="20" height="3" rx="1.5" fill="#FF4F00" transform="rotate(60 12 12)" />
                    <rect x="2" y="10.5" width="20" height="3" rx="1.5" fill="#FF4F00" transform="rotate(120 12 12)" />
                  </g>
                  <text x="387" y="327" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    Zapier
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
