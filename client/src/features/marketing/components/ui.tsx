import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon, IconName } from "./icons";
import { cn } from "@/shared/lib/utils";

export const PERSON_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
];

export function Pill({
  icon,
  children,
  className,
}: {
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-emerald-900/60 rounded-full py-1 pr-3 pl-2 text-[11px] font-mono text-emerald-400 bg-[#0E1411] shadow-sm",
        className
      )}
    >
      {icon && (
        <b className="w-4 h-4 rounded-full grid place-items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-none">
          <Icon name={icon} className="w-2.5 h-2.5" />
        </b>
      )}
      <span>{children}</span>
    </span>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "solid";
  size?: "default" | "sm";
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  id?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "default",
  size = "default",
  href,
  className,
  onClick,
  id,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 font-sans transition-colors cursor-pointer whitespace-nowrap outline-none select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md";

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs"
      : "px-4 py-2 text-xs font-semibold";

  const variantClasses =
    variant === "solid"
      ? "text-[#070B09] bg-emerald-500 hover:bg-emerald-400 font-semibold shadow-sm"
      : "text-zinc-200 hover:text-white bg-[#0E1411] hover:bg-[#141C17] border border-zinc-800 hover:border-zinc-700";

  const combinedClasses = cn(baseClasses, sizeClasses, variantClasses, className);

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link id={id} href={href} className={combinedClasses} onClick={onClick}>
          {children}
        </Link>
      );
    }
    return (
      <a id={id} href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      className={combinedClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Orb({
  size = 96,
  className,
  children,
}: {
  size?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        "relative rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_24%,#2a3530_0%,#131b17_40%,#090d0b_75%)] border border-emerald-950/60 shadow-lg flex-none",
        className
      )}
    >
      {children || (
        <Icon
          name="logo"
          className="text-emerald-400"
          style={{ width: `${size * 0.36}px`, height: `${size * 0.36}px` }}
        />
      )}
    </div>
  );
}

export function IcoCircle({
  icon,
  className,
  size = 32,
}: {
  icon: IconName;
  className?: string;
  size?: number;
}) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        "rounded-lg grid place-items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-none",
        className
      )}
    >
      <Icon name={icon} className="w-3.5 h-3.5" />
    </div>
  );
}

export function Avatar({
  className,
  size = 24,
  variant = "round",
  src,
  alt = "Person",
  index = 0,
}: {
  className?: string;
  size?: number;
  variant?: "round" | "square";
  src?: string;
  alt?: string;
  index?: number;
}) {
  const isSquare = variant === "square";
  const [error, setError] = useState(false);

  const imageSource = src || PERSON_AVATARS[index % PERSON_AVATARS.length];

  return (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        "relative border border-zinc-800 overflow-hidden flex-none inline-block bg-[#0E1411]",
        isSquare ? "rounded-md" : "rounded-full",
        className
      )}
    >
      {!error ? (
        <Image
          src={imageSource}
          alt={alt}
          width={size}
          height={size}
          unoptimized
          onError={() => setError(true)}
          className="w-full h-full object-cover grayscale contrast-105"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center bg-[#151E19] text-zinc-300 text-[10px]">
          {alt.slice(0, 1)}
        </span>
      )}
    </span>
  );
}

export function Card({
  children,
  className,
  style,
  onPointerMove,
  onPointerLeave,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "relative border border-zinc-800/80 rounded-xl bg-[#0E1411] shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
