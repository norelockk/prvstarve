import GameServer from "../../../GameServer";
import BinaryPacket from "../BinaryPacket";
import { BinaryWriter } from "../../../../../shared/libs/binary";
import { BinaryPacket as BinPacket } from "../../../../../shared/enums";
import Entity from "../../../entities/Entity";
import Player from "../../../entities/Player";

export class UpdateUnits implements BinaryPacket {
  private gameServer: GameServer;
  private binaryWriter: BinaryWriter = new BinaryWriter;
  private entities: Entity[];

  constructor(gameServer: GameServer, entities: Entity[]) {
    this.gameServer = gameServer;
    this.entities = entities;
  }

  build(): Uint8Array {
    this.binaryWriter.reset();
    this.binaryWriter.writeU16(BinPacket.UPDATE_UNITS);

    for (let index = 0; index < this.entities.length; index++) {
      const entity = this.entities[index];

      if (entity) {
        const id: number = entity instanceof Player && !!entity.client ? entity.client.clientId : entity.id;

        this.binaryWriter.writeU8(id);
        this.binaryWriter.writeU8(entity.angle);
        this.binaryWriter.writeU16(entity.action);
        this.binaryWriter.writeU16(entity.type);
        this.binaryWriter.writeU16(entity.position.x);
        this.binaryWriter.writeU16(entity.position.y);
        this.binaryWriter.writeU16(0); // id thing, unknown
        this.binaryWriter.writeU16(entity.info);
        this.binaryWriter.writeU16(entity.speed);
        this.binaryWriter.writeU16(entity.extra);
      }
    }

    return this.binaryWriter.bytes();
  }
}

export class DeleteUnit implements BinaryPacket {
  private binaryWriter: BinaryWriter = new BinaryWriter;
  private entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  build(): Uint8Array {
    this.binaryWriter.reset();
    this.binaryWriter.writeU16(BinPacket.UPDATE_UNITS);

    const id: number = this.entity instanceof Player && !!this.entity.client ? this.entity.client.clientId : this.entity.id;

    this.binaryWriter.writeU8(id);
    this.binaryWriter.writeU8(0);
    this.binaryWriter.writeU16(1);
    this.binaryWriter.writeU16(0);
    this.binaryWriter.writeU16(0);
    this.binaryWriter.writeU16(0);
    this.binaryWriter.writeU16(0); // id thing, unknown
    this.binaryWriter.writeU16(0);
    this.binaryWriter.writeU16(0);
    this.binaryWriter.writeU16(0);

    return this.binaryWriter.bytes();
  }
}