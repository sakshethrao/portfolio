"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { useTexture } from "@react-three/drei";

/**
 * The surface kit. Nothing real is perfectly smooth, so every material on the
 * desk borrows a little relief from here: bead-blasted metal, moulded plastic,
 * leather, felt, paper, smudged glass. Each map is a small tileable texture
 * computed once and shared.
 *
 * The oak is the exception: it is a scan (Poly Haven "white_oak_veneer", CC0),
 * shipped as three small files in /public/studio.
 */

const SIZE = 256;
const cache = new Map<string, THREE.Texture>();

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** tileable value noise on an nx by ny lattice */
function noise(nx: number, ny: number, seed: number) {
  const r = rng(seed);
  const g = new Float32Array(nx * ny);
  for (let i = 0; i < g.length; i++) g[i] = r();
  return (x: number, y: number) => {
    const fx = (((x % 1) + 1) % 1) * nx;
    const fy = (((y % 1) + 1) % 1) * ny;
    const x0 = Math.floor(fx) % nx;
    const y0 = Math.floor(fy) % ny;
    const x1 = (x0 + 1) % nx;
    const y1 = (y0 + 1) % ny;
    const tx = fx - Math.floor(fx);
    const ty = fy - Math.floor(fy);
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const a = g[y0 * nx + x0];
    const b = g[y0 * nx + x1];
    const c = g[y1 * nx + x0];
    const d = g[y1 * nx + x1];
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
}

/** tileable cellular pattern: distance to the nearest of n by n jittered points */
function cells(n: number, seed: number) {
  const r = rng(seed);
  const pts = new Float32Array(n * n * 2);
  for (let i = 0; i < pts.length; i++) pts[i] = r();
  return (x: number, y: number) => {
    const fx = x * n;
    const fy = y * n;
    const cx = Math.floor(fx);
    const cy = Math.floor(fy);
    let best = 9;
    for (let j = -1; j <= 1; j++)
      for (let i = -1; i <= 1; i++) {
        const gx = (((cx + i) % n) + n) % n;
        const gy = (((cy + j) % n) + n) % n;
        const px = cx + i + pts[(gy * n + gx) * 2];
        const py = cy + j + pts[(gy * n + gx) * 2 + 1];
        const d = Math.hypot(px - fx, py - fy);
        if (d < best) best = d;
      }
    return Math.min(1, best);
  };
}

function field(f: (x: number, y: number) => number) {
  const h = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) h[y * SIZE + x] = f(x / SIZE, y / SIZE);
  return h;
}

function finish(t: THREE.DataTexture) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function toNormal(h: Float32Array, strength: number) {
  const px = new Uint8Array(SIZE * SIZE * 4);
  const at = (x: number, y: number) => h[((y + SIZE) % SIZE) * SIZE + ((x + SIZE) % SIZE)];
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const l = Math.hypot(dx, dy, 1);
      const i = (y * SIZE + x) * 4;
      px[i] = ((-dx / l) * 0.5 + 0.5) * 255;
      px[i + 1] = ((-dy / l) * 0.5 + 0.5) * 255;
      px[i + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      px[i + 3] = 255;
    }
  return finish(new THREE.DataTexture(px, SIZE, SIZE, THREE.RGBAFormat));
}

/** grey map, remapped to lo..hi. Roughness is read from the green channel. */
function toGrey(h: Float32Array, lo: number, hi: number) {
  const px = new Uint8Array(SIZE * SIZE * 4);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const v = Math.max(0, Math.min(1, lo + (hi - lo) * h[i])) * 255;
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
    px[i * 4 + 3] = 255;
  }
  return finish(new THREE.DataTexture(px, SIZE, SIZE, THREE.RGBAFormat));
}

function once(key: string, make: () => THREE.Texture) {
  let t = cache.get(key);
  if (!t) {
    t = make();
    cache.set(key, t);
  }
  return t;
}

