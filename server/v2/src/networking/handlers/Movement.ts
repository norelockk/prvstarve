import NetworkClient from "../components/Client";
import { Player } from "../../entities/components/Player";

export const handleDirection = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player) {
    client.entity.updateDirection(data[0]);
  }
};

export const handleAngle = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player) {
    client.entity.angle = data[0];
  }
};

export const handleAttack = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player) {
    client.entity.attack(data[0]);
  }
};

export const handleStopAttack = (client: NetworkClient, data: any[]): void => {
  if (client && client.entity instanceof Player) {
    client.entity.stopAttack();
  }
};