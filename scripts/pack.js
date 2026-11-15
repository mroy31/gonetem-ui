const { spawn } = require("child_process");
const { readEditionEnv } = require("./edition-env");

const [, , edition, forgeCommand, ...forgeArgs] = process.argv;

if (!edition || !forgeCommand) {
    console.error("Usage: node scripts/pack.js <full|student> <forge-command> [forge-args...]");
    process.exit(1);
}

let resolved;
try {
    resolved = readEditionEnv({
        ...process.env,
        GONETEM_EDITION: edition,
    });
} catch (err) {
    console.error(String(err.message ?? err));
    process.exit(1);
}

const child = spawn(
    "yarn",
    ["electron-forge", forgeCommand, ...forgeArgs],
    {
        stdio: "inherit",
        shell: process.platform === "win32",
        env: {
            ...process.env,
            GONETEM_EDITION: resolved.edition,
            GONETEM_SERVER_URI: resolved.studentServerUri,
        },
    }
);

child.on("exit", (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal);
        return;
    }
    process.exit(code ?? 0);
});

child.on("error", (err) => {
    console.error(String(err.message ?? err));
    process.exit(1);
});
