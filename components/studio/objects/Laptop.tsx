"use client";

import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Box, Cyl, Surface, useLaptopScreen } from "./primitives";
import { plate } from "./geo";
import { kit } from "../materials";

const U = 0.0745; // one key pitch
const GAP = 0.011;
const KEYS_W = 14.5 * U;

type Key = { x: number; z: number; w: number; d: number; label: string };

/** a real ANSI layout: six rows, 14.5 units wide */
function layout(): Key[] {
  const rows: { depth: number; keys: [number, string][] }[] = [
    { depth: 0.6, keys: ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "⏻"].map((l) => [14.5 / 14, l] as [number, string]) },
    { depth: 1, keys: [..."`1234567890-=".split("").map((l) => [1, l] as [number, string]), [1.5, "⌫"]] },
    { depth: 1, keys: [[1.5, "⇥"], ..."QWERTYUIOP[]\\".split("").map((l) => [1, l] as [number, string])] },
    { depth: 1, keys: [[1.75, "⇪"], ..."ASDFGHJKL;'".split("").map((l) => [1, l] as [number, string]), [1.75, "⏎"]] },
    { depth: 1, keys: [[2.25, "⇧"], ..."ZXCVBNM,./".split("").map((l) => [1, l] as [number, string]), [2.25, "⇧"]] },
    { depth: 1, keys: [[1, "fn"], [1, "⌃"], [1, "⌥"], [1.25, "⌘"], [5, ""], [1.25, "⌘"], [1, "⌥"], [1, "←"], [1, "↕"], [1, "→"]] },
  ];
  const out: Key[] = [];
  let z = 0;
  for (const row of rows) {
    let x = 0;
    for (const [w, label] of row.keys) {
      out.push({ x: (x + w / 2) * U - KEYS_W / 2, z: z + (row.depth * U) / 2, w: w * U - GAP, d: row.depth * U - GAP, label });
      x += w;
    }
    z += row.depth * U;
  }
  return out;
}
const KEYS = layout();
const KEYS_D = 5.6 * U;

/** the legends, printed once onto a transparent sheet that lies over the keys */
function useLegends() {
  return useMemo(() => {
    const px = 1400 / KEYS_W;
    const c = document.createElement("canvas");
    c.width = 1400;
    c.height = Math.round(KEYS_D * px);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgba(236,238,242,0.92)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const k of KEYS) {
      if (!k.label) continue;
      const small = k.label.length > 1;
      ctx.font = `500 ${small ? 20 : 30}px system-ui, "Segoe UI Symbol", sans-serif`;
      ctx.fillText(k.label, (k.x + KEYS_W / 2) * px, k.z * px + 1);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

/**
 * A 13-inch aluminium laptop, open. Bead-blasted unibody, a recessed black
 * keyboard, a glass trackpad and a glossy display that actually lights the
 * scene's mood: `glow` scales the backlight.
 */
export function Laptop({ glow = 0.75 }: { glow?: number }) {
  const screen = useLaptopScreen();
  const legends = useLegends();
  const W = 1.28;
  const D = 0.9;
  const T = 0.045;
  const body = useMemo(() => plate(W, D, T, 0.06, 0.007), []);
  const lid = useMemo(() => plate(W, 0.86, 0.022, 0.06, 0.005), []);
  const well = useMemo(() => plate(KEYS_W + 0.03, KEYS_D + 0.03, 0.003, 0.014, 0.001), []);
  const pad = useMemo(() => plate(0.44, 0.27, 0.002, 0.012, 0.0006), []);
  const glass = useMemo(() => plate(W - 0.014, 0.846, 0.003, 0.054, 0.001), []);
  const cap = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.16), []);
  const alu = { color: "#c5c8cd", roughness: 0.44, metalness: 1, normalMap: kit.grain(14), normalScale: 0.22 } as const;
  const y0 = 0.006; // on its feet
  const kz = -0.385; // back edge of the keyboard
  const top = y0 + T;

  return (
    <group>
      {/* rubber feet */}
      {[[-0.52, -0.36], [0.52, -0.36], [-0.52, 0.36], [0.52, 0.36]].map(([x, z]) => (
        <Cyl key={`${x}${z}`} r={0.03} h={0.007} position={[x, 0.0035, z]} color="#141414" roughness={0.95} segments={20} shadow={false} />
      ))}
      <mesh geometry={body} position={[0, y0, 0]} castShadow receiveShadow>
        <Surface {...alu} />
      </mesh>
      {/* ports on the left edge */}
      {[-0.3, -0.22].map((z) => (
        <Box key={z} args={[0.004, 0.012, 0.04]} radius={0.004} position={[-W / 2 + 0.0005, y0 + T / 2, z]} color="#08090a" roughness={0.6} shadow={false} />
      ))}

      {/* keyboard: a black well, then the caps */}
      <mesh geometry={well} position={[0, top - 0.0015, kz + KEYS_D / 2]} receiveShadow>
        <Surface color="#0c0d0f" roughness={0.75} />
      </mesh>
      <Instances range={KEYS.length} geometry={cap} castShadow={false} receiveShadow frustumCulled={false}>
        <Surface color="#17181b" roughness={0.6} normalMap={kit.grain(3)} normalScale={0.25} />
        {KEYS.map((k, i) => (
          <Instance key={i} position={[k.x, top + 0.0055, kz + k.z]} scale={[k.w, 0.008, k.d]} />
        ))}
      </Instances>
      <mesh position={[0, top + 0.0099, kz + KEYS_D / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[KEYS_W, KEYS_D]} />
        <meshStandardMaterial map={legends} transparent depthWrite={false} roughness={0.7} polygonOffset polygonOffsetFactor={-2} emissive="#ffffff" emissiveMap={legends} emissiveIntensity={glow > 1 ? 0.55 : 0} />
      </mesh>

      {/* glass trackpad */}
      <mesh geometry={pad} position={[0, top - 0.0003, 0.245]} receiveShadow>
        <Surface color="#d2d4d8" roughness={0.3} metalness={0.55} roughnessMap={kit.smudge(1)} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>

      {/* hinge */}
      <Cyl r={0.019} h={1.02} rotation={[0, 0, Math.PI / 2]} position={[0, top - 0.004, -D / 2 + 0.006]} color="#3a3c40" roughness={0.45} metalness={0.9} segments={24} />

      {/* lid, opened a little past upright */}
      <group position={[0, top - 0.002, -D / 2 + 0.006]} rotation={[-0.3, 0, 0]}>
        <group position={[0, 0.43, -0.011]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={lid} castShadow receiveShadow>
            <Surface {...alu} />
          </mesh>
          <mesh geometry={glass} position={[0, 0.0205, 0]}>
            <Surface color="#040405" roughness={0.1} clearcoat={1} clearcoatRoughness={0.05} roughnessMap={kit.smudge(1)} />
          </mesh>
        </group>
        <mesh position={[0, 0.438, 0.0128]}>
          <planeGeometry args={[1.214, 0.759]} />
          <Surface map={screen} color="#151515" lit={glow * 1.15} roughness={0.42} clearcoat={0.2} clearcoatRoughness={0.3} />
        </mesh>
        {/* webcam */}
        <mesh position={[0, 0.836, 0.0129]}>
          <circleGeometry args={[0.006, 20]} />
          <Surface color="#0b1220" roughness={0.05} clearcoat={1} />
        </mesh>
      </group>
    </group>
  );
}
