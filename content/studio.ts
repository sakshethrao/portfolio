/**
 * The desk. Each object on it stands for one part of the site; hover/tap
 * shows `label` + `line`, click goes to `href`. Keys match the objects in
 * components/studio/objects — the wording here is the only thing to edit.
 */
export type StudioObjectKey = "cctv" | "aibox" | "phone" | "laptop" | "camera" | "pass" | "resume" | "ball" | "paddle" | "drone";

export const studioObjects: { key: StudioObjectKey; label: string; line: string; href: string }[] = [
  { key: "cctv", label: "QuantumSight", line: "Trying to make CCTV useful before something goes wrong.", href: "/quantumsight" },
  { key: "aibox", label: "The QS AI Box", line: "The hardware behind QuantumSight. It works with cameras you already have.", href: "/quantumsight" },
  { key: "phone", label: "Nurture", line: "An app to make finding a nanny a little less complicated.", href: "/#build-nurture" },
  { key: "laptop", label: "The apps", line: "A few tools I built to solve very specific problems.", href: "/#build-twocents" },
  { key: "camera", label: "Photography", line: "Places I've been and photos I wanted to keep.", href: "/gallery" },
  { key: "pass", label: "Travel", line: "A collection of trips, weekends and a few drone shots.", href: "/gallery" },
  { key: "resume", label: "Résumé", line: "The more formal version of what I've done.", href: "/resume" },
  { key: "ball", label: "Off hours", line: "Cricket, mostly. It's been the constant since school.", href: "/#experience" },
  { key: "paddle", label: "Off hours", line: "Pickleball, when it isn't cricket.", href: "/#experience" },
  { key: "drone", label: "From above", line: "Some of the travel photos were taken from the air.", href: "/gallery" },
];

export const studioHint = "A FEW THINGS ON MY DESK ↓";
