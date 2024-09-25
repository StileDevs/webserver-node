import { defineConfig, type Options } from "tsup";

let config: Options = {
  entry: ["src/**/*", "package.json", "config.json", "resources/**/*"],
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
    ".json": "copy"
  }
};

export default defineConfig(config);
