"use client";

import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Canvas encountered an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SceneContainerProps {
  children: ReactNode;
  className?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
}

export default function SceneContainer({
  children,
  className = "w-full h-full",
  camera = { position: [0, 0, 9], fov: 45 },
}: SceneContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Pause rendering when canvas is scrolled outside the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const fallbackUI = (
    <div className="w-full h-full min-h-[360px] flex items-center justify-center bg-white/40 dark:bg-bg-dark/40 rounded-card-lg border border-border-subtle-light text-secondary-light font-mono text-xs">
      <div className="flex flex-col items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse" />
        <span>INITIALIZING 3D ENGINE...</span>
      </div>
    </div>
  );

  if (!mounted) {
    return <div ref={containerRef} className={className}>{fallbackUI}</div>;
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <CanvasErrorBoundary fallback={fallbackUI}>
        <Canvas
          frameloop={isVisible ? "always" : "never"}
          dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)]}
          camera={{
            position: camera.position || [0, 0, 9],
            fov: camera.fov || 45,
            near: camera.near || 0.1,
            far: camera.far || 100,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
