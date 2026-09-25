"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/lib/store/useUIStore";
import PillButton from "@/components/ui/PillButton";

export default function VideoReelModal() {
  const { isVideoModalOpen, closeVideoModal } = useUIStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Keyboard navigation & Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoModalOpen) {
        closeVideoModal();
      }
      if (e.key === " " && isVideoModalOpen) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoModalOpen, closeVideoModal]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = "hidden";
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay fallback with audio muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVideoModalOpen]);

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isVideoModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Studio Showreel Player"
      className="fixed inset-0 z-[120] bg-bg-dark/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none animate-in fade-in duration-300"
    >
      {/* Top Bar inside Video Modal */}
      <header className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-secondary-dark">
            STUDIO PROTO // CINEMATIC REEL
          </span>
        </div>

        <PillButton
          label="CLOSE"
          dotCount={1}
          active={true}
          variant="dark"
          onClick={closeVideoModal}
          ariaLabel="Close Showreel Player"
          className="border-white/20 text-white hover:border-accent-cyan"
        />
      </header>

      {/* Main Video Viewport */}
      <div className="relative my-auto w-full max-w-5xl mx-auto aspect-video rounded-card sm:rounded-card-lg overflow-hidden bg-black shadow-2xl border border-white/10 group">
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Video Overlay Action Trigger */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent-cyan/90 text-bg-dark flex items-center justify-center pl-1 shadow-lg transform hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Video Controls Bar */}
      <footer className="w-full max-w-5xl mx-auto z-10 space-y-3">
        {/* Scrubber track */}
        <div
          onClick={handleSeek}
          data-cursor="hover"
          className="w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer relative transition-all duration-150 overflow-hidden"
        >
          <div
            className="h-full bg-accent-cyan rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-secondary-dark pt-1">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-accent-cyan transition-colors"
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? "PAUSE [SPACE]" : "PLAY [SPACE]"}
            </button>
            <button
              onClick={toggleMute}
              className="text-white hover:text-accent-cyan transition-colors"
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? "UNMUTE" : "MUTE"}
            </button>
            <span>
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>

          <div className="hidden sm:block">
            <span>PRESS [ESC] TO EXIT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
