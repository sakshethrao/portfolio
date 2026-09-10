import { site } from "@/content/site";
import { Ticker } from "./Ticker";
import { AccentSwatches } from "./AccentSwatches";

export function Hero() {
  return (
    <section
      id="home"
      className="wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "clamp(48px, 12vh, 132px)",
        paddingBottom: "clamp(24px, 5vh, 44px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 26,
          paddingBottom: "clamp(28px, 7vh, 84px)",
          maxWidth: 940,
        }}
      >
        <div
          className="mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontWeight: 600,
            fontSize: 11.5,
            letterSpacing: "0.03em",
            color: "var(--muted-2)",
          }}
        >
          <span
            className="blink"
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          {site.nowBuilding}
        </div>

        <h1
          className="sora"
          style={{
            fontWeight: 800,
            fontSize: "clamp(44px, 7vw, 88px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          I like building things.
        </h1>

        <p
          style={{
            fontSize: "clamp(18px, 2.2vw, 23px)",
            lineHeight: 1.5,
            color: "rgba(18,18,18,0.68)",
            margin: 0,
            maxWidth: 680,
          }}
        >
          {site.intro}
        </p>

        <Ticker items={site.thoughts} />

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginTop: 6,
            alignItems: "center",
          }}
        >
          <a href={`mailto:${site.email}`} className="mono pill-outline">
            Email me
          </a>
          <a href="/resume" className="mono pill-outline">
            Résumé ↓
          </a>
          <a href="#work" className="mono pill-outline">
            See the work ↓
          </a>
          <AccentSwatches />
        </div>
      </div>

      <div
        className="mono"
        style={{
          borderTop: "1px solid var(--line)",
          paddingTop: 16,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: "0.02em",
          color: "var(--faint)",
        }}
      >
        <span>SCROLL FOR THE WORK ↓</span>
        <span>{site.builtWith}</span>
      </div>
    </section>
  );
}
