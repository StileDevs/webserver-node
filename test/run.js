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

/** @type {import("../types").Plugin[]} */
const loadedPlugins = [];

client.on("ready", async () => {
  consola.info(
    `ENet server: port ${client.config.enet?.port} on ${client.config.enet?.ip} and Https server: port ${client.config.https?.httpsPort} on ${client.config.https?.ip}`
  );

  try {
    const { Plugin } = await import(`../dist/src/app.js`);
    const plugin = new Plugin();

    plugin.init(client);

    consola.info(`Loaded test plugin`);

    loadedPlugins.push(plugin);
  } catch (e) {
    consola.error(`Oh no, something wrong when load plugin`, e);
    process.exit(1);
  }
});

client.on("error", (err) => {
  consola.error("Something wrong with growserver", err);
});

client.on("connect", (netID) => loadedPlugins.forEach((v) => v.onConnect(netID)));

client.on("disconnect", (netID) => loadedPlugins.forEach((v) => v.onDisconnect(netID)));

client.on("raw", (netID, data) => loadedPlugins.forEach((v) => v.onRaw(netID, data)));

client.listen();
