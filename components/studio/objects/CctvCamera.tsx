"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Box, Cyl, Ball, INK, PAPER } from "./primitives";

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

/**
 * A wall/desk-mount CCTV camera on a short post. The head yaws and pitches
 * to follow the visitor's pointer; left alone it slowly sweeps the room.
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
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent ease
    cur.current.yaw += (yaw - cur.current.yaw) * k * 0.6;
    cur.current.pitch += (pitch - cur.current.pitch) * k * 0.6;
    head.current.rotation.set(-cur.current.pitch, cur.current.yaw, 0, "YXZ");
  });

  return (
    <group>
      {/* base + post */}
      <Cyl r={0.15} h={0.025} color={INK} position={[0, 0.0125, 0]} />
      <Cyl r={0.028} h={0.56} color={INK} position={[0, 0.3, 0]} outline={false} segments={16} />
      {/* head */}
      <group ref={head} position={[0, 0.6, 0]}>
        {/* body, axis along +z */}
        <Cyl r={0.13} h={0.46} color={PAPER} rotation={[Math.PI / 2, 0, 0]} />
        {/* hood */}
        <Cyl r={0.15} h={0.13} color={PAPER} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.012, 0.19]} />
        {/* lens barrel + iris (the one accent detail) */}
        <Cyl r={0.085} h={0.06} color={INK} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.26]} />
        <Cyl r={0.04} h={0.012} color={accent} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.294]} outline={false} />
        {/* rear cap + cable */}
        <Cyl r={0.1} h={0.06} color={INK} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.25]} />
        <Box args={[0.06, 0.05, 0.14]} color={INK} position={[0, -0.02, -0.33]} outline={false} />
        {/* rec LED */}
        <Ball r={0.014} color="#ff3b30" position={[0.06, 0.1, -0.16]} />
      </group>
    </group>
  );
}
