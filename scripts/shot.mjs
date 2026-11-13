// Receives frames captured from the live desk scene and writes them to disk.
//   node scripts/shot.mjs <output-folder>
// The scene (dev only, ?shot=1) POSTs a PNG to http://localhost:4599/save?name=<name>.
// A plain save keeps a downsized JPEG in <output-folder> for looking at; adding
// &poster=1 writes the WebP poster the site ships instead
// (public/studio/poster-<mood>-<land|port>.webp).
import http from "node:http";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const dir = path.resolve(process.argv[2] ?? ".");
const posterDir = path.resolve("public/studio");
await mkdir(dir, { recursive: true });

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    if (req.method === "OPTIONS") return res.end();
    const url = new URL(req.url, "http://x");
    if (req.method !== "POST" || url.pathname !== "/save") return res.writeHead(404).end();
    const name = (url.searchParams.get("name") ?? "shot").replace(/[^a-z0-9-_]/gi, "");
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const png = Buffer.concat(chunks);
    try {
      const img = sharp(png);
      const meta = await img.metadata();
      const posters = url.searchParams.has("poster");
      const file = path.join(posters ? posterDir : dir, name + (posters ? ".webp" : ".jpg"));
      if (posters) await img.webp({ quality: 80, alphaQuality: 80, effort: 6 }).toFile(file);
      else await img.flatten({ background: url.searchParams.get("bg") ?? "#ffffff" }).resize({ width: 1500, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(file);
      console.log("saved", file, meta.width + "x" + meta.height);
      res.end(JSON.stringify({ ok: true, file, w: meta.width, h: meta.height }));
    } catch (e) {
      res.writeHead(500).end(String(e));
    }
  })
  .listen(4599, () => console.log("shot receiver on :4599 →", dir));
