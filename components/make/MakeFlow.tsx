"use client";

/**
 * Interactive walkthrough of the "Influencer Payment OS" Make.com automation —
 * two real scenarios (Campaign Monitor & Reminders, Invoice Generator) that run
 * against a Google Sheets "database" and send Gmail notifications. No backend
 * here — this replays the exact module sequence and the real, verified output
 * of a 2026-08-29 test run (see the project's README) so the numbers are real,
 * even though nothing is actually being sent.
 */

import { useEffect, useRef, useState } from "react";

type ScenarioKey = "monitor" | "invoice";

const c = {
  canvas: "#fbfaff",
  card: "#ffffff",
  border: "rgba(24,16,54,0.10)",
  ink: "#1c1530",
  muted: "#6b6480",
  faint: "#9a93ac",
  purple: "#6d28d9",
  purpleSoft: "#efe8fc",
  green: "#1a9e6b",
  greenSoft: "#e5f7ef",
  amber: "#b8791a",
  amberSoft: "#faf0dd",
  red: "#c0392b",
  redSoft: "#fbe9e7",
};

const ic = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  fx: "M9 3H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2M15 3h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-2",
  branch: "M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9",
  mail: "M4 4h16v16H4V4zM4 6l8 7 8-7",
  table: "M3 4h18v16H3V4zM3 10h18M9 4v16",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6",
  pdf: "M12 3v12m0 0l-4-4m4 4l4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  play: "M6 4l14 8-14 8V4z",
};

type Module = { label: string; sub: string; icon: string };

const SCENARIOS: Record<
  ScenarioKey,
  {
    name: string;
    id: string;
    trigger: string;
    modules: Module[];
    run: () => { summary: string; logs: LogLine[] };
  }
> = {
  monitor: {
    name: "Campaign Monitor & Reminders",
    id: "6090683",
    trigger: "Run once",
    modules: [
      { label: "Search Rows", sub: "open campaigns", icon: ic.search },
      { label: "Set Variables", sub: "reminder type + risk", icon: ic.fx },
      { label: "Router", sub: "7 branches", icon: ic.branch },
      { label: "Gmail", sub: "send template", icon: ic.mail },
      { label: "Update Row", sub: "status + risk", icon: ic.table },
      { label: "Add Row", sub: "Activity Log", icon: ic.list },
    ],
    run: () => ({
      summary: "9 emails sent — 2 critical · 2 overdue · 1 due-today · 1 three-day · 1 seven-day · 2 deliverables-approved",
      logs: [
        { tag: "CRITICAL", tone: "red", text: "Escalation email sent", campaign: "CAM-2026-004", detail: "₹18,000 · 35 days overdue" },
        { tag: "CRITICAL", tone: "red", text: "Escalation email sent", campaign: "CAM-2026-005", detail: "₹85,000 · 24 days overdue" },
        { tag: "OVERDUE", tone: "amber", text: "Reminder sent", campaign: "CAM-2026-006", detail: "₹25,000 · 7 days overdue" },
        { tag: "OVERDUE", tone: "amber", text: "Reminder sent", campaign: "CAM-2026-007", detail: "₹12,000 · 3 days overdue" },
        { tag: "DUE TODAY", tone: "amber", text: "Reminder sent", campaign: "CAM-2026-008", detail: "₹40,000 · due today" },
        { tag: "3-DAY", tone: "purple", text: "Reminder sent", campaign: "CAM-2026-009", detail: "₹20,000 · due in 3 days" },
        { tag: "7-DAY", tone: "purple", text: "Reminder sent", campaign: "CAM-2026-010", detail: "₹1,20,000 · due in 7 days" },
        { tag: "APPROVED", tone: "green", text: "Deliverables-approved email sent", campaign: "CAM-2026-012", detail: "₹14,000" },
        { tag: "APPROVED", tone: "green", text: "Deliverables-approved email sent", campaign: "CAM-2026-013", detail: "₹45,000" },
      ],
    }),
  },
  invoice: {
    name: "Invoice Generator",
    id: "6090609",
    trigger: "Run once",
    modules: [
      { label: "Search Rows", sub: "approved + unbilled", icon: ic.search },
      { label: "Set Variables", sub: "INV-2026-NNN", icon: ic.fx },
      { label: "Google Docs", sub: "create from template", icon: ic.doc },
      { label: "Export PDF", sub: "to Drive", icon: ic.pdf },
      { label: "Update Row", sub: "invoice no. + date", icon: ic.table },
      { label: "Gmail", sub: "send + attach PDF", icon: ic.mail },
    ],
    run: () => ({
      summary: "2 invoices generated, PDF‑attached and emailed",
      logs: [
        { tag: "INV-2026-012", tone: "purple", text: "Invoice generated + emailed", campaign: "CAM-2026-012", detail: "Ishita Menon × Mamaearth · ₹14,000" },
        { tag: "INV-2026-013", tone: "purple", text: "Invoice generated + emailed", campaign: "CAM-2026-013", detail: "Rohan Bhatia × Noise · ₹45,000" },
      ],
    }),
  },
};

type LogLine = { tag: string; tone: "red" | "amber" | "green" | "purple"; text: string; campaign: string; detail: string };

