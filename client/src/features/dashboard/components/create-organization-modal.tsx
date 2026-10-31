"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { X, Building2, Sparkles, Loader2 } from "lucide-react";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TONES = [
  { id: "zinc", label: "Zinc", bg: "bg-slate-700", text: "text-slate-200" },
  { id: "blue", label: "Blue", bg: "bg-blue-600", text: "text-blue-300" },
  { id: "emerald", label: "Emerald", bg: "bg-emerald-600", text: "text-emerald-300" },
  { id: "indigo", label: "Indigo", bg: "bg-indigo-600", text: "text-indigo-300" },
];

export function CreateOrganizationModal({
  isOpen,
  onClose,
}: CreateOrganizationModalProps) {
  const { createOrganizationAsync, addToast } = useDashboard();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [hasEditedSlug, setHasEditedSlug] = useState(false);
  const [avatarTone, setAvatarTone] = useState("zinc");
  const [plan, setPlan] = useState("Free Tier");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!hasEditedSlug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const candidateSlug = (
        slug.trim() ||
        name.toLowerCase().trim()
      )
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const cleanSlug = candidateSlug || `org-${Date.now().toString(36)}`;

      await createOrganizationAsync({
        name: name.trim(),
        slug: cleanSlug,
        avatarTone,
        plan,
      });

      addToast("Organization created", `${name.trim()} workspace is ready.`);
      onClose();
      setName("");
      setSlug("");
      setHasEditedSlug(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create organization";
      addToast("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900 z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 grid place-items-center text-blue-600">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">
                New Organization
              </h3>
              <p className="text-xs text-slate-500">
                Create a dedicated workspace with its own forms and API keys.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Organization / Brand Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Acme Studio, Beta Ventures"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Workspace Slug
            </label>
            <div className="flex items-center rounded-xl bg-slate-50/80 border border-slate-200/90 px-3 py-2.5 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-3 focus-within:ring-blue-500/10 transition-all">
              <span className="text-xs text-slate-400 font-mono select-none">
                infraly.com/w/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setHasEditedSlug(true);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                }}
                placeholder="acme-studio"
                className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none pl-0.5"
              />
            </div>
          </div>

          {/* Tone picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Avatar Accent Tone
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAvatarTone(t.id)}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                    avatarTone === t.id
                      ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-2xs"
                      : "border-slate-200 bg-slate-50/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${t.bg}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Plan Tier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Workspace Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Free Tier", "Team Workspace"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    plan === p
                      ? "border-blue-600 bg-blue-50/80 text-blue-950 font-semibold ring-2 ring-blue-500/10 shadow-2xs"
                      : "border-slate-200 bg-slate-50/60 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-semibold text-slate-900">{p}</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">
                    {p === "Free Tier" ? "Unlimited test forms" : "Collaborative pipeline"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-blue-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Workspace...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
