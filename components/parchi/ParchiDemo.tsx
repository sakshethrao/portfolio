"use client";

/**
 * Interactive walkthrough of Parchi — upload a payment screenshot, watch OCR
 * pull the details out of it, then see it land on the dashboard. The "screenshot"
 * is an illustration (styled like a UPI payment confirmation), not a real one;
 * nothing here calls a backend — it's a guided demo of the real flow and the
 * real fields the app extracts (see lib/ocr/parse-receipt.ts).
 */

import { useEffect, useState } from "react";
import { BrowserFrame } from "@/components/BrowserFrame";

type Step = "upload" | "reading" | "extracted" | "dashboard";

const c = {
  bg: "#fafafb",
  card: "#ffffff",
  border: "rgba(18,18,18,0.09)",
  ink: "#18181b",
  muted: "#71717a",
  faint: "#a1a1aa",
  primary: "#6d4fe8",
  primarySoft: "#efeafe",
  success: "#1fa971",
  successSoft: "#e6f7ef",
  warning: "#c98a1f",
  warningSoft: "#fbf1de",
};

const FIELDS = [
  { label: "Payment app", value: "Google Pay", delay: 0 },
  { label: "Amount", value: "₹450.00", delay: 0.12 },
  { label: "From", value: "Ramesh Kumar", delay: 0.24 },
  { label: "UPI ID", value: "ramesh.k@okhdfcbank", delay: 0.36 },
  { label: "Bank", value: "HDFC Bank", delay: 0.48 },
  { label: "UTR", value: "234567891234", delay: 0.6 },
];

export function ParchiDemo() {
  const [step, setStep] = useState<Step>("upload");
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (step !== "reading") return;
    const t = setTimeout(() => setStep("extracted"), 1100);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <BrowserFrame url="app.parchi.in/upload" height={430}>
      <div style={{ minHeight: "100%", background: c.bg, fontFamily: "-apple-system, system-ui, sans-serif", position: "relative" }}>
        {/* tab strip */}
        <div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", gap: 4, padding: "10px 14px 0", borderBottom: `1px solid ${c.border}`, background: c.card }}>
          {(["upload", "dashboard"] as const).map((t) => {
            const active = step === "dashboard" ? t === "dashboard" : t === "upload";
            return (
              <button
                key={t}
                onClick={() => setStep(t === "dashboard" && !logged ? "upload" : t)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "8px 14px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: active ? c.ink : c.faint,
                  borderBottom: active ? `2px solid ${c.primary}` : "2px solid transparent",
                  fontFamily: "inherit",
                }}
              >
                {t === "upload" ? "Upload" : "Dashboard"}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 18 }}>
          {step !== "dashboard" ? (
            <UploadFlow step={step} onDrop={() => setStep("reading")} onLog={() => { setLogged(true); setStep("dashboard"); }} />
          ) : (
            <Dashboard onReset={() => setStep("upload")} />
          )}
        </div>
      </div>
    </BrowserFrame>
  );
}

