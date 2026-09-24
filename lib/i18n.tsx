// Language context with localStorage persistence and html lang sync.
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { id } from "./locales/id";
import { en } from "./locales/en";

export type Lang = "id" | "en";
export type Dict = typeof id;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "id",
  setLang: () => {},
  t: id,
});

// Language context with localStorage persistence and html lang sync.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  useEffect(() => {
    try {
      const s = localStorage.getItem("lang");
      if (s === "en" || s === "id") {
        setLangState(s);
        document.documentElement.lang = s;
      }
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
    try {
      document.documentElement.lang = l;
    } catch {}
  };
  return <Ctx.Provider value={{ lang, setLang, t: lang === "id" ? id : en }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
