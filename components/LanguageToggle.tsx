"use client";
import { useLang } from "@/lib/i18n";

// ID/EN switcher: compact pills on mobile, hit area stretched to 44px by ::after.
export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const btn = (l: "id" | "en", label: string) => (
    <button
      key={l}
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`relative rounded-full font-mono tracking-wider transition-all duration-300 after:absolute after:content-[''] ${
        compact
          ? "h-7 min-w-[30px] px-1.5 text-[10px] after:-inset-2"
          : "h-9 min-w-[38px] px-2 text-[11px] after:-inset-x-1 after:-inset-y-1"
      } ${
        lang === l
          ? "bg-white/15 text-white"
          : "text-[var(--color-text-muted)] hover:text-white"
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
