import JsonPacket from "../JSONPacket";
import Player from "../../../entities/Player";
import { JsonPacket as JsPacket } from "../../../../shared/enums";

export default class NewPlayer implements JsonPacket {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  build(): object {
    return [
      JsPacket.NEW_PLAYER, // Packet header
      this.player.client.clientId, // Player client ID
      this.player.nickname, // Player name
      0, // Player skin (TODO)
      0, // Player accessory (TODO)
      0, // Player bag (TODO)
      0, // Player book (TODO)
      0, // Player crate (TODO)
      1, // Player deadbox (TODO)
      this.player.client.clientId // Player level (at this moment we're using it as player ID)
    ]
  }
}