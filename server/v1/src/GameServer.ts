import { hrtimeMs } from './Utils';
import { TICK_DELTA, TICK_LENGTH_MS } from '../shared/const';
import { UpdateUnits } from './network/packets/bin/Units';

import World from './managers/World';
import Logger from './Logger';
import Entity from './entities/Entity';
import Client from './network/Client';
import Player from './entities/Player';
import Leaderboard from './network/packets/bin/Leaderboard';
import LobbyManager from './managers/Lobby';
import ClientManager from './managers/Client';
import { EntityState } from '../shared/enums';

export default class GameServer {
  // private lobby: LobbyManager = new LobbyManager(this);
  private logger: Logger = new Logger('GameServer');

  private delta: number = TICK_DELTA;
  private currentTick: number = 0;
  private previousTick: number = hrtimeMs();

  public world: World = new World(this);
  public clients: ClientManager = new ClientManager();

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
    // updating leaderboard
    if (this.currentTick % 35 === 0) {
      const players: Player[] = this.clients.clients.map(c => c.entity as Player);
      const ldb: Leaderboard = new Leaderboard(players);

      for (let index = 0; index < this.clients.clients.length; index++) {
        const client: Client = this.clients.clients[index];

        if (client) client.sendBinary(ldb.build());
      }
    }

    // updating entities & players
    this.world.update(delta);
    this.clients.update(delta);

    // rendering the entities
    this.render();
  }

  // temporary solution to render
  private render(): void {
    if (this.clients.clients.length === 0)
      return;

    const entities: Entity[] = this.world.entities.array;
    const pck: UpdateUnits = new UpdateUnits(this, entities);

    for (let index = 0; index < this.clients.clients.length; index++) {
      const client: Client = this.clients.clients[index];

      client.sendBinary(pck.build());
    }

    for(let i = 0; i < this.clients.clients.length; i++) {
      const nonPossibleScriptToMake: Client = this.clients.clients[i];

      if(nonPossibleScriptToMake && nonPossibleScriptToMake.entity) {
        nonPossibleScriptToMake.entity.createActionUpdate();
      }
    }
  }
}