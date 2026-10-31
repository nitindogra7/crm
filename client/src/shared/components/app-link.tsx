"use client";

import NextLink, { useLinkStatus } from "next/link";
import { useSyncExternalStore, type ComponentProps } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

function NavigationFeedback() {
  const { pending } = useLinkStatus();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!pending || !mounted) return null;

  // Keep the bar outside transformed links, cards, and fixed navigation panels.
  return createPortal(
    <div role="status" aria-label="Opening page" className="navigation-progress">
      <span className="sr-only">Opening page...</span>
    </div>,
    document.body
  );
}

type AppLinkProps = ComponentProps<typeof NextLink> & {
  navigation?: boolean;
};

export default function AppLink({ children, navigation = false, ...props }: AppLinkProps) {
  return (
    <NextLink {...props}>
      {children}
      {navigation && <NavigationFeedback />}
    </NextLink>
  );
}
