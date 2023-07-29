/**
 * @class ClientHandler
 * @description Handles the management of game world in a server
 * @license private
 * @date 4 July 2023
 * @copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Matter from "matter-js";

import Game from "../components/game/Game";
import Bounds from "../components/col/Bounds";
import Logger from "../helpers/Logger";
import Vector2 from "../libs/vector";
import GameBiome from "../components/game/GameBiome";
import GameObject from "../components/game/GameObject";
import TimeUpdate from "../networking/packets/bin/Time";

import { Player } from "../entities/Player";
import { GameMap } from "../interfaces";
import { DAY_TIME } from "../constants";
import { WorldBiomes } from "../enums";

export default class World implements GameMap {
  private readonly logger: Logger = new Logger(World.name);

  // World time
  public time: number = 0;
  public night: boolean = false;

  // Map data
  public seed: number = 0;
  public tiles: any[] = [];
  public islands: number = 6;

  // Map world
  public bounds: Bounds = new Bounds(new Vector2(0, 0), new Vector2(0, 0));
  public biomes: GameBiome[] = [];
  public objects: GameObject[] = [];
  public spawnBiomes: GameBiome[] = [];
  public fallbackBiome: GameBiome = new GameBiome(WorldBiomes.SEA);

  // Map engine
  private engine!: Matter.Engine;

  constructor(private readonly game: Game) {
    this.game = game;

    // Initialize loading map tiles
    this.initialize();
  }

  private initialize(): void {
    // Initialize world engine
    this.engine = Matter.Engine.create();

    // Set to engine no any gravities
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;

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
      const [TILE_TYPE, ...TILE_DATA] = TILE;

      // Can tile be pushed so it can be shown on game
      let canPush: boolean = false;

      switch (TILE_TYPE) {
        // Parsing biome
        case 0: {
          let biome: GameBiome | boolean = false;

          // Parse biome tile data
          const [BIOME_TYPE, START_X, START_Y, MAX_W, MAX_H] = TILE_DATA;

          // Setup biome bounds
          const bounds: Bounds = new Bounds(
            new Vector2(START_X * 100, START_Y * 100),
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

            canPush = true;
          }

          break;
        }

        // Parsing map tile (object)
        case 1: {
          let object: GameObject | boolean = false;

          // Parse map tile data
          const [OBJECT_NAME, OBJECT_RADIUS, OBJECT_X, OBJECT_Y] = TILE_DATA;

          // Push object
          if (object && object instanceof GameObject) {
            this.logger.log('debug', `Object ${OBJECT_NAME} has been applied`);
            this.objects.push(object);

            canPush = true;
          }

          break;
        }

        // Unknown world tile report
        default: {
          this.logger.log('warn', `Unknown world tile`, TILE);
          break;
        }
      }

      if (canPush) this.tiles.push(TILE);
    }

    // Set fallback biome
    this.fallbackBiome = this.biomes.find(b => b.biomeType === WorldBiomes.SEA)!;

    // Set biomes where we can spawn
    this.spawnBiomes = this.biomes.filter(b => b.biomeType === WorldBiomes.FOREST);
  }

  update(delta: number): void {
    // Update world time
    if (this.game.CURRENT_TICK % 45 === 0) {
      this.time += ~~(DAY_TIME / 50);
      if (this.time >= DAY_TIME * 2) this.time = 0;

      const night: boolean = this.time / DAY_TIME >= 1;
      if (this.night !== night) {
        const packet: TimeUpdate = new TimeUpdate(night);
        const players: Player[] = this.game.entities.pool.array.filter(e => e instanceof Player) as Player[];
        
        for (const player of players)
          player.client.socket.send(packet.build, true);

        this.night = night;
      }
    }
  }
}