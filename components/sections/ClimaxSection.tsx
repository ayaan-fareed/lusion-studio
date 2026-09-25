"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SceneContainer from "@/components/canvas/SceneContainer";
import ClimaxAstronautScene from "@/components/canvas/ClimaxAstronautScene";
import PillButton from "@/components/ui/PillButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClimaxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const bottomCtaRef = useRef<HTMLDivElement>(null);
  const topBadgeRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pinWrapper = pinWrapperRef.current;
    const bgOverlay = bgOverlayRef.current;
    const headline = headlineWrapperRef.current;
    const caption = captionRef.current;
    const bottomCta = bottomCtaRef.current;
    const topBadge = topBadgeRef.current;

    if (!section || !pinWrapper || !bgOverlay || !headline) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lines = headline.querySelectorAll(".climax-line");

      if (prefersReducedMotion) {
        gsap.set(bgOverlay, { opacity: 1 });
        gsap.set(lines, { yPercent: 0, opacity: 1 });
        if (caption) gsap.set(caption, { opacity: 1, y: 0 });
        if (bottomCta) gsap.set(bottomCta, { opacity: 1, y: 0 });
        if (topBadge) gsap.set(topBadge, { opacity: 1, y: 0 });
        return;
      }

      // Initial states
      gsap.set(bgOverlay, { opacity: 0 });
      gsap.set(lines, { yPercent: 120, opacity: 0 });
      if (caption) gsap.set(caption, { opacity: 0, y: 20 });
      if (bottomCta) gsap.set(bottomCta, { opacity: 0, y: 30 });
      if (topBadge) gsap.set(topBadge, { opacity: 0, y: -20 });

      // Main scrubbed pin sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=170%",
          pin: pinWrapper,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // 0.0 -> 0.35: Dark void transition & top badge entrance
      tl.to(
        bgOverlay,
        {
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0
      );

      if (topBadge) {
        tl.to(
          topBadge,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.25,
          },
          0.1
        );
      }

      // 0.25 -> 0.65: Staggered headline reveal
      tl.to(
        lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          duration: 0.4,
        },
        0.25
      );

      // 0.45 -> 0.75: Caption and CTA presentation
      if (caption) {
        tl.to(
          caption,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.3,
          },
          0.45
        );
      }

      if (bottomCta) {
        tl.to(
          bottomCta,
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 0.3,
          },
          0.55
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full bg-bg-light transition-colors duration-500 overflow-hidden"
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen min-h-[640px] flex flex-col justify-between overflow-hidden"
      >
        {/* Background dark void transition overlay */}
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 bg-bg-dark pointer-events-none z-0"
        />

        {/* Ambient radial lighting glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(45,226,230,0.12)_0%,rgba(10,10,12,0)_65%)] pointer-events-none z-[1]" />

        {/* 3D WebGL Canvas Layer */}
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
          <SceneContainer
            camera={{ position: [0, 0, 7.6], fov: 45 }}
            className="w-full h-full"
          >
            <ClimaxAstronautScene scrollProgress={scrollProgress} />
          </SceneContainer>
        </div>

        {/* Interactive Typography & Navigation Overlay */}
        <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 py-10 sm:py-14 flex flex-col justify-between pointer-events-none">
          {/* Top Status Header */}
          <div ref={topBadgeRef} className="flex justify-between items-center w-full pt-8 sm:pt-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-xs font-mono text-white/90 pointer-events-auto shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span>ZERO-G CLIMAX // 3D RIG ACTIVE</span>
            </div>
            <span className="text-xs font-mono text-white/40 hidden sm:inline-block">
              THREE.JS INSTANCED // REAL-TIME LIGHTING
            </span>
          </div>

          {/* Center Stage Headline Reveal */}
          <div
            ref={headlineWrapperRef}
            className="mt-16 sm:mt-20 mb-auto text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto pointer-events-none px-4 drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
          >
            <div className="overflow-hidden">
              <h2 className="climax-line text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight text-white leading-none">
                EXPLORING THE BOUNDARIES
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="climax-line text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-white to-[#C084FC] leading-none">
                OF DIGITAL INTERACTION
              </h2>
            </div>
            <p
              ref={captionRef}
              className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto font-light leading-relaxed pt-2"
            >
              Bridging high-performance WebGL engineering with uncompromising studio aesthetics and fluid microgravity physics.
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div
            ref={bottomCtaRef}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pointer-events-auto pb-4"
          >
            <div className="flex items-center gap-2.5 text-xs font-mono text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              <span>MOVE POINTER TO ENGAGE ZERO-G TRACKING</span>
            </div>

            <div className="flex items-center gap-3">
              <PillButton
                label="INITIATE CONVERSATION"
                href="#contact"
                variant="glass"
                dotCount={2}
                active={true}
                className="bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-md shadow-lg"
                ariaLabel="Initiate conversation and contact studio"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
