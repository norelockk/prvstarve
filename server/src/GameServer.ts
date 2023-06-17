import { hrtimeMs } from './Utils';
import { TICK_DELTA, TICK_LENGTH_MS } from '../../shared/const';

import Logger from './Logger';
import Entity from './entities/Entity';
import ClientManager from './managers/Client';
import LeaderboardManager from './managers/Leaderboard';

export default class GameServer {
  private logger: Logger = new Logger('GameServer');

  private delta: number = TICK_DELTA;
  private currentTick: number = 0;
  private previousTick: number = hrtimeMs();

  public clients: ClientManager = new ClientManager();
  private leaderboard: LeaderboardManager = new LeaderboardManager(this);

  public entities: Entity[] = [];

  public static construct(): GameServer {
    return new GameServer();
  }

  constructor() { this.init(); }

  private init(): void {
    // inititate the tick calculating
    this.tick();
    this.logger.log('debug', 'Game server initialized');
  }

  private tick(): void {
    const now: number = hrtimeMs();

    if (this.previousTick + TICK_LENGTH_MS <= now) {
      this.delta = (now - this.previousTick) / 1000;
      
      this.previousTick = now;
      this.currentTick++;
      this.update(this.delta);
    }

    if (hrtimeMs() - this.previousTick < TICK_LENGTH_MS - 16) {
      setTimeout(() => this.tick());
    } else {
      setImmediate(() => this.tick());
    }
  }

  private update(delta: number): void {
    const updateLeaderboard: boolean = this.currentTick % 35 === 0;

    if (updateLeaderboard) {
      // console.log('leaderboard', ~~(Math.random() * 100));
    }

    this.clients.update(delta);
  }
}