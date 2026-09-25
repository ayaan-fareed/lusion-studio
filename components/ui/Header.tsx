"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUIStore } from "@/lib/store/useUIStore";
import PillButton from "@/components/ui/PillButton";

export default function Header() {
  const { isMenuOpen, toggleMenu, openContactDrawer } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-editorial ${
        scrolled
          ? "bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-border-subtle-light/60 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Studio Wordmark */}
        <Link
          href="/"
          data-cursor="hover"
          className="group flex items-center gap-2 select-none"
          aria-label="STUDIO PROTO Home"
        >
          <span className="w-2 h-2 rounded-full bg-accent-cyan transition-transform group-hover:scale-150 duration-300" />
          <span className="font-semibold text-sm sm:text-base tracking-tight text-primary-light font-sans group-hover:opacity-80 transition-opacity">
            STUDIO PROTO
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-secondary-light ml-1 border border-border-subtle-light px-1.5 py-0.5 rounded">
            EXPERIENCE LAB
          </span>
        </Link>

        {/* Action Capsule Cluster */}
        <div className="flex items-center gap-3">
          <PillButton
            label="LET'S TALK"
            dotCount={1}
            onClick={openContactDrawer}
            variant="glass"
            ariaLabel="Contact STUDIO PROTO"
          />

          <PillButton
            label="MENU"
            dotCount={2}
            active={isMenuOpen}
            variant="dark"
            onClick={toggleMenu}
            ariaLabel={isMenuOpen ? "Close Menu" : "Open Menu"}
          />
        </div>
      </div>
    </header>
  );
}
