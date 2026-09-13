import Link from "next/link";
import Image from "next/image";
import { photos, galleryIntro } from "@/content/gallery";
import { Reveal } from "./Reveal";

/** a slow drift of photos, edge to edge — the door into the journal */
export function Journal() {
  const list = photos.slice(0, 6);
  const strip = [...list, ...list]; // doubled for a seamless loop

  return (
    <section id="journal" data-section="travel" style={{ padding: "clamp(40px, 6vw, 80px) 0 clamp(64px, 9vw, 120px)", borderTop: "1px solid var(--line)", overflow: "hidden" }}>
      <div className="wrap">
        <Reveal>
          <div className="grid-12" style={{ alignItems: "end", rowGap: 14, marginBottom: 36 }}>
            <div style={{ gridColumn: "1 / span 12" }} className="journal-head">
              <div className="eyebrow" style={{ marginBottom: 14 }}>Travel</div>
              <h2 className="display" style={{ fontWeight: 500, fontSize: "clamp(36px, 5.6vw, 84px)", margin: 0 }}>
                A photo <span className="serif-i" style={{ fontSize: "1.1em" }}>journal</span>.
              </h2>
            </div>
            <div style={{ gridColumn: "1 / span 12" }} className="journal-note">
              <p style={{ fontSize: 15, lineHeight: 1.5, color: "var(--muted)", margin: "0 0 14px", maxWidth: 320 }}>{galleryIntro}</p>
              <Link href="/gallery" className="mono link-underline" style={{ fontSize: 11.5, letterSpacing: "0.05em" }}>OPEN THE JOURNAL →</Link>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="journal-drift" style={{ display: "flex", gap: 18, width: "max-content", animation: "journal-drift 60s linear infinite" }}>
        {strip.map((p, i) => {
          const h = 240;
          const w = Math.round((h * (p.width ?? 4)) / (p.height ?? 3));
          return (
            <figure key={i} style={{ margin: 0, flex: "none", width: w, marginTop: i % 3 === 1 ? 26 : 0 }} aria-hidden={i >= list.length}>
              <div style={{ position: "relative", width: w, height: h, background: "var(--paper-3)", overflow: "hidden" }}>
                {p.src ? (
                  <Image src={p.src} alt={p.place} fill sizes="400px" style={{ objectFit: "cover" }} />
                ) : (
                  <span className="mono" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 10, letterSpacing: "0.1em", color: "var(--faint)" }}>PHOTO</span>
                )}
              </div>
              {(p.location || p.date) && (
                <figcaption className="mono" style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 8, letterSpacing: "0.04em" }}>
                  {[p.location, p.date].filter(Boolean).join(" · ")}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      <style>{`
        @keyframes journal-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .journal-drift:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .journal-drift { animation: none !important; } }
        @media (min-width: 900px) {
          .journal-head { grid-column: 1 / span 7 !important; }
          .journal-note { grid-column: 9 / span 4 !important; }
        }
      `}</style>
    </section>
  );
}
