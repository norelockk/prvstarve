import ConfigReader from "./ConfigReader";
import Logger from "./Logger";
import { hrtimeMs } from "./Utils";
import { LogLevel } from "./types";

// Load game config
const config: ConfigReader = new ConfigReader("./game.json");

// Calculate tick rate
const TICK_RATE: number = config.get("SERVER")?.TICKS as number;
const TICK_LENGTH_MS: number = 1000 / TICK_RATE;
const TICK_DELTA: number = TICK_LENGTH_MS / 1000;

export default class Game {
  // Logging system
  private logger: Logger = new Logger(Game.name);

  // Ticks system
  /**
   * @private DELTA
   * @type {number}
   * @memberof Game
   */
  private DELTA: number = TICK_DELTA;

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
  public static construct(): Game {
    return new Game();
  }

  constructor() {
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

    if (this.PREVIOUS_TICK + TICK_LENGTH_MS <= now) {
      this.DELTA = (now - this.PREVIOUS_TICK) / 1000;

      this.PREVIOUS_TICK = now;
      this.CURRENT_TICK++;

      this.update(this.DELTA);
    }

    if (hrtimeMs() - this.PREVIOUS_TICK < TICK_LENGTH_MS - 16) {
      setTimeout(() => this._tick());
    } else {
      setImmediate(() => this._tick());
    }
  }

  /**
   * @function update
   * @description Updates the game server
   * @param {number} DELTA
   */
  private update(DELTA: number): void {

  }
}