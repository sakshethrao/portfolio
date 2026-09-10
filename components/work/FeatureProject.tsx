"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { DetectionViz } from "@/components/DetectionViz";

export function FeatureProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const cs = project.caseStudy;

  return (
    <article
      className="lift"
      style={{
        gridColumn: "1 / -1",
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 22,
        padding: "clamp(20px, 3vw, 30px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div className="mono" style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.03em", color: "var(--muted-2)" }}>
          {String(index).padStart(2, "0")} · FEATURED
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="feature-split">
        <DetectionViz />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          <h3 className="sora" style={{ fontWeight: 700, fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.01em", margin: 0 }}>
            {project.title}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--muted)", margin: 0, maxWidth: 460 }}>
            {project.tagline}
          </p>
          <div className="mono" style={{ fontSize: 11, color: "var(--faint)", letterSpacing: "0.02em", marginTop: 2 }}>
            {project.category} · {project.period}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mono pill-solid"
              style={{ cursor: "pointer" }}
            >
              {open ? "Close ✕" : "See how it works ↓"}
            </button>
            <Link href={`/${project.slug === "quantumsight" ? "quantumsight" : `work/${project.slug}`}`} className="mono pill-outline">
              Full write-up ↗
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && cs && (
          <motion.div
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                borderTop: "1px solid var(--line)",
                paddingTop: 20,
                marginTop: 4,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {cs.problem && (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(18,18,18,0.65)", margin: 0, maxWidth: 640 }}>
                  {cs.problem}
                </p>
              )}

              {cs.stages && (
                <div style={{ display: "flex", gap: 0 }}>
                  {cs.stages.map((s) => (
                    <div
                      key={s.label}
                      className="mono"
                      style={{
                        flex: 1,
                        paddingTop: 8,
                        fontSize: 11,
                        fontWeight: 500,
                        borderTop:
                          s.state === "todo"
                            ? "2px dashed rgba(18,18,18,0.2)"
                            : `2px solid ${s.state === "current" ? "var(--accent)" : "rgba(18,18,18,0.75)"}`,
                        color:
                          s.state === "current"
                            ? "var(--accent)"
                            : s.state === "todo"
                              ? "rgba(18,18,18,0.35)"
                              : "rgba(18,18,18,0.75)",
                      }}
                    >
                      {s.label.toUpperCase()}
                    </div>
                  ))}
                </div>
              )}

              <div
                className="mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  fontSize: 11.5,
                  color: "var(--muted-2)",
                }}
              >
                <span>BUILT WITH — {project.tech.join(" · ").toUpperCase()}</span>
                <a href="/#contact" className="pill-outline" style={{ fontSize: 12 }}>
                  Talk about a pilot ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
