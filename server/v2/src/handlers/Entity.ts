import E from "../components/Entity";
import Pool from "../libs/pool";
import Game from "../components/game/Game";
import Logger from "../helpers/Logger";

import { Player } from "../entities/Player";
import { DeleteUnits } from "../networking/packets/bin/Units";

export default class Entity {
  private readonly logger: Logger = new Logger(Entity.name);

  public pool: Pool<E> = new Pool;

  constructor(private readonly game: Game) {
    this.game = game;
  }

  update(delta: number): void {
    // Update entities
    for (const entity of this.pool.array) entity.update(delta);
  }
  
  addEntity(entity: E): void {
    this.pool.insert(entity);
  }

  removeEntity(entity: E): void {
    const del: DeleteUnits = new DeleteUnits(entity);
    const players: Player[] = this.pool.array.filter(e => e instanceof Player && e !== entity) as Player[];

    for (const player of players)
      player.client.socket.send(del.build, true);

    this.pool.remove(entity);
  }
}