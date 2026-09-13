import { experiments, labIntro } from "@/content/experiments";

/** The Lab as margin notes — small, ruled, slightly askew index cards */
export function Lab() {
  if (!experiments.length) return null;
  const tilt = [-1, 0.8, -0.5, 0.9, -1.2, 0.4];
  return (
    <div id="lab" className="wrap" style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(48px, 7vw, 96px)", borderTop: "1px solid var(--line)" }}>
      <div className="grid-12" style={{ rowGap: 28 }}>
        <div style={{ gridColumn: "1 / span 12" }} className="lab-head">
          <div className="eyebrow" style={{ marginBottom: 12 }}>The Lab</div>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "var(--muted)", margin: 0, maxWidth: 340 }}>{labIntro}</p>
        </div>
        <div style={{ gridColumn: "1 / span 12", display: "flex", gap: 18, flexWrap: "wrap" }} className="lab-notes">
          {experiments.map((x, i) => {
            const href = x.liveUrl ?? x.githubUrl;
            const note = (
              <div
                className="mono"
                style={{
                  transform: `rotate(${tilt[i % tilt.length]}deg)`,
                  background: "var(--paper-note)",
                  border: "1px solid var(--line-strong)",
                  padding: "16px 18px",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  maxWidth: 260,
                  color: "var(--ink)",
                }}
              >
                <span style={{ fontSize: 15 }}>{x.emoji} </span>
                {x.blurb}
                {x.learned && x.learned.toLowerCase().indexOf("todo") === -1 && (
                  <span style={{ display: "block", marginTop: 8, color: "var(--faint)", fontSize: 11 }}>learned: {x.learned}</span>
                )}
                {href && (
                  <span style={{ display: "block", marginTop: 10, color: "var(--accent)", fontSize: 11, letterSpacing: "0.04em" }}>
                    {x.liveUrl ? "OPEN ↗" : "CODE ↗"}
                  </span>
                )}
              </div>
            );
            return href ? (
              <a key={x.title} href={href} target="_blank" rel="noreferrer" style={{ display: "block" }}>{note}</a>
            ) : (
              <div key={x.title}>{note}</div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .lab-head { grid-column: 1 / span 4 !important; }
          .lab-notes { grid-column: 5 / span 8 !important; }
        }
      `}</style>
    </div>
  );
}
