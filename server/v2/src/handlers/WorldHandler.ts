/**
 * @class ClientHandler
 * @description Handles the management of game world in a server application.
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Pool from "../libs/pool";
import Entity from "../entities";
import Game from "../Game";
import { DeleteUnits } from "../networking/packets/bin/Units";
import { Player } from "../entities/components/Player";
import TimeUpdate from "../networking/packets/bin/Time";
import { EntityType } from "../enums";

export default class WorldHandler {
  private game: Game;

  private daytime: number = 40 * 60 * 1000;

  public time: number = 0;
  public night: boolean = false;
  public entities: Pool<Entity> = new Pool;

  constructor(game: Game) {
    this.game = game;
  }

  update(delta: number): void {
    // update world time
    if (this.game.CURRENT_TICK % 3 === 0) {
      this.time += 10;

      if (this.time > this.daytime * 2) {
        this.time = 0;
      }

      const isNight: boolean = (this.time / this.daytime * 100) > 100;
      // console.log('isNight: ' + isNight, this.time, this.time/this.daytime * 100);

      if (this.night !== isNight) {
        this.night = isNight;
        
        const packet: TimeUpdate = new TimeUpdate(this.game);
        const players: Player[] = this.entities.array.filter(e => e instanceof Player) as Player[];

        for (const player of players)
          player.client.socket.send(packet.build, true);
      }
    }

    // update entities
    for (const entity of this.entities.array) {
      entity.update(delta);
    }
  }

  addEntity(entity: Entity): void {
    this.entities.insert(entity);
  }

  removeEntity(entity: Entity): void {
    const del: DeleteUnits = new DeleteUnits(entity);
    const players: Player[] = this.entities.array.filter(e => e instanceof Player && e !== entity) as Player[];

    for (const player of players)
      player.client.socket.send(del.build, true);

    this.entities.remove(entity);
  }
}