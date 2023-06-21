import BinaryPacket from "../BinaryPacket";
import { BinaryWriter } from "../../../../../shared/libs/binary";
import { BinaryPacket as BinPacket } from "../../../../../shared/enums";
import Player from "../../../entities/Player";

export default class Leaderboard implements BinaryPacket {
  private binaryWriter: BinaryWriter = new BinaryWriter();
  private players: Player[];

  constructor(players: Player[]) {
    this.players = players;
  }

  build(): Uint8Array {
    this.binaryWriter.reset();
    
    this.binaryWriter.writeU16(BinPacket.LEADERBOARD);
    this.binaryWriter.writeU16(0);

    const sortedPlayers: Player[] = this.players.sort((a, b) => a.score - b.score);
    
    for (let index = 0; index < 10; index++) {
      const player = sortedPlayers[index];

      if (player) {
        this.binaryWriter.writeU16(player.client.clientId);
        this.binaryWriter.writeU16(player.score);
      }
    }

    return this.binaryWriter.bytes();
  }
}