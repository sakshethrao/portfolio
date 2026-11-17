"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Project } from "@/lib/types";
import { scroll, scrollTo, subscribeScroll } from "@/lib/scroll";
import { StatusBadge } from "@/components/StatusBadge";
import { ProjectPhone } from "@/components/work/ProjectPhone";
import { Emph } from "./ProjectStage";
import { QuantumSightVisual } from "./QuantumSightVisual";
import { DEMOS, EMPHASIS, TONE } from "./demos";

/** viewport-heights of scrolling each build gets while the stage is pinned */
const SEG = 0.9;

/**
 * The builds as one pinned stage. The page holds still while you scroll
 * through the projects: the words on the left change, the app in the frame on
 * the right changes with them and stays fully usable, and the whole stage
 * takes on that product's own colour. Wide screens only; on a phone the same
 * builds run as a stacked column (see BuildsSwitch).
 */
export function Showcase({ projects }: { projects: Project[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const n = projects.length;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let top = 0;
    let travel = 1;
    const measure = () => {
      top = el.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, el.offsetHeight - window.innerHeight);
    };
    const update = () => {
      const f = Math.min(0.9999, Math.max(0, (scroll.y - top) / travel)) * n;
      const i = Math.floor(f);
      setActive((a) => (a === i ? a : i));
      rail.current?.style.setProperty("--seg", (f - i).toFixed(3));
    };
    const both = () => {
      measure();
      update();
    };
    both();
    const unsub = subscribeScroll(update);
    const ro = new ResizeObserver(both);
    ro.observe(document.body);
    window.addEventListener("resize", both);
    return () => {
      unsub();
      ro.disconnect();
      window.removeEventListener("resize", both);
    };
  }, [n]);

  const tone = TONE[projects[active].slug] ?? { bg: "#ffffff" };
  const go = (slug: string) => {
    const t = document.getElementById(`build-${slug}`);
    if (t) scrollTo(t);
  };

  return (
    <div ref={wrap} className="show" style={{ height: `calc(${n * SEG * 100}vh + 100vh)` }}>
      {/* where each build begins, so links and the desk can jump straight to one */}
      {projects.map((p, i) => (
        <span key={p.slug} id={`build-${p.slug}`} data-build={p.slug} aria-hidden style={{ position: "absolute", top: `calc(${i * SEG * 100}vh + 8px)`, left: 0, width: 1, height: 1 }} />
      ))}

      <div className="show-stage" data-tone={tone.dark ? "dark" : "light"} style={{ background: tone.bg }}>
        <div className="wrap show-grid">
          <div className="show-copy">
            <div className="show-panels">
              {projects.map((p, i) => (
                <Copy key={p.slug} project={p} index={i + 1} on={i === active} dark={!!tone.dark} />
              ))}
            </div>

            <ol ref={rail} className="show-rail mono" aria-label="Builds">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button type="button" onClick={() => go(p.slug)} data-active={i === active || undefined} data-done={i < active || undefined} aria-current={i === active ? "true" : undefined}>
                    <span className="show-rail-tick" aria-hidden />
                    <span>{p.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="show-frame">
            <div className="show-frame-bar mono">
              <span className="show-frame-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="show-frame-name">{projects[active].title}</span>
              <span>
                {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </span>
            </div>
            <div className="show-frame-body">
              {projects.map((p, i) => (
                <div key={p.slug} className={`show-demo${i === active ? "" : " anim-paused"}`} data-active={i === active || undefined} inert={i !== active}>
                  <Visual project={p} on={i === active} />
                </div>
              ))}
            </div>
            <div className="show-frame-cap mono">{caption(projects[active])}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function caption(p: Project) {
  if (p.layout === "feature") return "REAL DASHBOARD BEHIND — THE FIRE SCENE IS DRAWN, NOT CAMERA FOOTAGE";
  if (p.slug === "nurture") return "LIVE PREVIEW — TAP THE BOTTOM BAR";
  return DEMOS[p.slug]?.caption ?? "";
}

/** the words for one build; only the showing one can be reached or read aloud */
function Copy({ project, index, on, dark }: { project: Project; index: number; on: boolean; dark: boolean }) {
  const story = project.slug === "quantumsight" ? "/quantumsight" : `/work/${project.slug}`;
  const word = EMPHASIS[project.slug];
  const row = (i: number) => ({ "--i": i }) as React.CSSProperties;
  return (
    <div className="show-panel" data-active={on || undefined} inert={!on}>
      <div className="show-row mono show-meta" style={row(0)}>
        <span>{String(index).padStart(2, "0")}</span>
        <StatusBadge status={project.status} light={dark} />
        <span>{project.period.toUpperCase()}</span>
        <span>{project.category.toUpperCase()}</span>
      </div>
      <h3 className="show-row display show-title" style={row(1)}>
        {project.title}
      </h3>
      <p className="show-row show-tagline" style={row(2)}>
        {word ? <Emph text={project.tagline} word={word} /> : project.tagline}
      </p>
      <div className="show-row mono show-tech" style={row(3)}>
        {project.tech.join("  ·  ")}
      </div>
      <div className="show-row show-actions" style={row(4)}>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="pill-solid">
            Open it ↗
          </a>
        )}
        <Link href={story} className={project.liveUrl ? "pill-outline" : "pill-solid"}>
          {project.slug === "quantumsight" ? "Go inside →" : "The build story →"}
        </Link>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="pill-outline">
            Code ↗
          </a>
        )}
      </div>
    </div>
  );
}

function Visual({ project, on }: { project: Project; on: boolean }) {
  if (project.layout === "feature")
    return (
      <Fit width={900}>
        <QuantumSightVisual play={on} />
      </Fit>
    );
  if (project.layout === "device")
    return (
      <Fit width={340}>
        <ProjectPhone project={project} maxScale={0.95} />
      </Fit>
    );
  return <Fit width={900}>{DEMOS[project.slug]?.node}</Fit>;
}

/**
 * Lays its child out at a fixed design width, then scales the whole thing to
 * fit the frame in both directions. The app keeps its real proportions and
 * every click still lands where it should.
 */
function Fit({ width, children }: { width: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      const h = i.offsetHeight;
      if (!h || !o.clientWidth) return;
      setS(Math.min(1, o.clientWidth / width, o.clientHeight / h));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={outer} style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={inner} style={{ position: "absolute", left: "50%", top: "50%", width, transform: `translate(-50%, -50%) scale(${s})` }}>
        {children}
      </div>
    </div>
  );
}
