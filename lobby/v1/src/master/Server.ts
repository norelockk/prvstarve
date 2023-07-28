import crypto from 'crypto';
import { ServerCreateData, ServerUpdateData } from "../interfaces";

export default class Server {
  public uuid: string = crypto.randomUUID();
  public name: string = 'Unknown server';
  public created: number = Date.now();
  public updated: number = Date.now();
  public currentPlayers: number = 0;
  public maxPlayers: number = 100;

  private port: number = 8080;
  private address: string = 'localhost';

  constructor(data: ServerCreateData) {
    this.name = data.name;
    this.port = data.port;
    this.address = data.address;
    this.currentPlayers = data.currentPlayers;
    this.maxPlayers = data.maxPlayers;

    console.log('server created', this.uuid, data);
  }

  update(data: ServerUpdateData): void {
    this.currentPlayers = data.playerCount;
  }

  get json(): object {
    return {
      a: this.name,
      i: this.address,
      p: this.port,
      m: this.maxPlayers,
      nu: this.currentPlayers,
      ssl: 0
    }
  }
}