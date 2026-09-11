import type { Project } from "@/lib/types";

/**
 * The Work index. Order here = order on the page.
 * Add a build by appending an object — the grid and detail pages pick it up.
 * Keep taglines to one line; keep case-study fields to a sentence.
 */

export const projects: Project[] = [
  {
    slug: "quantumsight",
    title: "QuantumSight",
    tagline: "Making existing CCTV cameras understand what they see.",
    status: "BUILDING",
    category: "AI · Computer Vision",
    period: "2025 — now",
    layout: "feature",
    featured: true,
    tech: ["YOLOv8", "Edge Inference", "Python", "React"],
    image: "/quantumsight/analysis.jpg",
    caseStudy: {
      problem: "Buildings already have cameras — but nothing that understands what's in frame.",
      approach: "An edge box on top of existing CCTV that turns raw footage into events a security team can act on.",
      outcome: "Working prototype against live camera feeds; first pilot conversations underway.",
      stages: [
        { label: "Concept", state: "done" },
        { label: "Prototype", state: "current" },
        { label: "Pilot", state: "todo" },
        { label: "Scale", state: "todo" },
      ],
      notes: [
        "Existing CCTV → QS AI Box (edge) → cloud inference → alerts dashboard.",
      ],
    },
  },
  {
    slug: "nurture",
    // TODO(Saksheth): live URL + whether to show the GitHub link.
    title: "Nurture",
    tagline: "A marketplace matching parents with verified nannies.",
    status: "LIVE",
    category: "Marketplace app",
    period: "2025",
    layout: "device",
    featured: true,
    tech: ["Next.js", "Supabase", "Claude Code"],
    // liveUrl: "https://...",
    // githubUrl: "https://github.com/sakshethrao/Nurture",
    caseStudy: {
      problem: "Hiring a nanny in India runs on word of mouth — no easy way to check verification before someone's in your home.",
      approach: "A full app for both sides: AI-ranked matches with Aadhaar / police checks up front, plus free certification courses for nannies.",
      outcome: "The preview on this page is the real interface, running screen for screen.",
      notes: [
        "Next.js + Supabase. Warm, verification-forward design — calm, not clinical.",
      ],
    },
  },
  {
    slug: "parchi",
    title: "Parchi",
    tagline: "The kirana counter's UPI ledger — screenshot a payment and it logs itself.",
    status: "LIVE",
    category: "Retail · UPI ledger",
    period: "2025",
    layout: "browser",
    featured: true,
    tech: ["Next.js", "Supabase", "Tesseract OCR", "Recharts"],
    githubUrl: "https://github.com/sakshethrao/QR-payment-dashboard",
    caseStudy: {
      problem: "Small shops track UPI payments from memory or paper chits — easy to lose, hard to reconcile at day's end.",
      approach: "Drop in a payment screenshot — OCR reads the amount, UPI ID, bank and reference number, flags anything uncertain for a quick check, and logs it against a customer.",
      outcome: "Revenue by day, week and month, pending reviews, and per-customer history — a digital parchi book.",
    },
  },
  {
    slug: "nicho",
    title: "Nicho",
    tagline: "A D2C marketplace for Indian streetwear. 18 brands, 1,000+ customers.",
    status: "ARCHIVED",
    category: "D2C marketplace",
    period: "2020 — 2022",
    layout: "compact",
    tech: ["Marketplace ops", "Meta Ads", "GTM"],
    caseStudy: {
      problem: "India's best independent streetwear labels were scattered and hard to buy from in one place.",
      approach: "Co-founded a commission-based marketplace, ran it with a team of 9, onboarded 18 brands through 250+ founder conversations.",
      outcome: "₹10L+ GMV, 1,000+ customers at a sub-₹250 CAC, ~3–4× ROAS before we moved on.",
    },
  },

  /*
  // ---- template ----
  {
    slug: "kebab-case-id",
    title: "Project name",
    tagline: "One line on what it is.",
    status: "LIVE",             // LIVE | BUILDING | EXPERIMENT | ARCHIVED
    category: "Web app",
    period: "2025",
    layout: "panel",           // feature | device | panel | terminal | compact
    tech: ["React", "Supabase"],
    liveUrl: "https://...",
    githubUrl: "https://github.com/...",
    image: "/projects/slug.jpg",
    caseStudy: { problem: "...", approach: "...", outcome: "..." },
  },
  */
];

export const publicProjects = projects.filter((p) => !p.private);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
