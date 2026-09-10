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
        "Early stage: a working prototype running against live camera feeds, with the first pilot conversations in progress.",
      stages: [
        { label: "Concept", state: "done" },
        { label: "Prototype", state: "current" },
        { label: "Pilot", state: "todo" },
        { label: "Scale", state: "todo" },
      ],
      notes: [
        "Pipeline: existing CCTV → QS AI Box (edge) → cloud inference → alerts dashboard.",
        "Built mostly in the open — edge inference, a lean dashboard, and a lot of iterating on what actually counts as an event worth a person's attention.",
      ],
    },
  },
  {
    slug: "nurture",
    // TODO(Saksheth): live URL + whether to show the GitHub link.
    title: "Nurture",
    tagline:
      "A two-sided marketplace matching working parents with verified nannies — and training the nannies too.",
    status: "LIVE",
    category: "Marketplace app",
    period: "2025",
    layout: "device",
    featured: true,
    tech: ["Next.js", "React", "Supabase", "Vercel", "Claude Code"],
    // liveUrl: "https://...",
    // githubUrl: "https://github.com/sakshethrao/Nurture",
    caseStudy: {
      problem:
        "Hiring a nanny in India runs on word of mouth and blind trust — no easy way to check verification, experience or references before someone's in your home.",
      approach:
        "A full app for both sides: parents onboard their child and routines, get AI-ranked matches, and see Aadhaar / police / reference checks up front. Nannies build a profile and take free certification courses that unlock better matches. Next.js App Router, Supabase for auth + data, a design system ported from a Stitch spec.",
      outcome:
        "The preview on this page is the real interface — matching, profiles, verification and the nanny-side training, running screen for screen.",
      notes: [
        "Warm, verification-forward design: sage-on-cream, Plus Jakarta Sans, everything very rounded — meant to read as calm and trustworthy rather than clinical.",
      ],
    },
  },
  {
    slug: "nicho",
    title: "Nicho",
    tagline:
      "A D2C marketplace for Made-in-India streetwear — co-founded and scaled to 18 brands and 1,000+ customers.",
    status: "ARCHIVED",
    category: "D2C marketplace",
    period: "2020 — 2022",
    layout: "compact",
    tech: ["Marketplace ops", "Meta Ads", "GTM", "Retention"],
    caseStudy: {
      problem:
        "India makes excellent streetwear, but the good independent labels were scattered — hard to discover, harder to buy from in one place.",
      approach:
        "Co-founded a commission-based marketplace and ran it with a team of 9. Onboarded 18 brands through 250+ founder conversations, aligned joint marketing, and built onboarding that cut vendor turnaround ~40%.",
      outcome:
        "₹10L+ GMV and 1,000+ customers at a sub-₹250 CAC. Roughly 3–4× ROAS and a 20–25% repeat rate across 25+ campaigns before we moved on.",
      notes: [
        "The clearest lesson in doing distribution, ops and retention at once — with no budget to waste on any of them.",
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
