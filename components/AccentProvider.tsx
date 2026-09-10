"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { site } from "@/content/site";

type Ctx = {
  accent: string;
  setAccent: (value: string) => void;
  accents: typeof site.accents;
};

const AccentCtx = createContext<Ctx | null>(null);
const KEY = "sr-accent";
const DEFAULT = site.accents[0].value;

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<string>(DEFAULT);

  // hydrate from storage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && site.accents.some((a) => a.value === saved)) {
        setAccentState(saved);
      }
    } catch {
      /* private mode / blocked storage — stay on default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  const setAccent = useCallback((value: string) => {
    setAccentState(value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ accent, setAccent, accents: site.accents }),
    [accent, setAccent],
  );

  return <AccentCtx.Provider value={value}>{children}</AccentCtx.Provider>;
}

export function useAccent(): Ctx {
  const ctx = useContext(AccentCtx);
  if (!ctx) throw new Error("useAccent must be used within <AccentProvider>");
  return ctx;
}
