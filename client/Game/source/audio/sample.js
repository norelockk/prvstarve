var VOLUME = {

  AMB: 1,
  FX: 1,
};

var CONST_AUDIO = {

  SEA_DELAY: 12,
  SEA_FADE: 5000,
  FOREST_DELAY: 12,
  FOREST_FADE: 5000,
  SNOW_DELAY: 12,
  SNOW_FADE: 5000,
  TRANSITION: 3000,
  DISABLE_EFFECT: 460000,
  PLAYERS: 8,
  ITEMS: 6,

  HAND: 1,
  MISC: 2,
  SHOVEL: 3,
};

var SOUND = []
SOUND[-1] = CONST_AUDIO.HAND;
SOUND[INV.BOOK] = CONST_AUDIO.HAND;
SOUND[INV.WATERING_CAN_FULL] = CONST_AUDIO.HAND;
SOUND[INV.WRENCH] = CONST_AUDIO.MISC;
SOUND[INV.PICK_WOOD] = CONST_AUDIO.MISC;
SOUND[INV.PICK] = CONST_AUDIO.MISC;
SOUND[INV.PICK_GOLD] = CONST_AUDIO.MISC;
SOUND[INV.PICK_DIAMOND] = CONST_AUDIO.MISC;
SOUND[INV.PICK_AMETHYST] = CONST_AUDIO.MISC;
SOUND[INV.PICK_REIDITE] = CONST_AUDIO.MISC;
SOUND[INV.PIRATE_SWORD] = CONST_AUDIO.MISC;
SOUND[INV.SWORD_WOOD] = CONST_AUDIO.MISC;
SOUND[INV.SWORD] = CONST_AUDIO.MISC;
SOUND[INV.LAVA_SWORD] = CONST_AUDIO.MISC;
SOUND[INV.LAVA_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.SWORD_GOLD] = CONST_AUDIO.MISC;
SOUND[INV.SWORD_DIAMOND] = CONST_AUDIO.MISC;
SOUND[INV.SWORD_AMETHYST] = CONST_AUDIO.MISC;
SOUND[INV.SWORD_REIDITE] = CONST_AUDIO.MISC;
SOUND[INV.CRAB_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.WOOD_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.GOLD_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.DIAMOND_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.DRAGON_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.AMETHYST_SPEAR] = CONST_AUDIO.MISC;
SOUND[INV.AMETHYST_REIDITE] = CONST_AUDIO.MISC;
SOUND[INV.HAMMER] = CONST_AUDIO.MISC;
SOUND[INV.HAMMER_GOLD] = CONST_AUDIO.MISC;
SOUND[INV.HAMMER_DIAMOND] = CONST_AUDIO.MISC;
SOUND[INV.HAMMER_AMETHYST] = CONST_AUDIO.MISC;
SOUND[INV.HAMMER_REIDITE] = CONST_AUDIO.MISC;
SOUND[INV.SUPER_HAMMER] = CONST_AUDIO.MISC;
SOUND[INV.DRAGON_SWORD] = CONST_AUDIO.MISC;
SOUND[INV.PITCHFORK2] = CONST_AUDIO.MISC;
SOUND[INV.PITCHFORK] = CONST_AUDIO.MISC;
SOUND[INV.SHOVEL] = CONST_AUDIO.SHOVEL;
SOUND[INV.SHOVEL_GOLD] = CONST_AUDIO.SHOVEL;
SOUND[INV.SHOVEL_DIAMOND] = CONST_AUDIO.SHOVEL;
SOUND[INV.SHOVEL_AMETHYST] = CONST_AUDIO.SHOVEL;

