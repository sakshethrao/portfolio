"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { site } from "@/content/site";
import { studioObjects, studioHint, type StudioObjectKey } from "@/content/studio";
import { scroll, scrollTo, subscribeScroll } from "@/lib/scroll";
import { useAccent } from "@/components/AccentProvider";
import { Magnetic } from "@/components/Magnetic";
import { StudioFallback } from "./StudioFallback";
import { MOODS, setMood, useMood } from "@/lib/timeOfDay";

// The 3D code is big, so it starts downloading the moment this file runs,
// not after the page has hydrated. The poster covers the wait.
const loadScene = () => import("./StudioScene");
if (typeof window !== "undefined") {
  void loadScene();
  for (const [href, as] of [["/studio/oak-diff.webp", "image"], ["/studio/oak-nor.webp", "image"], ["/studio/oak-rough.webp", "image"], ["/studio/room.hdr", "fetch"]]) {
    const l = document.createElement("link");
    l.rel = "preload";
    l.as = as;
    l.href = href;
    l.crossOrigin = "anonymous";
    document.head.appendChild(l);
  }
}
const StudioScene = dynamic(loadScene, { ssr: false });

const MOOD_LABEL = { morning: "MORNING", day: "DAY", golden: "GOLDEN HOUR", night: "NIGHT" } as const;

/** no WebGL (or the context died): fall back to the drawn desk */
class SceneBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The first screen and the desk are one pinned stage. Scroll progress across
 * the tall wrapper (0 → 1) fades the identity out and pulls the 3D camera
 * back from a close-up of the CCTV camera to the whole desk.
 */
