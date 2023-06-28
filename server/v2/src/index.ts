import Game from "./Game";
import NetworkServer from "./networking";
import ConfigReader from "./ConfigReader";

// Configuration
const config: ConfigReader = new ConfigReader('./game.json');

// Game class
const game: Game = Game.construct(config);

// Socket handling class
const network: NetworkServer = NetworkServer.construct(config, game);