"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useUIStore } from "@/lib/store/useUIStore";

export default function CustomCursor() {
  const { cursorVariant, cursorText } = useUIStore();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable on coarse pointer devices (touchscreens / mobile) or reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Use GSAP quickTo for spring-damped high-performance cursor tracking
    const cursorX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX(e.clientX);
      cursorY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button") as HTMLElement | null;
      if (!target) return;

      const customVariant = target.getAttribute("data-cursor");
      const customText = target.getAttribute("data-cursor-text");

      if (customVariant) {
        useUIStore.getState().setCursorVariant(customVariant as any);
        if (customText) useUIStore.getState().setCursorText(customText);
      } else if (target.tagName.toLowerCase() === "a" || target.tagName.toLowerCase() === "button") {
        useUIStore.getState().setCursorVariant("hover");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button");
      if (target) {
        useUIStore.getState().resetCursor();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isVisible]);

  // Adjust styling based on variant
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot || isTouchDevice) return;

    switch (cursorVariant) {
      case "hover":
        gsap.to(cursor, {
          width: 56,
          height: 56,
          backgroundColor: "rgba(45, 226, 230, 0.12)",
          borderColor: "rgba(45, 226, 230, 0.6)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 0.4,
          opacity: 0.4,
          duration: 0.2,
        });
        break;

      case "view":
        gsap.to(cursor, {
          width: 84,
          height: 84,
          backgroundColor: "#0A0A0C",
          borderColor: "#2DE2E6",
          duration: 0.35,
          ease: "back.out(1.5)",
        });
        gsap.to(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
        });
        break;

      case "drag":
        gsap.to(cursor, {
          width: 72,
          height: 72,
          backgroundColor: "#2DE2E6",
          borderColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
        });
        break;

      case "hidden":
        gsap.to([cursor, dot], {
          opacity: 0,
          duration: 0.2,
        });
        break;

      case "default":
      default:
        gsap.to(cursor, {
          width: 32,
          height: 32,
          backgroundColor: "transparent",
          borderColor: "rgba(17, 17, 17, 0.25)",
          opacity: isVisible ? 1 : 0,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 1,
          opacity: isVisible ? 1 : 0,
          duration: 0.2,
        });
        break;
    }
  }, [cursorVariant, isVisible, isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Central precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-primary-light pointer-events-none transition-opacity duration-150"
        style={{ opacity: isVisible && cursorVariant !== "hidden" ? 1 : 0 }}
      />

      {/* Trailing spring-damped follower circle/capsule */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-primary-light/30 flex items-center justify-center pointer-events-none transition-opacity duration-200"
        style={{
          opacity: isVisible && cursorVariant !== "hidden" ? 1 : 0,
        }}
      >
        {(cursorVariant === "view" || cursorVariant === "drag") && (
          <span
            className={`text-[10px] font-mono font-medium uppercase tracking-wider ${
              cursorVariant === "drag" ? "text-bg-dark" : "text-white"
            }`}
          >
            {cursorText || (cursorVariant === "view" ? "VIEW" : "DRAG")}
          </span>
        )}
      </div>
    </div>
  );
}
