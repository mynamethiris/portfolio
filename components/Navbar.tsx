"use client";

import { motion } from "motion/react";
import { House } from "@phosphor-icons/react/dist/csr/House";
import { User } from "@phosphor-icons/react/dist/csr/User";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { FolderOpen } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { AddressBook } from "@phosphor-icons/react/dist/csr/AddressBook";
import { Lightning } from "@phosphor-icons/react/dist/csr/Lightning";
import { Trophy } from "@phosphor-icons/react/dist/csr/Trophy";
import { GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { useLang } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";

// Top pill navigation (desktop) and bottom icon bar (mobile).
export default function Navbar() {
  const { t } = useLang();
  const navItems = [
    { label: t.nav.home, href: "#top", icon: House },
    { label: t.nav.about, href: "#tentang", icon: User },
    { label: t.nav.education, href: "#pendidikan", icon: GraduationCap },
    { label: t.nav.projects, href: "#proyek", icon: FolderOpen },
    { label: t.nav.achievements, href: "#sertifikat", icon: Trophy },
    { label: t.nav.skills, href: "#keahlian", icon: Lightning },
    { label: t.nav.activity, href: "#aktivitas", icon: GithubLogo },
    { label: t.nav.contact, href: "#kontak", icon: AddressBook },
  ];

  return (
    <>
      {/* Desktop + Tablet landscape: pill nav on top.
          The fixed wrapper owns the centering so the motion transform
          never overrides the Tailwind translate. */}
      <div className="fixed top-4 lg:top-6 left-1/2 z-50 -translate-x-1/2 hidden md:block max-w-[95vw]">
        <motion.nav
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          aria-label="Desktop navigation"
        >
          <div className="glass-strong glass-inner-highlight flex items-center gap-0.5 lg:gap-1 rounded-full px-1.5 lg:px-2 py-1.5 overflow-x-auto scrollbar-none max-w-[78vw] lg:max-w-none">
            {navItems.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 lg:px-4 py-2 text-[13px] lg:text-sm text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-text-primary)] rounded-full whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="shrink-0">
            <LanguageToggle />
          </div>
        </motion.nav>
      </div>

      {/* Mobile + small tablet portrait: bottom icon bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        aria-label="Mobile navigation"
      >
        <div className="mx-2 sm:mx-4 mb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="glass-strong glass-inner-highlight rounded-2xl sm:rounded-3xl px-1.5 sm:px-2 pt-2 pb-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-8 items-center">
              {navItems.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  aria-label={link.label}
                  className="flex flex-col items-center justify-center gap-1 min-w-0 px-0.5 py-2 min-[520px]:py-1.5 text-[var(--color-text-muted)] transition-all duration-300 hover:text-[var(--color-text-primary)] active:scale-95 rounded-xl sm:rounded-2xl"
                >
                  <span className="flex items-center justify-center w-9 h-9 min-[520px]:w-8 min-[520px]:h-7 rounded-full bg-white/[0.05]">
                    <link.icon size={16} weight="light" />
                  </span>
                  {/* Labels hidden on small screens for a compact icon bar */}
                  <span className="hidden min-[520px]:block text-[8px] sm:text-[8.5px] font-mono tracking-wide leading-none truncate w-full text-center">{link.label}</span>
                </a>
              ))}
            </div>
            <div className="flex justify-center pt-1">
              <LanguageToggle compact />
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
