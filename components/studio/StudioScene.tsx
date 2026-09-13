"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Edges, Html } from "@react-three/drei";
import * as THREE from "three";
import { studioObjects, type StudioObjectKey } from "@/content/studio";
import { ItemCtx } from "./objects/primitives";
import { CctvCamera } from "./objects/CctvCamera";
import { AiBox, Phone, Laptop, Camera35, BoardingPass, ResumeSheet, CricketBall } from "./objects/Things";

export type StudioProgress = { current: number };

/* ---------------------------------------------------------------------------
   Layout of the desk (world units; desk is 6 × 3.6, centred at the origin)
   --------------------------------------------------------------------------- */
const LAYOUT: Record<StudioObjectKey, { pos: [number, number, number]; rot?: [number, number, number]; top: number }> = {
  cctv: { pos: [-1.75, 0, -0.55], top: 0.95 },
  aibox: { pos: [-1.05, 0, -1.0], rot: [0, 0.18, 0], top: 0.2 },
  laptop: { pos: [0.25, 0, -0.35], rot: [0, -0.06, 0], top: 0.95 },
  phone: { pos: [1.35, 0, -0.15], rot: [0, 0.32, 0], top: 0.12 },
  camera: { pos: [1.95, 0, 0.75], rot: [0, -0.55, 0], top: 0.45 },
  pass: { pos: [-0.35, 0, 0.9], rot: [0, 0.22, 0], top: 0.1 },
  resume: { pos: [-1.6, 0, 0.75], rot: [0, -0.14, 0], top: 0.1 },
  ball: { pos: [0.95, 0, 0.95], top: 0.28 },
};

/* camera keyframes: hero (close on the CCTV camera) → desk (whole scene) */
const RIG = {
  landscape: {
    hero: { pos: [-2.95, 1.0, 1.85], look: [-2.35, 0.62, -0.5] },
    desk: { pos: [0.1, 4.4, 4.3], look: [0, 0.05, -0.15] },
    fov: 30,
  },
  portrait: {
    hero: { pos: [-2.7, 0.6, 2.2], look: [-1.75, 0.95, -0.55] },
    desk: { pos: [0.05, 6.2, 5.4], look: [0, 0.05, -0.1] },
    fov: 36,
  },
};

function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ---------------------------------------------------------------------------
   Camera rig
   --------------------------------------------------------------------------- */
function Rig({ progress, reduce }: { progress: StudioProgress; reduce: boolean }) {
  const { camera, size, invalidate } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const la = useMemo(() => new THREE.Vector3(), []);
  const lb = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const portrait = size.width < size.height * 1.05;
    const r = portrait ? RIG.portrait : RIG.landscape;
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.fov !== r.fov) {
      cam.fov = r.fov;
      cam.updateProjectionMatrix();
    }
    const p = reduce ? 1 : progress.current;
    const t = smoothstep(0.3, 0.78, p);
    a.fromArray(r.hero.pos);
    b.fromArray(r.desk.pos);
    la.fromArray(r.hero.look);
    lb.fromArray(r.desk.look);
    camera.position.lerpVectors(a, b, t);
    camera.position.y += Math.sin(t * Math.PI) * 0.5; // a slight arc, like a crane
    look.lerpVectors(la, lb, t);
    camera.lookAt(look);
    invalidate();
  });
  return null;
}

/* ---------------------------------------------------------------------------
   An object on the desk: hover lifts it and turns its outline to the accent,
   a caption appears; click navigates.
   --------------------------------------------------------------------------- */
