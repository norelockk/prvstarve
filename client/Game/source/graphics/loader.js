function render_inventory() {
  sprite[SPRITE.INV_PUMPKIN] = create_craft_button(1, [{
    f: create_pumpkin,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#352b10", "#c06937", "#cd733b", "#b25e34", "#244e2b", "#214224", "#6f4424", "#3c3009"]
  }], 0.2, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CHEST_PUMPKIN] = sprite[SPRITE.INV_PUMPKIN];
  sprite[SPRITE.INV_CARROT] = [];
  sprite[SPRITE.INV_CARROT][0] = IMAGES.INV_CARROT_OUT;
  sprite[SPRITE.INV_CARROT][1] = IMAGES.INV_CARROT_IN;
  sprite[SPRITE.INV_CARROT][2] = IMAGES.INV_CARROT_CLICK;
  sprite[SPRITE.CHEST_CARROT] = sprite[SPRITE.INV_CARROT];
  sprite[SPRITE.INV_WATERMELON] = [];
  sprite[SPRITE.INV_WATERMELON][0] = IMAGES.INV_WATERMELON_OUT;
  sprite[SPRITE.INV_WATERMELON][1] = IMAGES.INV_WATERMELON_IN;
  sprite[SPRITE.INV_WATERMELON][2] = IMAGES.INV_WATERMELON_CLICK;
  sprite[SPRITE.CHEST_WATERMELON] = sprite[SPRITE.INV_WATERMELON];
  sprite[SPRITE.INV_ALOE_VERA] = [];
  sprite[SPRITE.INV_ALOE_VERA][0] = IMAGES.INV_ALOE_VERA_OUT;
  sprite[SPRITE.INV_ALOE_VERA][1] = IMAGES.INV_ALOE_VERA_IN;
  sprite[SPRITE.INV_ALOE_VERA][2] = IMAGES.INV_ALOE_VERA_CLICK;
  sprite[SPRITE.CHEST_ALOE_VERA] = sprite[SPRITE.INV_ALOE_VERA];
  sprite[SPRITE.INV_CACTUS] = [];
  sprite[SPRITE.INV_CACTUS][0] = IMAGES.INV_CACTUS_OUT;
  sprite[SPRITE.INV_CACTUS][1] = IMAGES.INV_CACTUS_IN;
  sprite[SPRITE.INV_CACTUS][2] = IMAGES.INV_CACTUS_CLICK;
  sprite[SPRITE.CHEST_CACTUS] = sprite[SPRITE.INV_CACTUS];
  sprite[SPRITE.INV_TOMATO] = [];
  sprite[SPRITE.INV_TOMATO][0] = IMAGES.INV_TOMATO_OUT;
  sprite[SPRITE.INV_TOMATO][1] = IMAGES.INV_TOMATO_IN;
  sprite[SPRITE.INV_TOMATO][2] = IMAGES.INV_TOMATO_CLICK;
  sprite[SPRITE.CHEST_TOMATO] = sprite[SPRITE.INV_TOMATO];
  sprite[SPRITE.INV_BOAT] = [];
  sprite[SPRITE.INV_BOAT][0] = IMAGES.INV_BOAT_OUT;
  sprite[SPRITE.INV_BOAT][1] = IMAGES.INV_BOAT_IN;
  sprite[SPRITE.INV_BOAT][2] = IMAGES.INV_BOAT_CLICK;
  sprite[SPRITE.CHEST_BOAT] = sprite[SPRITE.INV_BOAT];
  sprite[SPRITE.CRAFT_BOAT] = sprite[SPRITE.INV_BOAT];
  sprite[SPRITE.INV_MACHETE] = [];
  sprite[SPRITE.INV_MACHETE][0] = IMAGES.INV_MACHETE_OUT;
  sprite[SPRITE.INV_MACHETE][1] = IMAGES.INV_MACHETE_IN;
  sprite[SPRITE.INV_MACHETE][2] = IMAGES.INV_MACHETE_CLICK;
  sprite[SPRITE.CHEST_MACHETE] = sprite[SPRITE.INV_MACHETE];
  sprite[SPRITE.CRAFT_MACHETE] = sprite[SPRITE.INV_MACHETE];
  sprite[SPRITE.INV_SLED] = [];
  sprite[SPRITE.INV_SLED][0] = IMAGES.INV_SLED_OUT;
  sprite[SPRITE.INV_SLED][1] = IMAGES.INV_SLED_IN;
  sprite[SPRITE.INV_SLED][2] = IMAGES.INV_SLED_CLICK;
  sprite[SPRITE.CHEST_SLED] = sprite[SPRITE.INV_SLED];
  sprite[SPRITE.CRAFT_SLED] = sprite[SPRITE.INV_SLED];
  sprite[SPRITE.INV_PIRATE_HAT] = [];
  sprite[SPRITE.INV_PIRATE_HAT][0] = IMAGES.INV_PIRATE_HAT_OUT;
  sprite[SPRITE.INV_PIRATE_HAT][1] = IMAGES.INV_PIRATE_HAT_IN;
  sprite[SPRITE.INV_PIRATE_HAT][2] = IMAGES.INV_PIRATE_HAT_CLICK;
  sprite[SPRITE.CHEST_PIRATE_HAT] = sprite[SPRITE.INV_PIRATE_HAT];
  sprite[SPRITE.CRAFT_PIRATE_HAT] = sprite[SPRITE.INV_PIRATE_HAT];
  sprite[SPRITE.INV_FUR_MAMMOTH] = [];
  sprite[SPRITE.INV_FUR_MAMMOTH][0] = IMAGES.INV_FUR_MAMMOTH_OUT;
  sprite[SPRITE.INV_FUR_MAMMOTH][1] = IMAGES.INV_FUR_MAMMOTH_IN;
  sprite[SPRITE.INV_FUR_MAMMOTH][2] = IMAGES.INV_FUR_MAMMOTH_CLICK;
  sprite[SPRITE.CHEST_FUR_MAMMOTH] = sprite[SPRITE.INV_FUR_MAMMOTH];
  sprite[SPRITE.INV_FUR_HAT] = [];
  sprite[SPRITE.INV_FUR_HAT][0] = IMAGES.INV_FUR_HAT_OUT;
  sprite[SPRITE.INV_FUR_HAT][1] = IMAGES.INV_FUR_HAT_IN;
  sprite[SPRITE.INV_FUR_HAT][2] = IMAGES.INV_FUR_HAT_CLICK;
  sprite[SPRITE.CHEST_FUR_HAT] = sprite[SPRITE.INV_FUR_HAT];
  sprite[SPRITE.CRAFT_FUR_HAT] = sprite[SPRITE.INV_FUR_HAT];
  sprite[SPRITE.INV_WOOD_BOW] = [];
  sprite[SPRITE.INV_WOOD_BOW][0] = IMAGES.INV_WOOD_BOW_OUT;
  sprite[SPRITE.INV_WOOD_BOW][1] = IMAGES.INV_WOOD_BOW_IN;
  sprite[SPRITE.INV_WOOD_BOW][2] = IMAGES.INV_WOOD_BOW_CLICK;
  sprite[SPRITE.CHEST_WOOD_BOW] = sprite[SPRITE.INV_WOOD_BOW];
  sprite[SPRITE.CRAFT_WOOD_BOW] = sprite[SPRITE.INV_WOOD_BOW];
  sprite[SPRITE.INV_WOOD_ARROW] = [];
  sprite[SPRITE.INV_WOOD_ARROW][0] = IMAGES.INV_WOOD_ARROW_OUT;
  sprite[SPRITE.INV_WOOD_ARROW][1] = IMAGES.INV_WOOD_ARROW_IN;
  sprite[SPRITE.INV_WOOD_ARROW][2] = IMAGES.INV_WOOD_ARROW_CLICK;
  sprite[SPRITE.CHEST_WOOD_ARROW] = sprite[SPRITE.INV_WOOD_ARROW];
  sprite[SPRITE.CRAFT_WOOD_ARROW] = sprite[SPRITE.INV_WOOD_ARROW];
  sprite[SPRITE.INV_STONE_BOW] = [];
  sprite[SPRITE.INV_STONE_BOW][0] = IMAGES.INV_STONE_BOW_OUT;
  sprite[SPRITE.INV_STONE_BOW][1] = IMAGES.INV_STONE_BOW_IN;
  sprite[SPRITE.INV_STONE_BOW][2] = IMAGES.INV_STONE_BOW_CLICK;
  sprite[SPRITE.CHEST_STONE_BOW] = sprite[SPRITE.INV_STONE_BOW];
  sprite[SPRITE.CRAFT_STONE_BOW] = sprite[SPRITE.INV_STONE_BOW];
  sprite[SPRITE.INV_STONE_ARROW] = [];
  sprite[SPRITE.INV_STONE_ARROW][0] = IMAGES.INV_STONE_ARROW_OUT;
  sprite[SPRITE.INV_STONE_ARROW][1] = IMAGES.INV_STONE_ARROW_IN;
  sprite[SPRITE.INV_STONE_ARROW][2] = IMAGES.INV_STONE_ARROW_CLICK;
  sprite[SPRITE.CHEST_STONE_ARROW] = sprite[SPRITE.INV_STONE_ARROW];
  sprite[SPRITE.CRAFT_STONE_ARROW] = sprite[SPRITE.INV_STONE_ARROW];
  sprite[SPRITE.INV_GOLD_BOW] = [];
  sprite[SPRITE.INV_GOLD_BOW][0] = IMAGES.INV_GOLD_BOW_OUT;
  sprite[SPRITE.INV_GOLD_BOW][1] = IMAGES.INV_GOLD_BOW_IN;
  sprite[SPRITE.INV_GOLD_BOW][2] = IMAGES.INV_GOLD_BOW_CLICK;
  sprite[SPRITE.CHEST_GOLD_BOW] = sprite[SPRITE.INV_GOLD_BOW];
  sprite[SPRITE.CRAFT_GOLD_BOW] = sprite[SPRITE.INV_GOLD_BOW];
  sprite[SPRITE.INV_GOLD_ARROW] = [];
  sprite[SPRITE.INV_GOLD_ARROW][0] = IMAGES.INV_GOLD_ARROW_OUT;
  sprite[SPRITE.INV_GOLD_ARROW][1] = IMAGES.INV_GOLD_ARROW_IN;
  sprite[SPRITE.INV_GOLD_ARROW][2] = IMAGES.INV_GOLD_ARROW_CLICK;
  sprite[SPRITE.CHEST_GOLD_ARROW] = sprite[SPRITE.INV_GOLD_ARROW];
  sprite[SPRITE.CRAFT_GOLD_ARROW] = sprite[SPRITE.INV_GOLD_ARROW];
  sprite[SPRITE.INV_DIAMOND_BOW] = [];
  sprite[SPRITE.INV_DIAMOND_BOW][0] = IMAGES.INV_DIAMOND_BOW_OUT;
  sprite[SPRITE.INV_DIAMOND_BOW][1] = IMAGES.INV_DIAMOND_BOW_IN;
  sprite[SPRITE.INV_DIAMOND_BOW][2] = IMAGES.INV_DIAMOND_BOW_CLICK;
  sprite[SPRITE.CHEST_DIAMOND_BOW] = sprite[SPRITE.INV_DIAMOND_BOW];
  sprite[SPRITE.CRAFT_DIAMOND_BOW] = sprite[SPRITE.INV_DIAMOND_BOW];
  sprite[SPRITE.INV_DIAMOND_ARROW] = [];
  sprite[SPRITE.INV_DIAMOND_ARROW][0] = IMAGES.INV_DIAMOND_ARROW_OUT;
  sprite[SPRITE.INV_DIAMOND_ARROW][1] = IMAGES.INV_DIAMOND_ARROW_IN;
  sprite[SPRITE.INV_DIAMOND_ARROW][2] = IMAGES.INV_DIAMOND_ARROW_CLICK;
  sprite[SPRITE.CHEST_DIAMOND_ARROW] = sprite[SPRITE.INV_DIAMOND_ARROW];
  sprite[SPRITE.CRAFT_DIAMOND_ARROW] = sprite[SPRITE.INV_DIAMOND_ARROW];
  sprite[SPRITE.INV_AMETHYST_BOW] = [];
  sprite[SPRITE.INV_AMETHYST_BOW][0] = IMAGES.INV_AMETHYST_BOW_OUT;
  sprite[SPRITE.INV_AMETHYST_BOW][1] = IMAGES.INV_AMETHYST_BOW_IN;
  sprite[SPRITE.INV_AMETHYST_BOW][2] = IMAGES.INV_AMETHYST_BOW_CLICK;
  sprite[SPRITE.CHEST_AMETHYST_BOW] = sprite[SPRITE.INV_AMETHYST_BOW];
  sprite[SPRITE.CRAFT_AMETHYST_BOW] = sprite[SPRITE.INV_AMETHYST_BOW];
  sprite[SPRITE.INV_AMETHYST_ARROW] = [];
  sprite[SPRITE.INV_AMETHYST_ARROW][0] = IMAGES.INV_AMETHYST_ARROW_OUT;
  sprite[SPRITE.INV_AMETHYST_ARROW][1] = IMAGES.INV_AMETHYST_ARROW_IN;
  sprite[SPRITE.INV_AMETHYST_ARROW][2] = IMAGES.INV_AMETHYST_ARROW_CLICK;
  sprite[SPRITE.CHEST_AMETHYST_ARROW] = sprite[SPRITE.INV_AMETHYST_ARROW];
  sprite[SPRITE.CRAFT_AMETHYST_ARROW] = sprite[SPRITE.INV_AMETHYST_ARROW];
  sprite[SPRITE.INV_REIDITE_BOW] = [];
  sprite[SPRITE.INV_REIDITE_BOW][0] = IMAGES.INV_REIDITE_BOW_OUT;
  sprite[SPRITE.INV_REIDITE_BOW][1] = IMAGES.INV_REIDITE_BOW_IN;
  sprite[SPRITE.INV_REIDITE_BOW][2] = IMAGES.INV_REIDITE_BOW_CLICK;
  sprite[SPRITE.CHEST_REIDITE_BOW] = sprite[SPRITE.INV_REIDITE_BOW];
  sprite[SPRITE.CRAFT_REIDITE_BOW] = sprite[SPRITE.INV_REIDITE_BOW];
  sprite[SPRITE.INV_REIDITE_ARROW] = [];
  sprite[SPRITE.INV_REIDITE_ARROW][0] = IMAGES.INV_REIDITE_ARROW_OUT;
  sprite[SPRITE.INV_REIDITE_ARROW][1] = IMAGES.INV_REIDITE_ARROW_IN;
  sprite[SPRITE.INV_REIDITE_ARROW][2] = IMAGES.INV_REIDITE_ARROW_CLICK;
  sprite[SPRITE.CHEST_REIDITE_ARROW] = sprite[SPRITE.INV_REIDITE_ARROW];
  sprite[SPRITE.CRAFT_REIDITE_ARROW] = sprite[SPRITE.INV_REIDITE_ARROW];
  sprite[SPRITE.INV_DRAGON_BOW] = [];
  sprite[SPRITE.INV_DRAGON_BOW][0] = IMAGES.INV_DRAGON_BOW_OUT;
  sprite[SPRITE.INV_DRAGON_BOW][1] = IMAGES.INV_DRAGON_BOW_IN;
  sprite[SPRITE.INV_DRAGON_BOW][2] = IMAGES.INV_DRAGON_BOW_CLICK;
  sprite[SPRITE.CHEST_DRAGON_BOW] = sprite[SPRITE.INV_DRAGON_BOW];
  sprite[SPRITE.CRAFT_DRAGON_BOW] = sprite[SPRITE.INV_DRAGON_BOW];
  sprite[SPRITE.INV_DRAGON_ARROW] = [];
  sprite[SPRITE.INV_DRAGON_ARROW][0] = IMAGES.INV_DRAGON_ARROW_OUT;
  sprite[SPRITE.INV_DRAGON_ARROW][1] = IMAGES.INV_DRAGON_ARROW_IN;
  sprite[SPRITE.INV_DRAGON_ARROW][2] = IMAGES.INV_DRAGON_ARROW_CLICK;
  sprite[SPRITE.CHEST_DRAGON_ARROW] = sprite[SPRITE.INV_DRAGON_ARROW];
  sprite[SPRITE.CRAFT_DRAGON_ARROW] = sprite[SPRITE.INV_DRAGON_ARROW];
  sprite[SPRITE.INV_WOOD_SHIELD] = [];
  sprite[SPRITE.INV_WOOD_SHIELD][0] = IMAGES.INV_WOOD_SHIELD_OUT;
  sprite[SPRITE.INV_WOOD_SHIELD][1] = IMAGES.INV_WOOD_SHIELD_IN;
  sprite[SPRITE.INV_WOOD_SHIELD][2] = IMAGES.INV_WOOD_SHIELD_CLICK;
  sprite[SPRITE.CHEST_WOOD_SHIELD] = sprite[SPRITE.INV_WOOD_SHIELD];
  sprite[SPRITE.CRAFT_WOOD_SHIELD] = sprite[SPRITE.INV_WOOD_SHIELD];
  sprite[SPRITE.INV_STONE_SHIELD] = [];
  sprite[SPRITE.INV_STONE_SHIELD][0] = IMAGES.INV_STONE_SHIELD_OUT;
  sprite[SPRITE.INV_STONE_SHIELD][1] = IMAGES.INV_STONE_SHIELD_IN;
  sprite[SPRITE.INV_STONE_SHIELD][2] = IMAGES.INV_STONE_SHIELD_CLICK;
  sprite[SPRITE.CHEST_STONE_SHIELD] = sprite[SPRITE.INV_STONE_SHIELD];
  sprite[SPRITE.CRAFT_STONE_SHIELD] = sprite[SPRITE.INV_STONE_SHIELD];
  sprite[SPRITE.INV_GOLD_SHIELD] = [];
  sprite[SPRITE.INV_GOLD_SHIELD][0] = IMAGES.INV_GOLD_SHIELD_OUT;
  sprite[SPRITE.INV_GOLD_SHIELD][1] = IMAGES.INV_GOLD_SHIELD_IN;
  sprite[SPRITE.INV_GOLD_SHIELD][2] = IMAGES.INV_GOLD_SHIELD_CLICK;
  sprite[SPRITE.CHEST_GOLD_SHIELD] = sprite[SPRITE.INV_GOLD_SHIELD];
  sprite[SPRITE.CRAFT_GOLD_SHIELD] = sprite[SPRITE.INV_GOLD_SHIELD];
  sprite[SPRITE.INV_DIAMOND_SHIELD] = [];
  sprite[SPRITE.INV_DIAMOND_SHIELD][0] = IMAGES.INV_DIAMOND_SHIELD_OUT;
  sprite[SPRITE.INV_DIAMOND_SHIELD][1] = IMAGES.INV_DIAMOND_SHIELD_IN;
  sprite[SPRITE.INV_DIAMOND_SHIELD][2] = IMAGES.INV_DIAMOND_SHIELD_CLICK;
  sprite[SPRITE.CHEST_DIAMOND_SHIELD] = sprite[SPRITE.INV_DIAMOND_SHIELD];
  sprite[SPRITE.CRAFT_DIAMOND_SHIELD] = sprite[SPRITE.INV_DIAMOND_SHIELD];
  sprite[SPRITE.INV_AMETHYST_SHIELD] = [];
  sprite[SPRITE.INV_AMETHYST_SHIELD][0] = IMAGES.INV_AMETHYST_SHIELD_OUT;
  sprite[SPRITE.INV_AMETHYST_SHIELD][1] = IMAGES.INV_AMETHYST_SHIELD_IN;
  sprite[SPRITE.INV_AMETHYST_SHIELD][2] = IMAGES.INV_AMETHYST_SHIELD_CLICK;
  sprite[SPRITE.CHEST_AMETHYST_SHIELD] = sprite[SPRITE.INV_AMETHYST_SHIELD];
  sprite[SPRITE.CRAFT_AMETHYST_SHIELD] = sprite[SPRITE.INV_AMETHYST_SHIELD];
  sprite[SPRITE.INV_REIDITE_SHIELD] = [];
  sprite[SPRITE.INV_REIDITE_SHIELD][0] = IMAGES.INV_REIDITE_SHIELD_OUT;
  sprite[SPRITE.INV_REIDITE_SHIELD][1] = IMAGES.INV_REIDITE_SHIELD_IN;
  sprite[SPRITE.INV_REIDITE_SHIELD][2] = IMAGES.INV_REIDITE_SHIELD_CLICK;
  sprite[SPRITE.CHEST_REIDITE_SHIELD] = sprite[SPRITE.INV_REIDITE_SHIELD];
  sprite[SPRITE.CRAFT_REIDITE_SHIELD] = sprite[SPRITE.INV_REIDITE_SHIELD];
  sprite[SPRITE.INV_FLOWER_HAT] = [];
  sprite[SPRITE.INV_FLOWER_HAT][0] = IMAGES.INV_FLOWER_HAT_OUT;
  sprite[SPRITE.INV_FLOWER_HAT][1] = IMAGES.INV_FLOWER_HAT_IN;
  sprite[SPRITE.INV_FLOWER_HAT][2] = IMAGES.INV_FLOWER_HAT_CLICK;
  sprite[SPRITE.CHEST_FLOWER_HAT] = sprite[SPRITE.INV_FLOWER_HAT];
  sprite[SPRITE.CRAFT_FLOWER_HAT] = sprite[SPRITE.INV_FLOWER_HAT];
  sprite[SPRITE.INV_SANDWORM_JUICE] = [];
  sprite[SPRITE.INV_SANDWORM_JUICE][0] = IMAGES.INV_SANDWORM_JUICE_OUT;
  sprite[SPRITE.INV_SANDWORM_JUICE][1] = IMAGES.INV_SANDWORM_JUICE_IN;
  sprite[SPRITE.INV_SANDWORM_JUICE][2] = IMAGES.INV_SANDWORM_JUICE_CLICK;
  sprite[SPRITE.CHEST_SANDWORM_JUICE] = sprite[SPRITE.INV_SANDWORM_JUICE];
  sprite[SPRITE.CRAFT_SANDWORM_JUICE] = sprite[SPRITE.INV_SANDWORM_JUICE];
  sprite[SPRITE.INV_GARLIC] = create_craft_button(1, [{
    f: create_garlic,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#352b10", "#e8e8e8", "#bbbbbb", "#e0e1e0", "#c4c4c4"]
  }], 0.22, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CHEST_GARLIC] = sprite[SPRITE.INV_GARLIC];
  sprite[SPRITE.INV_THORNBUSH] = create_craft_button(1, [{
    f: create_brambles,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#352b10", "#349970", "#245c45", "#348361", "#e8e8e8", "#bbbbbb"]
  }], 0.2, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CHEST_THORNBUSH] = sprite[SPRITE.INV_THORNBUSH];
  sprite[SPRITE.INV_WINDMILL] = create_craft_button(1, [{
    f: create_windmill,
    x: -1,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#596560", "#394841", "#67766F", "#46554D", "#4C3B19", "#674C2A", "#7C5A29", "#596560", "#394841"]
  }, {
    f: create_windmill_wing,
    x: -1,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#596560", "#394841", "#67766F", "#46554D", "#4C3B19", "#674C2A", "#7C5A29", "#596560", "#394841"]
  }, {
    f: create_windmill_head,
    x: -1,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#596560", "#394841", "#67766F", "#46554D", "#4C3B19", "#674C2A", "#7C5A29", "#596560", "#394841"]
  }], 0.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_WINDMILL] = sprite[SPRITE.INV_WINDMILL];
  sprite[SPRITE.INV_WILD_WHEAT] = create_craft_button(1, [{
    f: create_wheat,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#A89F67", "#9E8456"]
  }], 1.2, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_SIGN] = create_craft_button(1, [{
    f: create_sign,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#44301b", "#57442a", "#523e26"]
  }], 0.14, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_SIGN] = sprite[SPRITE.INV_SIGN];
  sprite[SPRITE.INV_WHEAT_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#A89F67", "#9E8456"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_WHEAT_SEED] = sprite[SPRITE.INV_WHEAT_SEED];
  sprite[SPRITE.INV_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#493d36", "#332b28"]
  }], 0.7, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_SEED] = sprite[SPRITE.INV_SEED];
  sprite[SPRITE.INV_PUMPKIN_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#c67933", "#b17238"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_PUMPKIN_SEED] = sprite[SPRITE.INV_PUMPKIN_SEED];
  sprite[SPRITE.INV_GARLIC_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#e8e8e8", "#bbbbbb"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_GARLIC_SEED] = sprite[SPRITE.INV_GARLIC_SEED];
  sprite[SPRITE.INV_THORNBUSH_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#328a56", "#449573"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_THORNBUSH_SEED] = sprite[SPRITE.INV_THORNBUSH_SEED];
  sprite[SPRITE.INV_CARROT_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#c98e2f", "#a36b11"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_CARROT_SEED] = sprite[SPRITE.INV_CARROT_SEED];
  sprite[SPRITE.CHEST_CARROT_SEED] = sprite[SPRITE.INV_CARROT_SEED];
  sprite[SPRITE.INV_WATERMELON_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#13a56d", "#098a58"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_WATERMELON_SEED] = sprite[SPRITE.INV_WATERMELON_SEED];
  sprite[SPRITE.CHEST_WATERMELON_SEED] = sprite[SPRITE.INV_WATERMELON_SEED];
  sprite[SPRITE.INV_ALOE_VERA_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#3a8214", "#4a9c1e"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_ALOE_VERA_SEED] = sprite[SPRITE.INV_ALOE_VERA_SEED];
  sprite[SPRITE.CHEST_ALOE_VERA_SEED] = sprite[SPRITE.INV_ALOE_VERA_SEED];
  sprite[SPRITE.INV_TOMATO_SEED] = create_craft_button(1, [{
    f: create_seed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#b22419", "#99110e"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_TOMATO_SEED] = sprite[SPRITE.INV_TOMATO_SEED];
  sprite[SPRITE.CHEST_TOMATO_SEED] = sprite[SPRITE.INV_TOMATO_SEED];
  sprite[SPRITE.INV_FIRE] = create_craft_button(1, [{
    f: create_wood_fire,
    x: -2,
    y: -2,
    a: 1,
    r: -Math.PI / 7,
    c: ["#4d2d14", "#432516"]
  }, {
    f: create_fire,
    x: -2,
    y: -2,
    a: 1,
    r: -Math.PI / 7,
    c: ["#efd435", "#ec8d35", "#e96132"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_FIRE] = sprite[SPRITE.INV_FIRE];
  sprite[SPRITE.INV_BIG_FIRE] = create_craft_button(1, [{
    f: create_big_fire_wood,
    x: -2,
    y: -1,
    a: 1,
    r: -Math.PI / 7,
    c: ["#4d2d14", "#432516", "#58645F", "#75827D", "#0c2c2e"]
  }, {
    f: create_fire,
    x: -2,
    y: -1,
    a: 1,
    r: -Math.PI / 7,
    c: ["#efd435", "#ec8d35", "#e96132"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BIG_FIRE] = sprite[SPRITE.INV_BIG_FIRE];
  sprite[SPRITE.INV_PIRATE_SWORD] = create_craft_button(1, [{
    f: create_pirate_sword,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#4a3a22", "#362818", "#c7c7c7", "#909090", "#eceaea", "#bbbbbb", "#d6d1d1"]
  }], 0.1, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_SUGAR_CAN] = create_craft_button(1, [{
    f: create_sugar_can,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#ffffff", "#5f6061", "#eb2933", "#57b74e", "#42a54d", "#ac222a", "#e6636a"]
  }], 0.3, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_SWORD_WOOD] = create_craft_button(1, [{
    f: create_sword_wood,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#252525", "#73583e", "#493425", "#7d6144", "#5e4530", "#563e2b"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_SWORD] = create_craft_button(1, [{
    f: create_stonesword,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#939393", "#5f6061", "#b1afaf", "#493d36", "#332b28"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_SWORD_GOLD] = create_craft_button(1, [{
    f: create_goldsword,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#c4bc51", "#b29c32", "#c4bc51", "#493e26", "#382e19"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_SWORD_DIAMOND] = create_craft_button(1, [{
    f: create_diamondsword,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#6ad9e8", "#29aaa1", "#95e9f5", "#022320", "#011e19", "#FFFFFF"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_SWORD_AMETHYST] = create_craft_button(1, [{
    f: create_amesword,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#b864d6", "#8c29aa", "#cc81e7", "#262114", "#211108", "#FFFFFF"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_PICK_WOOD] = create_craft_button(1, [{
    f: create_pickaxe,
    x: -2,
    y: 5,
    a: 1,
    r: -Math.PI / 5,
    c: ["#0d1b1c", "#000000", "#0d1b1c", "#4d2d14", "#432516", "#4d2d14", "#432516"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_PICK] = create_craft_button(1, [{
    f: create_pickaxe,
    x: -2,
    y: 5,
    a: 1,
    r: -Math.PI / 5,
    c: ["#0d1b1c", "#000000", "#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_PICK_GOLD] = create_craft_button(1, [{
    f: create_pickaxe,
    x: -2,
    y: 5,
    a: 1,
    r: -Math.PI / 5,
    c: ["#0d1b1c", "#000000", "#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_PICK_DIAMOND] = create_craft_button(1, [{
    f: create_pickaxe,
    x: -2,
    y: 5,
    a: 1,
    r: -Math.PI / 5,
    c: ["#0d1b1c", "#000000", "#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_PICK_AMETHYST] = create_craft_button(1, [{
    f: create_pickaxe,
    x: -2,
    y: 5,
    a: 1,
    r: -Math.PI / 5,
    c: ["#0d1b1c", "#000000", "#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_PICK_REIDITE] = [];
  sprite[SPRITE.INV_PICK_REIDITE][0] = IMAGES.INV_PICK_REIDITE_OUT;
  sprite[SPRITE.INV_PICK_REIDITE][1] = IMAGES.INV_PICK_REIDITE_IN;
  sprite[SPRITE.INV_PICK_REIDITE][2] = IMAGES.INV_PICK_REIDITE_CLICK;
  sprite[SPRITE.CRAFT_PICK_REIDITE] = sprite[SPRITE.INV_PICK_REIDITE];
  sprite[SPRITE.CHEST_PICK_REIDITE] = sprite[SPRITE.INV_PICK_REIDITE];
  sprite[SPRITE.INV_STONE] = create_craft_button(1, [{
    f: create_stone,
    x: -5,
    y: -5,
    a: 1,
    r: 0,
    c: ["#252B28", "#58645F", "#75827D"]
  }], 0.23, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_GOLD] = create_craft_button(1, [{
    f: create_gold,
    x: -5,
    y: -5,
    a: 1,
    r: 0,
    c: ["#282823", "#877c2d", "#c4bc51"]
  }], 0.43, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_DIAMOND] = create_craft_button(1, [{
    f: create_diamond,
    x: -5,
    y: -5,
    a: 1,
    r: 0,
    c: ["#232828", "#3fc9c9", "#74ede6"]
  }], 0.33, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_WOOD] = create_craft_button(1, [{
    f: create_wood_fire,
    x: 0,
    y: -5,
    a: 1,
    r: Math.PI / 2.5,
    c: ["#4d2d14", "#432516"]
  }], 0.3, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_SWORD_WOOD] = sprite[SPRITE.INV_SWORD_WOOD];
  sprite[SPRITE.CRAFT_SWORD] = sprite[SPRITE.INV_SWORD];
  sprite[SPRITE.CRAFT_SWORD_GOLD] = sprite[SPRITE.INV_SWORD_GOLD];
  sprite[SPRITE.CRAFT_SWORD_DIAMOND] = sprite[SPRITE.INV_SWORD_DIAMOND];
  sprite[SPRITE.CRAFT_SWORD_AMETHYST] = sprite[SPRITE.INV_SWORD_AMETHYST];
  sprite[SPRITE.CRAFT_PICK_WOOD] = sprite[SPRITE.INV_PICK_WOOD];
  sprite[SPRITE.CRAFT_PICK] = sprite[SPRITE.INV_PICK];
  sprite[SPRITE.CRAFT_PICK_GOLD] = sprite[SPRITE.INV_PICK_GOLD];
  sprite[SPRITE.CRAFT_PICK_DIAMOND] = sprite[SPRITE.INV_PICK_DIAMOND];
  sprite[SPRITE.CRAFT_PICK_AMETHYST] = sprite[SPRITE.INV_PICK_AMETHYST];
  sprite[SPRITE.INV_PLANT] = create_craft_button(1, [{
    f: create_food_plant,
    x: 0,
    y: 0,
    a: 1,
    r: 0
  }], 0.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_WORK] = create_craft_button(1, [{
    f: create_workbench,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#4d2d14", "#432516", "#756e52", "#663f22", "#9e9577"]
  }], 0.45, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_WORK] = sprite[SPRITE.INV_WORK];
  sprite[SPRITE.INV_STONE_WALL] = create_craft_button(1, [{
    f: create_wall_stone,
    x: -2,
    y: -2,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#6a7570", "#939995", "#9baaa3", "#adbcb5", "#8a938e"]
  }], 0.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_STONE_WALL] = sprite[SPRITE.INV_STONE_WALL];
  sprite[SPRITE.INV_DIAMOND_WALL] = create_craft_button(1, [{
    f: create_wall_diamond,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#5cc5ce", "#89d1d4", "#86d0d1", "#95d5d8", "#e0f2f6", "#b3e0e3"]
  }], 0.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DIAMOND_WALL] = sprite[SPRITE.INV_DIAMOND_WALL];
  sprite[SPRITE.INV_AMETHYST_WALL] = create_craft_button(1, [{
    f: create_wall_stone,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#b15ecf", "#8c29aa", "#c26de0", "#af59cd", "#d588f1"]
  }], 0.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_AMETHYST_WALL] = sprite[SPRITE.INV_AMETHYST_WALL];
  sprite[SPRITE.INV_GOLD_WALL] = create_craft_button(1, [{
    f: create_wall_gold,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#877d36", "#a08f47", "#a7983c", "#b29e4d", "#c1b06b"]
  }], 0.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_GOLD_WALL] = sprite[SPRITE.INV_GOLD_WALL];
  sprite[SPRITE.INV_WALL] = create_craft_button(1, [{
    f: create_wall,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#4c3a15", "#634828", "#564021", "#634828", "#4c3a15"]
  }], 0.45, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_WALL] = sprite[SPRITE.INV_WALL];
  sprite[SPRITE.INV_SPIKE] = create_craft_button(1, [{
    f: create_spike,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#5f6061", "#939393", "#4c3a15", "#634828", "#564021", "#634828", "#4c3a15"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_SPIKE] = sprite[SPRITE.INV_SPIKE];
  sprite[SPRITE.INV_GOLD_SPIKE] = create_craft_button(1, [{
    f: create_spike_gold,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#5f6061", "#939393", "#877d36", "#a08f47", "#a7983c", "#b29e4d", "#c1b06b"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_GOLD_SPIKE] = sprite[SPRITE.INV_GOLD_SPIKE];
  sprite[SPRITE.INV_DIAMOND_SPIKE] = create_craft_button(1, [{
    f: create_spike_gold,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#7d8b90", "#9facaa", "#5cc5ce", "#89d1d4", "#86d0d1", "#95d5d8", "#e0f2f6", "#b3e0e3"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DIAMOND_SPIKE] = sprite[SPRITE.INV_DIAMOND_SPIKE];
  sprite[SPRITE.INV_STONE_SPIKE] = create_craft_button(1, [{
    f: create_spike_stone,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#5f6061", "#939393", "#6a7570", "#939995", "#9baaa3", "#adbcb5", "#8a938e"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_STONE_SPIKE] = sprite[SPRITE.INV_STONE_SPIKE];
  sprite[SPRITE.INV_AMETHYST_SPIKE] = create_craft_button(1, [{
    f: create_spike_stone,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#5f6061", "#939393", "#b15ecf", "#8c29aa", "#c26de0", "#af59cd", "#d588f1"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_AMETHYST_SPIKE] = sprite[SPRITE.INV_AMETHYST_SPIKE];
  sprite[SPRITE.INV_DOOR_WOOD_CLOSE] = create_craft_button(1, [{
    f: create_door_wood,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#4c3b19", "#574122", "#644928", "#574122", "#735534"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DOOR_WOOD_CLOSE] = sprite[SPRITE.INV_DOOR_WOOD_CLOSE];
  sprite[SPRITE.INV_DOOR_STONE_CLOSE] = create_craft_button(1, [{
    f: create_door_stone,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#6a7570", "#939995", "#9baaa3", "#8a938e", "#adbcb5"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DOOR_STONE_CLOSE] = sprite[SPRITE.INV_DOOR_STONE_CLOSE];
  sprite[SPRITE.INV_DOOR_AMETHYST_CLOSE] = create_craft_button(1, [{
    f: create_door_stone,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#b15ecf", "#8c29aa", "#c26de0", "#af59cd", "#d588f1"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DOOR_AMETHYST_CLOSE] = sprite[SPRITE.INV_DOOR_AMETHYST_CLOSE];
  sprite[SPRITE.INV_DOOR_GOLD_CLOSE] = create_craft_button(1, [{
    f: create_door_gold,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#877d36", "#a08f47", "#a7983c", "#9a8636", "#c1b06b"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DOOR_GOLD_CLOSE] = sprite[SPRITE.INV_DOOR_GOLD_CLOSE];
  sprite[SPRITE.INV_DOOR_DIAMOND_CLOSE] = create_craft_button(1, [{
    f: create_door_diamond,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#5cc5ce", "#89d1d4", "#86d0d1", "#95d5d8", "#e0f2f6", "#b3e0e3"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_DOOR_DIAMOND_CLOSE] = sprite[SPRITE.INV_DOOR_DIAMOND_CLOSE];
  sprite[SPRITE.INV_CHEST] = create_craft_button(1, [{
    f: create_chest,
    x: 0,
    y: 2,
    a: 1,
    r: 0,
    c: ["#133a2b", "#9e8838", "#c4a23a", "#4c3b19", "#614627", "#614627", "#614627", "#c4a23a", "#c4a23a", "#c4a23a"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_CHEST] = sprite[SPRITE.INV_CHEST];
  sprite[SPRITE.INV_MEAT] = create_craft_button(1, [{
    f: create_meat,
    x: 0,
    y: -3,
    a: 1,
    r: 0,
    c: ["#dd5d57", "#ffffff", "#5e5d5e", "#ffffff"]
  }], 1.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_COOKED_MEAT] = create_craft_button(1, [{
    f: create_meat,
    x: 0,
    y: -3,
    a: 1,
    r: 0,
    c: ["#602920", "#844f49", "#5e5d5e", "#d3ccc7"]
  }], 1.4, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_COOKED_MEAT] = sprite[SPRITE.INV_COOKED_MEAT];
  sprite[SPRITE.INV_CORD] = create_craft_button(1, [{
    f: create_cord,
    x: -3,
    y: -3,
    a: 1,
    r: 0,
    c: ["#cec0c4", "#ffffff", "#6d6768"]
  }], 0.9, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_BLUE_CORD] = create_craft_button(1, [{
    f: create_cord,
    x: -3,
    y: -3,
    a: 1,
    r: 0,
    c: ["#d4e9ec", "#37b1d7", "#506c71"]
  }], 0.9, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BLUE_CORD] = sprite[SPRITE.INV_BLUE_CORD];
  sprite[SPRITE.INV_FUR] = create_craft_button(1, [{
    f: create_fur,
    x: -3,
    y: -3,
    a: 1,
    r: 0,
    c: ["#ef96be", "#ffffff"]
  }], 0.5, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_FUR_BOAR] = create_craft_button(1, [{
    f: create_fur,
    x: -3,
    y: -3,
    a: 1,
    r: 0,
    c: ["#55423e", "#ffffff"]
  }], 0.5, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_SPECIAL_FUR] = create_craft_button(1, [{
    f: create_special_fur,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#ffffff", "#e7e2e2", "#b35c46", "#a34d37"]
  }], 0.25, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_SPECIAL_FUR_2] = create_craft_button(1, [{
    f: create_special_fur,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#14151b", "#000000", "#b35c46", "#a34d37"]
  }], 0.25, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_KRAKEN_SKIN] = create_craft_button(1, [{
    f: create_fur,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#201851", "#b6222a"]
  }], 0.5, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_FUR_WOLF] = create_craft_button(1, [{
    f: create_fur,
    x: -3,
    y: -3,
    a: 1,
    r: 0,
    c: ["#231f20", "#b6222a"]
  }], 0.5, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_FUR_WINTER] = create_craft_button(1, [{
    f: create_fur,
    x: -3,
    y: -3,
    a: 1,
    r: 0,
    c: ["#ffffff", "#b6222a"]
  }], 0.5, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_EARMUFFS] = create_craft_button(1, [{
    f: create_earmuff,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#f9efeb", "#dfd1cb", "#3e3c25", "#4d4a2e"]
  }], 0.4, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_EARMUFFS] = sprite[SPRITE.INV_EARMUFFS];
  sprite[SPRITE.INV_COAT] = create_craft_button(1, [{
    f: create_coat,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#3e3c25", "#4d4a2e", "#f9efeb", "#dfd1cb"]
  }], 0.4, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_COAT] = sprite[SPRITE.INV_COAT];
  sprite[SPRITE.INV_CAP_SCARF] = create_craft_button(1, [{
    f: create_cap_scarf,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#171a19", "#dee7e7", "#b8cccb", "#ffffff", "#e3e8e8"]
  }], 0.4, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_CAP_SCARF] = sprite[SPRITE.INV_CAP_SCARF];
  sprite[SPRITE.INV_CHRISTMAS_HAT] = create_craft_button(1, [{
    f: create_christmas_hat,
    x: 0,
    y: 5,
    a: 1,
    r: 0,
    c: ["#171a19", "#c5232c", "#84191d", "#a72027", "#fef4f4", "#e9dad9"]
  }], 0.35, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CHEST_CHRISTMAS_HAT] = sprite[SPRITE.INV_CHRISTMAS_HAT];
  sprite[SPRITE.INV_ELF_HAT] = create_craft_button(1, [{
    f: create_elf_hat,
    x: 0,
    y: 5,
    a: 1,
    r: 0,
    c: ["#171a19", "#0f964c", "#106e3b", "#138344", "#fef4f4", "#e9dad9", "#C5232C", "#A92D2D"]
  }], 0.35, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CHEST_ELF_HAT] = sprite[SPRITE.INV_ELF_HAT];
  sprite[SPRITE.INV_BANDAGE] = create_craft_button(1, [{
    f: create_bandage,
    x: -2,
    y: -2,
    a: 1,
    r: 0,
    c: ["#ffffff", "#cec0c4"]
  }], 0.35, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BANDAGE] = sprite[SPRITE.INV_BANDAGE];
  sprite[SPRITE.INV_BAG] = [];
  sprite[SPRITE.INV_BAG][0] = IMAGES.INV_BAG_OUT;
  sprite[SPRITE.INV_BAG][1] = IMAGES.INV_BAG_IN;
  sprite[SPRITE.INV_BAG][2] = IMAGES.INV_BAG_CLICK;
  sprite[SPRITE.CRAFT_BAG] = sprite[SPRITE.INV_BAG];
  sprite[SPRITE.INV_PITCHFORK] = [];
  sprite[SPRITE.INV_PITCHFORK][0] = IMAGES.INV_PITCHFORK_OUT;
  sprite[SPRITE.INV_PITCHFORK][1] = IMAGES.INV_PITCHFORK_IN;
  sprite[SPRITE.INV_PITCHFORK][2] = IMAGES.INV_PITCHFORK_CLICK;
  sprite[SPRITE.CRAFT_PITCHFORK] = sprite[SPRITE.INV_PITCHFORK];
  sprite[SPRITE.CHEST_PITCHFORK] = sprite[SPRITE.INV_PITCHFORK];
  sprite[SPRITE.INV_PITCHFORK2] = [];
  sprite[SPRITE.INV_PITCHFORK2][0] = IMAGES.INV_PITCHFORK2_OUT;
  sprite[SPRITE.INV_PITCHFORK2][1] = IMAGES.INV_PITCHFORK2_IN;
  sprite[SPRITE.INV_PITCHFORK2][2] = IMAGES.INV_PITCHFORK2_CLICK;
  sprite[SPRITE.CRAFT_PITCHFORK2] = sprite[SPRITE.INV_PITCHFORK2];
  sprite[SPRITE.CHEST_PITCHFORK2] = sprite[SPRITE.INV_PITCHFORK2];
  sprite[SPRITE.INV_PITCHFORK_PART] = [];
  sprite[SPRITE.INV_PITCHFORK_PART][0] = IMAGES.INV_PITCHFORK_PART_CLICK;
  sprite[SPRITE.INV_PITCHFORK_PART][1] = IMAGES.INV_PITCHFORK_PART_CLICK;
  sprite[SPRITE.INV_PITCHFORK_PART][2] = IMAGES.INV_PITCHFORK_PART_CLICK;
  sprite[SPRITE.CHEST_PITCHFORK_PART] = sprite[SPRITE.INV_PITCHFORK_PART];
  sprite[SPRITE.INV_PILOT_HELMET] = [];
  sprite[SPRITE.INV_PILOT_HELMET][0] = IMAGES.INV_PILOT_HELMET_OUT;
  sprite[SPRITE.INV_PILOT_HELMET][1] = IMAGES.INV_PILOT_HELMET_IN;
  sprite[SPRITE.INV_PILOT_HELMET][2] = IMAGES.INV_PILOT_HELMET_CLICK;
  sprite[SPRITE.CRAFT_PILOT_HELMET] = sprite[SPRITE.INV_PILOT_HELMET];
  sprite[SPRITE.CHEST_PILOT_HELMET] = sprite[SPRITE.INV_PILOT_HELMET];
  sprite[SPRITE.INV_PILOT_GLASSES] = [];
  sprite[SPRITE.INV_PILOT_GLASSES][0] = IMAGES.INV_PILOT_GLASSES_CLICK;
  sprite[SPRITE.INV_PILOT_GLASSES][1] = IMAGES.INV_PILOT_GLASSES_CLICK;
  sprite[SPRITE.INV_PILOT_GLASSES][2] = IMAGES.INV_PILOT_GLASSES_CLICK;
  sprite[SPRITE.CHEST_PILOT_GLASSES] = sprite[SPRITE.INV_PILOT_GLASSES];
  sprite[SPRITE.INV_WOOD_TOWER] = [];
  sprite[SPRITE.INV_WOOD_TOWER][0] = IMAGES.INV_WOOD_TOWER_OUT;
  sprite[SPRITE.INV_WOOD_TOWER][1] = IMAGES.INV_WOOD_TOWER_IN;
  sprite[SPRITE.INV_WOOD_TOWER][2] = IMAGES.INV_WOOD_TOWER_CLICK;
  sprite[SPRITE.CRAFT_WOOD_TOWER] = sprite[SPRITE.INV_WOOD_TOWER];
  sprite[SPRITE.CHEST_WOOD_TOWER] = sprite[SPRITE.INV_WOOD_TOWER];
  sprite[SPRITE.INV_WOOD_DOOR_SPIKE] = [];
  sprite[SPRITE.INV_WOOD_DOOR_SPIKE][0] = IMAGES.INV_WOOD_DOOR_SPIKE_OUT;
  sprite[SPRITE.INV_WOOD_DOOR_SPIKE][1] = IMAGES.INV_WOOD_DOOR_SPIKE_IN;
  sprite[SPRITE.INV_WOOD_DOOR_SPIKE][2] = IMAGES.INV_WOOD_DOOR_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_WOOD_DOOR_SPIKE] = sprite[SPRITE.INV_WOOD_DOOR_SPIKE];
  sprite[SPRITE.CHEST_WOOD_DOOR_SPIKE] = sprite[SPRITE.INV_WOOD_DOOR_SPIKE];
  sprite[SPRITE.INV_STONE_DOOR_SPIKE] = [];
  sprite[SPRITE.INV_STONE_DOOR_SPIKE][0] = IMAGES.INV_STONE_DOOR_SPIKE_OUT;
  sprite[SPRITE.INV_STONE_DOOR_SPIKE][1] = IMAGES.INV_STONE_DOOR_SPIKE_IN;
  sprite[SPRITE.INV_STONE_DOOR_SPIKE][2] = IMAGES.INV_STONE_DOOR_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_STONE_DOOR_SPIKE] = sprite[SPRITE.INV_STONE_DOOR_SPIKE];
  sprite[SPRITE.CHEST_STONE_DOOR_SPIKE] = sprite[SPRITE.INV_STONE_DOOR_SPIKE];
  sprite[SPRITE.INV_GOLD_DOOR_SPIKE] = [];
  sprite[SPRITE.INV_GOLD_DOOR_SPIKE][0] = IMAGES.INV_GOLD_DOOR_SPIKE_OUT;
  sprite[SPRITE.INV_GOLD_DOOR_SPIKE][1] = IMAGES.INV_GOLD_DOOR_SPIKE_IN;
  sprite[SPRITE.INV_GOLD_DOOR_SPIKE][2] = IMAGES.INV_GOLD_DOOR_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_GOLD_DOOR_SPIKE] = sprite[SPRITE.INV_GOLD_DOOR_SPIKE];
  sprite[SPRITE.CHEST_GOLD_DOOR_SPIKE] = sprite[SPRITE.INV_GOLD_DOOR_SPIKE];
  sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE] = [];
  sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE][0] = IMAGES.INV_DIAMOND_DOOR_SPIKE_OUT;
  sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE][1] = IMAGES.INV_DIAMOND_DOOR_SPIKE_IN;
  sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE][2] = IMAGES.INV_DIAMOND_DOOR_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_DIAMOND_DOOR_SPIKE] = sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE];
  sprite[SPRITE.CHEST_DIAMOND_DOOR_SPIKE] = sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE];
  sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE] = [];
  sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE][0] = IMAGES.INV_AMETHYST_DOOR_SPIKE_OUT;
  sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE][1] = IMAGES.INV_AMETHYST_DOOR_SPIKE_IN;
  sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE][2] = IMAGES.INV_AMETHYST_DOOR_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_AMETHYST_DOOR_SPIKE] = sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE];
  sprite[SPRITE.CHEST_AMETHYST_DOOR_SPIKE] = sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE];
  sprite[SPRITE.INV_REIDITE_DOOR_SPIKE] = [];
  sprite[SPRITE.INV_REIDITE_DOOR_SPIKE][0] = IMAGES.INV_REIDITE_DOOR_SPIKE_OUT;
  sprite[SPRITE.INV_REIDITE_DOOR_SPIKE][1] = IMAGES.INV_REIDITE_DOOR_SPIKE_IN;
  sprite[SPRITE.INV_REIDITE_DOOR_SPIKE][2] = IMAGES.INV_REIDITE_DOOR_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_DOOR_SPIKE] = sprite[SPRITE.INV_REIDITE_DOOR_SPIKE];
  sprite[SPRITE.CHEST_REIDITE_DOOR_SPIKE] = sprite[SPRITE.INV_REIDITE_DOOR_SPIKE];
  sprite[SPRITE.INV_REIDITE_DOOR] = [];
  sprite[SPRITE.INV_REIDITE_DOOR][0] = IMAGES.INV_REIDITE_DOOR_OUT;
  sprite[SPRITE.INV_REIDITE_DOOR][1] = IMAGES.INV_REIDITE_DOOR_IN;
  sprite[SPRITE.INV_REIDITE_DOOR][2] = IMAGES.INV_REIDITE_DOOR_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_DOOR] = sprite[SPRITE.INV_REIDITE_DOOR];
  sprite[SPRITE.CHEST_REIDITE_DOOR] = sprite[SPRITE.INV_REIDITE_DOOR];
  sprite[SPRITE.INV_REIDITE_SPIKE] = [];
  sprite[SPRITE.INV_REIDITE_SPIKE][0] = IMAGES.INV_REIDITE_SPIKE_OUT;
  sprite[SPRITE.INV_REIDITE_SPIKE][1] = IMAGES.INV_REIDITE_SPIKE_IN;
  sprite[SPRITE.INV_REIDITE_SPIKE][2] = IMAGES.INV_REIDITE_SPIKE_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_SPIKE] = sprite[SPRITE.INV_REIDITE_SPIKE];
  sprite[SPRITE.CHEST_REIDITE_SPIKE] = sprite[SPRITE.INV_REIDITE_SPIKE];
  sprite[SPRITE.INV_REIDITE_WALL] = [];
  sprite[SPRITE.INV_REIDITE_WALL][0] = IMAGES.INV_REIDITE_WALL_OUT;
  sprite[SPRITE.INV_REIDITE_WALL][1] = IMAGES.INV_REIDITE_WALL_IN;
  sprite[SPRITE.INV_REIDITE_WALL][2] = IMAGES.INV_REIDITE_WALL_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_WALL] = sprite[SPRITE.INV_REIDITE_WALL];
  sprite[SPRITE.CHEST_REIDITE_WALL] = sprite[SPRITE.INV_REIDITE_WALL];
  sprite[SPRITE.INV_PENGUIN_FEATHER] = [];
  sprite[SPRITE.INV_PENGUIN_FEATHER][0] = IMAGES.INV_PENGUIN_FEATHER;
  sprite[SPRITE.INV_PENGUIN_FEATHER][1] = IMAGES.INV_PENGUIN_FEATHER;
  sprite[SPRITE.INV_PENGUIN_FEATHER][2] = IMAGES.INV_PENGUIN_FEATHER;
  sprite[SPRITE.CRAFT_PENGUIN_FEATHER] = sprite[SPRITE.INV_PENGUIN_FEATHER];
  sprite[SPRITE.CHEST_PENGUIN_FEATHER] = sprite[SPRITE.INV_PENGUIN_FEATHER];
  sprite[SPRITE.INV_HAWK_FEATHER] = [];
  sprite[SPRITE.INV_HAWK_FEATHER][0] = IMAGES.INV_HAWK_FEATHER;
  sprite[SPRITE.INV_HAWK_FEATHER][1] = IMAGES.INV_HAWK_FEATHER;
  sprite[SPRITE.INV_HAWK_FEATHER][2] = IMAGES.INV_HAWK_FEATHER;
  sprite[SPRITE.CRAFT_HAWK_FEATHER] = sprite[SPRITE.INV_HAWK_FEATHER];
  sprite[SPRITE.CHEST_HAWK_FEATHER] = sprite[SPRITE.INV_HAWK_FEATHER];
  sprite[SPRITE.INV_VULTURE_FEATHER] = [];
  sprite[SPRITE.INV_VULTURE_FEATHER][0] = IMAGES.INV_VULTURE_FEATHER;
  sprite[SPRITE.INV_VULTURE_FEATHER][1] = IMAGES.INV_VULTURE_FEATHER;
  sprite[SPRITE.INV_VULTURE_FEATHER][2] = IMAGES.INV_VULTURE_FEATHER;
  sprite[SPRITE.CRAFT_VULTURE_FEATHER] = sprite[SPRITE.INV_VULTURE_FEATHER];
  sprite[SPRITE.CHEST_VULTURE_FEATHER] = sprite[SPRITE.INV_VULTURE_FEATHER];
  sprite[SPRITE.INV_EMERALD] = [];
  sprite[SPRITE.INV_EMERALD][0] = IMAGES.INV_EMERALD;
  sprite[SPRITE.INV_EMERALD][1] = IMAGES.INV_EMERALD;
  sprite[SPRITE.INV_EMERALD][2] = IMAGES.INV_EMERALD;
  sprite[SPRITE.CHEST_EMERALD] = sprite[SPRITE.INV_EMERALD];
  sprite[SPRITE.INV_SADDLE] = [];
  sprite[SPRITE.INV_SADDLE][0] = IMAGES.INV_SADDLE_OUT;
  sprite[SPRITE.INV_SADDLE][1] = IMAGES.INV_SADDLE_IN;
  sprite[SPRITE.INV_SADDLE][2] = IMAGES.INV_SADDLE_CLICK;
  sprite[SPRITE.CRAFT_SADDLE] = sprite[SPRITE.INV_SADDLE];
  sprite[SPRITE.CHEST_SADDLE] = sprite[SPRITE.INV_SADDLE];
  sprite[SPRITE.INV_WAND1] = [];
  sprite[SPRITE.INV_WAND1][0] = IMAGES.INV_WAND1_OUT;
  sprite[SPRITE.INV_WAND1][1] = IMAGES.INV_WAND1_IN;
  sprite[SPRITE.INV_WAND1][2] = IMAGES.INV_WAND1_CLICK;
  sprite[SPRITE.CRAFT_WAND1] = sprite[SPRITE.INV_WAND1];
  sprite[SPRITE.CHEST_WAND1] = sprite[SPRITE.INV_WAND1];
  sprite[SPRITE.INV_WAND2] = [];
  sprite[SPRITE.INV_WAND2][0] = IMAGES.INV_WAND2_OUT;
  sprite[SPRITE.INV_WAND2][1] = IMAGES.INV_WAND2_IN;
  sprite[SPRITE.INV_WAND2][2] = IMAGES.INV_WAND2_CLICK;
  sprite[SPRITE.CRAFT_WAND2] = sprite[SPRITE.INV_WAND2];
  sprite[SPRITE.CHEST_WAND2] = sprite[SPRITE.INV_WAND2];
  sprite[SPRITE.INV_MOUNT_BOAR] = [];
  sprite[SPRITE.INV_MOUNT_BOAR][0] = IMAGES.INV_MOUNT_BOAR_OUT;
  sprite[SPRITE.INV_MOUNT_BOAR][1] = IMAGES.INV_MOUNT_BOAR_IN;
  sprite[SPRITE.INV_MOUNT_BOAR][2] = IMAGES.INV_MOUNT_BOAR_CLICK;
  sprite[SPRITE.CRAFT_MOUNT_BOAR] = sprite[SPRITE.INV_MOUNT_BOAR];
  sprite[SPRITE.CHEST_MOUNT_BOAR] = sprite[SPRITE.INV_MOUNT_BOAR];
  sprite[SPRITE.INV_CRAB_BOSS] = [];
  sprite[SPRITE.INV_CRAB_BOSS][0] = IMAGES.INV_CRAB_BOSS_OUT;
  sprite[SPRITE.INV_CRAB_BOSS][1] = IMAGES.INV_CRAB_BOSS_IN;
  sprite[SPRITE.INV_CRAB_BOSS][2] = IMAGES.INV_CRAB_BOSS_CLICK;
  sprite[SPRITE.CRAFT_CRAB_BOSS] = sprite[SPRITE.INV_CRAB_BOSS];
  sprite[SPRITE.CHEST_CRAB_BOSS] = sprite[SPRITE.INV_CRAB_BOSS];
  sprite[SPRITE.INV_HAWK] = [];
  sprite[SPRITE.INV_HAWK][0] = IMAGES.INV_HAWK_OUT;
  sprite[SPRITE.INV_HAWK][1] = IMAGES.INV_HAWK_IN;
  sprite[SPRITE.INV_HAWK][2] = IMAGES.INV_HAWK_CLICK;
  sprite[SPRITE.CRAFT_HAWK] = sprite[SPRITE.INV_HAWK];
  sprite[SPRITE.CHEST_HAWK] = sprite[SPRITE.INV_HAWK];
  sprite[SPRITE.INV_VULTURE] = [];
  sprite[SPRITE.INV_VULTURE][0] = IMAGES.INV_VULTURE_OUT;
  sprite[SPRITE.INV_VULTURE][1] = IMAGES.INV_VULTURE_IN;
  sprite[SPRITE.INV_VULTURE][2] = IMAGES.INV_VULTURE_CLICK;
  sprite[SPRITE.CRAFT_VULTURE] = sprite[SPRITE.INV_VULTURE];
  sprite[SPRITE.CHEST_VULTURE] = sprite[SPRITE.INV_VULTURE];
  sprite[SPRITE.INV_TURBAN1] = [];
  sprite[SPRITE.INV_TURBAN1][0] = IMAGES.INV_TURBAN1_OUT;
  sprite[SPRITE.INV_TURBAN1][1] = IMAGES.INV_TURBAN1_IN;
  sprite[SPRITE.INV_TURBAN1][2] = IMAGES.INV_TURBAN1_CLICK;
  sprite[SPRITE.CRAFT_TURBAN1] = sprite[SPRITE.INV_TURBAN1];
  sprite[SPRITE.CHEST_TURBAN1] = sprite[SPRITE.INV_TURBAN1];
  sprite[SPRITE.INV_TURBAN2] = [];
  sprite[SPRITE.INV_TURBAN2][0] = IMAGES.INV_TURBAN2_OUT;
  sprite[SPRITE.INV_TURBAN2][1] = IMAGES.INV_TURBAN2_IN;
  sprite[SPRITE.INV_TURBAN2][2] = IMAGES.INV_TURBAN2_CLICK;
  sprite[SPRITE.CRAFT_TURBAN2] = sprite[SPRITE.INV_TURBAN2];
  sprite[SPRITE.CHEST_TURBAN2] = sprite[SPRITE.INV_TURBAN2];
  sprite[SPRITE.INV_PLANE] = [];
  sprite[SPRITE.INV_PLANE][0] = IMAGES.INV_PLANE_OUT;
  sprite[SPRITE.INV_PLANE][1] = IMAGES.INV_PLANE_IN;
  sprite[SPRITE.INV_PLANE][2] = IMAGES.INV_PLANE_CLICK;
  sprite[SPRITE.CRAFT_PLANE] = sprite[SPRITE.INV_PLANE];
  sprite[SPRITE.CHEST_PLANE] = sprite[SPRITE.INV_PLANE];
  sprite[SPRITE.INV_BABY_DRAGON] = [];
  sprite[SPRITE.INV_BABY_DRAGON][0] = IMAGES.INV_BABY_DRAGON_OUT;
  sprite[SPRITE.INV_BABY_DRAGON][1] = IMAGES.INV_BABY_DRAGON_IN;
  sprite[SPRITE.INV_BABY_DRAGON][2] = IMAGES.INV_BABY_DRAGON_CLICK;
  sprite[SPRITE.CRAFT_BABY_DRAGON] = sprite[SPRITE.INV_BABY_DRAGON];
  sprite[SPRITE.CHEST_BABY_DRAGON] = sprite[SPRITE.INV_BABY_DRAGON];
  sprite[SPRITE.INV_BABY_MAMMOTH] = [];
  sprite[SPRITE.INV_BABY_MAMMOTH][0] = IMAGES.INV_BABY_MAMMOTH_OUT;
  sprite[SPRITE.INV_BABY_MAMMOTH][1] = IMAGES.INV_BABY_MAMMOTH_IN;
  sprite[SPRITE.INV_BABY_MAMMOTH][2] = IMAGES.INV_BABY_MAMMOTH_CLICK;
  sprite[SPRITE.CRAFT_BABY_MAMMOTH] = sprite[SPRITE.INV_BABY_MAMMOTH];
  sprite[SPRITE.CHEST_BABY_MAMMOTH] = sprite[SPRITE.INV_BABY_MAMMOTH];
  sprite[SPRITE.INV_BABY_LAVA] = [];
  sprite[SPRITE.INV_BABY_LAVA][0] = IMAGES.INV_BABY_LAVA_OUT;
  sprite[SPRITE.INV_BABY_LAVA][1] = IMAGES.INV_BABY_LAVA_IN;
  sprite[SPRITE.INV_BABY_LAVA][2] = IMAGES.INV_BABY_LAVA_CLICK;
  sprite[SPRITE.CRAFT_BABY_LAVA] = sprite[SPRITE.INV_BABY_LAVA];
  sprite[SPRITE.CHEST_BABY_LAVA] = sprite[SPRITE.INV_BABY_LAVA];
  sprite[SPRITE.INV_BREAD_OVEN] = create_craft_button(1, [{
    f: create_bread_oven,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#515C57", "#3A4942", "#68736F", "#C1C0C0", "#be8d50", "#7d5234", "#222825", "#4D5752", "#e48727", "#d4a872", "#232a27"]
  }, {
    f: create_bread_light_up,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#e4c027"]
  }], 0.14, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BREAD_OVEN] = sprite[SPRITE.INV_BREAD_OVEN];
  sprite[SPRITE.INV_FURNACE] = create_craft_button(1, [{
    f: create_furnace_on,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#939393", "#5f6061", "#c0c0c0", "#ffad22", "#fffdd5", "#fee764"]
  }], 0.18, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_FURNACE] = sprite[SPRITE.INV_FURNACE];
  sprite[SPRITE.INV_BED] = create_craft_button(1, [{
    f: create_bed,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#554139", "#3f332a", "#261912", "#eee6c5", "#d1c599", "#554139", "#3f332a", "#86509b", "#703a99", "#ded4b4", "#d6ceab", "#c796c2", "#bc83b7", "#ffffff", "#87519c", "#703e94", "#3eb67f", "#218f65", "#efe7c5", "#d093c4"]
  }], 0.32, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BED] = sprite[SPRITE.INV_BED];
  sprite[SPRITE.CHEST_BED] = sprite[SPRITE.INV_BED];
  sprite[SPRITE.INV_CRAB_LOOT] = create_craft_button(1, [{
    f: create_crab_loot,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#c04933", "#a33e2b", "#ee593d", "#c04933"]
  }], 0.17, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CHEST_CRAB_LOOT] = sprite[SPRITE.INV_CRAB_LOOT];
  sprite[SPRITE.INV_CRAB_SPEAR] = create_craft_button(1, [{
    f: create_crab_spear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#58452b", "#47341d", "#ee593d", "#c04933", "#c04933", "#a33e2b", "#c3be9a", "#7f6d52"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_CRAB_SPEAR] = sprite[SPRITE.INV_CRAB_SPEAR];
  sprite[SPRITE.CHEST_CRAB_SPEAR] = sprite[SPRITE.INV_CRAB_SPEAR];
  sprite[SPRITE.INV_WOOD_SPEAR] = create_craft_button(1, [{
    f: create_wood_spear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#58452b", "#47341d", "#765d42", "#c3be9a", "#7f6d52"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_WOOD_SPEAR] = sprite[SPRITE.INV_WOOD_SPEAR];
  sprite[SPRITE.INV_SPEAR] = create_craft_button(1, [{
    f: create_stonespear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#4d2d14", "#432516", "#c3be9a", "#7f6d52", "#7a7575", "#454749", "#8c8787", "#939393", "#5f6061", "#aaa6a6"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SPEAR] = sprite[SPRITE.INV_SPEAR];
  sprite[SPRITE.INV_GOLD_SPEAR] = create_craft_button(1, [{
    f: create_goldspear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#493e26", "#382e19", "#a69e39", "#9c8828", "#bab143", "#c4bc51", "#b29c32", "#d2ca59"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_GOLD_SPEAR] = sprite[SPRITE.INV_GOLD_SPEAR];
  sprite[SPRITE.INV_DIAMOND_SPEAR] = create_craft_button(1, [{
    f: create_diamondspear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#262114", "#211108", "#4ba8b4", "#198a82", "#6ccad7", "#63c9d6", "#29aaa1", "#7bd9e6"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_DIAMOND_SPEAR] = sprite[SPRITE.INV_DIAMOND_SPEAR];
  sprite[SPRITE.INV_AMETHYST_SPEAR] = create_craft_button(1, [{
    f: create_amespear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#262114", "#211108", "#9443b1", "#6f1988", "#a752c6", "#9e35be", "#8c29aa", "#b864d6"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_AMETHYST_SPEAR] = sprite[SPRITE.INV_AMETHYST_SPEAR];
  sprite[SPRITE.INV_DRAGON_SPEAR] = create_craft_button(1, [{
    f: create_dragon_spear,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#1e2b34", "#151c24", "#99d7dd", "#7dcbd1", "#c6e8eb", "#aadee8", "#b7e2e5"]
  }], 0.38, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_DRAGON_SPEAR] = sprite[SPRITE.INV_DRAGON_SPEAR];
  sprite[SPRITE.CHEST_DRAGON_SPEAR] = sprite[SPRITE.INV_DRAGON_SPEAR];
  sprite[SPRITE.INV_HAMMER] = create_craft_button(1, [{
    f: create_hammer,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"]
  }], 0.52, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_HAMMER] = sprite[SPRITE.INV_HAMMER];
  sprite[SPRITE.INV_SPANNER] = create_craft_button(1, [{
    f: create_spanner,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#939393", "#5f6061"]
  }], 0.3, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SPANNER] = sprite[SPRITE.INV_SPANNER];
  sprite[SPRITE.INV_SUPER_HAMMER] = create_craft_button(1, [{
    f: create_superhammer,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#9b5927", "#7a3610", "#1e0302", "#0d825b", "#6bd16e", "#17915d", "#89e5aa", "#16935d", "#a0efc4", "#28b26d", "#cdf4cb", "#42cc90"]
  }], 0.52, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SUPER_HAMMER] = sprite[SPRITE.INV_SUPER_HAMMER];
  sprite[SPRITE.INV_HAMMER_GOLD] = create_craft_button(1, [{
    f: create_hammer,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"]
  }], 0.52, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_HAMMER_GOLD] = sprite[SPRITE.INV_HAMMER_GOLD];
  sprite[SPRITE.INV_HAMMER_DIAMOND] = create_craft_button(1, [{
    f: create_hammer,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"]
  }], 0.52, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_HAMMER_DIAMOND] = sprite[SPRITE.INV_HAMMER_DIAMOND];
  sprite[SPRITE.INV_HAMMER_AMETHYST] = create_craft_button(1, [{
    f: create_hammer,
    x: 2,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"]
  }], 0.52, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_HAMMER_AMETHYST] = sprite[SPRITE.INV_HAMMER_AMETHYST];
  sprite[SPRITE.INV_HAMMER_REIDITE] = [];
  sprite[SPRITE.INV_HAMMER_REIDITE][0] = IMAGES.INV_HAMMER_REIDITE_OUT;
  sprite[SPRITE.INV_HAMMER_REIDITE][1] = IMAGES.INV_HAMMER_REIDITE_IN;
  sprite[SPRITE.INV_HAMMER_REIDITE][2] = IMAGES.INV_HAMMER_REIDITE_CLICK;
  sprite[SPRITE.CHEST_HAMMER_REIDITE] = sprite[SPRITE.INV_HAMMER_REIDITE];
  sprite[SPRITE.CRAFT_HAMMER_REIDITE] = sprite[SPRITE.INV_HAMMER_REIDITE];
  sprite[SPRITE.INV_EMERALD_MACHINE] = [];
  sprite[SPRITE.INV_EMERALD_MACHINE][0] = IMAGES.INV_EMERALD_MACHINE_OUT;
  sprite[SPRITE.INV_EMERALD_MACHINE][1] = IMAGES.INV_EMERALD_MACHINE_IN;
  sprite[SPRITE.INV_EMERALD_MACHINE][2] = IMAGES.INV_EMERALD_MACHINE_CLICK;
  sprite[SPRITE.CHEST_EMERALD_MACHINE] = sprite[SPRITE.INV_EMERALD_MACHINE];
  sprite[SPRITE.CRAFT_EMERALD_MACHINE] = sprite[SPRITE.INV_EMERALD_MACHINE];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE] = [];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE][0] = IMAGES.INV_EXTRACTOR_MACHINE_STONE_OUT;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE][1] = IMAGES.INV_EXTRACTOR_MACHINE_STONE_IN;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE][2] = IMAGES.INV_EXTRACTOR_MACHINE_STONE_CLICK;
  sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_STONE] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE];
  sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_STONE] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD] = [];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD][0] = IMAGES.INV_EXTRACTOR_MACHINE_GOLD_OUT;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD][1] = IMAGES.INV_EXTRACTOR_MACHINE_GOLD_IN;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD][2] = IMAGES.INV_EXTRACTOR_MACHINE_GOLD_CLICK;
  sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_GOLD] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD];
  sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_GOLD] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND] = [];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND][0] = IMAGES.INV_EXTRACTOR_MACHINE_DIAMOND_OUT;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND][1] = IMAGES.INV_EXTRACTOR_MACHINE_DIAMOND_IN;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND][2] = IMAGES.INV_EXTRACTOR_MACHINE_DIAMOND_CLICK;
  sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_DIAMOND] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND];
  sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_DIAMOND] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST] = [];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST][0] = IMAGES.INV_EXTRACTOR_MACHINE_AMETHYST_OUT;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST][1] = IMAGES.INV_EXTRACTOR_MACHINE_AMETHYST_IN;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST][2] = IMAGES.INV_EXTRACTOR_MACHINE_AMETHYST_CLICK;
  sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_AMETHYST] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST];
  sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_AMETHYST] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE] = [];
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE][0] = IMAGES.INV_EXTRACTOR_MACHINE_REIDITE_OUT;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE][1] = IMAGES.INV_EXTRACTOR_MACHINE_REIDITE_IN;
  sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE][2] = IMAGES.INV_EXTRACTOR_MACHINE_REIDITE_CLICK;
  sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_REIDITE] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE];
  sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_REIDITE] = sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE];
  sprite[SPRITE.INV_LOCK] = create_craft_button(1, [{
    f: create_lock,
    x: -2,
    y: -2,
    a: 1,
    r: 0,
    c: ["#141414", "#816511", "#c4a23a", "#3a3a3a"]
  }], 0.8, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_LOCK] = sprite[SPRITE.INV_LOCK];
  sprite[SPRITE.INV_LOCKPICK] = create_craft_button(1, [{
    f: create_lockpick,
    x: -2,
    y: -2,
    a: 1,
    r: -Math.PI / 5,
    c: ["#141414", "#c4a23a", "#816511"]
  }], 0.08, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_LOCKPICK] = sprite[SPRITE.INV_LOCKPICK];
  sprite[SPRITE.INV_DRAGON_HEART] = create_craft_button(1, [{
    f: create_dragon_heart,
    x: -2,
    y: -2,
    a: 1,
    r: 0,
    c: ["#141414", "#178a99", "#0a6372", "#03282e"]
  }], 0.3, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.7);
  sprite[SPRITE.INV_LAVA_HEART] = create_craft_button(1, [{
    f: create_dragon_heart,
    x: -2,
    y: -2,
    a: 1,
    r: 0,
    c: ["#120202", "#991616", "#750a0a", "#120202"]
  }], 0.3, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.7);
  sprite[SPRITE.INV_RESURRECTION] = create_craft_button(1, [{
    f: create_resurrection_ground,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#347f93", "#54a4ba"]
  }, {
    f: create_resurrection,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#347f93", "#54a4ba", "#1c2528", "#a9e4ed", "#86d4e0", "#959da0", "#697072", "#929da0", "#afb9bc", "#418ba5", "#59b8ce"]
  }, {
    f: create_resurrection_rotate,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#a9e4ed", "#86d4e0"]
  }, {
    f: create_resurrection_hole,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#a9e4ed", "#86d4e0", "#418ba5", "#59b8ce"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_RESURRECTION] = sprite[SPRITE.INV_RESURRECTION];
  sprite[SPRITE.INV_TOTEM] = create_craft_button(1, [{
    f: create_headtotem,
    x: 45,
    y: 70,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#4c3a15", "#634828", "#564021"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_TOTEM] = sprite[SPRITE.INV_TOTEM];
  sprite[SPRITE.INV_AMETHYST_HELMET] = create_craft_button(1, [{
    f: create_amethyst_helmet,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#8c55b7", "#652d8e", "#79359e", "#5eccd1", "#4badad", "#9e6ac6"]
  }], 0.52, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_AMETHYST_HELMET] = sprite[SPRITE.INV_AMETHYST_HELMET];
  sprite[SPRITE.INV_WINTER_HOOD] = create_craft_button(1, [{
    f: create_winter_hood,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#2a2938", "#242330", "#313041", "#1b1a25"]
  }], 0.12, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_WINTER_HOOD] = sprite[SPRITE.INV_WINTER_HOOD];
  sprite[SPRITE.INV_HOOD] = create_craft_button(1, [{
    f: create_hood,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#2a2938", "#242330", "#313041"]
  }], 0.25, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_HOOD] = sprite[SPRITE.INV_HOOD];
  sprite[SPRITE.INV_WINTER_PEASANT] = create_craft_button(1, [{
    f: create_peasant,
    x: 0,
    y: 3,
    a: 1,
    r: 0,
    c: ["#1d1d22", "#e2e1e1", "#d2cbcb", "#cfcbc8", "#beb5b5", "#ada0a0"]
  }], 0.39, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_WINTER_PEASANT] = sprite[SPRITE.INV_WINTER_PEASANT];
  sprite[SPRITE.INV_PEASANT] = create_craft_button(1, [{
    f: create_peasant,
    x: 0,
    y: 3,
    a: 1,
    r: 0,
    c: ["#1d1d22", "#8c7654", "#785f4c", "#a88e6c", "#785f4c", "#705845"]
  }], 0.39, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_PEASANT] = sprite[SPRITE.INV_PEASANT];
  sprite[SPRITE.INV_CROWN_GREEN] = create_craft_button(1, [{
    f: create_crown_life,
    x: 0,
    y: 10,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#A5A244", "#D8DC74", "#C0BF55", "#49B669", "#19994C", "#71C187"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_CROWN_GREEN] = sprite[SPRITE.INV_CROWN_GREEN];
  sprite[SPRITE.INV_CROWN_ORANGE] = create_craft_button(1, [{
    f: create_crown_life,
    x: 0,
    y: 10,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#A5A244", "#D8DC74", "#C0BF55", "#C45727", "#994617", "#DB9358"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_CROWN_ORANGE] = sprite[SPRITE.INV_CROWN_ORANGE];
  sprite[SPRITE.INV_CROWN_BLUE] = create_craft_button(1, [{
    f: create_crown_life,
    x: 0,
    y: 10,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#A5A244", "#D8DC74", "#C0BF55", "#2792C1", "#196599", "#59C0D8"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_CROWN_BLUE] = sprite[SPRITE.INV_CROWN_BLUE];
  sprite[SPRITE.INV_CROWN_CRAB] = create_craft_button(1, [{
    f: create_crab_crown,
    x: -1,
    y: 0,
    a: 1,
    r: 0,
    c: ["#000000", "#b03431", "#94312d", "#bd3c33", "#de5445"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_CROWN_CRAB] = sprite[SPRITE.INV_CROWN_CRAB];
  sprite[SPRITE.CHEST_CROWN_CRAB] = sprite[SPRITE.INV_CROWN_CRAB];
  sprite[SPRITE.INV_DRAGON_HELMET] = create_craft_button(1, [{
    f: create_dragon_helmet,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#0d1b1c", "#cae9eb", "#75bcae", "#ffffff", "#51736d", "#2b4d48", "#1b3a3a", "#80ccca", "#59ada7"]
  }], 0.2, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_DRAGON_HELMET] = sprite[SPRITE.INV_DRAGON_HELMET];
  sprite[SPRITE.INV_DRAGON_SWORD] = create_craft_button(1, [{
    f: create_dragon_sword,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#284c4a", "#193533", "#c7efef", "#7fccca"]
  }], 0.75, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_DRAGON_SWORD] = sprite[SPRITE.INV_DRAGON_SWORD];
  sprite[SPRITE.INV_DRAGON_CUBE] = create_craft_button(1, [{
    f: create_dragon_cube,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#44bae0", "#9fdae9", "#7dd1ea", "#c6e8ef"]
  }], 0.55, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_DRAGON_ORB] = create_craft_button(1, [{
    f: create_blue_orb,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#44bae0", "#9fdae9", "#7dd1ea", "#c6e8ef"]
  }], 0.55, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_LAVA_CUBE] = create_craft_button(1, [{
    f: create_dragon_cube,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#e04444", "#e99f9f", "#eb7e7e", "#eec6c6"]
  }], 0.55, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_LAVA_ORB] = create_craft_button(1, [{
    f: create_blue_orb,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#e04444", "#e99f9f", "#eb7e7e", "#eec6c6"]
  }], 0.55, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_GEMME_GREEN] = create_craft_button(1, [{
    f: create_gemme_green,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#59ba72", "#94d966", "#5aa628", "#0d1b1c", "#38874d"]
  }], 0.35, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_GEMME_ORANGE] = create_craft_button(1, [{
    f: create_gemme_green,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#C45727", "#de7d46", "#DB9358", "#0d1b1c", "#994617"]
  }], 0.35, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_GEMME_BLUE] = create_craft_button(1, [{
    f: create_gemme_green,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#3a9dbd", "#59C0D8", "#48abcb", "#0d1b1c", "#196599"]
  }], 0.35, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_SHOVEL] = create_craft_button(1, [{
    f: create_shovel,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#6d5041", "#4f3d35", "#939393", "#5f6061", "#757575"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SHOVEL] = sprite[SPRITE.INV_SHOVEL];
  sprite[SPRITE.INV_SHOVEL_GOLD] = create_craft_button(1, [{
    f: create_shovel,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32", "#b4ac45"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SHOVEL_GOLD] = sprite[SPRITE.INV_SHOVEL_GOLD];
  sprite[SPRITE.INV_SHOVEL_DIAMOND] = create_craft_button(1, [{
    f: create_shovel,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1", "#42aab8"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SHOVEL_DIAMOND] = sprite[SPRITE.INV_SHOVEL_DIAMOND];
  sprite[SPRITE.INV_SHOVEL_AMETHYST] = create_craft_button(1, [{
    f: create_shovel,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa", "#a853c7"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SHOVEL_AMETHYST] = sprite[SPRITE.INV_SHOVEL_AMETHYST];
  sprite[SPRITE.INV_EXPLORER_HAT] = create_craft_button(1, [{
    f: create_explorer_hat,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#c9a65f", "#ae863f", "#655530", "#4a391c", "#ebdd79", "#4a421c"]
  }], 0.35, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_EXPLORER_HAT] = sprite[SPRITE.INV_EXPLORER_HAT];
  sprite[SPRITE.INV_WOOD_HELMET] = create_craft_button(1, [{
    f: create_wooden_helmet,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#252525", "#73583e", "#493425", "#7d6144"]
  }], 0.35, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_WOOD_HELMET] = sprite[SPRITE.INV_WOOD_HELMET];
  sprite[SPRITE.INV_STONE_HELMET] = create_craft_button(1, [{
    f: create_viking_hat,
    x: 0,
    y: -2,
    a: 1,
    r: 0,
    c: ["#252525", "#808080", "#4a4a4a", "#9e9c8b", "#615c53", "#686969", "#8a8776", "#555555", "#747474", "#969696", "#454545"]
  }], 0.4, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_STONE_HELMET] = sprite[SPRITE.INV_STONE_HELMET];
  sprite[SPRITE.INV_GOLD_HELMET] = create_craft_button(1, [{
    f: create_gold_helmet,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#dbce71", "#b29c32", "#c4bc51"]
  }], 0.35, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_GOLD_HELMET] = sprite[SPRITE.INV_GOLD_HELMET];
  sprite[SPRITE.INV_DIAMOND_HELMET] = create_craft_button(1, [{
    f: create_diamond_helmet,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#717171", "#485252", "#555555", "#65c7cd", "#4aadad", "#358d8b", "#c1e6ea", "#a6dce4"]
  }], 0.45, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_DIAMOND_HELMET] = sprite[SPRITE.INV_DIAMOND_HELMET];
  sprite[SPRITE.INV_BOOK] = create_craft_button(1, [{
    f: create_book,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#511f00", "#2f1300", "#ffffff", "#d4d4d4", "#5b2400", "#984e21"]
  }], 0.15, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_BOOK] = sprite[SPRITE.INV_BOOK];
  sprite[SPRITE.INV_PAPER] = create_craft_button(1, [{
    f: create_paper,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#221e1b", "#ffffff", "#f6f0e7"]
  }], 0.3, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_PAPER] = sprite[SPRITE.INV_PAPER];
  sprite[SPRITE.INV_AMETHYST] = create_craft_button(1, [{
    f: create_amethyst,
    x: -5,
    y: -5,
    a: 1,
    r: 0,
    c: ["#1d051e", "#c27add", "#cd98e5"]
  }], 0.31, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_SAND] = create_craft_button(1, [{
    f: create_sand,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#D7C393", "#a48c6c"]
  }], 0.22, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_ICE] = create_craft_button(1, [{
    f: create_ice,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#93CBCE", "#E9F6F6"]
  }], 0.3, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.INV_GROUND] = create_craft_button(1, [{
    f: create_sand,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#866432", "#6b4f25"]
  }], 0.22, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_BUCKET_FULL] = create_craft_button(1, [{
    f: create_bucket_full,
    x: 3,
    y: 2,
    a: 1,
    r: 0,
    c: ["#1e2021", "#674C2A", "#4C3B19", "#2f2211", "#785931", "#1678a2"]
  }], 0.22, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_BUCKET_EMPTY] = create_craft_button(1, [{
    f: create_bucket_empty,
    x: 3,
    y: 2,
    a: 1,
    r: 0,
    c: ["#1e2021", "#674C2A", "#4C3B19", "#2f2211", "#785931", "#1678a2"]
  }], 0.22, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_BUCKET_FULL] = sprite[SPRITE.INV_BUCKET_FULL];
  sprite[SPRITE.CRAFT_BUCKET_EMPTY] = sprite[SPRITE.INV_BUCKET_EMPTY];
  sprite[SPRITE.INV_WELL] = create_craft_button(1, [{
    f: create_well,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#717273", "#606162", "#a09f9f", "#878787", "#454545"]
  }], 0.1, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_WELL] = sprite[SPRITE.INV_WELL];
  sprite[SPRITE.INV_BOTTLE_FULL] = create_craft_button(1, [{
    f: create_bottle,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#C6AF81", "#C98435", "#B26F31", "#53A4D5", "#388AC7", "#C1C0C0", "#EAEAEA"]
  }], 0.18, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_BOTTLE_EMPTY] = create_craft_button(1, [{
    f: create_bottle_full,
    x: 0,
    y: 0,
    a: 1,
    r: Math.PI / 5,
    c: ["#C6AF81", "#C98435", "#B26F31", "#53A4D5", "#388AC7", "#C1C0C0", "#EAEAEA"]
  }], 0.18, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_BOTTLE_FULL] = sprite[SPRITE.INV_BOTTLE_FULL];
  sprite[SPRITE.CRAFT_BOTTLE_EMPTY] = sprite[SPRITE.INV_BOTTLE_EMPTY];
  sprite[SPRITE.INV_COOKIE] = create_craft_button(1, [{
    f: create_cookie,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#eedacc", "#dfbda7", "#dab094", "#63391a", "#523124"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_COOKIE] = sprite[SPRITE.INV_COOKIE];
  sprite[SPRITE.INV_CANDY] = create_craft_button(1, [{
    f: create_candy,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1a1011", "#e29c2b", "#b76413", "#d6c418", "#e0bf32", "#b78a1a", "#aa1a17", "#cc9f2f", "#cc741d", "#b51524", "#bc1522", "#991922", "#a01ed5", "#d51e81"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_FERRERO] = create_craft_button(1, [{
    f: create_ferrero_rocher,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1a1011", "#693c2a", "#54311f", "#9f7a3d", "#492d1d", "#dbb175", "#54311f", "#9f7a3d", "#604720"]
  }], 0.6, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_BREAD] = create_craft_button(1, [{
    f: create_bread,
    x: 0,
    y: -2,
    a: 1,
    r: 0,
    c: ["#1d051e", "#bf8d51", "#7d5133", "#e8d6bf", "#e0c8a9", "#ab7a3f"]
  }], 0.17, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BREAD] = sprite[SPRITE.INV_BREAD];
  sprite[SPRITE.INV_FOODFISH] = create_craft_button(1, [{
    f: create_fishfood,
    x: -3,
    y: -5,
    a: 1,
    r: 0,
    c: ["#1d051e", "#63767c", "#424f51", "#6c8288", "#536468", "#202020", "#ffffff", "#806f60", "#514942", "#756557"]
  }], 0.23, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.INV_FOODFISH_COOKED] = create_craft_button(1, [{
    f: create_fishfood_cooked,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1d051e", "#42261A", "#281818"]
  }], 0.23, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_FOODFISH_COOKED] = sprite[SPRITE.INV_FOODFISH_COOKED];
  sprite[SPRITE.INV_DIVING_MASK] = create_craft_button(1, [{
    f: create_divingmask,
    x: -3,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#65A8B7", "#2E85A0", "#14275B", "#081826", "#1A3163", "#0C1944", "#89C4CE", "#2E85A0"]
  }], 0.2, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_DIVING_MASK] = sprite[SPRITE.INV_DIVING_MASK];
  sprite[SPRITE.INV_SCALES] = create_craft_button(1, [{
    f: create_scales,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#961B1B", "#702727", "#C43B3B"]
  }], 0.15, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_SUPER_DIVING_SUIT] = create_craft_button(1, [{
    f: create_superdivingsuit,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#F0D200", "#B09A00", "#79359E", "#652D8E", "#1e2021"]
  }], 0.3, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.5);
  sprite[SPRITE.CRAFT_SUPER_DIVING_SUIT] = sprite[SPRITE.INV_SUPER_DIVING_SUIT];
  sprite[SPRITE.INV_PLOT] = create_craft_button(1, [{
    f: create_plot,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#352E1E", "#4C3B19", "#574122"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_PLOT] = sprite[SPRITE.INV_PLOT];
  sprite[SPRITE.INV_GARLAND] = create_craft_button(1, [{
    f: create_garland_inv,
    x: -5,
    y: -5,
    a: 1,
    r: 0,
    c: ["#e2d63b", "#ee71a9", "#42b672"]
  }], 1, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CHEST_GARLAND] = sprite[SPRITE.INV_GARLAND];
  sprite[SPRITE.INV_BRIDGE] = create_craft_button(1, [{
    f: create_bridge,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#332715", "#4C3B19", "#574122"]
  }], 0.5, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_BRIDGE] = sprite[SPRITE.INV_BRIDGE];
  sprite[SPRITE.INV_ROOF] = create_craft_button(1, [{
    f: create_roof,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#352618", "#402b18", "#4c3b19", "#574122", "#52391e"]
  }], 0.3, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_ROOF] = sprite[SPRITE.INV_ROOF];
  sprite[SPRITE.INV_WATERING_CAN_FULL] = create_craft_button(1, [{
    f: create_watering_can,
    x: -1,
    y: 0,
    a: 1,
    r: -Math.PI / 5,
    c: ["#1e2021", "#674C2A", "#4C3B19", "#594225", "#1678a2"]
  }], 0.4, ["#35b1b5", "#46c2c9", "#33b4e4"], 0.7);
  sprite[SPRITE.CRAFT_WATERING_CAN_FULL] = sprite[SPRITE.INV_WATERING_CAN_FULL];
  sprite[SPRITE.INV_WATERING_CAN] = create_craft_button(1, [{
    f: create_watering_can,
    x: -1,
    y: 0,
    a: 1,
    r: -Math.PI / 5,
    c: ["#1e2021", "#674C2A", "#4C3B19", "#594225", "#3F2D18", "#2D2112"]
  }], 0.4, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.CRAFT_WATERING_CAN] = sprite[SPRITE.INV_WATERING_CAN];
  sprite[SPRITE.INV_FLOUR] = create_craft_button(1, [{
    f: create_flour,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#B3AA8E", "#817961", "#EBEAE2", "#E0DFD8"]
  }], 0.25, ["#2b5c48", "#2b5c48", "#2b5c48"], 0.5);
  sprite[SPRITE.INV_CRAB_STICK] = create_craft_button(1, [{
    f: create_crab_stick,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#ed5f4f", "#ce4545", "#ffffff", "#e2dad7"]
  }], 0.2, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CHEST_CRAB_STICK] = sprite[SPRITE.INV_CRAB_STICK];
  sprite[SPRITE.INV_CAKE] = create_craft_button(1, [{
    f: create_cake,
    x: 0,
    y: 0,
    a: 1,
    r: 0,
    c: ["#1e2021", "#63391a", "#523124", "#d2c4b9", "#c1aca2", "#d8cbc2", "#c8b5ac", "#ac222a", "#e6636a"]
  }], 0.25, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_CAKE] = sprite[SPRITE.INV_CAKE];
  sprite[SPRITE.INV_SANDWICH] = create_craft_button(1, [{
    f: create_SANDWICH,
    x: -2,
    y: -8,
    a: 1,
    r: 0,
    c: ["#dfd6bc", "#7b5139", "#bf8d50", "#834e49", "#602820", "#d7ccaa"]
  }], 0.25, ["#3ba578", "#4eb687", "#3da34d"], 0.5);
  sprite[SPRITE.CRAFT_SANDWICH] = sprite[SPRITE.INV_SANDWICH];
  sprite[SPRITE.INV_LAVA_SWORD] = [];
  sprite[SPRITE.INV_LAVA_SWORD][0] = IMAGES.INV_LAVA_SWORD_OUT;
  sprite[SPRITE.INV_LAVA_SWORD][1] = IMAGES.INV_LAVA_SWORD_IN;
  sprite[SPRITE.INV_LAVA_SWORD][2] = IMAGES.INV_LAVA_SWORD_CLICK;
  sprite[SPRITE.CRAFT_LAVA_SWORD] = sprite[SPRITE.INV_LAVA_SWORD];
  sprite[SPRITE.CHEST_LAVA_SWORD] = sprite[SPRITE.INV_LAVA_SWORD];
  sprite[SPRITE.INV_LAVA_SPEAR] = [];
  sprite[SPRITE.INV_LAVA_SPEAR][0] = IMAGES.INV_LAVA_SPEAR_OUT;
  sprite[SPRITE.INV_LAVA_SPEAR][1] = IMAGES.INV_LAVA_SPEAR_IN;
  sprite[SPRITE.INV_LAVA_SPEAR][2] = IMAGES.INV_LAVA_SPEAR_CLICK;
  sprite[SPRITE.CRAFT_LAVA_SPEAR] = sprite[SPRITE.INV_LAVA_SPEAR];
  sprite[SPRITE.CHEST_LAVA_SPEAR] = sprite[SPRITE.INV_LAVA_SPEAR];
  sprite[SPRITE.CRAFT_REIDITE_SWORD] = sprite[SPRITE.INV_REIDITE_SWORD];
  sprite[SPRITE.CHEST_REIDITE_SWORD] = sprite[SPRITE.INV_REIDITE_SWORD];
  sprite[SPRITE.INV_REIDITE_SWORD] = [];
  sprite[SPRITE.INV_REIDITE_SWORD][0] = IMAGES.INV_REIDITE_SWORD_OUT;
  sprite[SPRITE.INV_REIDITE_SWORD][1] = IMAGES.INV_REIDITE_SWORD_IN;
  sprite[SPRITE.INV_REIDITE_SWORD][2] = IMAGES.INV_REIDITE_SWORD_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_SWORD] = sprite[SPRITE.INV_REIDITE_SWORD];
  sprite[SPRITE.CHEST_REIDITE_SWORD] = sprite[SPRITE.INV_REIDITE_SWORD];
  sprite[SPRITE.INV_REIDITE_SPEAR] = [];
  sprite[SPRITE.INV_REIDITE_SPEAR][0] = IMAGES.INV_REIDITE_SPEAR_OUT;
  sprite[SPRITE.INV_REIDITE_SPEAR][1] = IMAGES.INV_REIDITE_SPEAR_IN;
  sprite[SPRITE.INV_REIDITE_SPEAR][2] = IMAGES.INV_REIDITE_SPEAR_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_SPEAR] = sprite[SPRITE.INV_REIDITE_SPEAR];
  sprite[SPRITE.CHEST_REIDITE_SPEAR] = sprite[SPRITE.INV_REIDITE_SPEAR];
  sprite[SPRITE.INV_DIAMOND_PROTECTION] = [];
  sprite[SPRITE.INV_DIAMOND_PROTECTION][0] = IMAGES.INV_DIAMOND_PROTECTION_OUT;
  sprite[SPRITE.INV_DIAMOND_PROTECTION][1] = IMAGES.INV_DIAMOND_PROTECTION_IN;
  sprite[SPRITE.INV_DIAMOND_PROTECTION][2] = IMAGES.INV_DIAMOND_PROTECTION_CLICK;
  sprite[SPRITE.CRAFT_DIAMOND_PROTECTION] = sprite[SPRITE.INV_DIAMOND_PROTECTION];
  sprite[SPRITE.CHEST_DIAMOND_PROTECTION] = sprite[SPRITE.INV_DIAMOND_PROTECTION];
  sprite[SPRITE.INV_AMETHYST_PROTECTION] = [];
  sprite[SPRITE.INV_AMETHYST_PROTECTION][0] = IMAGES.INV_AMETHYST_PROTECTION_OUT;
  sprite[SPRITE.INV_AMETHYST_PROTECTION][1] = IMAGES.INV_AMETHYST_PROTECTION_IN;
  sprite[SPRITE.INV_AMETHYST_PROTECTION][2] = IMAGES.INV_AMETHYST_PROTECTION_CLICK;
  sprite[SPRITE.CRAFT_AMETHYST_PROTECTION] = sprite[SPRITE.INV_AMETHYST_PROTECTION];
  sprite[SPRITE.CHEST_AMETHYST_PROTECTION] = sprite[SPRITE.INV_AMETHYST_PROTECTION];
  sprite[SPRITE.INV_REIDITE_PROTECTION] = [];
  sprite[SPRITE.INV_REIDITE_PROTECTION][0] = IMAGES.INV_REIDITE_PROTECTION_OUT;
  sprite[SPRITE.INV_REIDITE_PROTECTION][1] = IMAGES.INV_REIDITE_PROTECTION_IN;
  sprite[SPRITE.INV_REIDITE_PROTECTION][2] = IMAGES.INV_REIDITE_PROTECTION_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_PROTECTION] = sprite[SPRITE.INV_REIDITE_PROTECTION];
  sprite[SPRITE.CHEST_REIDITE_PROTECTION] = sprite[SPRITE.INV_REIDITE_PROTECTION];
  sprite[SPRITE.INV_REIDITE_HELMET] = [];
  sprite[SPRITE.INV_REIDITE_HELMET][0] = IMAGES.INV_REIDITE_HELMET_OUT;
  sprite[SPRITE.INV_REIDITE_HELMET][1] = IMAGES.INV_REIDITE_HELMET_IN;
  sprite[SPRITE.INV_REIDITE_HELMET][2] = IMAGES.INV_REIDITE_HELMET_CLICK;
  sprite[SPRITE.CRAFT_REIDITE_HELMET] = sprite[SPRITE.INV_REIDITE_HELMET];
  sprite[SPRITE.CHEST_REIDITE_HELMET] = sprite[SPRITE.INV_REIDITE_HELMET];
  sprite[SPRITE.INV_LAVA_HELMET] = [];
  sprite[SPRITE.INV_LAVA_HELMET][0] = IMAGES.INV_LAVA_HELMET_OUT;
  sprite[SPRITE.INV_LAVA_HELMET][1] = IMAGES.INV_LAVA_HELMET_IN;
  sprite[SPRITE.INV_LAVA_HELMET][2] = IMAGES.INV_LAVA_HELMET_CLICK;
  sprite[SPRITE.CRAFT_LAVA_HELMET] = sprite[SPRITE.INV_LAVA_HELMET];
  sprite[SPRITE.CHEST_LAVA_HELMET] = sprite[SPRITE.INV_LAVA_HELMET];
  sprite[SPRITE.INV_FIREFLY] = [];
  sprite[SPRITE.INV_FIREFLY][0] = IMAGES.INV_FIREFLY_OUT;
  sprite[SPRITE.INV_FIREFLY][1] = IMAGES.INV_FIREFLY_IN;
  sprite[SPRITE.INV_FIREFLY][2] = IMAGES.INV_FIREFLY_CLICK;
  sprite[SPRITE.CRAFT_FIREFLY] = sprite[SPRITE.INV_FIREFLY];
  sprite[SPRITE.CHEST_FIREFLY] = sprite[SPRITE.INV_FIREFLY];
  sprite[SPRITE.INV_WITCH] = [];
  sprite[SPRITE.INV_WITCH][0] = IMAGES.INV_WITCH_OUT;
  sprite[SPRITE.INV_WITCH][1] = IMAGES.INV_WITCH_IN;
  sprite[SPRITE.INV_WITCH][2] = IMAGES.INV_WITCH_CLICK;
  sprite[SPRITE.CRAFT_WITCH] = sprite[SPRITE.INV_WITCH];
  sprite[SPRITE.CHEST_WITCH] = sprite[SPRITE.INV_WITCH];
  sprite[SPRITE.INV_NIMBUS] = [];
  sprite[SPRITE.INV_NIMBUS][0] = IMAGES.INV_NIMBUS_OUT;
  sprite[SPRITE.INV_NIMBUS][1] = IMAGES.INV_NIMBUS_IN;
  sprite[SPRITE.INV_NIMBUS][2] = IMAGES.INV_NIMBUS_CLICK;
  sprite[SPRITE.CRAFT_NIMBUS] = sprite[SPRITE.INV_NIMBUS];
  sprite[SPRITE.CHEST_NIMBUS] = sprite[SPRITE.INV_NIMBUS];
  sprite[SPRITE.INV_REIDITE] = [];
  sprite[SPRITE.INV_REIDITE][0] = IMAGES.INV_REIDITE_OUT;
  sprite[SPRITE.INV_REIDITE][1] = IMAGES.INV_REIDITE_IN;
  sprite[SPRITE.INV_REIDITE][2] = IMAGES.INV_REIDITE_CLICK;
  sprite[SPRITE.CHEST_REIDITE] = sprite[SPRITE.INV_REIDITE];
  sprite[SPRITE.INV_FLAME] = [];
  sprite[SPRITE.INV_FLAME][0] = IMAGES.INV_FLAME_OUT;
  sprite[SPRITE.INV_FLAME][1] = IMAGES.INV_FLAME_IN;
  sprite[SPRITE.INV_FLAME][2] = IMAGES.INV_FLAME_CLICK;
  sprite[SPRITE.CHEST_FLAME] = sprite[SPRITE.INV_FLAME];
  sprite[SPRITE.CHEST_SHOVEL] = sprite[SPRITE.INV_SHOVEL];
  sprite[SPRITE.CHEST_SHOVEL_GOLD] = sprite[SPRITE.INV_SHOVEL_GOLD];
  sprite[SPRITE.CHEST_SHOVEL_DIAMOND] = sprite[SPRITE.INV_SHOVEL_DIAMOND];
  sprite[SPRITE.CHEST_SHOVEL_AMETHYST] = sprite[SPRITE.INV_SHOVEL_AMETHYST];
  sprite[SPRITE.CHEST_SEED] = sprite[SPRITE.INV_SEED];
  sprite[SPRITE.CHEST_WHEAT_SEED] = sprite[SPRITE.INV_WHEAT_SEED];
  sprite[SPRITE.CHEST_WINDMILL] = sprite[SPRITE.INV_WINDMILL];
  sprite[SPRITE.CHEST_WILD_WHEAT] = sprite[SPRITE.INV_WILD_WHEAT];
  sprite[SPRITE.CHEST_FIRE] = sprite[SPRITE.INV_FIRE];
  sprite[SPRITE.CHEST_DRAGON_ORB] = sprite[SPRITE.INV_DRAGON_ORB];
  sprite[SPRITE.CHEST_DRAGON_CUBE] = sprite[SPRITE.INV_DRAGON_CUBE];
  sprite[SPRITE.CHEST_LAVA_ORB] = sprite[SPRITE.INV_LAVA_ORB];
  sprite[SPRITE.CHEST_LAVA_CUBE] = sprite[SPRITE.INV_LAVA_CUBE];
  sprite[SPRITE.CHEST_BIG_FIRE] = sprite[SPRITE.INV_BIG_FIRE];
  sprite[SPRITE.CHEST_SUGAR_CAN] = sprite[SPRITE.INV_SUGAR_CAN];
  sprite[SPRITE.CHEST_PIRATE_SWORD] = sprite[SPRITE.INV_PIRATE_SWORD];
  sprite[SPRITE.CHEST_SWORD_WOOD] = sprite[SPRITE.INV_SWORD_WOOD];
  sprite[SPRITE.CHEST_SWORD] = sprite[SPRITE.INV_SWORD];
  sprite[SPRITE.CHEST_CURSED_SWORD] = sprite[SPRITE.INV_CURSED_SWORD];
  sprite[SPRITE.CHEST_SWORD_GOLD] = sprite[SPRITE.INV_SWORD_GOLD];
  sprite[SPRITE.CHEST_SWORD_DIAMOND] = sprite[SPRITE.INV_SWORD_DIAMOND];
  sprite[SPRITE.CHEST_SWORD_AMETHYST] = sprite[SPRITE.INV_SWORD_AMETHYST];
  sprite[SPRITE.CHEST_PICK_WOOD] = sprite[SPRITE.INV_PICK_WOOD];
  sprite[SPRITE.CHEST_PICK] = sprite[SPRITE.INV_PICK];
  sprite[SPRITE.CHEST_PICK_GOLD] = sprite[SPRITE.INV_PICK_GOLD];
  sprite[SPRITE.CHEST_PICK_DIAMOND] = sprite[SPRITE.INV_PICK_DIAMOND];
  sprite[SPRITE.CHEST_PICK_AMETHYST] = sprite[SPRITE.INV_PICK_AMETHYST];
  sprite[SPRITE.CHEST_STONE] = sprite[SPRITE.INV_STONE];
  sprite[SPRITE.CHEST_GOLD] = sprite[SPRITE.INV_GOLD];
  sprite[SPRITE.CHEST_DIAMOND] = sprite[SPRITE.INV_DIAMOND];
  sprite[SPRITE.CHEST_WOOD] = sprite[SPRITE.INV_WOOD];
  sprite[SPRITE.CHEST_PLANT] = sprite[SPRITE.INV_PLANT];
  sprite[SPRITE.CHEST_WORKBENCH] = sprite[SPRITE.INV_WORK];
  sprite[SPRITE.CHEST_STONE_WALL] = sprite[SPRITE.INV_STONE_WALL];
  sprite[SPRITE.CHEST_DIAMOND_WALL] = sprite[SPRITE.INV_DIAMOND_WALL];
  sprite[SPRITE.CHEST_GOLD_WALL] = sprite[SPRITE.INV_GOLD_WALL];
  sprite[SPRITE.CHEST_AMETHYST_WALL] = sprite[SPRITE.INV_AMETHYST_WALL];
  sprite[SPRITE.CHEST_WALL] = sprite[SPRITE.INV_WALL];
  sprite[SPRITE.CHEST_SPIKE] = sprite[SPRITE.INV_SPIKE];
  sprite[SPRITE.CHEST_MEAT] = sprite[SPRITE.INV_MEAT];
  sprite[SPRITE.CHEST_COOKED_MEAT] = sprite[SPRITE.INV_COOKED_MEAT];
  sprite[SPRITE.CHEST_CORD] = sprite[SPRITE.INV_CORD];
  sprite[SPRITE.CHEST_BLUE_CORD] = sprite[SPRITE.INV_BLUE_CORD];
  sprite[SPRITE.CHEST_BANDAGE] = sprite[SPRITE.INV_BANDAGE];
  sprite[SPRITE.CHEST_LOCK] = sprite[SPRITE.INV_LOCK];
  sprite[SPRITE.CHEST_LOCKPICK] = sprite[SPRITE.INV_LOCKPICK];
  sprite[SPRITE.CHEST_RESURRECTION] = sprite[SPRITE.INV_RESURRECTION];
  sprite[SPRITE.CHEST_DRAGON_HEART] = sprite[SPRITE.INV_DRAGON_HEART];
  sprite[SPRITE.CHEST_LAVA_HEART] = sprite[SPRITE.INV_LAVA_HEART];
  sprite[SPRITE.CHEST_DRAGON_SWORD] = sprite[SPRITE.INV_DRAGON_SWORD];
  sprite[SPRITE.CHEST_TOTEM] = sprite[SPRITE.INV_TOTEM];
  sprite[SPRITE.CHEST_DOOR_WOOD_CLOSE] = sprite[SPRITE.INV_DOOR_WOOD_CLOSE];
  sprite[SPRITE.CHEST_CHEST] = sprite[SPRITE.INV_CHEST];
  sprite[SPRITE.CHEST_SLOT] = CTI(create_chest_slot(0.8, true, ["#4c3b19", "#c4a23a", "#c4a23a", "#c4a23a"]));
  sprite[SPRITE.CHEST_PLUS] = create_craft_button(0.5, [{
    f: create_plus_chest,
    x: 0,
    y: 2,
    a: 1,
    r: 0,
    c: ["#ffffff"]
  }], 0.16, ["#c4a23a", "#d0ad41", "#b89733"], 0.9);
  sprite[SPRITE.CHEST_STONE_SPIKE] = sprite[SPRITE.INV_STONE_SPIKE];
  sprite[SPRITE.CHEST_GOLD_SPIKE] = sprite[SPRITE.INV_GOLD_SPIKE];
  sprite[SPRITE.CHEST_DIAMOND_SPIKE] = sprite[SPRITE.INV_DIAMOND_SPIKE];
  sprite[SPRITE.CHEST_AMETHYST_SPIKE] = sprite[SPRITE.INV_AMETHYST_SPIKE];
  sprite[SPRITE.CHEST_BAG] = sprite[SPRITE.INV_BAG];
  sprite[SPRITE.CHEST_SPECIAL_FUR] = sprite[SPRITE.INV_SPECIAL_FUR];
  sprite[SPRITE.CHEST_SPECIAL_FUR_2] = sprite[SPRITE.INV_SPECIAL_FUR_2];
  sprite[SPRITE.CHEST_FUR] = sprite[SPRITE.INV_FUR];
  sprite[SPRITE.CHEST_KRAKEN_SKIN] = sprite[SPRITE.INV_KRAKEN_SKIN];
  sprite[SPRITE.CHEST_FUR_WOLF] = sprite[SPRITE.INV_FUR_WOLF];
  sprite[SPRITE.CHEST_FUR_BOAR] = sprite[SPRITE.INV_FUR_BOAR];
  sprite[SPRITE.CHEST_FUR_WINTER] = sprite[SPRITE.INV_FUR_WINTER];
  sprite[SPRITE.CHEST_EARMUFFS] = sprite[SPRITE.INV_EARMUFFS];
  sprite[SPRITE.CHEST_CAP_SCARF] = sprite[SPRITE.INV_CAP_SCARF];
  sprite[SPRITE.CHEST_DOOR_STONE_CLOSE] = sprite[SPRITE.INV_DOOR_STONE_CLOSE];
  sprite[SPRITE.CHEST_DOOR_GOLD_CLOSE] = sprite[SPRITE.INV_DOOR_GOLD_CLOSE];
  sprite[SPRITE.CHEST_DOOR_DIAMOND_CLOSE] = sprite[SPRITE.INV_DOOR_DIAMOND_CLOSE];
  sprite[SPRITE.CHEST_DOOR_AMETHYST_CLOSE] = sprite[SPRITE.INV_DOOR_AMETHYST_CLOSE];
  sprite[SPRITE.CHEST_COAT] = sprite[SPRITE.INV_COAT];
  sprite[SPRITE.CHEST_WOOD_SPEAR] = sprite[SPRITE.INV_WOOD_SPEAR];
  sprite[SPRITE.CHEST_SPEAR] = sprite[SPRITE.INV_SPEAR];
  sprite[SPRITE.CHEST_GOLD_SPEAR] = sprite[SPRITE.INV_GOLD_SPEAR];
  sprite[SPRITE.CHEST_DIAMOND_SPEAR] = sprite[SPRITE.INV_DIAMOND_SPEAR];
  sprite[SPRITE.CHEST_AMETHYST_SPEAR] = sprite[SPRITE.INV_AMETHYST_SPEAR];
  sprite[SPRITE.CHEST_DRAGON_SPEAR] = sprite[SPRITE.INV_DRAGON_SPEAR];
  sprite[SPRITE.CHEST_SUPER_HAMMER] = sprite[SPRITE.INV_SUPER_HAMMER];
  sprite[SPRITE.CHEST_SPANNER] = sprite[SPRITE.INV_SPANNER];
  sprite[SPRITE.CHEST_HAMMER] = sprite[SPRITE.INV_HAMMER];
  sprite[SPRITE.CHEST_HAMMER_GOLD] = sprite[SPRITE.INV_HAMMER_GOLD];
  sprite[SPRITE.CHEST_HAMMER_DIAMOND] = sprite[SPRITE.INV_HAMMER_DIAMOND];
  sprite[SPRITE.CHEST_HAMMER_AMETHYST] = sprite[SPRITE.INV_HAMMER_AMETHYST];
  sprite[SPRITE.CHEST_FURNACE] = sprite[SPRITE.INV_FURNACE];
  sprite[SPRITE.CHEST_BREAD_OVEN] = sprite[SPRITE.INV_BREAD_OVEN];
  sprite[SPRITE.CHEST_EXPLORER_HAT] = sprite[SPRITE.INV_EXPLORER_HAT];
  sprite[SPRITE.CHEST_STONE_HELMET] = sprite[SPRITE.INV_STONE_HELMET];
  sprite[SPRITE.CHEST_GOLD_HELMET] = sprite[SPRITE.INV_GOLD_HELMET];
  sprite[SPRITE.CHEST_DIAMOND_HELMET] = sprite[SPRITE.INV_DIAMOND_HELMET];
  sprite[SPRITE.CHEST_AMETHYST_HELMET] = sprite[SPRITE.INV_AMETHYST_HELMET];
  sprite[SPRITE.CHEST_DRAGON_HELMET] = sprite[SPRITE.INV_DRAGON_HELMET];
  sprite[SPRITE.CHEST_BOOK] = sprite[SPRITE.INV_BOOK];
  sprite[SPRITE.CHEST_PAPER] = sprite[SPRITE.INV_PAPER];
  sprite[SPRITE.CHEST_AMETHYST] = sprite[SPRITE.INV_AMETHYST];
  sprite[SPRITE.CHEST_BRIDGE] = sprite[SPRITE.INV_BRIDGE];
  sprite[SPRITE.CHEST_ROOF] = sprite[SPRITE.INV_ROOF];
  sprite[SPRITE.CHEST_PLOT] = sprite[SPRITE.INV_PLOT];
  sprite[SPRITE.CHEST_SAND] = sprite[SPRITE.INV_SAND];
  sprite[SPRITE.CHEST_BREAD] = sprite[SPRITE.INV_BREAD];
  sprite[SPRITE.CHEST_ICE] = sprite[SPRITE.INV_ICE];
  sprite[SPRITE.CHEST_GROUND] = sprite[SPRITE.INV_GROUND];
  sprite[SPRITE.CHEST_BOTTLE_FULL] = sprite[SPRITE.INV_BOTTLE_FULL];
  sprite[SPRITE.CHEST_BOTTLE_EMPTY] = sprite[SPRITE.INV_BOTTLE_EMPTY];
  sprite[SPRITE.CHEST_WATERING_CAN] = sprite[SPRITE.INV_WATERING_CAN];
  sprite[SPRITE.CHEST_FLOUR] = sprite[SPRITE.INV_FLOUR];
  sprite[SPRITE.CHEST_COOKIE] = sprite[SPRITE.INV_COOKIE];
  sprite[SPRITE.CHEST_CANDY] = sprite[SPRITE.INV_CANDY];
  sprite[SPRITE.CHEST_FERRERO] = sprite[SPRITE.INV_FERRERO];
  sprite[SPRITE.CHEST_SUPER_DIVING_SUIT] = sprite[SPRITE.INV_SUPER_DIVING_SUIT];
  sprite[SPRITE.CHEST_DIVING_MASK] = sprite[SPRITE.INV_DIVING_MASK];
  sprite[SPRITE.CHEST_WATERING_CAN_FULL] = sprite[SPRITE.INV_WATERING_CAN_FULL];
  sprite[SPRITE.CHEST_CAKE] = sprite[SPRITE.INV_CAKE];
  sprite[SPRITE.CHEST_CRAB_STICK] = sprite[SPRITE.INV_CRAB_STICK];
  sprite[SPRITE.CHEST_FOODFISH] = sprite[SPRITE.INV_FOODFISH];
  sprite[SPRITE.CHEST_FOODFISH_COOKED] = sprite[SPRITE.INV_FOODFISH_COOKED];
  sprite[SPRITE.CHEST_SCALES] = sprite[SPRITE.INV_SCALES];
  sprite[SPRITE.CHEST_SANDWICH] = sprite[SPRITE.INV_SANDWICH];
  sprite[SPRITE.CHEST_CROWN_GREEN] = sprite[SPRITE.INV_CROWN_GREEN];
  sprite[SPRITE.CHEST_GEMME_GREEN] = sprite[SPRITE.INV_GEMME_GREEN];
  sprite[SPRITE.CHEST_CROWN_ORANGE] = sprite[SPRITE.INV_CROWN_ORANGE];
  sprite[SPRITE.CHEST_GEMME_ORANGE] = sprite[SPRITE.INV_GEMME_ORANGE];
  sprite[SPRITE.CHEST_CROWN_BLUE] = sprite[SPRITE.INV_CROWN_BLUE];
  sprite[SPRITE.CHEST_GEMME_BLUE] = sprite[SPRITE.INV_GEMME_BLUE];
  sprite[SPRITE.CHEST_HOOD] = sprite[SPRITE.INV_HOOD];
  sprite[SPRITE.CHEST_PEASANT] = sprite[SPRITE.INV_PEASANT];
  sprite[SPRITE.CHEST_WINTER_PEASANT] = sprite[SPRITE.INV_WINTER_PEASANT];
  sprite[SPRITE.CHEST_WINTER_HOOD] = sprite[SPRITE.INV_WINTER_HOOD];
  sprite[SPRITE.CHEST_BUCKET_EMPTY] = sprite[SPRITE.INV_BUCKET_EMPTY];
  sprite[SPRITE.CHEST_BUCKET_FULL] = sprite[SPRITE.INV_BUCKET_FULL];
  sprite[SPRITE.CHEST_WELL] = sprite[SPRITE.INV_WELL];
  sprite[SPRITE.CHEST_SIGN] = sprite[SPRITE.INV_SIGN];
  sprite[SPRITE.CHEST_PUMPKIN_SEED] = sprite[SPRITE.INV_PUMPKIN_SEED];
  sprite[SPRITE.CHEST_GARLIC_SEED] = sprite[SPRITE.INV_GARLIC_SEED];
  sprite[SPRITE.CHEST_THORNBUSH_SEED] = sprite[SPRITE.INV_THORNBUSH_SEED];
  sprite[SPRITE.CHEST_WOOD_HELMET] = sprite[SPRITE.INV_WOOD_HELMET];
};