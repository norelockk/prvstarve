import { BinaryWriter } from "../../../libs/binary";
import { Player } from "../../../entities/components/Player";
import { ServerPacket } from "../../../enums";

export default class Leaderboard {
  private buffer: BinaryWriter = new BinaryWriter;

  constructor(private players: Player[]) {
    this.players = players;

    // Sort by score
    this.players.sort((a, b) => a.score - b.score);
  }

  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU16(ServerPacket.LEADERBOARD);
    this.buffer.writeU16(0);

    for (let index = 0; index < 11; index++) {
      const player: Player = this.players[index];

      if (player) {
        this.buffer.writeU16(player.client.id);
        this.buffer.writeU16(player.score);
      }
    }

    return this.buffer.bytes;
  }
}