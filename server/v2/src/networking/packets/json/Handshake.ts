/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Game from "../../../components/game/Game";
import { Players } from "../../../interfaces";
import { Player, PlayerSkin } from "../../../entities/Player";
import { ClientPacket, Gamemodes } from "../../../enums";
import Version from "../bin/Version";

export class Versioning {
  public environment: string = 'production';
  public buildHash: string = '';
  public channel: string = 'public';
  public array: number[] = [2, 0, 0];

  constructor(data: any[]) {
    this.environment = data[0];
    this.buildHash = data[1];
    this.channel = data[3];
    this.array = data[2];
  }

  build(): any[] {
    return [
      this.environment,
      this.buildHash,
      this.channel,
      this.array
    ]
  }
}

export class Handshake {
  public skin: PlayerSkin;
  public nickname: string = '';
  public screenWidth: number = 200;
  public clientToken: string = '';
  public screenHeight: number = 200;
  public clientVersion: any[];

  constructor(
    skin: PlayerSkin,
    nickname: string,
    clientToken: string,
    screenWidth: number,
    screenHeight: number,
    clientVersion: any[]
  ) {
    this.skin = skin;
    this.nickname = nickname;
    this.clientToken = clientToken;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.clientVersion = clientVersion;
  }

  build(): object {
    return [
      this.nickname,
      this.screenWidth,
      this.screenHeight,
      this.clientVersion,
      this.clientToken,
      "",
      0,
      this.skin.skin,
      this.skin.accessory,
      this.skin.bag,
      this.skin.book,
      this.skin.lootBox,
      this.skin.deadBox,
      null,
      null,
      null,
    ]
  }

  static fromJSON(json: any[]): Handshake {
    return new Handshake(
      new PlayerSkin(json[7], json[8], json[9], json[10], json[11], json[12]),
      json[0], json[4], json[1], json[2], json[3]
    );
  }
}

export class HandshakeResponse {
  public game: Game;
  public time: number = 0;
  public player: Player;
  public players: Player[] = [];
  public maxPlayers: number = 100;
  public mapTiles: any[] = [];
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  public mapIslands: number = 6;

  constructor(
      game: Game,
      player: Player,
      private handshake: Handshake,
      players: Player[],
  ) {
    this.game = game;
    this.handshake = handshake;
    this.player = player;

    // Check player version before doing anything
    if (this.player && this.player instanceof Player) {
      const check: Versioning = new Versioning(handshake.clientVersion);

      console.log(check);
    }

    this.players = players;

    this.mapTiles = this.game.config.get("GAMEPLAY")?.MAP?.TILES;
    this.mapWidth = this.game.config.get("GAMEPLAY")?.MAP?.WIDTH;
    this.mapHeight = this.game.config.get("GAMEPLAY")?.MAP?.HEIGHT;
    this.mapIslands = this.game.config.get("GAMEPLAY")?.MAP?.ISLANDS;
    this.maxPlayers = this.game.config.get("SERVER")?.MAX_PLAYERS;
  }

  get build(): object {
    const players: Players[] = [];
    const playersLen: number = this.players.length;

    for (let i = 0; i < playersLen; i++) {
      const player: Player = this.players[i];

      if (player && player instanceof Player) {
        const data: Players = {
          i: player.client.id,
          n: player.nickname,
          s: player.skin.skin,
          a: player.skin.accessory,
          c: player.skin.lootBox,
          b: player.skin.book,
          d: player.skin.deadBox,
          g: player.skin.bag,
          l: player.client.id
        };

        players.push(data);
      }
    }

    return [
      ClientPacket.GAME_HANDSHAKE, // Packet header - 0
      Gamemodes.COMMUNITY, // Gamemode (TODO: make this gathering from game config) - 1
      this.game.world.night ? 1 : 0, // Night - 2
      this.player.position.x, // Player position X, - 3
      players, // Player list - 4
      0, // Day time - 5
      this.player.ghost ? 1 : 0, // Ghost mode (TODO: not implemented yet)
      1000, // Max entities in world (TODO: not implemented yet)
      [], // Totem that player in with player list (TODO: not implemented yet)
      this.player.client.id, // Player ID
      this.player.position.y, // Player position Y,
      this.maxPlayers, // Max players in server
      "", // Player generated token ID (TODO: not implemented yet)
      0, // Shop value? (TODO: not implemented yet)
      this.player.inventory.items, // Player inventory
      this.game.world.time, // World time
      0, // Quest born timestamp? (TODO: not implemented yet)
      0, // Quests to be restored? (TODO: not implemented yet)
      0, // UNDEFINED IN CODE - DO NOT TOUCH IT
      36, // Map seed generation (TODO: not implemented yet)
      this.mapWidth, // Map width
      this.mapHeight, // Map height
      this.mapIslands, // Map islands
      this.mapTiles, // Custom map
      "", // Welcome message (TODO: not implemented yet)
      0, // Custom crafting receipes (TODO: not implemented yet)
      0, // Desert tempest (TODO: not implemented yet)
      0, // Winter tempest (TODO: not implemented yet)
    ];
  }
}