import "dotenv/config";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";

const FXSERVER_RESOURCES_PATH = process.env.FXSERVER_RESOURCES_PATH;
const BASE_PATH = path.resolve(process.cwd(), "integration");
const PREFIX = "sna";

const integrationKey = "live-map";
const integrationPath = path.resolve(BASE_PATH);

const distDir = FXSERVER_RESOURCES_PATH
  ? `${FXSERVER_RESOURCES_PATH}/${PREFIX}-${integrationKey}`
  : `dist/${PREFIX}-${integrationKey}`;

console.log(`Building ${integrationKey} to ${distDir}`);

const serverEntry = path.resolve(integrationPath, "server", "server.ts");
const clientEntry = path.resolve(integrationPath, "client", "client.ts");

await esbuild.build({
  bundle: true,
  logLevel: "info",
  entryPoints: [serverEntry, clientEntry],
  format: "cjs",
  outdir: distDir,
  platform: "node",
  target: "node14",
});

const fxmanifest = path.resolve(integrationPath, "fxmanifest.lua");
const manifest = await fs.readFile(fxmanifest);

fs.writeFile(path.resolve(distDir, "fxmanifest.lua"), manifest);
