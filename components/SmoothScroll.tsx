"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { registerScrollTo, scroll, setScroll } from "@/lib/scroll";

/**
 * Physically-believable scrolling (Lenis). Native scroll is still the source
 * of truth — Lenis only eases the wheel/touch input — so framer's `useScroll`,
 * anchors, and sticky positioning all keep working. Disabled for
 * prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    scroll.vh = window.innerHeight;
    const onResize = () => (scroll.vh = window.innerHeight);
    window.addEventListener("resize", onResize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const onScroll = () => setScroll(window.scrollY);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      registerScrollTo(null);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // let inner scrollers (the phone / browser demos) scroll themselves
      prevent: (node) => node.hasAttribute("data-lenis-prevent") || !!node.closest("[data-lenis-prevent]"),
    });
    lenis.on("scroll", (e: { scroll: number }) => setScroll(e.scroll));
    setScroll(window.scrollY);

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    registerScrollTo((t, opts) =>
      lenis.scrollTo(t as never, { offset: opts?.offset ?? 0, immediate: opts?.immediate, duration: 1.1 }),
    );

    // in-page anchors → eased scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#'], a[href^='/#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!.replace(/^\//, "");
      if (hash.length < 2) return;
      // only intercept when the target is on this page
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.1 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      registerScrollTo(null);
      lenis.destroy();
    };
  }, []);

  // new route → start at the top (unless there's a hash)
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
