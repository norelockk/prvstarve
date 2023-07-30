import { Player } from "../../../entities/Player";
import { ClientPacket } from "../../../enums";

export default class NewPlayer {
  constructor(private player: Player) {
    this.player = player;
  }

  get build(): object {
    return [
      ClientPacket.NEW_PLAYER,
      this.player.client.id,
      this.player.nickname,
      this.player.skin.skin,
      this.player.skin.accessory,
      this.player.skin.bag,
      this.player.skin.book,
      this.player.skin.lootBox,
      this.player.skin.deadBox,
      this.player.client.id, // level here
    ]
  }
}