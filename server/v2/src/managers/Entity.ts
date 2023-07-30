import Pool from "../libs/pool";
import Game from "../components/game/Game";
import Entity from "../components/Entity";
import Logger from "../helpers/Logger";

import { Player } from "../entities/Player";
import { DeleteUnits } from "../components/networking/packets/bin/Units";

export default class EntityManager {
  private readonly logger: Logger = new Logger(EntityManager.name);
  private readonly init: number = Date.now();

  public pool: Pool<Entity> = new Pool;

  constructor(private readonly game: Game) {
    const now: number = Date.now();

    this.game = game;

    this.logger.log('debug', `Ready (took ${now - this.init}ms)`);
  }

  update(delta: number): void {
    // Update entities
    for (const entity of this.pool.array) entity.update(delta);
  }
  
  addEntity(entity: Entity): void {
    this.pool.insert(entity);
  }

  removeEntity(entity: Entity): void {
    const del: DeleteUnits = new DeleteUnits(entity);
    const players: Player[] = this.pool.array.filter(e => e instanceof Player && e !== entity) as Player[];

    for (const player of players)
      player.client.socket.send(del.build, true);

    this.pool.remove(entity);
  }
}