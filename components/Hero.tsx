"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { useLang } from "@/lib/i18n";
import { GITHUB_USERNAME } from "@/lib/site";

const greetings = [
  "Hello, World!",
  "Halo, Dunia!",
  "こんにちは、世界！",
  "¡Hola, mundo!",
  "Hallo, Welt!",
  "Bonjour, le monde !",
  "Ciao, mondo!",
  "Olá, mundo!",
  "Привет, мир!",
  "مرحبًا بالعالم!",
  "你好，世界！",
  "안녕하세요, 세상!",
  "Merhaba, dünya!",
  "Hei, verden!",
  "Ahoj, světe!",
];

// Rotating multilingual greeting with a text-sized blinking cursor.
function BootGreeting() {
  const [idx, setIdx] = useState(0);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (booting) return;
    const iv = setInterval(
      () => setIdx((p) => (p + 1) % greetings.length),
      2000,
    );
    return () => clearInterval(iv);
  }, [booting]);

  return (
    <span className="inline-block max-w-full font-mono text-2xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold tracking-tight leading-[1.15]">
      <span className="sr-only">{greetings[0]}</span>
      <span aria-hidden="true" className="inline-block max-w-full">
      <AnimatePresence mode="wait">
        {booting ? (
          <motion.span
            key="boot"
            className="inline-block text-[var(--color-text-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            |
          </motion.span>
        ) : (
          <motion.span
            key={idx}
            className="inline text-[var(--color-text-primary)] break-words"
            initial={{ opacity: 0, y: 12, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(12px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {greetings[idx]}
          </motion.span>
        )}
      </AnimatePresence>
      {!booting && (
        <motion.span
          aria-hidden="true"
          className="ml-2 inline-block w-[0.09em] h-[1em] translate-y-[0.12em] bg-white/60"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
      </span>
    </span>
  );
}

// Hero terminal card showing identity, birth date, and motto.
function TerminalWindow() {
  const { t } = useLang();
  return (
    <div className="glass glass-inner-highlight rounded-xl overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-[38rem] mx-auto lg:mx-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]" aria-hidden="true">
        <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
          {GITHUB_USERNAME}@portfolio:~$
        </span>
      </div>
      <div className="p-5 md:p-6 lg:p-8 font-mono text-sm md:text-[15px] lg:text-base leading-relaxed">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="text-[var(--color-text-muted)]">$</span>{" "}
          <span className="text-[var(--color-text-secondary)]">whoami</span>
        </motion.div>
        <motion.div
          className="text-[var(--color-text-primary)] font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {t.profile.name}
        </motion.div>
        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-[var(--color-text-muted)]">$</span>{" "}
          <span className="text-[var(--color-text-secondary)]">
            cat birth.txt
          </span>
        </motion.div>
        <motion.div
          className="text-[var(--color-text-secondary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {t.profile.birth}
        </motion.div>
        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <span className="text-[var(--color-text-muted)]">$</span>{" "}
          <span className="text-[var(--color-text-secondary)]">
            echo $MOTTO
          </span>
        </motion.div>
        <motion.div
          className="text-[var(--color-text-muted)] italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.5 }}
        >
          &ldquo;{t.profile.tagline}&rdquo;
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="inline-block w-2 h-4 bg-[var(--color-text-primary)] mt-3"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  );
}

// Page hero with greeting, role, calls to action, and terminal card.
export default function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative flex min-h-[92svh] sm:min-h-0 lg:min-h-[100svh] items-start lg:items-center justify-center pb-12 pt-14 sm:pb-16 sm:pt-16 lg:pb-0 lg:pt-0">
      <h1 className="sr-only">{t.profile.name} - {t.hero.role}</h1>
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20 items-center">
          <div className="flex flex-col gap-4 max-w-full overflow-hidden">
            <motion.div
              className="inline-flex self-start items-center gap-2 glass rounded-full px-3 py-1.5 text-[10px] sm:text-xs tracking-widest uppercase text-[var(--color-text-secondary)] mb-2.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              {t.hero.badge}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.5,
              }}
            >
              <BootGreeting />
            </motion.div>

            <motion.p
              className="text-xs sm:text-sm font-mono text-[var(--color-text-muted)] tracking-wider uppercase"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.65,
              }}
            >
              {t.hero.role}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.9,
              }}
            >
              <a
                href="#proyek"
                className="glass glass-inner-highlight rounded-full px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all duration-300 hover:bg-white/10 active:scale-[0.98] w-full sm:w-auto text-center"
              >
                {t.hero.cta1}
              </a>
              <a
                href="#kontak"
                className="rounded-full px-6 py-3 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-glass-border)] transition-all duration-300 hover:border-[var(--color-glass-border-hover)] hover:text-[var(--color-text-primary)] active:scale-[0.98] w-full sm:w-auto text-center"
              >
                {t.hero.cta2}
              </a>
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center lg:justify-end w-full"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <TerminalWindow />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-[var(--color-text-muted)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
