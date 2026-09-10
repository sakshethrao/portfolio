"use client";

import { useAccent } from "./AccentProvider";

export function AccentSwatches() {
  const { accent, setAccent, accents } = useAccent();

  return (
    <div
      style={{
        display: "flex",
        gap: 7,
        alignItems: "center",
        paddingLeft: 14,
        marginLeft: 6,
        borderLeft: "1px solid var(--line-strong)",
      }}
      role="group"
      aria-label="Accent colour"
    >
      {accents.map((a) => {
        const active = a.value === accent;
        return (
          <button
            key={a.value}
            onClick={() => setAccent(a.value)}
            aria-label={a.name}
            aria-pressed={active}
            title={a.name}
            style={{
              width: 18,
              height: 18,
              borderRadius: 99,
              border: active
                ? "1.5px solid var(--ink)"
                : "1.5px solid rgba(18,18,18,0.12)",
              background: a.value,
              cursor: "pointer",
              padding: 0,
              transition: "transform .15s ease",
              transform: active ? "scale(1.12)" : "scale(1)",
            }}
          />
        );
      })}
    </div>
  );
}
