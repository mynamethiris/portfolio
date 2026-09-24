"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretUp } from "@phosphor-icons/react/dist/csr/CaretUp";

const EASE = [0.16, 1, 0.3, 1] as const;

// Expandable paragraph with overflow detection (mobile toggle).
// Toggling crossfades between clamped and full text while the wrapper's
// `layout` animation smoothly grows/shrinks the height - no instant jump.
export function ExpandableText({ text, lines = 3, more, less, className = "" }: { text: string; lines?: number; more: string; less: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);
  const clamp = lines === 2 ? "line-clamp-2" : lines === 4 ? "line-clamp-4" : "line-clamp-3";

  useEffect(() => {
    const el = pRef.current;
    if (!el || open) return;
    const check = () => {
      setTruncated(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, open]);

  return (
    <div className={className}>
      <motion.div layout transition={{ duration: 0.35, ease: EASE }}>
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.p
              key="full"
              className="text-sm leading-relaxed text-[var(--color-text-secondary)]"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {text}
            </motion.p>
          ) : (
            <motion.p
              key="clamped"
              ref={pRef}
              className={`text-sm leading-relaxed text-[var(--color-text-secondary)] ${clamp} md:line-clamp-none`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {text}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      {truncated && !open && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          aria-expanded={false}
          className="md:hidden mt-1.5 min-h-[44px] inline-flex items-center gap-1 text-[11px] font-mono tracking-wider text-[var(--color-text-muted)] active:scale-95"
        >
          <CaretDown size={11} aria-hidden="true" /> {more}
        </button>
      )}
      {open && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          aria-expanded={true}
          className="md:hidden mt-1.5 min-h-[44px] inline-flex items-center gap-1 text-[11px] font-mono tracking-wider text-[var(--color-text-muted)] active:scale-95"
        >
          <CaretUp size={11} aria-hidden="true" /> {less}
        </button>
      )}
    </div>
  );
}

// Expandable generic list with a mobile toggle.
// Tappable card wrapper that expands a long achievement list.
// Extra items slide open/closed with a height + fade animation.
export function ExpandableCard<T>({
  items,
  preview = 3,
  tapToExpand,
  tapToCollapse,
  render,
}: {
  items: T[];
  preview?: number;
  tapToExpand: string;
  tapToCollapse: string;
  render: (item: T, i: number) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const expandable = items.length > preview;

  return (
    <div
      onClick={expandable ? () => setOpen((v) => !v) : undefined}
      onKeyDown={expandable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); } } : undefined}
      role={expandable ? "button" : undefined}
      tabIndex={expandable ? 0 : undefined}
      aria-expanded={expandable ? open : undefined}
      className={expandable ? "cursor-pointer select-none" : undefined}
    >
      <div className="flex flex-col gap-2.5">
        {items.slice(0, preview).map(render)}
      </div>
      <AnimatePresence initial={false}>
        {open && expandable && (
          <motion.div
            key="extra"
            className="flex flex-col gap-2.5"
            style={{ overflow: "hidden" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="pt-2.5" aria-hidden="true" />
            {items.slice(preview).map((item, k) => render(item, preview + k))}
          </motion.div>
        )}
      </AnimatePresence>
      {expandable && (
        <p className="mt-3 border-t border-white/[0.06] pt-2.5 text-center font-mono text-[11px] tracking-wider text-[var(--color-text-muted)]">
          {open ? tapToCollapse : tapToExpand}
        </p>
      )}
    </div>
  );
}
