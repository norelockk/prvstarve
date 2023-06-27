import GameServer from '../GameServer';
import Entity from './Entity';
import Client from '../network/Client';

export default class Player extends Entity {
  public client: Client;

  public score: number = 0;
  public nickname: string;
  public attacking: boolean = false;

  constructor(gameServer: GameServer, client: Client) {
    super(gameServer);

    this.client = client;
    this.nickname = `unnamed#${this.client.clientId}`;
  }
}