"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store/useUIStore";
import PillButton from "@/components/ui/PillButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandStatement() {
  const { openVideoModal } = useUIStore();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<SVGPathElement>(null);
  const reelWrapperRef = useRef<HTMLDivElement>(null);
  const reelContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const spline = splineRef.current;
    const reelWrapper = reelWrapperRef.current;
    const reelContainer = reelContainerRef.current;

    if (!section || !headline || !reelContainer) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lines = headline.querySelectorAll(".reveal-line");

      if (prefersReducedMotion) {
        gsap.set(lines, { yPercent: 0, opacity: 1 });
        gsap.set(reelContainer, { width: "95vw", scale: 1, borderRadius: "20px" });
        return;
      }

      // 1. Masked typography reveal line-by-line
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headline,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Cyan Spline Curve stroke reveal
      if (spline) {
        const length = spline.getTotalLength();
        gsap.set(spline, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(spline, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: headline,
            start: "top 65%",
            end: "bottom 30%",
            scrub: 0.8,
          },
        });
      }

      // 3. Scroll-driven Showreel Expansion
      if (reelWrapper && reelContainer) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: reelWrapper,
            start: "top 75%",
            end: "bottom 85%",
            scrub: 1,
          },
        });

        tl.fromTo(
          reelContainer,
          {
            width: "74vw",
            borderRadius: "36px",
            scale: 0.93,
          },
          {
            width: "95vw",
            borderRadius: "20px",
            scale: 1.0,
            ease: "power1.inOut",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-32 flex flex-col items-center overflow-hidden"
    >
      {/* Manifesto Headline Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full space-y-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-cyan" />
          <span className="text-xs uppercase tracking-widest text-secondary-light font-mono">
            MANIFESTO // 01
          </span>
        </div>

        {/* Masked Headline Lines */}
        <div
          ref={headlineRef}
          className="text-3xl sm:text-5xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.08] text-primary-light max-w-5xl"
        >
          <div className="overflow-hidden pb-1">
            <span className="reveal-line block">We merge code, physics,</span>
          </div>
          <div className="overflow-hidden pb-1">
            <span className="reveal-line block">and sculptural design into</span>
          </div>
          <div className="overflow-hidden pb-1">
            <span className="reveal-line block text-secondary-light">
              living digital experiences.
            </span>
          </div>
        </div>

        {/* Supporting Editorial Paragraph & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-border-subtle-light/70 text-secondary-light text-sm sm:text-base leading-relaxed">
          <p className="md:col-span-2">
            Every interaction is engineered as an artful choreography of light, geometry, and real-time computation. We build memorable spatial software and bespoke WebGL platforms that elevate brands beyond static templates.
          </p>
          <div className="flex flex-col justify-between font-mono text-xs space-y-2 border-l border-border-subtle-light/60 pl-6">
            <span className="text-primary-light font-medium">STUDIO PROTO SPECS:</span>
            <span>FRAME CYCLE // 60 FPS UNIFIED</span>
            <span>SHADERS // CUSTOM PROCEDURAL</span>
            <span className="text-accent-cyan">ORIGINAL ARCHITECTURE</span>
          </div>
        </div>
      </div>

      {/* Decorative Cyan Spline Curve Graphic */}
      <div className="w-full max-w-4xl mx-auto h-24 sm:h-32 my-4 relative pointer-events-none select-none">
        <svg
          viewBox="0 0 800 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="cyan-spline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2DE2E6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#2DE2E6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2DE2E6" stopOpacity="0.2" />
            </linearGradient>
            <filter id="spline-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            ref={splineRef}
            d="M 50 10 C 250 110, 550 -10, 750 90"
            stroke="url(#cyan-spline-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#spline-glow)"
          />
        </svg>
      </div>

      {/* Scroll-Driven Expanding Showreel Container */}
      <div
        ref={reelWrapperRef}
        className="w-full flex justify-center items-center py-6 sm:py-10"
      >
        <div
          ref={reelContainerRef}
          data-cursor="view"
          data-cursor-text="PLAY"
          onClick={openVideoModal}
          className="relative aspect-video max-h-[720px] overflow-hidden bg-bg-dark border border-border-subtle-light shadow-[0_32px_80px_-20px_rgba(0,0,0,0.18)] cursor-pointer group select-none transition-shadow duration-500 hover:shadow-[0_40px_100px_-20px_rgba(45,226,230,0.15)]"
        >
          {/* Ambient Preview Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 ease-editorial opacity-85 group-hover:opacity-100"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              type="video/mp4"
            />
          </video>

          {/* Vignette Overlay & Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-bg-dark/30 pointer-events-none" />

          {/* Top HUD Badges */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-bg-dark/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-white/80 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span>SHOWREEL // 2026 EDITION</span>
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 bg-bg-dark/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-white/80 pointer-events-none">
            <span>SOUND ON // CLICK TO LAUNCH</span>
          </div>

          {/* Central Magnetic Action Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto transform group-hover:scale-110 transition-transform duration-300 ease-editorial">
              <PillButton
                label="PLAY REEL"
                dotCount={1}
                variant="dark"
                active={true}
                onClick={openVideoModal}
                className="bg-bg-dark/80 backdrop-blur-xl border-white/20 text-white shadow-2xl px-6 py-3 text-xs tracking-wider"
              />
            </div>
          </div>

          {/* Bottom HUD Metadata */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex justify-between items-center text-[11px] font-mono text-white/60 pointer-events-none">
            <span>DISCIPLINES: 3D / R3F / MOTION / BRANDING</span>
            <span>DURATION: 01:24</span>
          </div>
        </div>
      </div>
    </section>
  );
}
