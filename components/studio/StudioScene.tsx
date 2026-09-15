"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { studioObjects, type StudioObjectKey } from "@/content/studio";
import { ItemCtx, Box, Cyl, useWoodTexture } from "./objects/primitives";
import { DemandFrames } from "./Frames";
import { CctvCamera } from "./objects/CctvCamera";
import { AiBox, AIBOX_PORT, Phone, Laptop, Camera35, BoardingPass, ResumeSheet, CricketBall, Paddle, Drone, Mug, Pencil, Plant } from "./objects/Things";

export type StudioProgress = { current: number };

type V3 = [number, number, number];
type Slot = { pos: V3; rot?: V3; top: number; foot: number; dx?: number };
type Layout = {
  desk: [number, number]; // width × depth
  items: Record<StudioObjectKey, Slot>;
  decor: { mug: V3; pencil: V3; plant: V3 };
  rig: { hero: { pos: V3; look: V3 }; desk: { pos: V3; look: V3 }; fov: number };
};

/* ---------------------------------------------------------------------------
   Two desks: the full one for landscape screens, a tighter one for portrait.
   dx nudges a caption sideways so it stays inside the stage near the edges.
   --------------------------------------------------------------------------- */
const LANDSCAPE: Layout = {
  desk: [6.2, 3.7],
  items: {
    cctv: { pos: [-1.75, 0, -0.55], top: 0.95, foot: 0.26, dx: 0.35 },
    aibox: { pos: [-1.05, 0, -1.0], rot: [0, 0.18, 0], top: 0.2, foot: 0.4 },
    laptop: { pos: [0.25, 0, -0.35], rot: [0, -0.06, 0], top: 0.95, foot: 0.82 },
    phone: { pos: [1.6, 0, 0.1], rot: [0, 0.32, 0], top: 0.12, foot: 0.44, dx: -0.3 },
    camera: { pos: [1.95, 0, 0.75], rot: [0, -0.55, 0], top: 0.45, foot: 0.36, dx: -0.6 },
    pass: { pos: [-0.35, 0, 0.9], rot: [0, 0.22, 0], top: 0.1, foot: 0.44 },
    resume: { pos: [-1.6, 0, 0.75], rot: [0, -0.14, 0], top: 0.1, foot: 0.52, dx: 0.4 },
    ball: { pos: [0.7, 0, 1.15], top: 0.28, foot: 0.16 },
    paddle: { pos: [1.35, 0, 1.2], rot: [0, 1.15, 0], top: 0.08, foot: 0.4, dx: -0.3 },
    drone: { pos: [-2.35, 0, -1.4], rot: [0, 0.5, 0], top: 0.12, foot: 0.34, dx: 0.5 },
  },
  decor: { mug: [1.2, 0, -0.95], pencil: [-0.95, 0, 0.35], plant: [2.45, 0, -1.05] },
  rig: {
    hero: { pos: [-2.95, 1.0, 1.85], look: [-2.35, 0.62, -0.5] },
    desk: { pos: [0.1, 4.4, 4.3], look: [0, 0.05, -0.15] },
    fov: 30,
  },
};

const PORTRAIT: Layout = {
  desk: [2.8, 3.4],
  items: {
    cctv: { pos: [-0.85, 0, -0.45], top: 0.95, foot: 0.26, dx: 0.75 },
    aibox: { pos: [-0.75, 0, -1.2], rot: [0, 0.2, 0], top: 0.2, foot: 0.4, dx: 0.6 },
    laptop: { pos: [0.25, 0, -0.75], rot: [0, 0, 0], top: 0.95, foot: 0.8 },
    phone: { pos: [0.95, 0, 0.3], rot: [0, 0.2, 0], top: 0.12, foot: 0.44, dx: -0.95 },
    camera: { pos: [0.45, 0, 0.92], rot: [0, -0.5, 0], top: 0.45, foot: 0.36, dx: -0.6 },
    pass: { pos: [-0.05, 0, 0.35], rot: [0, 0.15, 0], top: 0.1, foot: 0.44 },
    resume: { pos: [-0.85, 0, 0.55], rot: [0, -0.1, 0], top: 0.1, foot: 0.5, dx: 0.7 },
    ball: { pos: [-0.05, 0, 1.25], top: 0.28, foot: 0.16 },
    paddle: { pos: [0.9, 0, 1.12], rot: [0, -0.7, 0], top: 0.08, foot: 0.4, dx: -0.95 },
    drone: { pos: [-0.85, 0, 1.35], rot: [0, 0.4, 0], top: 0.12, foot: 0.34, dx: 0.8 },
  },
  decor: { mug: [1.0, 0, -0.9], pencil: [-0.4, 0, 0.9], plant: [1.05, 0, -1.4] },
  rig: {
    hero: { pos: [-2.35, 1.15, 2.75], look: [-0.9, 1.45, -0.45] },
    desk: { pos: [0.0, 6.0, 4.3], look: [0, 0.05, -0.05], },
    fov: 42,
  },
};

