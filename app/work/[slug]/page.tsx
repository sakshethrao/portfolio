import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { SpreadDevice } from "@/components/builds/SpreadDevice";
import { SpreadBrowser } from "@/components/builds/SpreadBrowser";
import { SpreadLedger } from "@/components/builds/SpreadLedger";
import { SpreadSmall } from "@/components/builds/SpreadSmall";
import { projects, getProject, publicProjects } from "@/content/projects";

export function generateStaticParams() {
  return projects.filter((p) => !p.private && p.slug !== "quantumsight").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || p.private) notFound();
  if (p.slug === "quantumsight") notFound(); // has its own page

  const index = publicProjects.findIndex((x) => x.slug === p.slug) + 1;
  const cs = p.caseStudy;

  return (
    <>
      <div className="wrap" style={{ paddingTop: "clamp(84px, 12vh, 120px)" }}>
        <Link href="/#builds" className="mono link-underline" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted-2)" }}>
          ← ALL BUILDS
        </Link>
      </div>

      {/* the same spread as on the index — you've zoomed in, not moved */}
      {p.layout === "device" && <SpreadDevice project={p} index={index} detail />}
      {p.layout === "browser" && <SpreadBrowser project={p} index={index} detail />}
      {p.layout === "compact" && <SpreadLedger project={p} index={index} detail />}
      {(p.layout === "panel" || p.layout === "terminal") && <SpreadSmall project={p} index={index} detail />}

      <section className="wrap" style={{ padding: "0 var(--pad) clamp(64px, 10vw, 120px)" }}>
        <div style={{ borderTop: "1px solid var(--ink)" }}>
          {cs?.problem && <Block label="The problem" body={cs.problem} />}
          {cs?.approach && <Block label="What I built" body={cs.approach} />}
          {cs?.outcome && <Block label="Where it stands" body={cs.outcome} />}
          {cs?.notes?.map((n, i) => (
            <Block key={i} label={i === 0 ? "Notes" : ""} body={n} muted />
          ))}
          {!cs && <Block label="Write-up" body="A full write-up for this one is on the way." muted />}
        </div>
      </section>

      <NextProjects slug={p.slug} />
    </>
  );
}

function Block({ label, body, muted }: { label: string; body: string; muted?: boolean }) {
  return (
    <Reveal>
      <div className="timeline-row" style={{ borderTop: label ? undefined : 0, paddingTop: label ? undefined : 0 }}>
        <div className="eyebrow" style={{ paddingTop: 6 }}>{label}</div>
        <p style={{ fontSize: muted ? 15.5 : "clamp(17px, 1.6vw, 22px)", lineHeight: muted ? 1.65 : 1.5, color: muted ? "var(--muted)" : "var(--ink)", margin: 0, maxWidth: 720 }}>
          {body}
        </p>
      </div>
    </Reveal>
  );
}

function NextProjects({ slug }: { slug: string }) {
  const others = publicProjects.filter((p) => p.slug !== slug);
  if (!others.length) return null;
  return (
    <section className="wrap" style={{ padding: "0 var(--pad) clamp(72px, 12vw, 130px)" }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>More builds</div>
      <div>
        {others.map((o) => (
          <Link
            key={o.slug}
            href={o.slug === "quantumsight" ? "/quantumsight" : `/work/${o.slug}`}
            className="timeline-row"
            style={{ padding: "18px 0", alignItems: "baseline" }}
          >
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--faint)" }}>{o.period.toUpperCase()}</span>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <span className="display" style={{ fontWeight: 500, fontSize: "clamp(22px, 2.6vw, 34px)" }}>{o.title}</span>
              <span style={{ fontSize: 14, color: "var(--muted)", maxWidth: 420 }}>{o.tagline}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
