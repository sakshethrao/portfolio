"use client";

import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { Box, Cyl, Plane, Torus, Surface, useBoardingPass, usePhoneScreen, useResumeSheet, useLabel, usePickleballTexture } from "./primitives";
import { plate, turned } from "./geo";
import { kit } from "../materials";

type V3 = [number, number, number];

/** the box's ethernet port, in the box's own space — the camera cable ends here */
export const AIBOX_PORT: V3 = [0, 0.07, 0.205];

/* ---------- The QS AI Box: a fanless edge computer ---------- */
export function AiBox({ accent }: { accent: string }) {
  const label = useLabel("QS·AI BOX", "#1b1d20", "#c9ccd1");
  const chassis = useMemo(() => plate(0.58, 0.4, 0.108, 0.012, 0.005), []);
  const alu = { color: "#3a3d43", roughness: 0.5, metalness: 1, normalMap: kit.grain(12), normalScale: 0.3 } as const;
  const face = { color: "#191b1e", roughness: 0.42, metalness: 0.9, normalMap: kit.brushed(3), normalScale: 0.35 } as const;
  const fins = Array.from({ length: 13 }, (_, i) => -0.24 + i * 0.04);
  return (
    <group>
      {[[-0.24, -0.15], [0.24, -0.15], [-0.24, 0.15], [0.24, 0.15]].map(([x, z]) => (
        <Cyl key={`${x}${z}`} r={0.02} h={0.012} position={[x, 0.006, z]} color="#101011" roughness={0.95} segments={16} shadow={false} />
      ))}
      <mesh geometry={chassis} position={[0, 0.012, 0]} castShadow receiveShadow>
        <Surface {...alu} />
      </mesh>
      {/* heatsink: thin fins across the lid */}
      <Instances range={fins.length} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[0.012, 0.03, 0.34]} />
        <Surface {...alu} color="#44474d" />
        {fins.map((x) => (
          <Instance key={x} position={[x, 0.134, 0]} />
        ))}
      </Instances>
      {/* front plate, held on by four screws */}
      <Box args={[0.565, 0.092, 0.005]} radius={0.002} position={[0, 0.066, 0.2005]} {...face} shadow={false} />
      {[[-0.268, 0.1], [0.268, 0.1], [-0.268, 0.032], [0.268, 0.032]].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.2035]}>
          <circleGeometry args={[0.006, 12]} />
          <Surface color="#8d9096" roughness={0.3} metalness={1} />
        </mesh>
      ))}
      {/* ethernet, with its two link lights */}
      <Box args={[0.066, 0.052, 0.004]} radius={0.002} position={[0, 0.07, 0.2025]} color="#b9bcc1" roughness={0.35} metalness={1} shadow={false} />
      <Box args={[0.054, 0.04, 0.004]} radius={0} position={[0, 0.068, 0.2032]} color="#050506" roughness={0.9} shadow={false} />
      <Box args={[0.008, 0.005, 0.002]} radius={0} position={[-0.02, 0.091, 0.2046]} color="#1d7a35" emissive="#35e06a" emissiveIntensity={2.2} shadow={false} />
      <Box args={[0.008, 0.005, 0.002]} radius={0} position={[0.02, 0.091, 0.2046]} color="#8a5a10" emissive="#ffb02e" emissiveIntensity={1.6} shadow={false} />
      {/* two USB ports */}
      {[-0.18, -0.105].map((x) => (
        <group key={x} position={[x, 0.07, 0.2025]}>
          <Box args={[0.058, 0.026, 0.004]} radius={0.002} color="#b9bcc1" roughness={0.35} metalness={1} shadow={false} />
          <Box args={[0.05, 0.018, 0.004]} radius={0} position={[0, 0, 0.0008]} color="#050506" roughness={0.9} shadow={false} />
          <Box args={[0.044, 0.006, 0.004]} radius={0} position={[0, -0.003, 0.0012]} color="#1f5fd0" roughness={0.5} shadow={false} />
        </group>
      ))}
      {/* power light and the accent tag */}
      <mesh position={[0.235, 0.07, 0.2035]}>
        <circleGeometry args={[0.007, 16]} />
        <Surface color="#0f3d1c" emissive="#35e06a" emissiveIntensity={2.6} />
      </mesh>
      <Box args={[0.02, 0.02, 0.003]} radius={0.002} position={[0.105, 0.07, 0.203]} color={accent} roughness={0.5} shadow={false} />
      <Plane w={0.11} h={0.041} position={[0.165, 0.098, 0.2032]} map={label} roughness={0.6} />
    </group>
  );
}

