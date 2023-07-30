/**
 * @class NetworkServer
 * @description Represents a network server for a game application.
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import uws, { DEDICATED_COMPRESSOR_64KB } from 'uWebSockets.js';

import ConfigReader from '../../helpers/ConfigReader';
import NetworkClient from './NetworkClient';
import Logger from '../../helpers/Logger';
import Entity from '../game/GameEntity';
import Lobby from '../../helpers/Lobby';
import Game from '../game/Game';

import { Player } from '../../entities/Player';
import { EntityState } from '../../enums';
import { getPublicIPAddress, isStringEmpty } from '../../Utils';

export default class NetworkServer {
  private readonly logger: Logger = new Logger(NetworkServer.name);
  private lobby!: Lobby;

  private config!: ConfigReader;
  private socket!: uws.TemplatedApp;

  public host: string = 'localhost';
  public port: number = 8888;

  // public clients: ClientHandler;

  /**
   * @constructor
   * @description Initializes a new instance of NetworkServer.
   * @param {ConfigReader} config - The configuration reader instance.
   * @memberOf NetworkServer
   */
  constructor(private game: Game) {
    this.game = game;
    this.config = this.game.config;
    this.port = this.config.get('SERVER')?.PORT ?? 8888;

    this.socket = uws.App()
      .ws('/', {
        compression: DEDICATED_COMPRESSOR_64KB,
        open: this.socketOpen.bind(this),
        close: this.socketClose.bind(this),
        message: this.socketMessage.bind(this)
      });

    // Set socket to be listening
    this.socket.listen(this.port, (ready) => this.ready(ready as boolean));
  }

  /**
   * @function socketOpen
   * @description Handles the socket open event.
   * @private
   * @memberOf NetworkServer
   */
  private socketOpen(socket: uws.WebSocket<any>): void {
    this.game.clients.addClient(socket);
  }

  /**
   * @function bindSocketMessage
   * @description Handles messages from socket and it sends to client.
   * @private
   * @memberOf NetworkServer
   */
  private socketMessage(socket: uws.WebSocket<any>, message: any): void {
    const client = this.game.clients.findClientBySocket(socket);

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
    this.game.clients.destroyClient(this.game.clients.findClientBySocket(socket));
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
        this.lobby = new Lobby(this.game);
        
        // Server is listening, inform about that
        this.logger.log('info', `Server started on ${this.host}:${this.config.get('SERVER')?.PORT}`);
      } else process.exit(1);
    }
  }

  public update(): void {
    const clients: NetworkClient[] = this.game.clients.array;
    const length: number = clients.length;

    // States
    const sendLB: boolean = this.game.CURRENT_TICK % 30 === 0;

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
    const units: Entity[] = this.game.entities.pool.array;
    const uLength: number = units.length;
    
    for (let index = 0; index < uLength; index++) {
      const entity = units[index];

      entity.action = false;
      entity.state = entity instanceof Player ? EntityState.IDLE : EntityState.NONE;
    }
  }
}
