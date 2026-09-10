"use client";

/**
 * Interactive preview of Nurture — a two-sided marketplace connecting working
 * parents with verified nannies (built with Next.js + Supabase).
 *
 * These are faithful re-creations of real screens from the app, using its own
 * design tokens (Stitch "Nurture & Trust" system: sage green on warm cream,
 * Plus Jakarta Sans, very rounded, verification-forward). Tap the bottom bar to
 * move between screens. Nothing here calls a backend — it's a guided walk.
 */

import { useEffect, useState } from "react";
import { DeviceFrame } from "@/components/DeviceFrame";

type Screen = "welcome" | "matching" | "browse" | "profile" | "learn";

const c = {
  cream: "#fbf9f1",
  white: "#ffffff",
  sLow: "#f5f4ec",
  sMed: "#f0eee6",
  sHigh: "#eae8e0",
  ink: "#1b1c17",
  inkVar: "#424940",
  line: "#e4e3db",
  outline: "#c2c9bd",
  primary: "#3f6840",
  sage: "#7da87b",
  sageSoft: "#c1eebc",
  onPrimaryContainer: "#153c1a",
  blue: "#c8e8f3",
  onBlue: "#3c5a63",
  peach: "#fcdccc",
  tan: "#71594d",
  error: "#ba1a1a",
};

const font = "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif";

export function NurturePreview({ scale = 0.92 }: { scale?: number }) {
  const [screen, setScreen] = useState<Screen>("welcome");

  return (
    <div style={{ width: 320 * scale, position: "relative" }}>
      <DeviceFrame scale={scale}>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: c.cream,
            color: c.ink,
            fontFamily: font,
            letterSpacing: "-0.005em",
          }}
        >
          <div
            key={screen}
            className="nrt-screen"
            style={{ flex: 1, overflowY: "auto", position: "relative" }}
          >
            {screen === "welcome" && <Welcome go={setScreen} />}
            {screen === "matching" && <Matching done={() => setScreen("browse")} />}
            {screen === "browse" && <Browse open={() => setScreen("profile")} go={setScreen} />}
            {screen === "profile" && <Profile back={() => setScreen("browse")} />}
            {screen === "learn" && <Learn go={setScreen} />}
          </div>

          {screen === "profile" && <ProfileActionBar />}
          {screen !== "welcome" && screen !== "profile" && (
            <BottomNav screen={screen} onNav={setScreen} />
          )}
        </div>
      </DeviceFrame>
    </div>
  );
}

/* ---------------------------------------------------------------- primitives */

