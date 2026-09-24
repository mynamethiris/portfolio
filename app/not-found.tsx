import Link from "next/link";

// 404 state for unknown routes.
export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-[80dvh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        404
      </p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Alamat yang dituju tidak tersedia.
      </p>
      <Link
        href="/"
        className="glass glass-inner-highlight rounded-full px-6 py-3 text-sm font-medium transition-all hover:bg-white/10 active:scale-[0.98]"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
