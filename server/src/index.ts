import 'dotenv/config';
import GameServer from './GameServer';
import Socket from './network';

export const game: GameServer = GameServer.construct();

(function bootstrap() {
  Socket.construct();
})();