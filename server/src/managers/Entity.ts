
import { game } from "..";
import Entity from "../entities/Entity";

// import { UnitType } from "../../enums/UnitType";
// import { Server } from "../../Server";
// import { MathUtils } from "../../modules/MathUtils";
// import { Bitfield } from "../../modules/Bitfield";
// import { config } from "../../Config";
import GameServer from "../GameServer";

export class EntityManager {
  private entityIdCtr: number = 0;
  private entityIdPool: number[] = [];
  private entityIndexMap: Map<number, number> = new Map();
  
  private entities: Entity[] = [];
  private gameServer: GameServer;

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;
  }
  
  private createEntityId(): number {
    const id = (this.entityIdPool.length !== 0 ? this.entityIdPool.pop() : this.entityIdCtr++) as number;

    return id;
  }

  private disposeEntityId(entityId: number): void {
    this.entityIdPool.push(entityId);
  }

  // private startUpdate() {
  //   setInterval(() => {
  //     for (const entity of this.entities) {
  //       // entity.update();
  //       // entity.boundCollision(this.server.pattern);
  //     }
  //   }, 1000 / config.tps);
  // }

  public update(delta: number): void {
    for (let index = 0; index < this.entities.length; index++) {
      const entity = this.entities[index];
        

      if (entity) {
        entity.update(delta);
      }
    }
  }

  public createEntity(): void {
    // const entity = new Entity(
    //   entityObj.id ?? 0,
    //   entityObj.type ?? UnitType.PLAYERS,
    //   entityObj.x ?? 4800,
    //   entityObj.y ?? 5000,
    //   entityObj.angle ?? 0,
    //   entityObj.radius ?? 0,
    //   entityObj.extra ?? 0,
    //   entityObj.info ?? 0,
    //   entityObj.health ?? 0,
    //   entityObj.speed ?? 0,
    //   entityObj.max_speed ?? 0,
    //   entityObj.action ?? new Bitfield(64)
    // );
    // this.addEntity(entity);
    // return entity;

    const entity: Entity = new Entity(game);

    if (entity) {
      const entityId: number = this.createEntityId();

      this.entityIndexMap.set(entityId, this.entities.length);
      this.entities.push(entity);
    }
  }

  public destroyEntity(en): void {

  }

  public entitiesInDistance(target: Entity, distance: number): Entity[] {
    return this.entities.filter((entity) => MathUtils.getDistance(target, entity) < distance);
  }
}