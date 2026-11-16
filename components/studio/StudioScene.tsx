"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, advance, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { studioObjects, type StudioObjectKey } from "@/content/studio";
import { useMood, setMood, type Mood } from "@/lib/timeOfDay";
import { subscribeScroll } from "@/lib/scroll";
import { ItemCtx } from "./objects/primitives";
import { Lighting, LIGHT } from "./lighting";
import { useOak } from "./materials";
import { DeskTop, Mat, Lamp, lampLight } from "./objects/Desk";
import { Laptop } from "./objects/Laptop";
import { DemandFrames } from "./Frames";
import { CctvCamera } from "./objects/CctvCamera";
import { AiBox, AIBOX_PORT, Phone, Camera35, BoardingPass, ResumeSheet, CricketBall, Paddle, Drone } from "./objects/Things";
import { Mug, Pencil, Plant, Headphones, Can } from "./objects/Decor";

export type StudioProgress = { current: number };

type V3 = [number, number, number];
type Slot = { pos: V3; rot?: V3; top: number; foot: number; dx?: number };
type Layout = {
  desk: [number, number]; // width × depth
  items: Record<StudioObjectKey, Slot>;
  decor: { mug: V3; pencil: V3; plant: V3; mat: { pos: V3; size: [number, number] }; lamp: { pos: V3; ry: number; aim?: V3 }; can: V3; headphones?: { pos: V3; ry: number } };
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
    laptop: { pos: [0.25, 0.014, -0.35], rot: [0, -0.06, 0], top: 0.95, foot: 0.82 },
    phone: { pos: [1.6, 0.014, 0.1], rot: [0, 0.32, 0], top: 0.12, foot: 0.44, dx: -0.3 },
    camera: { pos: [1.95, 0, 0.75], rot: [0, -0.55, 0], top: 0.45, foot: 0.36, dx: -0.6 },
    pass: { pos: [-0.35, 0, 0.9], rot: [0, 0.22, 0], top: 0.1, foot: 0.44 },
    resume: { pos: [-1.6, 0, 0.75], rot: [0, -0.14, 0], top: 0.1, foot: 0.52, dx: 0.4 },
    ball: { pos: [0.7, 0, 1.15], top: 0.28, foot: 0.16 },
    paddle: { pos: [1.35, 0, 1.2], rot: [0, 1.15, 0], top: 0.08, foot: 0.4, dx: -0.3 },
    drone: { pos: [-2.35, 0, -1.4], rot: [0, 0.5, 0], top: 0.12, foot: 0.34, dx: 0.5 },
  },
  decor: {
    mug: [-0.8, 0, -0.2],
    can: [2.55, 0, -0.62],
    headphones: { pos: [2.6, 0, 0.12], ry: 0.5 },
    pencil: [-0.95, 0, 0.35],
    plant: [2.5, 0, -1.2],
    mat: { pos: [0.85, 0, -0.2], size: [2.7, 1.5] },
    lamp: { pos: [1.2, 0, -1.3], ry: -Math.PI / 2, aim: [0.55, 0, -0.15] },
  },
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
    laptop: { pos: [0.25, 0.014, -0.75], rot: [0, 0, 0], top: 0.95, foot: 0.8 },
    phone: { pos: [0.95, 0, 0.3], rot: [0, 0.2, 0], top: 0.12, foot: 0.44, dx: -0.95 },
    camera: { pos: [0.45, 0, 0.92], rot: [0, -0.5, 0], top: 0.45, foot: 0.36, dx: -0.6 },
    pass: { pos: [-0.05, 0, 0.35], rot: [0, 0.15, 0], top: 0.1, foot: 0.44 },
    resume: { pos: [-0.85, 0, 0.55], rot: [0, -0.1, 0], top: 0.1, foot: 0.5, dx: 0.7 },
    ball: { pos: [-0.05, 0, 1.25], top: 0.28, foot: 0.16 },
    paddle: { pos: [0.9, 0, 1.12], rot: [0, -0.7, 0], top: 0.08, foot: 0.4, dx: -0.95 },
    drone: { pos: [-0.85, 0, 1.35], rot: [0, 0.4, 0], top: 0.12, foot: 0.34, dx: 0.8 },
  },
  decor: {
    mug: [-1.1, 0, -0.02],
    can: [1.2, 0, -0.33],
    pencil: [-0.4, 0, 0.9],
    plant: [1.08, 0, -1.4],
    mat: { pos: [0.22, 0, -0.72], size: [1.62, 1.2] },
    lamp: { pos: [1.18, 0, -0.85], ry: -Math.PI / 2, aim: [0.45, 0, -0.25] },
  },
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
   The desk and the things that just live on it
   --------------------------------------------------------------------------- */
