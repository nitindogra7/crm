"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { LeadItem } from "./product-preview";
import { marketingData } from "../data";


interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: LeadItem) => void;
  plan?: string | null;
}

export function InquiryModal({
  isOpen,
  onClose,
  onSubmit,
  plan,
}: InquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    onSubmit({
      name: name.trim(),
      email: email.trim() || "alex@example.com",
      source: "Landing Page Demo",
      status: "New",
      time: "Just now",
      message: message.trim(),
    });

    setName("");
    setEmail("");
    setMessage("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[min(440px,calc(100%-32px))] p-7 bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl relative">
        <div className="flex items-center gap-2 mb-3">
          <Image
            src="/favicon.ico"
            alt="Infraly"
            width={24}
            height={24}
            unoptimized
            className="w-5 h-5 object-contain"
          />
          <span className="font-heading font-bold text-xs tracking-tight text-slate-500 uppercase">
            Infraly Lead Inspection
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            {plan
              ? `${marketingData.dialogs.planTitlePrefix}${plan}`
              : marketingData.dialogs.defaultTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xl grid place-items-center transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
          {plan
            ? marketingData.dialogs.planDescriptionTemplate(plan)
            : marketingData.dialogs.defaultDescription}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Your name
            </label>
            <input
              id="modal-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Arthur Howard"
              required
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email address
            </label>
            <input
              id="modal-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
              placeholder="arthur@company.com"
              required
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="modal-message" className="block text-xs font-semibold text-slate-700 mb-1">
              Message or note
            </label>
            <textarea
              id="modal-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              placeholder="Tell us about your form endpoint and lead capture requirements."
              required
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Submit Demo Inquiry</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}

interface DetailModalProps {
  isOpen: boolean;
  lead: LeadItem | null;
  onClose: () => void;
  onMarkContacted: (lead: LeadItem) => void;
  isSpam?: boolean;
}

export function DetailModal({
  isOpen,
  lead,
  onClose,
  onMarkContacted,
  isSpam = false,
}: DetailModalProps) {
  if (!isOpen || !lead) return null;

  const isContacted = lead.status === "Contacted";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[min(440px,calc(100%-32px))] p-7 bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl relative">
        <div className="flex items-center gap-2 mb-3">
          <Image
            src="/favicon.ico"
            alt="Infraly"
            width={24}
            height={24}
            unoptimized
            className="w-5 h-5 object-contain"
          />
          <span className="font-heading font-bold text-xs tracking-tight text-slate-500 uppercase">
            Infraly Lead Inspection
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Inquiry details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xl grid place-items-center transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2 mb-4 font-medium">
          {lead.name} · {lead.email}
        </p>

        <p className="text-xs text-slate-700 whitespace-pre-wrap break-words leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-200/80 my-4">
          {lead.message}
        </p>

        {!isSpam && (
          <button
            type="button"
            disabled={isContacted}
            onClick={() => onMarkContacted(lead)}
            className={`w-full mt-3 py-2.5 px-5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              isContacted
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-98 cursor-pointer"
            }`}
          >
            {isContacted ? "Already contacted" : "Mark as contacted"}
          </button>
        )}
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs max-w-[calc(100%-32px)] text-center shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {message}
    </div>
  );
}
