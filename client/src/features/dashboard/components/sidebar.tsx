"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "../context/dashboard-context";
import {
  LayoutDashboard,
  Inbox,
  FileCode2,
  BarChart3,
  ShieldAlert,
  Settings,
  Plus,
  ExternalLink,
  X,
  ChevronsUpDown,
  Check,
  Loader2,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    workspace,
    organizations,
    activeDashboardId,
    switchOrganization,
    setIsCreateOrgOpen,
    isLoading,
    leads,
    forms,
    spam,
  } = useDashboard();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOrgDropdownOpen(false);
      }
    }
    if (isOrgDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOrgDropdownOpen]);

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
      badge: newLeadsCount > 0 ? `${newLeadsCount}` : undefined,
    },
    {
      label: "Forms & APIs",
      href: "/dashboard/forms",
      icon: FileCode2,
      active: pathname.startsWith("/dashboard/forms"),
      badge: forms.length > 0 ? `${forms.length}` : undefined,
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
    <aside className="w-60 flex-none flex flex-col h-full bg-[#0d0d10] border-r border-white/[0.06] select-none">
      {/* Top Brand Header */}
      <div className="h-13 px-4 flex items-center justify-between border-b border-white/[0.06]">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <span className="w-5 h-5 rounded-md bg-white/[0.08] border border-white/[0.12] inline-grid place-items-center text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-3 h-3"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
          </span>
          <span className="font-medium tracking-tight text-xs text-white">
            Salenova
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

      {/* Workspace Context & Multi-Organization Switcher */}
      <div className="px-3 pt-3 pb-2 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOrgDropdownOpen((prev) => !prev)}
          className="w-full px-2.5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex items-center justify-between gap-2 cursor-pointer text-left"
          title="Switch Organization Workspace"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center font-medium text-white text-[11px] flex-none">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs text-zinc-200 truncate block">
                {workspace.name}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block truncate">
                /{workspace.slug || "workspace"}
              </span>
            </div>
          </div>
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-zinc-400 flex-none animate-spin" />
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-500 flex-none" />
          )}
        </button>

        {/* Organization Switcher Dropdown */}
        {isOrgDropdownOpen && (
          <div className="absolute left-3 right-3 top-full mt-1.5 z-50 bg-[#161619] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-white/[0.06] mb-1">
              Organizations ({organizations.length > 0 ? organizations.length : 1})
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {organizations.length > 0 ? (
                organizations.map((org) => {
                  const isActive =
                    org.id === activeDashboardId || org.slug === workspace.slug;
                  const orgInitial = (org.name.charAt(0) || "O").toUpperCase();

                  return (
                    <button
                      key={org.id}
                      type="button"
                      disabled={switchingOrgId === org.id}
                      onClick={async () => {
                        if (isActive || switchingOrgId) {
                          setIsOrgDropdownOpen(false);
                          return;
                        }
                        setSwitchingOrgId(org.id);
                        try {
                          await switchOrganization(org.id);
                        } finally {
                          setSwitchingOrgId(null);
                          setIsOrgDropdownOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isActive
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-zinc-800 border border-white/[0.1] text-[10px] grid place-items-center flex-none">
                          {switchingOrgId === org.id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-zinc-300" />
                          ) : (
                            orgInitial
                          )}
                        </span>
                        <div className="truncate text-left">
                          <span className="block truncate">{org.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono block">
                            {org.plan}
                          </span>
                        </div>
                      </div>
                      {switchingOrgId === org.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 flex-none ml-2" />
                      ) : (
                        isActive && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-none ml-2" />
                        )
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-2 py-1.5 text-xs text-zinc-400 flex items-center justify-between">
                  <span>{workspace.name}</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
            </div>

            <div className="pt-1.5 mt-1 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  setIsOrgDropdownOpen(false);
                  setIsCreateOrgOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-400" />
                <span>New Organization</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation - Clean macOS Style */}
      <nav data-tour="sidebar-nav" className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                item.active
                  ? "bg-white/[0.08] text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-3.5 h-3.5 flex-none transition-colors ${
                    item.active ? "text-white" : "text-zinc-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
        <Link
          href="/"
          className="hover:text-zinc-300 text-[11px] transition-colors flex items-center gap-1"
        >
          <span>Landing</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
        <div className="flex items-center gap-2 min-h-[20px] min-w-[20px]">
          {mounted ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-5 h-5 rounded-full border border-white/10",
                },
              }}
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
          )}
        </div>
      </div>
    </aside>
  );
}
