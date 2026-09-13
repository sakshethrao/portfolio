import { about, roles, education } from "@/content/experience";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

/** years in the margin, the story in the column — a timeline you can read like a page */
export function Experience() {
  return (
    <section id="experience" data-section="experience" className="wrap" style={{ padding: "clamp(72px, 11vw, 150px) var(--pad) clamp(64px, 9vw, 120px)" }}>
      <Reveal>
        <div className="eyebrow" style={{ marginBottom: 22 }}>Experience</div>
        <p className="display" style={{ fontWeight: 400, fontSize: "clamp(26px, 3.4vw, 50px)", lineHeight: 1.08, margin: "0 0 clamp(40px, 6vw, 80px)", maxWidth: 1000 }}>
          {about.lead}
        </p>
      </Reveal>

      <div className="exp-grid">
        <div>
          {roles.map((r, i) => (
            <Reveal key={r.company + r.title} delay={i * 0.03}>
              <div className="timeline-row">
                <div className="display" style={{ fontWeight: 300, fontSize: "clamp(28px, 3.6vw, 56px)", color: "var(--faint)", lineHeight: 1 }}>
                  {r.period.slice(0, 4)}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em" }}>{r.company}</span>
                    <span className="mono" style={{ fontSize: 11, letterSpacing: "0.05em", color: "var(--faint)" }}>{r.period.toUpperCase()}{r.location ? ` · ${r.location.toUpperCase()}` : ""}</span>
                  </div>
                  <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 4 }}>{r.title}</div>
                  {r.summary && <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--muted-2)", margin: "10px 0 0", maxWidth: 560 }}>{r.summary}</p>}
                </div>
              </div>
            </Reveal>
          ))}

          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.03}>
              <div className="timeline-row">
                <div className="display" style={{ fontWeight: 300, fontSize: "clamp(28px, 3.6vw, 56px)", color: "var(--faint)", lineHeight: 1 }}>
                  {e.period.slice(0, 4)}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em" }}>{e.school}</span>
                    <span className="mono" style={{ fontSize: 11, letterSpacing: "0.05em", color: "var(--faint)" }}>{e.period.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 4 }}>{e.program}</div>
                  {"note" in e && e.note && <div className="mono" style={{ fontSize: 11, color: "var(--faint)", marginTop: 8 }}>{e.note}</div>}
                </div>
              </div>
            </Reveal>
          ))}
          <div className="hairline" />

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 32 }}>
            <Magnetic>
              <a href={site.resume.file} target="_blank" rel="noreferrer" className="pill-solid">Full résumé ↗</a>
            </Magnetic>
            <a href={site.resume.file} download className="pill-outline">Download ↓</a>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="mono link-underline" style={{ fontSize: 11.5, letterSpacing: "0.04em", marginLeft: 8, color: "var(--muted)" }}>
              LINKEDIN ↗
            </a>
          </div>
        </div>

        <Reveal delay={0.06}>
          <aside style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {about.body.map((para, i) => (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--muted)", margin: 0 }}>{para}</p>
            ))}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <Tags title="Working on" tags={about.works} />
              <Tags title="Off hours" tags={about.offHours} />
            </div>
            <div className="mono" style={{ fontSize: 11.5, lineHeight: 1.8, color: "var(--faint)", letterSpacing: "0.02em", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
              {about.toolkit.join("  ·  ")}
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function Tags({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tags.map((t) => (
          <span key={t} style={{ fontWeight: 500, fontSize: 16 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
