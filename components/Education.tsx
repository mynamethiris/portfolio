"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import SectionWrapper from "./ui/SectionWrapper";
import GlassCard from "./ui/GlassCard";
import { ExpandableCard } from "./ui/Expandable";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { Trophy } from "@phosphor-icons/react/dist/csr/Trophy";
import { Briefcase } from "@phosphor-icons/react/dist/csr/Briefcase";

// Education timeline plus experience and organization cards.
export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();
  const education = t.educationList;
  const experiences = t.experienceList;

  return (
    <SectionWrapper id="pendidikan">
      <div ref={ref} className="flex flex-col gap-8">
        <div>
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              {t.education.num}
            </span>
            <span className="w-12 h-px bg-white/10" />
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.education.title}
          </motion.h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-white/15 via-white/[0.06] to-transparent" />

          <div className="flex flex-col gap-5 sm:gap-8">
            {education.map((edu, i) => {
              const points = edu.achievements;
              return (
              <motion.div
                key={`${edu.school}-${edu.period}`}
                className="relative pl-10 sm:pl-12 lg:pl-16"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2 + i * 0.15,
                }}
              >
                <div className="absolute left-4 sm:left-6 top-7 -translate-x-1/2 flex items-center justify-center">
                  <span className="w-[9px] h-[9px] rounded-full border-2 border-white/25 bg-[var(--color-surface-0)] ring-4 ring-white/[0.04]" />
                </div>

                <GlassCard className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="glass rounded-xl p-2.5 shrink-0 bg-white/[0.04]" aria-hidden="true">
                          <GraduationCap size={20} className="text-[var(--color-text-primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                            0{i + 1} - {edu.period}
                          </p>
                          <h3 className="text-base sm:text-lg font-semibold leading-snug mt-1 text-balance">{edu.school}</h3>
                          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-mono tracking-wider mt-1">
                            {edu.major}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 sm:p-4">
                      <ExpandableCard
                        items={points}
                        preview={3}
                        tapToExpand={t.education.tapToExpand}
                        tapToCollapse={t.education.tapToCollapse}
                        render={(achievement, j) => (
                          <div key={`${achievement.slice(0, 24)}-${j}`} className="flex items-start gap-3 text-[13px] sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]" aria-hidden="true">
                              <Trophy size={11} className="text-[var(--color-text-secondary)]" />
                            </span>
                            <span>{achievement}</span>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2 sm:mt-4">
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.education.orgTitle}
          </motion.h3>
          {experiences.map((exp) => (
            <motion.div
              key={exp.org}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <GlassCard>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="glass rounded-xl p-2.5 shrink-0" aria-hidden="true">
                        <Briefcase size={20} className="text-[var(--color-text-secondary)]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold leading-snug">{exp.org}</h4>
                        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-mono tracking-wider mt-0.5">
                          {exp.role} · {exp.focus}
                        </p>
                      </div>
                    </div>
                    <span className="glass rounded-full px-3 py-1 text-[11px] sm:text-xs font-mono text-[var(--color-text-secondary)] tracking-wider self-start sm:shrink-0 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-2.5">
                    {exp.points.map((p, j) => (
                      <div key={`${p.slice(0, 24)}-${j}`} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        <Trophy size={14} aria-hidden="true" className="text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
