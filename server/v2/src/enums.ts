export enum ClientPacket {
  NEW_PLAYER = 2,
  PLAYER_CHAT = 0,
  SERVER_KICK = 1,
  ALERT_MESSAGE = 4,
  GAME_HANDSHAKE = 3,
  COMMANDS_RESPONSE = 5,
  UPDATE_WELCOME_MESSAGE = 6
}

export enum ServerPacket {
  SERVER_FULL = 5,
  UPDATE_UNITS = 0,
  GAME_OLD_VERSION = 4,
  HARD_REFRESH_UNITS = 1,
	LEADERBOARD = 21,
	UPDATE_TIME = 22
}

export enum Gamemodes {
  PVP,
  HUNGER_GAMES,
  ZOMBIES,
  VAMPIRES,
  LEGACY,
  BR,
  COMMUNITY,
  EXPERIMENTAL
}

export enum WorldBiomes {
	FOREST,
	WINTER,
	LAVA,
	DRAGON,
	SEA,
	DESERT = 10
}

export enum EntityState {
  WEB = 256,
  HURT = 2,
  COLD = 4,
  WALK = 32,
  IDLE = 64,
  HEAL = 128,
  HUNGER = 8,
  ATTACK = 16,
  DELETE = 1,
  NONE = 0
}

export enum RemoveType {
	AMOUNT = 11,
	SINGLE = 53,
	ALL = 52,
	PLACE = 24
}

export enum Direction {
  UP = 1,
  LEFT = 2,
  DOWN = 8,
  NONE = 0,
  RIGHT = 4
}

export enum ItemType {
	NONE,
	TOOL,
	FOOD,
	ARMOR,
	STRUCTURE,
	PICKAXE,
	SHOVEL,
	WEAPON,
	HAMMER,
	PITCHFORK
}

export enum EntityType {
	PLAYERS,
	FIRE,
	WORKBENCH,
	SEED,
	WALL,
	SPIKE,
	BIG_FIRE,
	STONE_WALL,
	GOLD_WALL,
	DIAMOND_WALL,
	WOOD_DOOR,
	CHEST,
	STONE_SPIKE,
	GOLD_SPIKE,
	DIAMOND_SPIKE,
	STONE_DOOR,
	GOLD_DOOR,
	DIAMOND_DOOR,
	FURNACE,
	AMETHYST_WALL,
	AMETHYST_SPIKE,
	AMETHYST_DOOR,
	RESURRECTION,
	EMERALD_MACHINE,

	EXTRACTOR_MACHINE_STONE,
	EXTRACTOR_MACHINE_GOLD,
	EXTRACTOR_MACHINE_DIAMOND,
	EXTRACTOR_MACHINE_AMETHYST,
	EXTRACTOR_MACHINE_REIDITE,

	TOTEM,
	BRIDGE,
	WHEAT_SEED,
	WINDMILL,
	PLOT,
	BREAD_OVEN,
	WELL,
	SIGN,
	PUMPKIN_SEED,
	ROOF,
	GARLIC_SEED,
	THORNBUSH_SEED,
	BED,

	GARLAND,
	TOMATO_SEED,
	CARROT_SEED,

	WOOD_DOOR_SPIKE,
	STONE_DOOR_SPIKE,
	GOLD_DOOR_SPIKE,
	DIAMOND_DOOR_SPIKE,
	AMETHYST_DOOR_SPIKE,

	REIDITE_WALL,
	REIDITE_DOOR,
	REIDITE_SPIKE,
	REIDITE_DOOR_SPIKE,

	WATERMELON_SEED,
	ALOE_VERA_SEED,
	WOOD_TOWER,

	WOLF = 60,
	SPIDER,
	FOX,
	BEAR,
	DRAGON,
	PIRANHA,
	KRAKEN,
	CRAB,
	FLAME,
	LAVA_DRAGON,
	BOAR,
	CRAB_BOSS,
	BABY_DRAGON,
	BABY_LAVA,
	HAWK,
	VULTURE,
	SAND_WORM,
	BABY_MAMMOTH,
	MAMMOTH,

	WHEAT_MOB,
	RABBIT,
	TREASURE_CHEST,
	DEAD_BOX,
	PUMPKIN_MOB,
	GARLIC_MOB,
	THORNBUSH_MOB,
	CRATE,

	//Christmas
	GIFT,

	PENGUIN,
	ALOE_VERA_MOB,
	FIREFLY,
	SPELL,

	FRUIT = 100,
}