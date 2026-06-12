import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const steps = [
  "typecheck",
  "lint",
  "test",
  "coverage",
  "build",
  "docs",
  "pages:build",
  "e2e"
];

function commandForStep(step) {
  if (process.platform === "win32") {
    return {
      command: process.env.ComSpec ?? "cmd.exe",
      args: ["/d", "/s", "/c", `${npmCommand} run ${step}`]
    };
  }

  return {
    command: npmCommand,
    args: ["run", step]
  };
}

function runStep(step) {
  return new Promise((resolve) => {
    const { command, args } = commandForStep(step);
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit"
    });

    child.once("exit", (code) => {
      resolve(code ?? 1);
    });
  });
}

for (const step of steps) {
  const code = await runStep(step);
  if (code !== 0) {
    process.exit(code);
  }
}
