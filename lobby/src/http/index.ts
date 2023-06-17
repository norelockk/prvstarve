import 'dotenv/config';
import cors from 'cors';
import EventEmitter from 'events';
import express from 'express';
import Logger from '../libs/logger';
import router from './routes';

export default class HttpServer extends EventEmitter {
  private port: number = parseInt(process.env.HTTP_SERVER_PORT as string) ?? 8080;
  private logger: Logger = new Logger('HttpServer');

  public http: express.Express = express();

  static construct(): HttpServer {
    return new HttpServer();
  }

  constructor() {
    super();

    this.http.use(cors());
    this.http.use(express.json());
    this.http.set('trust proxy', true);
    this.http.disable('x-powered-by');

    this.http.listen(this.port, this.init.bind(this));
  }

  private init(): void {
    this.http.use(router);

    this.logger.log('debug', 'HTTP Server listening at port', this.port);
  }
}