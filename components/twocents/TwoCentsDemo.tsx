"use client";

/**
 * Interactive recreation of TwoCents (extension 0.4.5).
 *
 * The product changed shape since the first version of this demo, so this
 * follows the current one: the draft appears *in the page*, right above
 * LinkedIn's own comment box, and types itself in while you read. There is no
 * scheduling any more — approving posts it straight away — and it only reads
 * a post when you act on one, rather than watching the feed as you scroll.
 *
 * Panel chrome, labels and rewrite styles are taken from the extension's own
 * source (apps/extension/src/{overlay,sidepanel}.ts and sidepanel.css). The
 * person and the post come from the repo's marketing fixtures, which it marks
 * as invented. The feed around it is deliberately generic, not a copy of
 * LinkedIn's interface — the product makes that same choice in its own
 * marketing.
 *
 * Nothing here calls a backend or a model: the rewrite variants are written
 * out ahead of time.
 */

import { useEffect, useState } from "react";
import { BrowserFrame } from "@/components/BrowserFrame";

const c = {
  ink: "#0e1a2b",
  muted: "#4a5a70",
  line: "#e3ecf8",
  line2: "#d3e0f2",
  blue: "#1466d8",
  blueDeep: "#0b4fb3",
  blueSoft: "#eaf2fd",
  bubble: "#eef5fe",
  card: "#ffffff",
  focus: "#9cc2f2",
  ok: "#16a34a",
  feedBg: "#eef1f5",
  postLine: "#e3e7ee",
};

const font = "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif";

/** from the repo's invented marketing fixtures */
const POST = {
  name: "Daniel Okafor",
  headline: "Founder, Fieldnote · B2B research tools",
  age: "32m",
  snippet:
    "We moved our pricing page from three plans to one. Conversions went up 18% in a month and billing tickets dropped by half. Simplicity beats choice more often than we think.",
};

const BASE =
  "did revenue per customer hold up too, or did some of the old top tier folks end up paying less";

/** the five one-tap rewrites the extension actually offers */
const REWRITES: { label: string; text: string }[] = [
  { label: "Shorter", text: "did revenue per customer hold up, or did top tier folks pay less" },
  {
    label: "Warmer",
    text: "this is a great result. did revenue per customer hold up too, or did some of the old top tier folks end up paying less",
  },
  {
    label: "Bolder",
    text: "most teams won't try this because they're scared of losing the top tier. did revenue per customer actually hold up",
  },
  {
    label: "Ask a question",
    text: "what happened to revenue per customer though. did the old top tier end up paying you less",
  },
  {
    label: "Add my angle",
    text: "we ran a marketplace where the top tier was the scary part of any pricing change. did revenue per customer hold up for you",
  },
];

type Phase = "idle" | "writing" | "ready" | "posted";

