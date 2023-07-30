/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import { convertBoolToNumber } from "../../../Utils";
import Game from "../../../components/game/Game";
import { Player, PlayerSkin } from "../../../entities/Player";
import { ClientPacket, Gamemodes } from "../../../enums";

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
  private readonly header: ClientPacket = ClientPacket.GAME_HANDSHAKE;
  private playersJSON: object[] = [];

  public maxPlayers: number = 100;

  constructor(
    private handshake: Handshake,
    private players: Player[],
    private player: Player,
    private game: Game,
  ) {
    this.handshake = handshake;
    this.players = players;
    this.player = player;
    this.game = game;

    // Check player version before doing anything
    if (this.player && this.player instanceof Player) {
      const check: Versioning = new Versioning(this.handshake.clientVersion);

      console.log(check);
    }

    const length: number = this.players.length;
    for (let index = 0; index < length; index++) {
      const player: Player = this.players[index];

      if (player) this.playersJSON.push(player.json);
    }

    this.maxPlayers = this.game.config.get("SERVER")?.MAX_PLAYERS;
  }

  get build(): object {
    return [
      this.header, // Packet header - 0
      Gamemodes.COMMUNITY, // Gamemode (TODO: make this gathering from game config) - 1
      0, // Days survived by player (TODO) - 2
      this.player.position.x, // Player position X, - 3
      this.playersJSON, // Player list - 4
      convertBoolToNumber(this.game.world.night), // Day time - 5
      convertBoolToNumber(this.player.ghost), // Player ghost mode - 6
      1000, // Max entities in world - 7
      [], // Totem that player in with player list (TODO: not implemented yet) - 8
      this.player.client.id, // Player ID - 9
      this.player.position.y, // Player position Y - 10,
      this.maxPlayers, // Max players in server - 11
      "", // Player generated token ID (TODO: not implemented yet) - 12
      0, // Shop value? (TODO: not implemented yet) - 13
      this.player.inventory.items, // Player inventory - 14
      this.game.world.time / 2, // World time - 15
      0, // Quest born timestamp? (TODO: not implemented yet)
      0, // Quests to be restored? (TODO: not implemented yet)
      0, // UNDEFINED IN CODE - DO NOT TOUCH IT
      this.game.world.seed, // Map seed (for generation maps)
      this.game.world.bounds.max.x / 100, // Map width
      this.game.world.bounds.max.y / 100, // Map height
      this.game.world.islands, // Map islands
      this.game.world.seed === 0 ? this.game.world.tiles : 0, // Custom map
      "", // Welcome message (TODO: not implemented yet)
      0, // Custom crafting receipes (TODO: not implemented yet)
      0, // Desert tempest (TODO: not implemented yet)
      0, // Winter tempest (TODO: not implemented yet)
    ];
  }
}