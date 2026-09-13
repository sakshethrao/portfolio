"use client";

import { Instances, Instance } from "@react-three/drei";
import { Box, Cyl, Plane, Ball, Torus, Tube, Surface, useLaptopScreen, usePhoneScreen, useBoardingPass, useResumeSheet, useLabel } from "./primitives";

const ALU = "#9a9da3";
const DARK = "#1d1f22";

/* ---------- The QS AI Box: a fanless edge box ---------- */
export function AiBox({ accent }: { accent: string }) {
  const label = useLabel("QS·AI BOX", "#f2f2ef", "#222");
  return (
    <group>
      <Box args={[0.58, 0.13, 0.4]} radius={0.014} position={[0, 0.075, 0]} color="#2c2f34" roughness={0.42} metalness={0.7} />
      {/* heatsink fins on top */}
      {Array.from({ length: 9 }).map((_, i) => (
        <Box key={i} args={[0.025, 0.02, 0.3]} radius={0.003} position={[-0.2 + i * 0.05, 0.15, 0]} color="#3a3d43" roughness={0.4} metalness={0.7} shadow={false} />
      ))}
      {/* front: power LED, USB, ethernet */}
      <Ball r={0.011} position={[0.23, 0.075, 0.202]} color="#22c55e" emissive="#22c55e" emissiveIntensity={2.4} roughness={0.3} />
      <Box args={[0.05, 0.02, 0.006]} radius={0} position={[-0.18, 0.075, 0.202]} color="#0b0c0e" roughness={0.8} shadow={false} />
      <Box args={[0.05, 0.02, 0.006]} radius={0} position={[-0.11, 0.075, 0.202]} color="#0b0c0e" roughness={0.8} shadow={false} />
      <Box args={[0.06, 0.045, 0.006]} radius={0} position={[0.0, 0.07, 0.202]} color="#0b0c0e" roughness={0.8} shadow={false} />
      <Box args={[0.03, 0.03, 0.006]} radius={0} position={[0.11, 0.07, 0.202]} color={accent} roughness={0.5} shadow={false} />
      {/* label */}
      <Plane w={0.2} h={0.075} position={[-0.12, 0.011, 0.11]} rotation={[-Math.PI / 2, 0, 0]} map={label} roughness={0.9} />
      {/* rubber feet */}
      {[[-0.24, -0.15], [0.24, -0.15], [-0.24, 0.15], [0.24, 0.15]].map(([x, z]) => (
        <Cyl key={`${x}${z}`} r={0.018} h={0.012} position={[x, 0.006, z]} color="#111" roughness={0.95} segments={16} shadow={false} />
      ))}
    </group>
  );
}

/* ---------- Nurture on a phone, lying flat ---------- */
export function Phone() {
  const screen = usePhoneScreen();
  return (
    <group>
      <Box args={[0.36, 0.036, 0.76]} radius={0.03} position={[0, 0.018, 0]} color="#1c1c1e" roughness={0.35} metalness={0.6} />
      <Box args={[0.335, 0.004, 0.735]} radius={0.024} position={[0, 0.037, 0]} color="#050505" roughness={0.1} clearcoat={1} shadow={false} />
      <Plane w={0.318} h={0.7} position={[0, 0.0402, 0]} rotation={[-Math.PI / 2, 0, 0]} map={screen} lit={0.55} roughness={0.15} clearcoat={1} />
      {/* side buttons */}
      <Box args={[0.006, 0.014, 0.06]} radius={0.002} position={[-0.183, 0.02, -0.16]} color="#2a2a2c" metalness={0.6} roughness={0.4} shadow={false} />
      <Box args={[0.006, 0.014, 0.1]} radius={0.002} position={[0.183, 0.02, -0.1]} color="#2a2a2c" metalness={0.6} roughness={0.4} shadow={false} />
    </group>
  );
}

/* ---------- Laptop: the web apps ---------- */
export function Laptop() {
  const screen = useLaptopScreen();
  const keys: [number, number][] = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) keys.push([-0.455 + c * 0.07, -0.16 + r * 0.068]);
  return (
    <group>
      {/* base */}
      <Box args={[1.3, 0.05, 0.88]} radius={0.014} position={[0, 0.025, 0]} color={ALU} roughness={0.45} metalness={0.75} />
      <Plane w={1.06} h={0.38} position={[0, 0.051, -0.03]} rotation={[-Math.PI / 2, 0, 0]} color="#3b3d42" roughness={0.6} metalness={0.3} />
      <Instances range={keys.length} castShadow={false} receiveShadow>
        <boxGeometry args={[0.058, 0.008, 0.056]} />
        <Surface color="#202226" roughness={0.55} />
        {keys.map(([x, z], i) => (
          <Instance key={i} position={[x, 0.056, z]} />
        ))}
      </Instances>
      <Box args={[0.7, 0.006, 0.02]} radius={0.002} position={[0, 0.056, 0.176]} color="#202226" roughness={0.55} shadow={false} />
      {/* trackpad */}
      <Plane w={0.42} h={0.25} position={[0, 0.052, 0.3]} rotation={[-Math.PI / 2, 0, 0]} color="#b0b3b8" roughness={0.3} metalness={0.5} />
      {/* hinge */}
      <Cyl r={0.026} h={1.2} rotation={[0, 0, Math.PI / 2]} position={[0, 0.045, -0.42]} color="#6b6e74" roughness={0.4} metalness={0.8} />
      {/* lid, opened ~105° */}
      <group position={[0, 0.05, -0.43]} rotation={[-0.3, 0, 0]}>
        <Box args={[1.3, 0.84, 0.03]} radius={0.014} position={[0, 0.42, 0]} color={ALU} roughness={0.45} metalness={0.75} />
        <Plane w={1.24} h={0.78} position={[0, 0.42, 0.0165]} color="#050607" roughness={0.12} clearcoat={1} />
        <Plane w={1.19} h={0.7} position={[0, 0.4, 0.018]} map={screen} lit={0.7} roughness={0.15} clearcoat={0.6} />
        {/* webcam */}
        <Ball r={0.007} position={[0, 0.79, 0.018]} color="#0a0a0a" roughness={0.1} clearcoat={1} />
      </group>
    </group>
  );
}

