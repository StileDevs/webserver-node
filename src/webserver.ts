import { Hono } from "hono";
import { logger as logg } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import type { Logger } from "./core/logger";
import { createServer } from "https";
import { readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { PlayerRoute } from "./routes/player";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "..", "config.json"), "utf-8"));

function main(logger: Logger) {
  const app = new Hono();

  app.use(logg((str, ...rest) => logger.log(str, ...rest)));

  const from = join(__dirname, "..", "..", "..");
  const to = join(__dirname, "..", ".cache", "website");
  const root = relative(from, to);

  app.use(
    "/*",
    serveStatic({
      root
    })
  );

  app.post("/growtopia/server_data.php", (ctx) => {
    let str = "";

    str += `server|${conf.address}\n`;

    const randPort = conf.ports[Math.floor(Math.random() * conf.ports.length)];
    str += `port|${randPort}\nloginurl|${conf.loginUrl}\ntype|1\n${
      conf.maintenance.enable ? "maint" : "#maint"
    }|${conf.maintenance.message}\nmeta|ignoremeta\nRTENDMARKERBS1001`;

    return ctx.body(str);
  });

  app.route("/player", PlayerRoute());

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

  serve(
    {
      fetch: app.fetch,
      port: 8080,
      createServer,
      serverOptions: {
        key: readFileSync(
          join(__dirname, "..", ".cache", "ssl", "_wildcard.growserver.app-key.pem")
        ),
        cert: readFileSync(join(__dirname, "..", ".cache", "ssl", "_wildcard.growserver.app.pem"))
      }
    },
    (info) => {
      logger.log(`Running Login server on https://localhost:8080`);
    }
  );
}

export { main };
