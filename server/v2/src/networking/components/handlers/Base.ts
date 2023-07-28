import NetworkClient from '../Client';
import { network } from '../../..';
import { Player } from '../../../entities/Player';
import { ClientPacket } from '../../../enums';

export const handleDirection = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player)
    client.entity.updateDirection(data[0]);
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