/* ---------- A rangefinder camera: photography ---------- */
export function Camera35() {
  return (
    <group>
      {/* body: leatherette wrap between two silver plates */}
      <Box args={[0.54, 0.3, 0.2]} radius={0.02} position={[0, 0.15, 0]} color="#1a1a1a" roughness={0.85} clearcoat={0.15} />
      <Box args={[0.545, 0.05, 0.205]} radius={0.01} position={[0, 0.3, 0]} color="#cfd0cd" roughness={0.3} metalness={0.85} />
      <Box args={[0.545, 0.035, 0.205]} radius={0.01} position={[0, 0.02, 0]} color="#cfd0cd" roughness={0.3} metalness={0.85} />
      {/* lens mount + lens */}
      <Cyl r={0.105} h={0.02} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.105]} color="#cfd0cd" roughness={0.3} metalness={0.85} />
      <Cyl r={0.092} h={0.13} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.175]} color="#151517" roughness={0.4} metalness={0.5} />
      <Cyl r={0.096} h={0.02} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.2]} color="#2a2a2c" roughness={0.5} metalness={0.4} />
      <Cyl r={0.06} h={0.01} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.242]} color="#0a1626" roughness={0.03} clearcoat={1} envMapIntensity={2} shadow={false} />
      <Cyl r={0.026} h={0.004} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0.15, 0.248]} color="#3a2a7a" roughness={0.02} clearcoat={1} envMapIntensity={2.5} segments={24} shadow={false} />
      {/* viewfinder + rangefinder windows */}
      <Box args={[0.06, 0.04, 0.006]} radius={0} position={[-0.17, 0.235, 0.103]} color="#0a0d12" roughness={0.1} clearcoat={1} shadow={false} />
      <Box args={[0.03, 0.03, 0.006]} radius={0} position={[-0.08, 0.235, 0.103]} color="#0a0d12" roughness={0.1} clearcoat={1} shadow={false} />
      {/* top: shutter, dial, hot shoe, rewind knob */}
      <Cyl r={0.022} h={0.02} position={[0.19, 0.335, 0.0]} color="#cfd0cd" roughness={0.3} metalness={0.85} segments={24} />
      <Cyl r={0.012} h={0.012} position={[0.19, 0.35, 0.0]} color="#2a2a2c" roughness={0.4} segments={16} shadow={false} />
      <Cyl r={0.035} h={0.024} position={[0.1, 0.337, -0.02]} color="#2a2a2c" roughness={0.45} metalness={0.5} segments={32} />
      <Box args={[0.06, 0.02, 0.05]} radius={0.003} position={[-0.02, 0.335, -0.02]} color="#cfd0cd" roughness={0.3} metalness={0.85} />
      <Cyl r={0.03} h={0.03} position={[-0.2, 0.34, -0.02]} color="#cfd0cd" roughness={0.3} metalness={0.85} segments={32} />
      {/* red dot + strap lugs */}
      <Cyl r={0.014} h={0.004} rotation={[Math.PI / 2, 0, 0]} position={[-0.2, 0.15, 0.101]} color="#c8102e" roughness={0.3} clearcoat={1} segments={20} shadow={false} />
      <Torus r={0.014} tube={0.004} position={[-0.275, 0.24, 0]} rotation={[0, Math.PI / 2, 0]} color="#cfd0cd" metalness={0.85} roughness={0.3} />
      <Torus r={0.014} tube={0.004} position={[0.275, 0.24, 0]} rotation={[0, Math.PI / 2, 0]} color="#cfd0cd" metalness={0.85} roughness={0.3} />
    </group>
  );
}

/* ---------- A boarding pass: travel ---------- */
export function BoardingPass() {
  const tex = useBoardingPass();
  return (
    <group>
      <Box args={[0.76, 0.006, 0.31]} radius={0} position={[0, 0.003, 0]} color="#f4f4f1" roughness={0.9} />
      <Plane w={0.76} h={0.31} position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]} map={tex} roughness={0.85} />
    </group>
  );
}