const TONE: Record<LogLine["tone"], { fg: string; bg: string }> = {
  red: { fg: c.red, bg: c.redSoft },
  amber: { fg: c.amber, bg: c.amberSoft },
  green: { fg: c.green, bg: c.greenSoft },
  purple: { fg: c.purple, bg: c.purpleSoft },
};

export function MakeFlow() {
  const [tab, setTab] = useState<ScenarioKey>("monitor");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [shownLogs, setShownLogs] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = SCENARIOS[tab];
  const result = scenario.run();

  function reset(nextTab?: ScenarioKey) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("idle");
    setActiveIdx(-1);
    setShownLogs(0);
    if (nextTab) setTab(nextTab);
  }

  function run() {
    reset();
    setPhase("running");
    const stepMs = 320;
    scenario.modules.forEach((_, i) => {
      timers.current.push(setTimeout(() => setActiveIdx(i), i * stepMs));
    });
    timers.current.push(
      setTimeout(() => setPhase("done"), scenario.modules.length * stepMs + 150),
    );
  }

  useEffect(() => {
    if (phase !== "done") return;
    const logs = SCENARIOS[tab].run().logs;
    logs.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShownLogs((n) => Math.max(n, i + 1)), i * 160));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const railPct = phase === "idle" ? 0 : ((Math.max(activeIdx, 0) + 1) / scenario.modules.length) * 100;

  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        overflow: "hidden",
        background: c.card,
        boxShadow: "0 20px 46px -18px rgba(24,16,54,0.22)",
      }}
    >
      {/* tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${c.border}`, background: c.card, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => (
            <button
              key={k}
              onClick={() => reset(k)}
              style={{
                border: "none",
                background: tab === k ? c.purpleSoft : "none",
                color: tab === k ? c.purple : c.faint,
                fontWeight: 600,
                fontSize: 12.5,
                padding: "7px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "-apple-system, system-ui, sans-serif",
              }}
            >
              {SCENARIOS[k].name}
            </button>
          ))}
        </div>
        <span className="mono" style={{ fontSize: 10, color: c.faint }}>
          scenario #{scenario.id} · {scenario.trigger}
        </span>
      </div>

      {/* canvas */}
      <div
        style={{
          padding: "26px 18px 18px",
          background: c.canvas,
          backgroundImage: "radial-gradient(rgba(109,40,217,0.14) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          <div className="make-flow-row" style={{ display: "flex", alignItems: "flex-start", position: "relative", minWidth: 480 }}>
            {/* rail */}
            <div style={{ position: "absolute", top: 27, left: 27, right: 27, height: 2, background: c.border, zIndex: 0 }}>
              <div style={{ height: "100%", width: `${railPct}%`, background: c.purple, transition: "width .3s ease" }} />
            </div>

            {scenario.modules.map((m, i) => {
              const active = i <= activeIdx;
              const current = i === activeIdx && phase === "running";
              return (
                <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      background: active ? c.purple : "#fff",
                      border: `2px solid ${active ? c.purple : c.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? "#fff" : c.muted,
                      boxShadow: current ? `0 0 0 6px ${c.purpleSoft}` : "0 2px 6px rgba(24,16,54,0.06)",
                      transition: "all .25s ease",
                      flex: "none",
                    }}
                  >
                    <Icon d={m.icon} />
                  </div>
                  <div style={{ textAlign: "center", width: 84 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: c.ink }}>{m.label}</div>
                    <div className="mono" style={{ fontSize: 9, color: c.faint, marginTop: 1 }}>{m.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <button
            onClick={run}
            disabled={phase === "running"}
            style={{
              border: "none",
              background: c.purple,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              padding: "10px 20px",
              borderRadius: 99,
              cursor: phase === "running" ? "default" : "pointer",
              opacity: phase === "running" ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "-apple-system, system-ui, sans-serif",
            }}
          >
            <Icon d={ic.play} size={12} fill="#fff" />
            {phase === "running" ? "Running…" : phase === "done" ? "Run again" : "Run once"}
          </button>
        </div>
      </div>

      {/* output */}
      {phase === "done" && (
        <div style={{ borderTop: `1px solid ${c.border}`, padding: "16px 18px 18px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: c.ink, marginBottom: 12 }}>{result.summary}</div>
          <div className="mono" style={{ fontSize: 9.5, color: c.faint, letterSpacing: "0.05em", marginBottom: 8 }}>
            ACTIVITY LOG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
            {result.logs.slice(0, shownLogs).map((l, i) => {
              const tone = TONE[l.tone];
              return (
                <div
                  key={l.campaign + i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 10px",
                    borderRadius: 8,
                    background: "#fff",
                    border: `1px solid ${c.border}`,
                    animation: "make-log-in .3s ease both",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: tone.fg, background: tone.bg, borderRadius: 5, padding: "2px 6px", flex: "none" }}>
                    {l.tag}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: c.ink, flex: "none" }}>{l.campaign}</span>
                  <span style={{ fontSize: 11.5, color: c.muted }}>{l.text}</span>
                  <span style={{ fontSize: 11, color: c.faint, marginLeft: "auto" }}>{l.detail}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Icon({ d, size = 18, fill = "none" }: { d: string; size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
