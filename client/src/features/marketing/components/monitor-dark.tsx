import React from "react";
import Link from "next/link";
import { marketingData } from "../data";

export function MonitorDark() {
  const { monitorDark } = marketingData;

  return (
    <section className="bg-black text-white py-20 sm:py-28 lg:py-32 relative overflow-hidden" id="analytics">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Geometric Interlocking Capsules Matrix */}
          <div className="relative flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-[460px] aspect-[460/380] relative">
              <svg
                viewBox="0 0 460 380"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Cyan / Blue center glow */}
                  <filter id="center-squircle-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.5" />
                  </filter>

                  {/* Green document icon glow */}
                  <filter id="green-doc-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#4ade80" floodOpacity="0.45" />
                  </filter>

                  {/* Yellow document icon glow */}
                  <filter id="yellow-doc-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#facc15" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* --- SURROUNDING EMPTY WIREFRAME CAPSULES --- */}
                {/* 1. Top Horizontal Capsule (upper-most) */}
                <rect
                  x="168"
                  y="56"
                  width="76"
                  height="38"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* 2. Top-Left Horizontal Capsule */}
                <rect
                  x="138"
                  y="106"
                  width="60"
                  height="42"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* 3. Horizontal Capsule directly left of center */}
                <rect
                  x="132"
                  y="168"
                  width="58"
                  height="44"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* 4. Horizontal Capsule directly right of center */}
                <rect
                  x="270"
                  y="178"
                  width="64"
                  height="44"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* 5. Horizontal Capsule under center */}
                <rect
                  x="174"
                  y="232"
                  width="88"
                  height="44"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* 6. Capsule bottom-left (below yellow doc) */}
                <rect
                  x="76"
                  y="232"
                  width="48"
                  height="44"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* 7. Capsule between Doc 3 and bottom green docs */}
                <rect
                  x="132"
                  y="222"
                  width="44"
                  height="54"
                  rx="13"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.2"
                />

                {/* --- 6 CAPSULES WITH DOCUMENT ICONS --- */}

                {/* DOC 1: TOP-CENTER (GREEN) */}
                <rect
                  x="205"
                  y="84"
                  width="50"
                  height="62"
                  rx="14"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.13)"
                  strokeWidth="1.2"
                />
                <g transform="translate(222, 104)" filter="url(#green-doc-glow)">
                  <path
                    d="M 0 0 H 10 L 15 5 V 21 H 0 Z"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 0 V 5 H 15"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="3.5" y1="9" x2="11.5" y2="9" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="13" x2="11.5" y2="13" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="17" x2="8.5" y2="17" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                </g>

                {/* DOC 2: UPPER-RIGHT (GREEN) */}
                <rect
                  x="276"
                  y="104"
                  width="50"
                  height="62"
                  rx="14"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.13)"
                  strokeWidth="1.2"
                />
                <g transform="translate(293, 124)" filter="url(#green-doc-glow)">
                  <path
                    d="M 0 0 H 10 L 15 5 V 21 H 0 Z"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 0 V 5 H 15"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="3.5" y1="9" x2="11.5" y2="9" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="13" x2="11.5" y2="13" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="17" x2="8.5" y2="17" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                </g>

                {/* DOC 3: MID-LEFT (YELLOW) */}
                <rect
                  x="76"
                  y="158"
                  width="50"
                  height="64"
                  rx="14"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.13)"
                  strokeWidth="1.2"
                />
                <g transform="translate(93, 179)" filter="url(#yellow-doc-glow)">
                  <path
                    d="M 0 0 H 10 L 15 5 V 21 H 0 Z"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 0 V 5 H 15"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="3.5" y1="9" x2="11.5" y2="9" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="13" x2="11.5" y2="13" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="17" x2="8.5" y2="17" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
                </g>

                {/* DOC 4: LOWER-RIGHT (YELLOW) */}
                <rect
                  x="276"
                  y="236"
                  width="50"
                  height="62"
                  rx="14"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.13)"
                  strokeWidth="1.2"
                />
                <g transform="translate(293, 256)" filter="url(#yellow-doc-glow)">
                  <path
                    d="M 0 0 H 10 L 15 5 V 21 H 0 Z"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 0 V 5 H 15"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="3.5" y1="9" x2="11.5" y2="9" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="13" x2="11.5" y2="13" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="17" x2="8.5" y2="17" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round" />
                </g>

                {/* DOC 5: BOTTOM-LEFT-CENTER (GREEN) */}
                <rect
                  x="172"
                  y="288"
                  width="50"
                  height="62"
                  rx="14"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.13)"
                  strokeWidth="1.2"
                />
                <g transform="translate(189, 308)" filter="url(#green-doc-glow)">
                  <path
                    d="M 0 0 H 10 L 15 5 V 21 H 0 Z"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 0 V 5 H 15"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="3.5" y1="9" x2="11.5" y2="9" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="13" x2="11.5" y2="13" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="17" x2="8.5" y2="17" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                </g>

                {/* DOC 6: BOTTOM-RIGHT-CENTER (GREEN) */}
                <rect
                  x="238"
                  y="288"
                  width="50"
                  height="62"
                  rx="14"
                  fill="#07090e"
                  stroke="rgba(255, 255, 255, 0.13)"
                  strokeWidth="1.2"
                />
                <g transform="translate(255, 308)" filter="url(#green-doc-glow)">
                  <path
                    d="M 0 0 H 10 L 15 5 V 21 H 0 Z"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 0 V 5 H 15"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <line x1="3.5" y1="9" x2="11.5" y2="9" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="13" x2="11.5" y2="13" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="3.5" y1="17" x2="8.5" y2="17" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
                </g>

                {/* --- CENTRAL GLOWING SQUIRCLE WITH SHIELD ICON --- */}
                <rect
                  x="198"
                  y="158"
                  width="64"
                  height="64"
                  rx="16"
                  fill="#080d16"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  filter="url(#center-squircle-glow)"
                />

                {/* Inner Shield / Hexagon Ring Icon */}
                <path
                  d="M 230 178 C 230 178, 241 184, 241 188 V 196 C 241 198, 230 203, 230 203 C 230 203, 219 198, 219 196 V 188 C 219 184, 230 178, 230 178 Z"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="230" cy="190.5" r="2.2" fill="#e0f2fe" />
              </svg>
            </div>
          </div>

          {/* Right Column: Headline, Copy & Learn More CTA */}
          <div className="max-w-xl order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-semibold tracking-tight text-white leading-[1.16]">
              {monitorDark.headline}
              <br />
              {monitorDark.headlineUser}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5977f6] via-[#637df2] to-[#7b8ef8]">
                {monitorDark.headlineGradient}
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5977f6] via-[#637df2] to-[#7b8ef8]">
                {monitorDark.headlineTime}
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-[460px]">
              {monitorDark.description}
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-full bg-black hover:bg-white/10 text-white text-sm font-normal border border-white/20 transition-all hover:border-white/40 active:scale-98 inline-flex items-center justify-center"
              >
                {monitorDark.ctaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
