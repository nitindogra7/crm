"use client";

import React from "react";
import Link from "@/shared/components/app-link";

export function CtaBanner() {
  return (
    <section className="py-20" style={{ background: "#f7f8f7" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Inner card */}
        <div
          className="rounded-[16px] border flex flex-col md:flex-row justify-between items-start md:items-center gap-10 p-12"
          style={{
            background: "linear-gradient(120deg, #ffffff, #f0f2f1)",
            borderColor: "rgba(30,52,51,0.06)",
          }}
        >
          {/* Left */}
          <div className="flex-1">
            <h2
              className="font-medium leading-tight"
              style={{
                fontSize: "32px",
                letterSpacing: "-0.035em",
                color: "#203332",
                fontFamily: "var(--font-heading)",
              }}
            >
              Your next customer.
              <br />
              <em className="not-italic" style={{ color: "#b66b17" }}>
                One conversation away.
              </em>
            </h2>
            <p
              className="mt-4 leading-[1.7]"
              style={{
                fontSize: "13px",
                color: "#5d6967",
                fontFamily: "var(--font-p)",
              }}
            >
              Set up your business workspace, connect your website contact form, and start turning inquiries into customers today. Free forever tier included.
            </p>
            <p
              className="mt-3"
              style={{ fontSize: "10px", color: "#6c7674" }}
            >
              No credit card required
            </p>
          </div>

          {/* Right — button stack */}
          <div className="flex flex-col items-start gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] text-[13px] font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
              style={{
                background: "linear-gradient(180deg,#ffbc61 0%,#f2a23d 100%)",
                color: "#30220e",
              }}
            >
              Get started free ↗
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap"
              style={{
                background: "transparent",
                color: "#5d6967",
                border: "1px solid rgba(30,52,51,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#203332";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(30,52,51,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#5d6967";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(30,52,51,0.12)";
              }}
            >
              See how it works →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
