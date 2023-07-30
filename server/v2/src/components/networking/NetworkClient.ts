/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import uws from 'uWebSockets.js';
import msgpack from 'msgpack-lite';

import Game from '../game/Game';
import Logger from "../../helpers/Logger";
import NewPlayer from '../../networking/packets/json/NewPlayer';
import GameBiome from '../game/GameBiome';

import { Player } from '../../entities/Player';
import { xorDecrypt } from '../../Utils';
import { RegisteredJSONHandler } from '../../types';
import { Handshake, HandshakeResponse } from '../../networking/packets/json/Handshake';
import { handleChat, handleAngle, handleAttack, handleDirection, handleStopAttack } from './handlers/Base';

export default class NetworkClient {
  // Logger
  private logger: Logger = new Logger(NetworkClient.name);

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

  private registerHandler(registeredHandler: RegisteredJSONHandler): void {
    if (registeredHandler.handlerType === "JSON" && !this.JSONHandlers.has(registeredHandler.header))
      this.JSONHandlers.set(registeredHandler.header, registeredHandler.handler);
  }

  // Public properties
  public handshaked: boolean = false;

  constructor(public game: Game, public id: number = -1, public socket: uws.WebSocket<any>) {
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

    let json: any[] = [];

    try {
      json = JSON.parse(xorDecrypt(msgpack.decode(buffer)));
    } catch (error) {
      this.logger.log('error', 'message parse fail', error);
    } finally {
      if (Array.isArray(json)) {
        // Splitting the message into header and data
        const [header, ...data] = json;

        // If header is a string and data contains 16 length array that's a handshake
        if (typeof header === 'string') {
          if (!this.handshaked) {
            // Build an handshake data
            const handshakeData: Handshake = Handshake.fromJSON(json);

            // Create player entity
            const player: Player = new Player(this.game, this, {
              skin: handshakeData.skin,
              nickname: handshakeData.nickname,
              clientVersion: handshakeData.clientVersion
            });

            if (player) {
              let biome: GameBiome | boolean = false;

              // Select random biome
              if (this.game.world.spawnBiomes.length > 1) {
                const selectedBiome: number = ~~(Math.random() * this.game.world.spawnBiomes.length) - 1;

                biome = this.game.world.spawnBiomes[selectedBiome];
              } else biome = this.game.world.spawnBiomes[0];
              
              // Spawn player in random place
              if (biome) {
                player.position.x = Math.min(Math.max(~~(Math.random() * biome.bounds.max.x), biome.bounds.max.x / 2), biome.bounds.max.x - 1);
                player.position.y = Math.min(Math.max(~~(Math.random() * biome.bounds.max.x), biome.bounds.max.y / 2), biome.bounds.max.y - 1);
              }

              // Insert player to world
              this.entity = player;
              this.game.entities.addEntity(this.entity);

              // Send to other clients to register new player
              const len: number = this.game.network.clients.array.length;
              const packet: NewPlayer = new NewPlayer(this.entity);

              for (let index = 0; index < len; index++) {
                const client = this.game.network.clients.array[index];

                if (client.socket === this.socket)
                  continue;

                client.socket.send(JSON.stringify(packet.build));
              }

              // Send an response to the client
              const response: HandshakeResponse = new HandshakeResponse(
                handshakeData,
                this.game.entities.pool.array.filter(e => e instanceof Player) as Player[], 
                player,
                this.game
              );
              if (response) this.socket.send(JSON.stringify(response.build));

              // Send current leaderboard
              this.entity.sendLeaderboard();
            }
              
            this.handshaked = true;
          }
        } else {
          this.logger.log('debug', 'message received', JSON.stringify(json));
          
          this.handleJSONCommunication(json);
        }
      }
    }
  }
}