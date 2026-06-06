// Builds the icon font (woff) from icons/*.svg and generates the
// product icon theme JSON that maps codicon symbol IDs to glyphs.
//
// Drives svgicons2svgfont -> svg2ttf -> ttf2woff directly (the high-level
// `fantasticon` wrapper mis-globs SVG paths on Windows).
//
// Run with the portable Node:
//   .tools/node-v24.16.0-win-x64/node.exe build/build-font.mjs
import { createRequire } from "node:module";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const SVGIcons2SVGFontStream = require("svgicons2svgfont");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const iconsDir = join(root, "icons").replace(/\\/g, "/");
const fontsDir = join(root, "theme", "fonts").replace(/\\/g, "/");
const themePath = join(root, "theme", "c-cpp-product-icon-theme.json");

const FONT_ID = "c-cpp-icons";
const FONT_FILE = "c-cpp-icons.woff";

// Every icon file maps 1:1 to a codicon symbol-* id (file name == id minus "symbol-").
const names = (await readdir(iconsDir))
  .filter((f) => f.endsWith(".svg"))
  .map((f) => f.replace(/\.svg$/, ""))
  .sort();

// Deterministic codepoints in the Private Use Area starting at U+E000.
const codepoints = {};
names.forEach((n, i) => (codepoints[n] = 0xe000 + i));

await mkdir(fontsDir, { recursive: true });

// 1) SVG glyphs -> SVG font.
const svgFont = await new Promise((resolve, reject) => {
  let buf = "";
  const stream = new SVGIcons2SVGFontStream({
    fontName: FONT_ID,
    fontHeight: 1000,
    normalize: false, // all icons share a 24x24 viewBox -> uniform scaling
    centerHorizontally: true,
    centerVertically: true,
    log: () => {},
  });
  stream.on("data", (d) => (buf += d)).on("end", () => resolve(buf)).on("error", reject);
  for (const n of names) {
    const glyph = createReadStream(join(iconsDir, `${n}.svg`));
    glyph.metadata = { unicode: [String.fromCodePoint(codepoints[n])], name: n };
    stream.write(glyph);
  }
  stream.end();
});

// 2) SVG font -> TTF -> WOFF.
const ttf = svg2ttf(svgFont, { description: "C/C++ Symbol Icons", version: "1.0" });
const ttfBuf = Buffer.from(ttf.buffer);
const woffOut = ttf2woff(new Uint8Array(ttfBuf));
await writeFile(join(fontsDir, FONT_FILE), Buffer.from(woffOut.buffer || woffOut));

// 3) Build the product icon theme JSON.
const iconDefinitions = {};
for (const n of names) {
  const hex = codepoints[n].toString(16).toUpperCase();
  iconDefinitions[`symbol-${n}`] = { fontCharacter: `\\${hex}` };
}
const theme = {
  fonts: [
    {
      id: FONT_ID,
      src: [{ path: `./fonts/${FONT_FILE}`, format: "woff" }],
      weight: "normal",
      style: "normal",
    },
  ],
  iconDefinitions,
};
await writeFile(themePath, JSON.stringify(theme, null, 2) + "\n");

console.log(`Built ${FONT_FILE} with ${names.length} glyphs:`);
console.log(names.map((n) => `  symbol-${n} -> U+${codepoints[n].toString(16).toUpperCase()}`).join("\n"));
