"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  poster: string;
  videoPreview: string;
  accentColor: string;
}

interface ProjectCardProps {
  project: ProjectData;
  index?: number;
  className?: string;
}

export default function ProjectCard({ project, index, className = "" }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsVideoActive(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoActive(false);
    }
  };

  const formattedId = index !== undefined ? String(index).padStart(2, "0") : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="view"
      data-cursor-text="VIEW"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group block w-full select-none cursor-pointer ${className}`}
    >
      {/* Media Viewport Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-card sm:rounded-[24px] bg-[#E8E8EE] border border-border-subtle-light shadow-[0_16px_40px_-16px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)]">
        {/* Base Poster Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.poster}
          alt={project.title}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-editorial"
        />

        {/* Hover Scrub Preview Video */}
        <video
          ref={videoRef}
          src={project.videoPreview}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-500 ease-editorial ${
            isVideoActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2 pointer-events-none">
          <span className="bg-bg-dark/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white">
            {formattedId ? `${formattedId} // ${project.year}` : project.year}
          </span>
        </div>

        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-2 pointer-events-none">
          <span className="w-8 h-8 rounded-full bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md flex items-center justify-center text-primary-light border border-white/20 transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-300">
            ↗
          </span>
        </div>

        {/* Bottom Media Inlay Badge */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex justify-between items-end pointer-events-none">
          <span className="font-mono text-[11px] text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      {/* Editorial Metadata Info Below Card */}
      <div className="pt-4 sm:pt-5 space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary-light group-hover:text-accent-cyan transition-colors">
            {project.title}
          </h3>
          <span className="font-mono text-xs text-secondary-light">
            {project.category.split("/")[0].trim()}
          </span>
        </div>
        <p className="text-sm text-secondary-light line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
