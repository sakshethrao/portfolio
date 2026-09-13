import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

export function Contact() {
  return (
    <section id="contact" data-section="contact" className="wrap" style={{ padding: "clamp(80px, 12vw, 160px) var(--pad) clamp(72px, 10vw, 130px)", borderTop: "1px solid var(--line)" }}>
      <Reveal>
        <div className="eyebrow" style={{ marginBottom: 22 }}>Contact</div>
        <h2 className="display" style={{ fontWeight: 500, fontSize: "clamp(40px, 8vw, 128px)", margin: 0, maxWidth: 1100 }}>
          Building something,<br />or <span className="serif-i" style={{ fontSize: "1.08em" }}>want</span> to?
        </h2>
        <div className="grid-12" style={{ marginTop: "clamp(28px, 4vw, 48px)", rowGap: 24, alignItems: "center" }}>
          <p style={{ gridColumn: "1 / span 12", fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.5, color: "var(--muted)", margin: 0, maxWidth: 440 }} className="contact-note">
            QuantumSight pilots, a project you want a hand with, or just to compare notes — the inbox is open.
          </p>
          <div style={{ gridColumn: "1 / span 12", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }} className="contact-actions">
            <Magnetic>
              <a href={`mailto:${site.email}`} className="pill-solid" style={{ fontSize: 13.5, padding: "14px 22px" }}>
                {site.email} ↗
              </a>
            </Magnetic>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="pill-outline">LinkedIn ↗</a>
          </div>
        </div>
      </Reveal>
      <style>{`
        @media (min-width: 900px) {
          .contact-note { grid-column: 1 / span 5 !important; }
          .contact-actions { grid-column: 7 / span 6 !important; }
        }
      `}</style>
    </section>
  );
}
