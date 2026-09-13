"use client";

import { createContext, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The material kit. Everything on the desk is a real-ish surface now: matte
 * plastic, brushed metal, lens glass, paper, leather — all lit by the same
 * lights and environment, all casting shadows. Hovering an object warms it
 * with the accent colour (emissive) rather than drawing an outline.
 */
export const ItemCtx = createContext<{ hover: boolean; accent: string }>({ hover: false, accent: "#ff3b30" });

type V3 = [number, number, number];

export type SurfaceProps = {
  color?: string;
  roughness?: number;
  metalness?: number;
  /** MeshPhysical clearcoat 0–1 (glass, ceramic, leather) */
  clearcoat?: number;
  map?: THREE.Texture;
  /** self-lit surface (screens) — uses `map` as the emissive map */
  lit?: number;
  emissive?: string;
  emissiveIntensity?: number;
  envMapIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
};

export function Surface({
  color = "#ffffff",
  roughness = 0.5,
  metalness = 0,
  clearcoat,
  map,
  lit,
  emissive,
  emissiveIntensity,
  envMapIntensity = 1,
  transparent,
  opacity,
  side,
}: SurfaceProps) {
  // hover never touches the surfaces themselves — the object lifts and an
  // accent ring appears beneath it (see StudioScene's Item)
  const em = emissive ?? (lit ? "#ffffff" : "#000000");
  const emI = emissiveIntensity ?? (lit ?? 0);
  const common = {
    color,
    roughness,
    metalness,
    map,
    emissive: em,
    emissiveIntensity: emI,
    emissiveMap: lit ? map : undefined,
    envMapIntensity,
    transparent,
    opacity,
    side,
  };
  if (clearcoat !== undefined) {
    return <meshPhysicalMaterial {...common} clearcoat={clearcoat} clearcoatRoughness={0.12} />;
  }
  return <meshStandardMaterial {...common} />;
}

export function Box({
  args,
  radius,
  position,
  rotation,
  shadow = true,
  ...surf
}: { args: V3; radius?: number; position?: V3; rotation?: V3; shadow?: boolean } & SurfaceProps) {
  // a rounded box's radius must stay under half its thinnest side, or the
  // geometry inflates and swallows whatever sits on top of it
  const minDim = Math.min(...args);
  const r = Math.min(radius ?? 0.012, minDim * 0.45);
  if (r <= 0.0005) {
    return (
      <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
        <boxGeometry args={args} />
        <Surface {...surf} />
      </mesh>
    );
  }
  return (
    <RoundedBox args={args} radius={r} smoothness={4} position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <Surface {...surf} />
    </RoundedBox>
  );
}

export function Cyl({
  r,
  rTop,
  h,
  segments = 48,
  position,
  rotation,
  open = false,
  shadow = true,
  ...surf
}: { r: number; rTop?: number; h: number; segments?: number; position?: V3; rotation?: V3; open?: boolean; shadow?: boolean } & SurfaceProps) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, h, segments, 1, open]} />
      <Surface {...surf} />
    </mesh>
  );
}

export function Ball({ r, position, scale, ...surf }: { r: number; position?: V3; scale?: V3 } & SurfaceProps) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[r, 48, 32]} />
      <Surface {...surf} />
    </mesh>
  );
}

export function Plane({ w, h, position, rotation, ...surf }: { w: number; h: number; position?: V3; rotation?: V3 } & SurfaceProps) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[w, h]} />
      <Surface {...surf} />
    </mesh>
  );
}

export function Torus({ r, tube, position, rotation, arc, ...surf }: { r: number; tube: number; position?: V3; rotation?: V3; arc?: number } & SurfaceProps) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <torusGeometry args={[r, tube, 16, 64, arc ?? Math.PI * 2]} />
      <Surface {...surf} />
    </mesh>
  );
}

/** a cable / stem along a smooth curve */
export function Tube({ points, r, ...surf }: { points: V3[]; r: number } & SurfaceProps) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curve, 40, r, 10, false]} />
      <Surface {...surf} />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
   Procedural textures (canvas → texture). No files, no downloads.
   --------------------------------------------------------------------------- */
function makeTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/** seeded pseudo-random, so the wood looks the same on every visit */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function useWoodTexture() {
  return useMemo(
    () =>
      makeTexture(1024, 1024, (ctx, w, h) => {
        const rand = rng(7);
        ctx.fillStyle = "#cdb08a";
        ctx.fillRect(0, 0, w, h);
        // long grain streaks with a gentle wobble
        for (let i = 0; i < 420; i++) {
          const y = rand() * h;
          const dark = rand() > 0.5;
          ctx.strokeStyle = dark ? `rgba(120,78,40,${0.05 + rand() * 0.14})` : `rgba(235,205,160,${0.05 + rand() * 0.12})`;
          ctx.lineWidth = 0.6 + rand() * 2.4;
          ctx.beginPath();
          const amp = 2 + rand() * 6;
          const freq = 0.004 + rand() * 0.008;
          const ph = rand() * 10;
          ctx.moveTo(0, y);
          for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin(x * freq + ph) * amp);
          ctx.stroke();
        }
        // fine noise
        for (let i = 0; i < 26000; i++) {
          ctx.fillStyle = rand() > 0.5 ? "rgba(90,55,25,0.05)" : "rgba(255,235,200,0.05)";
          ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
        }
        // a couple of soft, wide colour bands (plank variation)
        for (let i = 0; i < 5; i++) {
          const y = rand() * h;
          const g = ctx.createLinearGradient(0, y - 90, 0, y + 90);
          g.addColorStop(0, "rgba(0,0,0,0)");
          g.addColorStop(0.5, `rgba(${rand() > 0.5 ? "150,100,55" : "230,200,150"},0.10)`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, y - 90, w, 180);
        }
      }),
    [],
  );
}

/** Parchi's dashboard, drawn — what's on the laptop */
export function useLaptopScreen() {
  return useMemo(
    () =>
      makeTexture(1024, 640, (ctx, w, h) => {
        const purple = "#6d4fe8";
        ctx.fillStyle = "#f6f6f8";
        ctx.fillRect(0, 0, w, h);
        // sidebar
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 200, h);
        ctx.fillStyle = "#e6e6ea";
        ctx.fillRect(200, 0, 1, h);
        ctx.fillStyle = purple;
        ctx.fillRect(28, 30, 32, 32);
        ctx.fillStyle = "#18181b";
        ctx.font = "bold 24px system-ui, sans-serif";
        ctx.fillText("Parchi", 72, 54);
        ["Dashboard", "Upload", "Customers", "Reports"].forEach((t, i) => {
          ctx.fillStyle = i === 0 ? "#efeafe" : "transparent";
          ctx.fillRect(18, 100 + i * 46, 164, 36);
          ctx.fillStyle = i === 0 ? purple : "#71717a";
          ctx.font = "17px system-ui, sans-serif";
          ctx.fillText(t, 34, 124 + i * 46);
        });
        // top bar
        ctx.fillStyle = "#18181b";
        ctx.font = "bold 28px system-ui, sans-serif";
        ctx.fillText("Today", 236, 56);
        ctx.fillStyle = "#71717a";
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText("Sharma General Store · UPI ledger", 236, 84);
        // stat cards
        const cards = [
          ["₹12,450", "Today's revenue", purple],
          ["38", "Payments logged", "#1fa971"],
          ["3", "Pending review", "#c98a1f"],
        ];
        cards.forEach(([v, l, col], i) => {
          const x = 236 + i * 262;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, 108, 240, 110);
          ctx.strokeStyle = "#e6e6ea";
          ctx.strokeRect(x + 0.5, 108.5, 239, 109);
          ctx.fillStyle = col;
          ctx.fillRect(x, 108, 4, 110);
          ctx.fillStyle = "#18181b";
          ctx.font = "bold 34px system-ui, sans-serif";
          ctx.fillText(v, x + 22, 160);
          ctx.fillStyle = "#71717a";
          ctx.font = "15px system-ui, sans-serif";
          ctx.fillText(l, x + 22, 196);
        });
        // chart
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(236, 244, 764, 240);
        ctx.strokeStyle = "#e6e6ea";
        ctx.strokeRect(236.5, 244.5, 763, 239);
        ctx.fillStyle = "#18181b";
        ctx.font = "bold 17px system-ui, sans-serif";
        ctx.fillText("Revenue — last 14 days", 258, 276);
        const pts = [40, 55, 48, 70, 62, 90, 84, 110, 96, 120, 108, 140, 126, 150];
        ctx.beginPath();
        pts.forEach((p, i) => {
          const x = 262 + i * 52;
          const y = 460 - p;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.strokeStyle = purple;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineTo(262 + 13 * 52, 464);
        ctx.lineTo(262, 464);
        ctx.closePath();
        ctx.fillStyle = "rgba(109,79,232,0.10)";
        ctx.fill();
        // recent rows
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(236, 506, 764, 118);
        ctx.strokeStyle = "#e6e6ea";
        ctx.strokeRect(236.5, 506.5, 763, 117);
        [
          ["Ramesh Kumar", "Google Pay", "₹450", "#1fa971"],
          ["Priya S.", "PhonePe", "₹1,200", "#1fa971"],
          ["Unknown UPI", "Paytm", "₹90", "#c98a1f"],
        ].forEach(([n, a, v, col], i) => {
          const y = 540 + i * 30;
          ctx.fillStyle = "#18181b";
          ctx.font = "16px system-ui, sans-serif";
          ctx.fillText(n, 258, y);
          ctx.fillStyle = "#71717a";
          ctx.fillText(a, 520, y);
          ctx.fillStyle = col;
          ctx.font = "bold 16px system-ui, sans-serif";
          ctx.fillText(v, 900, y);
        });
      }),
    [],
  );
}

