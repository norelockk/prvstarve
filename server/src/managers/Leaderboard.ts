import GameServer from "../GameServer";
import Client from "../network/Client";

export default class LeaderboardManager {
  private gameServer: GameServer;

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;
  }

  update() {
    const clients: Client[] = this.gameServer.clients.clients;

    for (let index = 0; index < clients.length; index++) {
      const client = clients[index];

      if (client && client.entity) {
        
      }
    }
  }
}