/* ---------- Nurture on a phone, lying flat ---------- */
export function Phone({ glow = 0.75 }: { glow?: number }) {
  const screen = usePhoneScreen();
  const body = useMemo(() => plate(0.33, 0.68, 0.034, 0.052, 0.006), []);
  const glass = useMemo(() => plate(0.322, 0.672, 0.0025, 0.048, 0.0008), []);
  const frame = { color: "#6a6c70", roughness: 0.34, metalness: 1, normalMap: kit.brushed(4), normalScale: 0.25 } as const;
  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <Surface {...frame} />
      </mesh>
      <mesh geometry={glass} position={[0, 0.0335, 0]}>
        <Surface color="#030304" roughness={0.1} clearcoat={1} clearcoatRoughness={0.03} roughnessMap={kit.smudge(1)} />
      </mesh>
      <Plane w={0.296} h={0.624} position={[0, 0.0364, 0]} rotation={[-Math.PI / 2, 0, 0]} map={screen} color="#151515" lit={glow * 1.1} roughness={0.14} clearcoat={1} clearcoatRoughness={0.04} />
      {/* antenna bands and side buttons */}
      {[-0.26, 0.26].map((z) => (
        <Box key={z} args={[0.332, 0.03, 0.004]} radius={0} position={[0, 0.017, z]} color="#3a3b3e" roughness={0.6} shadow={false} />
      ))}
      <Box args={[0.005, 0.012, 0.07]} radius={0.002} position={[0.166, 0.019, -0.12]} {...frame} shadow={false} />
      <Box args={[0.005, 0.012, 0.045]} radius={0.002} position={[-0.166, 0.019, -0.17]} {...frame} shadow={false} />
      <Box args={[0.005, 0.012, 0.045]} radius={0.002} position={[-0.166, 0.019, -0.11]} {...frame} shadow={false} />
    </group>
  );
}

/* ---------- A rangefinder camera: photography ---------- */
export function Camera35() {
  const lens = useMemo(
    () => ({
      mount: turned([[0.112, 0.1], [0.112, 0.112], [0.1, 0.118], [0.094, 0.118]], 56),
      barrel: turned([[0.094, 0.112], [0.094, 0.15], [0.099, 0.154], [0.099, 0.196], [0.094, 0.2], [0.094, 0.236], [0.098, 0.24], [0.098, 0.256], [0.086, 0.258], [0.078, 0.244], [0.064, 0.24]], 64),
    }),
    [],
  );
  const chrome = { color: "#cfd0cd", roughness: 0.32, metalness: 1, normalMap: kit.brushed(3), normalScale: 0.3 } as const;
  const knurled = { color: "#1b1b1d", roughness: 0.5, metalness: 0.6, normalMap: kit.knurl(30, 2), normalScale: 0.8 } as const;
  return (
    <group>
      {/* body: leatherette wrap between two chrome plates */}
      <Box args={[0.54, 0.24, 0.2]} radius={0.022} position={[0, 0.155, 0]} color="#17171a" roughness={0.82} normalMap={kit.leather(7)} normalScale={1.1} />
      <Box args={[0.548, 0.055, 0.206]} radius={0.014} position={[0, 0.3, 0]} {...chrome} />
      <Box args={[0.548, 0.04, 0.206]} radius={0.012} position={[0, 0.022, 0]} {...chrome} />
      {/* lens */}
      <mesh geometry={lens.mount} position={[0.03, 0.15, 0]} castShadow>
        <Surface {...chrome} />
      </mesh>
      <mesh geometry={lens.barrel} position={[0.03, 0.15, 0]} castShadow receiveShadow>
        <Surface color="#141416" roughness={0.42} metalness={0.7} />
      </mesh>
      <Cyl r={0.1} h={0.04} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.175]} segments={56} {...knurled} />
      <Cyl r={0.0965} h={0.012} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.218]} segments={56} color="#b9bcc1" roughness={0.35} metalness={1} normalMap={kit.knurl(40, 1)} normalScale={0.5} shadow={false} />
      <mesh position={[0.03, 0.15, 0.238]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.3, 1]}>
        <sphereGeometry args={[0.064, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Surface color="#05070d" roughness={0.03} clearcoat={1} clearcoatRoughness={0.02} iridescence={1} envMapIntensity={2.2} />
      </mesh>
      {/* viewfinder + rangefinder windows */}
      <Box args={[0.066, 0.044, 0.006]} radius={0.004} position={[-0.17, 0.262, 0.103]} color="#070a10" roughness={0.06} clearcoat={1} shadow={false} />
      <Box args={[0.032, 0.032, 0.006]} radius={0.004} position={[-0.075, 0.262, 0.103]} color="#070a10" roughness={0.06} clearcoat={1} shadow={false} />
      {/* top: shutter button, speed dial, hot shoe, rewind knob */}
      <Cyl r={0.024} h={0.02} position={[0.19, 0.337, 0.0]} segments={32} {...chrome} />
      <Cyl r={0.012} h={0.012} position={[0.19, 0.352, 0.0]} color="#8d9096" roughness={0.3} metalness={1} segments={16} shadow={false} />
      <Cyl r={0.038} h={0.026} position={[0.09, 0.34, -0.02]} segments={40} {...chrome} normalMap={kit.knurl(34, 1)} normalScale={0.7} />
      <Box args={[0.062, 0.016, 0.056]} radius={0.003} position={[-0.03, 0.335, -0.02]} color="#2a2b2e" roughness={0.4} metalness={0.9} />
      <Cyl r={0.032} h={0.03} position={[-0.2, 0.342, -0.02]} segments={36} {...chrome} normalMap={kit.knurl(30, 1)} normalScale={0.7} />
      {/* red dot + strap lugs */}
      <mesh position={[-0.2, 0.19, 0.1012]}>
        <circleGeometry args={[0.015, 24]} />
        <Surface color="#c8102e" roughness={0.3} clearcoat={1} />
      </mesh>
      <Torus r={0.014} tube={0.004} position={[-0.278, 0.26, 0]} rotation={[0, Math.PI / 2, 0]} color="#cfd0cd" metalness={1} roughness={0.3} />
      <Torus r={0.014} tube={0.004} position={[0.278, 0.26, 0]} rotation={[0, Math.PI / 2, 0]} color="#cfd0cd" metalness={1} roughness={0.3} />
    </group>
  );
}

