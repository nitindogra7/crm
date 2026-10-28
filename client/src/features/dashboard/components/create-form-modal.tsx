"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/dashboard-context";
import { FormField } from "../types";
import { X, Plus, Trash2 } from "lucide-react";

export function CreateFormModal() {
  const { isCreateFormOpen, setIsCreateFormOpen, addForm } = useDashboard();

  const [name, setName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { id: "f_name", name: "name", label: "Full Name", type: "text", required: true },
    { id: "f_email", name: "email", label: "Email Address", type: "email", required: true },
    { id: "f_message", name: "message", label: "Message", type: "textarea", required: true },
  ]);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FormField["type"]>("text");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsCreateFormOpen(false);
      }
    }
    if (isCreateFormOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isCreateFormOpen, setIsCreateFormOpen]);

  if (!isCreateFormOpen) return null;

  const handleToggleRequired = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddField = () => {
    const clean = newFieldName.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    if (!clean) return;

    const newField: FormField = {
      id: `f_${Date.now()}`,
      name: clean,
      label: newFieldName.trim(),
      type: newFieldType,
      required: false,
    };
    setFields((prev) => [...prev, newField]);
    setNewFieldName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addForm({
      name: name.trim(),
      redirectUrl: redirectUrl.trim() || undefined,
      fields,
    });

    setName("");
    setRedirectUrl("");
    setIsCreateFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCreateFormOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#161616] border border-white/[0.12] rounded-2xl p-6 shadow-2xl text-white z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] flex-none">
          <div>
            <h3 className="text-lg font-heading font-medium tracking-tight">Create Form</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Generate a unique endpoint URL for your website or app.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateFormOpen(false)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* Form Name */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Form Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Agency Contact Form, Pricing Inquiry..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 font-sans"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Used to identify submissions in your inbox.
            </p>
          </div>

          {/* Optional Redirect URL */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Redirect URL <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://yoursite.com/thank-you"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 font-sans"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Visitors will be redirected here after standard browser form submissions.
            </p>
          </div>

          {/* Field Configuration */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-zinc-300 font-medium">Field Schema & Validation</label>
              <span className="text-[11px] font-mono text-zinc-500">
                {fields.length} configured fields
              </span>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#121212] divide-y divide-white/[0.04] overflow-hidden">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-zinc-200 block truncate">
                      {field.name}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {field.label} · {field.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-none">
                    <button
                      type="button"
                      onClick={() => handleToggleRequired(field.id)}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-mono border transition-colors ${
                        field.required
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:text-zinc-300"
                      }`}
                    >
                      {field.required ? "Required" : "Optional"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Field */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Add custom field (e.g. phone, budget)..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.1] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as FormField["type"])}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.1] text-xs text-white focus:outline-none"
              >
                <option value="text">text</option>
                <option value="email">email</option>
                <option value="textarea">textarea</option>
                <option value="tel">tel</option>
                <option value="number">number</option>
              </select>
              <button
                type="button"
                onClick={handleAddField}
                disabled={!newFieldName.trim()}
                className="px-2.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs text-zinc-200 disabled:opacity-40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateFormOpen(false)}
              className="px-3.5 py-2 rounded-xl border border-white/[0.1] text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              Create Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
