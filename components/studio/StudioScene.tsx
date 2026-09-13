"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { studioObjects, type StudioObjectKey } from "@/content/studio";
import { ItemCtx, Box, Cyl, useWoodTexture } from "./objects/primitives";
import { CctvCamera } from "./objects/CctvCamera";
import { AiBox, Phone, Laptop, Camera35, BoardingPass, ResumeSheet, CricketBall, Mug, Pencil, Plant } from "./objects/Things";

export type StudioProgress = { current: number };

/* ---------------------------------------------------------------------------
   Layout of the desk (world units; desk is 6 × 3.6, centred at the origin)
   --------------------------------------------------------------------------- */
/* dx nudges the caption sideways so it stays inside the stage near the edges */
const LAYOUT: Record<StudioObjectKey, { pos: [number, number, number]; rot?: [number, number, number]; top: number; foot: number; dx?: number }> = {
  cctv: { pos: [-1.75, 0, -0.55], top: 0.95, foot: 0.26, dx: 0.35 },
  aibox: { pos: [-1.05, 0, -1.0], rot: [0, 0.18, 0], top: 0.2, foot: 0.4 },
  laptop: { pos: [0.25, 0, -0.35], rot: [0, -0.06, 0], top: 0.95, foot: 0.82 },
  phone: { pos: [1.35, 0, -0.15], rot: [0, 0.32, 0], top: 0.12, foot: 0.44, dx: -0.3 },
  camera: { pos: [1.95, 0, 0.75], rot: [0, -0.55, 0], top: 0.45, foot: 0.36, dx: -0.6 },
  pass: { pos: [-0.35, 0, 0.9], rot: [0, 0.22, 0], top: 0.1, foot: 0.44 },
  resume: { pos: [-1.6, 0, 0.75], rot: [0, -0.14, 0], top: 0.1, foot: 0.52, dx: 0.4 },
  ball: { pos: [0.95, 0, 0.95], top: 0.28, foot: 0.16 },
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
      {/* selection ring on the desk */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={hover}>
        <ringGeometry args={[L.foot, L.foot + 0.018, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={lift} onPointerOver={over} onPointerOut={out} onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
        <ItemCtx.Provider value={{ hover, accent }}>{children}</ItemCtx.Provider>
        {/* invisible catch volume so thin objects are easy to hover */}
        <mesh position={[0, L.top / 2, 0]} visible={false}>
          <boxGeometry args={[0.8, Math.max(L.top, 0.25), 0.7]} />
          <meshBasicMaterial />
        </mesh>
      </group>
      <Html
        position={[L.dx ?? 0, L.top + 0.12, 0]}
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
/** an oak desk with a slim steel frame, plus the things that just live on it */
function Desk() {
  const wood = useWoodTexture();
  return (
    <ItemCtx.Provider value={{ hover: false, accent: "#000" }}>
      <group>
        <Box args={[6.2, 0.09, 3.7]} radius={0.02} position={[0, -0.045, 0]} map={wood} color="#f1e6d6" roughness={0.55} clearcoat={0.08} />
        {/* frame: front + back rails and four legs, dark steel */}
        {[-2.9, 2.9].map((x) =>
          [-1.6, 1.6].map((z) => <Cyl key={`${x}${z}`} r={0.03} h={1.7} position={[x, -0.94, z]} color="#2a2c30" roughness={0.45} metalness={0.7} segments={16} />),
        )}
        <Box args={[5.9, 0.05, 0.05]} radius={0.01} position={[0, -0.115, 1.6]} color="#2a2c30" roughness={0.45} metalness={0.7} shadow={false} />
        <Box args={[5.9, 0.05, 0.05]} radius={0.01} position={[0, -0.115, -1.6]} color="#2a2c30" roughness={0.45} metalness={0.7} shadow={false} />
        <ContactShadows position={[0, 0.004, 0]} opacity={0.35} scale={7.5} blur={2} far={1.2} resolution={512} frames={1} color="#3a2a18" />

        {/* décor */}
        <group position={[1.2, 0, -0.95]}>
          <Mug />
        </group>
        <group position={[-0.95, 0, 0.35]}>
          <Pencil />
        </group>
        <group position={[2.45, 0, -1.05]}>
          <Plant />
        </group>
      </group>
    </ItemCtx.Provider>
  );
}

/** studio lighting: a warm key from the window side, a cool fill, and a soft
 *  overhead panel — the environment gives the metal and glass something to reflect */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#ffffff", "#b9a58a", 0.5]} />
      <directionalLight
        position={[3.5, 6.5, 4]}
        intensity={2.3}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#dfe8ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -1]} scale={[10, 5, 1]} />
        <Lightformer intensity={1.2} rotation-y={Math.PI / 2} position={[-6, 2, 1]} scale={[3, 5, 1]} color="#ffe9d6" />
        <Lightformer intensity={1.6} rotation-y={-Math.PI / 2} position={[6, 3, 0]} scale={[4, 4, 1]} color="#dbe8ff" />
      </Environment>
    </>
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
      shadows="soft"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      camera={{ fov: 30, near: 0.1, far: 40, position: [-2.9, 0.75, 1.9] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
      onPointerMissed={() => setHovered(null)}
    >
      <Suspense fallback={null}>
        <Lights />
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
