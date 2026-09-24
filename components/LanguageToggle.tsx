"use client";
import { useLang } from "@/lib/i18n";
// ID/EN language switcher.
export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const btn = (l: "id" | "en", label: string) => (
    <button
      key={l}
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${
        lang === l ? "bg-white/15 text-white" : "text-[var(--color-text-muted)] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className={`flex items-center gap-0.5 glass rounded-full p-1 ${compact ? "" : "glass-inner-highlight"}`} role="group" aria-label="Language">
      {btn("id", "ID")}
      {btn("en", "EN")}
    </div>
  );
}
