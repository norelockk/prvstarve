import Entity from './Entity';
import Client from '../network/Client';
import GameServer from '../GameServer';
import { EntityState } from '../../shared/enums';
import { collision } from '../Utils';

export default class Player extends Entity {
  public client: Client;
  private _gameServer: GameServer;

  public score: number = 0;
  public nickname: string;

  public attacking: boolean = false;

  private attackElapsed: number = 0;
  private attackDuration: number = 0.10;

  constructor(gameServer: GameServer, client: Client) {
    super(gameServer);

    this.client = client;
    this._gameServer = gameServer;

    this.nickname = `unnamed#${this.client.clientId}`;
  }

  public update(delta: number): void {
    super.update(delta);

    if (this.attacking) {
      this.attackElapsed += delta;

      if (this.attackElapsed >= this.attackDuration) {
        this.updateAction(EntityState.ATTACK);
        this.stopAttack();
      }
    }
  }

  public attack(): void {
    this.attacking = true;

    for (const client of this._gameServer.clients.clients) {
      if (client.clientId !== this.client.clientId) {
        if (client.entity) {
          const c: boolean = collision(
            client.entity.position.x, client.entity.position.y, 50,
            this.position.x, this.position.y, 50
          );

          if (c) {
            console.log('attacked', client.clientId);

            client.entity.updateAction(EntityState.HURT);
          }
        }
      }
    }
  }

  public stopAttack(): void {
    this.attacking = false;
    this.attackElapsed = 0;
  }
}