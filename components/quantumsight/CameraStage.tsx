"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAccent } from "@/components/AccentProvider";
import { DetectionViz } from "@/components/DetectionViz";

const CameraScene = dynamic(() => import("./CameraScene"), { ssr: false });

/** lazy 3D camera; without WebGL, the detection scene stands in */
export function CameraStage() {
  const { accent } = useAccent();
  const [gl, setGl] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setGl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setGl(false);
    }
  }, []);
  if (gl === false) return <DetectionViz />;
  return (
    <div style={{ position: "relative" }}>
      {gl && <CameraScene accent={accent} />}
      <span className="mono" style={{ position: "absolute", left: 0, bottom: -6, fontSize: 10, letterSpacing: "0.08em", color: "var(--faint)" }}>
        IT FOLLOWS YOUR CURSOR
      </span>
    </div>
  );
}
