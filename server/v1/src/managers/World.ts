import GameServer from "../GameServer";
import PoolManager from "../../shared/libs/pool";
import Entity from "../entities/Entity";
import { collision } from "../Utils";
import { EntityState } from "../../shared/enums";

export default class World {
  private gameServer: GameServer;
  public entities: PoolManager<Entity> = new PoolManager();

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;
  }

  update(delta: number): void {
    for (const entity of this.entities.array) {
      entity.update(delta);
    }
  }

  addEntity(entity: Entity): void {
    this.entities.insert(entity);
  }

  removeEntity(entity: Entity): void {
    this.entities.remove(entity);
  }
}