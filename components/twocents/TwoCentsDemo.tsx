"use client";

/**
 * Interactive recreation of TwoCents — the Chrome side panel that drafts
 * LinkedIn comments in your voice while you scroll.
 *
 * The panel is ported from the extension's own stylesheet
 * (apps/extension/static/sidepanel.css) and its real markup, so this is the
 * product's actual interface rather than an impression of it. The people and
 * posts come from the repo's own marketing fixtures, which are explicitly
 * invented — no real person or post appears here.
 *
 * The feed on the left is deliberately generic, not a copy of LinkedIn's
 * interface; the product makes the same choice in its own marketing.
 *
 * Nothing here calls a backend and nothing calls a model: the rewrite
 * variants are written out ahead of time. It is a guided walk through the
 * real flow — notice a post, draft, rewrite, approve, schedule.
 */

import { useState } from "react";
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
  feedBg: "#eef1f5",
  postLine: "#e3e7ee",
};

const font = 'var(--font-jakarta), ui-sans-serif, system-ui, sans-serif';

/** the post TwoCents picks up — from the repo's invented fixtures */
const MATCH = {
  name: "Daniel Okafor",
  headline: "Founder, Fieldnote · B2B research tools",
  age: "32m",
  snippet:
    "We moved our pricing page from three plans to one. Conversions went up 18% in a month and billing tickets dropped by half. Simplicity beats choice more often than we think.",
  why: "matches your topic: pricing · 32 min old, 6 comments",
  slot: "12:25 PM",
};

const OTHERS = [
  {
    name: "Priya Raman",
    headline: "Head of Growth at Lumen Health",
    age: "2h",
    snippet:
      "Our onboarding emails were 9 messages long. We cut them to 3, each with one job. Activation went from 31% to 44%.",
  },
  {
    name: "Mei Tanaka",
    headline: "Design lead at Northwind Studio",
    age: "4h",
    snippet:
      "Hot take: your design system is a product, not a library. It needs a roadmap, office hours and a changelog people actually read.",
  },
];

/** the drafted comment, plus the one-tap rewrites the panel offers */
const ORIGINAL =
  "did revenue per customer hold up too, or did some of the old top tier folks end up paying less";

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

