/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import NetworkServer from "../networking/NetworkServer";
import ClientManager from "../../managers/Client";
import ConfigReader from "../../helpers/ConfigReader";
import Entities from "../../managers/Entity";
import Logger from "../../helpers/Logger";
import World from "./GameWorld";

import { hrtimeMs } from "../../Utils";
import { TICK_RATE } from "../../constants";

export default class Game {
  // Logging system
  private readonly logger: Logger = new Logger(Game.name);
  private readonly init: number = Date.now();

  // Managers
  public world!: World;
  public clients!: ClientManager;
  public network!: NetworkServer;
  public entities!: Entities;

  // Properties
  public initialized: boolean = false;

  // Ticks system
  private DELTA: number = 0;
  private TICK_LENGTH_MS: number = 0;
  private PREVIOUS_TICK: number = hrtimeMs();
  public CURRENT_TICK: number = 0;

  constructor(public config: ConfigReader) {
    // Load config into class
    this.config = config;

    // Setup world, network and entities
    this.world = new World(this);
    this.clients = new ClientManager(this);
    this.network = new NetworkServer(this);
    this.entities = new Entities(this);

    // Initialize whole game
    this.initialize();
  }

  /**
   * @function initialize
   * @description Initializes the game instance
   */
  private initialize(): void {
    if (!this.initialized) {
      // When the game got initialized
      const now: number = Date.now();

      // Initialize world
      this.world.initialize();

      // Set proper tick rate
      this.TICK_LENGTH_MS = 1000 / TICK_RATE;

      // Start ticking
      this.tick();

      // Informs the game that it is ready & be initialized rn
      this.logger.log('debug', `Ready (took ${now - this.init}ms)`);
      this.initialized = true;
    }
  }

  /**
   * @function tick
   * @description Calculates the current tick
   */
  private tick(): void {
    const now: number = hrtimeMs();

    if (this.PREVIOUS_TICK + this.TICK_LENGTH_MS <= now) {
      this.DELTA = (now - this.PREVIOUS_TICK) / 1000;

      this.PREVIOUS_TICK = now;
      this.CURRENT_TICK++;

      this.update(this.DELTA);
    }

    if (now - this.PREVIOUS_TICK < this.TICK_LENGTH_MS - 16) setTimeout(() => this.tick()); else setImmediate(() => this.tick());
  }

  /**
   * @function update
   * @description Updates the game server state based on the current tick value
   * @param {number} delta
   */
  private update(delta: number): void {
    // Update world & entities
    this.world.update(delta);
    this.entities.update(delta);

    // Send updates to network
    this.network.update();
  }
}