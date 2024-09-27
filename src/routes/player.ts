import { readFileSync } from "fs";
import { Hono } from "hono";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function PlayerRoute() {
  const router = new Hono();

  router.post("/growid/checktoken", async (ctx) => {
    const { token } = await ctx.req.json<{ token: string }>();
    if (!token) return ctx.status(401);

    ctx.body(
      JSON.stringify({
        status: "success",
        message: "Account Validated.",
        token,
        url: "",
        accountType: "growtopia"
      })
    );
  });

  router.get("/growid/login/validate", async (ctx) => {
    const { token } = await ctx.req.json<{ token: string }>();
    if (!token) return ctx.status(401);

    ctx.body(
      JSON.stringify({
        status: "success",
        message: "Account Validated.",
        token,
        url: "",
        accountType: "growtopia"
      })
    );
  });

  router.post("/login/dashboard", (ctx) => {
    const html = readFileSync(join(__dirname, "..", ".cache", "website", "index.html"), "utf-8");
    return ctx.html(html);
  });

  return router;
}
