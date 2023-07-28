import { BinaryWriter } from "../../../libs/binary";
import { ServerPacket } from "../../../enums";
import Game from "../../../components/Game";

export default class TimeUpdate {
  private buffer: BinaryWriter = new BinaryWriter;
  
  private readonly header: ServerPacket = ServerPacket.UPDATE_TIME;

  constructor(private game: Game) {
    this.game = game;
  }

  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU8(this.header);
    this.buffer.writeU8(this.game.world.night ? 1 : 0);

    return this.buffer.bytes;
  }
}