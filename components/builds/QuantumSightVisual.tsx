import Image from "next/image";
import { DetectionViz } from "@/components/DetectionViz";

/**
 * The real (cropped) live-feed screenshot with the detection scene docked on
 * top of it: the product, and what it does, in one frame.
 */
export function QuantumSightVisual({ play }: { play?: boolean }) {
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Image
        src="/quantumsight/feed-crop.jpg"
        alt="QuantumSight live feed — every camera, detections drawn in real time"
        fill
        sizes="(max-width: 900px) 100vw, 60vw"
        style={{ objectFit: "cover", objectPosition: "left top", opacity: 0.42, filter: "saturate(0.7)" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,15,16,0.65) 0%, rgba(13,15,16,0) 50%)" }} />
      <div className="qs-scene-dock" style={{ position: "absolute", right: "6%", bottom: "8%", width: "min(62%, 420px)" }}>
        <DetectionViz play={play} />
      </div>
      <span className="mono" style={{ position: "absolute", left: 14, top: 12, fontSize: 10, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)" }}>
        LIVE FEED · REAL DASHBOARD, STYLISED SCENE
      </span>
    </div>
  );
}
