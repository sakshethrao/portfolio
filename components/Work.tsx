import { publicProjects } from "@/content/projects";
import { experiments } from "@/content/experiments";
import { Reveal } from "./Reveal";
import { FeatureProject } from "./work/FeatureProject";
import { DeviceProject } from "./work/DeviceProject";
import { SmallProject } from "./work/SmallProject";
import { CompactProject } from "./work/CompactProject";

export function Work() {
  const shipped = publicProjects.filter((p) => p.status === "LIVE" || p.status === "ARCHIVED").length;
  const building = publicProjects.filter((p) => p.status === "BUILDING").length;

  return (
    <section id="work" className="wrap" style={{ padding: "clamp(48px, 9vw, 116px) var(--pad) 40px" }}>
      <Reveal>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 40,
            borderBottom: "1px solid var(--line)",
            paddingBottom: 22,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              BUILDS — {shipped} SHIPPED{building ? `, ${building} IN PROGRESS` : ""}
            </div>
            <h2 className="sora" style={{ fontWeight: 700, fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.1, letterSpacing: "-0.01em", margin: 0, maxWidth: 640 }}>
              Selected work, and a running list of things I&rsquo;ve actually shipped.
            </h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--muted)", maxWidth: 280, margin: 0 }}>
            Not a portfolio grid — an index. New rows get added, nothing gets redesigned.
          </p>
        </div>
      </Reveal>

      <div className="work-grid">
        {publicProjects.map((project, i) => {
          const index = i + 1;
          const key = project.slug;
          if (project.layout === "feature")
            return (
              <Reveal key={key} style={{ gridColumn: "1 / -1" }}>
                <FeatureProject project={project} index={index} />
              </Reveal>
            );
          if (project.layout === "device")
            return (
              <Reveal key={key} style={{ gridColumn: "1 / -1" }}>
                <DeviceProject project={project} index={index} />
              </Reveal>
            );
          if (project.layout === "compact")
            return (
              <Reveal key={key} style={{ gridColumn: "1 / -1" }}>
                <CompactProject project={project} index={index} />
              </Reveal>
            );
          return (
            <Reveal key={key}>
              <SmallProject project={project} index={index} />
            </Reveal>
          );
        })}
      </div>

      {experiments.length > 0 && <Lab />}
    </section>
  );
}

function Lab() {
  const tilt = [-1.2, 1, -0.6, 0.9, -1.4, 0.5];
  return (
    <div id="lab" style={{ marginTop: 64, borderTop: "1px solid var(--line)", paddingTop: 40 }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div className="sora" style={{ fontWeight: 700, fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.01em" }}>
            The Lab
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 360 }}>
            Things I built because I was curious. Not everything needs to become a startup.
          </div>
        </div>
      </Reveal>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {experiments.map((x, i) => (
          <Reveal key={x.title} delay={i * 0.04}>
            <div
              className="sticky-note mono"
              style={{
                transform: `rotate(${tilt[i % tilt.length]}deg)`,
                background: "var(--paper-note)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                boxShadow: "2px 3px 0 rgba(18,18,18,0.06)",
                padding: "16px 18px",
                fontSize: 13,
                lineHeight: 1.45,
                maxWidth: 220,
              }}
            >
              <span style={{ fontSize: 15 }}>{x.emoji} </span>
              {x.blurb}
              {x.learned && x.learned.toLowerCase().indexOf("todo") === -1 && (
                <span style={{ display: "block", marginTop: 8, color: "var(--faint)", fontSize: 11 }}>
                  learned: {x.learned}
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