const initials = (n: string) => n.split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export function TwoCentsDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState(BASE);
  const [typed, setTyped] = useState("");
  const [rewrite, setRewrite] = useState<number | null>(null);

  // the reply writes itself into the box, the way the real one streams in
  useEffect(() => {
    if (phase !== "writing") return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(id);
        setPhase("ready");
      }
    }, 16);
    return () => clearInterval(id);
  }, [phase, target]);

  const start = () => {
    if (phase !== "idle") return;
    setTarget(BASE);
    setRewrite(null);
    setTyped("");
    setPhase("writing");
  };
  const applyRewrite = (i: number) => {
    setRewrite(i);
    setTarget(REWRITES[i].text);
    setTyped("");
    setPhase("writing");
  };
  const reset = () => {
    setPhase("idle");
    setTyped("");
    setRewrite(null);
    setTarget(BASE);
  };

  const open = phase !== "idle";
  const posted = phase === "posted";

  return (
    <div style={{ fontFamily: font, color: c.ink }}>
      <BrowserFrame url="linkedin.com/feed" minHeight={500}>
        <div className="tc-split">
          {/* ---- the feed. deliberately generic: this is not LinkedIn's UI ---- */}
          <div className="tc-feed" style={{ background: c.feedBg, padding: 16, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <article style={{ background: "#fff", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10, border: `1px solid ${c.postLine}`, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                <span style={{ width: 36, height: 36, borderRadius: 999, background: "#dfe6ef", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12.5, color: "#55657a", flexShrink: 0 }}>
                  {initials(POST.name)}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#1d2633" }}>{POST.name}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: "#6a778a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {POST.headline} · {POST.age}
                  </span>
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#2b3644" }}>{POST.snippet}</p>
              <div style={{ display: "flex", gap: 20, fontSize: 12, fontWeight: 600, color: "#6a778a", borderTop: "1px solid #edf0f4", paddingTop: 9 }}>
                <span>Like</span>
                <span style={{ color: open ? c.blue : undefined }}>Comment</span>
                <span>Repost</span>
              </div>

              {/* ---- the TwoCents card, sitting above the comment box ---- */}
              {open && (
                <div style={{ border: `1px solid ${c.line2}`, borderRadius: 12, background: c.card, boxShadow: "0 6px 20px rgba(17,54,108,0.08)", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderBottom: `1px solid ${c.line}` }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, display: "grid", placeItems: "center", background: "linear-gradient(145deg,#2f86f6,#0b4fb3)", color: "#fff", fontWeight: 800, fontSize: 9.5, flexShrink: 0 }}>
                      2¢
                    </span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, fontWeight: 700 }}>
                      {posted ? "Posted ✓" : phase === "writing" ? "Writing a reply…" : "TwoCents suggested reply"}
                    </span>
                    {!posted && (
                      <button onClick={reset} aria-label="Discard this suggestion" style={{ ...linkBtn, color: c.muted }}>
                        Discard
                      </button>
                    )}
                  </div>

                  <div style={{ padding: "10px 11px", display: "grid", gap: 9 }}>
                    <div
                      style={{
                        minHeight: 56, border: `1px solid ${phase === "ready" ? c.focus : c.line2}`, borderRadius: 9,
                        padding: "8px 10px", fontSize: 13, lineHeight: 1.45, background: posted ? c.bubble : c.card,
                      }}
                    >
                      {typed}
                      {phase === "writing" && <span className="blink" style={{ color: c.blue }}>▍</span>}
                    </div>

                    {!posted && (
                      <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {REWRITES.map((r, i) => (
                            <button
                              key={r.label}
                              onClick={() => applyRewrite(i)}
                              disabled={phase === "writing"}
                              aria-pressed={rewrite === i}
                              style={{
                                minHeight: 24, padding: "0 9px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                                whiteSpace: "nowrap", cursor: phase === "writing" ? "default" : "pointer",
                                opacity: phase === "writing" ? 0.55 : 1,
                                border: `1px solid ${rewrite === i ? c.blue : c.line2}`,
                                background: rewrite === i ? c.blueSoft : c.card,
                                color: rewrite === i ? c.blueDeep : c.muted,
                              }}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ flex: 1, minWidth: 0, fontSize: 10.5, color: c.muted }}>
                            {phase === "writing" ? "Type while it drafts and it keeps your words." : "Ctrl + Enter posts."}
                          </span>
                          <button
                            onClick={() => setPhase("posted")}
                            disabled={phase === "writing"}
                            style={{
                              ...btn, border: 0, color: "#fff", fontWeight: 700, height: 32,
                              background: "linear-gradient(180deg,#2179ea,#1061cf)",
                              boxShadow: "0 4px 12px rgba(20,102,216,0.28)",
                              opacity: phase === "writing" ? 0.6 : 1,
                            }}
                          >
                            Post
                          </button>
                        </div>
                      </>
                    )}

                    {posted && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 600, color: c.muted }}>
                        <span style={{ width: 18, height: 18, borderRadius: 999, background: c.ok, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Check light />
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>Posted to the thread</span>
                        <button onClick={reset} style={linkBtn}>Run it again</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LinkedIn's own comment box */}
              <button
                onClick={start}
                style={{
                  textAlign: "left", border: `1px solid ${c.postLine}`, borderRadius: 999, padding: "9px 14px",
                  fontSize: 12.5, color: open ? c.ink : "#6a778a", background: "#fff", cursor: open ? "default" : "pointer",
                  fontFamily: font,
                }}
              >
                {posted ? typed : open ? "Your reply is above — edit it there" : "Add a comment…"}
              </button>
            </article>
          </div>

          {/* ---- the side panel, docked ---- */}
          <div
            className="tc-panel"
            style={{
              minWidth: 0,
              borderLeft: `1px solid ${c.line}`,
              background: "linear-gradient(180deg,#dceafb 0%,#eef4fd 30%,#f6f9fe 100%)",
              display: "flex",
              flexDirection: "column",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 10px" }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, display: "grid", placeItems: "center", background: "linear-gradient(145deg,#2f86f6,#0b4fb3)", color: "#fff", fontWeight: 800, fontSize: 11.5, boxShadow: "0 4px 10px rgba(20,102,216,0.3)", flexShrink: 0 }}>
                2¢
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>TwoCents</span>
            </div>

            <div style={{ ...cardBox, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>Suggest a reply in the comment box</div>
                  <div style={{ color: c.muted, fontSize: 11.5 }}>TwoCents reads a post only when you act on it.</div>
                </div>
                <span aria-hidden style={{ width: 40, height: 24, flexShrink: 0, borderRadius: 12, padding: 3, display: "flex", justifyContent: "flex-end", background: c.blue }}>
                  <span style={{ width: 18, height: 18, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, padding: "12px 12px 6px", fontSize: 13.5, fontWeight: 800 }}>
              <span>Your two cents</span>
              <span style={{ color: c.blue, fontWeight: 700, fontSize: 11.5, whiteSpace: "nowrap" }}>7 free left</span>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "0 12px 8px" }}>
              <Tab selected={!posted} count={posted ? 0 : 1}>Drafts</Tab>
              <Tab selected={posted} count={posted ? 1 : 0}>Posted</Tab>
            </div>

            <div style={{ padding: "0 12px 12px" }}>
              <article style={{ minWidth: 0, background: c.card, borderRadius: 14, padding: "10px 11px", display: "grid", gap: 7, border: `1px solid ${c.line}`, boxShadow: "0 4px 14px rgba(17,54,108,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 999, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11, flexShrink: 0, background: c.blueSoft, color: c.blueDeep }}>
                    {initials(POST.name)}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{POST.name}</span>
                    <span style={{ display: "block", fontSize: 10.5, color: c.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {POST.headline} · {POST.age}
                    </span>
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999, background: "#e7f6ec", color: "#11743a", flexShrink: 0, whiteSpace: "nowrap" }}>
                    Fresh
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.4, color: c.muted }}>{POST.snippet}</p>
                <div style={{ minWidth: 0, background: c.bubble, borderRadius: 11, padding: "8px 10px", display: "grid", gap: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: c.blue, letterSpacing: ".03em" }}>
                    {rewrite === null ? "YOUR COMMENT" : "REWRITTEN"}
                  </span>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, fontWeight: 500, color: typed ? c.ink : c.muted }}>
                    {typed || "Click the comment box to start a draft."}
                  </p>
                </div>
                {posted && (
                  <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8, background: c.bubble, border: "1px dashed #b9d2f3", borderRadius: 11, padding: "6px 6px 6px 9px", fontSize: 11.5, fontWeight: 600 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 999, background: c.blue, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Check light />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>Posted just now</span>
                    <span style={{ ...linkBtn, cursor: "default" }}>View</span>
                  </div>
                )}
              </article>
            </div>

            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(255,255,255,0.94)", borderTop: `1px solid ${c.line}`, fontSize: 11.5, color: c.muted }}>
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {posted ? "1 posted · it went up straight away" : "Approve a draft and it's posted straight away."}
              </span>
            </div>
          </div>
        </div>
      </BrowserFrame>

      <style>{`
        .tc-split { display: grid; grid-template-columns: minmax(0, 1fr) 340px; min-height: 500px; }
        @media (max-width: 880px) {
          .tc-split { grid-template-columns: minmax(0, 1fr); }
          .tc-panel { border-left: 0 !important; border-top: 1px solid ${c.line}; }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   bits
   --------------------------------------------------------------------------- */
const cardBox: React.CSSProperties = {
  minWidth: 0,
  margin: "0 12px",
  background: c.card,
  border: `1px solid ${c.line}`,
  borderRadius: 14,
  padding: "10px 12px",
  boxShadow: "0 4px 14px rgba(17,54,108,0.07)",
};

const btn: React.CSSProperties = {
  height: 36,
  padding: "0 14px",
  whiteSpace: "nowrap",
  borderRadius: 999,
  border: `1px solid ${c.line2}`,
  background: c.card,
  fontSize: 12.5,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  color: c.ink,
  cursor: "pointer",
  fontFamily: font,
};

const linkBtn: React.CSSProperties = {
  border: 0,
  background: "transparent",
  color: c.blue,
  fontSize: 11.5,
  fontWeight: 700,
  padding: "2px 4px",
  borderRadius: 7,
  whiteSpace: "nowrap",
  cursor: "pointer",
  fontFamily: font,
};

function Tab({ selected, count, children }: { selected: boolean; count: number; children: React.ReactNode }) {
  return (
    <span
      style={{
        minHeight: 28, padding: "0 10px", borderRadius: 999,
        border: `1px solid ${selected ? c.blue : c.line2}`,
        background: selected ? c.blue : c.card,
        color: selected ? "#fff" : c.muted,
        fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5,
      }}
    >
      {children}
      <span
        style={{
          minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, fontSize: 10.5,
          display: "inline-grid", placeItems: "center",
          background: selected ? "rgba(255,255,255,0.22)" : c.blueSoft,
          color: selected ? "#fff" : c.blueDeep,
        }}
      >
        {count}
      </span>
    </span>
  );
}

function Check({ light }: { light?: boolean }) {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={light ? "#fff" : "currentColor"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
