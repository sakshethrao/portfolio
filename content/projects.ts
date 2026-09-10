import type { Project } from "@/lib/types";

/**
 * The Work index. Order here = order on the page.
 * Add a new build by appending an object — the grid and detail pages pick it up
 * automatically. No component changes needed.
 *
 * Fields marked TODO are placeholders waiting on real copy / assets / links.
 */

export const projects: Project[] = [
  {
    slug: "quantumsight",
    title: "QuantumSight",
    tagline:
      "Teaching the CCTV cameras that already exist to actually understand what they're looking at.",
    status: "BUILDING",
    category: "AI · Computer Vision",
    period: "2025 — now",
    layout: "feature",
    featured: true,
    tech: ["Computer Vision", "Edge Inference", "Python", "React"],
    // liveUrl: "https://quantumsight.tech", // TODO if there's a public site
    image: undefined, // TODO: hero / prototype still at public/quantumsight/hero.jpg
    caseStudy: {
      problem:
        "Most buildings already have cameras. What they don't have is anything that understands what's in frame — so footage only matters after something has already gone wrong.",
      approach:
        "QuantumSight sits on top of existing CCTV — no rip-and-replace. An edge box runs vision models on the local feed and turns raw footage into events a security team can actually act on.",
      outcome:
        "TODO — current stage in your own words (prototype running on N cameras, first pilot site, etc.). Keep it honest; no invented metrics.",
      stages: [
        { label: "Concept", state: "done" },
        { label: "Prototype", state: "done" },
        { label: "Pilot", state: "current" },
        { label: "Scale", state: "todo" },
      ],
      notes: [
        "Pipeline: existing CCTV → QS AI Box (edge) → cloud inference → alerts dashboard.",
        "TODO — a paragraph on what you're building right now and what you've learned shipping it.",
      ],
    },
  },
  {
    slug: "nurture",
    title: "Nurture",
    // TODO: real one-liner. Placeholder below is deliberately vague until you send the description.
    tagline: "A real app I built end to end — description coming from you.",
    status: "LIVE",
    category: "Consumer app",
    period: "2025",
    layout: "device",
    featured: true,
    tech: ["React", "Supabase", "Vercel", "Claude Code"],
    // liveUrl: "https://...", // TODO
    // githubUrl: "https://github.com/...", // TODO — or leave off if private
    screens: [
      // TODO: drop real screenshots here, e.g.
      // "/nurture/home.png", "/nurture/schedule.png", "/nurture/pay.png"
    ],
    caseStudy: {
      problem: "TODO — what wasn't working before Nurture.",
      approach: "TODO — how you built it and what the app actually does.",
      outcome: "TODO — where it stands now (used by whom, what it replaced).",
      notes: [
        "Built solo with React + Supabase, deployed on Vercel, paired with Claude Code.",
      ],
    },
  },

  /*
  // ---- template: copy, fill, append above or below ----
  {
    slug: "kebab-case-id",
    title: "Project name",
    tagline: "One line on what it is.",
    status: "LIVE",              // LIVE | BUILDING | EXPERIMENT | ARCHIVED
    category: "Web app",
    period: "2025",
    layout: "panel",            // feature | device | panel | terminal | compact
    tech: ["React", "Supabase"],
    liveUrl: "https://...",
    githubUrl: "https://github.com/...",
    image: "/projects/slug.jpg",
    caseStudy: {
      problem: "...",
      approach: "...",
      outcome: "...",
    },
  },
  */
];

export const publicProjects = projects.filter((p) => !p.private);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
