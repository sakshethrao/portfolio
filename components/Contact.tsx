import { site } from "@/content/site";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="wrap" style={{ padding: "clamp(72px, 12vw, 130px) var(--pad)" }}>
      <Reveal>
        <div className="eyebrow" style={{ marginBottom: 18 }}>CONTACT</div>
        <h2 className="sora" style={{ fontWeight: 800, fontSize: "clamp(34px, 6vw, 68px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, maxWidth: 780 }}>
          Building something, or want to?
        </h2>
        <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: "var(--muted)", margin: "20px 0 0", maxWidth: 460 }}>
          QuantumSight pilots, a project you want a hand with, or just to compare notes — the inbox is open.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32, alignItems: "center" }}>
          <a href={`mailto:${site.email}`} className="mono pill-solid" style={{ fontSize: 14, padding: "13px 22px" }}>
            {site.email} ↗
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="mono pill-outline">
            LinkedIn ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
