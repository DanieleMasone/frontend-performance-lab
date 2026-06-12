import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.E2E_PORT ?? 4175);
const basePath = process.env.E2E_BASE_PATH ?? "/frontend-performance-lab/";
const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
const baseURL = `http://127.0.0.1:${port}${normalizedBasePath}`;

function delay(ms) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, ms);
  });
}

async function waitForServer(child) {
  const startedAt = Date.now();
  const timeoutMs = 60_000;

  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(`Static server exited before ${baseURL} became available.`);
    }

    try {
      const response = await fetch(baseURL);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until the server accepts connections.
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for ${baseURL}.`);
}

function stopServer(child) {
  return new Promise((resolveStop) => {
    if (child.exitCode !== null) {
      resolveStop();
      return;
    }

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolveStop();
    }, 2_000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolveStop();
    });

    child.kill("SIGTERM");
  });
}

const server = spawn(
  process.execPath,
  [
    resolve(root, "scripts", "serve-site.mjs"),
    "--port",
    String(port),
    "--base",
    normalizedBasePath,
    "--shutdown-on-stdin-close",
    "true"
  ],
  {
    cwd: root,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"]
  }
);

server.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
});
server.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

let exitCode;

try {
  await waitForServer(server);

  const cli = resolve(root, "node_modules", "playwright", "cli.js");
  const args = ["test", ...process.argv.slice(2)];
  const runner = spawn(process.execPath, [cli, ...args], {
    cwd: root,
    env: {
      ...process.env,
      E2E_BASE_PATH: normalizedBasePath,
      E2E_PORT: String(port),
      PLAYWRIGHT_SKIP_WEB_SERVER: "1"
    },
    stdio: "inherit"
  });

  exitCode = await new Promise((resolveExit) => {
    runner.once("exit", (code) => {
      resolveExit(code ?? 1);
    });
  });
} finally {
  await stopServer(server);
}

process.exit(exitCode ?? 1);
