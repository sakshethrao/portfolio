import Link from "next/link";
import { Reveal } from "./Reveal";

export function PageIntro({
  eyebrow,
  title,
  lead,
  back = { href: "/", label: "← Home" },
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  back?: { href: string; label: string };
}) {
  return (
    <header className="wrap" style={{ padding: "clamp(48px, 9vw, 100px) var(--pad) clamp(28px, 5vw, 48px)" }}>
      <Reveal>
        <Link href={back.href} className="mono link-underline" style={{ fontSize: 12, color: "var(--muted-2)" }}>
          {back.label}
        </Link>
        <div className="eyebrow" style={{ marginTop: 26, marginBottom: 14 }}>{eyebrow}</div>
        <h1 className="sora" style={{ fontWeight: 800, fontSize: "clamp(36px, 6vw, 74px)", lineHeight: 1.03, letterSpacing: "-0.02em", margin: 0, maxWidth: 900 }}>
          {title}
        </h1>
        {lead && (
          <p style={{ fontSize: "clamp(16px, 2.2vw, 21px)", lineHeight: 1.55, color: "var(--muted)", margin: "22px 0 0", maxWidth: 620 }}>
            {lead}
          </p>
        )}
      </Reveal>
    </header>
  );
}