SOUND_NATURE = [];
SOUND_NATURE[0] = 0;//PLANT
SOUND_NATURE[1] = 1;//STONES
SOUND_NATURE[2] = 1;//STONES
SOUND_NATURE[3] = 1;//STONES
SOUND_NATURE[4] = 0;//TREE
SOUND_NATURE[5] = 0;//TREE
SOUND_NATURE[6] = 0;//TREE
SOUND_NATURE[7] = 0;//TREE
SOUND_NATURE[8] = 0;//TREE
SOUND_NATURE[9] = 0;//TREE
SOUND_NATURE[10] = 1;//GOLD
SOUND_NATURE[11] = 1;//GOLD
SOUND_NATURE[12] = 1;//GOLD
SOUND_NATURE[13] = 1;//DIAM
SOUND_NATURE[14] = 1;//DIAM
SOUND_NATURE[15] = 1;//DIAM
SOUND_NATURE[16] = 0;//BTREE
SOUND_NATURE[17] = 0;//BTREE
SOUND_NATURE[18] = 0;//BTREE
SOUND_NATURE[19] = 0;//BTREE
SOUND_NATURE[20] = 0;//FIR
SOUND_NATURE[21] = 0;//FIR
SOUND_NATURE[22] = 0;//FIR
SOUND_NATURE[23] = 1;//STONE WINTER
SOUND_NATURE[24] = 1;//STONE WINTER
SOUND_NATURE[25] = 1;//STONE WINTER
SOUND_NATURE[26] = 1;//GOLD WINTER
SOUND_NATURE[27] = 1;//GOLD WINTER
SOUND_NATURE[28] = 1;//GOLD WINTER
SOUND_NATURE[29] = 1;//DIAMOND WINTER
SOUND_NATURE[30] = 1;//DIAMOND WINTER
SOUND_NATURE[31] = 1;//DIAMOND WINTER
SOUND_NATURE[32] = 1;//AMETHYST
SOUND_NATURE[33] = 1;//AMETHYST
SOUND_NATURE[34] = 1;//AMETHYST
SOUND_NATURE[35] = 1;//CAVE STONES
SOUND_NATURE[36] = 1;//CAVE STONES
SOUND_NATURE[37] = 1;//CAVE STONES
SOUND_NATURE[38] = 1;//CAVE STONES
SOUND_NATURE[40] = 0;//PALM
SOUND_NATURE[41] = 0;//PALM
SOUND_NATURE[42] = 0;//PALM
SOUND_NATURE[50] = 1;//REIDITE
SOUND_NATURE[51] = 1;//REIDITE
SOUND_NATURE[52] = 1;//REIDITE
SOUND_NATURE[55] = 0;//CACTUS
SOUND_NATURE[56] = 0;//EMERALD
SOUND_NATURE[57] = 0;//EMERALD
SOUND_NATURE[58] = 0;//EMERALD

SOUND_BUILD = [];
SOUND_BUILD[ITEMS.PLANT] = 0;
SOUND_BUILD[ITEMS.FIRE] = 0;
SOUND_BUILD[ITEMS.TOTEM] = 0;
SOUND_BUILD[ITEMS.BIG_FIRE] = 0;
SOUND_BUILD[ITEMS.SEED] = -1;
SOUND_BUILD[ITEMS.WHEAT_SEED] = -1;
SOUND_BUILD[ITEMS.WORKBENCH] = 0;
SOUND_BUILD[ITEMS.WALL] = 0;
SOUND_BUILD[ITEMS.BRIDGE] = 0;
SOUND_BUILD[ITEMS.PLOT] = 0;
SOUND_BUILD[ITEMS.WINDMILL] = 1;
SOUND_BUILD[ITEMS.WELL] = 1;
SOUND_BUILD[ITEMS.STONE_WALL] = 1;
SOUND_BUILD[ITEMS.GOLD_WALL] = 1;
SOUND_BUILD[ITEMS.DIAMOND_WALL] = 1;
SOUND_BUILD[ITEMS.AMETHYST_WALL] = 1;
SOUND_BUILD[ITEMS.REIDITE_WALL] = 1;
SOUND_BUILD[ITEMS.SPIKE] = 0;
SOUND_BUILD[ITEMS.STONE_SPIKE] = 1;
SOUND_BUILD[ITEMS.GOLD_SPIKE] = 1;
SOUND_BUILD[ITEMS.DIAMOND_SPIKE] = 1;
SOUND_BUILD[ITEMS.AMETHYST_SPIKE] = 1;
SOUND_BUILD[ITEMS.REIDITE_SPIKE] = 1;
SOUND_BUILD[ITEMS.WOOD_DOOR] = 0;
SOUND_BUILD[ITEMS.STONE_DOOR] = 1;
SOUND_BUILD[ITEMS.GOLD_DOOR] = 1;
SOUND_BUILD[ITEMS.DIAMOND_DOOR] = 1;
SOUND_BUILD[ITEMS.AMETHYST_DOOR] = 1;
SOUND_BUILD[ITEMS.REIDITE_DOOR] = 1;
SOUND_BUILD[ITEMS.WOOD_DOOR_SPIKE] = 0;
SOUND_BUILD[ITEMS.STONE_DOOR_SPIKE] = 1;
SOUND_BUILD[ITEMS.GOLD_DOOR_SPIKE] = 1;
SOUND_BUILD[ITEMS.DIAMOND_DOOR_SPIKE] = 1;
SOUND_BUILD[ITEMS.AMETHYST_DOOR_SPIKE] = 1;
SOUND_BUILD[ITEMS.REIDITE_DOOR_SPIKE] = 1;
SOUND_BUILD[ITEMS.FURNACE] = 1;
SOUND_BUILD[ITEMS.RESURRECTION] = 1;
SOUND_BUILD[ITEMS.EMERALD_MACHINE] = 1;
SOUND_BUILD[ITEMS.CHEST] = 0;
SOUND_BUILD[ITEMS.BREAD_OVEN] = 1;

