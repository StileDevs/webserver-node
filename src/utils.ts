import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import type { Logger } from "./core/logger";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setupMkcert(logger: Logger) {
  const rootDir = join(__dirname, "..");
  const name =
    process.platform === "darwin" || process.platform === "linux" ? "mkcert" : "mkcert.exe";
  const mkcertExecuteable = join(rootDir, ".cache", "bin", name);

  if (!existsSync(join(__dirname, "..", ".cache", "ssl")))
    mkdirSync(join(__dirname, "..", ".cache", "ssl"), { recursive: true });
  else return;

  logger.info("Setup mkcert certificate");
  try {
    execSync(
      `${mkcertExecuteable} -install && cd ${join(
        rootDir,
        ".cache",
        "ssl"
      )} && ${mkcertExecuteable} *.growserver.app`,
      { stdio: "ignore" }
    );
  } catch (e) {
    logger.error("Something wrong when setup mkcert", e);
  }
}
