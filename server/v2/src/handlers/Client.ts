/**
 * @class ClientHandler
 * @description Handles the management of network clients in a server application.
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import uws from 'uWebSockets.js';

import Game from '../components/Game';
import Logger from '../helpers/Logger';
import NetworkClient from '../networking/components/Client';
import { EntityState } from '../enums';

export default class ClientHandler {
  // Logger
  private logger: Logger = new Logger(ClientHandler.name);

  // Game
  private game: Game;

  // ID pool
  private idCtr: number = 1;
  private idPool: number[] = [];
  private idIndexMap: Map<number, number> = new Map();

  // Clients
  public array: NetworkClient[] = [];

  /**
   * @constructor ClientHandler
   * @description Creates a new client handler.
   */
  constructor(game: Game) {
    this.game = game;
  }

  /**
   * @function createId
   * @description Generates a new unique ID for a client.
   * @returns {number} The new ID.
   * @memberOf ClientHandler
   * @private
   */
  private createId(): number {
    return (this.idPool.length !== 0 ? this.idPool.pop() : this.idCtr++) as number;
  }

  /**
   * @function disposeId
   * @description Disposes a used client ID and adds it back to the ID pool for reuse.
   * @param {number} id - The ID to dispose of.
   * @memberOf ClientHandler
   * @private
   */
  private disposeId(id: number): void {
    this.idPool.push(id);
  }

  /**
   * @function findClientBySocket
   * @description Finds a client by their associated socket.
   * @param {uws.WebSocket<any>} socket - The socket associated with the client.
   * @returns {NetworkClient} The client with the given socket, or undefined if not found.
   * @memberOf ClientHandler
   * @public
   */
  public findClientBySocket(socket: uws.WebSocket<any>): NetworkClient {
    return this.array.find((client: NetworkClient) => client.socket === socket) as NetworkClient;
  }

  /**
   * @function addClient
   * @description Adds a new client to the client array.
   * @param {uws.WebSocket<any>} socket - The socket associated with the client.
   * @memberOf ClientHandler
   * @public
   */
  public addClient(socket: uws.WebSocket<any>): void {
    let client: NetworkClient = this.findClientBySocket(socket);

    if (!client) {
      const id: number = this.createId();
      
      client = NetworkClient.create(id, this.game, socket);

      this.idIndexMap.set(id, this.array.length);
      this.array.push(client);

      this.logger.log('debug', 'New client connected');
    }
  }

  /**
   * @function destroyClient
   * @description Destroys a client and removes it from the client array.
   * @param {NetworkClient} client - The client to destroy.
   * @memberOf ClientHandler
   * @public
   */
  public destroyClient(client: NetworkClient): void {
    const _client: NetworkClient = this.findClientBySocket(client.socket as uws.WebSocket<any>);

    if (_client) {
      if (_client.entity) {
        _client.entity.state |= EntityState.DELETE;

        this.game.world.removeEntity(_client.entity);
      }

      const cid: number = client.id;
      const index: number = this.idIndexMap.get(client.id) as number;

      if (index !== this.array.length) {
        const temp = this.array[this.array.length - 1];

        this.array[this.array.length - 1] = this.array[index];
        this.array[index] = temp;
        this.idIndexMap.set(temp.id, index);
      }

      this.array.pop();
      this.disposeId(cid);

      this.logger.log('debug', 'Client disconnected');
    }
  }
}
