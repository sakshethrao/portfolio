import type { Role } from "@/lib/types";

/**
 * Professional experience. Kept deliberately short — this is a builder's site,
 * not a career timeline. Add roles as needed.
 */

export const roles: Role[] = [
  {
    company: "QuantumSight Technologies",
    title: "Founder",
    period: "2025 — now",
    location: "SF / Remote",
    summary:
      "Building an AI company making existing CCTV infrastructure intelligent.",
  },
  {
    company: "KPMG",
    title: "TODO — your title",
    period: "TODO — start – end",
    location: "TODO",
    summary: "TODO — one line on what you did here.",
    // points: ["...", "..."], // optional, keep to 2–3
  },
];

/** short list rendered near About */
export const about = {
  lead: "I work across product, technology, startups, AI and — mostly — building.",
  body: [
    "TODO — two or three sentences in your own voice. What you're drawn to, how you work, what you're building now. Skip anything that sounds like a LinkedIn summary.",
    "Outside of that: travel, sport, and a standing habit of building things nobody asked for.",
  ],
  /** small tag row */
  works: ["Product", "Technology", "Startups", "AI", "Building"],
  offHours: ["Travel", "Sport", "Curiosity", "Experimenting"],
};
