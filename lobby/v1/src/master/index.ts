import Logger from '../libs/logger';
import Server from './Server';
// settings
const CHECK_SERVERS_INTERVAL: number = 5 * 1000; // seconds

export default class Master {
  private logger: Logger = new Logger('Master');
  private intervals: NodeJS.Timer[] = [];

  public servers: Server[] = [];

  constructor() {
    this.init();
  }

  static construct(): Master {
    return new Master();
  }

  private init(): void {
    this.intervals.push(setInterval(this.checkServers.bind(this), CHECK_SERVERS_INTERVAL));
    this.checkServers();

    this.logger.log('debug', 'Master initialized');
  }

  private checkServers(): void {
    let index = 0;
    const current = Date.now();

    for (; index < this.servers.length; index++) {
      const server = this.servers[index];

      if (server) {
        const elapsed = current - server.updated >= 30000;

        if (elapsed) {
          this.logger.log('info', 'Server has been removed due to no state update', JSON.stringify(server.json));
          this.servers.splice(index, 1);
        }
      }
    }
  }
}