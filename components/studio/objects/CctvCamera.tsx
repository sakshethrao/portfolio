"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Box, Cyl, Ball, Tube } from "./primitives";

/** shared pointer, normalised device coords; -2 = no pointer yet */
export const pointer = { x: -2, y: -2, lastMove: 0 };

if (typeof window !== "undefined") {
  const onMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    pointer.lastMove = performance.now();
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
}

const WHITE = "#eceae5";
const DARK = "#1d1f22";
const STEEL = "#8e9196";

/**
 * A bullet CCTV camera on a desk mount. Off-white polycarbonate body with a
 * sun hood, dark faceplate, IR LED ring around a glass lens, a rec light,
 * a cable gland and a cable that runs down to the desk. The head yaws and
 * pitches to follow the visitor's pointer; left alone it slowly sweeps.
 */
export function CctvCamera({ track = true, accent = "#ff3b30" }: { track?: boolean; accent?: string }) {
  const head = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const cur = useRef({ yaw: 0, pitch: 0 });
  const v = new THREE.Vector3();
  const wp = new THREE.Vector3();

  useFrame((state, dt) => {
    if (!head.current) return;
    let yaw = 0;
    let pitch = 0.05;
    const idle = performance.now() - pointer.lastMove > 2500 || pointer.x < -1.5;
    if (track && !idle) {
      head.current.getWorldPosition(wp);
      v.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(wp);
      yaw = Math.atan2(v.x, v.z);
      pitch = Math.atan2(v.y, Math.hypot(v.x, v.z));
    } else {
      const t = state.clock.elapsedTime;
      yaw = Math.sin(t * 0.35) * 0.6;
      pitch = -0.08 + Math.sin(t * 0.9) * 0.04;
    }
    yaw = THREE.MathUtils.clamp(yaw, -1.25, 1.25);
    pitch = THREE.MathUtils.clamp(pitch, -0.55, 0.65);
    const k = 1 - Math.pow(0.001, dt);
    cur.current.yaw += (yaw - cur.current.yaw) * k * 0.6;
    cur.current.pitch += (pitch - cur.current.pitch) * k * 0.6;
    head.current.rotation.set(-cur.current.pitch, cur.current.yaw, 0, "YXZ");
  });

  return (
    <group>
      {/* base plate, post, ball joint */}
      <Cyl r={0.16} h={0.03} position={[0, 0.015, 0]} color={DARK} roughness={0.5} metalness={0.6} />
      <Cyl r={0.12} h={0.012} position={[0, 0.036, 0]} color={STEEL} roughness={0.35} metalness={0.9} />
      <Cyl r={0.032} h={0.5} position={[0, 0.29, 0]} color={STEEL} roughness={0.32} metalness={0.9} segments={32} />
      <Ball r={0.055} position={[0, 0.56, 0]} color={DARK} roughness={0.45} metalness={0.5} />
      {/* screws */}
      {[0, 1, 2, 3].map((i) => (
        <Cyl key={i} r={0.012} h={0.006} position={[Math.cos((i * Math.PI) / 2) * 0.125, 0.045, Math.sin((i * Math.PI) / 2) * 0.125]} color="#5a5d62" metalness={0.9} roughness={0.3} segments={16} shadow={false} />
      ))}

      {/* head */}
      <group ref={head} position={[0, 0.6, 0]}>
        {/* bracket from the joint up to the body */}
        <Box args={[0.05, 0.12, 0.05]} position={[0, 0.02, -0.02]} color={DARK} metalness={0.5} roughness={0.5} />
        {/* body, axis along +z */}
        <Cyl r={0.13} h={0.48} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} color={WHITE} roughness={0.38} clearcoat={0.25} />
        {/* seam ring */}
        <Cyl r={0.134} h={0.02} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, -0.08]} color="#d9d7d1" roughness={0.4} />
        {/* sun hood */}
        <Cyl r={0.15} h={0.16} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.075, 0.2]} color={WHITE} roughness={0.38} clearcoat={0.25} />
        {/* faceplate + inner throat */}
        <Cyl r={0.126} h={0.02} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0.29]} color={DARK} roughness={0.6} />
        <Cyl r={0.118} h={0.06} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0.255]} color="#0d0e10" roughness={0.9} />
        {/* IR LED ring */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <Cyl key={i} r={0.011} h={0.006} rotation={[Math.PI / 2, 0, 0]} position={[Math.cos(a) * 0.098, 0.06 + Math.sin(a) * 0.098, 0.301]} color="#2a0b0b" emissive="#5a1010" emissiveIntensity={0.6} roughness={0.3} clearcoat={1} segments={12} shadow={false} />;
        })}
        {/* lens barrel + glass */}
        <Cyl r={0.062} h={0.05} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0.31]} color="#111214" roughness={0.35} metalness={0.4} />
        <Cyl r={0.05} h={0.01} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0.337]} color="#0a1626" roughness={0.03} metalness={0.1} clearcoat={1} envMapIntensity={2} shadow={false} />
        <Cyl r={0.022} h={0.004} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0.343]} color="#1a2c4a" roughness={0.02} clearcoat={1} envMapIntensity={2.5} segments={24} shadow={false} />
        {/* rec light + cable gland + cable */}
        <Ball r={0.011} position={[0.08, 0.16, -0.12]} color={accent} emissive={accent} emissiveIntensity={2.2} roughness={0.3} />
        <Cyl r={0.045} h={0.05} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, -0.255]} color={DARK} roughness={0.5} />
        <Cyl r={0.03} h={0.04} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, -0.29]} color="#2a2c30" roughness={0.6} />
        <Tube points={[[0, 0.06, -0.31], [0, 0.0, -0.42], [0.05, -0.25, -0.48], [0.12, -0.55, -0.42]]} r={0.011} color="#17181a" roughness={0.55} />
      </group>
      {/* cable continuing along the desk */}
      <Tube points={[[0.12, 0.012, -0.42], [0.3, 0.012, -0.6], [0.6, 0.012, -0.62], [0.9, 0.012, -0.5]]} r={0.011} color="#17181a" roughness={0.55} />
    </group>
  );
}
