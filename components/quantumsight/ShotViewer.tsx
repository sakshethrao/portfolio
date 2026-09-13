"use client";

import Image from "next/image";
import { useState } from "react";
import { DetectionViz } from "@/components/DetectionViz";

export type Shot = { key: string; label: string; src: string; w: number; h: number; caption: string };

/** the real dashboard, in a control-room block: tabs over the cropped shots */
export function ShotViewer({ shots }: { shots: Shot[] }) {
  const [i, setI] = useState(0);
  const s = shots[i];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16 }}>
      <div role="tablist" aria-label="Dashboard views" className="mono" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {shots.map((x, k) => (
          <button
            key={x.key}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            style={{
              background: k === i ? "#fff" : "transparent",
              color: k === i ? "var(--ink)" : "rgba(255,255,255,0.6)",
              border: `1px solid ${k === i ? "#fff" : "rgba(255,255,255,0.25)"}`,
              padding: "7px 14px",
              fontSize: 11,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all .2s var(--ease)",
            }}
          >
            {x.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", border: "1px solid rgba(255,255,255,0.1)", background: "#0a0c0d", overflow: "hidden" }}>
        <Image key={s.src} src={s.src} alt={s.caption} width={s.w} height={s.h} sizes="(max-width: 1100px) 100vw, 1100px" priority={i === 0} style={{ width: "100%", height: "auto", display: "block" }} />
        <div className="shot-dock" style={{ position: "absolute", left: 14, bottom: 14, width: "min(38%, 300px)" }}>
          <DetectionViz compact />
        </div>
      </div>

      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 11, letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)" }}>
        <span>{s.caption}</span>
        <span>{String(i + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}</span>
      </div>
      <style>{`@media (max-width: 640px) { .shot-dock { display: none; } }`}</style>
    </div>
  );
}
