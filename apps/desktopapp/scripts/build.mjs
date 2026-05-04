import esbuild from "esbuild";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const desktopDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(desktopDir, "../..");

await mkdir(path.resolve(desktopDir, "dist"), { recursive: true });

await esbuild.build({
  entryPoints: [path.resolve(desktopDir, "src/main.ts")],
  outfile: path.resolve(desktopDir, "dist/main.cjs"),
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node22",
  external: ["electron", "electron/*"],
  define: {
    __REGISTRY_REPO_ROOT__: JSON.stringify(repoRoot),
  },
  sourcemap: true,
});
