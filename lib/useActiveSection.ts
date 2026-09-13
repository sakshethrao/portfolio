"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "./scroll";

/**
 * Which `[data-<attr>]` element currently crosses the viewport's middle band.
 * Driven by the scroll store (not IntersectionObserver) so it's deterministic
 * with smooth scrolling and in backgrounded tabs.
 */
export function useActiveSection(attr: string, deps: unknown[] = []): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let els: HTMLElement[] = [];
    let last = 0;
    let trailing: ReturnType<typeof setTimeout> | null = null;
    const collect = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>(`[data-${attr}]`));
    };
    const check = () => {
      const mid = window.innerHeight / 2;
      let found: string | null = null;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          found = el.getAttribute(`data-${attr}`);
          break;
        }
      }
      setActive((a) => (a === found ? a : found));
    };
    // ~20Hz while scrolling + one trailing check. Plain timers, not rAF, so it
    // keeps working in background tabs and under smooth-scroll libraries.
    const schedule = () => {
      const now = performance.now();
      if (now - last > 50) {
        last = now;
        check();
      }
      if (trailing) clearTimeout(trailing);
      trailing = setTimeout(check, 80);
    };
    collect();
    check();
    const unsub = subscribeScroll(schedule);
    window.addEventListener("resize", schedule);
    // content can mount after us (dynamic imports); re-collect shortly after
    const t = setTimeout(() => {
      collect();
      check();
    }, 600);
    return () => {
      unsub();
      window.removeEventListener("resize", schedule);
      clearTimeout(t);
      if (trailing) clearTimeout(trailing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return active;
}

/** true while any `[data-<attr>]` element overlaps the viewport (with a margin) */
export function useSectionVisible(id: string, margin = 0.2): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let last = 0;
    let trailing: ReturnType<typeof setTimeout> | null = null;
    const check = () => {
      const el = document.getElementById(id);
      if (!el) return setVisible(false);
      const r = el.getBoundingClientRect();
      const m = window.innerHeight * margin;
      setVisible(r.top < window.innerHeight - m && r.bottom > m);
    };
    const schedule = () => {
      const now = performance.now();
      if (now - last > 50) {
        last = now;
        check();
      }
      if (trailing) clearTimeout(trailing);
      trailing = setTimeout(check, 80);
    };
    check();
    const unsub = subscribeScroll(schedule);
    window.addEventListener("resize", schedule);
    return () => {
      unsub();
      window.removeEventListener("resize", schedule);
      if (trailing) clearTimeout(trailing);
    };
  }, [id, margin]);
  return visible;
}
