import { request } from "undici";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Logger } from "./core/logger";
import decompress from "decompress";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MKCERT_URL = "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4";
const WEBSITE_BUILD_URL =
  "https://github.com/JadlionHD/growserver-frontend/releases/latest/download/build.zip";

async function downloadFile(logger: Logger, url: string, filePath: string) {
  try {
    const response = await request(url, {
      method: "GET",
      headers: {},
      maxRedirections: 5
    });

    if (response.statusCode !== 200) {
      throw new Error(`Failed to download file: ${response.statusCode}`);
    }

    const fileStream = createWriteStream(filePath);

    response.body.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });

    logger.info(`File downloaded successfully to ${filePath}`);
  } catch (error) {
    logger.error("Error downloading file:", error);
  }
}

const mkcertObj: Record<string, string> = {
  "win32-x64": `${MKCERT_URL}/mkcert-v1.4.4-windows-amd64.exe`,
  "win32-arm64": `${MKCERT_URL}/mkcert-v1.4.4-windows-arm64.exe`,
  "linux-x64": `${MKCERT_URL}/mkcert-v1.4.4-linux-amd64`,
  "linux-arm": `${MKCERT_URL}/mkcert-v1.4.4-linux-arm`,
  "linux-arm64": `${MKCERT_URL}/mkcert-v1.4.4-linux-arm64`,
  "darwin-x64": `${MKCERT_URL}/mkcert-v1.4.4-darwin-amd64`,
  "darwin-arm64": `${MKCERT_URL}/mkcert-v1.4.4-darwin-arm64`
};

export async function downloadMkcert(logger: Logger) {
  const checkPlatform = `${process.platform}-${process.arch}`;
  const name =
    process.platform === "darwin" || process.platform === "linux" ? "mkcert" : "mkcert.exe";

  if (!existsSync(join(__dirname, "..", ".cache", "bin")))
    mkdirSync(join(__dirname, "..", ".cache", "bin"), { recursive: true });
  else return;

  logger.info("Downloading mkcert");
  await downloadFile(
    logger,
    mkcertObj[checkPlatform],
    join(__dirname, "..", ".cache", "bin", name)
  );
}

export async function downloadWebsiteBuild(logger: Logger) {
  if (!existsSync(join(__dirname, "..", ".cache", "compressed"))) {
    mkdirSync(join(__dirname, "..", ".cache", "website"), { recursive: true });
    mkdirSync(join(__dirname, "..", ".cache", "compressed"), { recursive: true });
  } else return;
  logger.info("Downloading website build");

  const filePath = join(__dirname, "..", ".cache", "compressed", "build.zip");

  await downloadFile(logger, WEBSITE_BUILD_URL, filePath);

  decompress(filePath, join(__dirname, "..", ".cache"));
}
