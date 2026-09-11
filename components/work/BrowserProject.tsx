import Link from "next/link";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ParchiDemo } from "@/components/parchi/ParchiDemo";

/** full-width row: header + a live browser-window demo beneath it */
export function BrowserProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className="lift"
      style={{
        gridColumn: "1 / -1",
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 22,
        padding: "clamp(20px, 3vw, 34px)",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span className="mono" style={{ fontWeight: 600, fontSize: 11, color: "var(--muted-2)" }}>
              {String(index).padStart(2, "0")}
            </span>
            <StatusBadge status={project.status} />
          </div>
          <h3 className="sora" style={{ fontWeight: 700, fontSize: "clamp(24px, 3.2vw, 34px)", letterSpacing: "-0.01em", margin: 0 }}>
            {project.title}
          </h3>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--muted)", margin: "8px 0 0" }}>
            {project.tagline}
          </p>
          <div className="mono" style={{ fontSize: 12, color: "var(--muted-2)", letterSpacing: "0.02em", marginTop: 10 }}>
            {project.tech.join(" · ")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

      {project.slug === "parchi" && (
        <div>
          <ParchiDemo />
          <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.04em" }}>
            LIVE DEMO — DROP THE RECEIPT, THEN CHECK THE DASHBOARD
          </span>
        </div>
      )}
    </article>
  );
}