/** a shared map with its own tiling (cheap: clones share the pixels) */
function tiled(key: string, make: () => THREE.Texture, rx: number, ry = rx) {
  return once(key + "@" + rx + "x" + ry, () => {
    const t = once(key, make).clone();
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    return t;
  });
}

export const kit = {
  /** bead-blasted metal / moulded plastic: a very fine, even tooth */
  grain: (r = 6) =>
    tiled("grain", () => {
      const n = noise(128, 128, 11);
      const m = noise(64, 64, 12);
      return toNormal(field((x, y) => n(x, y) * 0.7 + m(x, y) * 0.3), 1.6);
    }, r),
  /** pebbled leather / leatherette */
  leather: (r = 4) =>
    tiled("leather", () => {
      const c = cells(22, 5);
      const n = noise(96, 96, 6);
      return toNormal(field((x, y) => Math.pow(c(x, y), 0.6) * 0.85 + n(x, y) * 0.15), 3.2);
    }, r),
  /** wool felt: short matted fibres */
  felt: (r = 8) =>
    tiled("felt", () => {
      const a = noise(128, 40, 21);
      const b = noise(40, 128, 22);
      const c = noise(128, 128, 23);
      return toNormal(field((x, y) => a(x, y) * 0.35 + b(x, y) * 0.35 + c(x, y) * 0.3), 2.6);
    }, r),
  /** uncoated paper */
  paper: (r = 3) =>
    tiled("paper", () => {
      const a = noise(128, 128, 31);
      const b = noise(24, 24, 32);
      return toNormal(field((x, y) => a(x, y) * 0.6 + b(x, y) * 0.4), 0.9);
    }, r),
  /** brushed metal: long streaks along x */
  brushed: (r = 2) =>
    tiled("brushed", () => {
      const a = noise(4, 128, 41);
      const b = noise(12, 128, 42);
      return toNormal(field((x, y) => a(x, y) * 0.6 + b(x, y) * 0.4), 1.4);
    }, r),
  /** diamond knurling for grip rings and dials */
  knurl: (rx = 24, ry = 2) =>
    tiled("knurl", () =>
      toNormal(
        field((x, y) => {
          const a = Math.abs(Math.sin((x + y) * Math.PI * 4));
          const b = Math.abs(Math.sin((x - y) * Math.PI * 4));
          return Math.min(a, b);
        }),
        5,
      ), rx, ry),
  /** fingerprints and wipe marks, as a roughness map for glass */
  smudge: (r = 1) =>
    tiled("smudge", () => {
      const a = noise(5, 5, 51);
      const b = noise(14, 3, 52);
      const c = noise(40, 40, 53);
      return toGrey(field((x, y) => Math.pow(a(x, y), 2) * 0.55 + b(x, y) * 0.3 + c(x, y) * 0.15), 0.04, 0.5);
    }, r),
  /** uneven wear, as a roughness map for anything handled */
  wear: (r = 2) =>
    tiled("wear", () => {
      const a = noise(7, 7, 61);
      const b = noise(48, 48, 62);
      return toGrey(field((x, y) => a(x, y) * 0.6 + b(x, y) * 0.4), 0.55, 1);
    }, r),
};

const OAK = ["/studio/oak-diff.webp", "/studio/oak-nor.webp", "/studio/oak-rough.webp"];

/**
 * Scanned white-oak veneer. `scale` is how many texture tiles fit in one
 * scene unit; geometry using it should carry world-unit UVs.
 */
export function useOak(scale = 0.4, turn = 0) {
  const [d, n, r] = useTexture(OAK);
  return useMemo(() => {
    const prep = (src: THREE.Texture, srgb: boolean) => {
      const t = src.clone();
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(scale, scale);
      t.rotation = turn;
      t.anisotropy = 8;
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.needsUpdate = true;
      return t;
    };
    return { map: prep(d, true), normalMap: prep(n, false), roughnessMap: prep(r, false) };
  }, [d, n, r, scale, turn]);
}
useOak.preload = () => useTexture.preload(OAK);
