"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store/useUIStore";
import PillButton from "@/components/ui/PillButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CityTime {
  city: string;
  code: string;
  tz: string;
}

const CITIES: CityTime[] = [
  { city: "LONDON", code: "LON // GMT", tz: "Europe/London" },
  { city: "NEW YORK", code: "NYC // EST", tz: "America/New_York" },
  { city: "TOKYO", code: "TYO // JST", tz: "Asia/Tokyo" },
];

export default function StudioFooter() {
  const { openContactDrawer } = useUIStore();
  const footerRef = useRef<HTMLElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  // Live clocks state
  const [times, setTimes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Update clocks every second
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const updated: Record<string, string> = {};
      CITIES.forEach(({ city, tz }) => {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          updated[city] = formatter.format(now);
        } catch {
          updated[city] = now.toTimeString().slice(0, 8);
        }
      });
      setTimes(updated);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Kinetic Marquee Animation
  useEffect(() => {
    const marqueeInner = marqueeInnerRef.current;
    if (!marqueeInner) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Infinite horizontal translation
      const tween = gsap.to(marqueeInner, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: "none",
      });

      // Subtle speed alteration on mouse hover
      const onMouseEnter = () => gsap.to(tween, { timeScale: 0.45, duration: 0.5 });
      const onMouseLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.5 });

      marqueeInner.addEventListener("mouseenter", onMouseEnter);
      marqueeInner.addEventListener("mouseleave", onMouseLeave);

      return () => {
        marqueeInner.removeEventListener("mouseenter", onMouseEnter);
        marqueeInner.removeEventListener("mouseleave", onMouseLeave);
      };
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Back to Top Interaction
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@studioproto.dev");
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative w-full bg-[#08090C] text-white pt-24 sm:pt-32 pb-12 overflow-hidden border-t border-white/10"
    >
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(45,226,230,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col gap-20 sm:gap-28 relative z-10">
        {/* Top Header & Status Grid */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/10 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 text-xs font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CURRENT STATUS // ACCEPTING COMMISSIONS FOR Q3/Q4</span>
            </div>
            <p className="text-secondary-dark text-xs sm:text-sm font-mono max-w-md">
              Available for select partnerships, high-fidelity WebGL systems, and bespoke digital experiences.
            </p>
          </div>

          {/* Timezone Clocks */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            {CITIES.map(({ city, code }) => (
              <div key={city} className="space-y-1">
                <span className="text-[10px] sm:text-xs font-mono text-secondary-dark block">
                  {code}
                </span>
                <span className="text-sm sm:text-base font-mono font-semibold text-white tabular-nums tracking-wide block">
                  {times[city] || "--:--:--"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Large Kinetic Typography Call to Action */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark">
              [ INITIATE COLLABORATION ]
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan hidden sm:inline-block">
              CLICK HEADLINE TO OPEN INQUIRY PROTOCOL ↵
            </span>
          </div>

          {/* Kinetic Marquee Ribbon */}
          <div
            onClick={openContactDrawer}
            data-cursor="view"
            data-cursor-text="TALK"
            className="group relative w-full overflow-hidden border-y border-white/15 py-8 sm:py-14 cursor-pointer select-none transition-colors duration-300 hover:bg-white/[0.02]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openContactDrawer();
              }
            }}
            aria-label="Let's create something unforgettable - open contact drawer"
          >
            <div
              ref={marqueeInnerRef}
              className="flex whitespace-nowrap will-change-transform w-fit"
            >
              {/* Repeated headline blocks for seamless infinite ticker */}
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-8 sm:gap-16 pr-8 sm:pr-16">
                  <span className="text-4xl sm:text-7xl md:text-9xl font-extrabold uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-accent-cyan group-hover:to-purple-400">
                    LET&apos;S CREATE SOMETHING UNFORGETTABLE
                  </span>
                  <span className="w-4 h-4 sm:w-8 sm:h-8 rounded-full border-2 border-accent-cyan bg-accent-cyan/20 flex-shrink-0 transition-transform duration-300 group-hover:scale-125" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Studio Channels & Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-8 pt-4">
          {/* Dispatch Channel / Email */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-dark block">
              DIRECT INQUIRIES // DISPATCH
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                data-cursor="hover"
                className="group inline-flex items-center gap-3 text-lg sm:text-2xl font-bold tracking-tight text-white hover:text-accent-cyan transition-colors"
                aria-label="Copy studio email address"
              >
                <span>hello@studioproto.dev</span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-white/20 bg-white/5 text-secondary-dark group-hover:text-accent-cyan group-hover:border-accent-cyan transition-colors">
                  {copied ? "COPIED! ✓" : "COPY EMAIL"}
                </span>
              </button>
            </div>
            <p className="text-xs text-secondary-dark font-mono">
              PGP encryption key available upon request for sensitive commissions.
            </p>
          </div>

          {/* Quick Drawer Launcher Button */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-dark block">
              INTERACTIVE INQUIRY FORM
            </span>
            <PillButton
              label="OPEN INQUIRY FORM"
              variant="light"
              dotCount={2}
              active={true}
              onClick={openContactDrawer}
              className="w-full sm:w-auto"
            />
          </div>

          {/* Studio Navigation Sitemap */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-dark block">
              DIRECTORY // SITEMAP
            </span>
            <ul className="space-y-2 text-sm font-mono text-secondary-dark">
              <li>
                <Link href="#work" data-cursor="hover" className="hover:text-white transition-colors">
                  {"// 01 WORK (SHOWCASE)"}
                </Link>
              </li>
              <li>
                <Link href="#about" data-cursor="hover" className="hover:text-white transition-colors">
                  {"// 02 ABOUT & ETHOS"}
                </Link>
              </li>
              <li>
                <Link href="#experience" data-cursor="hover" className="hover:text-white transition-colors">
                  {"// 03 CLIMAX ZERO-G"}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openContactDrawer}
                  data-cursor="hover"
                  className="hover:text-accent-cyan transition-colors text-left"
                >
                  {"// 04 CONTACT (DRAWER)"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon & Bottom Utility Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-white/10 text-xs font-mono text-secondary-dark">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="text-white/80 font-medium">STUDIO PROTO &copy; {new Date().getFullYear()}</span>
            <span>CLEAN-ROOM CREATIVE TECHNOLOGY LAB</span>
            <span className="hidden md:inline-block">60 FPS WEBGL // ZERO LATENCY</span>
          </div>

          {/* Smooth Back to Top Button */}
          <button
            type="button"
            onClick={handleBackToTop}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all text-xs font-mono select-none"
            aria-label="Scroll back to top of page"
          >
            <span>BACK TO APEX</span>
            <span className="transition-transform group-hover:-translate-y-1 duration-200">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
