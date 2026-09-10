import type { Experiment } from "@/lib/types";

/**
 * The Lab — small things built out of curiosity. Lower bar than Work:
 * a name, what it does, maybe what you learned.
 *
 * Real entries only. Add one like:
 *   { emoji: "🧾", title: "QR payment dashboard",
 *     blurb: "A dashboard for tracking QR-code payments.",
 *     githubUrl: "https://github.com/sakshethrao/QR-payment-dashboard" }
 */

export const experiments: Experiment[] = [
  {
    emoji: "🧱",
    title: "This site",
    blurb:
      "Built from a Claude Design mockup with Next.js, Tailwind and Claude Code — data-driven so it's quick to keep adding to.",
    githubUrl: "https://github.com/sakshethrao/portfolio",
  },
];

export const labIntro =
  "Things built because I was curious. Not everything needs to become a startup.";
