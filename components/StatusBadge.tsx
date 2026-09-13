import type { ProjectStatus } from "@/lib/types";

const COLORS: Record<ProjectStatus, string> = {
  LIVE: "var(--status-live)",
  BUILDING: "var(--accent)",
  EXPERIMENT: "var(--status-exp)",
  ARCHIVED: "var(--faint)",
};

/** a dot and a word — not a pill */
export function StatusBadge({ status, light = false }: { status: ProjectStatus; light?: boolean }) {
  const color = COLORS[status];
  return (
    <span
      className="mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: "0.06em",
        color: light ? "rgba(255,255,255,0.7)" : "var(--muted)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        className={status === "BUILDING" ? "blink" : undefined}
        style={{ width: 6, height: 6, borderRadius: 99, background: color, display: "inline-block" }}
      />
      {status}
    </span>
  );
}
