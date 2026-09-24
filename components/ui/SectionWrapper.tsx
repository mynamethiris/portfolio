"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

// Centered section container with divider and entrance animation.
export default function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-28 section-divider scroll-mt-24 ${className}`}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
