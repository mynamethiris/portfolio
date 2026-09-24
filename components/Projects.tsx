"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { Globe } from "@phosphor-icons/react/dist/csr/Globe";
import { Code } from "@phosphor-icons/react/dist/csr/Code";
import { Star } from "@phosphor-icons/react/dist/csr/Star";
import { GitFork } from "@phosphor-icons/react/dist/csr/GitFork";
import { Monitor } from "@phosphor-icons/react/dist/csr/Monitor";
import { ArrowClockwise } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretUp } from "@phosphor-icons/react/dist/csr/CaretUp";
import SectionWrapper from "./ui/SectionWrapper";
import SideCarousel from "./ui/SideCarousel";
import GlassCard from "./ui/GlassCard";
import Image from "next/image";
import { ExpandableText } from "./ui/Expandable";
import { useLang } from "@/lib/i18n";
import type { Repo } from "@/lib/getRepos";

// Build a thumbnail URL for sites that cannot be embedded.
function previewImage(url: string) {
  return `https://image.thum.io/get/width/800/crop/500/noanimate/${encodeURIComponent(url)}`;
}

// Format the repo update date for the active locale.
function formatUpdated(iso: string, lang: "id" | "en", template: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (date === "Invalid Date") return "";
  return template.replace("{date}", date);
}

// Embedded live-site preview with loading state and refresh.
function LivePreview({ repo, label, refreshLabel, onRefresh }: { repo: Repo; label: string; refreshLabel: string; onRefresh: () => void }) {
  const [loaded, setLoaded] = useState(false);
  // Browsers rarely fire iframe error events for X-Frame-Options/CSP blocks,
  // so never leave the spinner hanging: reveal the frame after a timeout.
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setLoaded(true), 15000);
    return () => clearTimeout(t);
  }, [loaded]);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
        </div>
      )}
      <iframe
        src={repo.homepage}
        title={`${repo.name} live preview`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
      />
      <span className="absolute left-2.5 top-2.5 z-10 glass-strong rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider text-[var(--color-text-secondary)]">
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setLoaded(false);
          onRefresh();
        }}
        title={refreshLabel}
        aria-label={refreshLabel}
        className="glass-strong absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all hover:text-white active:scale-95"
      >
        <ArrowClockwise size={13} aria-hidden="true" />
      </button>
    </>
  );
}

// Screenshot fallback preview with loading, error, and retry states.
function ShotPreview({ repo, label, noPreview, refreshLabel, retryLabel, onRefresh }: { repo: Repo; label: string; noPreview: string; refreshLabel: string; retryLabel: string; onRefresh: () => void }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <Monitor size={24} aria-hidden="true" className="text-[var(--color-text-muted)]" />
        <p className="font-mono text-xs text-[var(--color-text-muted)]">{noPreview}</p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFailed(false);
            setLoaded(false);
            onRefresh();
          }}
          className="glass glass-inner-highlight mt-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-white active:scale-95"
        >
          <ArrowClockwise size={12} aria-hidden="true" /> {retryLabel}
        </button>
      </div>
    );
  }
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
        </div>
      )}
      <Image
        src={previewImage(repo.homepage)}
        alt={`${repo.name} preview`}
        fill
        unoptimized
        loading="lazy"
        sizes="(max-width: 640px) 100vw, 50vw"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <span className="absolute left-2.5 top-2.5 z-10 glass-strong rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider text-[var(--color-text-secondary)]">
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setLoaded(false);
          onRefresh();
        }}
        title={refreshLabel}
        aria-label={refreshLabel}
        className="glass-strong absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all hover:text-white active:scale-95"
      >
        <ArrowClockwise size={13} aria-hidden="true" />
      </button>
    </>
  );
}

