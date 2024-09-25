import { Hono } from "hono";
import { serve } from "@hono/node-server";
import type { Logger } from "./core/logger";
import { createServer } from "https";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "..", "config.json"), "utf-8"));

function main(logger: Logger) {
  const app = new Hono();

  app.get("/", (ctx) => {
    return ctx.text("Hello Hono!");
  });

  app.get("/growtopia/server_data.php", (ctx) => {
    let str = "";

    str += `server|${conf.address}\n`;

    const randPort = conf.ports[Math.floor(Math.random() * conf.ports.length)];
    str += `port|${randPort}\nloginurl|${conf.loginUrl}\ntype|1\n${
      conf.maintenance.enable ? "maint" : "#maint"
    }|${conf.maintenance.message}\nmeta|ignoremeta\nRTENDMARKERBS1001`;
    return ctx.text(str);
  });

  serve(
    {
      fetch: app.fetch,
      port: 80
    },
    (info) => {
      logger.log(`Running HTTP server on http://localhost`);
    }
  );

  serve(
    {
      fetch: app.fetch,
      port: 443,
      createServer,
      serverOptions: {
        key: readFileSync(join(__dirname, "..", "resources", "ssl", "server.key")),
        cert: readFileSync(join(__dirname, "..", "resources", "ssl", "server.crt"))
      }
    },
    (info) => {
      logger.log(`Running HTTPS server on https://localhost`);
    }
  );
}

export { main };
