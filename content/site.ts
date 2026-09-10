/**
 * Global site content. Edit here — nothing below is hard-coded in components.
 * Anything marked TODO is a placeholder waiting on a real value from Saksheth.
 */

export const site = {
  name: "Saksheth Rao",
  role: "Strategy · Operations · Building",
  /** shown under the hero headline — keep to one line */
  intro:
    "Consulting, a streetwear marketplace, now computer vision — plus a lot of small apps in between.",
  location: "Gurugram, India",
  /** blinking status line in the hero */
  nowBuilding: "CURRENTLY BUILDING QUANTUMSIGHT — GURUGRAM / REMOTE",
  /** rotating "currently thinking about —" ticker */
  thoughts: [
    "computer vision at the edge",
    "a Supabase schema I keep rewriting",
    "whether Claude Code counts as a co-founder",
    "the next small app",
  ],

  email: "saksheth.rao@gmail.com",

  socials: {
    linkedin: "https://www.linkedin.com/in/sakshethrao/",
    instagram: "https://www.instagram.com/sakshethrao/",
    github: "https://github.com/sakshethrao",
  },

  /** footer build-credit line, mirrors the mockup */
  builtWith: "BUILT WITH CLAUDE CODE · NEXT.JS · TAILWIND · VERCEL",

  resume: {
    file: "/saksheth-rao-cv.pdf",
    updated: "2026",
  },

  nav: [
    { label: "BUILDS", href: "/#work" },
    { label: "LAB", href: "/#lab" },
    { label: "QUANTUMSIGHT", href: "/quantumsight" },
    { label: "ABOUT", href: "/#about" },
    { label: "TRAVEL", href: "/gallery" },
    { label: "RÉSUMÉ", href: "/resume" },
  ],

  /** accent colour picker — first entry is the default */
  accents: [
    { name: "Signal red", value: "#FF3B30" },
    { name: "Field green", value: "#1A8F4C" },
    { name: "Ultramarine", value: "#2A5CFF" },
    { name: "Iris", value: "#8A5CF6" },
  ],
} as const;

export type Accent = (typeof site.accents)[number];
