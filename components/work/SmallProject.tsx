import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

/** panel + terminal layouts — half-width cards in the Work grid */
export function SmallProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="lift"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 22,
        padding: 28,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="mono" style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.03em", color: "var(--muted-2)" }}>
          {String(index).padStart(2, "0")}
        </span>
        <StatusBadge status={project.status} />
      </div>

      {project.layout === "terminal" && project.terminal ? (
        <div
          className="mono"
          style={{
            background: "var(--paper-3)",
            borderRadius: 16,
            padding: 14,
            fontSize: 12,
            lineHeight: 1.7,
            color: "var(--muted)",
            whiteSpace: "pre-wrap",
          }}
        >
          {project.terminal.join("\n")}
        </div>
      ) : project.image ? (
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", aspectRatio: "16 / 10", position: "relative" }}>
          <Image src={project.image} alt={project.title} fill sizes="(max-width: 720px) 100vw, 620px" style={{ objectFit: "cover" }} />
        </div>
      ) : null}

      <div>
        <div className="sora" style={{ fontWeight: 700, fontSize: 17, marginBottom: 3 }}>
          {project.title}
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
          {project.tagline}
        </p>
      </div>

      <div className="mono" style={{ fontSize: 10.5, color: "var(--faint)", marginTop: "auto", letterSpacing: "0.02em" }}>
        {project.tech.slice(0, 4).join(" · ")}
      </div>
    </Link>
  );
}
