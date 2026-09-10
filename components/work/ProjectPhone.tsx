"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { PhoneShowcase } from "@/components/PhoneShowcase";
import { NurturePreview } from "@/components/nurture/NurturePreview";

const BASE_W = 320; // DeviceFrame base width

/**
 * Picks the right in-device presentation for a project and scales the phone to
 * fit its container — so it never overflows on mobile.
 */
export function ProjectPhone({
  project,
  maxScale = 0.9,
}: {
  project: Project;
  maxScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxScale);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const avail = el.clientWidth;
      if (avail <= 0) return;
      // a touch smaller on phones so the frame has clear breathing room
      const cap = avail < 380 ? Math.min(maxScale, 0.8) : maxScale;
      setScale(Math.max(0.55, Math.min(cap, (avail - 2) / BASE_W)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxScale]);

  return (
    <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {project.slug === "nurture" ? (
        <NurturePreview scale={scale} />
      ) : (
        <PhoneShowcase
          screens={project.screens}
          title={project.title}
          tech={project.tech}
          scale={scale}
        />
      )}
    </div>
  );
}
