// Generates elegant gradient placeholder images for the seed photos.
// These stand in for real photographs — replace the files in
// public/photos/ with the photographer's actual JPEGs and update
// `imageUrl` in prisma/seed.ts accordingly. See README.md.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PHOTOS } from "../src/lib/seed-data.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "photos");
mkdirSync(outDir, { recursive: true });

/** Duotone gradient stops per category, evoking each mood without stock photos. */
const PALETTES = {
  retratos: ["#7a4f36", "#e7b483"],
  paisaje: ["#215773", "#82cdd8"],
  urbano: ["#4f4a3e", "#f7c869"],
  arquitectura: ["#5d5344", "#efe5cd"],
  naturaleza: ["#375c40", "#8bc178"],
  "blanco-y-negro": ["#4a4a4a", "#c9c9c9"],
};

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

function svgFor(photo) {
  const base = 340;
  const w = photo.width * base;
  const h = photo.height * base;
  const [c1, c2] = PALETTES[photo.category] ?? ["#222", "#888"];
  const rand = seededRandom(photo.slug);
  const angle = Math.round(rand() * 360);
  const id = photo.slug.replace(/[^a-z0-9]/g, "");

  // A handful of soft translucent circles spread across the full canvas
  // (including corners) so that any crop still shows tonal variation,
  // standing in for the light/shape variety of a real photograph.
  let shapes = "";
  const shapeCount = 7;
  for (let i = 0; i < shapeCount; i++) {
    const cx = Math.round(rand() * w);
    const cy = Math.round(rand() * h);
    const r = Math.round((0.25 + rand() * 0.35) * Math.max(w, h));
    shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#dot-${id})" opacity="${(0.1 + rand() * 0.14).toFixed(2)}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="grad-${id}" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
    <radialGradient id="dot-${id}">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <filter id="grain-${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#grad-${id})" />
  ${shapes}
  <rect width="${w}" height="${h}" filter="url(#grain-${id})" />
</svg>`;
}

for (const photo of PHOTOS) {
  const svg = svgFor(photo);
  writeFileSync(join(outDir, `${photo.slug}.svg`), svg, "utf8");
}

console.log(`Generated ${PHOTOS.length} placeholder images in ${outDir}`);
