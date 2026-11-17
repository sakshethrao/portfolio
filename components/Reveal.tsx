"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Restrained scroll-in. One gesture, used everywhere, so the whole site moves
 * with the same rhythm: fade up 14px over 0.62s, once, when the reader has
 * actually reached it (a little inside the viewport, not at the first pixel).
 * Give siblings a rising `delay` (about 0.07s apart) to lead the eye down a stack.
 *
 * It is a CSS transition switched on by one shared observer, so a page full of
 * these costs nothing while scrolling.
 */
let io: IntersectionObserver | null = null;
function observer() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.in = "";
        io!.unobserve(e.target);
      }
    },
    // the top margin is deliberately enormous: anything above the trigger line
    // counts as reached, so jumping past a block (an anchor link, the End key)
    // can never leave it hidden
    { rootMargin: "100000px 0px -12% 0px" },
  );
  return io;
}

export function Reveal({
  children,
  delay = 0,
  y = 14,
  as = "div",
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.in = "";
      return;
    }
    const o = observer();
    o.observe(el);
    return () => o.unobserve(el);
  }, []);

  return createElement(
    as,
    {
      ref,
      className: className ? `reveal ${className}` : "reveal",
      style: { ...style, "--reveal-d": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties,
    },
    children,
  );
}
