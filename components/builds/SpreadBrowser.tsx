import type { Project } from "@/lib/types";
import { DEMOS, EMPHASIS, TONE } from "./demos";
import { ProjectStage } from "./ProjectStage";
import { Reveal } from "@/components/Reveal";

/** web-app spread: the stage up top, the live demo running full width beneath */
export function SpreadBrowser({ project, index, detail = false }: { project: Project; index: number; detail?: boolean }) {
  const demo = DEMOS[project.slug];
  const tint = TONE[project.slug]?.bg;

  return (
    <section id={`build-${project.slug}`} data-build={project.slug} style={tint ? { background: tint } : undefined}>
      <div className="wrap spread">
        <div className="grid-12" style={{ rowGap: 40, alignItems: "end" }}>
          <div style={{ gridColumn: "1 / span 12" }} className="browser-stage">
            <ProjectStage project={project} index={index} hideStory={detail} emphasis={EMPHASIS[project.slug]} />
          </div>

          {demo && (
            <Reveal delay={0.12} style={{ gridColumn: "1 / -1", minWidth: 0 }}>
              {demo.node}
              <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
                {demo.caption}
              </span>
            </Reveal>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) { .browser-stage { grid-column: 1 / span 8 !important; } }
      `}</style>
    </section>
  );
}
