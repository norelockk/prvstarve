import { game } from "..";
import { WebSocket } from "ws";

import Client from "../network/Client";
import { DeleteUnit } from "../network/packets/bin/Units";

export default class ClientManager {
  private clientIdCtr: number = 1;
  private clientIdPool: number[] = [];
  private clientIndexMap: Map<number, number> = new Map();

  public clients: Client[] = [];

  private findClientBySocket(socket: WebSocket) {
    return this.clients.find(c => !!c && c.socket === socket as WebSocket) as Client;
  }

  private createClientId(): number {
    const id = (this.clientIdPool.length !== 0 ? this.clientIdPool.pop() : this.clientIdCtr++) as number;

    return id;
  }

  private disposeClientId(clientId: number): void {
    this.clientIdPool.push(clientId);
  }

  public createClient(socket: WebSocket): void {
    let client: Client = this.findClientBySocket(socket);

    if (!client) {
      const clientId: number = this.createClientId();
      client = new Client(clientId, game, socket);

      this.clientIndexMap.set(clientId, this.clients.length);
      this.clients.push(client);
    }
  }

  public destroyClient(c: Client) {
    const client: Client = this.findClientBySocket(c.socket);

    if (client) {
      if (client.entity) {
        // do not leave entity in game
        const pck: DeleteUnit = new DeleteUnit(client.entity);

        if (pck) {
          for (let index: number = 0; index < this.clients.length; index++) {
            const client: Client = this.clients[index];

            if (client) {
              client.sendBinary(pck.build());
            }
          }
        }

        game.world.removeEntity(client.entity);
      }

      const cid: number = client.clientId as number;
      const index: number = this.clientIndexMap.get(client.clientId) as number;

      if (index !== this.clients.length) {
        const temp = this.clients[this.clients.length - 1];

        this.clients[this.clients.length - 1] = client;
        this.clients[index] = temp;
        this.clientIndexMap.set(temp.clientId, index);
      }

      this.clients.pop();
      this.disposeClientId(cid);
    }
  }

  public update(delta: number): void {
    for (let index = 0; index < this.clients.length; index++) {
      const client = this.clients[index];

      if (client) {
        client.update(delta);
      }
    }
  }

  get json(): object {
    const output = [];

    for (let index = 0; index < this.clients.length; index++) {
      const client = this.clients[index];

      if (client && client.entity) {
        output.push({
          i: client.clientId,
          n: client.entity.nickname,
          s: 0,
          a: 0,
          c: 0,
          b: 0,
          d: 1,
          l: client.clientId,
          p: 0
        })
      }
    }

    return output;
  }
}