"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { DeviceFrame } from "./DeviceFrame";

/**
 * A phone the visitor can actually scroll through. Pass real screenshots via
 * `screens`. With none, it shows a restrained placeholder — no invented app UI.
 */
export function PhoneShowcase({
  screens = [],
  title,
  tech = [],
  scale = 0.82,
}: {
  screens?: string[];
  title: string;
  tech?: string[];
  scale?: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(true);

  const hasScreens = screens.length > 0;

  return (
    <div style={{ position: "relative", width: 320 * scale }}>
      <DeviceFrame scale={scale} label={`${title} app preview`}>
        {hasScreens ? (
          <div
            ref={scroller}
            onScroll={() => setHint(false)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              height: "100%",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            {screens.map((src, i) => (
              <Image
                key={src + i}
                src={src}
                alt={`${title} screen ${i + 1}`}
                width={320}
                height={660}
                sizes="320px"
                style={{ width: "100%", height: "auto", display: "block" }}
                priority={i === 0}
              />
            ))}
          </div>
        ) : (
          <Placeholder title={title} tech={tech} />
        )}
      </DeviceFrame>

      {hasScreens && hint && (
        <div
          className="mono"
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            letterSpacing: "0.04em",
            color: "var(--faint)",
            pointerEvents: "none",
          }}
        >
          scroll ↕
        </div>
      )}
    </div>
  );
}

/**
 * Honest skeleton — obviously a placeholder (monochrome, no data), fills the
 * frame so the device doesn't read as broken. Replaced the moment real
 * screenshots land in the project's `screens`.
 */
function Placeholder({ title }: { title: string; tech?: string[] }) {
  const bar = (w: string | number, h = 12, r = 6) => (
    <div style={{ width: w, height: h, borderRadius: r, background: "rgba(18,18,18,0.07)" }} />
  );
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fbfaf7" }}>
      <div style={{ padding: "18px 18px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        {bar(96, 16)}
        {bar("62%", 10)}
      </div>
      <div style={{ padding: "6px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid rgba(18,18,18,0.06)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {bar(`${70 - i * 8}%`, 11)}
            {bar(`${45 - i * 5}%`, 9)}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", padding: 14 }}>
        <div style={{ background: "rgba(18,18,18,0.08)", borderRadius: 14, height: 44 }} />
      </div>
      <div
        className="mono"
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 9.5,
          letterSpacing: "0.06em",
          color: "var(--faint)",
        }}
      >
        {title.toUpperCase()} · PREVIEW
      </div>
    </div>
  );
}