/* ---------- One printed page: the résumé ---------- */
export function ResumeSheet() {
  const tex = useResumeSheet();
  return (
    <group>
      <Box args={[0.6, 0.004, 0.85]} radius={0} position={[0, 0.002, 0]} color="#f7f7f4" roughness={0.95} />
      <Plane w={0.6} h={0.85} position={[0, 0.0045, 0]} rotation={[-Math.PI / 2, 0, 0]} map={tex} roughness={0.9} />
    </group>
  );
}

/* ---------- Cricket ball: off hours ---------- */
export function CricketBall() {
  const stitches: [number, number, number][] = [];
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    stitches.push([Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0]);
  }
  return (
    <group position={[0, 0.1, 0]} rotation={[0.35, 0.5, 0.1]}>
      <Ball r={0.1} color="#a3241c" roughness={0.42} clearcoat={0.5} />
      {/* seam: two rows of stitches either side of the equator */}
      {[-0.012, 0.012].map((dz) => (
        <group key={dz} position={[0, 0, dz]}>
          <Torus r={0.0985} tube={0.0025} color="#f1e9d8" roughness={0.8} />
          <Instances range={stitches.length} castShadow={false}>
            <sphereGeometry args={[0.0042, 8, 8]} />
            <Surface color="#f1e9d8" roughness={0.8} />
            {stitches.map((p, i) => (
              <Instance key={i} position={[p[0] * 1.0, p[1] * 1.0, (i % 2 ? 1 : -1) * 0.004]} />
            ))}
          </Instances>
        </group>
      ))}
    </group>
  );
}

/* ---------- Décor (not hotspots): mug, pencil, plant ---------- */
export function Mug() {
  return (
    <group>
      <Cyl r={0.1} rTop={0.105} h={0.24} position={[0, 0.12, 0]} color="#2f6f5e" roughness={0.25} clearcoat={0.9} />
      <Cyl r={0.092} h={0.01} position={[0, 0.236, 0]} color="#3b2314" roughness={0.3} clearcoat={0.8} shadow={false} />
      <Torus r={0.06} tube={0.016} position={[0.115, 0.13, 0]} rotation={[0, 0, 0]} color="#2f6f5e" roughness={0.25} clearcoat={0.9} />
    </group>
  );
}

export function Pencil() {
  return (
    <group rotation={[0, 0.9, Math.PI / 2]} position={[0, 0.013, 0]}>
      <Cyl r={0.013} h={0.5} segments={6} color="#f2c230" roughness={0.5} clearcoat={0.3} />
      <Cyl r={0.013} rTop={0.004} h={0.05} position={[0, 0.275, 0]} color="#d9b382" roughness={0.9} segments={16} />
      <Cyl r={0.004} rTop={0.0005} h={0.012} position={[0, 0.306, 0]} color="#2b2b2b" roughness={0.6} segments={12} shadow={false} />
      <Cyl r={0.0135} h={0.03} position={[0, -0.265, 0]} color="#b8bcc2" roughness={0.3} metalness={0.9} segments={16} />
      <Cyl r={0.012} h={0.03} position={[0, -0.295, 0]} color="#e58f8f" roughness={0.8} segments={16} />
    </group>
  );
}

export function Plant() {
  const leaves: { p: [number, number, number]; s: [number, number, number]; r: [number, number, number]; c: string }[] = [
    { p: [0.0, 0.42, 0.0], s: [0.07, 0.16, 0.035], r: [0, 0, 0], c: "#3f8f4a" },
    { p: [0.1, 0.36, 0.04], s: [0.06, 0.14, 0.035], r: [0.1, 0.3, -0.7], c: "#2f7a3a" },
    { p: [-0.09, 0.34, -0.03], s: [0.06, 0.15, 0.035], r: [-0.1, -0.4, 0.75], c: "#47994f" },
    { p: [0.03, 0.33, -0.1], s: [0.06, 0.13, 0.035], r: [0.8, 0, 0.1], c: "#2f7a3a" },
    { p: [-0.03, 0.31, 0.1], s: [0.06, 0.13, 0.035], r: [-0.8, 0, -0.1], c: "#3f8f4a" },
  ];
  return (
    <group>
      <Cyl r={0.09} rTop={0.115} h={0.2} position={[0, 0.1, 0]} color="#c4683f" roughness={0.75} />
      <Cyl r={0.118} rTop={0.122} h={0.03} position={[0, 0.2, 0]} color="#c4683f" roughness={0.75} />
      <Cyl r={0.1} h={0.01} position={[0, 0.205, 0]} color="#3b2a1e" roughness={1} shadow={false} />
      {leaves.map((l, i) => (
        <group key={i}>
          <Tube points={[[0, 0.2, 0], [l.p[0] * 0.5, 0.28, l.p[2] * 0.5], [l.p[0], l.p[1] - 0.08, l.p[2]]]} r={0.006} color="#3d6b3a" roughness={0.8} />
          <mesh position={l.p} rotation={l.r} scale={l.s} castShadow>
            <sphereGeometry args={[1, 24, 16]} />
            <Surface color={l.c} roughness={0.6} clearcoat={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
