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

// Horizontal mobile carousel with edge indicator and reappearing scroll hint.
// Hidden on sm and up (grid takes over there).
export default function SideCarousel<T>({ items, keyOf, renderItem, scrollHint }: Props<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | null>(null);
  const atStartRef = useRef(true);
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
    // Only re-show the hint if the user is still at the start; otherwise
    // the hint would pop back up mid-carousel after 3 idle seconds.
    idleTimer.current = window.setTimeout(() => {
      if (atStartRef.current) setShowHint(true);
    }, 3000);
  }, [clearIdle]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 12;
    atStartRef.current = atStart;
    setShowHint(atStart);
    setCanScroll(el.scrollWidth - el.clientWidth - el.scrollLeft > 12);
    armIdle();
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setCanScroll(el.scrollWidth - el.clientWidth > 12);
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
  }, [items.length, armIdle, clearIdle]);

  if (items.length === 0) return null;

  return (
    // overflow-x-clip keeps the full-bleed carousel (-mx-5) and the edge fade
    // from widening the page on phones. `clip` (not `hidden`) is deliberate:
    // vertical overflow stays visible so the -bottom-1 scroll hint is never
    // cut off, and no new containing block traps fixed-position descendants.
    <div className="relative overflow-x-clip sm:hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1"
      >
        {items.map((item, i) => (
          <div key={keyOf(item, i)} className="w-[80vw] max-w-[300px] shrink-0 snap-start">
            {renderItem(item, i)}
          </div>
        ))}
      </div>
      {canScroll && (
        <div className="pointer-events-none absolute inset-y-0 right-[-1.25rem] w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
      )}
      <AnimatePresence>
        {showHint && canScroll && (
          <motion.div
            key="scroll-hint"
            className="pointer-events-none absolute -bottom-1 right-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="glass-strong inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-wider text-[var(--color-text-secondary)]">
              {scrollHint} <ArrowRight size={12} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
