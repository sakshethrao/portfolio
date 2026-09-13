"use client";

import { Box, Cyl, Plane, Ball, INK, PAPER, PAPER_2, LEATHER } from "./primitives";

/* ---------- The QS AI Box ---------- */
export function AiBox({ accent }: { accent: string }) {
  return (
    <group>
      <Box args={[0.56, 0.12, 0.38]} color={INK} position={[0, 0.06, 0]} />
      {[-0.16, -0.08, 0, 0.08, 0.16].map((x) => (
        <Box key={x} args={[0.02, 0.004, 0.22]} color="#3a3a3a" position={[x, 0.123, 0]} outline={false} />
      ))}
      <Ball r={0.013} color={accent} position={[0.22, 0.06, 0.195]} />
      <Box args={[0.06, 0.03, 0.02]} color="#3a3a3a" position={[-0.18, 0.06, -0.2]} outline={false} />
    </group>
  );
}

/* ---------- Nurture on a phone, lying flat ---------- */
export function Phone() {
  const cream = "#fbf9f1";
  const sage = "#3f6840";
  const sageSoft = "#eae8e0";
  return (
    <group>
      <Box args={[0.36, 0.035, 0.74]} color={INK} position={[0, 0.0175, 0]} />
      <Plane w={0.32} h={0.68} color={cream} position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.32} h={0.11} color={sage} position={[0, 0.037, -0.285]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.26} h={0.1} color={sageSoft} position={[0, 0.037, -0.12]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.26} h={0.1} color={sageSoft} position={[0, 0.037, 0.02]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.26} h={0.1} color={sageSoft} position={[0, 0.037, 0.16]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.26} h={0.05} color={sage} position={[0, 0.037, 0.29]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

/* ---------- Laptop: the web apps ---------- */
export function Laptop() {
  const tint = "#e6e4df";
  return (
    <group>
      {/* base */}
      <Box args={[1.25, 0.05, 0.85]} color={PAPER} position={[0, 0.025, 0]} />
      <Plane w={1.0} h={0.42} color={PAPER_2} position={[0, 0.051, 0.02]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.34} h={0.2} color={PAPER_2} position={[0, 0.051, 0.31]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* lid, opened ~102° */}
      <group position={[0, 0.05, -0.42]} rotation={[-0.35, 0, 0]}>
        <Box args={[1.25, 0.8, 0.035]} color={PAPER} position={[0, 0.4, 0]} />
        <Plane w={1.13} h={0.68} color="#ffffff" position={[0, 0.4, 0.019]} />
        {/* a flat abstraction of a dashboard: top bar, sidebar, three tiles, a chart line */}
        <Plane w={1.13} h={0.05} color={INK} position={[0, 0.715, 0.02]} />
        <Plane w={0.22} h={0.62} color={PAPER_2} position={[-0.455, 0.38, 0.02]} />
        {[-0.14, 0.16, 0.46].map((x) => (
          <Plane key={x} w={0.26} h={0.16} color={tint} position={[x, 0.58, 0.02]} />
        ))}
        <Plane w={0.86} h={0.3} color={tint} position={[0.16, 0.28, 0.02]} />
        <Plane w={0.7} h={0.012} color={INK} position={[0.16, 0.27, 0.021]} rotation={[0, 0, 0.12]} />
      </group>
    </group>
  );
}

/* ---------- A rangefinder camera: photography ---------- */
export function Camera35() {
  return (
    <group>
      <Box args={[0.52, 0.3, 0.2]} color={PAPER} position={[0, 0.15, 0]} />
      <Box args={[0.52, 0.15, 0.205]} color={INK} position={[0, 0.13, 0]} outline={false} />
      <Box args={[0.52, 0.035, 0.2]} color={INK} position={[0, 0.3175, 0]} />
      <Cyl r={0.095} h={0.13} color={INK} rotation={[Math.PI / 2, 0, 0]} position={[0.02, 0.15, 0.16]} />
      <Cyl r={0.045} h={0.01} color={PAPER} rotation={[Math.PI / 2, 0, 0]} position={[0.02, 0.15, 0.228]} outline={false} />
      <Cyl r={0.02} h={0.025} color={INK} position={[0.19, 0.345, 0.02]} segments={16} />
      <Box args={[0.07, 0.03, 0.03]} color={INK} position={[-0.17, 0.35, -0.04]} outline={false} />
    </group>
  );
}

/* ---------- A boarding pass: travel ---------- */
export function BoardingPass() {
  return (
    <group>
      <Box args={[0.74, 0.012, 0.3]} color="#ffffff" position={[0, 0.006, 0]} />
      {/* perforation */}
      {Array.from({ length: 9 }).map((_, i) => (
        <Box key={i} args={[0.006, 0.014, 0.018]} color={INK} position={[0.16, 0.006, -0.13 + i * 0.032]} outline={false} />
      ))}
      {/* a few lines of type */}
      <Plane w={0.28} h={0.02} color={INK} position={[-0.16, 0.0125, -0.09]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.2} h={0.012} color="#8a8a8a" position={[-0.2, 0.0125, -0.04]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane w={0.24} h={0.012} color="#8a8a8a" position={[-0.18, 0.0125, 0.0]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* barcode */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Plane key={i} w={i % 3 === 0 ? 0.014 : 0.007} h={0.12} color={INK} position={[0.22 + i * 0.022, 0.0125, 0.03]} rotation={[-Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
}

/* ---------- One printed page: the résumé ---------- */
export function ResumeSheet() {
  return (
    <group>
      <Box args={[0.6, 0.008, 0.85]} color="#ffffff" position={[0, 0.004, 0]} />
      <Plane w={0.26} h={0.028} color={INK} position={[-0.12, 0.0085, -0.32]} rotation={[-Math.PI / 2, 0, 0]} />
      {[-0.22, -0.17, -0.12, -0.02, 0.03, 0.08, 0.18, 0.23].map((z, i) => (
        <Plane key={z} w={i % 4 === 3 ? 0.22 : 0.4} h={0.01} color="#9a9a9a" position={[i % 4 === 3 ? -0.14 : -0.05, 0.0085, z]} rotation={[-Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
}

/* ---------- Cricket ball: off hours ---------- */
export function CricketBall() {
  return (
    <group position={[0, 0.1, 0]}>
      <Ball r={0.1} color={LEATHER} />
      <mesh rotation={[0.3, 0.4, 0]}>
        <torusGeometry args={[0.1, 0.005, 8, 48]} />
        <meshStandardMaterial color="#f4f3f0" roughness={1} />
      </mesh>
      <mesh rotation={[0.3, 0.4, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.1, 0.005, 8, 48]} />
        <meshStandardMaterial color="#f4f3f0" roughness={1} />
      </mesh>
    </group>
  );
}
