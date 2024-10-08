import { readFileSync } from "fs";
import { defineConfig, type Options } from "tsup";

const packagePlugin = JSON.parse(readFileSync("./package.json", "utf-8"));

let config: Options = {
  entry: ["src/app.ts", "package.json", "config.json", "resources/**/*"],
  outDir: `dist/${packagePlugin.name}`,
  splitting: false,
  sourcemap: false,
  bundle: true,
  clean: true,
  dts: false,
  target: "node20",
  format: "esm",
  loader: {
    ".key": "copy",
    ".crt": "copy",
    ".pem": "copy",
    ".rttex": "copy",
    ".json": "copy",
    ".html": "copy",
    ".css": "copy",
    ".js": "copy",
    ".svg": "copy",
    ".png": "copy",
    ".jpg": "copy",
    ".jpeg": "copy"
  }
};

export default defineConfig(config);
