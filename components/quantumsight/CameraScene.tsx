"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { ItemCtx, Box, useWoodTexture } from "@/components/studio/objects/primitives";
import { CctvCamera } from "@/components/studio/objects/CctvCamera";
import { AiBox } from "@/components/studio/objects/Things";

/**
 * The camera and the box, alone on a corner of the desk — for the
 * QuantumSight page. Same objects as the studio; the camera still follows.
 */
export default function CameraScene({ accent }: { accent: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
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
        frameloop={active ? "always" : "never"}
        shadows="soft"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
        camera={{ fov: 28, near: 0.1, far: 30, position: [-1.9, 1.05, 2.3] }}
        onCreated={({ camera }) => camera.lookAt(-0.15, 0.42, 0)}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#ffffff", "#b9a58a", 0.5]} />
        <directionalLight position={[3, 6, 4]} intensity={2.3} color="#fff4e6" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={2} shadow-camera-bottom={-2} />
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#dfe8ff" />
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -1]} scale={[10, 5, 1]} />
          <Lightformer intensity={1.2} rotation-y={Math.PI / 2} position={[-6, 2, 1]} scale={[3, 5, 1]} color="#ffe9d6" />
          <Lightformer intensity={1.6} rotation-y={-Math.PI / 2} position={[6, 3, 0]} scale={[4, 4, 1]} color="#dbe8ff" />
        </Environment>
        <Slab />
        <ItemCtx.Provider value={{ hover: false, accent }}>
          <group position={[-0.45, 0, 0]}>
            <CctvCamera track={!reduce} accent={accent} />
          </group>
          <group position={[0.55, 0, 0.15]} rotation={[0, 0.3, 0]}>
            <AiBox accent={accent} />
          </group>
        </ItemCtx.Provider>
        <ContactShadows position={[0, 0.003, 0]} opacity={0.35} scale={4} blur={2} far={1.2} resolution={512} frames={1} color="#3a2a18" />
      </Canvas>
    </div>
  );
}

function Slab() {
  const wood = useWoodTexture();
  return (
    <ItemCtx.Provider value={{ hover: false, accent: "#000" }}>
      <Box args={[2.6, 0.09, 1.8]} radius={0.02} position={[0.05, -0.045, 0]} map={wood} color="#f1e6d6" roughness={0.55} clearcoat={0.08} />
    </ItemCtx.Provider>
  );
}
