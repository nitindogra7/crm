"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { X, Building2, Sparkles, Loader2 } from "lucide-react";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TONES = [
  { id: "zinc", label: "Zinc", bg: "bg-zinc-800", text: "text-zinc-200" },
  { id: "emerald", label: "Emerald", bg: "bg-emerald-950", text: "text-emerald-300" },
  { id: "slate", label: "Slate", bg: "bg-slate-800", text: "text-slate-200" },
  { id: "white", label: "White", bg: "bg-white", text: "text-zinc-950" },
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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#141417] border border-white/[0.12] rounded-2xl p-6 shadow-2xl text-white z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] grid place-items-center text-zinc-300">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-medium font-heading">
                New Organization
              </h3>
              <p className="text-xs text-zinc-400">
                Create a dedicated workspace with its own forms and API keys.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Organization / Brand Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Acme Studio, Beta Ventures"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Workspace Slug
            </label>
            <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/[0.1] px-3 py-2.5 focus-within:border-white/30 transition-colors">
              <span className="text-xs text-zinc-500 font-mono select-none">
                salenova.com/
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
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 font-mono focus:outline-none pl-0.5"
              />
            </div>
          </div>

          {/* Tone picker */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
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
                      ? "border-white bg-white/[0.08] text-white"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
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
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
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
                      ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="font-medium text-zinc-200">{p}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {p === "Free Tier" ? "Unlimited test forms" : "Collaborative pipeline"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
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
