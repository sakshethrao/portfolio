"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { photos } from "@/content/gallery";

/**
 * The Index: a full-screen table of contents. Big numbered destinations on
 * the left, a still of where you'd land on the right (desktop). Data-driven
 * from site.nav — add a route there and it appears here.
 */
export function IndexOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-index"
          role="dialog"
          aria-modal="true"
          aria-label="Site index"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "var(--paper)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            alignItems: "stretch",
            overflow: "hidden",
          }}
          className="index-overlay"
        >
          <div
            className="wrap"
            style={{
              paddingTop: "clamp(84px, 14vh, 140px)",
              paddingBottom: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 32,
              width: "100%",
              maxWidth: "none",
            }}
          >
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {site.nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={reduce ? false : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease, delay: 0.06 + i * 0.045 }}
                  style={{ borderTop: "1px solid var(--line)" }}
                >
                  <Link
                    href={n.href}
                    onClick={onClose}
                    onMouseEnter={() => setHover(n.section)}
                    onFocus={() => setHover(n.section)}
                    className="display index-link"
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "clamp(14px, 2vw, 28px)",
                      padding: "clamp(8px, 1.4vh, 16px) 0",
                      fontSize: "clamp(34px, 6.4vw, 92px)",
                      fontWeight: 500,
                      color: hover && hover !== n.section ? "var(--faint)" : "var(--ink)",
                      transition: "color 0.25s var(--ease)",
                    }}
                  >
                    <span className="mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted-2)", minWidth: 24 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {n.label}
                  </Link>
                </motion.li>
              ))}
            </ol>

            <div className="mono" style={{ display: "flex", gap: 22, flexWrap: "wrap", fontSize: 11.5, letterSpacing: "0.04em", color: "var(--muted)" }}>
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="link-underline">LINKEDIN ↗</a>
              <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="link-underline">INSTAGRAM ↗</a>
              <a href={site.socials.github} target="_blank" rel="noreferrer" className="link-underline">GITHUB ↗</a>
              <a href={`mailto:${site.email}`} className="link-underline">{site.email.toUpperCase()}</a>
            </div>
          </div>

          <div className="index-preview" style={{ position: "relative", borderLeft: "1px solid var(--line)", background: "var(--paper-3)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={hover ?? "none"}
                initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "12vh 8vw" }}
              >
                <Preview section={hover} />
              </motion.div>
            </AnimatePresence>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .index-overlay { grid-template-columns: 1fr !important; overflow-y: auto !important; }
              .index-preview { display: none !important; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* stills — flat, drawn, no screenshots except QuantumSight's real feed */
function Preview({ section }: { section: string | null }) {
  const ink = "var(--ink)";
  const stroke = { fill: "none", stroke: ink, strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

  switch (section) {
    case "studio":
      return (
        <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 420 }} aria-hidden>
          <path d="M20 150 L300 150 L260 190 L60 190 Z" {...stroke} />
          <rect x="120" y="96" width="70" height="46" rx="3" {...stroke} />
          <path d="M115 142 L195 142 L200 150 L110 150 Z" {...stroke} />
          <rect x="216" y="112" width="22" height="38" rx="4" {...stroke} />
          <path d="M60 128 l26 -12 v18 l-26 12 z" {...stroke} />
          <circle cx="248" cy="60" r="12" {...stroke} />
          <path d="M236 60 h-22 M226 60 v22" {...stroke} />
          <circle cx="248" cy="60" r="4" fill={ink} />
        </svg>
      );
    case "builds":
      return (
        <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 420 }} aria-hidden>
          <rect x="30" y="30" width="180" height="120" rx="6" {...stroke} />
          <circle cx="42" cy="42" r="2.5" fill={ink} />
          <circle cx="51" cy="42" r="2.5" fill={ink} />
          <circle cx="60" cy="42" r="2.5" fill={ink} />
          <path d="M30 52 H210" {...stroke} />
          <rect x="232" y="50" width="58" height="120" rx="10" {...stroke} />
          <rect x="250" y="56" width="22" height="4" rx="2" fill={ink} />
        </svg>
      );
    case "quantumsight":
      return (
        <div style={{ width: "100%", maxWidth: 520, borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)", background: "#0d0f10" }}>
          <Image src="/quantumsight/feed-crop.jpg" alt="" width={1202} height={535} sizes="40vw" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      );
    case "experience":
      return (
        <div className="mono" style={{ width: "100%", maxWidth: 380, fontSize: 12, color: "var(--muted)" }}>
          {["2025 — QuantumSight", "2022 — KPMG", "2020 — Nicho"].map((l) => (
            <div key={l} style={{ borderTop: "1px solid var(--line-strong)", padding: "14px 0" }}>{l}</div>
          ))}
        </div>
      );
    case "travel": {
      const p = photos.find((x) => x.src);
      return p ? (
        <div style={{ width: "100%", maxWidth: 460, aspectRatio: `${p.width ?? 4} / ${p.height ?? 3}`, position: "relative", overflow: "hidden" }}>
          <Image src={p.src} alt="" fill sizes="40vw" style={{ objectFit: "cover" }} />
        </div>
      ) : (
        <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 420 }} aria-hidden>
          <rect x="40" y="30" width="240" height="140" {...stroke} />
          <path d="M40 150 l70 -60 l50 40 l40 -30 l80 60" {...stroke} />
          <circle cx="230" cy="70" r="12" {...stroke} />
        </svg>
      );
    }
    case "resume":
      return (
        <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 420 }} aria-hidden>
          <rect x="105" y="10" width="110" height="180" {...stroke} />
          <path d="M122 40 h50 M122 60 h76 M122 72 h64 M122 96 h76 M122 108 h58 M122 120 h70 M122 144 h76 M122 156 h40" {...stroke} />
        </svg>
      );
    default:
      return <span className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--faint)" }}>SAKSHETH RAO — INDEX</span>;
  }
}
