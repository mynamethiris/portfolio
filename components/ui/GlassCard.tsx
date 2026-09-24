"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  variant?: "default" | "strong";
  noPadding?: boolean;
  disableTap?: boolean;
};

// Shared glass panel; disableTap when the card itself is not interactive.
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", variant = "default", noPadding = false, disableTap = false, children, ...props }, ref) => {
    const base = variant === "strong" ? "glass-strong" : "glass";

    return (
      <motion.div
        ref={ref}
        className={`${base} glass-inner-highlight glass-card-hover rounded-2xl ${noPadding ? "" : "p-6"} ${className}`}
        whileTap={disableTap ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
