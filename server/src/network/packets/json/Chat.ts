import JsonPacket from "../JSONPacket";
import Player from "../../../entities/Player";
import { JsonPacket as JsPacket } from "../../../../../shared/enums";

export default class Chat implements JsonPacket {
  private player: Player;
  private message: string;

  constructor(player: Player, message: string) {
    this.player = player;
    this.message = message;
  }

  build(): object {
    return [
      JsPacket.PLAYER_CHAT, // Packet header
      this.player.client.clientId, // Player client ID that message was sent from
      this.message // Message
    ]
  }
}