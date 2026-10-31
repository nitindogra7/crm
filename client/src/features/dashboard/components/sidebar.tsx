"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <aside className="w-60 flex-none flex flex-col h-full bg-white/90 backdrop-blur-md border-r border-slate-200/80 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Top Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/70">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          {/* Infraly Brand Logo */}
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <Image
              src="/favicon.ico"
              alt="Infraly"
              width={28}
              height={28}
              unoptimized
              className="w-6 h-6 object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <span className="font-heading font-bold tracking-tight text-[17px] text-slate-900">
            infraly
          </span>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
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
          className="w-full px-2.5 py-2 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 hover:border-slate-300 transition-all flex items-center justify-between gap-2 cursor-pointer text-left shadow-2xs"
          title="Switch Organization Workspace"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center font-bold text-blue-700 text-[11px] flex-none">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-xs text-slate-900 truncate block">
                {workspace.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                /{workspace.slug || "workspace"}
              </span>
            </div>
          </div>
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-slate-400 flex-none animate-spin" />
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 flex-none" />
          )}
        </button>

        {/* Organization Switcher Dropdown */}
        {isOrgDropdownOpen && (
          <div className="absolute left-3 right-3 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
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
                          ? "bg-blue-50 text-blue-900 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] grid place-items-center flex-none font-semibold">
                          {switchingOrgId === org.id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                          ) : (
                            orgInitial
                          )}
                        </span>
                        <div className="truncate text-left">
                          <span className="block truncate font-medium">{org.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {org.plan}
                          </span>
                        </div>
                      </div>
                      {switchingOrgId === org.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 flex-none ml-2" />
                      ) : (
                        isActive && (
                          <Check className="w-3.5 h-3.5 text-blue-600 flex-none ml-2" />
                        )
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-2 py-1.5 text-xs text-slate-500 flex items-center justify-between">
                  <span>{workspace.name}</span>
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                </div>
              )}
            </div>

            <div className="pt-1.5 mt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsOrgDropdownOpen(false);
                  setIsCreateOrgOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors cursor-pointer font-medium"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>New Organization</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation - Clean Infraly Style */}
      <nav data-tour="sidebar-nav" className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                item.active
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-none transition-colors ${
                    item.active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                    item.active
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "bg-slate-100 text-slate-500 font-medium"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="hover:text-slate-800 text-[11px] font-medium transition-colors flex items-center gap-1"
          >
            <span>Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href="/"
            className="hover:text-slate-800 text-[11px] font-medium transition-colors"
          >
            Website
          </Link>
        </div>
        <div className="flex items-center gap-2 min-h-[20px] min-w-[20px]">
          {mounted ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-6 h-6 rounded-full border border-slate-200 shadow-2xs",
                },
              }}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse" />
          )}
        </div>
      </div>
    </aside>
  );
}
