"use client";

import { useEffect } from "react";

// Error state for the home page with a retry action.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page] Unhandled error:", error);
  }, [error]);

  return (
    <main className="relative z-10 flex min-h-[80dvh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        500
      </p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Terjadi kesalahan
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Maaf, halaman gagal dimuat. Silakan coba lagi.
      </p>
      <button
        type="button"
        onClick={reset}
        className="glass glass-inner-highlight rounded-full px-6 py-3 text-sm font-medium transition-all hover:bg-white/10 active:scale-[0.98]"
      >
        Coba lagi
      </button>
    </main>
  );
}
