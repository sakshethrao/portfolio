import type { Project } from "@/lib/types";
import { QuantumSightVisual } from "./QuantumSightVisual";
import { ProjectStage } from "./ProjectStage";
import { Reveal } from "@/components/Reveal";

/**
 * The one dark spread. The real (cropped) live-feed screenshot sits behind
 * the stylised detection scene — the product, and what it does, in one frame.
 */
export function SpreadQuantumSight({ project, index }: { project: Project; index: number }) {
  const cs = project.caseStudy;
  return (
    <section id={`build-${project.slug}`} data-build={project.slug} data-nav="light" style={{ background: "var(--ink-2)", color: "#fff" }}>
      <div className="wrap spread" style={{ borderTopColor: "rgba(255,255,255,0.08)" }}>
        <div className="spread-cols">
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <ProjectStage project={project} index={index} dark emphasis="a lot more" />

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

          <Reveal delay={0.12} style={{ position: "relative", minWidth: 0 }}>
            <QuantumSightVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