/* ---------- paper: it never lies perfectly flat ---------- */
function sheet(w: number, d: number, lift: (u: number, v: number) => number) {
  const g = new THREE.PlaneGeometry(w, d, 24, 24);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, 0.003 + lift(p.getX(i) / w + 0.5, p.getZ(i) / d + 0.5));
  g.computeVertexNormals();
  return g;
}
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/* ---------- A boarding pass: travel ---------- */
export function BoardingPass() {
  const tex = useBoardingPass();
  // card stock that has been in a pocket: a shallow bow and a lifted stub
  const g = useMemo(() => sheet(0.76, 0.31, (u, v) => Math.sin(u * Math.PI) * 0.006 + ease((u - 0.74) / 0.26) * 0.03 + (v - 0.5) * (u - 0.5) * 0.012), []);
  return (
    <mesh geometry={g} castShadow receiveShadow>
      <Surface map={tex} roughness={0.72} normalMap={kit.paper(4)} normalScale={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ---------- One printed page: the résumé ---------- */
export function ResumeSheet() {
  const tex = useResumeSheet();
  // office paper: flat, with one corner curling up
  const g = useMemo(() => sheet(0.6, 0.85, (u, v) => Math.pow(ease((u + (1 - v) - 1.45) / 0.55), 2) * 0.07 + Math.sin(v * Math.PI) * 0.002), []);
  return (
    <mesh geometry={g} castShadow receiveShadow>
      <Surface map={tex} roughness={0.88} normalMap={kit.paper(5)} normalScale={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ---------- Cricket ball: off hours ---------- */
export function CricketBall() {
  const R = 0.1;
  const rows = [-0.03, -0.018, 0.018, 0.03];
  const stitches = useMemo(() => {
    const out: { p: V3; a: number; s: number }[] = [];
    for (const dz of rows) {
      const r = Math.sqrt(R * R - dz * dz) + 0.0012;
      for (let i = 0; i < 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        out.push({ p: [Math.cos(a) * r, Math.sin(a) * r, dz], a, s: dz > 0 ? 1 : -1 });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <group position={[0, R, 0]} rotation={[0.35, 0.5, 0.1]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[R, 64, 48]} />
        <Surface color="#8e1b16" roughness={0.5} clearcoat={0.7} clearcoatRoughness={0.28} normalMap={kit.leather(5)} normalScale={0.55} roughnessMap={kit.wear(2)} />
      </mesh>
      {/* the seam: a raised ridge with rows of angled stitches either side */}
      <mesh scale={[1, 1, 2.2]}>
        <torusGeometry args={[R - 0.0005, 0.004, 10, 96]} />
        <Surface color="#7a1612" roughness={0.6} />
      </mesh>
      <Instances range={stitches.length} castShadow={false} frustumCulled={false}>
        <boxGeometry args={[0.0032, 0.0026, 0.011]} />
        <Surface color="#ece3cf" roughness={0.85} />
        {stitches.map((s, i) => (
          <Instance key={i} position={s.p} rotation={[0, 0, s.a + s.s * 0.5]} />
        ))}
      </Instances>
    </group>
  );
}

/* ---------- Pickleball paddle + ball, lying flat ---------- */
function usePaddleFace() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 640;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1a2140";
    ctx.fillRect(0, 0, 512, 640);
    // raw carbon weave
    for (let y = 0; y < 640; y += 8)
      for (let x = 0; x < 512; x += 8) {
        ctx.fillStyle = (x / 8 + y / 8) % 2 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.12)";
        ctx.fillRect(x, y, 8, 8);
      }
    ctx.strokeStyle = "#a8412a";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(90, 470);
    ctx.lineTo(422, 250);
    ctx.stroke();
    ctx.strokeStyle = "rgba(240,236,226,0.9)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(90, 500);
    ctx.lineTo(422, 280);
    ctx.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1 / 0.315, 1 / 0.415);
    t.offset.set(0.5, 0.5);
    return t;
  }, []);
}

export function Paddle() {
  const ballTex = usePickleballTexture();
  const faceTex = usePaddleFace();
  const guard = useMemo(() => plate(0.34, 0.44, 0.016, 0.1, 0.005, 14), []);
  const face = useMemo(() => plate(0.315, 0.415, 0.004, 0.09, 0.001, 14), []);
  const navy = "#1c2340";
  const rust = "#a8412a";
  return (
    <group>
      <mesh geometry={guard} castShadow receiveShadow>
        <Surface color={rust} roughness={0.6} normalMap={kit.grain(8)} normalScale={0.5} />
      </mesh>
      <mesh geometry={face} position={[0, 0.0135, 0]} receiveShadow>
        <Surface map={faceTex} roughness={0.78} normalMap={kit.grain(16)} normalScale={0.9} />
      </mesh>
      {/* throat, narrowing into the handle */}
      <Box args={[0.11, 0.016, 0.07]} radius={0.005} position={[0, 0.008, 0.245]} color={rust} roughness={0.6} />
      <Box args={[0.06, 0.022, 0.06]} radius={0.005} position={[0, 0.011, 0.29]} color={navy} roughness={0.6} />
      {/* handle: wrapped grip tape, perforated, with a butt cap */}
      <Cyl r={0.023} h={0.2} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.023, 0.41]} color="#3b4150" roughness={0.92} segments={28} normalMap={kit.knurl(3, 9)} normalScale={0.9} />
      {[0.33, 0.49].map((z) => (
        <Torus key={z} r={0.0235} tube={0.0035} position={[0, 0.023, z]} color="#15171c" roughness={0.8} />
      ))}
      <Cyl r={0.031} h={0.028} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.027, 0.524]} color={navy} roughness={0.55} segments={28} />
      {/* the ball, beside the face */}
      <mesh position={[0.28, 0.037, 0.12]} rotation={[0.4, 0.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.037, 40, 28]} />
        <Surface map={ballTex} roughness={0.55} clearcoat={0.25} clearcoatRoughness={0.4} />
      </mesh>
    </group>
  );
}

