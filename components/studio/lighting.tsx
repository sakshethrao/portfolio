"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import type { Mood } from "@/lib/timeOfDay";

type V3 = [number, number, number];

/**
 * One table drives the whole look. The desk is lit the way a real room is:
 * a sun (or at night, the desk lamp) that casts the shadows, a cool sky fill
 * from the other side, and the room itself, a photographed interior
 * (Poly Haven "photo_studio_loft_hall", CC0), for ambient light and the
 * reflections in glass and metal.
 */
export type MoodSpec = {
  label: string;
  sun: { pos: V3; color: string; power: number; soft: number };
  sky: { pos: V3; color: string; power: number };
  /** how much of the room's own light reaches the desk */
  room: number;
  /** desk lamp, 0 = off */
  lamp: number;
  /** how hard the screens glow */
  glow: number;
  exposure: number;
};

export const LIGHT: Record<Mood, MoodSpec> = {
  morning: {
    label: "MORNING",
    sun: { pos: [5.6, 3.3, 1.6], color: "#ffdfc0", power: 3.3, soft: 5 },
    sky: { pos: [-4, 3, -2], color: "#cfe0ff", power: 0.45 },
    room: 0.62,
    lamp: 0,
    glow: 0.75,
    exposure: 0.98,
  },
  day: {
    label: "DAY",
    sun: { pos: [4.2, 5.4, 2.6], color: "#fff6ea", power: 3.3, soft: 3.5 },
    sky: { pos: [-4, 3, -2], color: "#dfe8ff", power: 0.4 },
    room: 0.7,
    lamp: 0,
    glow: 0.75,
    exposure: 0.94,
  },
  golden: {
    label: "GOLDEN HOUR",
    sun: { pos: [5.2, 2.3, -3.2], color: "#ffa55c", power: 3.8, soft: 6 },
    sky: { pos: [-4, 4, 3], color: "#b8c6f2", power: 0.5 },
    room: 0.5,
    lamp: 0.3,
    glow: 0.85,
    exposure: 1.05,
  },
  night: {
    label: "NIGHT",
    sun: { pos: [-4, 5, -4.5], color: "#9db2ff", power: 0.85, soft: 6 },
    sky: { pos: [3, 4, 4], color: "#8fa0dc", power: 0.22 },
    room: 0.2,
    lamp: 1,
    glow: 1.15,
    exposure: 1.18,
  },
};

/* the room: the photographed interior plus two bright panels (a window with
   mullions and a ceiling bounce) so glass and metal pick up crisp highlights */
function Room({ level }: { level: number }) {
  const hdr = useLoader(HDRLoader, "/studio/room.hdr");
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const room = new THREE.Scene();
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    room.background = hdr;
    const panel = (w: number, h: number, pos: V3, color: string, power: number) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide, toneMapped: false }),
      );
      m.position.set(...pos);
      m.lookAt(0, 0.5, 0);
      room.add(m);
    };
    for (const z of [-2.4, -0.8, 0.8, 2.4]) panel(1.25, 4.2, [8, 3.2, z], "#fff3e2", 7);
    panel(9, 4, [0, 7, -1], "#ffffff", 1.1);
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(room, 0.015, 0.1, 100);
    pmrem.dispose();
    scene.environment = rt.texture;
    invalidate();
    return () => {
      scene.environment = null;
      rt.dispose();
      room.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (m.material as THREE.Material).dispose();
        }
      });
    };
  }, [hdr, gl, scene, invalidate]);

  useEffect(() => {
    scene.environmentIntensity = level;
    invalidate();
  }, [scene, level, invalidate]);

  return null;
}
Room.preload = () => useLoader.preload(HDRLoader, "/studio/room.hdr");

export function Lighting({
  mood,
  area = 4.6,
  lamp,
}: {
  mood: Mood;
  /** half-width of the square the sun's shadow has to cover */
  area?: number;
  /** the desk lamp's bulb and where it points, if the scene has one */
  lamp?: { at: V3; to: V3 };
}) {
  const L = LIGHT[mood];
  const sun = useRef<THREE.DirectionalLight>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const target = useMemo(() => new THREE.Object3D(), []);
  const sunPos = useMemo(() => new THREE.Vector3(...L.sun.pos).normalize().multiplyScalar(14).toArray() as V3, [L]);

  useEffect(() => {
    gl.toneMappingExposure = L.exposure;
  }, [gl, L]);

  // nothing on the desk moves on its own, so the shadow maps are drawn once
  // per mood rather than every frame
  useEffect(() => {
    const bake = () => {
      for (const l of [sun.current, spot.current]) {
        if (!l) continue;
        l.shadow.autoUpdate = false;
        l.shadow.needsUpdate = true;
      }
      invalidate();
    };
    bake();
    const t = setTimeout(bake, 400);
    return () => clearTimeout(t);
  }, [mood, area, lamp, invalidate]);

  useEffect(() => {
    if (lamp) target.position.set(...lamp.to);
    target.updateMatrixWorld();
  }, [lamp, target]);

  return (
    <>
      <Room level={L.room} />
      <directionalLight
        ref={sun}
        position={sunPos}
        intensity={L.sun.power}
        color={L.sun.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={L.sun.soft}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-camera-left={-area}
        shadow-camera-right={area}
        shadow-camera-top={area}
        shadow-camera-bottom={-area}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <directionalLight position={L.sky.pos} intensity={L.sky.power} color={L.sky.color} />
      {lamp && (
        <>
          <primitive object={target} />
          <spotLight
            ref={spot}
            position={lamp.at}
            target={target}
            intensity={L.lamp * 20}
            color="#ffc98a"
            angle={1.22}
            penumbra={0.85}
            decay={1.6}
            distance={11}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-radius={7}
            shadow-bias={-0.0006}
            shadow-normalBias={0.03}
            shadow-camera-near={0.15}
            shadow-camera-far={9}
          />
        </>
      )}
    </>
  );
}
Lighting.preload = () => Room.preload();
