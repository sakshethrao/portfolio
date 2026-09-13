import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { Magnetic } from "@/components/Magnetic";
import { CameraStage } from "@/components/quantumsight/CameraStage";
import { ShotViewer, type Shot } from "@/components/quantumsight/ShotViewer";
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

const SHOTS: Shot[] = [
  { key: "feed", label: "Live feed", src: "/quantumsight/feed-crop.jpg", w: 1202, h: 535, caption: "Live feed — every camera, detections drawn in real time" },
  { key: "analysis", label: "Analysis", src: "/quantumsight/analysis-crop.jpg", w: 1202, h: 535, caption: "Per-camera analysis with the model set that's running" },
  { key: "config", label: "Config", src: "/quantumsight/config-crop.jpg", w: 1204, h: 466, caption: "Detection models and confidence thresholds, per site" },
];

export default function QuantumSightPage() {
  const qs = getProject("quantumsight");
  const cs = qs?.caseStudy;

  return (
    <>
      <PageIntro
        eyebrow="The Company"
        title={
          <>
            Making existing cameras <span className="serif-i" style={{ fontSize: "1.1em" }}>intelligent</span>.
          </>
        }
        lead="Buildings already have the cameras. QuantumSight is the layer that understands what they see."
        aside={<CameraStage />}
      />

      {/* the problem */}
      <section className="wrap" style={{ padding: "clamp(24px, 4vw, 48px) var(--pad) clamp(56px, 9vw, 100px)" }}>
        <Reveal>
          <div className="grid-12" style={{ borderTop: "1px solid var(--line)", paddingTop: "clamp(28px, 4vw, 48px)", rowGap: 20 }}>
            <div className="eyebrow qs-label" style={{ gridColumn: "1 / span 12" }}>The problem</div>
            <div className="qs-body" style={{ gridColumn: "1 / span 12" }}>
              <p className="display" style={{ fontSize: "clamp(22px, 3vw, 40px)", fontWeight: 400, lineHeight: 1.1, margin: 0, maxWidth: 640 }}>
                Footage only matters after something has already gone wrong.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--muted)", marginTop: 18, maxWidth: 520 }}>{cs?.approach}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* the real product */}
      <section style={{ background: "var(--ink-2)", color: "#fff" }}>
        <div className="wrap" style={{ padding: "clamp(56px, 8vw, 100px) var(--pad)" }}>
          <Reveal>
            <div className="grid-12" style={{ rowGap: 16, marginBottom: 36, alignItems: "end" }}>
              <div style={{ gridColumn: "1 / span 12" }} className="qs-body">
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>What it sees</div>
                <h2 className="display" style={{ fontWeight: 500, fontSize: "clamp(30px, 4.6vw, 68px)", margin: 0 }}>
                  Running today, against real feeds.
                </h2>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <ShotViewer shots={SHOTS} />
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="wrap" style={{ padding: "clamp(56px, 8vw, 100px) var(--pad)" }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 14 }}>How it works</div>
          <h2 className="display" style={{ fontWeight: 500, fontSize: "clamp(30px, 4.6vw, 68px)", margin: "0 0 36px" }}>
            Four steps, camera to alert.
          </h2>
          <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", fontSize: "clamp(13px, 1.3vw, 17px)", letterSpacing: "0.02em", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "22px 0" }}>
            {PIPELINE.map((s, i) => (
              <span key={s.n} style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
                <span style={{ fontWeight: 500 }}>{s.label}</span>
                {i < PIPELINE.length - 1 && <span style={{ color: "var(--faint)" }}>→</span>}
              </span>
            ))}
          </div>
        </Reveal>
        <div>
          {PIPELINE.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.03}>
              <div className="timeline-row" style={{ padding: "18px 0", borderTop: i === 0 ? 0 : undefined }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--accent)" }}>{s.n}</div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)", gap: 20 }} className="resume-row">
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{s.label}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{s.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* where it is now */}
      <section className="wrap" style={{ padding: "0 var(--pad) clamp(56px, 8vw, 100px)" }}>
        <Reveal>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "clamp(28px, 5vw, 48px)" }}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Where it is now</div>
            <div style={{ display: "flex", maxWidth: 640, marginBottom: 22 }}>
              {(cs?.stages ?? []).map((s) => (
                <div
                  key={s.label}
                  className="mono"
                  style={{
                    flex: 1,
                    paddingTop: 10,
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    borderTop:
                      s.state === "todo" ? "1px dashed rgba(18,18,18,0.25)" : `2px solid ${s.state === "current" ? "var(--accent)" : "rgba(18,18,18,0.8)"}`,
                    color: s.state === "current" ? "var(--accent)" : s.state === "todo" ? "rgba(18,18,18,0.35)" : "rgba(18,18,18,0.8)",
                  }}
                >
                  {s.label.toUpperCase()}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--muted)", margin: 0, maxWidth: 520 }}>{cs?.outcome}</p>
            <p className="mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--faint)", marginTop: 20 }}>
              BUILT WITH — {(qs?.tech ?? []).join(" · ").toUpperCase()}
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA — a full-bleed ink band */}
      <section style={{ background: "var(--ink)", color: "#fff" }}>
        <div className="wrap" style={{ padding: "clamp(56px, 9vw, 120px) var(--pad)" }}>
          <Reveal>
            <h2 className="display" style={{ fontWeight: 500, fontSize: "clamp(34px, 6vw, 92px)", margin: 0, maxWidth: 900 }}>
              Cameras that could be doing <span className="serif-i" style={{ fontSize: "1.08em" }}>more</span>?
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", margin: "18px 0 30px", maxWidth: 400 }}>Running early pilots now.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Magnetic>
                <a href={`mailto:${site.email}?subject=QuantumSight pilot`} className="pill-solid" style={{ background: "#fff", color: "var(--ink)", borderColor: "#fff" }}>
                  {site.email} ↗
                </a>
              </Magnetic>
              <Link href="/#builds" className="pill-outline" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}>
                See other builds →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <style>{`
        @media (min-width: 900px) {
          .qs-label { grid-column: 1 / span 3 !important; }
          .qs-body { grid-column: 4 / span 9 !important; }
        }
      `}</style>
    </>
  );
}
