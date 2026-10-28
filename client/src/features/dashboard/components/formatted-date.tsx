"use client";

import React from "react";

interface FormattedDateProps {
  date: string | number | Date;
  format?: "time" | "date" | "both" | "full";
  className?: string;
}

function useHydrated() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function FormattedDate({
  date,
  format = "both",
  className,
}: FormattedDateProps) {
  const mounted = useHydrated();

  const d = new Date(date);

  // During SSR and initial hydration pass, render a stable deterministic fallback
  if (!mounted) {
    return (
      <span suppressHydrationWarning className={className}>
        {format === "time" ? "--:--" : "--- --"}
      </span>
    );
  }

  let text = "";
  try {
    if (format === "time") {
      text = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (format === "date") {
      text = d.toLocaleDateString([], { month: "short", day: "numeric" });
    } else if (format === "full") {
      text = d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      text = `${d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })} · ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  } catch {
    text = String(date);
  }

  return (
    <span suppressHydrationWarning className={className}>
      {text}
    </span>
  );
}
