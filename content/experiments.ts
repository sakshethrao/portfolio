import type { Experiment } from "@/lib/types";

/**
 * The Lab — small things built out of curiosity. Lower bar than Work:
 * a name, what it does, maybe what you learned. Append freely.
 *
 * These are placeholders in the mockup's spirit. Swap for real ones, or delete
 * any you don't want public.
 */

export const experiments: Experiment[] = [
  {
    emoji: "🎲",
    title: "Dice-roll trip planner",
    blurb: "Picks your next city for you when you can't decide.",
    learned: "TODO — one honest line, or remove this field.",
  },
  {
    emoji: "📈",
    title: "Coffee-shop tracker",
    blurb: "A Supabase schema logging every café I've worked from.",
  },
  {
    emoji: "🧮",
    title: "Case-study grader",
    blurb: "An MBA case-study grader built the week before finals.",
  },
  {
    emoji: "🤖",
    title: "Screenshot renamer",
    blurb: "A Claude Code agent that renames my screenshots so I don't have to.",
  },
];
