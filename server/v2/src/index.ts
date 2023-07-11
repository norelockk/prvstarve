/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Game from "./Game";
import NetworkServer from "./networking";
import ConfigReader from "./ConfigReader";

// Configuration
const config: ConfigReader = new ConfigReader('./game.json');

// Game class
export const game: Game = Game.construct(config);
game.initialize();

// Socket handling class
export const network: NetworkServer = NetworkServer.construct(game);