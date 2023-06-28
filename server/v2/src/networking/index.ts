import uws, { DEDICATED_COMPRESSOR_64KB } from 'uWebSockets.js';
import ConfigReader from '../ConfigReader';
import Game from '../Game';
import Logger from '../Logger';

export default class NetworkServer {
  private game: Game;
  private config: ConfigReader;
  private socket: uws.TemplatedApp;
  private logger: Logger = new Logger(NetworkServer.name);
  
  public static construct(config: ConfigReader, game: Game): NetworkServer {
    return new NetworkServer(config, game);
  }

  constructor(config: ConfigReader, game: Game) {
    this.game = game;
    this.config = config;

    this.socket = uws.App()
    .ws('/', {
      compression: DEDICATED_COMPRESSOR_64KB,

    })
    .listen(this.config.get('SERVER')?.PORT, (ready) => this.ready(ready as boolean));
  }

  private ready(isReady: boolean) {
    if (isReady) {
      this.logger.log('info', 'Server is ready');
    }
  }
}