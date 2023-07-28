/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import ConfigReader from "../../helpers/ConfigReader";
import Logger from "../../helpers/Logger";
import World from "../../handlers/World";
import { hrtimeMs } from "../../Utils";
import { network } from "../..";

export default class Game {
  // Logging system
  private readonly logger: Logger = new Logger(Game.name);

  // World
  public world!: World;

  // Configuration
  public config!: ConfigReader;

  // Ticks system
  private DELTA: number = 0;
  private TICK_RATE: number = 0;
  private TICK_LENGTH_MS: number = 0;
  private PREVIOUS_TICK: number = hrtimeMs();
  public CURRENT_TICK: number = 0;

  public static construct(config: ConfigReader): Game {
    return new Game(config);
  }

  constructor(config: ConfigReader) {
    // Load config into class
    this.config = config;

    // Setup world
    this.world = new World(this);
  }

  /**
   * @function initialize
   * @description Initializes the game instance
   */
  public initialize(): void {
    // Set proper tick rate
    this.TICK_RATE = this.config.get('SERVER')?.TICKS ?? 10;
    this.TICK_LENGTH_MS = 1000 / this.TICK_RATE;

    // Start ticking
    this._tick();

    // Informs the game that it is ready
    this.logger.log('info', "Game ready");
  }

  /**
   * @function tick
   * @description Calculates the current tick
   */
  private _tick(): void {
    const now: number = hrtimeMs();

    if (this.PREVIOUS_TICK + this.TICK_LENGTH_MS <= now) {
      this.DELTA = (now - this.PREVIOUS_TICK) / 1000;

      this.PREVIOUS_TICK = now;
      this.CURRENT_TICK++;

      this.update(this.DELTA);
    }

    if (hrtimeMs() - this.PREVIOUS_TICK < this.TICK_LENGTH_MS - 16)
      setTimeout(() => this._tick());
    else
      setImmediate(() => this._tick());
  }

  /**
   * @function update
   * @description Updates the game server state based on the current tick value
   * @param {number} delta
   */
  private update(delta: number): void {
    // Update world
    this.world.update(delta);

    // Send updates to network
    if (network) network.update();
  }
}