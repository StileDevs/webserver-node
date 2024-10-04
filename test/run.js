import consola from "consola";
import fs from "fs/promises";
import { Client } from "growtopia.js";

const client = new Client({
  enet: {
    ip: "0.0.0.0"
  },
  https: {
    enable: false
  }
});

/** @type {Map<string, import("../src/app").Plugin>} */
const loadedPlugins = new Map();

client.on("ready", async () => {
  consola.box("GrowServer");
  consola.info(`[server] - Starting ENet server port: ${client.config.enet?.port}`);

  const pluginDir = await fs.readdir("./dist");

  // Load every plugins that inside plugins directory
  await new Promise((res, rej) => {
    pluginDir.forEach(async (dir) => {
      try {
        const { Plugin } = await import(`../dist/${dir}/src/app.js`);
        /** @type {import("../src/app").Plugin} */
        const plugin = new Plugin(client);

        consola.info(
          `[server] - Initialize ${plugin.pluginConf.name} v${plugin.pluginConf.version}`
        );
        await plugin.init();
        consola.ready(`[server] - Loaded ${plugin.pluginConf.name} v${plugin.pluginConf.version}`);

        loadedPlugins.set(dir, plugin);
      } catch (e) {
        consola.error(`[server] - Oh no, something wrong when load plugin ${dir}`, e);
        rej(e);
      }
      res(true);
    });
  });

  // Give API access for the Plugins
  loadedPlugins.forEach((p) => {
    if (!p.requiredPlugins.length) return;

    p.requiredPlugins.forEach((pluginName) => {
      if (p.pluginConf.name === pluginName) return;

      if (loadedPlugins.has(pluginName)) {
        p.setPlugin(pluginName, loadedPlugins.get(pluginName));
      }
    });
  });

  consola.success(`[server] - Loaded ${loadedPlugins.size} plugins`);
});

client.on("error", (err) => {
  consola.error("[server] - Something wrong with growserver", err);
});

client.on("connect", (netID) => loadedPlugins.forEach((v) => v.onConnect(netID)));

client.on("disconnect", (netID) => loadedPlugins.forEach((v) => v.onDisconnect(netID)));

client.on("raw", (netID, data) => loadedPlugins.forEach((v) => v.onRaw(netID, data)));

client.listen();
