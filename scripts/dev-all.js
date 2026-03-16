const { spawn } = require("node:child_process");

const services = [
  { name: "backend", command: "pnpm", args: ["--dir", "backend", "dev"] },
  { name: "frontend", command: "pnpm", args: ["--dir", "frontend", "dev"] }
];

const children = [];
let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) {
        child.kill("SIGTERM");
      }
    }
    process.exit(exitCode);
  }, 500);
}

for (const service of services) {
  const child = spawn(service.command, service.args, {
    stdio: "inherit",
    shell: true
  });

  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (signal) {
      console.log(`[dev-all] ${service.name} stopped by signal ${signal}.`);
      shutdown(1);
      return;
    }

    if (code !== 0) {
      console.error(`[dev-all] ${service.name} exited with code ${code}. Stopping other services.`);
      shutdown(code || 1);
      return;
    }

    console.log(`[dev-all] ${service.name} exited normally. Stopping other services.`);
    shutdown(0);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
