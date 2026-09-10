import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { DetectionViz } from "@/components/DetectionViz";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "QuantumSight",
  description:
    "QuantumSight makes existing CCTV cameras understand what they see — an edge box on top of the hardware a building already has.",
};

const PIPELINE = [
  { n: "01", label: "Existing CCTV", note: "RTSP in. No new hardware on the camera." },
  { n: "02", label: "QS AI Box", note: "Edge inference on the local feed." },
  { n: "03", label: "Cloud", note: "Heavier models for the events that need a second look." },
  { n: "04", label: "Alerts", note: "Events a security team can act on — not 40 live tiles." },
];

const SHOTS = [
  { src: "/quantumsight/feed.jpg", w: 1202, h: 605, caption: "Live feed — every camera, detections drawn in real time" },
  { src: "/quantumsight/analysis.jpg", w: 1202, h: 605, caption: "Per-camera analysis with the model set that's running" },
  { src: "/quantumsight/config.jpg", w: 1204, h: 536, caption: "Detection models and confidence thresholds, per site" },
];

export default function QuantumSightPage() {
  const qs = getProject("quantumsight");
  const cs = qs?.caseStudy;

  return (
    <>
      <PageIntro
        eyebrow="The Company"
        title="Making existing cameras intelligent."
        lead="Buildings already have the cameras. QuantumSight is the layer that understands what they see."
      />

      <section className="wrap" style={{ padding: "0 var(--pad) clamp(56px, 9vw, 100px)" }}>
        <Reveal>
          <div
            className="qs-page-split"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.8fr)",
              gap: "clamp(24px, 5vw, 56px)",
              alignItems: "center",
              borderTop: "1px solid var(--line)",
              paddingTop: "clamp(32px, 6vw, 56px)",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>The problem</div>
              <p className="sora" style={{ fontSize: "clamp(18px, 2.6vw, 26px)", fontWeight: 500, lineHeight: 1.35, color: "var(--ink)", margin: 0, maxWidth: 420 }}>
                Footage only matters after something has already gone wrong.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted)", marginTop: 16, maxWidth: 420 }}>
                {cs?.approach}
              </p>
            </div>
            <DetectionViz />
          </div>
        </Reveal>
      </section>

      {/* real product */}
      <section style={{ background: "var(--paper-3)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "clamp(48px, 8vw, 88px) var(--pad)" }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 12 }}>The dashboard</div>
            <h2 className="sora" style={{ fontWeight: 700, fontSize: "clamp(22px, 3vw, 34px)", letterSpacing: "-0.01em", margin: "0 0 32px", maxWidth: 460 }}>
              Running today, against real feeds.
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 4vw, 40px)" }}>
            {SHOTS.map((shot, i) => (
              <Reveal key={shot.src} delay={i * 0.04}>
                <figure style={{ margin: 0 }}>
                  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)", background: "#0d0f10" }}>
                    <Image
                      src={shot.src}
                      alt={shot.caption}
                      width={shot.w}
                      height={shot.h}
                      sizes="(max-width: 1000px) 100vw, 900px"
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  </div>
                  <figcaption className="mono" style={{ fontSize: 11, color: "var(--faint)", marginTop: 8, letterSpacing: "0.02em" }}>
                    {shot.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="wrap" style={{ padding: "clamp(48px, 8vw, 88px) var(--pad)" }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 12 }}>How it works</div>
          <h2 className="sora" style={{ fontWeight: 700, fontSize: "clamp(22px, 3vw, 34px)", letterSpacing: "-0.01em", margin: "0 0 32px", maxWidth: 440 }}>
            Four steps, camera to alert.
          </h2>
        </Reveal>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {PIPELINE.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.05}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: 20, height: "100%" }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--accent)", marginBottom: 10 }}>{s.n}</div>
                <div className="sora" style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.label}</div>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>{s.note}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* where it is now */}
      <section className="wrap" style={{ padding: "0 var(--pad) clamp(48px, 8vw, 88px)" }}>
        <Reveal>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "clamp(32px, 6vw, 48px)" }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Where it is now</div>
            <div style={{ display: "flex", gap: 0, maxWidth: 560, marginBottom: 20 }}>
              {(cs?.stages ?? []).map((s) => (
                <div
                  key={s.label}
                  className="mono"
                  style={{
                    flex: 1,
                    paddingTop: 10,
                    fontSize: 10.5,
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
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted)", margin: 0, maxWidth: 460 }}>
              {cs?.outcome}
            </p>
            <p className="mono" style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 18 }}>
              BUILT WITH — {(qs?.tech ?? []).join(" · ").toUpperCase()}
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="wrap" style={{ padding: "0 var(--pad) clamp(64px, 12vw, 120px)" }}>
        <Reveal>
          <div style={{ background: "var(--ink)", color: "#fff", borderRadius: 22, padding: "clamp(28px, 5vw, 52px)" }}>
            <h2 className="sora" style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0, maxWidth: 520 }}>
              Cameras that could be doing more?
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "14px 0 26px", maxWidth: 400 }}>
              Running early pilots now.
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
