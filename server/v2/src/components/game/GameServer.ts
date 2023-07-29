/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import ConfigReader from "../../helpers/ConfigReader";
import Logger from "../../helpers/Logger";
import Game from "./Game";

export default class GameServer {
  private readonly logger: Logger = new Logger(GameServer.name);
  private readonly config: ConfigReader = new ConfigReader('./game.json');

  public readonly game: Game = new Game(this.config);
}