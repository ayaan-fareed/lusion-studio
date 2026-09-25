"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useUIStore } from "@/lib/store/useUIStore";
import PillButton from "@/components/ui/PillButton";

const NAV_ITEMS = [
  { id: "01", label: "WORK", href: "#work", desc: "Selected creative technology & WebGL" },
  { id: "02", label: "ABOUT", href: "#about", desc: "Studio ethos, team & capabilities" },
  { id: "03", label: "LAB", href: "#lab", desc: "Experiments, shaders & procedural R&D" },
  { id: "04", label: "CONTACT", href: "#contact", desc: "Commissions, inquiries & collaborations" },
];

export default function NavigationOverlay() {
  const { isMenuOpen, closeMenu } = useUIStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Prevent background scroll when menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // GSAP Staggered Entrance & Exit Animations
  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const validLinks = linksRef.current.filter(Boolean);
    const meta = metaRef.current;

    if (!overlay || !content) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMenuOpen) {
      // Reveal overlay
      gsap.killTweensOf([overlay, content, validLinks, meta]);

      if (prefersReducedMotion) {
        gsap.set(overlay, { display: "flex", opacity: 1 });
        gsap.set([content, validLinks, meta], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(overlay, { display: "flex" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      )
        .fromTo(
          validLinks,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
          },
          "-=0.2"
        )
        .fromTo(
          meta,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        );
    } else {
      // Exit overlay
      if (prefersReducedMotion) {
        gsap.set(overlay, { display: "none", opacity: 0 });
        return;
      }

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
  }, [isMenuOpen]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
      style={{ display: "none" }}
      className="fixed inset-0 z-[100] bg-bg-dark/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-12 lg:p-16 select-none"
    >
      {/* Top Bar inside Overlay */}
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-secondary-dark">
            INDEX // NAVIGATION
          </span>
        </div>

        <PillButton
          label="CLOSE"
          dotCount={1}
          active={true}
          variant="dark"
          onClick={closeMenu}
          ariaLabel="Close Navigation"
          className="border-white/20 text-white hover:border-accent-cyan"
        />
      </header>

      {/* Main Nav Items with Staggered Typography */}
      <nav ref={contentRef} className="py-8 my-auto">
        <ul className="space-y-4 sm:space-y-6">
          {NAV_ITEMS.map((item, index) => (
            <li key={item.id} className="overflow-hidden">
              <Link
                ref={(el) => {
                  linksRef.current[index] = el;
                }}
                href={item.href}
                onClick={closeMenu}
                data-cursor="view"
                data-cursor-text="GO"
                className="group flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/5 pb-4 hover:border-accent-cyan/50 transition-colors"
              >
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-xs sm:text-sm text-secondary-dark group-hover:text-accent-cyan transition-colors">
                    {item.id}
                  </span>
                  <span className="text-3xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-white/90 group-hover:text-white group-hover:translate-x-3 transition-transform duration-300 ease-editorial">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-mono text-secondary-dark mt-2 sm:mt-0 opacity-60 group-hover:opacity-100 group-hover:text-accent-cyan transition-all">
                  {item.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Editorial Meta Footer inside Overlay */}
      <footer
        ref={metaRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs font-mono text-secondary-dark"
      >
        <div>
          <p className="text-white/40 uppercase mb-1">COORDINATES</p>
          <p className="text-white/80">LAT 51.4545° N, LON 2.5879° W</p>
          <p>EARTH // DIGITAL REALM</p>
        </div>
        <div>
          <p className="text-white/40 uppercase mb-1">INQUIRIES</p>
          <p className="text-white/80 hover:text-accent-cyan transition-colors">
            hello@studio-proto.internal
          </p>
          <p>NEW BUSINESS OPEN FOR Q1/Q2</p>
        </div>
        <div className="sm:text-right">
          <p className="text-white/40 uppercase mb-1">DESIGN ENGINE</p>
          <p className="text-accent-cyan">STUDIO PROTO v1.0</p>
          <p>© 2026 ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  );
}
