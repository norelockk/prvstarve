import GameServer from '../GameServer';
import Entity from './Entity';
import Client from '../network/Client';

export default class Player extends Entity {
  public client: Client;

  constructor(gameServer: GameServer, client: Client) {
    super(gameServer);

    this.client = client;
  }
  
}

//