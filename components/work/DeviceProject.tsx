import Link from "next/link";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ProjectPhone } from "./ProjectPhone";

export function DeviceProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className="lift device-split"
      style={{
        gridColumn: "1 / -1",
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 22,
        padding: "clamp(20px, 3vw, 34px)",
      }}
    >
      <div className="device-stage">
        <ProjectPhone project={project} />
        {project.slug === "nurture" && (
          <span className="mono" style={{ fontSize: 10, color: "var(--faint)", letterSpacing: "0.04em" }}>
            LIVE PREVIEW — TAP THE BOTTOM BAR
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontWeight: 600, fontSize: 11, color: "var(--muted-2)" }}>
            {String(index).padStart(2, "0")}
          </span>
          <StatusBadge status={project.status} />
        </div>
        <h3 className="sora" style={{ fontWeight: 700, fontSize: "clamp(24px, 3.2vw, 34px)", letterSpacing: "-0.01em", margin: 0 }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--muted)", margin: 0, maxWidth: 460 }}>
          {project.tagline}
        </p>
        <div className="mono" style={{ fontSize: 12, color: "var(--muted-2)", letterSpacing: "0.02em", marginTop: 4 }}>
          {project.tech.join(" · ")}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mono pill-solid">
              Open it ↗
            </a>
          )}
          <Link href={`/work/${project.slug}`} className="mono pill-outline">
            The build story →
          </Link>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="mono pill-outline">
              Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
