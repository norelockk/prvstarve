import { WebSocket, WebSocketServer } from 'ws';
import Logger from '../libs/logger';
import Announcer from './Announcer';

const CHECK_ANNOUNCERS_INTERVAL: number = 10 * 1000;

export default class MasterSocket extends WebSocketServer {
  private logger: Logger = new Logger('MasterSocket'); 
  private annoucers: Announcer[] = [];
  private intervals: NodeJS.Timer[] = [];

  constructor() {
    const port: number = parseInt(process.env.SOCKET_SERVER_PORT as string) ?? 8084

    super({
      port,
      path: '/announce'
    });

    this.on('listening', this.init.bind(this));
  }

  static construct(): MasterSocket {
    return new MasterSocket();
  }

  private findAnnoucerBySocket(announcerSocket: WebSocket): Announcer {
    return this.annoucers.find(a => !!a && a.socket === announcerSocket) as Announcer;
  }

  private checkAnnoucers(): void {
    let index = 0;

    for (; index < this.annoucers.length; index++) {
      const annoucer = this.annoucers[index];

      if (annoucer && !annoucer.verified) {
        annoucer.socket.send(JSON.stringify([-1]));
        annoucer.socket.close();
      }
    }
  }

  private init(): void {
    this.intervals.push(setInterval(this.checkAnnoucers.bind(this), CHECK_ANNOUNCERS_INTERVAL));
    this.logger.log('debug', 'Socket listening on port', this.options.port);
    this.on('connection', this.onSocketConnection.bind(this));
  }

  private onSocketConnection(socket: WebSocket): void {
    this.logger.log('debug', 'Announcer connection received');

    let announcer = this.findAnnoucerBySocket(socket);

    if (!announcer) {
      announcer = new Announcer(socket);

      socket.on('message', announcer.onSocketMessage.bind(announcer));
      socket.on('close', () => {
        this.annoucers.splice(this.annoucers.indexOf(announcer), 1);

        this.logger.log('debug', 'Announcer disconnected');
      });

      this.annoucers.push(announcer);
    }
  }
}