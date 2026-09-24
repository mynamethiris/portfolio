"use client";

import { motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import SectionWrapper from "./ui/SectionWrapper";

const levelMap: Record<string, { width: string; color: string }> = {
  Mahir: { width: "100%", color: "bg-white/60" },
  Advanced: { width: "100%", color: "bg-white/60" },
  Menengah: { width: "65%", color: "bg-white/40" },
  Intermediate: { width: "65%", color: "bg-white/40" },
  Dasar: { width: "35%", color: "bg-white/25" },
  Basic: { width: "35%", color: "bg-white/25" },
  Beginner: { width: "35%", color: "bg-white/25" },
  Pemula: { width: "35%", color: "bg-white/25" },
};

// Unknown levels fall back visibly in dev instead of silently mapping.
function levelStyle(lvl: string) {
  const style = levelMap[lvl];
  if (!style) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Skills] Unknown level "${lvl}", falling back to Intermediate.`);
    }
    return levelMap.Intermediate;
  }
  return style;
}

// Skills grid with level bars.
export default function Skills() {
  const { t } = useLang();
  const skills = t.skillList;

  return (
    <SectionWrapper id="keahlian">
      <div className="flex flex-col gap-8">
        <div>
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t.skills.num}</span>
            <span className="w-12 h-px bg-white/10" />
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.skills.title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {skills.map((skill, i) => {
            const lvl = skill.level;
            const level = levelStyle(lvl);
            const isLast = i === skills.length - 1;
            return (
              <motion.div
                key={skill.name}
                className={`glass glass-inner-highlight glass-card-hover rounded-xl px-4 py-3.5 flex flex-col gap-2.5 cursor-pointer min-w-0${isLast ? " sm:col-span-2 lg:col-span-1" : ""}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 min-h-8">{skill.name}</span>
                <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full origin-left ${level.color}`}
                    style={{ width: level.width }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wider uppercase">{lvl}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
