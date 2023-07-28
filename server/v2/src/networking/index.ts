/**
 * @class NetworkServer
 * @description Represents a network server for a game application.
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import uws, { DEDICATED_COMPRESSOR_64KB } from 'uWebSockets.js';
import ConfigReader from '../helpers/ConfigReader';
import Game from '../components/game/Game';
import Logger from '../helpers/Logger';
import { getPublicIPAddress, isStringEmpty } from '../Utils';
import ClientHandler from '../handlers/Client';
import NetworkClient from './components/Client';
import Entity from '../components/Entity';
import { Player } from '../entities/Player';
import { EntityState } from '../enums';

export default class NetworkServer {
  private host: string = '';
  private game: Game;
  private config: ConfigReader;
  private socket: uws.TemplatedApp;
  private logger: Logger = new Logger(NetworkServer.name);

  public clients: ClientHandler;

  /**
   * @function construct
   * @description Constructs a new instance of NetworkServer.
   * @static
   * @param {ConfigReader} config - The configuration reader instance.
   * @param {Game} game - The game instance.
   * @returns {NetworkServer} The created NetworkServer instance.
   * @memberOf NetworkServer
   */
  public static construct(game: Game): NetworkServer {
    return new NetworkServer(game);
  }

  /**
   * @constructor
   * @description Initializes a new instance of NetworkServer.
   * @param {ConfigReader} config - The configuration reader instance.
   * @memberOf NetworkServer
   */
  constructor(game: Game) {
    this.game = game;
    this.config = this.game.config;
    this.clients = new ClientHandler(this.game);

    this.socket = uws.App()
      .ws('/', {
        compression: DEDICATED_COMPRESSOR_64KB,
        open: this.socketOpen.bind(this),
        close: this.socketClose.bind(this),
        message: this.socketMessage.bind(this)
      });

    // Set socket to be listening
    this.socket.listen(this.config.get('SERVER')?.PORT, (ready) => this.ready(ready as boolean));
  }

  /**
   * @function socketOpen
   * @description Handles the socket open event.
   * @private
   * @memberOf NetworkServer
   */
  private socketOpen(socket: uws.WebSocket<any>): void {
    this.clients.addClient(socket);
  }

  /**
   * @function bindSocketMessage
   * @description Handles messages from socket and it sends to client.
   * @private
   * @memberOf NetworkServer
   */
  private socketMessage(socket: uws.WebSocket<any>, message: any): void {
    const client = this.clients.findClientBySocket(socket);

    if (client) {
      client.handleMessage(message);
    }
  }

  /**
   * @function socketOpen
   * @description Handles the socket close event.
   * @private
   * @memberOf NetworkServer
   */
  private socketClose(socket: uws.WebSocket<any>): void {
    this.clients.destroyClient(this.clients.findClientBySocket(socket));
  }

  /**
   * @function recognize
   * @description Recognizes the public IP address of the server.
   * @returns {Promise<boolean>} A promise that resolves to true if the IP address is recognized, false otherwise.
   * @private
   * @memberOf NetworkServer
   */
  private async recognize(): Promise<boolean> {
    this.host = await getPublicIPAddress();

    if (isStringEmpty(this.host))
      return false;

    return true;
  }

  /**
   * @function ready
   * @description Handles the server readiness event.
   * @param {boolean} isReady - Indicates if the server is ready.
   * @private
   * @memberOf NetworkServer
   */
  private async ready(isReady: boolean) {
    if (isReady) {
      const start: boolean = await this.recognize();

      if (start) {
        // Server is listening, inform about that
        this.logger.log('info', `Server started on ${this.host}:${this.config.get('SERVER')?.PORT}`);
      } else process.exit(1);
    }
  }

  public update(): void {
    const clients: NetworkClient[] = this.clients.array;
    const length: number = clients.length;

    // States
    const sendLB: boolean = this.game.CURRENT_TICK % 15 === 0;

    if (length > 0) {
      for (const client of clients) {
        if (client.entity) {
          // Send units
          client.entity.sendUnits();

          // Send leaderboard
          if (sendLB) client.entity.sendLeaderboard();
        }
      }
    }

    // Update units states
    const units: Entity[] = this.game.world.entities.array;
    const uLength: number = units.length;
    
    for (let index = 0; index < uLength; index++) {
      const entity = units[index];

      entity.action = false;
      entity.state = entity instanceof Player ? EntityState.IDLE : EntityState.NONE;
    }
  }
}
