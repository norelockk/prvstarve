const DEBUG = false;

const assert = (condition: boolean, err: string) => {
  if (!condition) throw err;
};

export class BufferWriter {
  byteView: Uint8Array;
  arrayBuffer: ArrayBuffer;
  offset: number = 0;

  static F32Array = new Float32Array;
  static U8Array = new Uint8Array(BufferWriter.F32Array.buffer);

  constructor(bufferSize: number = 1024) {
    this.arrayBuffer = new ArrayBuffer(bufferSize);
    this.byteView = new Uint8Array(this.arrayBuffer);
  }

  get maxSize(): number {
    return this.arrayBuffer.byteLength;
  }

  writeU8(u8: number) {
    if (DEBUG) assert(
      (Number.isInteger(u8) && (u8 >= 0 && u8 <= (1 << 16) - 1)),
      `invalid u8 provided: ${u8}`
    );

    if (DEBUG) assert(this.offset + 1 < this.maxSize, `Writing u8 out of bounds ab[${this.offset}]`)

    this.byteView[this.offset++] = u8;
  }

  writeU16(u16: number) {
    if (DEBUG) assert(
      (Number.isInteger(u16) && (u16 >= 0 && u16 <= (1 << 16) - 1)),
      `invalid u16 provided: ${u16}`
    );

    if (DEBUG) assert(this.offset + 2 < this.maxSize, `Writing u16 out of bounds ab[${this.offset}]`)

    this.byteView[this.offset++] = (u16 & 0xff);
    this.byteView[this.offset++] = ((u16 >> 8) & 0xff);
  }

  writeString(str: string) {
    const len = str.length;
    this.writeU8(len);
    for (let i = 0; i < len; i++) this.writeU8(str.charCodeAt(i));
  }

  get bytes(): ArrayBuffer {
    const copy = new Uint8Array(this.arrayBuffer, 0, this.offset).slice();
    return copy.buffer;
  }
};

export class BufferReader {
  offset: number = 0;
  bytes: Uint8Array = new Uint8Array();

  get size(): number {
    return this.bytes.length;
  }

  readFrom(data: ArrayBuffer) {
    // maybe create a new copy of the arraybuffer to be safe?
    this.bytes = new Uint8Array(data);
    this.offset = 0;
  }

  readU8(): number {
    return this.bytes[this.offset++];
  }

  readU16(): number {
    return this.bytes[this.offset++] | (this.bytes[this.offset++] << 8);
  }

  // TODO, add support for utf16
  readShortStr(): string {
    let str = '';
    const len = this.readU8();
    for (let i = 0; i < len; i++) str += String.fromCharCode(this.readU8());
    return str;
  }
};