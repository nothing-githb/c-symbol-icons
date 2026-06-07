// Generates filled lowercase letter SVGs for the letter-logical symbol kinds
// (class/typedef t, method m, field sf, variable v, enum e, property p,
// struct s, function f, enum-member ec). Letters are vectorised from Segoe UI
// Regular via opentype.js at a fixed x-height so they keep natural typographic
// proportions (ascenders tall, x-height letters short, descenders below).
//
// Run before build-font.mjs:
//   .tools/node-v24.16.0-win-x64/node.exe build/gen-badges.mjs
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const opentype = require("opentype.js");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const iconsDir = join(root, "icons");
const FONT = "C:/Windows/Fonts/segoeui.ttf"; // Segoe UI Regular (thinner letters)

// basename -> badge label (1-2 chars)
const LETTERS = {
  field: "sf", // struct field
  variable: "v",
  enum: "e",
  struct: "s",
  function: "f",
  "enum-member": "ec", // enum constant
};

const BOX = 24;
const X_HEIGHT = 12; // lowercase x-height inside the 24x24 box (natural proportions)
const MAX_W = 20; // width budget; wide 2-char labels (sf, ec) shrink to fit
const BASELINE = BOX / 2 + X_HEIGHT / 2; // center the x-height band vertically

const fontBuf = readFileSync(FONT);
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

const n = (v) => Number(v.toFixed(2));

// Fixed glyph scale: map the font's x-height to X_HEIGHT so every letter keeps
// its natural proportions instead of being stretched to a uniform height.
const xbb = font.getPath("x", 0, 0, 100).getBoundingBox();
const FIXED_SIZE = (100 * X_HEIGHT) / (xbb.y2 - xbb.y1);

function letterPath(letter) {
  const p = font.getPath(letter, 0, BASELINE, FIXED_SIZE); // shared baseline
  const bb = p.getBoundingBox();
  const w = bb.x2 - bb.x1;
  const scale = w > MAX_W ? MAX_W / w : 1; // shrink only over-wide 2-char labels
  const cx = (bb.x1 + bb.x2) / 2;
  const tx = (X) => n((X - cx) * scale + BOX / 2); // center horizontally
  const ty = (Y) => n((Y - BOX / 2) * scale + BOX / 2); // natural baseline (scale=1)
  let d = "";
  for (const c of p.commands) {
    if (c.type === "M") d += `M${tx(c.x)},${ty(c.y)}`;
    else if (c.type === "L") d += `L${tx(c.x)},${ty(c.y)}`;
    else if (c.type === "C") d += `C${tx(c.x1)},${ty(c.y1)} ${tx(c.x2)},${ty(c.y2)} ${tx(c.x)},${ty(c.y)}`;
    else if (c.type === "Q") d += `Q${tx(c.x1)},${ty(c.y1)} ${tx(c.x)},${ty(c.y)}`;
    else if (c.type === "Z") d += "Z";
  }
  return d;
}

for (const [name, letter] of Object.entries(LETTERS)) {
  // Filled letter only, no surrounding badge ("ici dolu, disi bos").
  // opentype letter contours wind so counters (P/e holes) stay holes under
  // the non-zero rule that svg2ttf uses.
  const d = letterPath(letter);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000">\n` +
    `  <path d="${d}"/>\n</svg>\n`;
  await writeFile(join(iconsDir, `${name}.svg`), svg);
  console.log(`letter ${name} (${letter})`);
}
