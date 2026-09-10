import type { ProjectStatus } from "@/lib/types";

const COLORS: Record<ProjectStatus, string> = {
  LIVE: "var(--status-live)",
  BUILDING: "var(--accent)",
  EXPERIMENT: "var(--status-exp)",
  ARCHIVED: "var(--faint)",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const color = COLORS[status];
  return (
    <span
      className="mono"
      style={{
        fontWeight: 600,
        fontSize: 10.5,
        letterSpacing: "0.04em",
        color,
        border: `1px solid ${color}`,
        padding: "3px 9px",
        borderRadius: 99,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
