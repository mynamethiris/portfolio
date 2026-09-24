"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  variant?: "default" | "strong";
  noPadding?: boolean;
  hoverLift?: boolean;
  disableTap?: boolean;
};

// Reusable glassmorphism card with optional hover lift.
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", variant = "default", noPadding = false, hoverLift = false, disableTap = false, children, ...props }, ref) => {
    const base = variant === "strong" ? "glass-strong" : "glass";

    return (
      <motion.div
        ref={ref}
        className={`${base} glass-inner-highlight glass-card-hover rounded-2xl ${noPadding ? "" : "p-6"} ${className}`}
        whileHover={hoverLift ? { y: -4, scale: 1.015, borderColor: "rgba(255, 255, 255, 0.15)" } : undefined}
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
