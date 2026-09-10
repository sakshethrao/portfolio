import type { Role } from "@/lib/types";

/**
 * Professional background. Kept short on purpose — this is a builder's site,
 * not a career timeline. The full detail lives in the CV on /resume.
 */

export const roles: Role[] = [
  {
    company: "QuantumSight",
    title: "Founder",
    period: "2025 — now",
    location: "Remote",
    summary: "Building computer vision that makes existing CCTV understand what it sees.",
  },
  {
    company: "KPMG",
    title: "Consultant",
    period: "2022 — 2026",
    location: "Gurugram",
    summary:
      "Risk advisory and strategy across automotive, telecom and quick-commerce. Promoted from Analyst to Consultant in three years.",
    points: [
      "Flagged $8M in revenue leakage from unreported licensing liabilities; closed access-control gaps across 10 systems, mitigating ₹1Cr+ in risk.",
      "Worked on Blinkit's post-acquisition integration — access controls and DPDP data-privacy remediation.",
      "Market-entry analysis for Lyca Mobile (South Africa mobile money) and Iraq's telecom regulator.",
    ],
  },
  {
    company: "Nicho",
    title: "Co-Founder",
    period: "2020 — 2022",
    location: "Pune",
    summary:
      "Co-founded a commission-based D2C marketplace for Made-in-India streetwear.",
    points: [
      "Onboarded 18 brands through 250+ founder conversations; grew to 1,000+ customers at a sub-₹250 CAC with a team of 9.",
      "~3–4× ROAS and a 20–25% repeat rate across 25+ campaigns and launches.",
    ],
  },
];

/** rendered as a lighter tier on /resume */
export const earlier: Role[] = [
  {
    company: "KPMG — Risk Advisory",
    title: "Intern",
    period: "Jan – Jul 2022",
    location: "Gurugram",
    summary:
      "Automotive: lifted asset utilisation 20% and surfaced ₹15L+ in misplaced finished-goods inventory.",
  },
  {
    company: "Bajaj Allianz General Insurance",
    title: "Data Analyst Intern",
    period: "Jul – Sep 2021",
    location: "Pune",
    summary:
      "Reworked the UX of a cross-selling platform and built the data pipelines behind it.",
  },
  {
    company: "AIESEC",
    title: "Business Development Lead",
    period: "2019 — 2020",
    location: "Manipal",
    summary:
      "Ran BD and community events — ₹45K raised, restaurant partnerships, and OnePlus India as a sponsor.",
  },
];

export const education = [
  {
    school: "Masters' Union",
    program: "PG Program in Technology & Business Management",
    period: "2026 — now",
    location: "Gurugram",
    note: "Manoj Kohli merit scholarship · Venture Initiation track",
  },
  {
    school: "Manipal Institute of Technology",
    program: "B.Tech, Computer & Communication Engineering — Minor in Big Data",
    period: "2018 — 2022",
    location: "Manipal",
  },
];

export const certifications = [
  { name: "Lean Six Sigma Green Belt", issuer: "KPMG", year: "2023" },
  { name: "Machine Learning with Big Data", issuer: "UC San Diego", year: "2021" },
  { name: "Big Data Modeling & Management Systems", issuer: "UC San Diego", year: "2021" },
];

/** short list rendered near About */
export const about = {
  lead: "KPMG taught me how large companies work — and break. Nicho taught me how to build one. Everything since has been a version of building.",
  body: [
    "Right now that's QuantumSight, a handful of smaller apps, and a PG program in Technology & Business Management at Masters' Union.",
    "Before consulting I studied Computer & Communication Engineering at Manipal. Off the clock: travel, cricket, a camera.",
  ],
  /** small tag rows */
  works: ["Product", "Strategy", "Startups", "AI", "Building"],
  offHours: ["Travel", "Cricket", "Photography", "Tinkering"],
  /** de-emphasised toolkit line, not a logo wall */
  toolkit: [
    "GTM & ops",
    "Stakeholder management",
    "Advanced Excel",
    "Figma",
    "Premiere / Illustrator / Photoshop",
  ],
};
