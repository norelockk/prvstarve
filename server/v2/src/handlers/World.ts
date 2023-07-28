/**
 * @class ClientHandler
 * @description Handles the management of game world in a server
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Pool from "../libs/pool";
import Game from "../components/game/Game";
import Entity from "../components/Entity";
import Bounds from "../components/col/Bounds";
import Logger from "../helpers/Logger";
import Vector2 from "../libs/vector";
import GameBiome from "../components/game/GameBiome";
import TimeUpdate from "../networking/packets/bin/Time";
import GameObject from "../components/game/GameObject";

import { Player } from "../entities/Player";
import { GameMap } from "../interfaces";
import { DeleteUnits } from "../networking/packets/bin/Units";
import { WorldBiomes } from "../enums";

export default class World implements GameMap {
  private readonly logger: Logger = new Logger(World.name);

  // World time
  public time: number = 0;
  public night: boolean = false;
  private readonly daytime: number = 40 * 60 * 1000;

  // Entity
  public entities: Pool<Entity> = new Pool;

  // Map data
  public seed: number = 0;
  public islands: number = 6;
  public tiles: any[] = [];

  // Map things
  public bounds: Bounds = new Bounds(new Vector2(0, 0), new Vector2(0, 0));
  public biomes: GameBiome[] = [];
  public objects: GameObject[] = [];
  public spawnBiomes: GameBiome[] = [];
  public fallbackBiome: GameBiome = new GameBiome(WorldBiomes.SEA);

  constructor(private readonly game: Game) {
    this.game = game;

    // Initialize loading map tiles
    this.initialize();
  }

  private initialize(): void {
    // Load world bounds
    const bW: number = this.game.config.get('GAMEPLAY')?.MAP?.WIDTH * 100;
    const bH: number = this.game.config.get('GAMEPLAY')?.MAP?.HEIGHT * 100;

    this.bounds = new Bounds(
      new Vector2(0, 0),
      new Vector2(bW, bH)
    );

    this.logger.log('debug', `Bounds has been applied (start: ${this.bounds.min}, end: ${this.bounds.max})`);

    // Load world tiles
    const MAP_TILES = this.game.config.get('GAMEPLAY')?.MAP?.TILES;

    for (const TILE of MAP_TILES) {
      // Parse tile data
      const [ TILE_TYPE, ...TILE_DATA ] = TILE;

      switch (TILE_TYPE) {
        // Parsing biome
        case 0: {
          let biome: GameBiome | boolean = false;
        
          // Parse biome tile data
          const [ BIOME_TYPE, MIN_W, MIN_H, MAX_W, MAX_H ] = TILE_DATA;

          // Setup biome bounds
          const bounds: Bounds = new Bounds(
            new Vector2(MIN_W * 100, MIN_H * 100),
            new Vector2(MAX_W * 100, MAX_H * 100)
          );
  
          // Parse biome type
          switch (BIOME_TYPE) {
            case "FOREST": {
              biome = new GameBiome(WorldBiomes.FOREST, bounds);
              break;
            }
            default: return this.logger.log('warn', 'Unknown biome type', BIOME_TYPE);
          }
  
          // Push biome
          if (biome && biome instanceof GameBiome) {
            this.logger.log('debug', `Biome ${BIOME_TYPE} has been applied (start: ${bounds.min}, end: ${bounds.max})`);
            this.biomes.push(biome);
          }

          break;
        }

        // Parsing map tile (object)
        case 1: {
          let object: GameObject | boolean = false;

          // Parse map tile data
          const [ OBJECT_NAME, OBJECT_RADIUS, OBJECT_X, OBJECT_Y ] = TILE_DATA;


          // Push object
          if (object && object instanceof GameObject) {
            this.logger.log('debug', `Object ${OBJECT_NAME} has been applied`);
            this.objects.push(object);
          }

          break;
        }

        // Unknown world tile report
        default: {
          this.logger.log('warn', `Unknown world tile`, TILE);
          break;
        }
      }

      this.tiles.push(TILE);
    }

    // Set fallback biome
    this.fallbackBiome = this.biomes.find(b => b.biomeType === WorldBiomes.SEA)!;

    // Set biomes where we can spawn
    this.spawnBiomes = this.biomes.filter(b => b.biomeType === WorldBiomes.FOREST);
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