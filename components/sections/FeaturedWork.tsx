"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard, { ProjectData } from "@/components/ui/ProjectCard";
import projectsData from "@/content/projects.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const projects = projectsData as ProjectData[];

  const col1Projects = projects.filter((_, i) => i % 2 === 0);
  const col2Projects = projects.filter((_, i) => i % 2 === 1);

  useEffect(() => {
    const section = sectionRef.current;
    const col2 = col2Ref.current;
    if (!section || !col2) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Apply smooth asynchronous vertical parallax lag on column 2
    const ctx = gsap.context(() => {
      gsap.fromTo(
        col2,
        { yPercent: 0 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full py-20 sm:py-32 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col gap-12 sm:gap-16"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-subtle-light pb-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle-light bg-white/70 text-xs font-mono text-secondary-light">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            <span>SELECTED WORK // 2025–2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] leading-[1.08] text-primary-light">
            Engineered with precision & procedural wonder.
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-secondary-light">
          <span className="border border-border-subtle-light px-3 py-1.5 rounded-full bg-white/50">
            TOTAL CASE STUDIES: {projects.length}
          </span>
          <span className="hidden sm:inline-block border border-border-subtle-light px-3 py-1.5 rounded-full bg-white/50">
            PARALLAX: 0.15× LAG
          </span>
        </div>
      </div>

      {/* 2-Column Offset Parallax Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-start">
        {/* Column 1 */}
        <div className="space-y-12 sm:space-y-20">
          {col1Projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={projects.indexOf(project) + 1}
            />
          ))}
        </div>

        {/* Column 2 (Offset Vertically with Parallax Scrub) */}
        <div
          ref={col2Ref}
          className="space-y-12 sm:space-y-20 md:mt-24 lg:mt-32"
        >
          {col2Projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={projects.indexOf(project) + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
