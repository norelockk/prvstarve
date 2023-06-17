import { WebSocket } from 'ws';
import msgpack from 'msgpack-lite';

import Player from '../entities/Player';
import GameServer from '../GameServer';
import Logger from '../Logger';
import { DEBUG_CLIENT } from '../../../shared/const';
import { HandshakeResponse } from './packets/json/Handshake';

export default class Client {
  public entity: Player | undefined;
  public socket: WebSocket;

  private logger: Logger = new Logger('SocketClient');
  private gameServer: GameServer;

  public clientId: number;
  
  public points: number = 0;
  public handshaked: boolean = false;

  public static construct(clientId: number, gameServer: GameServer, socket: WebSocket): Client {
    return new Client(clientId, gameServer, socket);
  }

  constructor(clientId: number, gameServer: GameServer, socket: WebSocket) {
    if (!gameServer || !(gameServer instanceof GameServer)) throw 'GameServer required';
    if (!socket || !(socket instanceof WebSocket)) throw 'Client WebSocket required';

    // initial datas
    this.clientId = clientId;

    // game data
    this.gameServer = gameServer;
    this.socket = socket;

    // set for now to be undefined until they don't properly request a handshake
    this.entity = undefined;

    this.init();
  }

  /** Socket messaging methods */  
  public sendJson(data: object) {
    if (this.socket.readyState !== WebSocket.OPEN) return;

    return this.socket.send(JSON.stringify(data));
  }

  public sendBinary(data: Uint8Array) {
    if (this.socket.readyState !== WebSocket.OPEN) return;

    return this.socket.send(data.buffer);
  }

  private init(): void {
    // handle socket events
    this.socket.on('close', this.processClose.bind(this));
    this.socket.on('message', this.processMessage.bind(this));
  }

  private processClose(): void {
    this.gameServer.clients.destroyClient(this);
  }

  private processMessage(message: any): void {
    let parsed: any;

    try {
      parsed = msgpack.decode(message);
    } catch (e) {
      // todo: handle errors
      this.socket.close();
    } finally {
      if (parsed) {
        !!DEBUG_CLIENT && (console.log('recv', typeof parsed === 'object' ? JSON.stringify(parsed) : parsed));

        // check type of packet header
        const header: string | undefined = !!Array.isArray(parsed) ? typeof parsed[0] : undefined;

        if (header) {
          switch (header) {
            case 'number': return this.handlePacket(parsed);
            case 'string': return this.handleHandshake(parsed);
            default: {
              if (DEBUG_CLIENT)
                this.logger.log('warn', 'Client tried to execute unknown format of packet', header);
              break;
            }
          }
        }
      }
    }
  }

  private handlePacket(data: object): void {
    if (!this.handshaked) return;

    !!DEBUG_CLIENT && (console.log('recv pkt', typeof data === 'object' ? JSON.stringify(data) : data));
  }

  private handleHandshake(data: any): void {
    if (this.handshaked) return;

    // !!DEBUG_CLIENT && (console.log('recv hs', typeof data === 'object' ? JSON.stringify(data) : data));

    // let [
    //   nickname,
    //   viewportWidth,
    //   viewportHeight,
    //   clientVersion,
    //   token,
    //   tokenId,
    //   reconnectBool,
    //   skin,
    //   accesssory,
    //   bag,
    //   book,
    //   crate,
    //   dead,
    //   userId,
    //   userToken,
    //   serverPassword,
    //   userHWID
    // ] = data;

    let nickname: string = data[0].trim() as string;
    if (nickname.length === 0)
      nickname = `unnamed#${this.clientId}`;

    this.entity = new Player(this.gameServer, this);
    if (this.entity instanceof Player) {
      const handshake: HandshakeResponse = new HandshakeResponse(this.entity, this.gameServer.clients.json as Player[]);

      if (handshake) {
        this.sendJson(handshake.build());
        this.handshaked = true;
      }
    }
  }
}