"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Box, Cyl, Surface, Torus } from "./primitives";
import { turnedUp } from "./geo";
import { kit } from "../materials";

type V3 = [number, number, number];

/* ---------- a glazed stoneware mug, with coffee in it ---------- */
export function Mug() {
  const body = useMemo(
    () =>
      turnedUp([
        [0, 0],
        [0.088, 0],
        [0.098, 0.008],
        [0.104, 0.03],
        [0.106, 0.225],
        [0.103, 0.236],
        [0.097, 0.236],
        [0.094, 0.225],
        [0.092, 0.03],
        [0, 0.022],
      ]),
    [],
  );
  const handle = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([[0.098, 0.19, 0], [0.16, 0.185, 0], [0.178, 0.125, 0], [0.155, 0.07, 0], [0.1, 0.055, 0]].map((p) => new THREE.Vector3(...(p as V3))));
    return new THREE.TubeGeometry(c, 32, 0.014, 12, false);
  }, []);
  const glaze = { color: "#2c6a59", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, roughnessMap: kit.wear(1) } as const;
  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <Surface {...glaze} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={handle} castShadow>
        <Surface {...glaze} />
      </mesh>
      {/* the unglazed foot ring */}
      <Cyl r={0.086} h={0.004} position={[0, 0.002, 0]} color="#c9b89c" roughness={0.9} shadow={false} />
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.0935, 48]} />
        <Surface color="#24130a" roughness={0.06} clearcoat={1} clearcoatRoughness={0.02} />
      </mesh>
    </group>
  );
}

/* ---------- a yellow hex pencil ---------- */
export function Pencil() {
  return (
    <group rotation={[0, 0.9, Math.PI / 2]} position={[0, 0.013, 0]}>
      <Cyl r={0.013} h={0.5} segments={6} color="#e9b722" roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.3} />
      <Cyl r={0.0125} rTop={0.004} h={0.05} position={[0, 0.275, 0]} color="#d9b382" roughness={0.9} segments={18} normalMap={kit.paper(2)} />
      <Cyl r={0.004} rTop={0.0006} h={0.014} position={[0, 0.307, 0]} color="#26262a" roughness={0.45} metalness={0.3} segments={12} shadow={false} />
      <Cyl r={0.0138} h={0.034} position={[0, -0.267, 0]} color="#c2c5ca" roughness={0.3} metalness={1} segments={20} normalMap={kit.knurl(10, 3)} normalScale={0.6} />
      <Cyl r={0.0122} h={0.03} position={[0, -0.299, 0]} color="#d98484" roughness={0.85} segments={16} />
    </group>
  );
}

/* ---------- a rubber plant in a terracotta pot ---------- */
function leaf(len: number, wid: number, bend: number) {
  const g = new THREE.PlaneGeometry(wid, len, 6, 14);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(1, Math.max(0, p.getY(i) / len + 0.5)); // 0 at the stem, 1 at the tip
    const half = Math.sin(Math.pow(t, 0.75) * Math.PI) * (1 - t * 0.25);
    const x = p.getX(i) * Math.max(half, 0.04);
    p.setXYZ(i, x, t * len, bend * t * t * len - Math.abs(x) * 0.45); // droop, with a fold along the midrib
  }
  g.computeVertexNormals();
  return g;
}

