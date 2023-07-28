import { ServerPacket } from "../../../enums";
import { BinaryWriter } from "../../../libs/binary";

export default class Version {
  private buffer: BinaryWriter = new BinaryWriter;
  
  private readonly header: ServerPacket = ServerPacket.GAME_OLD_VERSION;
  
  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU16(this.header);

    return this.buffer.bytes;
  }
}