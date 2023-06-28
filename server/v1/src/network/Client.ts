import { WebSocket } from 'ws';
import msgpack from 'msgpack-lite';

import Player from '../entities/Player';
import GameServer from '../GameServer';
import Logger from '../Logger';
import { DEBUG_CLIENT } from '../../shared/const';
import { HandshakeResponse } from './packets/json/Handshake';
import NewPlayer from './packets/json/NewPlayer';
import Chat from './packets/json/Chat';

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

    return this.socket.send(data);
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

  private handlePacket(data: any): void {
    if (!this.handshaked) return;

    !!DEBUG_CLIENT && (console.log('recv pkt', typeof data === 'object' ? JSON.stringify(data) : data));

    const [header, ...body] = data;

    switch (header) {
      case 0: {
        if (typeof body[0] !== 'string') return;

        const message: string = body[0].trim();
        if (message.length === 0) return;

        // send chat message to other clients
        const pck: Chat = new Chat(this.entity as Player, message);

        if (pck) {
          for (let index = 0; index < this.gameServer.clients.clients.length; index++) {
            const client: Client = this.gameServer.clients.clients[index];

            if (client && client !== this) {
              client.sendJson(pck.build());
            }
          }

          this.logger.log('info', `${this.entity?.nickname} [${this.clientId}]:`, message);
        }

        break;
      }
      case 2: {
        if (this.entity)
          this.entity.updateDirection(body[0]);
          
        break;
      }
      case 3: {
        if (this.entity)
          this.entity.angle = body[0];

        break;
      }
      case 4: {
        if (this.entity)
          this.entity.attack();
        
        break;
      }
      case 14: {
        if (this.entity)
          this.entity.stopAttack();

        break;
      }
      case 11: {
        console.log('focus pls');
        break;
      }
      default: {

        break;
      }
    }
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
    if (nickname.length === 0) nickname = `unnamed#${this.clientId}`;

    this.entity = new Player(this.gameServer, this);
    this.entity.nickname = nickname;
    
    this.gameServer.world.addEntity(this.entity);

    if (this.entity instanceof Player) {
      const handshake: HandshakeResponse = new HandshakeResponse(this.entity, this.gameServer.clients.json as Player[]);

      if (handshake) {
        // send to other clients that joind
        const nextPlayer: NewPlayer = new NewPlayer(this.entity);

        for (const client of this.gameServer.clients.clients) {
          if (client.socket !== this.socket) {
            client.sendJson(nextPlayer.build());
          } 
        }

        // send handshake
        this.sendJson(handshake.build());
        this.handshaked = true;
      }
    }
  }

  public update(delta: number): void {
    // todo: update client stuff
  }
}