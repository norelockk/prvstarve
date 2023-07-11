/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import { PlayerSkin } from "./entities/components/Player";

export interface T_GENERIC {
  id: number;
}

export interface PlayerHandshakeInput {
  nickname: string;

  // Viewport
  screenWidth?: number;
  screenHeight?: number;

  // Client version
  clientVersion: number;

  // Token for reconnecting to the server
  token?: string;
  tokenId?: string;

  // Skin
  skin: PlayerSkin
}