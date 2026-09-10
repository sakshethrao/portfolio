import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap" style={{ minHeight: "70svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px var(--pad)" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>404</div>
      <h1 className="sora" style={{ fontWeight: 800, fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: "-0.02em", margin: 0 }}>
        Nothing built here.
      </h1>
      <p style={{ fontSize: 17, color: "var(--muted)", margin: "18px 0 28px", maxWidth: 420 }}>
        This page doesn&rsquo;t exist — or hasn&rsquo;t been built yet.
      </p>
      <Link href="/" className="mono pill-solid" style={{ alignSelf: "flex-start" }}>
        ← Back home
      </Link>
    </section>
  );
}
