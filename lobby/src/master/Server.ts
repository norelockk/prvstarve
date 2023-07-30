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
  }

  update(data: ServerUpdateData): void {
    this.currentPlayers = data.playerCount;
  }

  json(type: string = 'info'): object {
    switch (type) {
      case 'info': return {
        n: this.name,
        w: 'restarve.pro',
        u: this.uuid,
        m: 'Sandbox',
        cp: this.currentPlayers,
        mp: this.maxPlayers,
        lc: false,
      }
      case 'response': return {
        h: this.address,
        p: this.port,
        t: null
      }
      default: return {};
    }
  }
}