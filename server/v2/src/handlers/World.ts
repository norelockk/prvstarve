/**
 * @class ClientHandler
 * @description Handles the management of game world in a server application.
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Pool from "../libs/pool";
import Entity from "../components/Entity";
import Game from "../components/Game";
import { Player } from "../entities/Player";
import { DeleteUnits } from "../networking/packets/bin/Units";
import TimeUpdate from "../networking/packets/bin/Time";
import GameObject from "../components/GameObject";
import { EntityType, WorldBiomes } from "../enums";

export default class WorldHandler {
  private game: Game;

  private daytime: number = 40 * 60 * 1000;

  public time: number = 0;
  public night: boolean = false;
  public biomes: any[] = [];
  public objects: GameObject[] = [];
  public entities: Pool<Entity> = new Pool;

  constructor(game: Game) {
    this.game = game;

    // Parse game objects
    this.loadObjects();
  }

  private loadObjects(): void {
    const objects: any[] = this.game.config.get('GAMEPLAY')?.MAP?.TILES;
    const oLength: number = objects.length;

    for (let index = 0; index < oLength; index++) {
      const parsed = objects[index];

      // Biome placement
      if (parsed[0] === 0) {
        let BIOME_ID = WorldBiomes.FOREST;

        switch (parsed[1]) {
          case "FOREST": {
            BIOME_ID = WorldBiomes.FOREST;
            break;
          }
          case "WINTER": {
            BIOME_ID = WorldBiomes.WINTER;
            break;
          }
          case "DESERT": {
            BIOME_ID = WorldBiomes.DESERT;
            break;
          }
          case "DRAGON": {
            BIOME_ID = WorldBiomes.DRAGON;
            break;
          }
          case "LAVA": {
            BIOME_ID = WorldBiomes.LAVA;
            break;
          }
        }

        this.biomes.push(BIOME_ID);
        continue;
      } else {
        const [ _, object, a, x, y, b ] = parsed;

        const ob: GameObject | boolean = GameObject.create(object, x, y);
        if (ob && ob instanceof GameObject) {
          const gar: Entity = new Entity(this.game);
          gar.type = EntityType.GARLAND;
          gar.position.x = ob.position.x;
          gar.position.y = ob.position.y;

          this.addEntity(gar);

          this.objects.push(ob);
        }
      }
    }
  }

  private updateWorldTime(): void {
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

        for (const player of players) player.client.socket.send(packet.build, true);
      }
    }
  }

  update(delta: number): void {
    const entities: Entity[] = this.entities.array;
    
    // Update entities
    for (const entity of entities) entity.update(delta);
    
    // Update world time
    this.updateWorldTime();
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