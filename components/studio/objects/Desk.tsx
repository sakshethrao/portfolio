"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Box, Cyl, Surface } from "./primitives";
import { plate, turnedUp } from "./geo";
import { kit, useOak } from "../materials";

type V3 = [number, number, number];

const STEEL = "#1c1d20";

/** a solid oak top with eased edges on a powder-coated steel frame */
export function DeskTop({ w, d }: { w: number; d: number }) {
  const oak = useOak(0.45);
  const top = useMemo(() => plate(w, d, 0.11, 0.045, 0.014, 8), [w, d]);
  const lx = w / 2 - 0.22;
  const lz = d / 2 - 0.22;
  const grain = kit.grain(9);
  return (
    <group>
      <mesh geometry={top} position={[0, -0.11, 0]} castShadow receiveShadow>
        <Surface {...oak} color="#f4e8d8" roughness={1} normalScale={0.9} clearcoat={0.22} clearcoatRoughness={0.42} />
      </mesh>
      {[-lx, lx].map((x) =>
        [-lz, lz].map((z) => (
          <Box key={`${x}${z}`} args={[0.085, 1.72, 0.085]} radius={0.012} position={[x, -0.97, z]} color={STEEL} roughness={0.62} metalness={0.35} normalMap={grain} normalScale={0.4} />
        )),
      )}
      {[-lz, lz].map((z) => (
        <Box key={z} args={[w - 0.5, 0.07, 0.045]} radius={0.008} position={[0, -0.15, z]} color={STEEL} roughness={0.62} metalness={0.35} shadow={false} />
      ))}
      {[-lx, lx].map((x) => (
        <Box key={x} args={[0.045, 0.07, d - 0.5]} radius={0.008} position={[x, -0.15, 0]} color={STEEL} roughness={0.62} metalness={0.35} shadow={false} />
      ))}
      <FloorShadow w={w} d={d} />
    </group>
  );
}

/** a soft pool of shade on the floor, so the desk stands somewhere */
function FloorShadow({ w, d }: { w: number; d: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(40,30,20,0.34)");
    g.addColorStop(0.45, "rgba(40,30,20,0.16)");
    g.addColorStop(1, "rgba(40,30,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0.15, -1.83, 0.1]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[w * 1.9, d * 2.6]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** a wool-felt desk mat */
export function Mat({ size, position }: { size: [number, number]; position: V3 }) {
  const g = useMemo(() => plate(size[0], size[1], 0.014, 0.06, 0.004), [size]);
  return (
    <mesh geometry={g} position={position} castShadow receiveShadow>
      <Surface color="#3d4046" roughness={0.96} normalMap={kit.felt(7)} normalScale={0.9} sheen={0.55} sheenColor="#aab0ba" />
    </mesh>
  );
}

export const LAMP_BULB: V3 = [0.95, 1.085, 0];
export const LAMP_AIM: V3 = [1.45, 0, -0.2];

/** where a lamp standing at `pos`, turned by `ry`, puts its bulb and its pool of light */
export function lampLight(pos: V3, ry: number): { at: V3; to: V3 } {
  const turn = ([x, y, z]: V3): V3 => [pos[0] + x * Math.cos(ry) + z * Math.sin(ry), pos[1] + y, pos[2] - x * Math.sin(ry) + z * Math.cos(ry)];
  return { at: turn(LAMP_BULB), to: turn(LAMP_AIM) };
}

/** a slim LED bar lamp: weighted base, one stem, one arm out over the desk */
export function Lamp({ on }: { on: number }) {
  const base = useMemo(
    () =>
      turnedUp([
        [0, 0],
        [0.165, 0],
        [0.172, 0.006],
        [0.172, 0.026],
        [0.164, 0.034],
        [0.03, 0.04],
        [0, 0.04],
      ]),
    [],
  );
  const halo = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  const grain = kit.grain(10);
  const coat = { color: STEEL, roughness: 0.58, metalness: 0.4, normalMap: grain, normalScale: 0.35 } as const;
  return (
    <group>
      <mesh geometry={base} castShadow receiveShadow>
        <Surface {...coat} />
      </mesh>
      <Cyl r={0.016} h={1.1} position={[0, 0.59, 0]} segments={24} {...coat} />
      {/* brass knuckle where the arm meets the stem */}
      <Cyl r={0.026} h={0.05} position={[0, 1.13, 0]} segments={32} color="#b89255" roughness={0.3} metalness={1} normalMap={kit.knurl(18, 1)} normalScale={0.5} />
      <Box args={[1.32, 0.03, 0.05]} radius={0.012} position={[0.62, 1.115, 0]} {...coat} />
      {/* the glow you actually see: a diffuser bar and a soft halo around it */}
      <Box args={[0.6, 0.012, 0.036]} radius={0.005} position={[0.95, 1.096, 0]} color="#f3ead8" roughness={0.6} emissive="#ffd29a" emissiveIntensity={on * 4} shadow={false} />
      {on > 0 && (
        <sprite position={[0.95, 1.06, 0]} scale={[1.5, 0.75, 1]}>
          <spriteMaterial map={halo} color="#ffc98a" opacity={on * 0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} transparent />
        </sprite>
      )}
      {/* the light itself: a diffuser strip under the arm */}
      <mesh position={[0.95, 1.0895, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.032]} />
        <meshStandardMaterial color="#f3ead8" roughness={0.6} emissive="#ffd29a" emissiveIntensity={on * 5} toneMapped={on < 0.5} />
      </mesh>
    </group>
  );
}
