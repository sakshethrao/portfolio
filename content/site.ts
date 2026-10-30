/**
 * Global site content. Edit here — nothing below is hard-coded in components.
 * Anything marked TODO is a placeholder waiting on a real value from Saksheth.
 */

export const site = {
  name: "Saksheth Rao",
  role: "Strategy · Operations · Building",
  /** shown under the hero headline — two short sentences, plain speech */
  intro:
    "I started a streetwear marketplace in college, spent four years at KPMG, and now I'm working on QuantumSight and a few smaller products. I get curious about things and usually end up trying to build them.",
  location: "Gurugram, India",
  /** blinking status line in the hero */
  nowBuilding: "Currently building QuantumSight. Based in Gurugram.",
  email: "saksheth.rao@gmail.com",

  socials: {
    linkedin: "https://www.linkedin.com/in/sakshethrao/",
    instagram: "https://www.instagram.com/sakshethrao/",
    github: "https://github.com/sakshethrao",
  },

  /** footer build-credit line, mirrors the mockup */
  builtWith: "Made with Next.js and Claude Code.",

  /** Google Analytics 4 measurement ID. Public by design — it ships in the
   *  page source of every GA site. Blank disables analytics entirely. */
  analytics: {
    ga: "G-SNBS0C87D4",
  },

  resume: {
    file: "/saksheth-rao-cv.pdf",
    updated: "2026",
  },

  /** the Index. label → shown in the overlay; section → matches data-section on the page */
  nav: [
    { label: "Studio", href: "/#studio", section: "studio" },
    { label: "Builds", href: "/#builds", section: "builds" },
    { label: "QuantumSight", href: "/quantumsight", section: "quantumsight" },
    { label: "Experience", href: "/#experience", section: "experience" },
    { label: "Travel", href: "/gallery", section: "travel" },
    { label: "Résumé", href: "/resume", section: "resume" },
  ],

  /** accent colour picker — first entry is the default. Flat colours only. */
  accents: [
    { name: "Signal red", value: "#FF3B30" },
    { name: "Field green", value: "#1A8F4C" },
    { name: "Ultramarine", value: "#2A5CFF" },
  ],
} as const;

export type Accent = (typeof site.accents)[number];
