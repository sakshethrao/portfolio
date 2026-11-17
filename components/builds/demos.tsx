import { ParchiDemo } from "@/components/parchi/ParchiDemo";
import { MakeFlow } from "@/components/make/MakeFlow";
import { TwoCentsDemo } from "@/components/twocents/TwoCentsDemo";

/** the live demo for each web-app build, with the honest label that goes under it */
export const DEMOS: Record<string, { node: React.ReactNode; caption: string }> = {
  twocents: {
    node: <TwoCentsDemo />,
    caption: "RECREATION — CLICK THE COMMENT BOX AND WATCH THE REPLY WRITE ITSELF. THE FEED IS A STAND-IN, NOT LINKEDIN'S UI",
  },
  parchi: {
    node: <ParchiDemo />,
    caption: "INTERACTIVE DEMO — DROP THE RECEIPT, THEN CHECK THE DASHBOARD",
  },
  "influencer-payment-os": {
    node: <MakeFlow />,
    caption: "INTERACTIVE DEMO — HIT RUN ONCE, WATCH IT MOVE THROUGH THE SCENARIO",
  },
};

/** the word set in the serif italic, per build */
export const EMPHASIS: Record<string, string> = {
  quantumsight: "a lot more",
  nurture: "trust",
  twocents: "your voice",
  parchi: "logs itself",
  "influencer-payment-os": "chasing",
};

/** each build sits on its own product's ground */
export const TONE: Record<string, { bg: string; dark?: boolean }> = {
  twocents: { bg: "#eaf2fd" },
  quantumsight: { bg: "#0d0f10", dark: true },
  nurture: { bg: "#fbf9f1" },
  parchi: { bg: "#eaf6ef" },
  "influencer-payment-os": { bg: "#f1eafc" },
};
