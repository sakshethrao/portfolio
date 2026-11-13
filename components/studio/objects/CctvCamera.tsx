"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scroll } from "@/lib/scroll";
import { Box, Cyl, Ball, Tube, Surface } from "./primitives";
import { turned, turnedUp } from "./geo";
import { kit } from "../materials";

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

const WHITE = "#e2e0da";

/**
 * A bullet CCTV camera on a desk mount. Off-white polycarbonate body with a
 * sun hood, dark faceplate, IR LED ring around a glass lens, a rec light,
 * a cable gland and a cable that runs down to the desk. The head yaws and
 * pitches to follow the visitor's pointer; left alone it slowly sweeps.
 */
export function CctvCamera({
  track = true,
  accent = "#ff3b30",
  cableTo = [0.9, 0.012, -0.5],
  ir = 0.45,
}: {
  track?: boolean;
  accent?: string;
  /** where the desk cable ends (the box's port), in the camera's own space */
  cableTo?: [number, number, number];
  /** how brightly the IR ring shows (it only really glows after dark) */
  ir?: number;
}) {
  const p0: [number, number, number] = [0.12, 0.012, -0.42];
  const [tx, ty, tz] = cableTo;
  const cable: [number, number, number][] = [
    p0,
    [p0[0] + (tx - p0[0]) * 0.3, 0.012, p0[2] + (tz - p0[2]) * 0.15 - 0.1],
    [p0[0] + (tx - p0[0]) * 0.75, 0.014, tz + 0.16],
    [tx, ty, tz + 0.04],
    [tx, ty, tz],
  ];
  const head = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();
  const cur = useRef({ yaw: 0, pitch: 0 });
  const v = new THREE.Vector3();
  const wp = new THREE.Vector3();

  useFrame((_state, dt) => {
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
      // idle: drift with the scroll rather than with a clock, so a still page
      // needs no frames at all (and a touch device still gets some life)
      yaw = Math.sin(scroll.y * 0.0016) * 0.4;
      pitch = -0.06;
    }
    yaw = THREE.MathUtils.clamp(yaw, -1.25, 1.25);
    pitch = THREE.MathUtils.clamp(pitch, -0.55, 0.65);
    const k = 1 - Math.pow(0.001, dt);
    cur.current.yaw += (yaw - cur.current.yaw) * k * 0.6;
    cur.current.pitch += (pitch - cur.current.pitch) * k * 0.6;
    head.current.rotation.set(-cur.current.pitch, cur.current.yaw, 0, "YXZ");
    // keep frames coming only while the head is still catching up
    if (Math.abs(yaw - cur.current.yaw) > 2e-4 || Math.abs(pitch - cur.current.pitch) > 2e-4) invalidate();
  });

  const parts = useMemo(
    () => ({
      base: turnedUp([[0, 0], [0.15, 0], [0.158, 0.006], [0.158, 0.02], [0.15, 0.028], [0.06, 0.034], [0.04, 0.06], [0, 0.06]]),
      post: turnedUp([[0.04, 0.05], [0.03, 0.09], [0.028, 0.5], [0.036, 0.53], [0, 0.53]], 32),
      body: turned(
        [[0, -0.25], [0.07, -0.25], [0.106, -0.238], [0.125, -0.212], [0.13, -0.175], [0.13, 0.2], [0.135, 0.204], [0.135, 0.243], [0.131, 0.247], [0.1225, 0.247], [0.1225, 0.236], [0, 0.236]],
        72,
      ),
      barrel: turned([[0.05, 0.236], [0.05, 0.256], [0.047, 0.26], [0.04, 0.26], [0.04, 0.24]], 48),
      shield: (() => {
        const g = new THREE.CylinderGeometry(0.147, 0.147, 0.46, 48, 1, true, Math.PI - 1.8, 3.6);
        g.rotateX(Math.PI / 2);
        g.translate(0, 0, 0.07);
        return g;
      })(),
    }),
    [],
  );
  const shell = { color: WHITE, roughness: 0.46, clearcoat: 0.18, clearcoatRoughness: 0.4, normalMap: kit.grain(12), normalScale: 0.3 };

  return (
    <group>
      {/* mount: a cast base with three screws, a post, a locking ball joint */}
      <mesh geometry={parts.base} castShadow receiveShadow>
        <Surface {...shell} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.5;
        return (
          <group key={i} position={[Math.cos(a) * 0.118, 0.03, Math.sin(a) * 0.118]}>
            <Cyl r={0.013} h={0.006} color="#8d9096" metalness={1} roughness={0.32} segments={16} shadow={false} />
            <Box args={[0.016, 0.002, 0.003]} radius={0} position={[0, 0.0035, 0]} rotation={[0, a * 2, 0]} color="#2a2b2e" roughness={0.6} shadow={false} />
          </group>
        );
      })}
      <mesh geometry={parts.post} castShadow receiveShadow>
        <Surface {...shell} />
      </mesh>
      <Cyl r={0.05} h={0.03} position={[0, 0.54, 0]} color="#2b2d31" roughness={0.5} metalness={0.6} normalMap={kit.knurl(20, 1)} normalScale={0.6} segments={40} />
      <Ball r={0.05} position={[0, 0.575, 0]} color="#d9d7d2" roughness={0.4} clearcoat={0.2} />

      {/* head */}
      <group ref={head} position={[0, 0.6, 0]}>
        {/* neck from the joint to the body */}
        <Cyl r={0.03} h={0.07} position={[0, -0.01, -0.02]} segments={24} {...shell} />
        <group position={[0, 0.06, 0]}>
          {/* body: one turned shell, rounded at the back, rimmed at the front */}
          <mesh geometry={parts.body} castShadow receiveShadow>
            <Surface {...shell} />
          </mesh>
          {/* part lines */}
          {[-0.17, 0.11].map((z) => (
            <mesh key={z} position={[0, 0, z]}>
              <torusGeometry args={[0.1302, 0.0016, 8, 72]} />
              <Surface color="#8f8d88" roughness={0.7} />
            </mesh>
          ))}
          {/* sun shield: a half shell riding on a rail along the top */}
          <mesh geometry={parts.shield} castShadow>
            <Surface {...shell} side={THREE.DoubleSide} />
          </mesh>
          <Box args={[0.06, 0.012, 0.3]} radius={0.004} position={[0, 0.139, 0.02]} {...shell} shadow={false} />
          <Cyl r={0.008} h={0.006} position={[0, 0.152, -0.06]} color="#8d9096" metalness={1} roughness={0.3} segments={12} shadow={false} />

          {/* front: smoked glass over the IR ring and the lens */}
          <mesh position={[0, 0, 0.2362]}>
            <circleGeometry args={[0.1215, 64]} />
            <Surface color="#050506" roughness={0.3} clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={0.55} />
          </mesh>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.089, Math.sin(a) * 0.089, 0.2368]}>
                <circleGeometry args={[0.0085, 16]} />
                <Surface color="#0e0304" emissive="#ff2a22" emissiveIntensity={ir} roughness={0.25} clearcoat={1} />
              </mesh>
            );
          })}
          <mesh position={[0.045, -0.105, 0.2368]}>
            <circleGeometry args={[0.005, 12]} />
            <Surface color="#20242c" roughness={0.2} clearcoat={1} />
          </mesh>
          {/* lens: knurled barrel, coated front element */}
          <mesh geometry={parts.barrel} castShadow>
            <Surface color="#141518" roughness={0.42} metalness={0.7} normalMap={kit.knurl(26, 1)} normalScale={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.2585]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.32, 1]}>
            <sphereGeometry args={[0.04, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Surface color="#05080f" roughness={0.03} clearcoat={1} clearcoatRoughness={0.02} iridescence={0.9} envMapIntensity={2.2} />
          </mesh>
          <mesh position={[0, 0, 0.2592]}>
            <circleGeometry args={[0.016, 24]} />
            <Surface color="#010102" roughness={0.3} />
          </mesh>

          {/* status light */}
          <Ball r={0.008} position={[0.082, 0.098, -0.12]} color={accent} emissive={accent} emissiveIntensity={2.4} roughness={0.3} />
          {/* cable gland + cable */}
          <Cyl r={0.04} h={0.045} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.268]} color="#232528" roughness={0.55} metalness={0.3} normalMap={kit.knurl(16, 1)} normalScale={0.7} segments={32} />
          <Cyl r={0.026} h={0.03} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.3]} color="#17181a" roughness={0.7} segments={24} />
          <Tube points={[[0, 0, -0.31], [0, -0.06, -0.42], [0.05, -0.31, -0.48], [0.12, -0.61, -0.42]]} r={0.0105} color="#17181a" roughness={0.6} />
        </group>
      </group>
      {/* cable along the desk, into the box */}
      <Tube points={cable} r={0.0105} color="#17181a" roughness={0.6} />
    </group>
  );
}
