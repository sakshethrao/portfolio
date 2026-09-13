import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Magnetic } from "@/components/Magnetic";
import { site } from "@/content/site";
import { roles, earlier, education, certifications } from "@/content/experience";
import type { Role } from "@/lib/types";

export const metadata: Metadata = {
  title: "Résumé",
  description: "View or download Saksheth Rao's CV.",
};

export default function ResumePage() {
  const file = site.resume.file;

  return (
    <>
      <PageIntro
        eyebrow="Résumé"
        title={
          <>
            The <span className="serif-i" style={{ fontSize: "1.1em" }}>short</span> version.
          </>
        }
        lead="The site is the long version. Here's the one page you can print."
      />

      <section data-section="resume" className="wrap" style={{ padding: "0 var(--pad) clamp(72px, 12vw, 130px)" }}>
        {/* document masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--line)", padding: "18px 0", marginBottom: "clamp(32px, 5vw, 56px)" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted-2)" }}>
            {site.name.toUpperCase()} — CV · UPDATED {site.resume.updated} · PDF
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Magnetic>
              <a href={file} target="_blank" rel="noreferrer" className="pill-solid">View ↗</a>
            </Magnetic>
            <a href={file} download className="pill-outline">Download ↓</a>
          </div>
        </div>

        <Section title="Experience">
          {roles.map((r) => (
            <Row key={r.company + r.title} role={r} withPoints />
          ))}
        </Section>

        <Section title="Education">
          {education.map((e) => (
            <div key={e.school} className="timeline-row">
              <div className="mono" style={meta}>{e.period.toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>{e.school}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", margin: "6px 0 0" }}>{e.program}</p>
                {e.note && <p className="mono" style={{ fontSize: 11, color: "var(--faint)", margin: "8px 0 0", letterSpacing: "0.03em" }}>{e.note}</p>}
              </div>
            </div>
          ))}
        </Section>

        <Section title="Also">
          {earlier.map((r) => (
            <Row key={r.company + r.title} role={r} />
          ))}
        </Section>

        <Section title="Certifications">
          <div className="timeline-row">
            <div className="mono" style={meta}>—</div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {certifications.map((c) => (
                <li key={c.name} style={{ fontSize: 14.5, color: "var(--muted)" }}>
                  <span style={{ color: "var(--ink)" }}>{c.name}</span> — {c.issuer}, {c.year}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </section>
    </>
  );
}

const meta: React.CSSProperties = { fontSize: 11, letterSpacing: "0.06em", color: "var(--faint)", paddingTop: 4 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "clamp(32px, 5vw, 56px)" }}>
      <div className="eyebrow" style={{ marginBottom: 4 }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Row({ role: r, withPoints }: { role: Role; withPoints?: boolean }) {
  return (
    <div className="timeline-row">
      <div className="mono" style={meta}>
        {r.period.toUpperCase()}
        {r.location && <span style={{ display: "block", marginTop: 4 }}>{r.location.toUpperCase()}</span>}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 17 }}>
          {r.title} · {r.company}
        </div>
        {r.summary && <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", margin: "8px 0 0", maxWidth: 640 }}>{r.summary}</p>}
        {withPoints && r.points && (
          <ul style={{ margin: "10px 0 0", paddingLeft: 16, fontSize: 14, lineHeight: 1.65, color: "var(--muted-2)", maxWidth: 640 }}>
            {r.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