function Item({
  id,
  accent,
  hovered,
  setHovered,
  onSelect,
  children,
  visibleCaptions,
}: {
  id: StudioObjectKey;
  accent: string;
  hovered: StudioObjectKey | null;
  setHovered: (k: StudioObjectKey | null) => void;
  onSelect: (k: StudioObjectKey) => void;
  children: React.ReactNode;
  visibleCaptions: boolean;
}) {
  const lift = useRef<THREE.Group>(null);
  const hover = hovered === id;
  const meta = studioObjects.find((o) => o.key === id)!;
  const L = LAYOUT[id];

  useFrame((_, dt) => {
    if (!lift.current) return;
    const ty = hover ? 0.07 : 0;
    const k = 1 - Math.pow(0.0005, dt);
    lift.current.position.y += (ty - lift.current.position.y) * k;
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(id);
  };
  const out = () => {
    if (hovered === id) setHovered(null);
  };

  return (
    <group position={L.pos} rotation={L.rot}>
      <group ref={lift} onPointerOver={over} onPointerOut={out} onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
        <ItemCtx.Provider value={{ hover, accent }}>{children}</ItemCtx.Provider>
        {/* invisible catch volume so thin objects are easy to hover */}
        <mesh position={[0, L.top / 2, 0]} visible={false}>
          <boxGeometry args={[0.8, Math.max(L.top, 0.25), 0.7]} />
          <meshBasicMaterial />
        </mesh>
      </group>
      <Html
        position={[0, L.top + 0.12, 0]}
        center
        zIndexRange={[30, 0]}
        style={{ pointerEvents: "none", opacity: hover && visibleCaptions ? 1 : 0, transition: "opacity .25s cubic-bezier(.22,1,.36,1)", transform: `translateY(${hover ? 0 : 6}px)` }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(18,18,18,0.18)",
            padding: "10px 12px",
            width: 220,
            fontSize: 12.5,
            lineHeight: 1.45,
            color: "#121212",
            boxShadow: "0 8px 24px -12px rgba(18,18,18,0.25)",
            whiteSpace: "normal",
          }}
        >
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: accent, marginBottom: 4 }}>{meta.label.toUpperCase()} →</div>
          {meta.line}
        </div>
      </Html>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   The desk
   --------------------------------------------------------------------------- */
function Desk() {
  // unlit white: the desk *is* the page. Only its outline and the shadows show.
  const slab = (
    <ItemCtx.Provider value={{ hover: false, accent: "#000" }}>
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[6, 0.08, 3.6]} />
        <meshBasicMaterial color="#ffffff" />
        <Edges threshold={10} color="#121212" transparent opacity={0.4} />
      </mesh>
      {[-2.85, 2.85].map((x) => (
        <mesh key={x} position={[x, -0.88, 1.65]}>
          <boxGeometry args={[0.06, 1.6, 0.06]} />
          <meshBasicMaterial color="#ffffff" />
          <Edges threshold={10} color="#121212" transparent opacity={0.4} />
        </mesh>
      ))}
    </ItemCtx.Provider>
  );
  return (
    <group>
      {slab}
      <ContactShadows position={[0, 0.005, 0]} opacity={0.3} scale={7.5} blur={2.4} far={1.4} resolution={512} frames={1} color="#121212" />
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Scene
   --------------------------------------------------------------------------- */
export default function StudioScene({
  progress,
  accent,
  reduce,
  active,
  onSelect,
  onHover,
}: {
  progress: StudioProgress;
  accent: string;
  reduce: boolean;
  /** false = stage is off-screen; the render loop stops */
  active: boolean;
  onSelect: (key: StudioObjectKey) => void;
  onHover: (key: StudioObjectKey | null) => void;
}) {
  const [hovered, setHoveredState] = useState<StudioObjectKey | null>(null);
  const setHovered = (k: StudioObjectKey | null) => {
    setHoveredState(k);
    onHover(k);
  };

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  // captions only make sense once the desk is in view
  const [captions, setCaptions] = useState(reduce);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = () => {
      setCaptions((c) => {
        const want = progress.current > 0.45;
        return want === c ? c : want;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, reduce]);

  const common = { accent, hovered, setHovered, onSelect, visibleCaptions: captions };

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      flat // no tone mapping: white must stay #ffffff so the desk is the page
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      camera={{ fov: 30, near: 0.1, far: 40, position: [-2.9, 0.75, 1.9] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
      onPointerMissed={() => setHovered(null)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.15} />
        <hemisphereLight args={["#ffffff", "#d8d6d0", 0.55]} />
        <directionalLight position={[3, 7, 4]} intensity={1.05} />
        <Rig progress={progress} reduce={reduce} />
        <Desk />

        <Item id="cctv" {...common}><CctvCamera track={!reduce} accent={accent} /></Item>
        <Item id="aibox" {...common}><AiBox accent={accent} /></Item>
        <Item id="laptop" {...common}><Laptop /></Item>
        <Item id="phone" {...common}><Phone /></Item>
        <Item id="camera" {...common}><Camera35 /></Item>
        <Item id="pass" {...common}><BoardingPass /></Item>
        <Item id="resume" {...common}><ResumeSheet /></Item>
        <Item id="ball" {...common}><CricketBall /></Item>
      </Suspense>
    </Canvas>
  );
}
