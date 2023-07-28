/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import { PlayerSkin } from "./entities/Player";
import { Versioning } from "./networking/packets/json/Handshake";

export interface T_GENERIC {
  id: number;
}

export interface PlayerHandshakeInput {
  nickname: string;

  // Viewport
  screenWidth?: number;
  screenHeight?: number;

  // Client version
  clientVersion: any[];

  // Token for reconnecting to the server
  token?: string;
  tokenId?: string;

  // Skin
  skin: PlayerSkin
}

export interface Players {
  i: number; // player id
  n: string; // player nickname
  s: number; // player skin
  a: number; // player accessory
  c: number; // player loot box
  b: number; // player book
  d: number; // player dead box
  g: number; // player bag
  l: number; // player level
}