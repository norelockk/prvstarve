import uws from 'uWebSockets.js';

import Game from '../components/game/Game';
import Logger from '../helpers/Logger';
import NetworkClient from '../components/networking/NetworkClient';

import { EntityState } from '../enums';

export default class ClientManager {
  // Logger
  private readonly logger: Logger = new Logger(ClientManager.name);
  private readonly init: number = Date.now();
  
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
  constructor(private game: Game) {
    const now: number = Date.now();

    this.game = game;

    this.logger.log('debug', `Ready (took ${now - this.init}ms)`);
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
      
      client = new NetworkClient(this.game, id, socket);

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

        this.game.entities.removeEntity(_client.entity);
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
