// TODO: new lobby manager
import WebSocket from "ws";
import Game from "../components/game/Game";
import Logger from "./Logger";

enum ClientLobbyPacket {
  HANDSHAKE = 0,
  UPDATE_SERVER = 2,
  REGISTER_SERVER = 1,
}

enum ServerLobbyPacket {
  SERVER_UPDATED = 4,
  SERVER_REGISTERED = 3,
  VERIFICATION_FAILED = 1,
  VERIFICATION_SUCCESS = 2,
}


export default class Lobby extends WebSocket {
  private readonly logger: Logger = new Logger(Lobby.name);

  private readonly LOBBY_TOKEN: string = 'N1C3_T0K3N_B30S3N';
  private readonly LOBBY_SECURE: boolean = false;
  private readonly LOBBY_MAX_PLAYERS: number = 100;

  private intervals: NodeJS.Timer[] = [];
  private serverUuid: string = '';

  public authenticated: boolean = false;

  constructor(private readonly game: Game) {
    super('ws://localhost:8082/announce');

    this.onopen = this.open.bind(this);
    this.onmessage = this.handle.bind(this);
  }

  private open(): void {
    return this.send(
      JSON.stringify([
        ClientLobbyPacket.HANDSHAKE,
        this.LOBBY_TOKEN
      ])
    );
  }

  private register(): void {
    if (!this.authenticated) return;
    if (typeof this.serverUuid === 'string' && this.serverUuid.length > 0) return;

    return this.send(
      JSON.stringify([
        ClientLobbyPacket.REGISTER_SERVER,
        this.game.network.host,
        this.game.network.port,
        this.game.clients.array.length,
        this.LOBBY_MAX_PLAYERS,
        'Sandbox (in-dev)'
      ])
    );
  }

  private update(): void {
    if (!this.authenticated) return;

    return this.send(
      JSON.stringify([
        ClientLobbyPacket.UPDATE_SERVER,
        this.serverUuid,
        this.game.clients.array.length
      ])
    );
  }

  private handle(message: WebSocket.MessageEvent): void {
    const { data: str } = message;

    let json: any[] = [];

    if (typeof str === 'string') {
      try {
        json = JSON.parse(str);
      } catch(e) {} finally {
        const [ header, ...data ] = json;

        switch (header) {
          case ServerLobbyPacket.VERIFICATION_FAILED: {
            this.logger.log('error', 'Invaild lobby token, disconnecting from lobby');
            this.close();
            break;
          }
          case ServerLobbyPacket.VERIFICATION_SUCCESS: {
            this.logger.log('info', 'Lobby auth verification success');
            this.authenticated = true;
            this.register();
            break;
          }
          case ServerLobbyPacket.SERVER_REGISTERED: {
            if (!this.authenticated) return;

            this.logger.log('info', 'Lobby registered server', data);

            this.serverUuid = data[0];
            this.update();
            
            this.intervals.push(setInterval(this.update.bind(this), 5 * 1000));
            break;
          }
        }
      }
    }
  }
}