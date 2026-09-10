/**
 * Global site content. Edit here — nothing below is hard-coded in components.
 * Anything marked TODO is a placeholder waiting on a real value from Saksheth.
 */

export const site = {
  name: "Saksheth Rao",
  role: "Product · Technology · Startups",
  /** shown under the hero headline */
  intro:
    "Products. Startups. AI. Cloud infrastructure I probably didn't need to set up myself. The occasional detour into travel photography — because not everything has to ship.",
  location: "SF / Remote",
  /** blinking status line in the hero */
  nowBuilding: "CURRENTLY BUILDING QUANTUMSIGHT — SF / REMOTE",
  /** rotating "currently thinking about —" ticker */
  thoughts: [
    "computer vision at the edge",
    "a Supabase schema I keep rewriting",
    "whether Claude Code counts as a co-founder",
    "a trip I keep postponing",
  ],

  email: "saksheth.rao@gmail.com",

  socials: {
    // TODO: replace with exact URLs
    linkedin: "https://www.linkedin.com/in/saksheth-rao/",
    instagram: "https://www.instagram.com/",
    github: "https://github.com/",
  },

  /** footer build-credit line, mirrors the mockup */
  builtWith: "BUILT WITH CLAUDE CODE · NEXT.JS · TAILWIND · VERCEL",

  resume: {
    /** drop the PDF at public/saksheth-rao-resume.pdf */
    file: "/saksheth-rao-resume.pdf",
    updated: "TODO — e.g. Sep 2025",
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
