import GameServer from "../../../GameServer";
import BinaryPacket from "../BinaryPacket";
import { BufferWriter } from "../../../../../shared/libs/binary";
import { BinaryPacket as BinPacket } from "../../../../../shared/enums";
import Entity from "../../../entities/Entity";

export default class UpdateUnits implements BinaryPacket {
  private gameServer: GameServer;
  private binaryWriter: BufferWriter = new BufferWriter;
  private entities: Entity[];

  constructor(gameServer: GameServer, entities: Entity[]) {
    this.gameServer = gameServer;
    this.entities = entities;
  }

  build(): Uint8Array {
    this.binaryWriter.writeU8(BinPacket.UPDATE_UNITS);

    for (let index = 0; index < this.entities.length; index++) {
      const entity = this.entities[index];

      if (entity) {
        // this.binaryWriter.writeU8(entity.)

        // i need to write entity manager because i have no idea how to make
        // entity id proper system so
        // i mean we can always skip and make it for this moment
        // from the clients manager, because there is already implemented
        // id pool system
      }
    }

    return this.binaryWriter.bytes as Uint8Array;
  }
}

// entity.id = u8?,
// Math.floor((((entity.angle + MathHelper.pi2) % MathHelper.pi2) * 255) / MathHelper.pi2) = u16?,
// entity.action % 256,
// entity.action >> 8,
// entity.type % 256,
// entity.type >> 8,
// entity.x % 256,
// entity.x >> 8,
// entity.y % 256,
// entity.y >> 8,
// entity.info % 256,
// entity.info >> 8,
// entity.speed % 256,
// entity.speed >> 8,
// entity.extra % 256,
// entity.extra >> 8,