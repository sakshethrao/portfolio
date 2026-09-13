"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectPhone } from "@/components/work/ProjectPhone";
import { ProjectStage } from "./ProjectStage";

/**
 * A phone that arrives at an angle and settles flat as you scroll to it —
 * CSS 3D, so the app inside stays fully tappable. The spread borrows the
 * product's own cream so it reads as *that* app's page, not a card.
 */
export function SpreadDevice({ project, index, detail = false }: { project: Project; index: number; detail?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const rotateY = useTransform(p, [0, 1], [-30, 0]);
  const rotateX = useTransform(p, [0, 1], [8, 0]);
  const scale = useTransform(p, [0, 1], [0.92, 1]);
  const y = useTransform(p, [0, 1], [40, 0]);

  const isNurture = project.slug === "nurture";

  return (
    <section id={`build-${project.slug}`} data-build={project.slug} style={{ background: isNurture ? "#fbf9f1" : "var(--paper)" }}>
      <div className="wrap spread" ref={ref}>
        <div className="spread-cols flip">
          <ProjectStage project={project} index={index} hideStory={detail} emphasis="verified" />

          <div style={{ perspective: 1400, perspectiveOrigin: "60% 40%", display: "flex", justifyContent: "center", minWidth: 0 }}>
            <motion.div
              className="device-stage"
              style={{ width: "min(100%, 360px)", ...(reduce ? {} : { rotateY, rotateX, scale, y, transformStyle: "preserve-3d" as const }) }}
            >
              <ProjectPhone project={project} maxScale={0.95} />
              {isNurture && (
                <span className="mono" style={{ fontSize: 10, color: "var(--faint)", letterSpacing: "0.08em" }}>
                  LIVE PREVIEW — TAP THE BOTTOM BAR
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
