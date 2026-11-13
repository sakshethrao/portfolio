"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useMood } from "@/lib/timeOfDay";
import { ItemCtx, Surface } from "@/components/studio/objects/primitives";
import { plate } from "@/components/studio/objects/geo";
import { useOak } from "@/components/studio/materials";
import { Lighting } from "@/components/studio/lighting";
import { DemandFrames } from "@/components/studio/Frames";
import { CctvCamera } from "@/components/studio/objects/CctvCamera";
import { AiBox } from "@/components/studio/objects/Things";

/**
 * The camera and the box, alone on a corner of the desk — for the
 * QuantumSight page. Same objects and the same light as the studio; the
 * camera still follows. This page stays white, so after dark it borrows the
 * golden-hour light rather than going black.
 */
export default function CameraScene({ accent }: { accent: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const tod = useMood();
  const mood = tod === "night" ? "golden" : tod;
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} style={{ position: "relative", width: "100%", aspectRatio: "5 / 4", maxHeight: 520 }} aria-hidden>
      <Canvas
        frameloop={active ? "demand" : "never"}
        shadows
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
        camera={{ fov: 28, near: 0.1, far: 30, position: [-1.9, 1.05, 2.3] }}
        onCreated={({ camera }) => camera.lookAt(-0.15, 0.42, 0)}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <DemandFrames watch={mood} />
          <Lighting mood={mood} area={2.4} />
          <Slab />
          <ItemCtx.Provider value={{ hover: false, accent }}>
            <group position={[-0.45, 0, 0]}>
              {/* cable ends at the box's port: box at (0.55, 0, 0.15) rotated 0.3 */}
              <CctvCamera track={!reduce} accent={accent} cableTo={[0.55 + 0.205 * Math.sin(0.3) + 0.45, 0.07, 0.15 + 0.205 * Math.cos(0.3)]} />
            </group>
            <group position={[0.55, 0, 0.15]} rotation={[0, 0.3, 0]}>
              <AiBox accent={accent} />
            </group>
          </ItemCtx.Provider>
          <ContactShadows position={[0, 0.003, 0]} opacity={0.5} scale={4} blur={1.8} far={1} resolution={512} frames={1} color="#2a1c10" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Slab() {
  const oak = useOak(0.45);
  const g = useMemo(() => plate(2.6, 1.8, 0.11, 0.045, 0.014, 8), []);
  return (
    <mesh geometry={g} position={[0.05, -0.11, 0]} castShadow receiveShadow>
      <Surface {...oak} color="#f4e8d8" roughness={1} normalScale={0.9} clearcoat={0.22} clearcoatRoughness={0.42} />
    </mesh>
  );
}