export function Studio() {
  const reduce = !!useReducedMotion();
  const router = useRouter();
  const { accent } = useAccent();
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [webgl, setWebgl] = useState(true);
  // the first real frame is on screen. "under" = the camera hasn't moved yet,
  // so the poster stays put beneath the canvas instead of cross-fading with it
  const [live, setLive] = useState<false | "under" | "swap">(false);
  const mood = useMood();
  // Building the 3D scene is the one heavy job on this page. It waits until
  // the browser is idle and the visitor isn't mid-scroll, so it can never
  // stall a scroll that has already started. The poster holds the stage.
  const [build, setBuild] = useState(false);
  useEffect(() => {
    let last = performance.now();
    let t: ReturnType<typeof setTimeout>;
    const unsub = subscribeScroll(() => {
      last = performance.now();
    });
    const attempt = () => {
      if (performance.now() - last < 450) {
        t = setTimeout(attempt, 200);
        return;
      }
      const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => void };
      if (w.requestIdleCallback) w.requestIdleCallback(() => setBuild(true), { timeout: 500 });
      else setBuild(true);
    };
    t = setTimeout(attempt, 250);
    return () => {
      unsub();
      clearTimeout(t);
    };
  }, []);
  const [active, setActive] = useState(true);
  const [hover, setHover] = useState<StudioObjectKey | null>(null);
  const mv = useMotionValue(0); // progress as a motion value, for the DOM layers
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // progress from the scroll store — no React re-renders per frame
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let top = 0;
    let span = 1;
    const measure = () => {
      top = el.offsetTop;
      span = Math.max(1, el.offsetHeight - window.innerHeight);
    };
    const update = () => {
      const p = Math.min(1, Math.max(0, (scroll.y - top) / span));
      progress.current = p;
      mv.set(p);
    };
    measure();
    update();
    const unsub = subscribeScroll(update);
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(el);
    return () => {
      unsub();
      ro.disconnect();
    };
  }, [mv]);

  // pause the render loop when the stage is off-screen
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const identityOpacity = useTransform(mv, [0, 0.3], [1, 0]);
  const identityY = useTransform(mv, [0, 0.3], [0, -60]);
  const hintOpacity = useTransform(mv, [0, 0.15], [1, 0]);
  const deskLabelOpacity = useTransform(mv, [0.55, 0.75], [0, 1]);

  const onSelect = (key: StudioObjectKey) => {
    const o = studioObjects.find((x) => x.key === key);
    if (!o) return;
    if (o.href.startsWith("/#")) {
      const target = document.querySelector<HTMLElement>(o.href.slice(1));
      if (target) return scrollTo(target);
    }
    router.push(o.href);
  };

  const pinned = !reduce && webgl;

  return (
    <section
      id="studio"
      data-section="studio"
      data-nav={mood === "night" ? "light" : undefined}
      ref={wrap}
      style={{ position: "relative", height: pinned ? "260vh" : "auto" }}
      onPointerMove={(e) => hover === "cctv" && setMouse({ x: e.clientX, y: e.clientY })}
    >
      <div
        ref={stage}
        style={{
          position: pinned ? "sticky" : "relative",
          top: 0,
          height: pinned ? "100vh" : "auto",
          minHeight: pinned ? undefined : "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 3D desk (or the drawn fallback) */}
        {webgl && (
          <>
            {/* the same frame as a picture, so the desk is there on first paint */}
            <div className="studio-poster-wrap" data-live={live || undefined} aria-hidden>
              <div className="studio-poster" />
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: live ? 1 : 0, transition: "opacity 0.6s var(--ease)" }}>
              <SceneBoundary onFail={() => setWebgl(false)}>
                {build && <StudioScene progress={progress} accent={accent} reduce={reduce} active={active} onSelect={onSelect} onHover={setHover} onReady={() => setLive(progress.current < 0.3 ? "under" : "swap")} />}
              </SceneBoundary>
            </div>
          </>
        )}

        {/* identity */}
        <motion.div
          className="wrap"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            paddingTop: "clamp(56px, 9vh, 120px)",
            pointerEvents: "none",
            opacity: pinned ? identityOpacity : 1,
            y: pinned ? identityY : 0,
          }}
        >
          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, letterSpacing: "0.06em", color: "var(--muted-2)", marginBottom: 22 }}>
            <span className="blink" style={{ width: 6, height: 6, borderRadius: 99, background: "var(--accent)", display: "inline-block" }} />
            {site.nowBuilding}
          </div>

          <h1 className="display" style={{ fontWeight: 500, fontSize: "clamp(58px, 11.5vw, 176px)", margin: 0, lineHeight: 0.92, letterSpacing: "-0.035em", maxWidth: "9ch" }}>
            {site.name.split(" ").map((w, i) => (
              <span key={w} style={{ display: "block", paddingLeft: i === 1 ? "0.55em" : 0 }}>{w}</span>
            ))}
          </h1>

          <p className="display" style={{ fontWeight: 400, fontSize: "clamp(22px, 2.6vw, 38px)", margin: "26px 0 0", maxWidth: 620, lineHeight: 1.12 }}>
            I like building <span className="serif-i" style={{ fontSize: "1.12em" }}>things</span>.
          </p>
          <p style={{ fontSize: "clamp(15px, 1.25vw, 18px)", lineHeight: 1.5, color: "var(--muted)", margin: "14px 0 0", maxWidth: 460 }}>
            {site.intro}
          </p>


          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28, alignItems: "center", pointerEvents: "auto" }}>
            <Magnetic>
              <a href="#builds" className="pill-solid">See what I've built ↓</a>
            </Magnetic>
            <Link href="/resume" className="pill-outline">My Resume</Link>
          </div>
        </motion.div>

        {/* hint + desk label */}
        {pinned && (
          <>
            <motion.div className="mono wrap studio-hint" style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "space-between", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--faint)", pointerEvents: "none", opacity: hintOpacity }}>
              <span>{studioHint}</span>
            </motion.div>
            <motion.div className="mono wrap studio-hint" style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "space-between", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--faint)", pointerEvents: "none", opacity: deskLabelOpacity }}>
              <span>HOVER ANYTHING ON IT</span>
            </motion.div>
            {/* the desk is lit by the visitor's clock; this lets them change it */}
            <button
              type="button"
              className="mono studio-light"
              onClick={() => setMood(MOODS[(MOODS.indexOf(mood) + 1) % MOODS.length])}
              title="The desk is lit by your local time. Click to change it."
            >
              LIGHT · {MOOD_LABEL[mood]} ↻
            </button>
          </>
        )}

        {/* the camera "sees" you */}
        {hover === "cctv" && webgl && (
          <div
            aria-hidden
            className="mono"
            style={{
              position: "fixed",
              left: mouse.x - 46,
              top: mouse.y - 60,
              width: 92,
              height: 120,
              border: `1.5px solid ${accent}`,
              pointerEvents: "none",
              zIndex: 40,
              animation: "studio-label-in .18s ease both",
            }}
          >
            <span style={{ position: "absolute", top: -16, left: -1.5, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", background: accent, color: "#fff", padding: "1px 5px" }}>
              PERSON 0.97
            </span>
          </div>
        )}
      </div>

      {/* the drawn desk when there's no WebGL */}
      {!webgl && (
        <div className="wrap" style={{ paddingTop: 24, paddingBottom: 64 }}>
          <StudioFallback />
        </div>
      )}

      {/* the desk's destinations, for screen readers and keyboards */}
      <ul style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", margin: -1, padding: 0, listStyle: "none" }}>
        {studioObjects.map((o) => (
          <li key={o.key}>
            <Link href={o.href}>{o.label} — {o.line}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
