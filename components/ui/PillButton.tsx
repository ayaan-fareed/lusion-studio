"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PillButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "light" | "dark" | "outline" | "glass";
  dotCount?: 0 | 1 | 2;
  active?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function PillButton({
  label,
  href,
  onClick,
  variant = "glass",
  dotCount = 0,
  active = false,
  className,
  ariaLabel,
}: PillButtonProps) {
  const variantStyles = {
    light: "bg-white text-primary-light border-border-subtle-light hover:bg-[#F0F0F2] shadow-sm",
    dark: "bg-bg-dark text-white border-border-subtle-dark hover:bg-[#1a1a1f] shadow-sm",
    outline: "bg-transparent text-primary-light border-primary-light/20 hover:border-primary-light/60",
    glass: "bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md text-primary-light border-border-subtle-light hover:bg-white/95 transition-all shadow-sm",
  };

  const content = (
    <>
      <span className="font-mono text-xs uppercase tracking-wider font-medium">{label}</span>
      {dotCount > 0 && (
        <span className="flex items-center gap-1 ml-1.5" aria-hidden="true">
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                active
                  ? "bg-accent-cyan scale-125"
                  : "bg-primary-light/60 group-hover:bg-accent-cyan"
              )}
            />
          ))}
        </span>
      )}
    </>
  );

  const baseClasses = cn(
    "group inline-flex items-center justify-center px-4 py-2 rounded-full border text-xs select-none transition-all duration-300 ease-editorial active:scale-95 cursor-none",
    variantStyles[variant],
    active && "border-accent-cyan ring-1 ring-accent-cyan/30",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        data-cursor="hover"
        aria-label={ariaLabel || label}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      data-cursor="hover"
      aria-label={ariaLabel || label}
      aria-expanded={active}
    >
      {content}
    </button>
  );
}