var AUDIO = {

  DIG: {

    sound: null,
    path: ["audio/ambience.mp3"],

    sprite: {

      "d0": [90086, 300, false],
      "d1": [90391, 300, false],
      "d2": [90684, 300, false],
    },

    sample: {

      "d0": CONST_AUDIO.PLAYERS,
      "d1": CONST_AUDIO.PLAYERS,
      "d2": CONST_AUDIO.PLAYERS,
    },
  },

  PUNCH: {

    sound: null,
    path: ["audio/ambience.mp3"],

    sprite: {

      "p0": [89303, 300, false],
      "p1": [89549, 300, false],
      "p2": [89815, 300, false],
    },

    sample: {

      "p0": CONST_AUDIO.PLAYERS,
      "p1": CONST_AUDIO.PLAYERS,
      "p2": CONST_AUDIO.PLAYERS,
    },
  },

  WEAPON: {

    sound: null,
    path: ["audio/ambience.mp3"],

    sprite: {

      "w0": [88195, 300, false],
      "w1": [88473, 300, false],
      "w2": [88751, 300, false],
      "w3": [89025, 300, false],
    },

    sample: {

      "w0": CONST_AUDIO.PLAYERS,
      "w1": CONST_AUDIO.PLAYERS,
      "w2": CONST_AUDIO.PLAYERS,
      "w3": CONST_AUDIO.PLAYERS,
    },
  },

  AMBIENCE: {
    sound: null,
    path: ["audio/ambience.mp3"],
    sprite: {
      cook: [100, 2800, true],
      seaday: [3100, 8800, true],
      seanight: [19882, 8301, true],
      forestday: [32604, 21890, true],
      forestnight: [54524, 11393, true],
      snowday: [66961, 21223, true],
      snownight: [66961, 21223, true],
      fire: [12356, 6965, true],
      swim: [28380, 1797, true],
      sand: [30562, 655, true],
      walk: [31658, 813, true],
      snow: [66014, 925, true],
      hwood: [91022, 400, false], // hit wood 0
      hand: [91431, 400, false], // hit hand
      hstone: [92249, 500, false], // hit minerals 0
    },

    sample: {
      cook: 1,
      seaday: 1,
      seanight: 1,
      forestday: 1,
      forestnight: 1,
      snowday: 1,
      snownight: 1,
      fire: CONST_AUDIO.PLAYERS,
      swim: CONST_AUDIO.PLAYERS,
      sand: CONST_AUDIO.PLAYERS,
      walk: CONST_AUDIO.PLAYERS,
      snow: CONST_AUDIO.PLAYERS,
      hwood: CONST_AUDIO.ITEMS,
      hand: CONST_AUDIO.ITEMS,
      hstone: CONST_AUDIO.ITEMS,
    }
  },
};
