/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import uws from 'uWebSockets.js';
import msgpack from 'msgpack-lite';

import Game from '../../Game';
import Logger from "../../Logger";
import { RegisteredJSONHandler } from '../../types';
import { Player } from '../../entities/components/Player';
import { Handshake, HandshakeResponse } from '../packets/Handshake';
import { handleDirection, handleAngle, handleAttack, handleStopAttack } from '../handlers/Movement';
import { network } from '../..';
import { xorDecrypt } from '../../Utils';
import NewPlayer from '../packets/NewPlayer';
import handleChat from '../handlers/Chat';

export default class NetworkClient {
  // Logger
  private logger: Logger = new Logger(NetworkClient.name);

  // Game
  private game: Game;

  // Player entity
  public entity?: Player;

  // Handlers
  private JSONHandlers: Map<number, Function> = new Map();
  private handlers: [number, Function][] = [
    [0, handleChat],
    [3, handleAngle],
    [4, handleAttack],
    [2, handleDirection],
    [14, handleStopAttack]
  ];

  // Public properties
  public id: number = 0;
  public socket: uws.WebSocket<any>;
  public handshaked: boolean = false;

  // Static constructor so it can be instantiated
  public static create(id: number, game: Game, socket: uws.WebSocket<any>): NetworkClient {
    return new NetworkClient(id, game, socket);
  }

  constructor(id: number, game: Game, socket: uws.WebSocket<any>) {
    this.id = id;
    this.game = game;
    this.socket = socket;

    for (let index = 0; index < this.handlers.length; index++) {
      const handler: [number, Function] = this.handlers[index];
      const [ header, callback ] = handler;

      this.registerHandler({
        header: header,
        handler: callback,
        handlerType: 'JSON'
      });
    }
  }

  /**
   * Handler for JSON communictation.
   * @param data Message data as string.
   */
  private handleJSONCommunication = (data: any) => {
    const [header, ...payload] = data;

    const handler = this.JSONHandlers.get(header);

    if (handler) handler(this as NetworkClient, payload);
  }

  /**
   * @function handleMessage
   * @description Handles messages from the server to the client
   * @param {ArrayBuffer} message The message received from the server
   * @returns {void}
   */
  public handleMessage(message: ArrayBuffer): void {
    const buffer: Buffer = Buffer.from(message);
    const r = buffer.toString();

    let json: any[] = [];

    try {
      json = JSON.parse(xorDecrypt(msgpack.decode(buffer)));
    } catch (error) {
      this.logger.log('error', 'message parse fail', error);
    } finally {
      if (Array.isArray(json)) {
        // this.logger.log('debug', 'message received', JSON.stringify(json));

        // Splitting the message into header and data
        const [header, ...data] = json;

        // If header is a string and data contains 16 length array that's a handshake
        if (typeof header === 'string' && data.length === 16) {
          if (!this.handshaked) {
            this.handshaked = true;

            // Build an handshake data
            const handshakeData: Handshake = Handshake.fromJSON(json);

            // Create player entity
            const player: Player = new Player(this.game, this, {
              skin: handshakeData.skin,
              nickname: handshakeData.nickname,
              clientVersion: handshakeData.clientVersion
            });

            if (player) {
              // Insert player to world
              this.game.world.addEntity(player);
              this.entity = player;

              // Send to other clients to register new player
              const len: number = network.clients.array.length;

              for (let index = 0; index < len; index++) {
                const client = network.clients.array[index];

                if (client.socket === this.socket)
                  continue;

                client.socket.send(JSON.stringify(new NewPlayer(player).build));
              }

              // Send an response to the client
              const response: HandshakeResponse = new HandshakeResponse(this.game, player, this.game.world.entities.array as Player[]);
              this.socket.send(JSON.stringify(response.build));
            }
          }
        } else {
          this.handleJSONCommunication(json);
        }
      }
    }
  }

  public registerHandler(registeredHandler: RegisteredJSONHandler): void {
    if (registeredHandler.handlerType === "JSON" && !this.JSONHandlers.has(registeredHandler.header))
      this.JSONHandlers.set(registeredHandler.header, registeredHandler.handler);
  }
}