"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { useActiveSection } from "@/lib/useActiveSection";
import { IndexOverlay } from "./IndexOverlay";

/**
 * Minimal chrome. No bar: a wordmark, the current section (ticks as you
 * scroll), and an Index button. It inverts to white over dark sections —
 * by swapping a colour, not by blending, which would re-composite the whole
 * strip against the page on every scroll frame.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // which [data-section] is crossing the middle of the viewport
  const section = useActiveSection("section", 0.5, [pathname]);
  // ...and whether a dark band sits under the bar itself
  const onDark = useActiveSection("nav", 30, [pathname]) === "light" && !open;
  const fg = onDark ? "#ffffff" : "var(--ink)";
  const rule = onDark ? "rgba(255,255,255,0.55)" : "var(--line-strong)";

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const idx = site.nav.findIndex((n) => n.section === section);
  const showLabel = idx > 0 && !open; // hidden in the Studio (first) section

  return (
    <>
      <header
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 120,
          pointerEvents: "none",
          color: fg,
          transition: "color 0.25s var(--ease)",
        }}
      >
        <nav
          aria-label="Primary"
          className="wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="display"
            style={{ pointerEvents: "auto", fontWeight: 500, fontSize: 15, letterSpacing: "-0.01em", justifySelf: "start" }}
          >
            {site.name}
          </Link>

          <div className="mono nav-section" style={{ fontSize: 11, letterSpacing: "0.06em", height: 14, overflow: "hidden", minWidth: 120, textAlign: "center" }}>
            <AnimatePresence mode="wait" initial={false}>
              {showLabel && (
                <motion.span
                  key={section}
                  initial={reduce ? false : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: -14, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "block" }}
                >
                  {String(idx + 1).padStart(2, "0")} — {site.nav[idx].label.toUpperCase()}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div style={{ justifySelf: "end", display: "flex", gap: 22, alignItems: "center", pointerEvents: "auto" }}>
            <a href={`mailto:${site.email}`} className="mono nav-email link-underline" style={{ fontSize: 11.5, letterSpacing: "0.04em", backgroundImage: `linear-gradient(${fg},${fg})` }}>
              EMAIL
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-index"
              className="mono"
              style={{
                background: "transparent",
                border: `1px solid ${rule}`,
                borderRadius: 99,
                padding: "7px 14px",
                fontSize: 11.5,
                letterSpacing: "0.06em",
                cursor: "pointer",
                color: "inherit",
                transition: "border-color 0.25s var(--ease)",
              }}
            >
              {open ? "CLOSE" : "INDEX"}
            </button>
          </div>
        </nav>
      </header>

      <IndexOverlay open={open} onClose={() => setOpen(false)} />

      <style>{`
        @media (max-width: 720px) {
          .nav-section, .nav-email { display: none !important; }
        }
      `}</style>
    </>
  );
}
