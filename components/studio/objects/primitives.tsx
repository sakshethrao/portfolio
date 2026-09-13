"use client";

import { Edges } from "@react-three/drei";
import { createContext, useContext } from "react";

/**
 * The drawing kit: matte primitives with an ink outline. Everything on the
 * desk is made of these, so the whole scene reads as one technical
 * illustration rather than a collection of models.
 */
export const INK = "#121212";
export const PAPER = "#f4f3f0";
export const PAPER_2 = "#e9e7e2";
export const LEATHER = "#b3261e";

/** the hover state of the enclosing object, so outlines can pick up the accent */
export const ItemCtx = createContext<{ hover: boolean; accent: string }>({ hover: false, accent: "#ff3b30" });

function Outline({ threshold = 20, strong = false }: { threshold?: number; strong?: boolean }) {
  const { hover, accent } = useContext(ItemCtx);
  return <Edges threshold={threshold} color={hover ? accent : INK} transparent opacity={hover ? 0.95 : strong ? 0.8 : 0.55} />;
}

type V3 = [number, number, number];

export function Box({
  args,
  color = PAPER,
  position,
  rotation,
  outline = true,
  threshold,
}: {
  args: V3;
  color?: string;
  position?: V3;
  rotation?: V3;
  outline?: boolean;
  threshold?: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
      {outline && <Outline threshold={threshold} />}
    </mesh>
  );
}

export function Cyl({
  r,
  h,
  color = PAPER,
  position,
  rotation,
  outline = true,
  segments = 32,
  rTop,
}: {
  r: number;
  h: number;
  color?: string;
  position?: V3;
  rotation?: V3;
  outline?: boolean;
  segments?: number;
  rTop?: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[rTop ?? r, r, h, segments]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
      {outline && <Outline threshold={40} />}
    </mesh>
  );
}

export function Plane({
  w,
  h,
  color,
  position,
  rotation,
}: {
  w: number;
  h: number;
  color: string;
  position?: V3;
  rotation?: V3;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  );
}

export function Ball({ r, color, position }: { r: number; color: string; position?: V3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[r, 32, 24]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
    </mesh>
  );
}
