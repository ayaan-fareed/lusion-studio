"use client";

import React from "react";
import dynamic from "next/dynamic";
import PillButton from "@/components/ui/PillButton";

// Dynamically import SceneContainer with SSR disabled to guarantee clean WebGL client island isolation
const SceneContainer = dynamic(
  () => import("@/components/canvas/SceneContainer"),
  { ssr: false }
);
const HeroJacksScene = dynamic(
  () => import("@/components/canvas/HeroJacksScene"),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section className="relative w-full pt-4 pb-16 sm:pb-24 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col gap-10 sm:gap-14">
      {/* Top Editorial Headline & Sub-header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-4">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle-light bg-white/70 text-xs font-mono text-secondary-light">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            <span>PHASE 3 // REALTIME 3D EXPERIENCES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-semibold tracking-[-0.03em] leading-[1.02] text-primary-light">
            Crafting digital worlds that defy gravity.
          </h1>
        </div>

        <div className="lg:max-w-xs space-y-4 text-secondary-light">
          <p className="text-sm sm:text-base leading-relaxed">
            Pioneering the intersection of editorial art direction, procedural 3D graphics, and real-time WebGL installations.
          </p>
          <div className="flex items-center gap-3">
            <PillButton label="EXPLORE WORK" href="#work" dotCount={1} variant="dark" />
            <PillButton label="OUR ETHOS" href="#about" variant="glass" />
          </div>
        </div>
      </div>

      {/* 3D Interactive Jacks Stage Container */}
      <div
        data-cursor="drag"
        data-cursor-text="PUSH"
        className="relative w-full h-[460px] sm:h-[580px] lg:h-[660px] rounded-card sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-[#EBECEF] via-[#F2F3F6] to-[#ECEEF2] border border-border-subtle-light shadow-[0_24px_64px_-16px_rgba(0,0,0,0.06)] group"
      >
        {/* WebGL Canvas Island */}
        <SceneContainer
          className="w-full h-full"
          camera={{ position: [0, 0, 8.5], fov: 42 }}
        >
          <HeroJacksScene />
        </SceneContainer>

        {/* Technical HUD Overlay Badges */}
        <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 text-[11px] font-mono text-secondary-light select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          <span>INSTANCED JACKS (N=34)</span>
        </div>

        <div className="pointer-events-none absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 text-[11px] font-mono text-secondary-light select-none">
          <span>PHYSICS: HARMONIC REPULSION</span>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 text-[11px] font-mono text-secondary-light select-none">
          <span className="text-primary-light font-medium">MOVE CURSOR</span>
          <span className="text-secondary-light">TO DISPLACE GEOMETRIES</span>
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 text-[11px] font-mono text-secondary-light select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>60 FPS // DEMAND RAF</span>
        </div>
      </div>

      {/* Studio Category Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
        <div className="p-4 rounded-card bg-white/60 border border-border-subtle-light backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase text-secondary-light">DISCIPLINE 01</p>
          <p className="text-sm font-medium text-primary-light">Real-Time WebGL</p>
        </div>
        <div className="p-4 rounded-card bg-white/60 border border-border-subtle-light backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase text-secondary-light">DISCIPLINE 02</p>
          <p className="text-sm font-medium text-primary-light">Procedural 3D Systems</p>
        </div>
        <div className="p-4 rounded-card bg-white/60 border border-border-subtle-light backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase text-secondary-light">DISCIPLINE 03</p>
          <p className="text-sm font-medium text-primary-light">Motion & Kinetic Design</p>
        </div>
        <div className="p-4 rounded-card bg-white/60 border border-border-subtle-light backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase text-secondary-light">DISCIPLINE 04</p>
          <p className="text-sm font-medium text-primary-light">Creative Engineering</p>
        </div>
      </div>
    </section>
  );
}
