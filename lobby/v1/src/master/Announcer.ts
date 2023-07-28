import Logger from '../libs/logger';
import { WebSocket } from "ws";
import Server from "./Server";
import { master } from "..";
import { ServerUpdateData } from "../interfaces";

const currentToken: string = process.env.ANNOUNCER_TOKEN as string ?? 'development';

export default class Announcer {
  public verified: boolean = false;
  public socket: WebSocket;
  private servers: Server[] = [];

  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  onSocketMessage(message: any): void {
    message = message.toString();

    if (typeof message === 'string') {
      let json: any = [];

      try {
        json = JSON.parse(message);
      } catch (e) {
        // TODO: handle parsing errors
      } finally {
        if (typeof json[0] !== 'number') return;
        
        switch (json[0]) {
          // verification
          case 0: {
            const token: string | undefined = typeof json[1] === 'string' ? json[1] : undefined;

            this.verify(token as string);
            break;
          }
          // announcing (creating) server to master
          case 1: {
            // [1,"localhost",80,1,32,"test"]

            const serverName: string | undefined = typeof json[5] === 'string' ? json[5] : undefined;
            const serverPort: number | undefined = typeof json[2] === 'number' ? json[2] : undefined;
            const serverAddress: string | undefined = typeof json[1] === 'string' ? json[1] : undefined;
            const serverMaxPlayers: number | undefined = typeof json[4] === 'number' ? json[4] : undefined;
            const serverCurrentPlayers: number | undefined = typeof json[3] === 'number' ? json[3] : undefined;

            const server = new Server({
              name: serverName as string,
              port: serverPort as number,
              address: serverAddress as string,
              maxPlayers: serverMaxPlayers as number,
              currentPlayers: serverCurrentPlayers as number
            });

            this.registerServer(server);
            break;
          }
          // updating server by uuid (that is owned by announcer) to master
          case 2: {
            // [2,'uuid',0]

            const serverUuid: string | undefined = typeof json[1] === 'string' ? json[1] : undefined;
            const serverCurrentPlayers: number | undefined = typeof json[2] === 'number' ? json[2] : undefined;

            this.updateServer(serverUuid as string, { playerCount: serverCurrentPlayers as number });
            break;
          }
          default: {
            console.log('\x1b[31m%s\x1b[0m', 'unknown packet', json);
            break;
          }
        }
      }
    }
  }

  private verify(token: string): void {
    // verify
    if (!this.verified && token === currentToken) {
      this.verified = !this.verified;
      
      // send success message
      this.socket.send(JSON.stringify([2]));
      return;
    }

    // when he is verified, do nothing.
    if (this.verified) return;

    // when he dosen't guess annoucement token, we can kick his ass
    this.socket.send(JSON.stringify([1]));
    this.socket.close();
  }

  registerServer(server: Server): void {
    if (!this.verified) return;

    // push server to announcer as he owns server and push to master
    this.servers.push(server);
    master.servers.push(server);

    // send back server uuid to somehow update it
    this.socket.send(JSON.stringify([3, server.uuid]));
  }

  updateServer(uuid: string, data: ServerUpdateData): void {
    if (!this.verified) return;
    
    // verify if is owner of this server
    const srv = this.servers.find(s => !!s && s.uuid === uuid);
    if (!srv) return;

    // update server details
    srv.updated = Date.now();
    srv.currentPlayers = data.playerCount;

    // send back response that server updated
    this.socket.send(JSON.stringify([4]));
    //console.log('\x1b[33m%s\x1b[0m', "[INFO]", JSON.stringify([4]));
  }
}