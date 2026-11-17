"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Project } from "@/lib/types";
import { Showcase } from "./Showcase";

/**
 * Wide screens get the pinned showcase. Phones, short windows and anyone who
 * asked for less motion get the same builds as a plain stacked column, which
 * is also what the server sends, so the page reads fine before any script runs.
 * Pinning a tall interactive app inside a small screen would mean shrinking it
 * until it can't be used.
 */
export function BuildsSwitch({ projects, stacked }: { projects: Project[]; stacked: ReactNode }) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)");
    const on = () => setPinned(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return pinned ? <Showcase projects={projects} /> : <>{stacked}</>;
}
