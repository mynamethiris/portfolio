"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Honor the OS prefers-reduced-motion setting for every motion/react
// animation on the page (transform/layout are skipped, opacity may remain).
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
