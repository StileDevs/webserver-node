import consola from "consola";

export class Logger {
  constructor(private pluginConf: any) {}

  private get logPluginName() {
    return `[${[this.pluginConf.name]}] -`;
  }

  public start(msg: string, ...args: any[]) {
    consola.start(msg ? `${this.logPluginName} ${msg}` : this.logPluginName, ...args);
  }
  public success(msg: string, ...args: any[]) {
    consola.success(msg ? `${this.logPluginName} ${msg}` : this.logPluginName, ...args);
  }

  public log(msg: string, ...args: any[]) {
    consola.log(msg ? `${this.logPluginName} ${msg}` : this.logPluginName, ...args);
  }
  public info(msg: string, ...args: any[]) {
    consola.info(msg ? `${this.logPluginName} ${msg}` : this.logPluginName, ...args);
  }
  public warn(msg: string, ...args: any[]) {
    consola.warn(msg ? `${this.logPluginName} ${msg}` : this.logPluginName, ...args);
  }
  public error(err: string, ...args: any[]) {
    consola.error(err, ...args);
  }
}
