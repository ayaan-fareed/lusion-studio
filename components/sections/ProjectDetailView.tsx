"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ProjectData } from "@/components/ui/ProjectCard";
import HorizontalMediaReel, { ReelItem } from "@/components/ui/HorizontalMediaReel";
import PillButton from "@/components/ui/PillButton";

interface ProjectDetailViewProps {
  project: ProjectData;
  nextProject: ProjectData;
}

export default function ProjectDetailView({ project, nextProject }: ProjectDetailViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Curated clean-room process stills derived for this showcase
  const galleryItems: ReelItem[] = [
    {
      id: "01",
      title: "Atmospheric Render",
      category: "Shader Pass",
      imageUrl: project.poster,
    },
    {
      id: "02",
      title: "Vector Curvature",
      category: "Geometry Matrix",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "03",
      title: "Chromatic Dispersion",
      category: "Fresnel Analysis",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "04",
      title: "Spatial Typography",
      category: "Editorial Interface",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EBEB] text-primary-light pt-28 pb-20 selection:bg-accent-cyan selection:text-bg-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16 sm:space-y-24">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between border-b border-black/10 pb-6">
          <Link
            href="/#work"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary-light hover:text-primary-light transition-colors"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>ALL WORK</span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: project.accentColor }}
            />
            <span className="font-mono text-xs uppercase tracking-wider text-secondary-light">
              {`${project.category} // ${project.year}`}
            </span>
          </div>
        </div>

        {/* Hero Headline & Lead Typography */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white/50 text-xs font-mono text-secondary-light">
            <span>CASE STUDY // DEEP DIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.04] text-primary-light">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-secondary-light font-normal leading-relaxed pt-2">
            {project.description}
          </p>
        </section>

        {/* Primary Media Showcase Container */}
        <section className="relative aspect-video w-full rounded-card sm:rounded-[32px] overflow-hidden bg-bg-dark shadow-[0_24px_64px_-16px_rgba(0,0,0,0.12)] border border-black/10 group">
          <video
            ref={videoRef}
            src={project.videoPreview}
            poster={project.poster}
            autoPlay
            loop
            muted
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent pointer-events-none" />

          {/* Video Toggle Action Badge */}
          <div className="absolute bottom-6 right-6 pointer-events-none">
            <PillButton
              label={isPlaying ? "PAUSE VIDEO" : "PLAY VIDEO"}
              dotCount={1}
              active={isPlaying}
              variant="glass"
              onClick={togglePlay}
              className="pointer-events-auto bg-white/80 text-primary-light"
            />
          </div>
        </section>

        {/* Project Architecture & Technical Specifications Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-black/10">
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-secondary-light">
              ARCHITECTURE & APPROACH
            </h2>
            <p className="text-base sm:text-lg text-primary-light/90 leading-relaxed">
              Engineered with custom procedural shaders and dynamic GPU physics. The experience prioritizes continuous 60fps frame fidelity, tactile interactive responses, and clean-room visual art direction.
            </p>
            <p className="text-sm sm:text-base text-secondary-light leading-relaxed">
              Every coordinate is mathematically governed to achieve harmonic motion states, providing both structural stability and organic, unpredictable beauty in the browser.
            </p>
          </div>

          <div className="space-y-6 bg-white/60 p-6 rounded-card border border-black/5 font-mono text-xs">
            <div className="border-b border-black/10 pb-3">
              <span className="text-secondary-light uppercase block text-[10px] mb-0.5">DISCIPLINE</span>
              <span className="text-primary-light font-medium">{project.category}</span>
            </div>
            <div className="border-b border-black/10 pb-3">
              <span className="text-secondary-light uppercase block text-[10px] mb-0.5">TIMELINE</span>
              <span className="text-primary-light font-medium">{project.year}</span>
            </div>
            <div className="border-b border-black/10 pb-3">
              <span className="text-secondary-light uppercase block text-[10px] mb-0.5">RUNTIME STACK</span>
              <span className="text-primary-light font-medium">Next.js // Three.js // GSAP</span>
            </div>
            <div>
              <span className="text-secondary-light uppercase block text-[10px] mb-0.5">SYSTEM ACCENT</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: project.accentColor }}
                />
                <span className="text-primary-light font-medium">{project.accentColor}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Process Stills Gallery Reel */}
      <div className="py-16 sm:py-24">
        <HorizontalMediaReel items={galleryItems} />
      </div>

      {/* Next Case Study Navigation Banner */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8">
        <Link
          href={`/projects/${nextProject.slug}`}
          data-cursor="view"
          data-cursor-text="NEXT"
          className="group block p-8 sm:p-14 rounded-card sm:rounded-[28px] bg-white/80 hover:bg-white border border-black/10 shadow-sm transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-secondary-light">
                NEXT CASE STUDY →
              </span>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-primary-light group-hover:text-accent-cyan transition-colors">
                {nextProject.title}
              </h3>
              <p className="font-mono text-xs text-secondary-light">
                {`${nextProject.category} // ${nextProject.year}`}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-primary-light text-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
              →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
