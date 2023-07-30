import { BinaryWriter } from "../../../../libs/binary";
import { Player } from "../../../../entities/Player";
import { ServerPacket } from "../../../../enums";

export default class Leaderboard {
  private buffer: BinaryWriter = new BinaryWriter;
  
  private readonly header: ServerPacket = ServerPacket.LEADERBOARD;
  
  constructor(private players: Player[]) {
    this.players = players;

    // Sort by score
    this.players.sort((a, b) => a.score - b.score);
  }

  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU16(this.header);
    this.buffer.writeU16(0);

    const len: number = this.players.length;
    for (let index = 0; index < len; index++) {
      const player: Player = this.players[index];

      if (player) {
        this.buffer.writeU16(player.client.id);
        this.buffer.writeU16(player.score);
      }
    }

    return this.buffer.bytes;
  }
}