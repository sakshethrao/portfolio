import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/content/site";
import {
  roles,
  earlier,
  education,
  certifications,
} from "@/content/experience";
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
        title="The short version."
        lead="The site is the long version. Here's the one page you can print."
      />

      <section className="wrap" style={{ padding: "0 var(--pad) clamp(72px, 12vw, 130px)" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
          <a href={file} target="_blank" rel="noreferrer" className="mono pill-solid">
            View PDF ↗
          </a>
          <a href={file} download className="mono pill-outline">
            Download ↓
          </a>
          <span className="mono" style={{ alignSelf: "center", fontSize: 11, color: "var(--faint)" }}>
            Updated {site.resume.updated}
          </span>
        </div>

        <Section title="Experience">
          {roles.map((r) => (
            <Row key={r.company + r.title} role={r} withPoints />
          ))}
        </Section>

        <Section title="Education">
          {education.map((e) => (
            <div key={e.school} className="resume-row" style={rowStyle}>
              <div className="mono" style={metaStyle}>{e.period}</div>
              <div>
                <div className="sora" style={{ fontWeight: 700, fontSize: 16 }}>{e.school}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", margin: "6px 0 0" }}>
                  {e.program}
                </p>
                {e.note && (
                  <p className="mono" style={{ fontSize: 11.5, color: "var(--faint)", margin: "6px 0 0" }}>
                    {e.note}
                  </p>
                )}
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
          <div className="resume-row" style={{ ...rowStyle, borderBottom: 0 }}>
            <div className="mono" style={metaStyle}>—</div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {certifications.map((c) => (
                <li key={c.name} style={{ fontSize: 14, color: "var(--muted)" }}>
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

const rowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "150px 1fr",
  gap: 20,
  padding: "18px 0",
  borderBottom: "1px solid var(--line)",
};
const metaStyle: React.CSSProperties = { fontSize: 12, color: "var(--faint)" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{title}</div>
      <div style={{ borderTop: "1px solid var(--line)" }}>{children}</div>
    </div>
  );
}

function Row({ role: r, withPoints }: { role: Role; withPoints?: boolean }) {
  return (
    <div className="resume-row" style={rowStyle}>
      <div className="mono" style={metaStyle}>{r.period}</div>
      <div>
        <div className="sora" style={{ fontWeight: 700, fontSize: 16 }}>
          {r.title} · {r.company}
        </div>
        {r.location && (
          <div className="mono" style={{ fontSize: 11, color: "var(--faint)", marginTop: 2 }}>{r.location}</div>
        )}
        {r.summary && (
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", margin: "8px 0 0" }}>{r.summary}</p>
        )}
        {withPoints && r.points && (
          <ul style={{ margin: "8px 0 0", paddingLeft: 16, fontSize: 13.5, lineHeight: 1.65, color: "var(--muted-2)" }}>
            {r.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
