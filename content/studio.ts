/**
 * The desk. Each object on it stands for one part of the site; hover/tap
 * shows `label` + `line`, click goes to `href`. Keys match the objects in
 * components/studio/objects — the wording here is the only thing to edit.
 */
export type StudioObjectKey = "cctv" | "aibox" | "phone" | "laptop" | "camera" | "pass" | "resume" | "ball";

export const studioObjects: { key: StudioObjectKey; label: string; line: string; href: string }[] = [
  { key: "cctv", label: "QuantumSight", line: "Making existing CCTV cameras understand what they see. Founder, 2025 — now.", href: "/quantumsight" },
  { key: "aibox", label: "The QS AI Box", line: "Edge inference on the cameras a building already has.", href: "/quantumsight" },
  { key: "phone", label: "Nurture", line: "A marketplace matching parents with verified nannies.", href: "/#build-nurture" },
  { key: "laptop", label: "The apps", line: "Parchi, the Influencer Payment OS, and whatever's next.", href: "/#build-parchi" },
  { key: "camera", label: "Photography", line: "Places I've pointed a camera at.", href: "/gallery" },
  { key: "pass", label: "Travel", line: "Loosely ordered, lightly edited.", href: "/gallery" },
  { key: "resume", label: "Résumé", line: "The one page you can print.", href: "/resume" },
  { key: "ball", label: "Off hours", line: "Travel, cricket, a camera.", href: "/#experience" },
];

export const studioHint = "SCROLL — THE DESK ↓";
