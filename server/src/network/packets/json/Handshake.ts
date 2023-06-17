import { CURRENT_GAMEMODE, MAX_GAME_ENTITIES, MAX_GAME_PLAYERS } from "../../../../../shared/const";
import Player from "../../../entities/Player";
import JSONPacket from "../JSONPacket";
import { JsonPacket } from "../../../../../shared/enums";

export class HandshakeResponse implements JSONPacket {
  private player: Player;
  private players: Player[];

  constructor(player: Player, players: Player[]) {
    this.player = player;
    this.players = players;
  }

  build(): object {
    return [
      JsonPacket.GAME_HANDSHAKE,     // Packet header [0]
      CURRENT_GAMEMODE,              // Current gamemode [1]
      0,                             // Day or night (TODO) [2]
      this.player.position.x,        // Player position X [3]
      this.players,                  // Detailed player list by JSON [4]
      0,                             // World time (TODO) [5]
      0,                             // Ghost mode (TODO) [6]
      MAX_GAME_ENTITIES,             // Max game entities/units (probably) [7]
      [],                            // Totem (prob a list) (TODO) [8]
      this.player.client.clientId,   // Player client ID [9]
      this.player.position.y,        // Player position Y [10]
      MAX_GAME_PLAYERS,              // Max players [11]
      "",                            // Token restore (TODO) [12]
      0,                             // Shop value? (TODO) [13]
      [],                            // Player inventory (TODO) [14]
      0,                             // World hour (TODO) [15]
      0,                             // Quest born timestamp? (TODO) [16]
      [],                            // Quest to be restored? (TODO) [17]
      0,                             // Undefined in documentation of code (DON'T TOUCH) [18]
      21745,                         // Map seed (TODO) [19]
      154,                           // World width (TODO) [20]
      154,                           // World height (TODO) [21]
      6,                             // World islands (TODO) [22]
      0,                             // World custom map (COMMUNITY, TODO) [23]
      "PrivateStarving #ff0000Alpha",// Welcome message (TODO) [24]
      0,                             // Custom crafting recipes (COMMUNITY, TODO) [25]
      0,                             // Desert tempest state (TODO) [26]
      0,                             // Winter tempest state (TODO) [27]
      0                              // Undefined in documentation of code (DON'T TOUCH) [28]
    ];
  }
}