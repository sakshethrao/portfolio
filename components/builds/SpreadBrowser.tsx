import type { Project } from "@/lib/types";
import { ParchiDemo } from "@/components/parchi/ParchiDemo";
import { MakeFlow } from "@/components/make/MakeFlow";
import { TwoCentsDemo } from "@/components/twocents/TwoCentsDemo";
import { ProjectStage } from "./ProjectStage";

/** the word set in the serif italic, per build */
const EMPHASIS: Record<string, string> = {
  twocents: "your voice",
  parchi: "logs itself",
  "influencer-payment-os": "chasing",
};

/** a build whose spread borrows the product's own ground, the way Nurture does */
const TINT: Record<string, string> = {
  twocents: "#eaf2fd",
};

/** the demo that runs beneath the stage, and the line that labels it */
const DEMOS: Record<string, { node: React.ReactNode; caption: string }> = {
  twocents: {
    node: <TwoCentsDemo />,
    caption: "RECREATION — CLICK THE COMMENT BOX AND WATCH THE REPLY WRITE ITSELF. THE FEED IS A STAND-IN, NOT LINKEDIN'S UI",
  },
  parchi: {
    node: <ParchiDemo />,
    caption: "LIVE DEMO — DROP THE RECEIPT, THEN CHECK THE DASHBOARD",
  },
  "influencer-payment-os": {
    node: <MakeFlow />,
    caption: "LIVE DEMO — HIT RUN ONCE, WATCH IT MOVE THROUGH THE SCENARIO",
  },
};

/** web-app spread: the stage up top, the live demo running full width beneath */
export function SpreadBrowser({ project, index, detail = false }: { project: Project; index: number; detail?: boolean }) {
  const demo = DEMOS[project.slug];
  const tint = TINT[project.slug];

  return (
    <section id={`build-${project.slug}`} data-build={project.slug} style={tint ? { background: tint } : undefined}>
      <div className="wrap spread">
        <div className="grid-12" style={{ rowGap: 40, alignItems: "end" }}>
          <div style={{ gridColumn: "1 / span 12" }} className="browser-stage">
            <ProjectStage project={project} index={index} hideStory={detail} emphasis={EMPHASIS[project.slug]} />
          </div>

          {demo && (
            <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
              {demo.node}
              <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
                {demo.caption}
              </span>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) { .browser-stage { grid-column: 1 / span 8 !important; } }
      `}</style>
    </section>
  );
}
