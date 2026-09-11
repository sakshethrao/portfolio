import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { StatusBadge } from "@/components/StatusBadge";
import { ProjectPhone } from "@/components/work/ProjectPhone";
import { ParchiDemo } from "@/components/parchi/ParchiDemo";
import { MakeFlow } from "@/components/make/MakeFlow";
import { projects, getProject, publicProjects } from "@/content/projects";

export function generateStaticParams() {
  return projects
    .filter((p) => !p.private && p.slug !== "quantumsight")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || p.private) notFound();
  // QuantumSight has its own dedicated page
  if (p.slug === "quantumsight") notFound();

  const cs = p.caseStudy;

  return (
    <>
      <PageIntro
        eyebrow={p.category}
        title={p.title}
        lead={p.tagline}
        back={{ href: "/#work", label: "← All builds" }}
      />

      <section className="wrap" style={{ padding: "0 var(--pad) clamp(64px, 10vw, 120px)" }}>
        <Reveal>
          <div
            className="mono"
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
              padding: "18px 0",
              fontSize: 12,
              color: "var(--muted-2)",
              marginBottom: 40,
            }}
          >
            <StatusBadge status={p.status} />
            <span>{p.period}</span>
            <span style={{ color: "var(--faint)" }}>{p.tech.join(" · ")}</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="link-underline" style={{ color: "var(--ink)" }}>
                  Live ↗
                </a>
              )}
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="link-underline" style={{ color: "var(--ink)" }}>
                  Code ↗
                </a>
              )}
            </span>
          </div>
        </Reveal>

        {p.slug === "parchi" && (
          <Reveal>
            <div style={{ marginBottom: 40 }}>
              <ParchiDemo />
              <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.04em" }}>
                LIVE DEMO — DROP THE RECEIPT, THEN CHECK THE DASHBOARD
              </span>
            </div>
          </Reveal>
        )}

        {p.slug === "influencer-payment-os" && (
          <Reveal>
            <div style={{ marginBottom: 40 }}>
              <MakeFlow />
              <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.04em" }}>
                LIVE DEMO — HIT RUN ONCE, WATCH IT MOVE THROUGH THE SCENARIO
              </span>
            </div>
          </Reveal>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: p.layout === "device" ? "minmax(0, 0.8fr) minmax(0, 1fr)" : "1fr",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "start",
          }}
          className={p.layout === "device" ? "qs-page-split" : undefined}
        >
          {p.layout === "device" && (
            <Reveal>
              <div className="device-stage" style={{ position: "sticky", top: 90 }}>
                <ProjectPhone project={p} />
                {p.slug === "nurture" && (
                  <span className="mono" style={{ fontSize: 10, color: "var(--faint)", letterSpacing: "0.04em" }}>
                    LIVE PREVIEW — TAP THE BOTTOM BAR
                  </span>
                )}
              </div>
            </Reveal>
          )}

          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>
              {cs?.problem && <Block label="The problem" body={cs.problem} />}
              {cs?.approach && <Block label="What I built" body={cs.approach} />}
              {cs?.outcome && <Block label="Where it stands" body={cs.outcome} />}
              {cs?.notes?.map((n, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: "var(--muted)", margin: 0 }}>{n}</p>
              ))}
              {!cs && (
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--muted)", margin: 0 }}>
                  A full write-up for this one is on the way.
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {p.image && p.layout !== "device" && (
          <Reveal>
            <div style={{ marginTop: 48, borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", position: "relative", aspectRatio: "16 / 10" }}>
              <Image src={p.image} alt={p.title} fill sizes="(max-width: 1280px) 100vw, 1180px" style={{ objectFit: "cover" }} />
            </div>
          </Reveal>
        )}
      </section>

      <NextProjects slug={p.slug} />
    </>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.04em", color: "var(--muted-2)", marginBottom: 8 }}>
        {label.toUpperCase()}
      </div>
      <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink)", margin: 0 }}>{body}</p>
    </div>
  );
}

function NextProjects({ slug }: { slug: string }) {
  const others = publicProjects.filter((p) => p.slug !== slug && p.slug !== "quantumsight").slice(0, 3);
  if (!others.length) return null;
  return (
    <section className="wrap" style={{ padding: "0 var(--pad) clamp(72px, 12vw, 130px)" }}>
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 32 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 18 }}>MORE BUILDS</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {others.map((o) => (
            <a key={o.slug} href={`/work/${o.slug}`} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
              <span className="sora" style={{ fontWeight: 700, fontSize: 17 }}>{o.title}</span>
              <span style={{ fontSize: 13, color: "var(--muted)", flex: 1, textAlign: "right" }}>{o.tagline}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