function Pill({
  children,
  tone = "primary",
  onClick,
  disabled,
  full,
}: {
  children: React.ReactNode;
  tone?: "primary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
}) {
  const primary = tone === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        cursor: disabled ? "default" : "pointer",
        width: full ? "100%" : undefined,
        padding: "11px 18px",
        borderRadius: 999,
        fontFamily: font,
        fontWeight: 600,
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: disabled ? c.sHigh : primary ? c.primary : c.sMed,
        color: disabled ? c.inkVar : primary ? "#fff" : c.ink,
        opacity: disabled ? 0.75 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Chip({
  children,
  tone = "surface",
}: {
  children: React.ReactNode;
  tone?: "surface" | "blue" | "sage";
}) {
  const map = {
    surface: { bg: c.sMed, fg: c.inkVar },
    blue: { bg: c.blue, fg: c.onBlue },
    sage: { bg: c.sageSoft, fg: c.onPrimaryContainer },
  }[tone];
  return (
    <span
      style={{
        background: map.bg,
        color: map.fg,
        fontSize: 10.5,
        fontWeight: 600,
        padding: "4px 9px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Monogram({
  name,
  radius = 0,
  size = "100%",
  fontSize = 34,
}: {
  name: string;
  radius?: number;
  size?: number | string;
  fontSize?: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${c.sage}, ${c.primary})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

/* icons — minimal inline set */
function I({ d, fill = "none", stroke, w = 16 }: { d: string; fill?: string; stroke?: string; w?: number }) {
  return (
    <svg width={w} height={w} viewBox="0 0 24 24" fill={fill} stroke={stroke ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
const ic = {
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  arrowR: "M5 12h14M13 5l7 7-7 7",
  arrowL: "M19 12H5M11 19l-7-7 7-7",
  check: "M20 6L9 17l-5-5",
  checkC: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
};

/* ---------------------------------------------------------------- screens */

function Welcome({ go }: { go: (s: Screen) => void }) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "18px 20px 24px",
        background: `linear-gradient(180deg, ${c.cream} 0%, #ffffff 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -60, left: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(125,168,123,0.22)", filter: "blur(50px)" }} />
      <div style={{ position: "absolute", bottom: 20, right: -70, width: 200, height: 200, borderRadius: "50%", background: "rgba(252,220,204,0.5)", filter: "blur(55px)" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 26, position: "relative" }}>
        <div style={{ position: "relative", width: 190, aspectRatio: "4 / 5", borderRadius: 26, background: `linear-gradient(150deg, ${c.sageSoft}, ${c.sage})`, boxShadow: "0 12px 34px rgba(63,104,64,0.18)" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(63,104,64,0.2)", color: c.primary }}>
              <I d={ic.heart} w={30} />
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: c.primary, letterSpacing: "-0.02em" }}>Welcome to Nurture</div>
          <div style={{ fontSize: 14, color: c.inkVar, marginTop: 8, lineHeight: 1.5 }}>Peace of mind for working parents.</div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <Pill full onClick={() => go("matching")}>
          Get started <I d={ic.arrowR} w={15} />
        </Pill>
        <div style={{ textAlign: "center", fontSize: 12, color: c.inkVar, marginTop: 14 }}>
          Already have an account?{" "}
          <button onClick={() => go("browse")} style={{ border: "none", background: "none", color: c.primary, fontWeight: 700, cursor: "pointer", fontFamily: font, fontSize: 12 }}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

const MATCH_STEPS = [
  { label: "Location scanning", detail: "Finding professionals within 5 km" },
  { label: "Experience matching", detail: "Filtering by age-group expertise" },
  { label: "Safety verification", detail: "Verifying certifications & background checks" },
];

function Matching({ done }: { done: () => void }) {
  const [step, setStep] = useState(0);
  const finished = step >= MATCH_STEPS.length;

  useEffect(() => {
    if (finished) return;
    const t = setTimeout(() => setStep((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [step, finished]);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", gap: 4, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, left: -50, width: 170, height: 170, borderRadius: "50%", background: "rgba(193,238,188,0.35)", filter: "blur(45px)" }} />

      <div style={{ position: "relative", width: 150, height: 150, marginBottom: 22 }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${c.sage}`, animation: "nrt-ping 2s ease-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, animation: "nrt-spin 9s linear infinite" }}>
          {["A", "R", "M"].map((m, i) => (
            <div
              key={m}
              style={{
                position: "absolute",
                top: i === 0 ? 0 : "auto",
                bottom: i === 1 ? 6 : "auto",
                left: i === 2 ? 0 : i === 0 ? "50%" : "auto",
                right: i === 1 ? 8 : "auto",
                transform: i === 0 ? "translateX(-50%)" : undefined,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${c.sage}, ${c.primary})`,
                border: "2px solid #fff",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "nrt-spin-rev 9s linear infinite",
              }}
            >
              {m}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", boxShadow: "0 8px 24px rgba(63,104,64,0.16)", display: "flex", alignItems: "center", justifyContent: "center", color: c.primary }}>
          <I d={ic.shield} w={26} />
        </div>
      </div>

      <div style={{ fontSize: 19, fontWeight: 700, textAlign: "center", lineHeight: 1.3, maxWidth: 240 }}>
        {finished ? "3 great matches near you" : "Finding the safest nanny near you…"}
      </div>
      <div style={{ fontSize: 12.5, color: c.inkVar, textAlign: "center", marginTop: 6, marginBottom: 22 }}>
        {finished ? "Ranked by fit, distance and verification." : "Checking certifications & background checks…"}
      </div>

      <div style={{ width: "100%", maxWidth: 260, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", borderRadius: 18, padding: 14, boxShadow: "0 6px 24px rgba(63,104,64,0.1)" }}>
        {MATCH_STEPS.map((s, i) => {
          const state = i < step ? "done" : i === step ? "active" : "todo";
          return (
            <div key={s.label} style={{ display: "flex", gap: 10, padding: "6px 0", alignItems: "flex-start" }}>
              <span style={{ marginTop: 1, color: state === "todo" ? c.outline : c.primary, animation: state === "active" ? "nrt-fade 0.9s ease infinite alternate" : undefined }}>
                <I d={state === "done" ? ic.checkC : ic.shield} w={16} fill={state === "done" ? "rgba(63,104,64,0.12)" : "none"} />
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: state === "todo" ? c.inkVar : c.ink }}>{s.label}</div>
                <div style={{ fontSize: 10.5, color: c.inkVar }}>{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {finished && (
        <div style={{ marginTop: 22, width: "100%", maxWidth: 260 }}>
          <Pill full onClick={done}>
            See your matches <I d={ic.arrowR} w={15} />
          </Pill>
        </div>
      )}
    </div>
  );
}

const NANNIES = [
  {
    name: "Anjali Sharma",
    age: 32,
    exp: "8+ yrs",
    dist: "1.2 km away",
    bio: "Specialises in newborn care and early-childhood nutrition.",
    rating: 4.9,
    reviews: 42,
    label: "High Match",
    chips: ["Verified", "Aadhaar", "CPR"],
  },
  {
    name: "Priya Patel",
    age: 45,
    exp: "15+ yrs",
    dist: "2.5 km away",
    bio: "Expert in toddler development and educational play. Fluent in English & Gujarati.",
    rating: 4.8,
    reviews: 63,
    label: null,
    chips: ["Verified", "Aadhaar"],
  },
  {
    name: "Neha Singh",
    age: 28,
    exp: "5+ yrs",
    dist: "0.8 km away",
    bio: "Passionate about early-childhood education, arts & crafts.",
    rating: 5.0,
    reviews: 19,
    label: null,
    chips: ["Verified"],
  },
];

function Header({ go, right }: { go: (s: Screen) => void; right?: React.ReactNode }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "rgba(251,249,241,0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${c.line}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden" }}>
          <Monogram name="Aarav Family" fontSize={11} />
        </div>
        <button onClick={() => go("welcome")} style={{ border: "none", background: "none", cursor: "pointer", fontFamily: font, fontSize: 17, fontWeight: 700, color: c.primary, letterSpacing: "-0.02em" }}>
          Nurture
        </button>
      </div>
      {right ?? (
        <span style={{ color: c.inkVar }}>
          <I d={ic.bell} w={17} />
        </span>
      )}
    </div>
  );
}

function Browse({ open, go }: { open: () => void; go: (s: Screen) => void }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <Header go={go} />
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: c.primary, letterSpacing: "-0.02em" }}>Top Matches for Aarav</div>
        <div style={{ fontSize: 12, color: c.inkVar, marginTop: 4 }}>3 highly qualified professionals in your area.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "12px 16px 0" }}>
        {NANNIES.map((n, i) => (
          <article key={n.name} style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 22px -6px rgba(63,104,64,0.12)" }}>
            <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
              <Monogram name={n.name} fontSize={40} />
              {n.label && (
                <span style={{ position: "absolute", left: 10, top: 10, background: c.primary, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 999 }}>{n.label}</span>
              )}
              <span style={{ position: "absolute", right: 10, top: 10, background: "rgba(255,255,255,0.94)", borderRadius: 999, padding: "3px 8px", display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700 }}>
                <span style={{ color: c.tan }}><I d={ic.star} w={11} fill="currentColor" /></span>
                {n.rating.toFixed(1)}
              </span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{n.name}</div>
                <div style={{ fontSize: 13, color: c.inkVar }}>{n.age}</div>
              </div>
              <div style={{ fontSize: 11, color: c.inkVar, marginTop: 2 }}>{n.exp} experience · {n.dist}</div>
              <p style={{ fontSize: 12.5, color: c.inkVar, lineHeight: 1.5, margin: "8px 0 10px" }}>{n.bio}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {n.chips.map((ch) => (
                  <Chip key={ch} tone={ch === "Verified" ? "sage" : "surface"}>
                    {ch === "Verified" && <I d={ic.shield} w={10} />}
                    {ch}
                  </Chip>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Pill tone="ghost" onClick={open} full>View profile</Pill>
                <Pill onClick={open} full>Book trial</Pill>
              </div>
            </div>
          </article>
        ))}
        {/* only Anjali has a full profile in this demo */}
        <div style={{ fontSize: 10.5, color: c.outline, textAlign: "center", padding: "4px 0 0" }}>
          demo — tap any “view profile”
        </div>
      </div>
    </div>
  );
}

function Profile({ back }: { back: () => void }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ position: "relative", aspectRatio: "1 / 1" }}>
        <Monogram name="Anjali Sharma" fontSize={64} />
        <button onClick={back} aria-label="Back" style={{ position: "absolute", left: 12, top: 12, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.ink }}>
          <I d={ic.arrowL} w={16} />
        </button>
        <span style={{ position: "absolute", right: 12, top: 12, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", color: c.ink }}>
          <I d={ic.share} w={15} />
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Anjali Sharma</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: c.inkVar, marginTop: 5 }}>
          <I d={ic.pin} w={13} /> Bandra West, Mumbai
          <span style={{ color: c.tan, display: "inline-flex", alignItems: "center", gap: 3, marginLeft: 6 }}>
            <I d={ic.star} w={12} fill="currentColor" /> 4.9 <span style={{ color: c.inkVar }}>(42 reviews)</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {[
            ["Experience", "10 Yrs"],
            ["Expected salary", "₹18k–22k"],
          ].map(([k, v]) => (
            <div key={k} style={{ flex: 1, background: c.sLow, borderRadius: 16, padding: "10px 12px" }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: c.inkVar }}>{k}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.primary, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

        <Section title="About Anjali">
          <p style={{ fontSize: 12.5, lineHeight: 1.6, color: c.inkVar, margin: 0 }}>
            Over a decade in childcare, specialising in infant and toddler development. I create a nurturing, safe and stimulating environment where children can thrive — structured learning through play, with a lot of patience.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {["Hindi", "English", "Marathi"].map((l) => <Chip key={l} tone="blue">{l}</Chip>)}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {["Infant Care", "Toddler Activities", "Light Cooking"].map((l) => <Chip key={l}>{l}</Chip>)}
          </div>
        </Section>

        <Section title="Verification status">
          {["Aadhaar verified", "Police verification cleared", "Reference checks passed"].map((v) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 12.5 }}>
              <span style={{ color: c.primary }}><I d={ic.checkC} w={15} fill="rgba(63,104,64,0.12)" /></span>
              {v}
            </div>
          ))}
        </Section>

        <Section title="Certifications">
          {[
            ["Pediatric First Aid & CPR", "Indian Red Cross · valid 2025"],
            ["Early Childhood Development", "NPTEL certificate · 2019"],
          ].map(([t, s]) => (
            <div key={t} style={{ display: "flex", gap: 10, padding: "6px 0", alignItems: "flex-start" }}>
              <span style={{ color: c.primary, marginTop: 1 }}><I d={ic.book} w={15} /></span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 10.5, color: c.inkVar }}>{s}</div>
              </div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

function ProfileActionBar() {
  return (
    <div
      style={{
        flex: "none",
        padding: "10px 14px 12px",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${c.line}`,
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${c.outline}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.primary, flex: "none" }}>
        <I d={ic.heart} w={15} />
      </span>
      <Pill full>Book 1-day trial · ₹800</Pill>
    </div>
  );
}

function Learn({ go }: { go: (s: Screen) => void }) {
  return (
    <div style={{ paddingBottom: 20 }}>
      <Header go={go} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: c.sage, color: c.onPrimaryContainer, borderRadius: 20, padding: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <I d={ic.shield} w={17} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
            Complete free courses to earn your Verified Badge — and get 2× more job matches.
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 16, boxShadow: "0 4px 20px -8px rgba(63,104,64,0.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Certification progress</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.primary }}>2/8</div>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.05em", color: c.inkVar }}>LESSONS DONE</div>
            </div>
          </div>
          <div style={{ height: 7, background: c.sHigh, borderRadius: 999, marginTop: 10, overflow: "hidden" }}>
            <div style={{ width: "25%", height: "100%", background: c.primary, borderRadius: 999 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            {[
              ["Basic Care", true],
              ["Safety First", true],
              ["Hygiene", false],
            ].map(([label, done], i) => (
              <div key={label as string} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: done ? c.primary : "#fff", border: `2px solid ${c.primary}`, color: done ? "#fff" : c.primary, fontSize: 11, fontWeight: 700 }}>
                  {done ? <I d={ic.check} w={12} /> : i + 1}
                </div>
                <div style={{ fontSize: 9.5, color: c.inkVar, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700 }}>Available courses</div>

        {[
          { t: "Baby Hygiene", min: "45 min", d: "Bathing, diapering and a healthy environment for infants.", cta: "Start lesson", locked: false, crit: false },
          { t: "Nutrition & Meal Prep", min: "60 min", d: "Age-appropriate meal planning, allergy awareness, positive eating habits.", cta: "Unlock next", locked: true, crit: false },
          { t: "Emergency Response (CPR)", min: "120 min", d: "Infant & child CPR, choking response, emergency protocols.", cta: "Unlock later", locked: true, crit: true },
        ].map((course) => (
          <div key={course.t} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px -8px rgba(63,104,64,0.1)" }}>
            <div style={{ height: 92, background: `linear-gradient(135deg, ${c.sLow}, ${c.sHigh})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: c.sage }}>
              <I d={ic.book} w={26} />
              <span style={{ position: "absolute", left: 10, top: 10, background: "rgba(255,255,255,0.9)", borderRadius: 999, padding: "3px 8px", fontSize: 9.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 3, color: c.inkVar }}>
                <I d={ic.clock} w={10} /> {course.min}
              </span>
              {course.crit && (
                <span style={{ position: "absolute", right: 10, top: 10, background: "#ffdad6", color: c.error, borderRadius: 999, padding: "3px 8px", fontSize: 9.5, fontWeight: 700 }}>Critical</span>
              )}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{course.t}</div>
              <p style={{ fontSize: 11.5, color: c.inkVar, lineHeight: 1.5, margin: "6px 0 12px" }}>{course.d}</p>
              <Pill full tone={course.locked ? "ghost" : "primary"} disabled={course.locked}>
                {course.locked && <I d={ic.lock} w={12} />} {course.cta}
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18, borderTop: `1px solid ${c.line}`, paddingTop: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: c.inkVar, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function BottomNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  const items: { key: Screen; label: string; d: string }[] = [
    { key: "matching", label: "Match", d: ic.spark },
    { key: "browse", label: "Search", d: ic.search },
    { key: "profile", label: "Saved", d: ic.user },
    { key: "learn", label: "Learn", d: ic.book },
  ];
  return (
    <nav
      style={{
        flex: "none",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 8px 10px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${c.line}`,
      }}
    >
      {items.map((it) => {
        const active = screen === it.key || (it.key === "browse" && screen === "profile");
        return (
          <button
            key={it.key}
            onClick={() => onNav(it.key)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: font,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 10px",
              borderRadius: 12,
              color: active ? c.primary : c.inkVar,
            }}
          >
            <span style={{ background: active ? c.sageSoft : "transparent", borderRadius: 999, padding: "3px 12px", display: "inline-flex" }}>
              <I d={it.d} w={16} fill={active ? "currentColor" : "none"} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 600 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
