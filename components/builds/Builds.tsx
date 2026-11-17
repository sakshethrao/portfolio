import { publicProjects } from "@/content/projects";
import { Reveal } from "@/components/Reveal";
import { Emph } from "./ProjectStage";
import { SpreadQuantumSight } from "./SpreadQuantumSight";
import { SpreadDevice } from "./SpreadDevice";
import { SpreadBrowser } from "./SpreadBrowser";
import { SpreadLedger } from "./SpreadLedger";
import { SpreadSmall } from "./SpreadSmall";
import { Lab } from "./Lab";

/**
 * The index of builds — one editorial spread per project, in projects.ts
 * order, composition chosen by `layout`. Adding a build never touches this.
 */
export function Builds() {
  return (
    <section id="builds" data-section="builds" style={{ position: "relative" }}>
      <div className="wrap" style={{ paddingTop: "clamp(44px, 6.5vw, 96px)", paddingBottom: "clamp(28px, 4vw, 56px)" }}>
        <Reveal>
          <div className="grid-12" style={{ alignItems: "end", rowGap: 18 }}>
            <div style={{ gridColumn: "1 / span 12" }} className="builds-head">
              <div className="eyebrow" style={{ marginBottom: 18 }}>
                Builds
              </div>
              <h2 className="display" style={{ fontWeight: 500, fontSize: "clamp(44px, 8vw, 120px)", margin: 0 }}>
                <Emph text="Things I’ve built." word="built" />
              </h2>
            </div>
            <p style={{ gridColumn: "1 / span 12", fontSize: 15, lineHeight: 1.5, color: "var(--muted)", margin: 0, maxWidth: 300 }} className="builds-note">
              Some are businesses, some are working apps, and some are experiments that started with a random idea.
            </p>
          </div>
        </Reveal>
      </div>

      {publicProjects.map((project, i) => {
        const index = i + 1;
        switch (project.layout) {
          case "feature":
            return <SpreadQuantumSight key={project.slug} project={project} index={index} />;
          case "device":
            return <SpreadDevice key={project.slug} project={project} index={index} />;
          case "browser":
            return <SpreadBrowser key={project.slug} project={project} index={index} />;
          case "compact":
            return <SpreadLedger key={project.slug} project={project} index={index} />;
          default:
            return <SpreadSmall key={project.slug} project={project} index={index} />;
        }
      })}

      <Lab />

      <style>{`
        @media (min-width: 900px) {
          .builds-head { grid-column: 1 / span 8 !important; }
          .builds-note { grid-column: 10 / span 3 !important; }
        }
      `}</style>
    </section>
  );
}
