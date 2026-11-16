"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * What QuantumSight is for, in one looping camera view: a quiet storeroom
 * after hours, a fire starts in a stack of boxes, the camera boxes it within
 * a moment and the alert goes out. The scene is drawn (a simulated fire in a
 * drawn room), not camera footage, and every caller labels it that way.
 */

const W = 320; // the scene is drawn in these units, then scaled to the canvas
const H = 180;
const LOOP = 15; // seconds
const IGNITE = 2.4;
const RED = "#ff4d3a";
const AMBER = "#ffb020";
const GREEN = "#4ade80";

type P = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number };
type Rect = { x0: number; y0: number; x1: number; y1: number };
type Pal = { wallTop: string; wallBot: string; floorTop: string; floorBot: string; line: string; box: string[]; tape: string; shelf: string; door: string; frame: string; pipe: string };

const DARK: Pal = {
  wallTop: "#1b2024",
  wallBot: "#23292d",
  floorTop: "#1a1e21",
  floorBot: "#0c0e0f",
  line: "rgba(255,255,255,0.045)",
  box: ["#2d2b27", "#262421", "#33302b"],
  tape: "rgba(255,255,255,0.06)",
  shelf: "#0e1113",
  door: "#161a1d",
  frame: "#2a3035",
  pipe: "#2b3136",
};
const LIT: Pal = {
  wallTop: "#5d3a22",
  wallBot: "#a8683a",
  floorTop: "#8a5630",
  floorBot: "#3c2414",
  line: "rgba(255,225,180,0.16)",
  box: ["#c98f58", "#b57c48", "#d89e66"],
  tape: "rgba(255,240,210,0.3)",
  shelf: "#3b2415",
  door: "#70482c",
  frame: "#9a6a42",
  pipe: "#8f5f3c",
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function drawRoom(c: CanvasRenderingContext2D, p: Pal) {
  const HORIZON = 98;
  // back wall
  let g = c.createLinearGradient(0, 0, 0, HORIZON);
  g.addColorStop(0, p.wallTop);
  g.addColorStop(1, p.wallBot);
  c.fillStyle = g;
  c.fillRect(0, 0, W, HORIZON);
  // floor, with tile lines running to a vanishing point
  g = c.createLinearGradient(0, HORIZON, 0, H);
  g.addColorStop(0, p.floorTop);
  g.addColorStop(1, p.floorBot);
  c.fillStyle = g;
  c.fillRect(0, HORIZON, W, H - HORIZON);
  c.strokeStyle = p.line;
  c.lineWidth = 0.6;
  c.beginPath();
  for (let i = -6; i <= 14; i++) {
    const xb = i * 40;
    const k = (HORIZON - 30) / (H - 30); // where the line from (xb, H) to the vanishing point (160, 30) meets the wall
    c.moveTo(xb, H);
    c.lineTo(xb + (160 - xb) * (1 - k), HORIZON);
  }
  for (let j = 1; j <= 5; j++) {
    const y = HORIZON + (H - HORIZON) * Math.pow(j / 5.6, 1.8);
    c.moveTo(0, y);
    c.lineTo(W, y);
  }
  c.stroke();
  c.fillStyle = "rgba(0,0,0,0.35)";
  c.fillRect(0, HORIZON - 1.2, W, 2.4); // skirting

  // conduit along the top of the wall, and a dead strip light
  c.fillStyle = p.pipe;
  c.fillRect(0, 9, W, 2.2);
  c.fillRect(120, 3, 70, 3);

  // door, with an exit sign over it
  c.fillStyle = p.frame;
  c.fillRect(24, 32, 42, 66);
  c.fillStyle = p.door;
  c.fillRect(27, 35, 36, 63);
  c.fillStyle = p.frame;
  c.fillRect(57, 66, 3, 1.6);
  c.fillStyle = "#1f8a55";
  c.fillRect(35, 22, 20, 7);
  c.fillStyle = "rgba(210,255,225,0.75)";
  c.fillRect(38, 24.5, 14, 2);

  // racking against the back wall
  const boxes: [number, number, number, number, number][] = [
    [100, 28, 20, 14, 0], [122, 31, 16, 11, 1], [146, 26, 24, 16, 2], [172, 30, 14, 12, 0],
    [98, 52, 26, 16, 2], [128, 55, 18, 13, 0], [150, 51, 16, 17, 1], [170, 54, 18, 14, 2],
    [102, 77, 18, 17, 1], [124, 80, 26, 14, 0], [154, 76, 22, 18, 2],
  ];
  for (const [x, y, w, h, k] of boxes) {
    c.fillStyle = p.box[k];
    c.fillRect(x, y, w, h);
    c.fillStyle = p.tape;
    c.fillRect(x + w / 2 - 1, y, 2, h);
    c.fillStyle = "rgba(0,0,0,0.18)";
    c.fillRect(x, y + h - 2, w, 2);
  }
  c.fillStyle = p.shelf;
  for (const x of [94, 142, 190]) c.fillRect(x, 18, 3, 80);
  for (const y of [42, 68, 94]) c.fillRect(94, y, 99, 2.4);

  // fire extinguisher on the wall
  c.fillStyle = "#8e1f1a";
  c.fillRect(288, 62, 7, 18);
  c.fillStyle = "#1a1a1a";
  c.fillRect(289.5, 58, 4, 4);

  // the stack on a pallet where it starts
  c.fillStyle = "rgba(0,0,0,0.4)";
  c.beginPath();
  c.ellipse(226, 137, 38, 5, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = p.shelf;
  c.fillRect(196, 131, 60, 4);
  const stack: [number, number, number, number, number][] = [[198, 105, 26, 26, 0], [225, 109, 28, 22, 1], [206, 86, 28, 19, 2]];
  for (const [x, y, w, h, k] of stack) {
    c.fillStyle = p.box[k];
    c.fillRect(x, y, w, h);
    c.fillStyle = p.tape;
    c.fillRect(x, y + h * 0.42, w, 2);
    c.fillStyle = "rgba(0,0,0,0.2)";
    c.fillRect(x + w - 2.5, y, 2.5, h);
  }
}

function sprite(r: number, g: number, b: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 48;
  const x = c.getContext("2d")!;
  const gr = x.createRadialGradient(24, 24, 0, 24, 24, 24);
  gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gr.addColorStop(0.45, `rgba(${r},${g},${b},0.45)`);
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = gr;
  x.fillRect(0, 0, 48, 48);
  return c;
}

function layer(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function DetectionViz({ cam = "CAM 04 · FLOOR 2", compact = false }: { cam?: string; compact?: boolean }) {
  const reduce = !!useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  // 0 watching · 1 fire boxed · 2 alert sent · 3 smoke boxed too
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const cv = canvas.current;
    const host = wrap.current;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const font = getComputedStyle(host).fontFamily || "monospace";

    // the room, drawn twice: as the camera sees it in the dark, and as the fire lights it
    const dark = layer(W * 2, H * 2);
    const lit = layer(W * 2, H * 2);
    for (const [c, pal] of [[dark, DARK], [lit, LIT]] as const) {
      const x = c.getContext("2d")!;
      x.scale(2, 2);
      drawRoom(x, pal);
    }
    const glow = layer(W * 2, H * 2);
    const gctx = glow.getContext("2d")!;
    const noise = layer(W, H);
    {
      const n = noise.getContext("2d")!;
      const d = n.createImageData(W, H);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = Math.random() * 255;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 9;
      }
      n.putImageData(d, 0, 0);
    }
    const sCore = sprite(255, 244, 200);
    const sMid = sprite(255, 150, 40);
    const sHeat = sprite(255, 255, 255);
    const sSmoke = sprite(128, 120, 112);
    // The flames are drawn as heat first, then coloured: every pixel's heat is
    // looked up in a fire ramp (clear, deep red, orange, yellow, white). That
    // is what gives real tongues and a hot core instead of a soft blob.
    const HS = 2; // heat buffer pixels per scene unit
    const heat = layer(W * HS, H * HS);
    const hctx = heat.getContext("2d", { willReadFrequently: true })!;
    const fire = layer(W * HS, H * HS);
    const fctx = fire.getContext("2d")!;
    const ramp = new Uint8ClampedArray(256 * 4);
    {
      const stops: [number, number, number, number, number][] = [
        [0, 120, 20, 0, 0], [36, 150, 26, 2, 0], [66, 205, 52, 6, 150], [100, 240, 92, 12, 235], [150, 255, 150, 30, 255], [200, 255, 205, 80, 255], [238, 255, 236, 160, 255], [255, 255, 248, 220, 255],
      ];
      for (let i = 0; i < 256; i++) {
        let k = 0;
        while (k < stops.length - 2 && i > stops[k + 1][0]) k++;
        const a = stops[k];
        const b = stops[k + 1];
        const u = Math.min(1, Math.max(0, (i - a[0]) / (b[0] - a[0])));
        for (let c = 0; c < 4; c++) ramp[i * 4 + c] = a[c + 1] + (b[c + 1] - a[c + 1]) * u;
      }
    }

    let flames: P[] = [];
    let smoke: P[] = [];
    let embers: P[] = [];
    let t = 0;
    let shown = -1;
    let fireAt = -1;
    let smokeAt = -1;
    const fbox: Rect = { x0: 0, y0: 0, x1: 0, y1: 0 };
    const sbox: Rect = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let carry = 0;
    let carryS = 0;

    const reset = () => {
      flames = [];
      smoke = [];
      embers = [];
      t = 0;
      fireAt = smokeAt = -1;
      carry = carryS = 0;
    };

    const intensity = () => Math.pow(smooth(IGNITE, IGNITE + 6.5, t), 1.5);

    const step = (dt: number) => {
      t += dt;
      const I = intensity();
      const cx = 240 - 14 * I; // it starts at the corner of the pallet and climbs into the stack
      const half = 2.5 + 22 * I;
      if (t > IGNITE) {
        carry += (60 + 300 * I) * dt;
        while (carry >= 1) {
          carry--;
          const u = Math.random() * 2 - 1;
          flames.push({
            x: cx + u * half,
            y: 131 - Math.random() * 3 - (1 - Math.abs(u)) * 10 * I,
            vx: (Math.random() - 0.5) * 8,
            vy: -(20 + 62 * I) * (0.55 + Math.random() * 0.75) * (1 - Math.abs(u) * 0.5),
            age: 0,
            life: 0.5 + Math.random() * 0.65,
            size: (2.4 + 6.2 * I) * (0.7 + Math.random() * 0.6),
          });
        }
        carryS += (5 + 20 * I) * dt;
        while (carryS >= 1) {
          carryS--;
          smoke.push({
            x: cx + (Math.random() - 0.5) * half,
            y: 124 - 44 * I,
            vx: -3 - Math.random() * 5,
            vy: -(12 + Math.random() * 10),
            age: 0,
            life: 2.6 + Math.random() * 1.8,
            size: 5 + Math.random() * 4 + 5 * I,
          });
          if (Math.random() < 0.5 * I)
            embers.push({ x: cx + (Math.random() - 0.5) * half, y: 118 - 30 * I, vx: (Math.random() - 0.5) * 26, vy: -(40 + Math.random() * 40), age: 0, life: 0.7 + Math.random() * 0.8, size: 0.7 });
        }
      }
      for (const p of flames) {
        p.age += dt;
        // lick about in tongues, and draw in toward the middle as it rises
        p.vx += (Math.random() - 0.5) * 60 * dt + Math.sin(t * 11 + p.y * 0.22 + p.life * 40) * 46 * dt + (cx - p.x) * 2.2 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      for (const p of smoke) {
        p.age += dt;
        p.vx += (Math.random() - 0.5) * 6 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < 14) {
          p.y = 14; // it pools under the ceiling and spreads
          p.vx -= 6 * dt;
        }
        p.size += 5.5 * dt;
      }
      for (const p of embers) {
        p.age += dt;
        p.vy += 30 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      flames = flames.filter((p) => p.age < p.life);
      smoke = smoke.filter((p) => p.age < p.life);
      embers = embers.filter((p) => p.age < p.life);

      // what the detector would box: the body of the flame, and the plume above it
      const fit = (ps: P[], lo: number, hi: number, into: Rect, pad: number) => {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
        for (const p of ps) {
          const a = p.age / p.life;
          if (a < lo || a > hi) continue;
          n++;
          x0 = Math.min(x0, p.x - p.size * 0.5);
          x1 = Math.max(x1, p.x + p.size * 0.5);
          y0 = Math.min(y0, p.y - p.size * 0.6);
          y1 = Math.max(y1, p.y + p.size * 0.5);
        }
        if (n < 4) return false;
        const k = into.x1 === 0 ? 1 : Math.min(1, dt * 7);
        into.x0 += (x0 - pad - into.x0) * k;
        into.y0 += (y0 - pad - into.y0) * k;
        into.x1 += (x1 + pad - into.x1) * k;
        into.y1 += (y1 + pad - into.y1) * k;
        return true;
      };
      const hasFire = fit(flames, 0, 0.75, fbox, 3);
      fbox.y1 = Math.min(fbox.y1, 136);
      const hasSmoke = fit(smoke, 0.12, 0.6, sbox, 2);
      sbox.y1 = Math.min(sbox.y1, fbox.y0 - 2);
      if (fireAt < 0 && hasFire && I > 0.006) fireAt = t;
      if (smokeAt < 0 && hasSmoke && I > 0.4 && sbox.y1 - sbox.y0 > 16) smokeAt = t;
    };

    const box = (r: Rect, color: string, label: string, since: number) => {
      const k = 1 - Math.pow(1 - Math.min(1, (t - since) / 0.28), 3);
      const grow = (1 - k) * 9;
      const x = r.x0 - grow;
      const y = r.y0 - grow;
      const w = r.x1 - r.x0 + grow * 2;
      const h = r.y1 - r.y0 + grow * 2;
      ctx.globalAlpha = k;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      const c = 5;
      ctx.beginPath();
      for (const [px, py, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
        ctx.moveTo(px + sx * c, py);
        ctx.lineTo(px, py);
        ctx.lineTo(px, py + sy * c);
      }
      ctx.stroke();
      ctx.font = `600 6.6px ${font}`;
      const tw = ctx.measureText(label).width + 6;
      const lx = Math.min(x - 0.5, W - tw - 2);
      const ly = Math.max(1, y - 10);
      ctx.fillStyle = color;
      ctx.fillRect(lx, ly, tw, 9.5);
      ctx.fillStyle = "#0d0f10";
      ctx.textBaseline = "middle";
      ctx.fillText(label, lx + 3, ly + 5.1);
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const I = intensity();
      const flick = 0.82 + 0.18 * Math.sin(t * 23) * Math.sin(t * 7.3 + 1) + (Math.random() - 0.5) * 0.08;
      const cx = 240 - 14 * I;
      ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(dark, 0, 0, W, H);

      // the fire lights the room: the warm version of the room, let through a soft pool around the flames
      if (I > 0.002) {
        gctx.setTransform(2, 0, 0, 2, 0, 0);
        gctx.globalCompositeOperation = "source-over";
        gctx.clearRect(0, 0, W, H);
        const R = 26 + 170 * Math.sqrt(I);
        const g = gctx.createRadialGradient(cx, 118 - 20 * I, 2, cx, 118 - 20 * I, R);
        const a = Math.min(1, 0.25 + I * 1.1) * flick;
        g.addColorStop(0, `rgba(0,0,0,${a})`);
        g.addColorStop(0.35, `rgba(0,0,0,${a * 0.5})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        gctx.fillStyle = g;
        gctx.fillRect(0, 0, W, H);
        gctx.globalCompositeOperation = "source-in";
        gctx.drawImage(lit, 0, 0, W, H);
        ctx.drawImage(glow, 0, 0, W, H);
      }

      for (const p of smoke) {
        const a = p.age / p.life;
        ctx.globalAlpha = 0.5 * Math.sin(Math.min(1, a * 1.15) * Math.PI) * (0.35 + 0.65 * Math.min(1, I * 1.6));
        ctx.drawImage(sSmoke, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      }
      // smoke gathering under the ceiling as it goes on
      const haze = smooth(IGNITE + 3, LOOP - 2, t);
      if (haze > 0) {
        const g = ctx.createLinearGradient(0, 0, 0, 70);
        g.addColorStop(0, `rgba(58,58,62,${0.6 * haze})`);
        g.addColorStop(1, "rgba(58,58,62,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, 70);
      }

      // heat, then colour
      hctx.setTransform(HS, 0, 0, HS, 0, 0);
      hctx.globalCompositeOperation = "source-over";
      hctx.globalAlpha = 1;
      hctx.fillStyle = "#000";
      hctx.fillRect(0, 0, W, H);
      hctx.globalCompositeOperation = "lighter";
      let fx0 = W, fy0 = H, fx1 = 0, fy1 = 0;
      for (const p of flames) {
        const a = p.age / p.life;
        const sz = p.size * (1 - a * 0.6);
        hctx.globalAlpha = 0.3 * (1 - a * 0.9) * Math.min(1, a * 14);
        hctx.drawImage(sHeat, p.x - sz, p.y - sz * 1.7, sz * 2, sz * 3.4);
        fx0 = Math.min(fx0, p.x - sz);
        fx1 = Math.max(fx1, p.x + sz);
        fy0 = Math.min(fy0, p.y - sz * 1.7);
        fy1 = Math.max(fy1, p.y + sz * 1.7);
      }
      if (fx1 > fx0) {
        const px = Math.max(0, Math.floor(fx0 * HS) - 2);
        const py = Math.max(0, Math.floor(fy0 * HS) - 2);
        const pw = Math.min(W * HS - px, Math.ceil((fx1 - fx0) * HS) + 4);
        const ph = Math.min(H * HS - py, Math.ceil((fy1 - fy0) * HS) + 4);
        if (pw > 0 && ph > 0) {
          const img = hctx.getImageData(px, py, pw, ph);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            const h = d[i] * 4;
            d[i] = ramp[h];
            d[i + 1] = ramp[h + 1];
            d[i + 2] = ramp[h + 2];
            d[i + 3] = ramp[h + 3];
          }
          fctx.clearRect(0, 0, W * HS, H * HS);
          fctx.putImageData(img, px, py);
          // a soft halo first, then the flame itself
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = Math.min(0.55, 0.15 + I * 0.6) * flick;
          const r = 12 + 46 * I;
          ctx.drawImage(sMid, cx - r, 122 - 22 * I - r, r * 2, r * 2);
          ctx.globalAlpha = Math.min(0.3, I * 0.5) * flick;
          ctx.drawImage(sMid, cx - r * 2.2, 138 - r * 0.4, r * 4.4, r * 0.8); // on the floor
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
          ctx.drawImage(fire, 0, 0, W, H);
          // the sensor blooms a little where it is hottest
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = Math.min(0.22, I * 0.4) * flick;
          const b = 6 + 16 * I;
          ctx.drawImage(sCore, cx - b, 128 - 8 * I - b, b * 2, b * 2);
        }
      }
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "#ffd28a";
      for (const p of embers) {
        ctx.globalAlpha = 1 - p.age / p.life;
        ctx.fillRect(p.x, p.y, 0.9, 0.9);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      // camera: grain, scanlines, a dark corner falloff
      ctx.drawImage(noise, -Math.random() * 40, -Math.random() * 30, W + 40, H + 30);
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 0.5);
      const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.72);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);

      if (smokeAt > 0) box(sbox, AMBER, `SMOKE ${(0.58 + 0.27 * smooth(smokeAt, smokeAt + 4, t)).toFixed(2)}`, smokeAt);
      if (fireAt > 0) box(fbox, RED, `FIRE ${(0.62 + 0.33 * smooth(fireAt, fireAt + 3, t)).toFixed(2)}`, fireAt);

      // out to black before the loop comes round
      const out = smooth(LOOP - 0.9, LOOP - 0.15, t);
      if (out > 0) {
        ctx.fillStyle = `rgba(8,9,10,${out})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const sync = () => {
      const ph = fireAt < 0 || t > LOOP - 0.5 ? 0 : smokeAt > 0 ? 3 : t - fireAt > 0.7 ? 2 : 1;
      if (ph !== shown) {
        shown = ph;
        setPhase(ph);
      }
      if (clock.current) {
        const s = 7 + Math.floor(t);
        clock.current.textContent = `19:24:${String(s % 60).padStart(2, "0")}`;
      }
    };

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
    };
    size();

    // dev only: ?qs=8 holds the scene at that second, for looking at one moment
    const hold = process.env.NODE_ENV === "production" ? NaN : Number(new URLSearchParams(location.search).get("qs") ?? NaN);
    if (reduce || hold > 0) {
      // no motion: one frame, a few seconds into the fire, with the alert already out
      while (t < (hold > 0 ? hold : 9)) step(1 / 30);
      draw();
      sync();
      const ro = new ResizeObserver(() => {
        size();
        draw();
      });
      ro.observe(cv);
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    let visible = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      step(dt);
      if (t >= LOOP) reset();
      draw();
      sync();
    };
    const run = () => {
      const want = visible && !document.hidden;
      if (want && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!want && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      size();
      if (!raf) draw();
    });
    ro.observe(cv);
    document.addEventListener("visibilitychange", run);
    draw();
    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", run);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const alarm = phase >= 1;
  const fs = compact ? 8 : 9.5;

  return (
    <div
      ref={wrap}
      style={{
        background: "#0d0f10",
        borderRadius: 16,
        padding: compact ? 10 : 12,
        fontFamily: "var(--font-mono), monospace",
        border: `1px solid ${alarm ? "rgba(255,77,58,0.55)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: alarm ? "0 0 0 1px rgba(255,77,58,0.25), 0 0 28px -6px rgba(255,77,58,0.45)" : "none",
        transition: "border-color .25s ease, box-shadow .25s ease",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "rgba(255,255,255,0.45)", fontSize: fs, letterSpacing: "0.04em", marginBottom: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: 99, background: "#ff3b30", display: "inline-block", animation: reduce ? undefined : "qs-flicker 1.6s infinite" }} />
          REC · {cam}
        </span>
        <span ref={clock}>19:24:07</span>
      </div>

      {/* the camera view */}
      <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 10, overflow: "hidden", background: "#0c0e10" }}>
        <canvas ref={canvas} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />

        {/* the alert: raised the moment the fire is boxed, sent a beat later */}
        <div
          role="status"
          style={{
            position: "absolute",
            left: compact ? 6 : 8,
            top: compact ? 6 : 8,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            fontSize: compact ? 7.5 : 9,
            fontWeight: 600,
            letterSpacing: "0.05em",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              alignSelf: "flex-start",
              background: RED,
              color: "#0d0f10",
              padding: compact ? "2px 5px" : "3px 7px",
              borderRadius: 3,
              opacity: alarm ? 1 : 0,
              transform: alarm ? "none" : "translateY(-4px)",
              transition: "opacity .18s ease, transform .18s ease",
            }}
          >
            ▲ FIRE DETECTED
          </span>
          <span
            style={{
              alignSelf: "flex-start",
              background: "rgba(13,15,16,0.82)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.18)",
              padding: compact ? "2px 5px" : "3px 7px",
              borderRadius: 3,
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "none" : "translateY(-4px)",
              transition: "opacity .18s ease, transform .18s ease",
            }}
          >
            <span style={{ color: GREEN }}>✓</span> ALERT SENT → DASHBOARD
          </span>
        </div>
      </div>

      {/* what it sees right now */}
      <div style={{ display: "flex", gap: 6, marginTop: 8, fontSize: compact ? 8 : 8.5, letterSpacing: "0.03em", alignItems: "center", minHeight: 16 }}>
        {phase === 0 ? <Chip dot={GREEN}>MONITORING</Chip> : <Chip dot={RED}>FIRE 1</Chip>}
        {phase >= 3 && <Chip dot={AMBER}>SMOKE 1</Chip>}
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)" }}>YOLOv8 · EDGE</span>
      </div>
    </div>
  );
}

function Chip({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)", borderRadius: 99, padding: "2px 7px" }}>
      <span style={{ width: 4, height: 4, borderRadius: 99, background: dot }} />
      {children}
    </span>
  );
}