function usePortrait() {
  const { size } = useThree();
  return size.width < size.height * 1.05;
}

function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ---------------------------------------------------------------------------
   Camera rig
   --------------------------------------------------------------------------- */
function Rig({ progress, reduce, layout }: { progress: StudioProgress; reduce: boolean; layout: Layout }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const la = useMemo(() => new THREE.Vector3(), []);
  const lb = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const r = layout.rig;
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
    // no invalidate() here — the pose is a pure function of scroll progress,
    // and DemandFrames already asks for a frame whenever that changes
  });
  return null;
}

/* ---------------------------------------------------------------------------
   An object on the desk: hover lifts it, draws an accent ring beneath it and
   shows a caption; click navigates.
   --------------------------------------------------------------------------- */
function Item({
  id,
  slot,
  accent,
  hovered,
  setHovered,
  onSelect,
  children,
  visibleCaptions,
}: {
  id: StudioObjectKey;
  slot: Slot;
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
  const L = slot;
  const invalidate = useThree((s) => s.invalidate);

  useFrame((_, dt) => {
    if (!lift.current) return;
    const ty = hover ? 0.07 : 0;
    const k = 1 - Math.pow(0.0005, dt);
    lift.current.position.y += (ty - lift.current.position.y) * k;
    if (Math.abs(ty - lift.current.position.y) > 1e-4) invalidate(); // still rising
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
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={hover}>
        <ringGeometry args={[L.foot, L.foot + 0.018, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={lift} onPointerOver={over} onPointerOut={out} onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
        <ItemCtx.Provider value={{ hover, accent }}>{children}</ItemCtx.Provider>
        {/* invisible catch volume so thin objects are easy to hover */}
        <mesh position={[0, L.top / 2, 0]} visible={false}>
          <boxGeometry args={[Math.max(0.6, L.foot * 1.6), Math.max(L.top, 0.25), Math.max(0.5, L.foot * 1.4)]} />
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
          className="studio-cap"
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
/** an oak desk on a slim steel frame, plus the things that just live on it */
function Desk({ layout }: { layout: Layout }) {
  const wood = useWoodTexture();
  const [w, d] = layout.desk;
  const lx = w / 2 - 0.2;
  const lz = d / 2 - 0.25;
  return (
    <ItemCtx.Provider value={{ hover: false, accent: "#000" }}>
      <group>
        {/* plain box, not rounded: the rounded geometry maps the grain in
            world units and clamps past the first metre — half a desk of wood */}
        <Box args={[w, 0.09, d]} radius={0} position={[0, -0.045, 0]} map={wood} color="#f1e6d6" roughness={0.55} clearcoat={0.08} />
        {[-lx, lx].map((x) =>
          [-lz, lz].map((z) => <Cyl key={`${x}${z}`} r={0.03} h={1.7} position={[x, -0.94, z]} color="#2a2c30" roughness={0.45} metalness={0.7} segments={16} />),
        )}
        <Box args={[w - 0.3, 0.05, 0.05]} radius={0.01} position={[0, -0.115, lz]} color="#2a2c30" roughness={0.45} metalness={0.7} shadow={false} />
        <Box args={[w - 0.3, 0.05, 0.05]} radius={0.01} position={[0, -0.115, -lz]} color="#2a2c30" roughness={0.45} metalness={0.7} shadow={false} />
        <ContactShadows position={[0, 0.004, 0]} opacity={0.35} scale={Math.max(w, d) * 1.2} blur={2} far={1.2} resolution={512} frames={1} color="#3a2a18" />

        <group position={layout.decor.mug}><Mug /></group>
        <group position={layout.decor.pencil}><Pencil /></group>
        <group position={layout.decor.plant}><Plant /></group>
      </group>
    </ItemCtx.Provider>
  );
}

/** studio lighting: a warm key from the window side, a cool fill, and a soft
 *  overhead panel — the environment gives the metal and glass something to reflect */
function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);
  // the desk never moves — bake the shadow map once instead of re-rendering
  // the whole depth pass on every frame
  useEffect(() => {
    const l = key.current;
    if (!l) return;
    l.shadow.needsUpdate = true;
    const t = setTimeout(() => {
      l.shadow.autoUpdate = false;
    }, 250);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#ffffff", "#b9a58a", 0.5]} />
      <directionalLight
        ref={key}
        position={[3.5, 6.5, 4]}
        intensity={2.3}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
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

/** where the camera's cable should end: the box's port, in the camera's space */
function cableTarget(layout: Layout): V3 {
  const box = layout.items.aibox;
  const cam = layout.items.cctv;
  const ry = box.rot?.[1] ?? 0;
  const [px, py, pz] = AIBOX_PORT;
  const wx = box.pos[0] + px * Math.cos(ry) + pz * Math.sin(ry);
  const wz = box.pos[2] - px * Math.sin(ry) + pz * Math.cos(ry);
  return [wx - cam.pos[0], py, wz - cam.pos[2]];
}

/* ---------------------------------------------------------------------------
   Scene
   --------------------------------------------------------------------------- */
function Contents({
  progress,
  accent,
  reduce,
  hovered,
  setHovered,
  onSelect,
  captions,
}: {
  progress: StudioProgress;
  accent: string;
  reduce: boolean;
  hovered: StudioObjectKey | null;
  setHovered: (k: StudioObjectKey | null) => void;
  onSelect: (k: StudioObjectKey) => void;
  captions: boolean;
}) {
  const portrait = usePortrait();
  const layout = portrait ? PORTRAIT : LANDSCAPE;
  const cable = useMemo(() => cableTarget(layout), [layout]);
  const common = { accent, hovered, setHovered, onSelect, visibleCaptions: captions };
  const I = layout.items;

  return (
    <>
      <Lights />
      <Rig progress={progress} reduce={reduce} layout={layout} />
      <Desk layout={layout} />

      <Item id="cctv" slot={I.cctv} {...common}><CctvCamera track={!reduce} accent={accent} cableTo={cable} /></Item>
      <Item id="aibox" slot={I.aibox} {...common}><AiBox accent={accent} /></Item>
      <Item id="laptop" slot={I.laptop} {...common}><Laptop /></Item>
      <Item id="phone" slot={I.phone} {...common}><Phone /></Item>
      <Item id="camera" slot={I.camera} {...common}><Camera35 /></Item>
      <Item id="pass" slot={I.pass} {...common}><BoardingPass /></Item>
      <Item id="resume" slot={I.resume} {...common}><ResumeSheet /></Item>
      <Item id="ball" slot={I.ball} {...common}><CricketBall /></Item>
      <Item id="paddle" slot={I.paddle} {...common}><Paddle /></Item>
      <Item id="drone" slot={I.drone} {...common}><Drone /></Item>
    </>
  );
}

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

  return (
    <Canvas
      frameloop={active ? "demand" : "never"}
      shadows="soft"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      camera={{ fov: 30, near: 0.1, far: 40, position: [-2.9, 0.75, 1.9] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
      onPointerMissed={() => setHovered(null)}
    >
      <Suspense fallback={null}>
        <DemandFrames watch={`${hovered}|${captions}|${accent}`} />
        <Contents progress={progress} accent={accent} reduce={reduce} hovered={hovered} setHovered={setHovered} onSelect={onSelect} captions={captions} />
      </Suspense>
    </Canvas>
  );
}
