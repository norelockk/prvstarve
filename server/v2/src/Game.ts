import ConfigReader from "./ConfigReader";
import Logger from "./Logger";
import { hrtimeMs } from "./Utils";

export default class Game {
  // Logging system
  private logger: Logger = new Logger(Game.name);

  // Configuration
  private config: ConfigReader;

  // Ticks system
  /**
   * @private DELTA
   * @type {number}
   * @memberof Game
   */
  private DELTA: number = 0;

  /**
   * @private TICK_RATE
   * @type {number}
   * @memberof Game
   */
  private TICK_RATE: number = 0;

  /**
   * @private TICK_DELTA
   * @type {number}
   * @memberof Game
   */
  private TICK_DELTA: number = 0;

  /**
   * @private TICK_LENGTH_MS
   * @type {number}
   * @memberof Game
   */
  private TICK_LENGTH_MS: number = 0;

  /**
   * @public CURRENT_TICK
   * @type {number}
   * @memberof Game
   * @description Current ticks
   */
  public CURRENT_TICK: number = 0;

  /**
   * @private PREVIOUS_TICK
   * @type {number}
   * @memberof Game
   */
  private PREVIOUS_TICK: number = hrtimeMs();

  // Static methods
  /**
   * @static construct
   * @type {Game}
   * @memberof Game
   * @description Creating new game instance faster
   */
  public static construct(config: ConfigReader): Game {
    return new Game(config);
  }

  constructor(config: ConfigReader) {
    // Load config into class
    this.config = config;

    // Set proper tick rate
    this.TICK_RATE = this.config.get('SERVER')?.TICKS ?? 10;
    this.TICK_LENGTH_MS = 1000 / this.TICK_RATE;
    this.TICK_DELTA = this.TICK_LENGTH_MS / 1000;

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

  }
}