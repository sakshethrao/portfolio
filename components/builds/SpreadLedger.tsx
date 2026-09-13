import Link from "next/link";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

/**
 * Archived work as a ledger line: the numbers at display size, a stamp,
 * one hairline. No frame, no image.
 */
export function SpreadLedger({ project, index, detail = false }: { project: Project; index: number; detail?: boolean }) {
  return (
    <section id={`build-${project.slug}`} data-build={project.slug}>
      <div className="wrap spread" style={{ paddingTop: "clamp(28px, 4vw, 56px)", paddingBottom: "clamp(36px, 5vw, 72px)" }}>
        <div className="mono" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", fontSize: 11, letterSpacing: "0.06em", color: "var(--faint)", marginBottom: 22 }}>
          <span>{String(index).padStart(2, "0")}</span>
          <StatusBadge status={project.status} />
          <span>{project.period.toUpperCase()}</span>
          <span>{project.category.toUpperCase()}</span>
        </div>

        <div className="ledger" style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", gap: "clamp(20px, 4vw, 64px)", alignItems: "end" }}>
          <div>
            {detail ? (
              <h1 className="display" style={{ fontWeight: 500, fontSize: "clamp(34px, 4.6vw, 64px)", margin: 0 }}>{project.title}</h1>
            ) : (
              <Link href={`/work/${project.slug}`} className="display link-underline" style={{ fontWeight: 500, fontSize: "clamp(34px, 4.6vw, 64px)" }}>
                {project.title}
              </Link>
            )}
            <p style={{ fontSize: 16, lineHeight: 1.5, color: "var(--muted)", margin: "14px 0 0", maxWidth: 420 }}>
              {project.tagline}
            </p>
            <div className="mono" style={{ fontSize: 11, color: "var(--faint)", letterSpacing: "0.04em", marginTop: 14 }}>
              {project.tech.join("  ·  ")}
            </div>
          </div>

          {project.figures && (
            <div style={{ display: "flex", gap: "clamp(20px, 4vw, 56px)", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {project.figures.map((f) => (
                <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="display" style={{ fontWeight: 400, fontSize: "clamp(40px, 6vw, 96px)", color: "var(--ink)" }}>
                    {f.value}
                  </span>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-2)" }}>
                    {f.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) { .ledger { grid-template-columns: 1fr !important; } .ledger > div:last-child { justify-content: flex-start !important; } }
      `}</style>
    </section>
  );
}
