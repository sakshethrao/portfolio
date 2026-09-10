import Link from "next/link";
import { getProject } from "@/content/projects";
import { Reveal } from "./Reveal";
import { DetectionViz } from "./DetectionViz";

const PIPELINE = ["Existing CCTV", "QS AI Box", "Cloud inference", "Alerts dashboard"];

export function QuantumSightStrip() {
  const qs = getProject("quantumsight");
  if (!qs) return null;

  return (
    <section
      aria-labelledby="qs-strip-title"
      style={{
        background: "var(--paper-3)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap" style={{ padding: "clamp(64px, 10vw, 110px) var(--pad)" }}>
        <div className="qs-strip-grid">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 16 }}>THE COMPANY</div>
            <h2 id="qs-strip-title" className="sora" style={{ fontWeight: 800, fontSize: "clamp(34px, 5.5vw, 66px)", lineHeight: 1.02, letterSpacing: "-0.02em", margin: 0 }}>
              QuantumSight
            </h2>
            <p className="sora" style={{ fontWeight: 500, fontSize: "clamp(17px, 2.4vw, 24px)", lineHeight: 1.35, color: "var(--muted)", margin: "16px 0 0", maxWidth: 460 }}>
              Making the cameras that already exist intelligent.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted)", margin: "20px 0 0", maxWidth: 440 }}>
              An edge box on top of existing CCTV — no rip-and-replace — turning raw footage into events a security team can act on. Built in the open, one pilot at a time.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/quantumsight" className="mono pill-solid">Go inside QuantumSight →</Link>
              <a href="/#contact" className="mono pill-outline">Talk about a pilot ↗</a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <DetectionViz cam="CAM_04 · LOBBY" />
              <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {PIPELINE.map((step, i) => (
                  <li key={step} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px" }}>
                    <div className="mono" style={{ fontSize: 10, color: "var(--faint)", marginBottom: 4 }}>{String(i + 1).padStart(2, "0")}</div>
                    <div className="sora" style={{ fontWeight: 600, fontSize: 13 }}>{step}</div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
