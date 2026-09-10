import Link from "next/link";
import type { Project } from "@/lib/types";

/** compact layout — a single line in the index, for archived / minor work */
export function CompactProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="lift compact-row"
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        gap: 24,
        alignItems: "center",
        flexWrap: "wrap",
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 22,
        padding: "22px 28px",
      }}
    >
      <span className="mono" style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.03em", color: "var(--muted-2)", whiteSpace: "nowrap" }}>
        {String(index).padStart(2, "0")} · {project.status}
      </span>
      <span style={{ flex: 1, minWidth: 220 }}>
        <span className="sora" style={{ fontWeight: 700, fontSize: 17, marginRight: 10 }}>
          {project.title}
        </span>
        <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
          {project.tagline}
        </span>
      </span>
      <span className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>
        {project.period}
      </span>
    </Link>
  );
}
