import { BinaryWriter } from "../../../libs/binary";
import { ServerPacket } from "../../../enums";
import { convertBoolToNumber } from "../../../Utils";

export default class TimeUpdate {
  private readonly buffer: BinaryWriter = new BinaryWriter;
  private readonly header: ServerPacket = ServerPacket.UPDATE_TIME;

  constructor(private state: boolean = false) {
    this.state = state;
  }

  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU8(this.header);
    this.buffer.writeU8(convertBoolToNumber(this.state));

    return this.buffer.bytes;
  }
}