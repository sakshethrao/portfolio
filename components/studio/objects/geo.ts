import * as THREE from "three";

/** a rectangle with rounded corners, centred on the origin */
export function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const k = Math.min(r, w / 2, h / 2);
  s.moveTo(x + k, y);
  s.lineTo(x + w - k, y);
  s.absarc(x + w - k, y + k, k, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - k);
  s.absarc(x + w - k, y + h - k, k, 0, Math.PI / 2, false);
  s.lineTo(x + k, y + h);
  s.absarc(x + k, y + h - k, k, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + k);
  s.absarc(x + k, y + k, k, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * A flat plate lying on the ground: w along x, d along z, bottom at y = 0 and
 * top at y = t, with rounded corners (r) and eased edges (bevel). The outline
 * is exactly w × d, and the top face carries world-unit UVs so tiling textures
 * can be scaled in real units.
 */
export function plate(w: number, d: number, t: number, r: number, bevel = Math.min(t * 0.25, 0.012), curve = 10) {
  const b = Math.min(bevel, t / 2 - 1e-4);
  const g = new THREE.ExtrudeGeometry(roundedRect(w, d, r), {
    depth: t - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments: 3,
    curveSegments: curve,
  });
  g.translate(0, 0, b);
  g.rotateX(-Math.PI / 2);
  return g;
}

/**
 * A turned part with its axis along +z. `profile` is a list of [radius, z]
 * points, ordered from the back (low z) to the front so the surface faces out.
 */
export function turned(profile: [number, number][], segments = 64) {
  const g = new THREE.LatheGeometry(profile.map(([r, z]) => new THREE.Vector2(Math.max(r, 1e-5), z)), segments);
  g.rotateX(Math.PI / 2);
  return g;
}

/** the same, standing upright: `profile` is [radius, y], bottom to top */
export function turnedUp(profile: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 1e-5), y)), segments);
}
