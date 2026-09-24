"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import SectionWrapper from "./ui/SectionWrapper";
import GlassCard from "./ui/GlassCard";
import ExpandableGrid from "./ui/ExpandableGrid";
import SideCarousel from "./ui/SideCarousel";
import OverflowMarquee from "./ui/OverflowMarquee";
import { useLang } from "@/lib/i18n";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretUp } from "@phosphor-icons/react/dist/csr/CaretUp";

type CertItem = {
  id: number;
  source: string;
  title: string;
  date: string;
  kind?: string;
  description: string;
};

// Scrolling badge for long source names.
function SourceBadge({ source }: { source: string }) {
  return (
    <OverflowMarquee
      text={source}
      outerClassName="glass min-w-0 flex-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]"
    />
  );
}

// Single certificate card.
function CertCard({ cert }: { cert: CertItem }) {
  return (
    <GlassCard className="h-full p-4 sm:p-5" disableTap>
      <div className="flex min-h-0 flex-col gap-2.5 sm:min-h-[190px]">
        <div className="flex items-center gap-2">
          <SourceBadge source={cert.source} />
          <span className="glass shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider text-[var(--color-text-muted)]">
            {cert.date}
          </span>
        </div>
        <h3 className="text-balance text-[15px] font-semibold leading-snug sm:text-base">{cert.title}</h3>
        <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">{cert.description}</p>
      </div>
    </GlassCard>
  );
}

// Certificate list: unlimited carousel on mobile, grid with toggle on larger screens.
function CertSection({
  items,
  showAll,
  onToggle,
  toggleLabelDesktop,
  toggleLabelTablet,
  scrollHint,
}: {
  items: CertItem[];
  showAll?: boolean;
  onToggle?: () => void;
  toggleLabelDesktop?: string;
  toggleLabelTablet?: string;
  scrollHint: string;
}) {
  const hasExtrasDesktop = showAll !== undefined && items.length > 3;
  const hasExtrasTablet = showAll !== undefined && items.length > 4;
  const open = showAll === true;
  const visibleMobile = items;

  return (
    <div className="flex flex-col gap-4">
      <SideCarousel items={visibleMobile} keyOf={(cert) => cert.id} renderItem={(cert) => <CertCard cert={cert} />} scrollHint={scrollHint} />
      <ExpandableGrid
        items={items}
        preview={4}
        open={open}
        className="hidden sm:block lg:hidden"
        gridClassName="grid grid-cols-2 gap-4"
        keyOf={(cert) => cert.id}
        render={(cert) => <CertCard cert={cert} />}
      />
      {hasExtrasTablet && onToggle && (
        <button
          onClick={onToggle}
          className="glass glass-inner-highlight hidden min-h-[44px] items-center justify-center gap-1.5 self-center rounded-full px-5 py-2.5 font-mono text-xs tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] active:scale-[0.98] sm:inline-flex lg:hidden"
          aria-expanded={showAll}
        >
          {showAll ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />} {toggleLabelTablet}
        </button>
      )}
      <ExpandableGrid
        items={items}
        preview={3}
        open={open}
        className="hidden lg:block"
        gridClassName="grid grid-cols-3 gap-4"
        keyOf={(cert) => cert.id}
        render={(cert) => <CertCard cert={cert} />}
      />
      {hasExtrasDesktop && onToggle && (
        <button
          onClick={onToggle}
          className="glass glass-inner-highlight hidden min-h-[44px] items-center justify-center gap-1.5 self-center rounded-full px-5 py-2.5 font-mono text-xs tracking-wider text-[var(--color-text-secondary)] transition-all hover:text-[var(--color-text-primary)] active:scale-[0.98] lg:inline-flex"
          aria-expanded={showAll}
        >
          {showAll ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />} {toggleLabelDesktop}
        </button>
      )}
    </div>
  );
}

// Certificates section: sort featured first, then carousel + expandable grids.
export default function Certificates() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();
  const [showAll, setShowAll] = useState(false);
  const certificates = [...(t.certificateList as CertItem[])].sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === "featured" ? -1 : 1
  );

  return (
    <SectionWrapper id="sertifikat">
      <div ref={ref} className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <div>
          <motion.div
            className="mb-4 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              {t.certs.num}
            </span>
            <span className="h-px w-12 bg-white/10" />
          </motion.div>
          <motion.h2
            className="text-balance text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.certs.title}
          </motion.h2>
        </div>

        <CertSection
          items={certificates}
          showAll={showAll}
          onToggle={() => setShowAll((v) => !v)}
          toggleLabelDesktop={showAll ? t.certs.showLess : `${t.certs.showMore} (${certificates.length - 3})`}
          toggleLabelTablet={showAll ? t.certs.showLess : `${t.certs.showMore} (${certificates.length - 4})`}
          scrollHint={t.certs.scrollHint}
        />
      </div>
    </SectionWrapper>
  );
}
