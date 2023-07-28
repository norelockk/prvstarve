import WebSocket from 'ws';

// Settings
const MASTER_HOST: string = "localhost";
const MASTER_PORT: number = 8082; // it can be changed in .env file
const MASTER_TOKEN: string = "N1C3_T0K3N_B30S3N"; // it can be changed in .env file
const MASTER_USING_SSL: boolean = false; // Is master using ssl protocol (cloudflare or idk)

// Server annoucement settings
const SERVER_NAME: string = "Russia #1";
const SERVER_PORT: number = 8888;
const SERVER_HOSTNAME: string = "localhost";
const SERVER_MAX_PLAYERS: number = 100;
const SERVER_CURRENT_PLAYERS: number = 0;

export default class MasterClient extends WebSocket {
  constructor() {
    const URL = `${!!MASTER_USING_SSL ? 'wss' : 'ws'}://${MASTER_HOST}:${MASTER_PORT}/announcer`

    super(URL);

    this.onopen = this.init.bind(this);
    this.onmessage = this.handle.bind(this);
  }

  private init(): void {
    this.send(JSON.stringify([0, MASTER_TOKEN]));
  }

  private handle(message: any): void {
    message = message.data;

    if (typeof message === 'string') {
      let json: any = [];

      try {
        json = JSON.parse(message);
      } catch (e) {} finally {
        switch(json[0]) {
          case 1: {
            console.log('verification failed');
            break;
          }
          case 2: {
            console.log('verification began success, registering server');

            this.send(JSON.stringify([1,SERVER_HOSTNAME,SERVER_PORT,SERVER_CURRENT_PLAYERS,SERVER_MAX_PLAYERS,SERVER_NAME]));
            break;
          }
          case 3: {
            console.log('server registered to master, accessing server uuid...');

            const uuid = json[1];

            setInterval(() => {
              this.send(JSON.stringify([2,uuid,~~(Math.random() * 60)]))
            }, 5000);
            break;
          }
          case 4: {
            console.log('server updated');
            break;
          }
        }
      }  
    }
  }
}