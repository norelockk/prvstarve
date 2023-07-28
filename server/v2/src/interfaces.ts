/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import GameBiome from "./components/game/GameBiome";
import GameObject from "./components/game/GameObject";
import Bounds from "./components/col/Bounds";
import Game from "./components/game/Game";

import { PlayerSkin } from "./entities/Player";
import { ObjectType } from "./enums";

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

// for json thing
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

export interface MapObject {
  radius: number;
  object: ObjectType,
  objectName: string,
}

export interface GameMap {
  bounds: Bounds;
  biomes: GameBiome[];
  spawnBiomes: GameBiome[];
  fallbackBiome: GameBiome;
  objects: GameObject[];
  seed: number;
}