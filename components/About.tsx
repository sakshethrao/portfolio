import { about, roles } from "@/content/experience";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="wrap" style={{ padding: "clamp(72px, 12vw, 120px) var(--pad)" }}>
      <div className="about-grid">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 16 }}>ABOUT</div>
          <p className="sora" style={{ fontWeight: 600, fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.25, letterSpacing: "-0.01em", margin: "0 0 22px", maxWidth: 620 }}>
            {about.lead}
          </p>
          {about.body.map((para, i) => (
            <p key={i} style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", margin: "0 0 16px", maxWidth: 560 }}>
              {para}
            </p>
          ))}

          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginTop: 28 }}>
            <TagColumn title="Working on" tags={about.works} />
            <TagColumn title="Off hours" tags={about.offHours} />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: "clamp(20px, 3vw, 40px)" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.04em", color: "var(--muted-2)", marginBottom: 18 }}>
              EXPERIENCE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {roles.map((r) => (
                <div key={r.company + r.title}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span className="sora" style={{ fontWeight: 700, fontSize: 15 }}>{r.company}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>{r.period}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 3 }}>{r.title}</div>
                  {r.summary && (
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted-2)", margin: "6px 0 0" }}>{r.summary}</p>
                  )}
                  {r.points && (
                    <ul style={{ margin: "8px 0 0", paddingLeft: 16, fontSize: 13, lineHeight: 1.6, color: "var(--muted-2)" }}>
                      {r.points.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <a href="/resume" className="mono pill-outline" style={{ display: "inline-block", marginTop: 24 }}>
              Full résumé ↓
            </a>
            <div className="mono" style={{ marginTop: 18, fontSize: 12, color: "var(--muted-2)", display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn ↗</a>
              <a href={site.socials.github} target="_blank" rel="noreferrer" className="link-underline">GitHub ↗</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TagColumn({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.04em", color: "var(--faint)", marginBottom: 10 }}>
        {title.toUpperCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tags.map((t) => (
          <span key={t} className="sora" style={{ fontWeight: 600, fontSize: 15 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
