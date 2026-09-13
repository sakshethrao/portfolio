"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { Photo } from "@/lib/types";

/**
 * The journal as a film strip. On desktop the section pins and vertical
 * scroll carries the strip sideways; photos sit at different heights and
 * sizes, with captions on a slower layer. Click opens the photo full-screen,
 * expanding from where it sits. On narrow screens: a full-bleed stack.
 * Data-driven from content/gallery.ts — placeholders render until real
 * files land.
 */
export function FilmStrip({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  // null until measured: never mount the strip and then swap to the stack
  // (they share layoutIds, so a swap would animate every cell across)
  const [wide, setWide] = useState<boolean | null>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      {wide === null ? (
        <div style={{ minHeight: "60vh" }} aria-hidden />
      ) : wide && !reduce ? (
        <Strip photos={photos} onOpen={setOpen} />
      ) : (
        <Stack photos={photos} onOpen={setOpen} />
      )}

      <AnimatePresence>
        {open !== null && photos[open]?.src && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={photos[open].place}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(255,255,255,0.96)", display: "grid", placeItems: "center", padding: "clamp(16px, 5vw, 64px)" }}
          >
            <motion.div layoutId={`photo-${open}`} onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: 1200, width: "100%" }}>
              <Image
                src={photos[open].src}
                alt={photos[open].place}
                width={photos[open].width ?? 1600}
                height={photos[open].height ?? 1000}
                sizes="92vw"
                style={{ width: "100%", height: "auto", maxHeight: "82vh", objectFit: "contain" }}
                priority
              />
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, letterSpacing: "0.05em", color: "var(--muted)" }}>
                <span>{[photos[open].location, photos[open].date].filter(Boolean).join(" · ") || photos[open].place}</span>
                <span>{String(open + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
              </div>
            </motion.div>
            <button onClick={close} aria-label="Close" className="mono" style={btn("top-right")}>CLOSE ✕</button>
            {photos.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="mono" style={btn("left")}>←</button>
                <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="mono" style={btn("right")}>→</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function sizeOf(p: Photo, base: number) {
  const h = p.span === 2 ? base * 1.35 : base;
  const w = Math.round((h * (p.width ?? 4)) / (p.height ?? 3));
  return { w, h: Math.round(h) };
}

function Cell({ p, i, onOpen, base, offset }: { p: Photo; i: number; onOpen: (i: number) => void; base: number; offset?: number }) {
  const { w, h } = sizeOf(p, base);
  const empty = !p.src;
  return (
    <figure className="strip-cell" style={{ margin: 0, flex: "none", width: w, marginTop: offset ?? 0 }}>
      <motion.button
        layoutId={`photo-${i}`}
        onClick={() => !empty && onOpen(i)}
        aria-label={empty ? "Photo coming soon" : `View ${p.place}`}
        style={{ display: "block", width: w, height: h, border: 0, padding: 0, margin: 0, cursor: empty ? "default" : "zoom-in", background: "var(--paper-3)", position: "relative", overflow: "hidden" }}
      >
        {empty ? (
          <span className="mono" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 10, letterSpacing: "0.12em", color: "var(--faint)" }}>PHOTO</span>
        ) : (
          <Image src={p.src} alt={p.place} fill sizes={`${w}px`} style={{ objectFit: "cover" }} className="gallery-img" />
        )}
      </motion.button>
      <figcaption className="mono" style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 10, letterSpacing: "0.05em", display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span>{[p.location, p.date].filter(Boolean).join(" · ") || "—"}</span>
        <span>{String(i + 1).padStart(2, "0")}</span>
      </figcaption>
    </figure>
  );
}

/* desktop: pinned, scroll → sideways */
function Strip({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const base = 360;

  useLayoutEffect(() => {
    const measure = () => {
      if (!strip.current) return;
      setTravel(Math.max(0, strip.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (strip.current) ro.observe(strip.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [photos.length]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });
  const x = useTransform(p, [0, 1], [0, -travel]);
  const xSlow = useTransform(p, [0, 1], [0, -travel * 0.9]);
  const counter = useTransform(p, (v) => `${String(Math.min(photos.length, Math.max(1, Math.round(v * (photos.length - 1)) + 1))).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`);

  const offsets = [0, 90, 30, 120, 0, 60];

  return (
    <div ref={wrap} style={{ position: "relative", height: `calc(100vh + ${travel}px)` }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <motion.div ref={strip} style={{ x, display: "flex", gap: "clamp(28px, 3vw, 56px)", paddingLeft: "var(--pad)", paddingRight: "var(--pad)", alignItems: "flex-start", width: "max-content" }}>
          {photos.map((p, i) => (
            <Cell key={i} p={p} i={i} onOpen={onOpen} base={base} offset={offsets[i % offsets.length]} />
          ))}
        </motion.div>
        <motion.div className="mono" style={{ position: "absolute", top: 90, left: "var(--pad)", x: xSlow, fontSize: 10.5, letterSpacing: "0.1em", color: "var(--faint)", pointerEvents: "none" }}>
          SCROLL — THE STRIP MOVES SIDEWAYS
        </motion.div>
        <motion.div className="mono" style={{ position: "absolute", top: 90, right: "var(--pad)", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>
          {counter}
        </motion.div>
      </div>
    </div>
  );
}

/* narrow / reduced motion: a stack */
function Stack({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  return (
    <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 40, paddingBottom: 80 }}>
      {photos.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: i % 2 ? "flex-end" : "flex-start" }}>
          <div style={{ width: p.span === 2 ? "100%" : "84%", maxWidth: 900 }}>
            <StackCell p={p} i={i} onOpen={onOpen} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StackCell({ p, i, onOpen }: { p: Photo; i: number; onOpen: (i: number) => void }) {
  const empty = !p.src;
  return (
    <figure className="strip-cell" style={{ margin: 0 }}>
      <motion.button
        layoutId={`photo-${i}`}
        onClick={() => !empty && onOpen(i)}
        aria-label={empty ? "Photo coming soon" : `View ${p.place}`}
        style={{ display: "block", width: "100%", aspectRatio: `${p.width ?? 4} / ${p.height ?? 3}`, border: 0, padding: 0, margin: 0, cursor: empty ? "default" : "zoom-in", background: "var(--paper-3)", position: "relative", overflow: "hidden" }}
      >
        {empty ? (
          <span className="mono" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 10, letterSpacing: "0.12em", color: "var(--faint)" }}>PHOTO</span>
        ) : (
          <Image src={p.src} alt={p.place} fill sizes="100vw" style={{ objectFit: "cover" }} className="gallery-img" />
        )}
      </motion.button>
      <figcaption className="mono" style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 10, letterSpacing: "0.05em", display: "flex", justifyContent: "space-between" }}>
        <span>{[p.location, p.date].filter(Boolean).join(" · ") || "—"}</span>
        <span>{String(i + 1).padStart(2, "0")}</span>
      </figcaption>
    </figure>
  );
}

function btn(pos: "top-right" | "left" | "right"): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "fixed",
    background: "var(--paper)",
    border: "1px solid var(--line-strong)",
    padding: "9px 14px",
    fontSize: 11,
    letterSpacing: "0.06em",
    cursor: "pointer",
    color: "var(--ink)",
    zIndex: 1,
  };
  if (pos === "top-right") return { ...base, top: 20, right: 20 };
  if (pos === "left") return { ...base, left: 20, top: "50%", transform: "translateY(-50%)" };
  return { ...base, right: 20, top: "50%", transform: "translateY(-50%)" };
}
