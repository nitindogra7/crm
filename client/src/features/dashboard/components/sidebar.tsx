"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "../context/dashboard-context";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  BarChart3,
  ShieldAlert,
  Settings,
  Plus,
  ExternalLink,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { workspace, leads, forms, spam, setIsCreateFormOpen } = useDashboard();

  const newLeadsCount = leads.filter((l) => l.status === "New").length;
  const spamCount = spam.length;

  const NAV_ITEMS = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Leads",
      href: "/dashboard/leads",
      icon: Inbox,
      active: pathname.startsWith("/dashboard/leads"),
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : undefined,
      badgeColor: "emerald" as const,
    },
    {
      label: "Forms",
      href: "/dashboard/forms",
      icon: FileText,
      active: pathname.startsWith("/dashboard/forms"),
      badge: forms.length.toString(),
      badgeColor: "zinc" as const,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      label: "Spam Shield",
      href: "/dashboard/spam",
      icon: ShieldAlert,
      active: pathname.startsWith("/dashboard/spam"),
      badge: spamCount > 0 ? `${spamCount}` : undefined,
      badgeColor: "amber" as const,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  const initial = (workspace.name.charAt(0) || "W").toUpperCase();

  return (
    <aside className="w-64 flex-none flex flex-col h-full bg-[#141414] border-r border-white/[0.08] select-none">
      {/* Top Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.06]">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
        >
          <span className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.14] inline-grid place-items-center text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <path d="M12 3a9 9 0 1 0 9 9" fill="none" />
              <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="font-heading font-medium tracking-tight text-sm text-white">
            Salenova
          </span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08]">
            v1.0
          </span>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-zinc-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Current Workspace Pill (Single Personal Workspace) */}
      <div className="px-3 pt-3 pb-2">
        <div className="p-2.5 rounded-xl border border-white/[0.08] bg-[#181818] shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/[0.12] flex items-center justify-center font-heading font-semibold text-white text-xs shadow-inner flex-none">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-xs text-white truncate block">
                  {workspace.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-none" title="Endpoint online" />
              </div>
              <span className="text-[10.5px] font-mono text-zinc-500 block truncate">
                Personal Workspace · {workspace.plan}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 py-1.5">
          Workspace Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-sans transition-all group ${
                item.active
                  ? "bg-white/[0.08] text-white font-medium border border-white/[0.12] shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-none transition-colors ${
                    item.active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded border ${
                    item.badgeColor === "emerald"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : item.badgeColor === "amber"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-white/[0.04] text-zinc-400 border-white/[0.06]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Quick Action & Footer */}
      <div className="p-3 border-t border-white/[0.06] space-y-2">
        <button
          type="button"
          onClick={() => {
            setIsCreateFormOpen(true);
            if (onClose) onClose();
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Form</span>
        </button>

        <div className="pt-2 flex items-center justify-between px-1 text-[11px] text-zinc-500">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-zinc-300 transition-colors"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-6 h-6 rounded-full border border-white/20",
                },
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
