"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import type { GitHubProfile } from "@/lib/getRepos";
import SectionWrapper from "./ui/SectionWrapper";
import GlassCard from "./ui/GlassCard";
import { User } from "@phosphor-icons/react/dist/csr/User";
import { Path } from "@phosphor-icons/react/dist/csr/Path";
import { Quotes } from "@phosphor-icons/react/dist/csr/Quotes";
import { X } from "@phosphor-icons/react/dist/csr/X";

// Journey modal: clickable story card (desktop) and button (mobile).
function JourneyModal({ paragraphs, summary, isInView, title, close, tapHint }: { paragraphs: string[]; summary: string; isInView: boolean; title: string; close: string; tapHint: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Simple focus trap: keep Tab cycling inside the dialog.
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      openerRef.current?.focus?.();
    };
  }, [open]);

  return (
    <>
      {/* Desktop: clickable story card */}
      <button
        onClick={() => setOpen(true)}
        className="hidden h-full w-full cursor-pointer text-left lg:block"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="journey-dialog"
      >
        <GlassCard className="flex h-full flex-col p-6 sm:p-8" hoverLift>
          <div className="flex h-full flex-col gap-5 text-left">
            <div className="glass w-fit rounded-xl p-2.5" aria-hidden="true">
              <Quotes size={20} className="text-[var(--color-text-secondary)]" />
            </div>
            <p className="flex-1 text-justify text-[15px] leading-[1.9] text-[var(--color-text-secondary)] lg:text-base">
              {summary}
            </p>
            <p className="mt-auto border-t border-white/[0.06] pt-3 text-center font-mono text-[11px] tracking-wider text-[var(--color-text-muted)]">
              {tapHint}
            </p>
          </div>
        </GlassCard>
      </button>

      {/* Mobile: button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="glass glass-inner-highlight rounded-xl px-6 py-4 text-sm font-medium text-[var(--color-text-primary)] flex items-center justify-center gap-2 cursor-pointer w-full lg:hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.2 }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="journey-dialog"
      >
        <Path size={16} aria-hidden="true" />
        {title}
      </motion.button>

      {/* Portal overlay keeps the modal above the navbar stacking context. */}
      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4 sm:p-6 lg:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            id="journey-dialog"
            ref={dialogRef}
          >
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              className="relative m-auto flex max-h-[88dvh] w-full max-w-2xl flex-col lg:max-w-4xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Solid panel so page text does not bleed through */}
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-8">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="glass hidden rounded-xl p-2 sm:block" aria-hidden="true">
                      <Path size={16} className="text-[var(--color-text-secondary)]" />
                    </span>
                    <h3 className="truncate text-base font-semibold sm:text-lg">{title}</h3>
                  </div>
                  <button
                    ref={closeRef}
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-all hover:bg-white/10 hover:text-white"
                    aria-label={close}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
                <div className="scrollbar-none flex flex-col gap-6 overflow-y-auto p-5 sm:p-8 lg:p-10">
                  {paragraphs.map((p, i) => (
                    <div key={`para-${i}`} className="flex items-start gap-4">
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] tracking-wider text-[var(--color-text-muted)]" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-[15px]">
                        {p}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}

// About section with profile card and journey modal.
export default function About({ githubProfile }: { githubProfile?: GitHubProfile | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  const avatarUrl = githubProfile?.avatar_url || null;
  const githubBio = githubProfile?.bio || null;
  const githubFollowers = githubProfile?.followers || 0;
  const githubRepos = githubProfile?.public_repos || 0;

  return (
    <SectionWrapper id="tentang">
      <div ref={ref} className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t.about.num}</span>
            <span className="w-12 h-px bg-white/10" />
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.about.title}
          </motion.h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
            {/* Profile card: avatar overlay with bio and stats */}
            <motion.div
              className="lg:col-span-2 glass glass-inner-highlight overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div className="relative aspect-[16/10] lg:aspect-[4/3]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${t.profile.name} - Avatar`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.02]" aria-hidden="true">
                    <User size={48} className="text-[var(--color-text-muted)]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-base font-semibold leading-tight sm:text-lg">{t.profile.name}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-wider text-white/70">{t.hero.role}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 sm:p-5">
                {githubBio && (
                  <p className="text-xs italic leading-relaxed text-[var(--color-text-secondary)]">&ldquo;{githubBio}&rdquo;</p>
                )}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: t.about.repos, value: githubRepos },
                    { label: t.about.followers, value: githubFollowers },
                    { label: t.about.following, value: githubProfile?.following || 0 },
                  ].map((stat) => (
                      <div
                      key={stat.label}
                      className="glass rounded-xl px-2 py-3 text-center"
                    >
                      <p className="text-xl font-bold tabular-nums tracking-tighter sm:text-2xl">{stat.value}</p>
                      <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] sm:text-[10px]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right column: story card (opens modal on desktop) */}
            <motion.div
              className="flex flex-col gap-6 lg:col-span-3"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <JourneyModal paragraphs={t.profile.about} summary={t.profile.summary} isInView={isInView} title={t.about.journey} close={t.about.close} tapHint={t.about.tapHint} />
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