export function Plant() {
  const pot = useMemo(
    () =>
      turnedUp([
        [0, 0],
        [0.086, 0],
        [0.092, 0.006],
        [0.116, 0.185],
        [0.127, 0.19],
        [0.129, 0.225],
        [0.122, 0.23],
        [0.112, 0.23],
        [0.108, 0.205],
        [0, 0.205],
      ]),
    [],
  );
  const leaves = useMemo(() => {
    const out: { g: THREE.BufferGeometry; ry: number; tilt: number; y: number; c: string }[] = [];
    const greens = ["#2f6b3a", "#3b7d45", "#28603a", "#43894c"];
    for (let i = 0; i < 11; i++) {
      const ring = i < 4 ? 0 : i < 8 ? 1 : 2;
      out.push({
        g: leaf(0.3 + ((i * 37) % 9) * 0.012, 0.13 + ((i * 13) % 5) * 0.008, 0.22 + ring * 0.16),
        ry: i * 2.4,
        tilt: 0.16 + ring * 0.34,
        y: 0.2 + (2 - ring) * 0.07 + ((i * 7) % 4) * 0.01,
        c: greens[i % greens.length],
      });
    }
    return out;
  }, []);
  return (
    <group>
      <mesh geometry={pot} castShadow receiveShadow>
        <Surface color="#b8603c" roughness={0.9} normalMap={kit.grain(5)} normalScale={0.8} roughnessMap={kit.wear(2)} side={THREE.DoubleSide} />
      </mesh>
      <Cyl r={0.108} h={0.01} position={[0, 0.2, 0]} color="#2a1d14" roughness={1} normalMap={kit.leather(6)} normalScale={1.2} shadow={false} />
      <Cyl r={0.012} rTop={0.008} h={0.26} position={[0, 0.32, 0]} color="#4a5a35" roughness={0.8} segments={10} />
      {leaves.map((l, i) => (
        <group key={i} position={[0, l.y, 0]} rotation={[0, l.ry, 0]}>
          <mesh geometry={l.g} rotation={[l.tilt, 0, 0]} castShadow receiveShadow>
            <Surface color={l.c} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- over-ear headphones, laid flat ---------- */
export function Headphones() {
  const band = useMemo(() => {
    const g = new THREE.TorusGeometry(0.3, 0.02, 14, 64, Math.PI);
    g.rotateX(-Math.PI / 2); // lie the arc down on the desk, opening toward +z
    g.scale(1, 1, 1.12);
    return g;
  }, []);
  const pad = useMemo(() => {
    const g = new THREE.TorusGeometry(0.3, 0.027, 12, 40, Math.PI * 0.5);
    g.rotateZ(Math.PI * 0.25);
    g.rotateX(-Math.PI / 2);
    g.scale(1, 1, 1.12);
    return g;
  }, []);
  const plastic = { color: "#1b1c1f", roughness: 0.55, normalMap: kit.grain(8), normalScale: 0.4 } as const;
  return (
    <group position={[0, 0.03, 0]}>
      <mesh geometry={band} castShadow receiveShadow>
        <Surface color="#b9bcc1" roughness={0.32} metalness={1} normalMap={kit.brushed(3)} normalScale={0.3} />
      </mesh>
      <mesh geometry={pad} castShadow>
        <Surface color="#202124" roughness={0.7} normalMap={kit.leather(10)} normalScale={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.3, 0.035, 0.1]} rotation={[0, s * 0.18, 0]}>
          {/* yoke */}
          <Box args={[0.03, 0.022, 0.12]} radius={0.008} position={[0, -0.035, -0.07]} {...plastic} />
          {/* cup: a shallow drum, cushion on top */}
          <Cyl r={0.135} h={0.07} position={[0, 0, 0.04]} segments={56} {...plastic} />
          <Cyl r={0.1} h={0.004} position={[0, -0.0365, 0.04]} segments={48} color="#2a2c30" roughness={0.35} metalness={0.9} normalMap={kit.brushed(2)} normalScale={0.4} shadow={false} />
          <Torus r={0.098} tube={0.04} position={[0, 0.045, 0.04]} rotation={[Math.PI / 2, 0, 0]} color="#242528" roughness={0.75} normalMap={kit.leather(9)} normalScale={0.9} />
          <mesh position={[0, 0.046, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.07, 32]} />
            <Surface color="#0c0c0d" roughness={0.95} normalMap={kit.felt(10)} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- a Diet Coke can ---------- */
function useCanLabel() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    // brushed silver
    const g = ctx.createLinearGradient(0, 0, 1024, 0);
    for (let i = 0; i <= 16; i++) g.addColorStop(i / 16, i % 2 ? "#cfd2d6" : "#e3e5e8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);
    // the wordmark runs up the can, twice around; hand-set, not the real logo
    for (const x of [256, 768]) {
      ctx.save();
      ctx.translate(x, 256);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#c8102e";
      ctx.font = "italic 700 150px Georgia, 'Times New Roman', serif";
      ctx.fillText("Coke", 40, 20);
      ctx.fillStyle = "#17181a";
      ctx.font = "italic 600 62px Georgia, 'Times New Roman', serif";
      ctx.fillText("Diet", -150, -62);
      ctx.restore();
    }
    ctx.fillStyle = "#c8102e";
    ctx.fillRect(0, 486, 1024, 10);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.wrapS = THREE.RepeatWrapping;
    return t;
  }, []);
}

export function Can() {
  const label = useCanLabel();
  const shell = useMemo(
    () =>
      turnedUp(
        [
          [0, 0.012],
          [0.07, 0.012],
          [0.1, 0],
          [0.112, 0.004],
          [0.138, 0.05],
          [0.1385, 0.06],
          [0.1385, 0.44],
          [0.134, 0.47],
          [0.118, 0.5],
          [0.118, 0.512],
          [0.112, 0.512],
          [0.11, 0.503],
          [0, 0.503],
        ],
        56,
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={shell} castShadow receiveShadow>
        <Surface color="#d3d6da" roughness={0.3} metalness={1} normalMap={kit.brushed(3)} normalScale={0.25} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.139, 0.139, 0.38, 56, 1, true]} />
        <Surface map={label} roughness={0.34} metalness={0.85} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      {/* pull tab and the scored opening */}
      <Box args={[0.05, 0.004, 0.085]} radius={0.002} position={[0, 0.506, 0.012]} color="#c7cace" roughness={0.3} metalness={1} shadow={false} />
      <mesh position={[0, 0.5045, -0.045]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.03, 24]} />
        <Surface color="#a9acb1" roughness={0.4} metalness={1} />
      </mesh>
    </group>
  );
}
