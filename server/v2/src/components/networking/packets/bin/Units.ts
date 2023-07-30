import { BinaryWriter } from "../../../../libs/binary";
import Entity from "../../../../components/Entity";
import { EntityState, ServerPacket } from "../../../../enums";
import { Player } from "../../../../entities/Player";

export class UpdateUnits {
  private buffer: BinaryWriter = new BinaryWriter();

  private readonly header: ServerPacket = ServerPacket.UPDATE_UNITS;

  constructor(private entities: Entity[]) {
    this.entities = entities;
  }

  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU16(this.header);

    const entityLength: number = this.entities.length;

    for (let index = 0; index < entityLength; index++) {
      const entity: Entity = this.entities[index];

      if (entity) {
        const entityId: number = entity instanceof Player ? entity.client.id : entity.id;

        this.buffer.writeU8(entityId);
        this.buffer.writeU8(entity.angle);
        this.buffer.writeU16(entity.state);
        this.buffer.writeU16(entity.type);
        this.buffer.writeU16(entity.position.x);
        this.buffer.writeU16(entity.position.y);
        this.buffer.writeU16(0); // info idk
        this.buffer.writeU16(entity.info);
        this.buffer.writeU16(entity.speed);
        this.buffer.writeU16(entity.extra);
      }
    }

    return this.buffer.bytes;
  }
}

export class DeleteUnits {
  private buffer: BinaryWriter = new BinaryWriter();

  private readonly header: ServerPacket = ServerPacket.UPDATE_UNITS;

  constructor(private entities: Entity | Entity[]) {
    this.entities = entities;
  }

  get build(): Uint8Array {
    this.buffer.reset();
    this.buffer.writeU16(this.header);

    if (Array.isArray(this.entities)) {
      const entityLength: number = this.entities.length;

      for (let index = 0; index < entityLength; index++) {
        const entity: Entity = this.entities[index];

        if (entity) {
          const entityId: number = entity instanceof Player ? entity.client.id : entity.id;

          this.buffer.writeU8(entityId);
          this.buffer.writeU8(0);
          this.buffer.writeU16(EntityState.DELETE);
          this.buffer.writeU16(0);
          this.buffer.writeU16(0);
          this.buffer.writeU16(0);
          this.buffer.writeU16(0); // info idk
          this.buffer.writeU16(0);
          this.buffer.writeU16(0);
          this.buffer.writeU16(0);
        }
      }
    } else {
      const entity: Entity = this.entities;
      const entityId: number = entity instanceof Player ? entity.client.id : entity.id;

      this.buffer.writeU8(entityId);
      this.buffer.writeU8(0);
      this.buffer.writeU16(EntityState.DELETE);
      this.buffer.writeU16(0);
      this.buffer.writeU16(0);
      this.buffer.writeU16(0);
      this.buffer.writeU16(0); // info idk
      this.buffer.writeU16(0);
      this.buffer.writeU16(0);
      this.buffer.writeU16(0);
    }

    return this.buffer.bytes;
  }
}