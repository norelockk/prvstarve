import { WebSocket } from 'ws';
import GameServer from '../GameServer';
import Logger from '../Logger';
import { getIp } from '../Utils';
import { MAX_GAME_PLAYERS } from '../../shared/const';

export default class LobbyManager extends WebSocket {
  private _logger: Logger = new Logger(LobbyManager.name);
  private _address: string | null = null;
  private _lobbyUuid: string | undefined = undefined;
  private _intervals: NodeJS.Timer[] = [];
  private _gameServer: GameServer;

  constructor(gameServer: GameServer) {
    const address: string = process.env.LOBBY_SOCKET_ADDRESS as string ?? '127.0.0.1';
    const port: number = parseInt(process.env.LOBBY_SOCKET_PORT as string) ?? 8082;

    super(`wss://${address}:${port}/announcer`);

    // private properties
    this._gameServer = gameServer;

    // private methods binding
    this.on('open', this._open.bind(this));
    this.on('message', this._handle.bind(this));
  }

  private async _handle(message: any): Promise<void> {
    message = message.toString();

    if (typeof message === 'string') {
      let json: any = [];

      try {
        json = JSON.parse(message);
      } catch (e) { } finally {
        const [header, ...body] = json;

        switch (header) {
          case 1: {
            this._logger.log('error', 'Lobby verification failed');
            break;
          }
          case 2: {
            this._logger.log('info', 'Lobby verification success, registering server...');

            const ip: string = await getIp();
            const port: number = parseInt(process.env.NETWORKING_SOCKET_PORT as string) ?? 8888;

            this.send(
              JSON.stringify([
                1,
                ip,
                port,
                this._gameServer.clients.clients.length,
                MAX_GAME_PLAYERS,
                'Sandbox server'
              ])
            );
            break;
          }
          case 3: {
            this._logger.log('info', 'Lobby register success, updating in process.');

            this._lobbyUuid = body[0];

            if (typeof this._lobbyUuid === 'string') {
              this._update();
              this._intervals.push(setInterval(this._update.bind(this), 5 * 1000));
            }

            break;
          }
        }
      }
    }
  }

  private _update(): void {
    this.send(JSON.stringify([2, this._lobbyUuid, this._gameServer.clients.clients.length]));
  }

  private _open(): void {
    const secret: string = process.env.LOBBY_SOCKET_SECRET as string;

    this.send(JSON.stringify([0, secret]));
  }
}