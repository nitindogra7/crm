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
        "inline-flex items-center gap-[7px] border border-white/[0.08] rounded-full py-[4px] pr-[11px] pl-[5px] text-[10.5px] text-[#8c8c8c] bg-white/[0.03] transition-all duration-300",
        className
      )}
    >
      {icon && (
        <b className="w-[15px] h-[15px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_35%_30%,#555,#151515)] border border-white/[0.17] text-white flex-none">
          <Icon name={icon} className="w-[8px] h-[8px]" />
        </b>
      )}
      {children}
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
    "inline-flex items-center justify-center gap-[7px] font-sans transition-all duration-200 cursor-pointer whitespace-nowrap outline-none focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const sizeClasses =
    variant === "solid"
      ? size === "sm"
        ? "px-[14px] py-[6px] text-[11px] rounded-[8px]"
        : "px-[18px] py-[8.5px] text-[12.5px] rounded-[10px]"
      : size === "sm"
      ? "px-[14px] py-[6px] text-[11px] rounded-full"
      : "px-[18px] py-[9px] text-[12px] rounded-full";

  const variantClasses =
    variant === "solid"
      ? "font-medium text-black bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#f4f4f4] border border-black/10 shadow-[0_0_0_2px_#000,0_0_0_3.5px_rgba(255,255,255,0.45),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_2px_#000,0_0_0_3.5px_rgba(255,255,255,0.85),0_0_16px_rgba(255,255,255,0.35),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-[#ffffff] group"
      : "font-normal border border-white/[0.17] text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))] hover:border-white hover:bg-white hover:text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

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
        "relative rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_24%,#585858_0%,#1d1d1d_38%,#030303_72%)] border border-[#333] shadow-[0_0_70px_rgba(255,255,255,0.07),inset_0_2px_6px_rgba(255,255,255,0.18),inset_0_-14px_24px_#000] flex-none",
        className
      )}
    >
      <div
        className="absolute rounded-full border border-white/[0.08] pointer-events-none"
        style={{ inset: `-${size * 0.11}px` }}
      />
      {children || (
        <Icon
          name="logo"
          className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          style={{ width: `${size * 0.36}px`, height: `${size * 0.36}px` }}
        />
      )}
    </div>
  );
}

export function IcoCircle({
  icon,
  className,
  size = 34,
}: {
  icon: IconName;
  className?: string;
  size?: number;
}) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        "rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white flex-none",
        className
      )}
    >
      <Icon name={icon} className="w-[14px] h-[14px]" />
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
  const isLg2 = variant === "square";
  const [error, setError] = useState(false);

  const imageSource = src || PERSON_AVATARS[index % PERSON_AVATARS.length];

  return (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        "relative border border-white/[0.17] overflow-hidden flex-none inline-block bg-[#1a1a1a]",
        isLg2 ? "rounded-[10px]" : "rounded-full",
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
        <span className="w-full h-full flex items-center justify-center bg-[#2a2a2a] text-white text-[10px]">
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
        "relative border border-white/[0.08] rounded-[16px] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.012)_38%,rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000]",
        className
      )}
    >
      {children}
    </div>
  );
}
