"use client";

import Link from "next/link";
import { studioObjects } from "@/content/studio";

/**
 * No WebGL → the same desk as a line drawing, with the same destinations as
 * plain links laid over it. Nothing is lost, it just doesn't move.
 */
export function StudioFallback() {
  const s = { fill: "none", stroke: "#121212", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };
  const spots: Record<string, [number, number]> = {
    cctv: [14, 30], aibox: [26, 44], laptop: [50, 44], phone: [70, 52], camera: [84, 66], pass: [42, 72], resume: [20, 72], ball: [62, 76], paddle: [78, 86], drone: [10, 88],
  };
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 1100, margin: "0 auto" }}>
      <svg viewBox="0 0 600 340" width="100%" aria-hidden>
        <path d="M40 260 L560 260 L520 320 L80 320 Z" {...s} />
        {/* cctv */}
        <path d="M84 250 v-90 M70 250 h28" {...s} />
        <ellipse cx="84" cy="146" rx="24" ry="12" {...s} />
        <circle cx="104" cy="146" r="4" fill="#121212" />
        {/* ai box */}
        <path d="M140 232 h70 v14 h-70 z" {...s} />
        {/* laptop */}
        <path d="M240 160 h150 v90 h-150 z M225 250 h180 l8 12 h-196 z" {...s} />
        {/* phone */}
        <path d="M410 236 h36 v52 h-36 z" {...s} />
        {/* camera */}
        <path d="M470 300 h60 v-36 h-60 z" {...s} />
        <circle cx="500" cy="282" r="10" {...s} />
        {/* boarding pass */}
        <path d="M220 290 h80 v-26 h-80 z M258 264 v26" {...s} />
        {/* resume */}
        <path d="M90 300 h50 v-52 h-50 z M100 262 h30 M100 272 h30 M100 282 h20" {...s} />
        {/* ball */}
        <circle cx="372" cy="300" r="10" {...s} />
      </svg>
      {studioObjects.map((o) => {
        const [x, y] = spots[o.key];
        return (
          <Link
            key={o.key}
            href={o.href}
            className="mono"
            title={o.line}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              background: "#fff",
              border: "1px solid rgba(18,18,18,0.2)",
              padding: "5px 9px",
              fontSize: 10.5,
              letterSpacing: "0.06em",
            }}
          >
            {o.label.toUpperCase()} →
          </Link>
        );
      })}
    </div>
  );
}
