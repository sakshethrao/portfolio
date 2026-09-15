"use client";

import { useEffect, useState } from "react";
import { scroll, subscribeScroll } from "./scroll";

type Band = { top: number; bottom: number; value: string };

/**
 * Which `[data-<attr>]` element covers a probe line in the viewport.
 *
 * Positions are measured once (and again on resize / when the document
 * changes height), then compared numerically against the scroll store — so
 * scrolling costs arithmetic, not a forced layout per tick.
 *
 * `probe` is a fraction of viewport height (0.5 = the middle) or, when > 1,
 * a distance in px from the top of the viewport.
 */
export function useActiveSection(attr: string, probe = 0.5, deps: unknown[] = []): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let bands: Band[] = [];
    let last = 0;
    let trailing: ReturnType<typeof setTimeout> | null = null;

    const measure = () => {
      const y = window.scrollY;
      bands = Array.from(document.querySelectorAll<HTMLElement>(`[data-${attr}]`)).map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + y, bottom: r.bottom + y, value: el.getAttribute(`data-${attr}`) ?? "" };
      });
    };

    const check = () => {
      const line = scroll.y + (probe > 1 ? probe : window.innerHeight * probe);
      let found: string | null = null;
      for (const b of bands) {
        if (b.top <= line && b.bottom > line) {
          found = b.value;
          break;
        }
      }
      setActive((a) => (a === found ? a : found));
    };

    // ~20Hz while scrolling plus a trailing settle. Plain timers, not rAF, so
    // this keeps working in backgrounded tabs and under smooth-scroll libraries.
    const schedule = () => {
      const now = performance.now();
      if (now - last > 50) {
        last = now;
        check();
      }
      if (trailing) clearTimeout(trailing);
      trailing = setTimeout(check, 80);
    };

    const remeasure = () => {
      measure();
      check();
    };

    measure();
    check();
    const unsub = subscribeScroll(schedule);
    window.addEventListener("resize", remeasure);
    // content can mount or reflow after us (fonts, dynamic imports, images)
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    const t = setTimeout(remeasure, 600);

    return () => {
      unsub();
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
      clearTimeout(t);
      if (trailing) clearTimeout(trailing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return active;
}
