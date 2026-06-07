// Generates JetBrains-style "letter badge" SVGs for the letter-logical symbol
// kinds: a rounded square with the letter knocked out (fill-rule evenodd), so
// the theme color fills the badge and the letter shows through as the kind's
// initial. Letters are vectorised from Segoe UI Bold via opentype.js.
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
  class: "t", // class and typedef share the symbol-class codicon -> both show 't'
  method: "M",
  field: "Sf", // struct field
  variable: "V",
  enum: "E",
  property: "P",
  struct: "S",
  function: "f",
  "enum-member": "Ec", // enum constant
};

const BOX = 24;
const TARGET_H = 16.5; // label height inside the 24x24 box (no frame -> fill more)
const TARGET_W = 19; // label width budget for 2-char labels
const fontBuf = readFileSync(FONT);
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

const n = (v) => Number(v.toFixed(2));

function letterPath(letter) {
  const p = font.getPath(letter, 0, 0, 20); // baseline at y=0, size 20
  const bb = p.getBoundingBox();
  const cx = (bb.x1 + bb.x2) / 2;
  const cy = (bb.y1 + bb.y2) / 2;
  // Fit within both the height and width budgets (2-char labels are width-bound).
  const scale = Math.min(TARGET_H / (bb.y2 - bb.y1), TARGET_W / (bb.x2 - bb.x1));
  const tx = (X) => n((X - cx) * scale + BOX / 2);
  const ty = (Y) => n((Y - cy) * scale + BOX / 2);
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
