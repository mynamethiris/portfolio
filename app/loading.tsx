// Loading state for the home page while server data resolves.
export default function Loading() {
  return (
    <main className="relative z-10 flex min-h-[80dvh] items-center justify-center">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/50"
        role="status"
        aria-label="Memuat..."
      />
    </main>
  );
}
