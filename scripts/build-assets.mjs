// Turns the downloaded Poly Haven originals into the small files the desk ships with.
//   node scripts/build-assets.mjs <folder-with-originals>
// Sources (CC0, polyhaven.com): white_oak_veneer 1k (diff, nor_gl, rough) and
// photo_studio_loft_hall 1k .hdr. Outputs land in public/studio/.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("usage: node scripts/build-assets.mjs <folder-with-originals>");
const out = path.resolve("public/studio");
await mkdir(out, { recursive: true });

/* ---- oak: three maps, re-encoded as WebP ---- */
const oak = (n) => path.join(src, `white_oak_veneer_${n}_1k.jpg`);
await sharp(oak("diff")).resize(1024, 1024).webp({ quality: 82 }).toFile(path.join(out, "oak-diff.webp"));
await sharp(oak("nor_gl")).resize(1024, 1024).webp({ quality: 90 }).toFile(path.join(out, "oak-nor.webp"));
await sharp(oak("rough")).resize(1024, 1024).greyscale().webp({ quality: 80 }).toFile(path.join(out, "oak-rough.webp"));

/* ---- room light: decode Radiance .hdr, shrink, clamp the sun, re-encode ---- */
function decodeHDR(buf) {
  let p = 0;
  const line = () => {
    let s = "";
    while (buf[p] !== 10) s += String.fromCharCode(buf[p++]);
    p++;
    return s;
  };
  if (!line().startsWith("#?")) throw new Error("not a Radiance file");
  while (line() !== "") {} // header ends at the blank line
  const m = line().match(/-Y (\d+) \+X (\d+)/);
  if (!m) throw new Error("unsupported orientation");
  const h = +m[1], w = +m[2];
  const data = new Float32Array(w * h * 3);
  const scan = new Uint8Array(w * 4);
  for (let y = 0; y < h; y++) {
    if (buf[p] === 2 && buf[p + 1] === 2 && ((buf[p + 2] << 8) | buf[p + 3]) === w) {
      p += 4;
      for (let c = 0; c < 4; c++) {
        let x = 0;
        while (x < w) {
          let n = buf[p++];
          if (n > 128) { n -= 128; const v = buf[p++]; while (n--) scan[x++ * 4 + c] = v; }
          else while (n--) scan[x++ * 4 + c] = buf[p++];
        }
      }
    } else {
      for (let i = 0; i < w * 4; i++) scan[i] = buf[p++];
    }
    for (let x = 0; x < w; x++) {
      const e = scan[x * 4 + 3];
      const f = e ? Math.pow(2, e - 136) : 0;
      const o = (y * w + x) * 3;
      data[o] = scan[x * 4] * f; data[o + 1] = scan[x * 4 + 1] * f; data[o + 2] = scan[x * 4 + 2] * f;
    }
  }
  return { w, h, data };
}

function shrink({ w, h, data }, W, H) {
  const o = new Float32Array(W * H * 3);
  const fx = w / W, fy = h / H;
  for (let Y = 0; Y < H; Y++) for (let X = 0; X < W; X++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = Math.floor(Y * fy); y < Math.floor((Y + 1) * fy); y++)
      for (let x = Math.floor(X * fx); x < Math.floor((X + 1) * fx); x++) {
        const i = (y * w + x) * 3; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    const i = (Y * W + X) * 3; o[i] = r / n; o[i + 1] = g / n; o[i + 2] = b / n;
  }
  return { w: W, h: H, data: o };
}

function encodeHDR({ w, h, data }) {
  const head = Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h} +X ${w}\n`, "ascii");
  const body = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const v = Math.max(r, g, b);
    if (v < 1e-32) continue;
    const e = Math.ceil(Math.log2(v) + 1e-9);
    const s = 256 / Math.pow(2, e);
    body[i * 4] = Math.min(255, r * s); body[i * 4 + 1] = Math.min(255, g * s); body[i * 4 + 2] = Math.min(255, b * s);
    body[i * 4 + 3] = e + 128;
  }
  return Buffer.concat([head, body]);
}

const full = decodeHDR(await readFile(path.join(src, "photo_studio_loft_hall_1k.hdr")));
const small = shrink(full, 384, 192);

// where is the light coming from? (report it, so the sun lamp can be lined up with the room)
let best = 0, bi = 0, sum = 0;
for (let i = 0; i < small.w * small.h; i++) {
  const l = 0.2126 * small.data[i * 3] + 0.7152 * small.data[i * 3 + 1] + 0.0722 * small.data[i * 3 + 2];
  sum += l;
  if (l > best) { best = l; bi = i; }
}
const bu = (bi % small.w) / small.w, bv = Math.floor(bi / small.w) / small.h;

// the sun itself is a separate lamp in the scene — clamp it here so it isn't
// counted twice and doesn't sparkle on rough surfaces
const CLAMP = 24;
for (let i = 0; i < small.data.length; i++) small.data[i] = Math.min(CLAMP, small.data[i]);

await writeFile(path.join(out, "room.hdr"), encodeHDR(small));
console.log(JSON.stringify({ src: [full.w, full.h], out: [small.w, small.h], brightest: { u: +bu.toFixed(3), v: +bv.toFixed(3), value: +best.toFixed(1) }, mean: +(sum / (small.w * small.h)).toFixed(3) }));
