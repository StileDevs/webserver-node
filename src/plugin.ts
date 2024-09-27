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

  constructor(public client: Client) {
    this.pluginConf = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));
    this.logger = new Logger(this.pluginConf);
  }

  /**
   * Initialize plugin
   */
  async init() {
    try {
      this.logger.info(`Initialize ${this.pluginConf.name} v${this.pluginConf.version}`);
      await downloadMkcert(this.logger);
      await downloadWebsiteBuild(this.logger);
      await setupMkcert(this.logger);
      main(this.logger);
      this.logger.success(`Loaded ${this.pluginConf.name} v${this.pluginConf.version}`);
    } catch (e: any) {
      this.logger.error(e);
    }
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
