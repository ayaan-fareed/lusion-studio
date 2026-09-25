"use client";

import React, { useRef, useState } from "react";

export interface ReelItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface HorizontalMediaReelProps {
  items: ReelItem[];
  className?: string;
}

export default function HorizontalMediaReel({ items, className = "" }: HorizontalMediaReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (e.key === "ArrowRight") {
      containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      containerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  return (
    <div className={`relative w-full space-y-4 select-none ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-secondary-light">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          <span>GALLERY REEL // VISUAL PROCESS</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-mono text-secondary-light">
          DRAG OR USE ARROW KEYS [← →]
        </span>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Project Visual Gallery"
        data-cursor="drag"
        data-cursor-text="DRAG"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        className="w-full overflow-x-auto scroll-smooth no-scrollbar px-6 sm:px-12 flex gap-6 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-accent-cyan/50"
      >
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="flex-shrink-0 w-[280px] sm:w-[380px] lg:w-[440px] space-y-3"
          >
            <div className="relative aspect-[4/3] rounded-card sm:rounded-[20px] overflow-hidden bg-white/60 border border-border-subtle-light shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-editorial"
              />
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono">
              <span className="font-medium text-primary-light">{item.title}</span>
              <span className="text-secondary-light">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
