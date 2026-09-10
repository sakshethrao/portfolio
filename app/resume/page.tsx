import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/content/site";
import { roles } from "@/content/experience";

export const metadata: Metadata = {
  title: "Résumé",
  description: "View or download Saksheth Rao's résumé.",
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
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
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

        {/* quick-glance timeline so the page is useful even before the PDF loads */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 28, marginBottom: 40 }}>
          {roles.map((r) => (
            <div
              key={r.company + r.title}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 20,
                padding: "18px 0",
                borderBottom: "1px solid var(--line)",
              }}
              className="resume-row"
            >
              <div className="mono" style={{ fontSize: 12, color: "var(--faint)" }}>{r.period}</div>
              <div>
                <div className="sora" style={{ fontWeight: 700, fontSize: 16 }}>
                  {r.title} · {r.company}
                </div>
                {r.summary && (
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", margin: "6px 0 0" }}>{r.summary}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 16,
            overflow: "hidden",
            background: "var(--paper-3)",
          }}
        >
          <object data={file} type="application/pdf" width="100%" style={{ height: "min(80vh, 1000px)", display: "block" }}>
            <div className="mono" style={{ padding: 40, textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
              Your browser can&rsquo;t preview PDFs inline.{" "}
              <a href={file} className="link-underline" style={{ color: "var(--ink)" }}>
                Open the résumé ↗
              </a>
              <br />
              <span style={{ fontSize: 11, color: "var(--faint)" }}>
                (Drop the file at <code>public{file}</code> to enable the preview.)
              </span>
            </div>
          </object>
        </div>
      </section>
    </>
  );
}
