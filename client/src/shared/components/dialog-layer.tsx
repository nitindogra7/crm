"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Shared focus, Escape, and scroll handling for dialogs and mobile navigation. */
export function DialogLayer({ children, onClose, label, className }: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(root.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]'
    ) || []).filter(el => el.getClientRects().length > 0 && !el.closest('[inert]'));
    const frame = requestAnimationFrame(() => (focusable()[0] || root.current)?.focus({ preventScroll: true }));
    const handleKey = (event: KeyboardEvent) => {
      const layers = document.querySelectorAll('[data-dialog-layer]');
      if (layers[layers.length - 1] !== root.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close.current();
      }
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) { event.preventDefault(); root.current?.focus(); return; }
        if (!root.current?.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey, true);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <div ref={root} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} data-dialog-layer className={className}>{children}</div>;
}
