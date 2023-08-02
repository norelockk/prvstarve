import NetworkClient from '../NetworkClient';

import { Player } from '../../../entities/Player';
import { ClientPacket } from '../../../enums';
import RecoverFocus from '../packets/bin/RecoverFocus';

export const handleDirection = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player)
    client.entity.updateDirection(data[0]);
};

export const handleRecoverFocus = (client: NetworkClient): void => {
  if (client && client.entity instanceof Player) {
    const pck: RecoverFocus = new RecoverFocus(client.entity);

    if (pck) {
      client.socket.send(pck.build, true);
    }
  }
};

export const handleAngle = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player)
    client.entity.angle = data[0];
};

export const handleAttack = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player)
    client.entity.attack(data[0]);
};

export const handleStopAttack = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player)
    client.entity.stopAttack();
};

export const handleChat = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player) {
    const clients: NetworkClient[] = client.game.clients.array;

    for (const player of clients) {
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