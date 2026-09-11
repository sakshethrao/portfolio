export type ProjectStatus = "LIVE" | "BUILDING" | "EXPERIMENT" | "ARCHIVED";

/**
 * How a project renders in the Work index. The grid is deliberately not uniform —
 * pick the treatment that fits the project, not a one-size card.
 *
 *  - "feature"  full-width row, room for a custom visual + expandable detail
 *  - "device"   framed inside an iOS device mockup (real app screenshots)
 *  - "browser"  framed inside a browser-window mockup (web app demos)
 *  - "panel"    standard card with a small custom visual slot
 *  - "terminal" card whose visual is a monospace/terminal block
 *  - "compact"  single-line row, for archived / minor work
 */
export type ProjectLayout = "feature" | "device" | "browser" | "panel" | "terminal" | "compact";

export interface Project {
  slug: string;
  title: string;
  /** one line, sentence case, no period unless it's really a sentence */
  tagline: string;
  status: ProjectStatus;
  /** e.g. "AI · Computer Vision", "Consumer app" */
  category: string;
  /** display string, e.g. "2025 — now" or "2024" */
  period: string;
  layout: ProjectLayout;
  /** true = surfaces in the featured area / gets more visual weight */
  featured?: boolean;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** path under /public, 16:10-ish looks best in the grid */
  image?: string;
  /** screenshots shown in the device frame (layout: "device") */
  screens?: string[];
  /** monospace lines for layout: "terminal" */
  terminal?: string[];
  /** longer-form write-up shown on the detail page / expandable panel */
  caseStudy?: {
    problem?: string;
    approach?: string;
    outcome?: string;
    /** pipeline / stage labels, rendered as a progress track */
    stages?: { label: string; state: "done" | "current" | "todo" }[];
    /** freeform notes, one per paragraph */
    notes?: string[];
  };
  /** hide from the public site without deleting the entry */
  private?: boolean;
}

export interface Experiment {
  title: string;
  blurb: string;
  emoji?: string;
  learned?: string;
  tech?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Photo {
  src: string;
  /** used for alt text + caption */
  place: string;
  /** e.g. "Kyoto, Japan" */
  location?: string;
  date?: string;
  /** grid weight: 1 = normal, 2 = wide/tall feature */
  span?: 1 | 2;
  width?: number;
  height?: number;
}

export interface Role {
  company: string;
  title: string;
  period: string;
  location?: string;
  summary?: string;
  points?: string[];
}