function UploadFlow({
  step,
  onDrop,
  onLog,
}: {
  step: Step;
  onDrop: () => void;
  onLog: () => void;
}) {
  return (
    <div className="parchi-upload-flow" style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1fr)", gap: 18, minHeight: 340 }}>
      {/* left: the "screenshot" */}
      <div
        onClick={step === "upload" ? onDrop : undefined}
        style={{
          border: step === "upload" ? `1.5px dashed ${c.primary}66` : `1px solid ${c.border}`,
          borderRadius: 12,
          background: c.card,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          cursor: step === "upload" ? "pointer" : "default",
          padding: 16,
          position: "relative",
        }}
      >
        {step === "upload" && (
          <div className="mono" style={{ position: "absolute", top: 10, left: 12, fontSize: 9.5, color: c.faint, letterSpacing: "0.04em" }}>
            DROP A SCREENSHOT
          </div>
        )}
        <PaymentReceipt dim={step !== "upload"} />
        {step === "upload" && (
          <button
            style={{
              border: "none",
              background: c.primary,
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "9px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Process screenshot →
          </button>
        )}
        {step === "reading" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: c.muted }}>
            <Spinner /> Reading image…
          </div>
        )}
        {step === "extracted" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: c.success, fontWeight: 600 }}>
            ✓ Text extracted
          </div>
        )}
      </div>

      {/* right: extracted fields */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="mono" style={{ fontSize: 10, color: c.faint, letterSpacing: "0.05em", marginBottom: 10 }}>
          EXTRACTED FIELDS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
          {FIELDS.map((f, i) => {
            const shown = step === "extracted";
            return (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: i < FIELDS.length - 1 ? `1px solid ${c.border}` : "none",
                  opacity: shown ? 1 : 0,
                  transform: shown ? "translateY(0)" : "translateY(4px)",
                  transition: `opacity .35s ease ${f.delay}s, transform .35s ease ${f.delay}s`,
                }}
              >
                <span style={{ fontSize: 12, color: c.muted }}>{f.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: c.ink }}>{f.value}</span>
              </div>
            );
          })}
        </div>

        {step === "extracted" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 99, background: c.border, overflow: "hidden" }}>
                <div style={{ width: "92%", height: "100%", background: c.success, borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: c.success }}>92% confident</span>
            </div>
            <button
              onClick={onLog}
              style={{
                border: "none",
                background: c.ink,
                color: "#fff",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Log transaction →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentReceipt({ dim }: { dim: boolean }) {
  return (
    <div
      style={{
        width: 176,
        borderRadius: 14,
        background: "linear-gradient(180deg,#ffffff,#f7f7fb)",
        border: `1px solid ${c.border}`,
        boxShadow: "0 6px 20px -8px rgba(18,18,18,0.12)",
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: dim ? 0.55 : 1,
        transition: "opacity .3s ease",
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.successSoft, display: "flex", alignItems: "center", justifyContent: "center", color: c.success, fontSize: 18 }}>
        ✓
      </div>
      <div style={{ fontSize: 10.5, color: c.muted, fontWeight: 600 }}>Payment received</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: c.ink }}>₹450</div>
      <div style={{ fontSize: 10.5, color: c.muted }}>from Ramesh Kumar</div>
      <div style={{ width: "100%", borderTop: `1px dashed ${c.border}`, margin: "6px 0" }} />
      <div className="mono" style={{ fontSize: 8.5, color: c.faint, textAlign: "center", lineHeight: 1.6 }}>
        UPI · ramesh.k@okhdfcbank
        <br />
        UTR 234567891234 · 4:32 PM
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 13,
        height: 13,
        borderRadius: "50%",
        border: `2px solid ${c.border}`,
        borderTopColor: c.primary,
        display: "inline-block",
        animation: "parchi-spin .7s linear infinite",
      }}
    />
  );
}

const STATS = [
  { label: "Today's Revenue", base: 2840, add: 450, accent: "primary" as const },
  { label: "Transactions", base: 11, add: 1, accent: "primary" as const },
  { label: "Pending Review", base: 2, add: 0, accent: "warning" as const },
];

const WEEK = [40, 55, 35, 70, 50, 65, 90];

function Dashboard({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 340 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color: c.muted, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c.ink, marginTop: 4 }}>
              {s.label === "Today's Revenue" ? `₹${(s.base + s.add).toLocaleString("en-IN")}` : s.base + s.add}
            </div>
            {s.add > 0 && (
              <div style={{ fontSize: 10, color: s.accent === "warning" ? c.warning : c.success, fontWeight: 600, marginTop: 2 }}>
                +{s.label === "Today's Revenue" ? `₹${s.add}` : s.add} just now
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "flex-end", gap: 6, height: 70 }}>
        {WEEK.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${v}%`,
              borderRadius: 3,
              background: i === WEEK.length - 1 ? c.primary : c.primarySoft,
            }}
          />
        ))}
      </div>

      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "4px 0", flex: 1, overflow: "hidden" }}>
        <div className="mono" style={{ fontSize: 9.5, color: c.faint, letterSpacing: "0.05em", padding: "6px 14px" }}>
          RECENT TRANSACTIONS
        </div>
        <Row name="Ramesh Kumar" amount="₹450.00" tag="Just now" tagColor={c.success} />
        <Row name="Priya Verma" amount="₹120.00" tag="1h ago" />
        <Row name="Suresh Traders" amount="₹2,300.00" tag="Yesterday" />
      </div>

      <button
        onClick={onReset}
        className="mono"
        style={{ alignSelf: "flex-start", border: "none", background: "none", color: c.muted, fontSize: 11, cursor: "pointer", textDecoration: "underline", padding: 0 }}
      >
        ← upload another
      </button>
    </div>
  );
}

function Row({ name, amount, tag, tagColor }: { name: string; amount: string; tag: string; tagColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 14px", fontSize: 12 }}>
      <span style={{ color: c.ink, fontWeight: 500 }}>{name}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: tagColor ?? c.faint }}>{tag}</span>
        <span style={{ fontWeight: 600, color: c.ink }}>{amount}</span>
      </span>
    </div>
  );
}
