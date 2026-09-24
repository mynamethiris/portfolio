"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";

interface Props<T> {
  items: T[];
  keyOf: (item: T, i: number) => string | number;
  renderItem: (item: T, i: number) => ReactNode;
  scrollHint: string;
}

// Horizontal mobile carousel with edge indicator and a tappable hint pill.
// overflow-x-clip keeps the full-bleed track (-mx-5) and the edge fade from
// widening the page. `clip` (not `hidden`) is deliberate: vertical overflow
// stays visible so the hint is never cut off, and fixed descendants are
// unaffected. The hint stays visible whenever more cards lie ahead (not
// only at the start) and tapping it smooth-scrolls to the next card.
export default function SideCarousel<T>({ items, keyOf, renderItem, scrollHint }: Props<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | null>(null);
  const atEndRef = useRef(false);
  const [canScroll, setCanScroll] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const clearIdle = useCallback(() => {
    if (idleTimer.current !== null) {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const armIdle = useCallback(() => {
    clearIdle();
    idleTimer.current = window.setTimeout(() => {
      if (!atEndRef.current) setShowHint(true);
    }, 3000);
  }, [clearIdle]);

  const updateFromEl = useCallback((el: HTMLDivElement) => {
    const atEnd = el.scrollWidth - el.clientWidth - el.scrollLeft <= 12;
    atEndRef.current = atEnd;
    setShowHint(!atEnd);
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    updateFromEl(el);
    armIdle();
  };

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first ? first.clientWidth : el.clientWidth * 0.8) + 12;
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      setCanScroll(el.scrollWidth - el.clientWidth > 12);
      updateFromEl(el);
    };
    measure();
    armIdle();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearIdle();
    };
  }, [items.length, armIdle, clearIdle, updateFromEl]);

  if (items.length === 0) return null;

  return (
    <div className="relative overflow-x-clip sm:hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1"
      >
        {items.map((item, i) => (
          <motion.div
            key={keyOf(item, i)}
            className="w-[80vw] max-w-[300px] shrink-0 snap-start"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 4) * 0.05 }}
          >
            {renderItem(item, i)}
          </motion.div>
        ))}
      </div>
      {canScroll && (
        <div className="pointer-events-none absolute inset-y-0 right-[-1.25rem] w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
      )}
      <AnimatePresence>
        {showHint && canScroll && (
          <motion.button
            key="scroll-hint"
            type="button"
            onClick={scrollNext}
            className="absolute -bottom-1 right-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            aria-label={scrollHint}
          >
            <span className="glass-strong inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-wider text-[var(--color-text-secondary)] transition-transform active:scale-95">
              {scrollHint} <ArrowRight size={12} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
