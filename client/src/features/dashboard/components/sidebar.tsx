"use client";

import styles from "./sidebar.module.css";
import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "@/shared/components/app-link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { SETTINGS_SECTIONS, getSettingsSection } from "./settings-navigation";
import { useDashboard } from "../context/dashboard-context";
import {
  ArrowLeft,
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
  const params = useSearchParams();
  const isSettings = pathname.startsWith("/dashboard/settings");
  const activeSection = getSettingsSection(params.get("tab"));
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
  } = useDashboard(["workspace","organizations","activeDashboardId","switchOrganization","setIsCreateOrgOpen","isLoading","leads","forms","spam"]);

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) { if (e.key === "Escape") setIsOrgDropdownOpen(false); }
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
      document.addEventListener("keydown", handleEscape);
      return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("keydown", handleEscape); };
    }
  }, [isOrgDropdownOpen]);

  const newLeadsCount = leads.filter((l) => l.status === "New").length;
  const spamCount = spam.length;

  const workspaceItems = [
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
  ];

  const initial = (workspace.name.charAt(0) || "W").toUpperCase();

  if (isSettings) {
    return (
      <aside className={styles.sidebar}>
        <nav aria-label="Settings navigation" className={styles.nav}>
          <Link navigation href="/dashboard" onClick={onClose} className={styles.backLink}>
            <ArrowLeft className={styles.navIcon} />
            <span>Back to workspace</span>
          </Link>
          {SETTINGS_SECTIONS.map(section => {
            const Icon = section.icon;
            const href = "/dashboard/settings?tab=" + section.id;
            return (
              <Link key={section.id} href={href} prefetch={false}
                aria-current={activeSection === section.id ? "page" : undefined}
                onClick={event => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  window.history.pushState(null, "", href);
                  onClose?.();
                }} className={styles.navLink}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={styles.navIcon} />
                  <span>{section.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      {/* Top Brand Header */}
      <div className={styles.brandRow}>
        <Link navigation
          href="/"
          className={styles.brand}
        >
          {/* Infraly Brand Logo */}
          <div className={styles.brandMark}>
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
          <span className="font-heading font-semibold tracking-tight text-[17px] text-white">
            infraly
          </span>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-blue-100 hover:text-white p-2 rounded-lg transition-colors"
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
          className={styles.workspace}
          title="Switch Organization Workspace"
          aria-expanded={isOrgDropdownOpen}
          aria-label="Switch organization"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className={styles.workspaceAvatar}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <span className={styles.workspaceName}>
                {workspace.name}
              </span>
              <span className={styles.workspaceSlug}>
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
                      disabled={isLoading || switchingOrgId !== null}
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
      <nav aria-label="Main navigation" data-tour="sidebar-nav" className={styles.nav}>
        <p className={styles.navLabel}>Workspace</p>
        {workspaceItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link navigation
              key={item.href}
              href={item.href}
              prefetch={true}
              aria-current={item.active ? "page" : undefined}
              onClick={onClose}
              className={styles.navLink}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={styles.navIcon}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={styles.badge}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className={styles.footer}>
        <div className="flex items-center gap-3">
          <Link navigation
            href="/docs"
            className="hover:text-slate-800 text-[11px] font-medium transition-colors flex items-center gap-1"
          >
            <span>Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>

        </div>
        <div className="flex items-center gap-2 min-h-[20px] min-w-[20px]">
          <Link navigation href="/dashboard/settings" onClick={onClose} aria-label="Settings" title="Settings" aria-current={pathname.startsWith("/dashboard/settings") ? "page" : undefined} className={styles.settingsLink}><Settings size={17} /></Link>
          {mounted ? (
            <UserButton
              appearance={{
                elements: {
                  rootBox: "shrink-0",
                  userButtonTrigger: "min-h-9 min-w-9",
                  userButtonAvatarBox: "w-8 h-8 rounded-full border border-blue-200/30 shadow-2xs",
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
