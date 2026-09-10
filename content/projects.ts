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
    slug: "qr-payments",
    // TODO(Saksheth): name it if you'd rather not use "QR Payments". Screens welcome.
    title: "QR Payments",
    tagline: "Snap a payment screenshot; it reads the details and files the expense.",
    status: "LIVE",
    category: "Expense tracking",
    period: "2025",
    layout: "compact",
    tech: ["Next.js", "Supabase", "Tesseract OCR", "Recharts"],
    githubUrl: "https://github.com/sakshethrao/QR-payment-dashboard",
    caseStudy: {
      problem: "Tracking spend means retyping every UPI payment into a sheet. Nobody keeps that up.",
      approach: "Drop in a payment screenshot — OCR pulls the amount, date and merchant, auto-tags a category, and logs the transaction. Charts and Excel/PDF export on top.",
      outcome: "Used for my own monthly expenses. Cuts logging a payment to one drag-and-drop.",
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