// Card for a repository with a live website and preview.
function WebsiteCard({ repo }: { repo: Repo }) {
  const { t, lang } = useLang();
  const updated = formatUpdated(repo.updatedAt, lang, t.projects.updated);
  const [previewKey, setPreviewKey] = useState(0);
  const reloadPreview = () => setPreviewKey((k) => k + 1);
  // Mount the heavy preview (iframe or screenshot) only once the card
  // scrolls near the viewport, so a page with 4 sites is not 4 page loads.
  const previewRef = useRef<HTMLDivElement>(null);
  const previewInView = useInView(previewRef, { once: true, margin: "200px" });
  return (
    <GlassCard noPadding disableTap className="overflow-hidden flex flex-col">
      <div className="shrink-0 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2 px-4 pt-3" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-2 min-w-0 flex-1 truncate font-mono text-[10px] text-[var(--color-text-muted)]">
            {repo.homepage.replace(/^https?:\/\//, "")}
          </span>
        </div>
        {/* 16/10 preview area, full card width */}
        <div ref={previewRef} className="relative m-3 mt-2.5 aspect-[16/10] overflow-hidden rounded-lg bg-black/30">
          {!previewInView ? (
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
            </div>
          ) : repo.embeddable ? (
            <LivePreview
              key={`live-${previewKey}`}
              repo={repo}
              label={t.projects.previewNote}
              refreshLabel={t.projects.refresh}
              onRefresh={reloadPreview}
            />
          ) : (
            <ShotPreview
              key={`shot-${previewKey}`}
              repo={repo}
              label={t.projects.previewNote}
              noPreview={t.projects.noPreview}
              refreshLabel={t.projects.refresh}
              retryLabel={t.projects.retry}
              onRefresh={reloadPreview}
            />
          )}
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug break-words min-w-0">{repo.name}</h3>
          {repo.language ? (
            <span className="glass rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] shrink-0 max-w-28 truncate">
              {repo.language}
            </span>
          ) : null}
        </div>
        {repo.description ? (
          <ExpandableText text={repo.description} more={t.projects.showMore} less={t.projects.showLess} />
        ) : (
          <p className="text-sm text-[var(--color-text-muted)] italic">{t.projects.personal}</p>
        )}
        {updated ? <p className="font-mono text-[10px] tracking-wider text-[var(--color-text-muted)]">{updated}</p> : null}
        <div className="flex flex-wrap gap-2 mt-1">
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-inner-highlight rounded-full px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <Globe size={14} aria-hidden="true" /> {t.projects.visit}
          </a>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-glass-border)] flex items-center gap-1.5 hover:text-white transition-all active:scale-[0.98]"
          >
            <Code size={14} aria-hidden="true" /> {t.projects.code}
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

// Card for a repository without a live website.
// A stretched link keeps the whole card clickable while the expand button
// stays a sibling control above the link overlay (valid, keyboard-safe HTML).
function RepoCard({ repo }: { repo: Repo }) {
  const { t, lang } = useLang();
  const updated = formatUpdated(repo.updatedAt, lang, t.projects.updated);
  const repoLink = (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="after:absolute after:inset-0 after:rounded-2xl"
      aria-label={`${repo.name} - ${t.projects.code}`}
    >
      {repo.name}
    </a>
  );
  return (
    <GlassCard className="h-full relative">
      <div className="flex flex-col justify-between min-h-[220px] sm:min-h-[240px] gap-4">
        <div className="min-w-0">
          {repo.language ? (
            <>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="glass rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] truncate max-w-32">
                  {repo.language}
                </span>
                <div className="glass rounded-full p-2 shrink-0" aria-hidden="true">
                  <ArrowUpRight size={14} className="text-[var(--color-text-secondary)]" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 break-words leading-snug">{repoLink}</h3>
            </>
          ) : (
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold break-words leading-snug min-w-0 flex-1">{repoLink}</h3>
              <div className="glass rounded-full p-2 shrink-0" aria-hidden="true">
                <ArrowUpRight size={14} className="text-[var(--color-text-secondary)]" />
              </div>
            </div>
          )}
          {repo.description ? (
            <ExpandableText text={repo.description} more={t.projects.repoMore} less={t.projects.repoLess} className="relative z-10" />
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] italic">{t.projects.personal}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono text-[var(--color-text-muted)]">
          {repo.stars > 0 && <span className="inline-flex items-center gap-1"><Star size={12} aria-hidden="true" /> {repo.stars}</span>}
          {repo.forks > 0 && <span className="inline-flex items-center gap-1"><GitFork size={12} aria-hidden="true" /> {repo.forks}</span>}
          {updated ? <span className="inline-flex items-center">{updated}</span> : null}
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="glass rounded-md px-2 py-0.5">{topic}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// Projects section: live websites first, then remaining repositories.
export default function Projects({ repos }: { repos: Repo[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();
  const [showAllOthers, setShowAllOthers] = useState(false);
  const [showAllWebsites, setShowAllWebsites] = useState(false);
  const websites = repos.filter((r) => r.homepage);
  const others = repos.filter((r) => !r.homepage);
  const visibleOthersDesktop = showAllOthers ? others : others.slice(0, 3);
  const visibleOthersTablet = showAllOthers ? others : others.slice(0, 4);
  const visibleOthersMobile = showAllOthers ? others : others.slice(0, 4);
  const visibleWebsites = showAllWebsites ? websites : websites.slice(0, 4);
  const remainingOthersDesktop = others.length - 3;
  const remainingOthersTablet = others.length - 4;
  const remainingOthersMobile = others.length - 4;

  return (
    <SectionWrapper id="proyek">
      <div ref={ref} className="flex flex-col gap-10">
        <div>
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t.projects.num}</span>
            <span className="w-12 h-px bg-white/10" />
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.projects.title}
          </motion.h2>
        </div>

        {websites.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold">
              <Globe size={20} aria-hidden="true" className="text-[var(--color-text-secondary)] shrink-0" />
              {t.projects.websites}
            </h3>
            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              {visibleWebsites.map((repo) => (
                <WebsiteCard key={repo.id} repo={repo} />
              ))}
            </div>
            {websites.length > 4 && (
              <button
                onClick={() => setShowAllWebsites((v) => !v)}
                className="glass glass-inner-highlight inline-flex items-center justify-center gap-1.5 self-center rounded-full px-5 py-2.5 font-mono text-xs tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] active:scale-[0.98]"
                aria-expanded={showAllWebsites}
              >
                {showAllWebsites ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />}
                {showAllWebsites ? t.projects.collapseWebsites : `${t.projects.expandWebsites} (${websites.length - 4})`}
              </button>
            )}
          </div>
        )}

        {others.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold">
              <Code size={20} aria-hidden="true" className="text-[var(--color-text-secondary)] shrink-0" />
              {t.projects.others}
            </h3>
            <SideCarousel
              items={visibleOthersMobile}
              keyOf={(repo) => repo.id}
              renderItem={(repo) => <RepoCard repo={repo} />}
              scrollHint={t.projects.scrollHint}
            />
            {others.length > 4 && (
              <button
                onClick={() => setShowAllOthers((v) => !v)}
                className="glass glass-inner-highlight inline-flex items-center justify-center gap-1.5 self-center rounded-full px-5 py-2.5 font-mono text-xs tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] active:scale-[0.98] sm:hidden"
                aria-expanded={showAllOthers}
              >
                {showAllOthers ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />}
                {showAllOthers ? t.projects.collapseOthers : `${t.projects.expandOthers} (${remainingOthersMobile})`}
              </button>
            )}
            <div className="hidden grid-cols-2 gap-4 sm:grid lg:hidden">
              {visibleOthersTablet.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
            {others.length > 4 && (
              <button
                onClick={() => setShowAllOthers((v) => !v)}
                className="glass glass-inner-highlight hidden items-center justify-center gap-1.5 self-center rounded-full px-5 py-2.5 font-mono text-xs tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] active:scale-[0.98] sm:inline-flex lg:hidden"
                aria-expanded={showAllOthers}
              >
                {showAllOthers ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />}
                {showAllOthers ? t.projects.collapseOthers : `${t.projects.expandOthers} (${remainingOthersTablet})`}
              </button>
            )}
            <div className="hidden gap-4 lg:grid lg:grid-cols-3">
              {visibleOthersDesktop.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
            {others.length > 3 && (
              <button
                onClick={() => setShowAllOthers((v) => !v)}
                className="glass glass-inner-highlight hidden items-center justify-center gap-1.5 self-center rounded-full px-5 py-2.5 font-mono text-xs tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] active:scale-[0.98] lg:inline-flex"
                aria-expanded={showAllOthers}
              >
                {showAllOthers ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />}
                {showAllOthers ? t.projects.collapseOthers : `${t.projects.expandOthers} (${remainingOthersDesktop})`}
              </button>
            )}
          </div>
        )}

        {repos.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] font-mono text-center">{t.projects.empty}</p>
        )}
      </div>
    </SectionWrapper>
  );
}
