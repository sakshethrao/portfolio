"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { ItemCtx } from "@/components/studio/objects/primitives";
import { CctvCamera } from "@/components/studio/objects/CctvCamera";
import { AiBox } from "@/components/studio/objects/Things";

/**
 * The camera and the box, alone — for the QuantumSight page. Same objects as
 * the studio desk; the camera still follows the visitor.
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
        flat
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ fov: 28, near: 0.1, far: 30, position: [-1.9, 1.05, 2.3] }}
        onCreated={({ camera }) => camera.lookAt(-0.15, 0.42, 0)}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={1.15} />
        <hemisphereLight args={["#ffffff", "#d8d6d0", 0.55]} />
        <directionalLight position={[3, 7, 4]} intensity={1.05} />
        <ItemCtx.Provider value={{ hover: false, accent }}>
          <group position={[-0.45, 0, 0]}>
            <CctvCamera track={!reduce} accent={accent} />
          </group>
          <group position={[0.55, 0, 0.15]} rotation={[0, 0.3, 0]}>
            <AiBox accent={accent} />
          </group>
        </ItemCtx.Provider>
        <ContactShadows position={[0, 0.002, 0]} opacity={0.3} scale={4} blur={2.2} far={1.2} resolution={512} frames={1} color="#121212" />
      </Canvas>
    </div>
  );
}