/** Nurture's home screen, drawn — what's on the phone */
export function usePhoneScreen() {
  return useMemo(
    () =>
      makeTexture(512, 1080, (ctx, w, h) => {
        const sage = "#3f6840";
        ctx.fillStyle = "#fbf9f1";
        ctx.fillRect(0, 0, w, h);
        // status bar
        ctx.fillStyle = "#1b1c17";
        ctx.font = "bold 26px system-ui, sans-serif";
        ctx.fillText("9:41", 44, 64);
        ctx.fillRect(w - 110, 44, 26, 16);
        ctx.fillRect(w - 76, 44, 26, 16);
        ctx.fillRect(w - 42, 44, 22, 16);
        // header
        ctx.fillStyle = sage;
        ctx.font = "bold 46px system-ui, sans-serif";
        ctx.fillText("Nurture", 44, 150);
        ctx.fillStyle = "#424940";
        ctx.font = "22px system-ui, sans-serif";
        ctx.fillText("Good morning, Aditi", 44, 190);
        // search
        ctx.fillStyle = "#ffffff";
        roundRect(ctx, 44, 222, w - 88, 64, 32);
        ctx.fillStyle = "#8a8f86";
        ctx.font = "22px system-ui, sans-serif";
        ctx.fillText("Search verified nannies", 84, 262);
        // top matches
        ctx.fillStyle = "#1b1c17";
        ctx.font = "bold 28px system-ui, sans-serif";
        ctx.fillText("Top matches", 44, 340);
        const names = ["Sunita Devi", "Meena K.", "Radha P."];
        names.forEach((n, i) => {
          const y = 372 + i * 172;
          ctx.fillStyle = "#ffffff";
          roundRect(ctx, 44, y, w - 88, 148, 28);
          ctx.fillStyle = "#c1eebc";
          ctx.beginPath();
          ctx.arc(110, y + 74, 42, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = sage;
          ctx.font = "bold 30px system-ui, sans-serif";
          ctx.fillText(n[0], 100, y + 85);
          ctx.fillStyle = "#1b1c17";
          ctx.font = "bold 26px system-ui, sans-serif";
          ctx.fillText(n, 176, y + 58);
          ctx.fillStyle = "#424940";
          ctx.font = "20px system-ui, sans-serif";
          ctx.fillText(`${6 + i * 2} yrs · Infant care`, 176, y + 92);
          ctx.fillStyle = "#e5f4e3";
          roundRect(ctx, 176, y + 106, 150, 30, 15);
          ctx.fillStyle = sage;
          ctx.font = "bold 17px system-ui, sans-serif";
          ctx.fillText("✓ Verified", 196, y + 127);
          ctx.fillStyle = sage;
          ctx.font = "bold 24px system-ui, sans-serif";
          ctx.fillText(`${96 - i * 4}%`, w - 130, y + 62);
        });
        // bottom bar
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, h - 120, w, 120);
        ctx.fillStyle = "#e4e3db";
        ctx.fillRect(0, h - 120, w, 2);
        ["Match", "Search", "Saved", "Learn"].forEach((t, i) => {
          const x = 64 + i * 128;
          ctx.fillStyle = i === 0 ? sage : "#c2c9bd";
          ctx.beginPath();
          ctx.arc(x, h - 78, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = i === 0 ? sage : "#8a8f86";
          ctx.font = "18px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(t, x, h - 40);
          ctx.textAlign = "left";
        });
        ctx.fillStyle = "#1b1c17";
        roundRect(ctx, w / 2 - 70, h - 16, 140, 6, 3);
      }),
    [],
  );
}

export function useBoardingPass() {
  return useMemo(
    () =>
      makeTexture(1024, 420, (ctx, w, h) => {
        ctx.fillStyle = "#fdfdfb";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#1f4e9c";
        ctx.fillRect(0, 0, w, 74);
        ctx.fillStyle = "#f28c28";
        ctx.fillRect(0, 74, w, 8);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px system-ui, sans-serif";
        ctx.fillText("BOARDING PASS", 40, 50);
        ctx.font = "20px system-ui, sans-serif";
        ctx.fillText("ECONOMY", w - 300, 48);
        const f = (l: string, v: string, x: number, y: number, big = false) => {
          ctx.fillStyle = "#7a7a7a";
          ctx.font = "16px system-ui, sans-serif";
          ctx.fillText(l, x, y);
          ctx.fillStyle = "#111";
          ctx.font = `bold ${big ? 54 : 28}px system-ui, sans-serif`;
          ctx.fillText(v, x, y + (big ? 58 : 34));
        };
        f("PASSENGER", "RAO / SAKSHETH", 40, 130);
        f("FROM", "DEL", 40, 230, true);
        f("TO", "BLR", 260, 230, true);
        f("FLIGHT", "6E 2134", 480, 130);
        f("DATE", "14 MAR", 480, 230);
        f("SEAT", "14A", 620, 230);
        f("GATE", "22", 740, 230);
        f("BOARDING", "06:40", 620, 130);
        // perforation
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = "#b5b5b5";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w - 210, 90);
        ctx.lineTo(w - 210, h - 10);
        ctx.stroke();
        ctx.setLineDash([]);
        // stub + barcode
        ctx.fillStyle = "#111";
        ctx.font = "bold 22px system-ui, sans-serif";
        ctx.fillText("14A", w - 180, 140);
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText("DEL → BLR", w - 180, 170);
        const rand = rng(3);
        for (let x = w - 190; x < w - 30; x += 6) {
          const wdt = rand() > 0.6 ? 4 : 2;
          ctx.fillRect(x, 220, wdt, 150);
        }
      }),
    [],
  );
}

