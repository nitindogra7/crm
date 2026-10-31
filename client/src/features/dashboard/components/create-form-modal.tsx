"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/dashboard-context";
import { FormField } from "../types";
import { X, Plus, Trash2, Loader2 } from "lucide-react";

export function CreateFormModal() {
  const { isCreateFormOpen, setIsCreateFormOpen, createFormAsync, addToast } = useDashboard();

  const [name, setName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createFormAsync({
        name: name.trim(),
        redirectUrl: redirectUrl.trim() || undefined,
        fields,
      });

      setName("");
      setRedirectUrl("");
      setIsCreateFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create form";
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
        onClick={() => setIsCreateFormOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-none">
          <div>
            <h3 className="text-lg font-heading font-bold tracking-tight text-slate-900">
              Create Endpoint Form
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate a unique endpoint URL for your website or app.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateFormOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* Form Name */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Form Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Agency Contact Form, Pricing Inquiry..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-sans transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used to identify submissions in your inbox.
            </p>
          </div>

          {/* Optional Redirect URL */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Redirect URL <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://yoursite.com/thank-you"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-sans transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Visitors will be redirected here after standard browser form submissions.
            </p>
          </div>

          {/* Field Configuration */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-700 font-semibold">Field Schema & Validation</label>
              <span className="text-[11px] font-mono text-slate-400">
                {fields.length} configured fields
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 divide-y divide-slate-100 overflow-hidden shadow-2xs">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-slate-900 font-semibold block truncate">
                      {field.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {field.label} · {field.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-none">
                    <button
                      type="button"
                      onClick={() => handleToggleRequired(field.id)}
                      className={`px-2.5 py-0.5 rounded text-[10.5px] font-mono border font-semibold transition-colors cursor-pointer ${
                        field.required
                          ? "bg-blue-50 text-blue-700 border-blue-200/80"
                          : "bg-white text-slate-500 border-slate-200 hover:text-slate-800"
                      }`}
                    >
                      {field.required ? "Required" : "Optional"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
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
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as FormField["type"])}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none cursor-pointer"
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
                className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs text-blue-700 disabled:opacity-40 transition-colors cursor-pointer font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateFormOpen(false)}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="min-h-[38px] px-5 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-40 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Form...</span>
                </>
              ) : (
                <span>Create Form</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
