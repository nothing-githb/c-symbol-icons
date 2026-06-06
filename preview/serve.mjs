import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, normalize, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url))); // project root (c-icons)
const PORT = 5599;
const types = {
  ".html": "text/html", ".svg": "image/svg+xml", ".css": "text/css",
  ".js": "text/javascript", ".woff": "font/woff", ".json": "application/json",
};

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/save") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      await writeFile(join(root, "preview", "composite.png"), Buffer.concat(chunks));
      res.writeHead(200, { "Content-Type": "text/plain" }); res.end("ok");
      return;
    }
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/preview/index.html";
    const file = join(root, normalize(p).replace(/^(\.\.[/\\])+/, ""));
    const buf = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(buf);
  } catch (e) {
    res.writeHead(404); res.end("not found: " + e.message);
  }
}).listen(PORT, () => console.log(`serving on http://localhost:${PORT}/`));