function deskParts(layout: Layout, mood: Mood): React.ReactNode[] {
  const [w, d] = layout.desk;
  const D = layout.decor;
  // the can's label turns to face whoever is looking at the desk
  const canRy = Math.atan2(-(layout.rig.desk.pos[2] - D.can[2]), layout.rig.desk.pos[0] - D.can[0]);
  const parts: React.ReactNode[] = [
    <DeskTop key="top" w={w} d={d} />,
    <Mat key="mat" size={D.mat.size} position={D.mat.pos} />,
    <group key="lamp" position={D.lamp.pos} rotation={[0, D.lamp.ry, 0]}><Lamp on={LIGHT[mood].lamp} /></group>,
    <group key="mug" position={D.mug}><Mug /></group>,
    <group key="pencil" position={D.pencil}><Pencil /></group>,
    <group key="plant" position={D.plant}><Plant /></group>,
    <group key="can" position={D.can} rotation={[0, canRy, 0]}><Can /></group>,
  ];
  if (D.headphones) parts.push(<group key="headphones" position={D.headphones.pos} rotation={[0, D.headphones.ry, 0]}><Headphones /></group>);
  return parts;
}

/* ---------------------------------------------------------------------------
   Building the whole desk in one go froze the page for a couple of seconds.
   So it goes up a piece at a time, handing the browser back between pieces;
   nothing is drawn until the last one is in.
   --------------------------------------------------------------------------- */
function useStages(total: number) {
  const [n, setN] = useState(() => (typeof document !== "undefined" && document.hidden ? total : 1));
  useEffect(() => {
    performance.mark("studio:stage:" + n);
    if (n >= total) return;
    // a hidden tab throttles timers hard, and nobody is watching it anyway
    if (document.hidden) return setN(total);
    const t = setTimeout(() => setN((v) => Math.min(total, v + 1)), 0);
    return () => clearTimeout(t);
  }, [n, total]);
  return Math.min(n, total);
}

/* ---------------------------------------------------------------------------
   Start-up: compile every shader off the main thread first, then let the
   first frame through and tell the page the desk is live.
   --------------------------------------------------------------------------- */
