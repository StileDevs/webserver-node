import { TextPacket, Peer, Client } from "growtopia.js";
import { readFileSync } from "fs";
import { main } from "./webserver.js";
import { Logger } from "./core/logger.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { downloadMkcert, downloadWebsiteBuild } from "./download.js";
import { setupMkcert } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Plugin {
  public pluginConf: any;
  public logger: Logger;
  public requiredPlugins = ["webserver-node"];
  public plugins: Map<string, any>;

  constructor(public client: Client) {
    this.pluginConf = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));
    this.logger = new Logger(this.pluginConf);
    this.plugins = new Map();
  }

  /**
   * Initialize plugin
   */
  async init() {
    try {
      await downloadMkcert(this.logger);
      await downloadWebsiteBuild(this.logger);
      await setupMkcert(this.logger);
      main(this.logger);
    } catch (e: any) {
      this.logger.error(e);
    }
  }

  /**
   * Set a bunch of loaded plugins. This meant for API purposes with other plugin.
   */
  setPlugin(name: string, plugin: any) {
    this.plugins.set(name, plugin);
  }

  /**
   * Emitted when client successfully connected to ENet server.
   * Peer state will change into CONNECTED state.
   */
  onConnect(netID: number) {}

  /**
   * Emitted when client disconnected from the ENet server.
   * Peer state will changed, depends what type of disconnected was used.
   */
  onDisconnect(netID: number) {}

  /**
   * Emitted when client sending a bunch of buffer data.
   */
  onRaw(netID: number, data: Buffer) {}
}
