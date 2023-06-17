import { game } from '..';
import Logger from '../Logger';
import { WebSocket, WebSocketServer } from 'ws';

const SOCKET_PORT: number = parseInt(process.env.NETWORKING_SOCKET_PORT as string) ?? 8888;

export default class Socket extends WebSocketServer {
  private logger: Logger = new Logger('Socket');


  public static construct(): Socket {
    return new Socket();
  }

  constructor() {
    super({
      port: SOCKET_PORT
    });

    this.on('listening', this.init.bind(this));
  }

  private init(): void {
    this.logger.log('debug', 'Socket listening on port', SOCKET_PORT);

    // handle socket connections
    this.on('connection', this.socketConnected.bind(this));
  }

  private socketConnected(socket: WebSocket, request: any): void {
    game.clients.createClient(socket);
  }
}