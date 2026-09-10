import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 40 }}>
      <div
        className="wrap"
        style={{
          paddingTop: 44,
          paddingBottom: 44,
          display: "flex",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 300 }}>
          <div className="sora" style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
            {site.name}
          </div>
          <p className="mono" style={{ fontSize: 11, lineHeight: 1.7, color: "var(--faint)", margin: "10px 0 0", letterSpacing: "0.02em" }}>
            {site.builtWith}
          </p>
        </div>

        <div className="mono" style={{ display: "flex", gap: 44, flexWrap: "wrap", fontSize: 12 }}>
          <FooterCol title="Site">
            <Link href="/#work" className="link-underline">Builds</Link>
            <Link href="/#lab" className="link-underline">Lab</Link>
            <Link href="/quantumsight" className="link-underline">QuantumSight</Link>
            <Link href="/gallery" className="link-underline">Travel</Link>
            <Link href="/resume" className="link-underline">Résumé</Link>
          </FooterCol>
          <FooterCol title="Elsewhere">
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn ↗</a>
            {site.socials.instagram && (
              <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="link-underline">Instagram ↗</a>
            )}
            <a href={site.socials.github} target="_blank" rel="noreferrer" className="link-underline">GitHub ↗</a>
            <a href={`mailto:${site.email}`} className="link-underline">Email ↗</a>
          </FooterCol>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 32 }}>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.03em" }}>
          © {year} {site.name} · Still building.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ color: "var(--muted-2)", letterSpacing: "0.04em", marginBottom: 2 }}>{title.toUpperCase()}</div>
      {children}
    </div>
  );
}
