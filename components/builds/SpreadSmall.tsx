import Image from "next/image";
import type { Project } from "@/lib/types";
import { ProjectStage } from "./ProjectStage";

/** panel / terminal layouts — for future builds without a bespoke demo */
export function SpreadSmall({ project, index, detail = false }: { project: Project; index: number; detail?: boolean }) {
  return (
    <section id={`build-${project.slug}`} data-build={project.slug}>
      <div className="wrap spread">
        <div className="spread-cols">
          <ProjectStage project={project} index={index} hideStory={detail} titleSize="clamp(32px, 4.6vw, 64px)" />
          {project.layout === "terminal" && project.terminal ? (
            <pre className="mono" style={{ margin: 0, background: "var(--paper-3)", padding: 22, fontSize: 12.5, lineHeight: 1.7, color: "var(--muted)", whiteSpace: "pre-wrap", minWidth: 0 }}>
              {project.terminal.join("\n")}
            </pre>
          ) : project.image ? (
            <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", border: "1px solid var(--line)" }}>
              <Image src={project.image} alt={project.title} fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: "cover" }} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
