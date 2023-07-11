import { Player } from "../../entities/components/Player";
import NetworkClient from "../components/Client";
import { network } from "../..";
import { ClientPacket } from "../../enums";

const handleChat = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player) {
    for (const player of network.clients.array) {
      if (player.id === client.id)
        continue;

      player.socket.send(
        JSON.stringify([
          ClientPacket.PLAYER_CHAT,
          client.id,
          data[0]
        ])
      );
    }
  }
};

export default handleChat;