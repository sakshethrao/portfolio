import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageIntro({
  eyebrow,
  title,
  lead,
  back = { href: "/", label: "← Home" },
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  back?: { href: string; label: string };
  /** optional right-hand column (a visual) on desktop */
  aside?: ReactNode;
}) {
  return (
    <header className="wrap" style={{ padding: "clamp(96px, 15vh, 160px) var(--pad) clamp(28px, 5vw, 56px)" }}>
      <div className="grid-12" style={{ rowGap: 32, alignItems: "center" }}>
        <Reveal style={{ gridColumn: aside ? "1 / span 12" : "1 / span 12" }} className={aside ? "intro-text" : undefined}>
          <Link href={back.href} className="mono link-underline" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted-2)" }}>
            {back.label.toUpperCase()}
          </Link>
          <div className="eyebrow" style={{ marginTop: 28, marginBottom: 16 }}>{eyebrow}</div>
          <h1 className="display" style={{ fontWeight: 500, fontSize: "clamp(40px, 7vw, 108px)", margin: 0, maxWidth: 1000 }}>
            {title}
          </h1>
          {lead && (
            <p style={{ fontSize: "clamp(16px, 1.6vw, 21px)", lineHeight: 1.5, color: "var(--muted)", margin: "24px 0 0", maxWidth: 560 }}>
              {lead}
            </p>
          )}
        </Reveal>
        {aside && (
          <div style={{ gridColumn: "1 / span 12", minWidth: 0 }} className="intro-aside">
            {aside}
          </div>
        )}
      </div>
      {aside && (
        <style>{`
          @media (min-width: 900px) {
            .intro-text { grid-column: 1 / span 7 !important; }
            .intro-aside { grid-column: 8 / span 5 !important; }
          }
        `}</style>
      )}
    </header>
  );
}
