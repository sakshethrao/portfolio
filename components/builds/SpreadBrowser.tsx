import type { Project } from "@/lib/types";
import { ParchiDemo } from "@/components/parchi/ParchiDemo";
import { MakeFlow } from "@/components/make/MakeFlow";
import { ProjectStage } from "./ProjectStage";

/** web-app spread: the stage up top, the live demo running full width beneath */
export function SpreadBrowser({ project, index, detail = false }: { project: Project; index: number; detail?: boolean }) {
  return (
    <section id={`build-${project.slug}`} data-build={project.slug}>
      <div className="wrap spread">
        <div className="grid-12" style={{ rowGap: 40, alignItems: "end" }}>
          <div style={{ gridColumn: "1 / span 12" }} className="browser-stage">
            <ProjectStage project={project} index={index} hideStory={detail} emphasis={project.slug === "parchi" ? "logs itself" : "lifecycle"} />
          </div>

          {project.slug === "parchi" && (
            <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
              <ParchiDemo />
              <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
                LIVE DEMO — DROP THE RECEIPT, THEN CHECK THE DASHBOARD
              </span>
            </div>
          )}

          {project.slug === "influencer-payment-os" && (
            <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
              <MakeFlow />
              <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
                LIVE DEMO — HIT RUN ONCE, WATCH IT MOVE THROUGH THE SCENARIO
              </span>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) { .browser-stage { grid-column: 1 / span 8 !important; } }
      `}</style>
    </section>
  );
}
