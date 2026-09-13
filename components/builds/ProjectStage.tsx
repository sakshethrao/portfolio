import Link from "next/link";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

/**
 * The text half of a spread: running meta line, title, tagline, links.
 * Shared by every spread and the /work/[slug] page so a build reads the same
 * on the index and up close.
 */
export function ProjectStage({
  project,
  index,
  dark = false,
  hideStory = false,
  titleSize = "clamp(40px, 6vw, 88px)",
  emphasis,
}: {
  project: Project;
  index: number;
  dark?: boolean;
  hideStory?: boolean;
  titleSize?: string;
  /** optional word in the tagline to set in the serif italic */
  emphasis?: string;
}) {
  const muted = dark ? "rgba(255,255,255,0.62)" : "var(--muted)";
  const faint = dark ? "rgba(255,255,255,0.4)" : "var(--faint)";
  const storyHref = project.slug === "quantumsight" ? "/quantumsight" : `/work/${project.slug}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
      <div className="mono" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", fontSize: 11, letterSpacing: "0.06em", color: faint }}>
        <span>{String(index).padStart(2, "0")}</span>
        <StatusBadge status={project.status} light={dark} />
        <span>{project.period.toUpperCase()}</span>
        <span style={{ color: faint }}>{project.category.toUpperCase()}</span>
      </div>

      <h3 className="display" style={{ fontWeight: 500, fontSize: titleSize, margin: 0, color: dark ? "#fff" : "var(--ink)" }}>
        {project.title}
      </h3>

      <p style={{ fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.45, color: muted, margin: 0, maxWidth: 520 }}>
        {emphasis ? <Emph text={project.tagline} word={emphasis} /> : project.tagline}
      </p>

      <div className="mono" style={{ fontSize: 11.5, letterSpacing: "0.03em", color: faint }}>
        {project.tech.join("  ·  ")}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="pill-solid" style={dark ? { background: "#fff", color: "var(--ink)", borderColor: "#fff" } : undefined}>
            Open it ↗
          </a>
        )}
        {!hideStory && (
          <Link href={storyHref} className={project.liveUrl ? "pill-outline" : "pill-solid"} style={dark ? (project.liveUrl ? { borderColor: "rgba(255,255,255,0.35)", color: "#fff" } : { background: "#fff", color: "var(--ink)", borderColor: "#fff" }) : undefined}>
            {project.slug === "quantumsight" ? "Go inside →" : "The build story →"}
          </Link>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="pill-outline" style={dark ? { borderColor: "rgba(255,255,255,0.35)", color: "#fff" } : undefined}>
            Code ↗
          </a>
        )}
      </div>
    </div>
  );
}

/** sets one word of a sentence in the italic serif, slightly larger */
export function Emph({ text, word }: { text: string; word: string }) {
  const i = text.indexOf(word);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="serif-i" style={{ fontSize: "1.12em" }}>{word}</span>
      {text.slice(i + word.length)}
    </>
  );
}
