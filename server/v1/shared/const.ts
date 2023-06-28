import { Gamemodes } from "./enums";

export const ECS_NULL: number = -1;
export const CID_NULL: number = 0;

export const TICK_RATE: number = 10;
export const TICK_LENGTH_MS: number = 1000 / TICK_RATE;
export const TICK_DELTA: number = TICK_LENGTH_MS / 1000;

export const DEBUG_CLIENT: boolean = true;
export const MAX_GAME_PLAYERS: number = 100;
export const CURRENT_GAMEMODE: Gamemodes = Gamemodes.LEGACY;
export const MAX_GAME_ENTITIES: number = 1000;