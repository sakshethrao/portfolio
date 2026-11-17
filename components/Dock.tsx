"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { scroll, subscribeScroll } from "@/lib/scroll";
import { useActiveSection } from "@/lib/useActiveSection";

const ITEMS: { label: string; short?: string; href: string; key: string; wide?: boolean }[] = [
  { label: "Builds", href: "/#builds", key: "builds" },
  { label: "Experience", short: "Work", href: "/#experience", key: "experience" },
  { label: "Travel", href: "/gallery", key: "travel" },
  { label: "Resume", href: "/resume", key: "resume", wide: true },
];

const RING = 2 * Math.PI * 15;

/**
 * The site's only navigation: a small bar that floats at the bottom of every
 * page. Home on the left, wrapped in a ring that fills as you read (with the
 * share still to go beside it), the sections in the middle, and the one thing
 * I'd like a visitor to do on the right.
 */
export function Dock() {
  const pathname = usePathname();
  const section = useActiveSection("section", 0.5, [pathname]);
  const ring = useRef<SVGCircleElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let max = 1;
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const update = () => {
      const p = Math.min(1, Math.max(0, scroll.y / max));
      if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - p));
      if (line.current) line.current.style.transform = `scaleX(${p})`;
      if (left.current) {
        const pct = Math.round((1 - p) * 100);
        left.current.textContent = pct <= 0 ? "DONE" : `${pct}% LEFT`;
      }
    };
    const both = () => {
      measure();
      update();
    };
    both();
    const unsub = subscribeScroll(update);
    const ro = new ResizeObserver(both);
    ro.observe(document.body);
    window.addEventListener("resize", both);
    return () => {
      unsub();
      ro.disconnect();
      window.removeEventListener("resize", both);
    };
  }, [pathname]);

  const home = pathname === "/";
  const current = home
    ? section
    : pathname.startsWith("/gallery")
      ? "travel"
      : pathname.startsWith("/resume")
        ? "resume"
        : pathname.startsWith("/work") || pathname.startsWith("/quantumsight")
          ? "builds"
          : null;

  return (
    <>
      {/* how far through the page you are, along the very top edge */}
      <div className="scroll-line" aria-hidden>
        <div ref={line} />
      </div>

      <nav className="dock mono" aria-label="Primary">
        <Link href="/" className="dock-home" aria-label="Saksheth Rao, back to the top">
          <svg viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="15" className="dock-ring-bg" />
            <circle ref={ring} cx="18" cy="18" r="15" className="dock-ring" style={{ strokeDasharray: RING, strokeDashoffset: RING }} />
          </svg>
          <span>SR</span>
        </Link>
        <span ref={left} className="dock-left" aria-hidden>
          100% LEFT
        </span>

        <span className="dock-links">
          {ITEMS.map((it) => (
            <Link key={it.key} href={it.href} className={`dock-link${it.wide ? " dock-wide" : ""}`} data-active={current === it.key || undefined} aria-current={current === it.key ? "page" : undefined}>
              {it.short ? (
                <>
                  <span className="dock-long">{it.label}</span>
                  <span className="dock-short">{it.short}</span>
                </>
              ) : (
                it.label
              )}
            </Link>
          ))}
        </span>

        <Link href="/#contact" className="dock-cta" data-active={current === "contact" || undefined}>
          Contact me
        </Link>
      </nav>
    </>
  );
}
