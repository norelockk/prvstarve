/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import ConfigReader from "../../helpers/ConfigReader";
import Game from "./Game";

const config: ConfigReader = new ConfigReader('./game.json');

export default class GameServer extends Game {
  constructor() {
    super(config);
    
  }
}