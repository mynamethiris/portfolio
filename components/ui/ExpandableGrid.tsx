"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Grid with a "show all" toggle that mimics ExpandableCard (education):
// preview cards sit in a static grid; the rest open/close in one block with
// height 0 <-> auto + opacity, 0.35s. Following content (the toggle button)
// rides the same height animation instead of jumping.
export default function ExpandableGrid<T>({
  items,
  preview,
  open,
  className = "",
  gridClassName,
  keyOf,
  render,
}: {
  items: T[];
  preview: number;
  open: boolean;
  className?: string;
  gridClassName: string;
  keyOf: (item: T) => string | number;
  render: (item: T, index: number) => ReactNode;
}) {
  const head = items.slice(0, preview);
  const extras = items.slice(preview);
  const showExtras = open && extras.length > 0;

  return (
    <div className={className}>
      <div className={gridClassName}>
        {head.map((item, i) => (
          <div key={keyOf(item)}>{render(item, i)}</div>
        ))}
      </div>
      <AnimatePresence initial={false}>
        {showExtras && (
          <motion.div
            key="extra"
            style={{ overflow: "hidden" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className={`${gridClassName} pt-4`}>
              {extras.map((item, i) => (
                <div key={keyOf(item)}>{render(item, preview + i)}</div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
