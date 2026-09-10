import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { DetectionViz } from "@/components/DetectionViz";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "QuantumSight",
  description:
    "QuantumSight makes existing CCTV intelligent — an edge box on top of the cameras a building already has. A founder's log.",
};

const PIPELINE = [
  { n: "01", label: "Existing CCTV", note: "Whatever's already on the wall. RTSP in, no new hardware on the camera side." },
  { n: "02", label: "QS AI Box", note: "An edge device running vision models on the local feed. Nothing leaves the building unless it matters." },
  { n: "03", label: "Cloud inference", note: "Heavier models and cross-camera context for the events that need a second look." },
  { n: "04", label: "Alerts dashboard", note: "What a security team actually watches — events, not 40 live tiles." },
];

export default function QuantumSightPage() {
  const qs = getProject("quantumsight");
  const cs = qs?.caseStudy;

  return (
    <>
      <PageIntro
        eyebrow="The Company"
        title="Making existing cameras intelligent."
        lead="Most buildings already have cameras. Almost none of them have anything that understands what's in frame. QuantumSight is the layer that does — built on top of the CCTV that's already there."
      />

      <section className="wrap" style={{ padding: "0 var(--pad) clamp(64px, 10vw, 120px)" }}>
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.85fr)",
              gap: "clamp(24px, 5vw, 64px)",
              alignItems: "center",
              borderTop: "1px solid var(--line)",
              paddingTop: "clamp(36px, 6vw, 64px)",
            }}
            className="qs-page-split"
          >
            <div>
              <h2 className="sora" style={{ fontWeight: 700, fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.01em", margin: 0 }}>
                The problem
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--muted)", marginTop: 16 }}>
                {cs?.problem}
              </p>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--muted)", marginTop: 14 }}>
                {cs?.approach}
              </p>
            </div>
            <DetectionViz cam="CAM_11 · DOCK" />
          </div>
        </Reveal>
      </section>

      <section style={{ background: "var(--paper-3)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(56px, 9vw, 100px) var(--pad)" }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}>How it works</div>
            <h2 className="sora" style={{ fontWeight: 700, fontSize: "clamp(24px, 3.5vw, 40px)", letterSpacing: "-0.01em", margin: "0 0 40px", maxWidth: 560 }}>
              Four steps between a camera and something worth a person&rsquo;s attention.
            </h2>
          </Reveal>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {PIPELINE.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.05}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: 22, height: "100%" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--accent)", marginBottom: 12 }}>{s.n}</div>
                  <div className="sora" style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.label}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{s.note}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap" style={{ padding: "clamp(56px, 9vw, 100px) var(--pad)" }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Where it is now</div>
          <div style={{ display: "flex", gap: 0, maxWidth: 640, marginBottom: 28 }}>
            {(cs?.stages ?? []).map((s) => (
              <div
                key={s.label}
                className="mono"
                style={{
                  flex: 1,
                  paddingTop: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  borderTop:
                    s.state === "todo"
                      ? "2px dashed rgba(18,18,18,0.2)"
                      : `2px solid ${s.state === "current" ? "var(--accent)" : "rgba(18,18,18,0.75)"}`,
                  color:
                    s.state === "current"
                      ? "var(--accent)"
                      : s.state === "todo"
                        ? "rgba(18,18,18,0.35)"
                        : "rgba(18,18,18,0.75)",
                }}
              >
                {s.label.toUpperCase()}
              </div>
            ))}
          </div>
          {(cs?.notes ?? []).map((n, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: "var(--muted)", margin: "0 0 14px", maxWidth: 620 }}>
              {n}
            </p>
          ))}
          <p className="mono" style={{ fontSize: 12, color: "var(--faint)", marginTop: 20 }}>
            BUILT WITH — {(qs?.tech ?? []).join(" · ").toUpperCase()}
          </p>
        </Reveal>
      </section>

      {/* build log — placeholder scaffold, add entries as you go */}
      <section className="wrap" style={{ padding: "0 var(--pad) clamp(56px, 9vw, 100px)" }}>
        <Reveal>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 36 }}>
            <div className="sora" style={{ fontWeight: 700, fontSize: "clamp(20px, 3vw, 28px)", marginBottom: 8 }}>
              Build log
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 480, margin: "0 0 24px" }}>
              Short notes from building in public. Newest first.
            </p>
            <div className="mono" style={{ fontSize: 13, color: "var(--faint)", border: "1px dashed var(--line-strong)", borderRadius: 14, padding: "20px 22px" }}>
              First entries land soon.
            </div>
          </div>
        </Reveal>
      </section>

      <section className="wrap" style={{ padding: "0 var(--pad) clamp(72px, 12vw, 130px)" }}>
        <Reveal>
          <div style={{ background: "var(--ink)", color: "#fff", borderRadius: 22, padding: "clamp(28px, 5vw, 56px)" }}>
            <h2 className="sora" style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0, maxWidth: 620 }}>
              Have cameras that could be doing more?
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "16px 0 28px", maxWidth: 460 }}>
              We&rsquo;re running early pilots. If you operate a site with existing CCTV and a security team that&rsquo;s drowning in tiles, let&rsquo;s talk.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={`mailto:${site.email}?subject=QuantumSight pilot`} className="mono" style={{ background: "#fff", color: "var(--ink)", padding: "12px 20px", borderRadius: 99, fontWeight: 600, fontSize: 13 }}>
                {site.email} ↗
              </a>
              <Link href="/#work" className="mono" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "12px 20px", borderRadius: 99, fontWeight: 600, fontSize: 13 }}>
                See other builds →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