function Ready({ onCompiled, onFirstFrame, onReady }: { onCompiled: () => void; onFirstFrame: () => void; onReady: () => void }) {
  const { gl, scene, camera, invalidate } = useThree();
  const frameloop = useThree((s) => s.frameloop);
  const armed = useRef(false);
  const done = useRef(false);
  const frames = useRef(0);

  useEffect(() => {
    let alive = true;
    let t: ReturnType<typeof setTimeout> | undefined;
    const fire = () => {
      if (!alive || done.current) return;
      done.current = true;
      performance.mark("studio:live");
      onReady();
    };
    performance.mark("studio:mounted");
    // the first frames are the last heavy step (shadow maps, texture uploads),
    // so they wait for a pause in scrolling rather than landing in the middle of one
    let lastScroll = 0;
    const unsub = subscribeScroll(() => {
      lastScroll = performance.now();
    });
    const started = performance.now();
    const go = () => {
      if (!alive) return;
      const now = performance.now();
      if (now - lastScroll < 300 && now - started < 6000) {
        t = setTimeout(go, 120);
        return;
      }
      performance.mark("studio:compiled");
      armed.current = true;
      onCompiled();
      t = setTimeout(fire, 2500); // a hidden tab never gets a frame; don't wait on one
    };
    // send the textures to the GPU one per tick first, so the first frame
    // doesn't have to decode and upload all of them in one go
    const textures = new Set<THREE.Texture>();
    scene.traverse((o) => {
      const mat = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      for (const m of Array.isArray(mat) ? mat : mat ? [mat] : []) {
        const sm = m as THREE.MeshStandardMaterial;
        for (const tx of [sm.map, sm.normalMap, sm.roughnessMap, sm.emissiveMap]) if (tx && tx.image) textures.add(tx);
      }
    });
    const queue = [...textures];
    const upload = () => {
      if (!alive) return;
      const tx = queue.pop();
      if (!tx || document.hidden) {
        gl.compileAsync(scene, camera).then(go, go);
        return;
      }
      try {
        gl.initTexture(tx);
      } catch {
        // the first frame will upload it instead
      }
      t = setTimeout(upload, 0);
    };
    upload();
    return () => {
      alive = false;
      unsub();
      if (t) clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ask for the first frame once the loop has actually been switched on
  useEffect(() => {
    if (frameloop !== "never" && armed.current) invalidate();
  }, [frameloop, invalidate]);

  useFrame(() => {
    if (!armed.current || done.current) return;
    const n = ++frames.current;
    if (n === 1) onFirstFrame(); // the desk is drawn; now the contact shadows, in a frame of their own
    if (n >= 4) {
      done.current = true;
      performance.mark("studio:live");
      onReady();
    } else invalidate();
  });
  return null;
}

/* ---------------------------------------------------------------------------
   Dev only (?shot=1): render the scene at a set size and mood and hand the
   frame to scripts/shot.mjs. This is how the hero posters are made.
   --------------------------------------------------------------------------- */
type ShotOpts = { name: string; w?: number; h?: number; p?: number; mood?: Mood; bg?: string; frames?: number; poster?: boolean };
function ShotHook({ progress }: { progress: StudioProgress }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !new URLSearchParams(location.search).has("shot")) return;
    const w = window as unknown as { __shot?: (o: ShotOpts) => Promise<unknown>; __glInfo?: () => unknown };
    w.__glInfo = () => {
      const { gl } = get();
      return { calls: gl.info.render.calls, triangles: gl.info.render.triangles, programs: gl.info.programs?.length, textures: gl.info.memory.textures, geometries: gl.info.memory.geometries };
    };
    w.__shot = async ({ name, w: W = 1600, h: H = 800, p = 0, mood, bg, frames = 8, poster }) => {
      if (mood) setMood(mood);
      for (let i = 0; i < frames; i++) {
        await new Promise((r) => setTimeout(r, 70));
        // the canvas keeps snapping back to its container, so insist
        const s = get();
        if (s.size.width !== W || s.size.height !== H || s.viewport.dpr !== 1) {
          s.setDpr(1);
          s.setSize(W, H);
        }
        progress.current = p;
        advance(performance.now());
      }
      progress.current = p;
      advance(performance.now());
      const blob = await new Promise<Blob | null>((r) => get().gl.domElement.toBlob(r, "image/png"));
      if (!blob) return { ok: false, why: "no frame" };
      const res = await fetch(`http://localhost:4599/save?name=${encodeURIComponent(name)}${bg ? `&bg=${encodeURIComponent(bg)}` : ""}${poster ? "&poster=1" : ""}`, { method: "POST", body: blob });
      return res.json();
    };
    return () => {
      delete w.__shot;
      delete w.__glInfo;
    };
  }, [get, progress]);
  return null;
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
  mood,
  onCompiled,
  onReady,
}: {
  progress: StudioProgress;
  accent: string;
  reduce: boolean;
  hovered: StudioObjectKey | null;
  setHovered: (k: StudioObjectKey | null) => void;
  onSelect: (k: StudioObjectKey) => void;
  captions: boolean;
  mood: Mood;
  onCompiled: () => void;
  onReady: () => void;
}) {
  const portrait = usePortrait();
  const layout = portrait ? PORTRAIT : LANDSCAPE;
  const cable = useMemo(() => cableTarget(layout), [layout]);
  const lamp = useMemo(() => {
    const l = lampLight(layout.decor.lamp.pos, layout.decor.lamp.ry);
    return layout.decor.lamp.aim ? { at: l.at, to: layout.decor.lamp.aim } : l;
  }, [layout]);
  const common = { accent, hovered, setHovered, onSelect, visibleCaptions: captions };
  const I = layout.items;
  const L = LIGHT[mood];

  const desk = deskParts(layout, mood);
  const items: React.ReactNode[] = [
    <Item key="cctv" id="cctv" slot={I.cctv} {...common}><CctvCamera track={!reduce} accent={accent} cableTo={cable} ir={mood === "night" ? 2.2 : 0.06} /></Item>,
    <Item key="aibox" id="aibox" slot={I.aibox} {...common}><AiBox accent={accent} /></Item>,
    <Item key="laptop" id="laptop" slot={I.laptop} {...common}><Laptop glow={L.glow} /></Item>,
    <Item key="phone" id="phone" slot={I.phone} {...common}><Phone glow={L.glow} /></Item>,
    <Item key="camera" id="camera" slot={I.camera} {...common}><Camera35 /></Item>,
    <Item key="pass" id="pass" slot={I.pass} {...common}><BoardingPass /></Item>,
    <Item key="resume" id="resume" slot={I.resume} {...common}><ResumeSheet /></Item>,
    <Item key="ball" id="ball" slot={I.ball} {...common}><CricketBall /></Item>,
    <Item key="paddle" id="paddle" slot={I.paddle} {...common}><Paddle /></Item>,
    <Item key="drone" id="drone" slot={I.drone} {...common}><Drone /></Item>,
  ];
  const total = 1 + desk.length + items.length;
  const stage = useStages(total);
  const [grounded, setGrounded] = useState(false);
  const [w, d] = layout.desk;

  return (
    <>
      <Lighting mood={mood} area={Math.max(...layout.desk) * 0.78} lamp={lamp} />
      <Rig progress={progress} reduce={reduce} layout={layout} />
      <ItemCtx.Provider value={{ hover: false, accent: "#000" }}>{desk.slice(0, stage - 1)}</ItemCtx.Provider>
      {items.slice(0, Math.max(0, stage - 1 - desk.length))}
      {grounded && <ContactShadows position={[0, 0.016, 0]} opacity={0.6} scale={Math.max(w, d) * 1.2} blur={1.6} far={0.9} resolution={1024} frames={1} color="#2a1c10" />}
      {stage >= total && <Ready onCompiled={onCompiled} onFirstFrame={() => setGrounded(true)} onReady={onReady} />}
    </>
  );
}