export function useResumeSheet() {
  return useMemo(
    () =>
      makeTexture(600, 850, (ctx, w, h) => {
        ctx.fillStyle = "#fbfbf9";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#111";
        ctx.font = "bold 40px system-ui, sans-serif";
        ctx.fillText("Saksheth Rao", 56, 96);
        ctx.fillStyle = "#666";
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText("Founder, QuantumSight · Gurugram", 56, 126);
        ctx.fillStyle = "#111";
        ctx.fillRect(56, 150, w - 112, 2);
        const sec = (t: string, y: number, lines: number[]) => {
          ctx.fillStyle = "#111";
          ctx.font = "bold 15px system-ui, sans-serif";
          ctx.fillText(t.toUpperCase(), 56, y);
          lines.forEach((len, i) => {
            ctx.fillStyle = i === 0 ? "#333" : "#9a9a9a";
            ctx.fillRect(56, y + 18 + i * 20, len, i === 0 ? 8 : 6);
          });
        };
        sec("Experience", 196, [220, 420, 380, 300, 410, 340]);
        sec("Education", 360, [240, 380, 300]);
        sec("Builds", 460, [200, 400, 360, 420, 300]);
        sec("Skills", 600, [430, 380]);
        ctx.fillStyle = "#bbb";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillText("sakshethbuilds.com", 56, h - 40);
      }),
    [],
  );
}

export function useLabel(text: string, bg = "#f4f4f2", fg = "#333") {
  return useMemo(
    () =>
      makeTexture(256, 96, (ctx, w, h) => {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = fg;
        ctx.font = "bold 40px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, w / 2, 62);
      }),
    [text, bg, fg],
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}