const initials = (n: string) =>
  n.split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export function TwoCentsDemo() {
  const [open, setOpen] = useState(false);
  const [rewrite, setRewrite] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(ORIGINAL);
  const [scheduled, setScheduled] = useState(false);

  const applyRewrite = (i: number) => {
    setRewrite(i);
    setText(REWRITES[i].text);
    setEditing(false);
  };
  const undo = () => {
    setRewrite(null);
    setText(ORIGINAL);
    setEditing(false);
  };
  const reset = () => {
    setOpen(false);
    setScheduled(false);
    undo();
  };

  return (
    <div style={{ fontFamily: font, color: c.ink }}>
      <BrowserFrame url="linkedin.com/feed" minHeight={500}>
        <div className="tc-split">
          {/* ---- the feed. deliberately generic: this is not LinkedIn's UI ---- */}
          <div className="tc-feed" style={{ background: c.feedBg, padding: 16, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <FeedPost post={OTHERS[0]} className="tc-feed-extra" />
            <FeedPost post={MATCH} matched />
            <FeedPost post={OTHERS[1]} className="tc-feed-extra" />
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
            {/* header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span
                  style={{
                    width: 28, height: 28, borderRadius: 9, display: "grid", placeItems: "center", flexShrink: 0,
                    background: "linear-gradient(145deg,#2f86f6,#0b4fb3)", color: "#fff", fontWeight: 800, fontSize: 11.5,
                    boxShadow: "0 4px 10px rgba(20,102,216,0.3)",
                  }}
                >
                  2¢
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>TwoCents</span>
              </div>
              <span aria-hidden style={iconBtn}>
                <Gear />
              </span>
            </div>

            {/* status */}
            <div style={{ ...cardBox, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#16a34a", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>Reading as you scroll</div>
                <div style={{ color: c.muted, fontSize: 11.5 }}>14 posts seen · 6 drafted</div>
              </div>
              <span
                aria-hidden
                style={{ width: 40, height: 24, flexShrink: 0, borderRadius: 12, padding: 3, display: "flex", justifyContent: "flex-end", background: c.blue }}
              >
                <span style={{ width: 18, height: 18, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
              </span>
            </div>

            {/* section head + tabs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, padding: "12px 12px 6px", fontSize: 13.5, fontWeight: 800 }}>
              <span>Worth your two cents</span>
              <span style={{ color: c.blue, fontWeight: 700, fontSize: 11.5, whiteSpace: "nowrap" }}>3 free left</span>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "0 12px 8px" }}>
              <Tab selected={!scheduled} count={scheduled ? 0 : 1}>Drafts</Tab>
              <Tab selected={scheduled} count={scheduled ? 1 : 0}>Scheduled</Tab>
            </div>

            {/* the card */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 8, padding: "0 12px 12px" }}>
              <article
                style={{
                  minWidth: 0, background: c.card, borderRadius: 14, padding: "10px 11px",
                  display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 7,
                  border: open && !scheduled ? `1.5px solid ${c.focus}` : `1px solid ${c.line}`,
                  boxShadow: "0 4px 14px rgba(17,54,108,0.07)",
                }}
              >
                {/* who */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 999, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11, flexShrink: 0, background: c.blueSoft, color: c.blueDeep }}>
                    {initials(MATCH.name)}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{MATCH.name}</span>
                    <span style={{ display: "block", fontSize: 10.5, color: c.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {MATCH.headline} · {MATCH.age}
                    </span>
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999, background: "#e7f6ec", color: "#11743a", flexShrink: 0, whiteSpace: "nowrap" }}>
                    Fresh
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.4, color: c.muted }}>{MATCH.snippet}</p>
                <p style={{ margin: 0, fontSize: 11, color: c.muted }}>
                  <span style={{ fontWeight: 700, color: c.blue }}>Why this post</span> {MATCH.why}
                </p>

                {!open && !scheduled && (
                  <button onClick={() => setOpen(true)} style={{ ...btn, height: 30, fontSize: 12, color: c.blue }}>
                    See draft
                  </button>
                )}

                {open && !scheduled && (
                  <>
                    {/* the comment */}
                    <div style={{ minWidth: 0, background: c.bubble, borderRadius: 11, padding: "8px 10px", display: "grid", gap: 3 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: c.blue, letterSpacing: ".03em" }}>
                          {rewrite === null ? "YOUR COMMENT" : "REWRITTEN"}
                        </span>
                        {rewrite !== null && (
                          <button onClick={undo} style={linkBtn}>Undo</button>
                        )}
                      </div>
                      {editing ? (
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={3}
                          aria-label="Edit the comment"
                          style={{
                            width: "100%", resize: "none", border: `1px solid ${c.focus}`, borderRadius: 9,
                            padding: "7px 9px", background: c.card, fontSize: 13, fontFamily: font, color: c.ink,
                          }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, fontWeight: 500 }}>{text}</p>
                      )}
                    </div>

                    {/* one-tap rewrites */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {REWRITES.map((r, i) => (
                        <button
                          key={r.label}
                          onClick={() => applyRewrite(i)}
                          aria-pressed={rewrite === i}
                          style={{
                            minHeight: 24, padding: "0 9px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                            whiteSpace: "nowrap", cursor: "pointer",
                            border: `1px solid ${rewrite === i ? c.blue : c.line2}`,
                            background: rewrite === i ? c.blueSoft : c.card,
                            color: rewrite === i ? c.blueDeep : c.muted,
                          }}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>

                    {/* skip · edit · approve */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <button onClick={reset} style={{ ...btn, border: "1px solid transparent", background: "transparent", color: c.muted, padding: "0 8px" }}>
                        Skip
                      </button>
                      <button onClick={() => setEditing((v) => !v)} style={btn}>
                        {editing ? "Done" : "Edit"}
                      </button>
                      <button
                        onClick={() => { setScheduled(true); setEditing(false); }}
                        style={{
                          ...btn, flex: "1 1 130px", border: 0, color: "#fff", fontWeight: 700,
                          background: "linear-gradient(180deg,#2179ea,#1061cf)", boxShadow: "0 4px 12px rgba(20,102,216,0.28)",
                        }}
                      >
                        <Check />
                        <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1 }}>
                          Approve
                          <small style={{ fontSize: 9.5, fontWeight: 600, opacity: 0.85, whiteSpace: "nowrap" }}>posts {MATCH.slot}</small>
                        </span>
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: -3, fontSize: 11, flexWrap: "wrap" }}>
                      <span style={{ color: c.muted, fontSize: 10.5 }}>Early comments get seen more.</span>
                      <span style={{ ...linkBtn, cursor: "default" }}>Post now</span>
                    </div>
                  </>
                )}

                {scheduled && (
                  <>
                    <div style={{ minWidth: 0, background: c.bubble, borderRadius: 11, padding: "8px 10px", display: "grid", gap: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: c.blue, letterSpacing: ".03em" }}>YOUR COMMENT</span>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, fontWeight: 500 }}>{text}</p>
                    </div>
                    <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8, background: c.bubble, border: "1px dashed #b9d2f3", borderRadius: 11, padding: "6px 6px 6px 9px", fontSize: 11.5, fontWeight: 600 }}>
                      <span style={{ width: 20, height: 20, borderRadius: 999, background: c.blue, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Check light />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>Posts automatically at {MATCH.slot}</span>
                      <button onClick={reset} style={linkBtn}>Undo</button>
                    </div>
                  </>
                )}
              </article>
            </div>

            {/* footer */}
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(255,255,255,0.94)", borderTop: `1px solid ${c.line}`, fontSize: 11.5, color: c.muted }}>
              <Clock />
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {scheduled ? `1 scheduled · next posts at ${MATCH.slot}` : "Approved comments post automatically at your times."}
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
          .tc-feed-extra { display: none !important; }
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
  padding: "0 12px",
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

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  border: `1px solid ${c.line}`,
  background: c.card,
  display: "grid",
  placeItems: "center",
  color: c.ink,
  flexShrink: 0,
};

function FeedPost({
  post,
  matched,
  className,
}: {
  post: { name: string; headline: string; age: string; snippet: string };
  matched?: boolean;
  className?: string;
}) {
  return (
    <article
      className={className}
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 9,
        border: `1px solid ${c.postLine}`,
        minWidth: 0,
        outline: matched ? `3px solid rgba(20,102,216,0.55)` : undefined,
        outlineOffset: matched ? 2 : undefined,
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
        <span style={{ width: 36, height: 36, borderRadius: 999, background: "#dfe6ef", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12.5, color: "#55657a", flexShrink: 0 }}>
          {initials(post.name)}
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#1d2633" }}>{post.name}</span>
          <span style={{ display: "block", fontSize: 11.5, color: "#6a778a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {post.headline} · {post.age}
          </span>
        </span>
        {matched && (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: c.blueDeep, background: c.blueSoft, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 }}>
            noticed
          </span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#2b3644" }}>{post.snippet}</p>
      <div style={{ display: "flex", gap: 20, fontSize: 12, fontWeight: 600, color: "#6a778a", borderTop: "1px solid #edf0f4", paddingTop: 9 }}>
        <span>Like</span>
        <span>Comment</span>
        <span>Repost</span>
      </div>
    </article>
  );
}

function Tab({ selected, count, children }: { selected: boolean; count: number; children: React.ReactNode }) {
  return (
    <span
      style={{
        minHeight: 28,
        padding: "0 10px",
        borderRadius: 999,
        border: `1px solid ${selected ? c.blue : c.line2}`,
        background: selected ? c.blue : c.card,
        color: selected ? "#fff" : c.muted,
        fontSize: 12,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
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
    <svg aria-hidden width={light ? 12 : 13} height={light ? 12 : 13} viewBox="0 0 24 24" fill="none" stroke={light ? "#fff" : "currentColor"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Gear() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

function Clock() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.blue} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
