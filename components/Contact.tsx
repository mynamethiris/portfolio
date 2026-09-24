"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { contacts } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import SectionWrapper from "./ui/SectionWrapper";
import { GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { YoutubeLogo } from "@phosphor-icons/react/dist/csr/YoutubeLogo";
import { TelegramLogo } from "@phosphor-icons/react/dist/csr/TelegramLogo";

const iconMap: Record<string, ReactNode> = {
  GitHub: <GithubLogo size={20} />,
  YouTube: <YoutubeLogo size={20} />,
  Telegram: <TelegramLogo size={20} />,
};

// Contact section: social links with icons and handles.
export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();

  return (
    <SectionWrapper id="kontak">
      <div ref={ref} className="flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              {t.contact.num}
            </span>
            <span className="w-12 h-px bg-white/10" />
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.contact.title}
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-md leading-relaxed text-balance"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {t.contact.desc}
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {contacts.map((contact) => (
            <a
              key={contact.platform}
              href={contact.url}
              className="group glass glass-inner-highlight rounded-2xl sm:rounded-full px-6 sm:px-8 py-4 flex items-center justify-center sm:justify-start gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.98]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="transition-transform duration-300 group-hover:scale-110 shrink-0" aria-hidden="true">
                {iconMap[contact.platform] || <GithubLogo size={20} />}
              </span>
              <span className="font-medium text-sm sm:text-base">{contact.platform}</span>
              <span className="text-xs font-mono text-[var(--color-text-muted)] hidden md:inline">
                {contact.username}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
