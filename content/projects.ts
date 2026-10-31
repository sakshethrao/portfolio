import type { Project } from "@/lib/types";

/**
 * The Work index. Order here = order on the page.
 * Add a build by appending an object — the grid and detail pages pick it up.
 * Keep taglines to one line; keep case-study fields to a sentence or two,
 * written the way you'd say it out loud.
 */

export const projects: Project[] = [
  {
    slug: "twocents",
    title: "TwoCents",
    tagline: "A reply in your voice is already written by the time you click Comment.",
    status: "LIVE",
    category: "Chrome extension",
    period: "2026",
    layout: "browser",
    featured: true,
    tech: ["Next.js", "Chrome Extension", "Claude API", "Supabase", "LinkedIn API"],
    liveUrl: "https://2cents.live",
    caseStudy: {
      problem:
        "Commenting is how people notice you on LinkedIn. Most of us write two, run out of things to say and give up — and the AI shortcuts all read like AI.",
      approach:
        "Click into a post's comment box and the reply is already there, writing itself in while you read it. Change the tone, keep your own words, or post it. It only reads a post when you act on one, and it remembers everyone you've talked to.",
      outcome:
        "Live at 2cents.live, extension 0.4.5. Seven comments are free, then ₹299 a month. Claude does the drafting; Supabase, Sentry and PostHog sit behind it.",
    },
  },
  {
    slug: "quantumsight",
    title: "QuantumSight",
    tagline: "Your CCTV cameras could be doing a lot more than recording.",
    status: "BUILDING",
    category: "Computer vision",
    period: "2025 — now",
    layout: "feature",
    featured: true,
    tech: ["YOLOv8", "Edge Inference", "Python", "React"],
    image: "/quantumsight/analysis.jpg",
    caseStudy: {
      problem:
        "Most buildings already have cameras everywhere. Someone still has to watch them, or go through the footage after something has already happened.",
      approach:
        "We connect AI to the cameras that are already installed. Instead of only recording, they can flag the things someone needs to look at — a fire, someone in a restricted area, a safety incident.",
      outcome: "A working prototype running against live camera feeds, and we're running early pilots now.",
      stages: [
        { label: "Concept", state: "done" },
        { label: "Prototype", state: "done" },
        { label: "Pilot", state: "current" },
        { label: "Scale", state: "todo" },
      ],
      notes: ["Existing CCTV → QS AI Box (edge) → cloud inference → alerts dashboard."],
    },
  },
  {
    slug: "nurture",
    title: "Nurture",
    tagline: "An app for parents to find a nanny they can actually trust.",
    status: "LIVE",
    category: "Marketplace app",
    period: "2025",
    layout: "device",
    featured: true,
    tech: ["Next.js", "Supabase", "Claude Code"],
    caseStudy: {
      problem:
        "Finding someone you trust with your child usually starts with asking friends, family and apartment groups, and there's no easy way to check anyone before they're in your home.",
      approach:
        "An app for both sides. Parents say what they need and compare profiles; nannies put up their experience and find work. Verification sits at the front of it, and there are free training courses for nannies.",
      outcome: "The preview on this page is the real interface, running screen for screen.",
      notes: ["Next.js and Supabase. Warm rather than clinical — it's a decision people are nervous about."],
    },
  },
  {
    slug: "parchi",
    title: "Parchi",
    tagline: "A simpler way for a shop to track UPI payments — screenshot it and it logs itself.",
    status: "DEMO",
    category: "Retail · UPI ledger",
    period: "2025",
    layout: "browser",
    featured: true,
    tech: ["Next.js", "Supabase", "Tesseract OCR", "Recharts"],
    githubUrl: "https://github.com/sakshethrao/QR-payment-dashboard",
    caseStudy: {
      problem:
        "Small shops take payments all day and keep track of them on memory or paper chits. It gets messy fast, and reconciling at closing time is worse.",
      approach:
        "Drop in a payment screenshot and OCR reads the amount, UPI ID, bank and reference number, flags anything it isn't sure about for a quick check, and files it against a customer.",
      outcome:
        "A working demo — screenshot processing, revenue by day and week, a pending-review queue and per-customer history. Nobody is running a shop on it yet.",
    },
  },
  {
    slug: "influencer-payment-os",
    title: "Influencer Payment OS",
    tagline: "Because chasing influencer payments gets old very quickly.",
    status: "EXPERIMENT",
    category: "Automation · Make.com",
    period: "2026",
    layout: "browser",
    tech: ["Make.com", "Google Sheets", "Gmail", "Google Docs"],
    caseStudy: {
      problem:
        "Running the campaign is one thing. Getting everyone paid, and remembering who still owes what, is another — and it's usually done by hand.",
      approach:
        "Two Make.com automations over a Google Sheet. One raises and emails invoices. The other watches every payment date and sends the right reminder — upcoming, due, overdue, escalation — and logs what it did.",
      outcome:
        "An experiment on sample campaign data. A test run generated two invoices and sent nine reminder emails, which is what the demo here replays.",
    },
  },
  {
    slug: "nicho",
    title: "Nicho",
    tagline: "A streetwear marketplace I started in college, and my first real attempt at a business.",
    status: "ARCHIVED",
    category: "D2C marketplace",
    period: "2020 — 2022",
    layout: "compact",
    tech: ["Marketplace ops", "Meta Ads", "GTM"],
    figures: [
      { value: "18", label: "brands" },
      { value: "1,000+", label: "customers" },
      { value: "₹10L+", label: "GMV" },
    ],
    caseStudy: {
      problem:
        "India had a lot of good independent streetwear labels and no easy place to find them or buy from them in one go.",
      approach:
        "Co-founded a commission-based marketplace and ran it with a team of nine. I worked across brand partnerships, ads, customers and operations — pretty much everything that needed doing.",
      outcome:
        "₹10L+ in GMV and 1,000+ customers at a sub-₹250 CAC, at roughly 3–4× ROAS. We closed it in 2022. It was the first thing I built where people spent their own money, which taught me more than the rest of it put together.",
    },
  },

  /*
  // ---- template ----
  {
    slug: "kebab-case-id",
    title: "Project name",
    tagline: "One line on what it is.",
    status: "LIVE",             // LIVE | BUILDING | DEMO | EXPERIMENT | ARCHIVED
    category: "Web app",
    period: "2025",
    layout: "panel",           // feature | device | browser | panel | terminal | compact
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
