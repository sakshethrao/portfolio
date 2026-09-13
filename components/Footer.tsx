import { site } from "@/content/site";
import { photos } from "@/content/gallery";
import { AccentSwatches } from "./AccentSwatches";

/** one ruled line. LinkedIn is a link; Instagram is a handle with a peek. */
export function Footer() {
  const year = new Date().getFullYear();
  const peek = photos.filter((p) => p.src).slice(0, 3);
  const handle = site.socials.instagram.replace(/\/$/, "").split("/").pop();

  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div
        className="wrap mono"
        style={{
          paddingTop: 22,
          paddingBottom: 26,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          fontSize: 11,
          letterSpacing: "0.05em",
          color: "var(--muted-2)",
        }}
      >
        <span>© {year} {site.name.toUpperCase()} · STILL BUILDING.</span>

        <span style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="link-underline">LINKEDIN ↗</a>
          <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="link-underline ig-peek" style={{ position: "relative" }}>
            @{handle}
            {peek.length > 0 && (
              <span className="ig-strip" aria-hidden>
                {peek.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.src} src={p.src} alt="" width={56} height={56} style={{ objectFit: "cover", display: "block" }} />
                ))}
              </span>
            )}
          </a>
          <a href={site.socials.github} target="_blank" rel="noreferrer" className="link-underline">GITHUB ↗</a>
          <a href={`mailto:${site.email}`} className="link-underline">EMAIL ↗</a>
          <AccentSwatches />
        </span>

        <span style={{ color: "var(--faint)" }}>{site.builtWith}</span>
      </div>
      <style>{`
        .ig-strip { position: absolute; left: 0; bottom: calc(100% + 10px); display: flex; gap: 4px; opacity: 0; transform: translateY(6px); transition: opacity .25s var(--ease), transform .25s var(--ease); pointer-events: none; }
        .ig-peek:hover .ig-strip { opacity: 1; transform: translateY(0); }
      `}</style>
    </footer>
  );
}