/* ---------- A folding drone ---------- */
export function Drone() {
  const dark = "#232427";
  const shell = { color: "#b4b8be", roughness: 0.5, normalMap: kit.grain(14), normalScale: 0.35, clearcoat: 0.25, clearcoatRoughness: 0.5 } as const;
  const under = { color: "#878c93", roughness: 0.6, normalMap: kit.grain(14), normalScale: 0.35 } as const;
  const hull = useMemo(() => plate(0.14, 0.31, 0.05, 0.035, 0.012), []);
  const blade = useMemo(() => {
    // a real blade: wide at the root, tapering and twisting toward the tip
    const g = new THREE.PlaneGeometry(0.095, 0.017, 8, 1);
    g.rotateX(-Math.PI / 2);
    g.translate(0.0475, 0, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = p.getX(i) / 0.095;
      const z = p.getZ(i) * (1 - t * 0.55);
      p.setZ(i, z);
      p.setY(i, z * (0.5 - t * 0.35));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  // arms sweep out from the body corners: front pair forward, rear pair back
  const arms: { from: [number, number]; to: [number, number] }[] = [
    { from: [-0.055, -0.1], to: [-0.2, -0.21] },
    { from: [0.055, -0.1], to: [0.2, -0.21] },
    { from: [-0.055, 0.1], to: [-0.21, 0.19] },
    { from: [0.055, 0.1], to: [0.21, 0.19] },
  ];
  return (
    <group position={[0, 0.03, 0]}>
      {/* landing feet */}
      {[[-0.05, -0.12], [0.05, -0.12], [-0.05, 0.12], [0.05, 0.12]].map(([x, z]) => (
        <Cyl key={`${x}${z}`} r={0.006} h={0.03} position={[x, -0.015, z]} color={dark} roughness={0.7} segments={10} shadow={false} />
      ))}
      {/* body: one rounded hull with a tapered nose and a darker belly */}
      <mesh geometry={hull} position={[0, -0.005, 0.01]} castShadow receiveShadow>
        <Surface {...shell} />
      </mesh>
      <Box args={[0.11, 0.044, 0.1]} radius={0.016} position={[0, 0.018, -0.17]} {...shell} />
      <Box args={[0.15, 0.026, 0.22]} radius={0.01} position={[0, -0.002, 0.02]} {...under} />
      {/* top: battery seam, power button with four charge lights */}
      <Box args={[0.1, 0.004, 0.16]} radius={0.002} position={[0, 0.0455, 0.07]} color="#a3a8ae" roughness={0.5} shadow={false} />
      <Cyl r={0.011} h={0.004} position={[0, 0.048, 0.02]} color={dark} roughness={0.4} segments={20} shadow={false} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} args={[0.006, 0.002, 0.003]} radius={0} position={[-0.015 + i * 0.01, 0.0478, 0.045]} color="#0f3d1c" emissive="#35e06a" emissiveIntensity={i < 3 ? 2 : 0} shadow={false} />
      ))}
      {/* side vents */}
      {[-1, 1].map((sx) =>
        [0, 1, 2, 3].map((i) => <Box key={`${sx}${i}`} args={[0.004, 0.012, 0.014]} radius={0} position={[sx * 0.0705, 0.02, 0.0 + i * 0.022]} color="#0c0c0d" roughness={0.8} shadow={false} />),
      )}
      {/* gimbal camera under the nose: yoke, roll arm, camera body, lens */}
      <Box args={[0.05, 0.012, 0.03]} radius={0.004} position={[0, 0.004, -0.2]} color={dark} roughness={0.5} />
      <Box args={[0.008, 0.03, 0.024]} radius={0.003} position={[0.026, -0.012, -0.212]} color={dark} roughness={0.5} shadow={false} />
      <Box args={[0.04, 0.03, 0.03]} radius={0.007} position={[0, -0.014, -0.218]} color="#1b1c1f" roughness={0.45} normalMap={kit.grain(10)} normalScale={0.3} />
      <Cyl r={0.012} h={0.01} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.014, -0.237]} color="#141416" roughness={0.4} metalness={0.7} segments={24} shadow={false} />
      <mesh position={[0, -0.014, -0.2425]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.009, 24]} />
        <Surface color="#05070d" roughness={0.03} clearcoat={1} iridescence={1} envMapIntensity={2.2} />
      </mesh>
      {/* front obstacle sensors */}
      {[-0.03, 0.03].map((x) => (
        <Box key={x} args={[0.014, 0.012, 0.004]} radius={0.003} position={[x, 0.022, -0.2205]} color="#070a10" roughness={0.08} clearcoat={1} shadow={false} />
      ))}
      {/* arms, motors, folding props */}
      {arms.map(({ from, to }, i) => {
        const dx = to[0] - from[0];
        const dz = to[1] - from[1];
        const len = Math.hypot(dx, dz);
        const ang = Math.atan2(dx, dz);
        return (
          <group key={i}>
            <group position={[(from[0] + to[0]) / 2, 0.018, (from[1] + to[1]) / 2]} rotation={[0, ang, 0]}>
              <Box args={[0.024, 0.016, len]} radius={0.006} {...under} />
            </group>
            <group position={[to[0], 0.028, to[1]]}>
              <Cyl r={0.018} h={0.022} color="#2a2b2e" roughness={0.45} metalness={0.8} segments={28} normalMap={kit.brushed(2)} normalScale={0.4} />
              <Cyl r={0.007} h={0.008} position={[0, 0.015, 0]} color="#9a9da2" metalness={1} roughness={0.3} segments={14} shadow={false} />
              <group position={[0, 0.0205, 0]} rotation={[0, 0.5 + i * 0.9, 0]}>
                {[0, Math.PI].map((r) => (
                  <mesh key={r} geometry={blade} rotation={[0, r, 0]} castShadow>
                    <Surface color="#2c2d30" roughness={0.42} clearcoat={0.4} clearcoatRoughness={0.4} side={THREE.DoubleSide} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
}
