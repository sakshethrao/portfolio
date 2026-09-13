import Image from "next/image";
import type { Project } from "@/lib/types";
import { DetectionViz } from "@/components/DetectionViz";
import { ProjectStage } from "./ProjectStage";

/**
 * The one dark spread. The real (cropped) live-feed screenshot sits behind
 * the stylised detection scene — the product, and what it does, in one frame.
 */
export function SpreadQuantumSight({ project, index }: { project: Project; index: number }) {
  const cs = project.caseStudy;
  return (
    <section id={`build-${project.slug}`} data-build={project.slug} style={{ background: "var(--ink-2)", color: "#fff" }}>
      <div className="wrap spread" style={{ borderTopColor: "rgba(255,255,255,0.08)" }}>
        <div className="spread-cols">
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <ProjectStage project={project} index={index} dark emphasis="understand" />

            {cs?.notes?.[0] && (
              <div className="mono" style={{ fontSize: 11.5, lineHeight: 1.8, letterSpacing: "0.03em", color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 16, maxWidth: 520 }}>
                {cs.notes[0].toUpperCase()}
              </div>
            )}

            {cs?.stages && (
              <div style={{ display: "flex", maxWidth: 520 }}>
                {cs.stages.map((s) => (
                  <div
                    key={s.label}
                    className="mono"
                    style={{
                      flex: 1,
                      paddingTop: 8,
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                      borderTop:
                        s.state === "todo"
                          ? "1px dashed rgba(255,255,255,0.25)"
                          : `2px solid ${s.state === "current" ? "var(--accent)" : "rgba(255,255,255,0.8)"}`,
                      color:
                        s.state === "current" ? "var(--accent)" : s.state === "todo" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {s.label.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative", minWidth: 0 }}>
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
                <DetectionViz />
              </div>
              <span className="mono" style={{ position: "absolute", left: 14, top: 12, fontSize: 10, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)" }}>
                LIVE FEED · REAL DASHBOARD, STYLISED SCENE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
