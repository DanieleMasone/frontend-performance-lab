import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const port = Number(args.get("--port") ?? process.env.PORT ?? 4175);
const rawBase = args.get("--base") ?? process.env.SITE_BASE_PATH ?? "/frontend-performance-lab/";
const shutdownOnStdinClose = args.has("--shutdown-on-stdin-close");
const basePath = rawBase.startsWith("/") ? rawBase : `/${rawBase}`;
const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
const siteDir = resolve(process.cwd(), "site");

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"]
]);

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8"
  });
  response.end(body);
}

function isInsideSite(target) {
  return target === siteDir || target.startsWith(`${siteDir}${sep}`);
}

async function resolveSiteFile(requestUrl) {
  const parsedUrl = new URL(requestUrl ?? "/", `http://127.0.0.1:${port}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === normalizedBase.slice(0, -1)) {
    return { redirect: normalizedBase };
  }

  if (!pathname.startsWith(normalizedBase)) {
    return { statusCode: 404, message: "Not found" };
  }

  let relativePath = pathname.slice(normalizedBase.length);
  if (relativePath === "" || relativePath.endsWith("/")) {
    relativePath = `${relativePath}index.html`;
  }

  const target = resolve(siteDir, relativePath);
  if (!isInsideSite(target)) {
    return { statusCode: 403, message: "Forbidden" };
  }

  const targetStat = await stat(target);
  if (targetStat.isDirectory()) {
    return { path: resolve(target, "index.html") };
  }

  return { path: target };
}

const server = createServer(async (request, response) => {
  try {
    const resolved = await resolveSiteFile(request.url);

    if (resolved.redirect) {
      response.writeHead(302, { location: resolved.redirect });
      response.end();
      return;
    }

    if (!resolved.path) {
      sendText(response, resolved.statusCode ?? 404, resolved.message ?? "Not found");
      return;
    }

    const contentType = mimeTypes.get(extname(resolved.path)) ?? "application/octet-stream";
    response.writeHead(200, { "content-type": contentType });
    createReadStream(resolved.path).pipe(response);
  } catch {
    sendText(response, 404, "Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${siteDir} at http://127.0.0.1:${port}${normalizedBase}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
if (shutdownOnStdinClose) {
  process.stdin.on("close", shutdown);
}