// start fetching the oak and the room as soon as this chunk runs
if (typeof window !== "undefined") {
  useOak.preload();
  Lighting.preload();
}

export default function StudioScene({
  progress,
  accent,
  reduce,
  active,
  onSelect,
  onHover,
  onReady,
}: {
  progress: StudioProgress;
  accent: string;
  reduce: boolean;
  /** false = stage is off-screen; the render loop stops */
  active: boolean;
  onSelect: (key: StudioObjectKey) => void;
  onHover: (key: StudioObjectKey | null) => void;
  /** the first live frame is on screen */
  onReady: () => void;
}) {
  const mood = useMood();
  const [compiled, setCompiled] = useState(false);
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
      // nothing is drawn until the shaders are compiled, so start-up never
      // blocks the page on a synchronous compile
      frameloop={compiled && active ? "demand" : "never"}
      shadows
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      camera={{ fov: 30, near: 0.1, far: 40, position: [-2.9, 0.75, 1.9] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
      onPointerMissed={() => setHovered(null)}
    >
      <Suspense fallback={null}>
        <DemandFrames watch={`${hovered}|${captions}|${accent}|${mood}`} />
        <Contents progress={progress} accent={accent} reduce={reduce} hovered={hovered} setHovered={setHovered} onSelect={onSelect} captions={captions} mood={mood} onCompiled={() => setCompiled(true)} onReady={onReady} />
        <ShotHook progress={progress} />
      </Suspense>
    </Canvas>
  );
}
