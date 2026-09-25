"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service if configured
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg-light text-primary-light flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-secondary-light">
          Runtime Exception // 500
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-secondary-light leading-relaxed">
          An unexpected error occurred while rendering this interface.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-light text-white text-xs font-mono tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
