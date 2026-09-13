"use client";

import { scrollTo } from "@/lib/scroll";
import { useActiveSection, useSectionVisible } from "@/lib/useActiveSection";

/**
 * A fixed rail in the left margin, desktop only, visible while the Builds
 * section is on screen. Shows where you are among the builds.
 */
export function MiniIndex({ items }: { items: { slug: string; title: string }[] }) {
  const active = useActiveSection("build");
  const visible = useSectionVisible("builds", 0.2);

  return (
    <nav
      aria-label="Builds"
      className="mini-index mono"
      style={{
        position: "fixed",
        left: 22,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 60,
        flexDirection: "column",
        gap: 10,
        fontSize: 10.5,
        letterSpacing: "0.06em",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.35s var(--ease)",
        mixBlendMode: "difference",
        color: "#fff",
      }}
    >
      {items.map((it, i) => {
        const on = it.slug === active;
        return (
          <button
            key={it.slug}
            onClick={() => scrollTo(`#build-${it.slug}`)}
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: on ? 1 : 0.45,
              transition: "opacity 0.25s var(--ease)",
              color: "inherit",
              textAlign: "left",
            }}
          >
            <span style={{ width: on ? 22 : 10, height: 1, background: "currentColor", transition: "width 0.3s var(--ease)" }} />
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ opacity: on ? 1 : 0, transition: "opacity 0.25s var(--ease)" }}>{it.title.toUpperCase()}</span>
          </button>
        );
      })}
    </nav>
  );
}
