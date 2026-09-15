"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A stylised live-camera panel for QuantumSight — a person walking (green box)
 * and a fire on the right (amber box), both "detected". Abstract on purpose: a
 * scene and bounding boxes, not a real product screenshot.
 */
export function DetectionViz({
  cam = "CAM 04 · FLOOR 2",
  compact = false,
}: {
  cam?: string;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const h = compact ? 132 : 168;
  const green = "#4ade80";
  const amber = "#ffb020";

  // five looping animations live in here — idle them when nobody's looking
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={onScreen ? undefined : "anim-paused"}
      style={{
        background: "#0d0f10",
        borderRadius: 16,
        padding: compact ? 10 : 12,
        fontFamily: "var(--font-mono), monospace",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "rgba(255,255,255,0.45)",
          fontSize: 9.5,
          letterSpacing: "0.04em",
          marginBottom: 8,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: 99,
              background: "#ff3b30",
              display: "inline-block",
              animation: reduce ? undefined : "qs-flicker 1.6s infinite",
            }}
          />
          REC · {cam}
        </span>
        <span>19:24:07</span>
      </div>

      {/* scene */}
      <div
        style={{
          position: "relative",
          height: h,
          borderRadius: 10,
          overflow: "hidden",
          background:
            "linear-gradient(180deg,#171b1e 0%,#111417 55%,#0c0e10 100%)",
        }}
      >
        {/* room depth: back wall light + floor line */}
        <div style={{ position: "absolute", left: "14%", top: "12%", width: "26%", height: "42%", background: "rgba(120,140,160,0.10)", borderRadius: 3 }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "26%", height: 1, background: "rgba(255,255,255,0.06)" }} />
        {/* scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 3px)",
            pointerEvents: "none",
          }}
        />
        {/* sweep */}
        {!reduce && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 28,
              background:
                "linear-gradient(90deg,transparent,rgba(74,222,128,0.10),transparent)",
              animation: "qs-sweep 4s linear infinite",
            }}
          />
        )}

        {/* ---- person + green box ---- */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            bottom: "24%",
            animation: reduce ? undefined : "qs-box-follow 9s ease-in-out infinite",
          }}
        >
          <Box color={green} label="PERSON" conf="0.96" w={compact ? 30 : 34} boxH={compact ? 62 : 74} />
        </div>
        <div
          style={{
            position: "absolute",
            left: "10%",
            bottom: "24%",
            width: compact ? 30 : 34,
            height: compact ? 62 : 74,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            animation: reduce ? undefined : "qs-walk 9s ease-in-out infinite",
          }}
        >
          <Person h={compact ? 54 : 66} />
        </div>

        {/* ---- fire + amber box ---- */}
        <div style={{ position: "absolute", right: "12%", bottom: "24%" }}>
          <Box color={amber} label="FIRE" conf="0.89" w={compact ? 32 : 38} boxH={compact ? 44 : 52} alert />
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 3,
              transform: "translateX(-50%)",
              transformOrigin: "bottom center",
              animation: reduce ? undefined : "qs-flicker 0.9s infinite",
            }}
          >
            <Flame h={compact ? 34 : 42} />
          </div>
        </div>
      </div>

      {/* detection chips */}
      <div style={{ display: "flex", gap: 6, marginTop: 8, fontSize: 8.5, letterSpacing: "0.03em" }}>
        <Chip dot={green}>PERSON 1</Chip>
        <Chip dot={amber}>FIRE 1</Chip>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)" }}>YOLOv8 · EDGE</span>
      </div>
    </div>
  );
}

function Box({
  color,
  label,
  conf,
  w,
  boxH,
  alert,
}: {
  color: string;
  label: string;
  conf: string;
  w: number;
  boxH: number;
  alert?: boolean;
}) {
  return (
    <div style={{ position: "relative", width: w, height: boxH }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1.5px solid ${color}`,
          borderRadius: 3,
          boxShadow: alert ? `0 0 10px ${color}66` : "none",
        }}
      />
      {/* corner ticks */}
      {[
        { top: -1, left: -1 },
        { top: -1, right: -1 },
        { bottom: -1, left: -1 },
        { bottom: -1, right: -1 },
      ].map((pos, i) => (
        <span key={i} style={{ position: "absolute", width: 5, height: 5, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, transform: `rotate(${i * 90}deg)`, ...pos }} />
      ))}
      <span
        style={{
          position: "absolute",
          top: -13,
          left: 0,
          fontSize: 7.5,
          fontWeight: 600,
          color: "#0d0f10",
          background: color,
          padding: "1px 4px",
          borderRadius: 2,
          whiteSpace: "nowrap",
          letterSpacing: "0.03em",
        }}
      >
        {label} {conf}
      </span>
    </div>
  );
}

function Person({ h }: { h: number }) {
  return (
    <svg width={h * 0.42} height={h} viewBox="0 0 42 100" aria-hidden style={{ display: "block" }}>
      <g fill="rgba(210,220,225,0.92)">
        <circle cx="21" cy="12" r="9" />
        <path d="M12 24 q9 -5 18 0 q4 2 5 20 l-5 1 q-1 -10 -4 -13 l0 22 4 28 -5 1 -5 -24 -5 24 -5 -1 4 -28 0 -22 q-3 3 -4 13 l-5 -1 q1 -18 5 -20 z" />
      </g>
    </svg>
  );
}

function Flame({ h }: { h: number }) {
  return (
    <svg width={h * 0.75} height={h} viewBox="0 0 30 40" aria-hidden style={{ display: "block" }}>
      <path d="M15 1 C 22 12, 27 17, 23 28 C 21 35, 9 36, 7 27 C 5.5 22, 9 18, 10 22 C 11 26, 15 25, 14 19 C 13 11, 13 7, 15 1 Z" fill="#ff7a1a" />
      <path d="M15 9 C 19 16, 21 20, 18 27 C 16.5 31, 10 31 9 26 C 8 22, 11 20, 12 23 C 13 25, 15 24, 15 20 C 15 16, 14 12, 15 9 Z" fill="#ffcf3d" />
    </svg>
  );
}

function Chip({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color: "rgba(255,255,255,0.6)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 99,
        padding: "2px 7px",
      }}
    >
      <span style={{ width: 4, height: 4, borderRadius: 99, background: dot }} />
      {children}
    </span>
  );
}
