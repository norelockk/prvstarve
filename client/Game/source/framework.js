// https://www.digitalocean.com/community/tools/minify


(function FRAMEWORK__BOOTSTRAP() {
  //----------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------

  const pi2 = Math.PI * 2;

  const KIT = [
    { price: 1000, items: [[2, INV.FIRE], [1, INV.COOKED_MEAT], [8, INV.PLANT], [1, INV.BREAD]] },
    { price: 2000, items: [[2, INV.BIG_FIRE], [1, INV.PICK_WOOD], [2, INV.COOKED_MEAT], [16, INV.PLANT], [2, INV.BREAD]] },
    { price: 4000, items: [[3, INV.BIG_FIRE], [1, INV.PICK], [4, INV.COOKED_MEAT], [20, INV.PLANT], [4, INV.BREAD], [1, INV.WORKBENCH], [80, INV.STONE], [140, INV.WOOD]] },
    { price: 8000, items: [[1, INV.BAG], [4, INV.BIG_FIRE], [1, INV.PICK_GOLD], [6, INV.COOKED_MEAT], [30, INV.PLANT], [6, INV.BREAD], [1, INV.WORKBENCH], [150, INV.STONE], [200, INV.WOOD], [60, INV.GOLD], [2, INV.BOTTLE_FULL]] },
    { price: 16000, items: [[1, INV.BAG], [1, INV.PICK_DIAMOND], [1, INV.BED], [7, INV.CAKE], [2, INV.BOTTLE_FULL], [2, INV.BIG_FIRE], [1, INV.FURNACE], [15, INV.STONE_WALL], [2, INV.STONE_DOOR], [1, INV.TOTEM], [1, INV.SPANNER], [200, INV.STONE], [300, INV.WOOD]] },
    { price: 16000, items: [[1, INV.BAG], [1, INV.COAT], [1, INV.SHOVEL_GOLD], [1, INV.PICK_GOLD], [10, INV.CAKE], [4, INV.BOTTLE_FULL], [6, INV.BIG_FIRE], [3, INV.BANDAGE], [1, INV.BOOK], [200, INV.STONE], [300, INV.WOOD]] },
    { price: 16000, items: [[1, INV.BAG], [1, INV.HOOD], [1, INV.HAMMER_GOLD], [3, INV.BANDAGE], [1, 0], [1, INV.PICK_GOLD], [7, INV.CAKE], [2, INV.BOTTLE_FULL], [4, INV.BIG_FIRE], [150, INV.STONE], [200, INV.WOOD], [1, INV.LOCKPICK]] },
    { price: 16000, items: [[1, INV.BAG], [1, INV.PEASANT], [1, INV.PICK_GOLD], [7, INV.CAKE], [2, INV.BOTTLE_FULL], [4, INV.BIG_FIRE], [2, INV.WINDMILL], [4, INV.BREAD_OVEN], [10, INV.PLOT], [6, INV.WHEAT_SEED], [4, INV.SEED], [1, INV.WATERING_CAN_FULL], [500, INV.WOOD]] },
    { price: 16000, items: [[1, INV.BAG], [1, INV.PICK_GOLD], [16, INV.FOODFISH_COOKED], [1, INV.BOTTLE_FULL], [6, INV.BIG_FIRE], [3, INV.BANDAGE], [1, INV.DIVING_MASK], [1, INV.SWORD], [16, INV.BRIDGE], [150, INV.STONE], [200, INV.WOOD]] },
    { price: 20000, items: [[1, INV.BAG], [1, INV.PICK_GOLD], [1, INV.CAKE], [1, INV.BOTTLE_FULL], [3, INV.BIG_FIRE], [3, INV.BANDAGE], [1, INV.GOLD_HELMET], [1, INV.SWORD_GOLD], [1, INV.DIAMOND_SPEAR], [2, INV.GOLD_SPIKE], [50, INV.STONE], [100, INV.WOOD]] },
  ];
  window.KIT = KIT;

  const STATE = {
    WEB: 256,
    NONE: 0,
    HURT: 2,
    COLD: 4,
    WALK: 32,
    IDLE: 64,
    HEAL: 128,
    DELETE: 1,
    HUNGER: 8,
    ATTACK: 16
  };
  window.STATE = STATE;

  const CLIENT = {
    TIMEOUT_TIME: 2000,
    TIMEOUT_NUMBER: 5,

    PING: "[13]",
    PING_DELAY: 60000,

    ROTATE: 0.2,
    ATTACK: 0.2,
    SLOW_ATTACK: 0.58,

    CAM_DELAY: 50,

    MUTE_DELAY: 125000,

    TIMEOUT_SERVER: 600000,
    WAITING_FOR_SERVER: 8000,

    DELAY_CONNECTION_UPDATE: 5,

    LAG_DISTANCE: 200,

    LOOSE_FOCUS: 15,

    TOKEN_LEN: 14,

    TEAM_MANAGE: 0,
    TEAM_SHOW: 1,
    TEAM_LEAVE: 2,
    TEAM_JOIN: 3,
    TEAM_FULL: 4,

    SKIN_MAX: 20,
    ACCESSORY_MAX: 14,
    SYMBOL_MAX: 4,
  };
  window.CLIENT = CLIENT;

  const SECRET = [
    "9d0d52222fb0db0ea661c756f1c56e39",
    "9072b56081cfad5966a0d8052abfc42e",
    "fb2f5573344e036a02da636225b189af",
    "1fd8e8ca4709708e5473cf718b7fe8ff",
    "0304bb20667d850e368ac28bf5fcd8dc",
    "9c33965500bff6fee698fa1d3f862f4e",
    "1bb6ec76d1b1c1cb865e959f2ba35b80",
    "edbddcf7240a9aeacff9c331acc7a2a3",
    "73d9a41733d0edb816465d4b293919b0",
    "197aec4567749ee6e67a732b3b569c75",
    "e623ed33ee1c73fae8eb64a2d950d33c",
    "59240a02a84ddea8c0cc0ab5731cb874",
    "c449d52da354b9c428cf9359afcabc31",
    "d5183f8dfebb214bfd4853ae462c3650",
    "da40d2e694f51fa0ba09529a14ef5221",
    "f56dd11621fa1d94a9a2eede6339f012",
    "f22e4d42012a59fd3b89a895a0f884b1",
    "0ccdf5f07d55f8882199335e0a34c2eb",
    "ade4954cad0a75181dd92fc6c913efa5",
    "b5452b9774372cd2556c8e2fe5875ffa",
    "2fa700f47c52a843ca8ac03825f8eb58",
    "bdfc9fb6f14db87576c50cb26faed3ec",
    "f3ba071d70acdab8ff3b790d9e4e240a",
    "9bbe8a6f08e6103caa5960e8d6e8a2da",
    "e0f94e8fc4afd011ed113d136ff03e46",
    "f228d63570d72742a162b5cf530a63fc",
    "e348c3aeda8be9d43cb4287e0212e2d0",
    "5c5ebca171b7031a637ac5010f8d0b1f",
    "6e3c9009391c5f6f95cc4855c4cb7fb5",
    "fda81973f984d19729eb5eb70574163a"
  ];

  const CHECKS = {
    "LOLIPOP_BUILD_HASH": "1f974fb0c",
    "LOLIPOP_ENV": "production"
  };

  const CHECKS_LIBRARIES = {
    "msgpack": true,
  }

  let SOCKET_SENT_BYTES = 0;
  let SOCKET_RECIEVED_BYTES = 0;
  let UPDATE_NETWORK_BANDWIDTH_INT = false;

  //----------------------------------------------------------------
  // Game constants
  //----------------------------------------------------------------

  let frame = 0;
  let start = Date.now();
  let old_timestamp = 0;

  //----------------------------------------------------------------
  // WebSocket messages encrypting
  //----------------------------------------------------------------

  /**
   * @function generateOffsets
   * @param length {number} length of array
   * @param numOffsets {number} number of offsets
   * @memberof pro.restarve.utils.encryption
   * @returns {Array.<number>}
   */
  const generateOffsets = (length, numOffsets) => {
    const offsets = [];

    for (let i = 0; i < length; i++)
      offsets.push(i % numOffsets);

    return offsets;
  };

  /**
   * @function encrypt
   * @param data {any} - data to encrypt
   * @memberof pro.restarve.utils.encryption
   * @returns {Uint16Array}
   */
  const encrypt = data => {
    const plain = JSON.stringify(data);
    const offsets = generateOffsets(plain.length, SECRET.length);
    const encrypted = [];

    for (let i = 0; i < plain.length; i++) {
      const charCode = plain.charCodeAt(i);

      const keyIndex = (i + offsets[i % offsets.length]) % SECRET.length;
      const keyChar = SECRET[keyIndex].charAt(i % SECRET[keyIndex].length);
      const key = keyChar.charCodeAt(0);

      encrypted.push(charCode ^ key);
    }

    return new Uint16Array(encrypted);
  };

  //----------------------------------------------------------------
  // Utilities
  //----------------------------------------------------------------

  /**
   * @function UPDATE_NETWORK_BANDWIDTH
   * @description This thing sends bytes, that has been recieved and sent from WS to LOLIPOP UI
   */
  const UPDATE_NETWORK_BANDWIDTH = (reset = false) => {
    restarve.emit("updateNetwork", SOCKET_RECIEVED_BYTES, SOCKET_SENT_BYTES);

    if (reset) (
      SOCKET_SENT_BYTES = 0,
      SOCKET_RECIEVED_BYTES = 0
    )
  };

  /**
   * @function ANTI_DEBUG
   * @description Prevents debug output
   */
  const ANTI_DEBUG = () => (
    eval("debugger"),
    setTimeout(ANTI_DEBUG)
  );

  //----------------------------------------------------------------
  // Literally Starve's bunch code (lmfao)
  //----------------------------------------------------------------

  function NetworkClient() {

    /* WATCH OUT, I'M NOT SURE ABOUT THIS TRICK, IT MAY BE A SOURCE OF BUG *
     * That seem work for use this object in a event listener              */
    const _this = this;

    const sendJson = data => {
      const encrypted = window.msgpack.encode(encrypt(JSON.stringify(data)));
      SOCKET_SENT_BYTES += encrypted.length;

      _this.socket.send(encrypted);
    };

    this.socket = null;
    this._current_id = 0;

    /* If server do not respond we kill it */
    this.timeout_server = 0;
    this.timeout_number = 0;
    this.timeout_handler = null;
    this.timeout = function () {

      _this.timeout_number++;

      /* Close socket */
      _this.socket.close();

      if (_this.timeout_number > CLIENT.TIMEOUT_NUMBER) {
        /* Set error label */
        ui.error_level = CLIENT.ERROR_REFUSED;
        _this.new_alert(LANG[TEXT.YOU_CANNOT_JOIN]);

        /* User can take the control of ui interface again */
        if (!window['LOLIPOP_UI']['state'])
          restarve.emit('switchUI');

        if ('discord' in window) window.discord.update('In game', 'In main menu');

        restarve.emit('destroyMessage', 'GAME_CONNECTING');
        ui.waiting = false;

        /* User was trying to restore the connection */
        if (user.reconnect.enabled) {

          /* Quit the game */
          game.quit(ui.run);
        }
      } else {
        const progress = ~~(_this.timeout_number / CLIENT.TIMEOUT_NUMBER * 100);

        restarve.emit('updateMessage', {
          title: 'Reconnecting',
          actions: [
            {
              text: 'Cancel',
              callback: () => {
                clearTimeout(_this.timeout_handler);
                restarve.emit('destroyMessage', 'GAME_CONNECTING');
                if ('discord' in window) window.discord.update('In game', 'In main menu');

                if (ui.waiting) ui.waiting = false;
                if (!ui.is_run) game.quit(ui.run);
              }
            }
          ],
          progress: {
            show: true,
            fill: progress
          },
          identifier: 'GAME_CONNECTING',
          description: `Retrying connection to '${_this.socket.url}' (probe ${_this.timeout_number}/${CLIENT.TIMEOUT_NUMBER})`,
        });

        /* Run again a connection */
        _this.connect_timeout();
      }
    }

    /* User was kicked */
    this.kick = function (reason) {

      /* Skip old message */
      if (this._current_id != this.socket._current_id) return;
      this._current_id++;

      /* Update label of kick reason */
      this.new_alert(LANG[TEXT.KICKED] + reason);

      /* Quit the game */
      game.quit(ui.run);
    }

    /* User is muted due to spam */
    this.mute = function () { this.new_alert("You speak too much"); }

    /* Key of client is already used */
    this.already_used_key = function () {

      /* Wrong key, stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert(LANG[TEXT.KEY_ALREADY]);

      /* User can take the control of ui interface again */
      ui.waiting = false;
    };

    /* Hide shop */
    this.hide_shop_kit = function () {

      user.shop.open = false;
    };

    /* Hide recipe book */
    this.hide_recipe_book = function () {

      game.show_recipe_book = 0;
    };

    /* Hide clock */
    this.hide_clock = function () {

      game.show_clock = 0;
    };

    /* Sand tempest mode */
    this.sand_tempest = function (tempest) {

      user.desert.tempest = tempest;

      if (world.dist_desert > -300) {

        if (tempest === 0)
          this.new_alert(LANG[TEXT.TEMPEST_OFF]);
        else
          this.new_alert(LANG[TEXT.TEMPEST_ON]);
      }
    };

    /* Bandage amount */
    this.bandage = function (bandage) {

      user.bandage = bandage;
    };

    /* Blizzard status */
    this.blizzard_status = function (blizzard) {

      user.blizzard = blizzard;
    };

    /* Blizzard mode */
    this.blizzard = function (tempest) {

      user.winter.tempest = tempest;

      if (world.dist_winter > -300) {

        if (tempest === 0)
          this.new_alert(LANG[TEXT.BLIZZARD_OFF]);
        else
          this.new_alert(LANG[TEXT.BLIZZARD_ON]);
      }
    };

    /* Explorer quest resolution */
    this.explorer_quest = function (biome) {

      if (biome === 0)
        document.getElementById("exploreForest").src = "graphics/forest-leaf-ok.png";
      else if (biome === 1)
        document.getElementById("exploreWinter").src = "graphics/winter-flake-ok.png";
      else if (biome === 2)
        document.getElementById("exploreLava").src = "graphics/lava-volcano-ok.png";
      else if (biome === 3)
        document.getElementById("exploreDesert").src = "graphics/desert-cactus-ok.png";
    };

    /* Hide market */
    this.hide_market = function () {

      game.show_market = 0;
    };

    /* Hide quest */
    this.hide_quest = function () {

      game.show_quest = 0;
    };

    /* Clean player inventory and craft timer */
    this.clean_inventory = function () {

      /* Set inventory */
      user.inv.can_select = [];
      user.inv.n = [];
      user.inv.id = -1;

      /* Set drag system */
      user.inv.drag.stop();

      /* Set craft system */
      user.craft.can_craft = [];
      user.craft.crafting = false;
      user.craft.can_build = false;
      user.craft.preview = -1;
      user.craft.id = -1;
      user.craft.workbench = false;
      user.craft.well = false;
      user.craft.fire = false;
      user.craft.water = false;
      user.craft.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1, 1);
    };

    /* Key of client is wrong */
    this.wrong_key = function () {

      /* Wrong key, stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert();

      /* User can take the control of ui interface again */
      ui.waiting = false;
    }

    /* Server owner talk to you */
    this.message = function (msg) {

      /* Display message */
      this.new_alert(msg);
    };

    /* The password is wrong */
    this.wrong_password = function () {

      /* Old version, stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert(LANG[TEXT.WRONG_PASSWORD]);

      /* User can take the control of ui interface again */
      ui.waiting = false;
    };

    /* Client version is too new */
    this.new_version = function () {

      /* Old version, stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert(LANG[TEXT.NEW_VERSION]);

      /* User can take the control of ui interface again */
      ui.waiting = false;
    };

    /* Client version is too old */
    this.old_version = function () {

      /* Old version, stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert(LANG[TEXT.OLD_VERSION]);

      /* User can take the control of ui interface again */
      ui.waiting = false;
    };

    /* Player get his bag */
    this.get_bag = function () {

      user.inv.update_bag_size(1, 0);
      game.update_inv_buttons();
    };

    // A player was just verified
    this.verified_account = function (ui8) {
      const id = ui8[1];
      const player = world.players[id];

      player.skin = ui8[2];
      player.accessory = ui8[3];
      player.baglook = ui8[4];
      player.book = ui8[5];
      player.crate = ui8[6];
      player.dead = ui8[7];
      player.level = ui8[8];

      const p = world.fast_units[id * world.max_units];
      if (p) {
        p.skin = ui8[2];
        p.accessory = ui8[3];
        p.baglook = ui8[4];
        p.book = ui8[5];
      }
    };

    /* Player terminate his craft */
    this.build_stop = function (id) {

      if (id === INV.BAG) {

        user.inv.update_bag_size(1, 0);
        game.update_inv_buttons();

      } else this.gather([0, id, 1]);

      /* Refresh craft buttons */
      user.craft.restart();
    }

    /* You can recycle your object */
    this.recycle_ok = function (id) {

      /* Reset delay of auto feed */
      user.auto_feed.delay = 0;

      user.craft.do_recycle(id);
    };

    /* You finished to recycle your item */
    this.recycle_stop = function (id) {

      const items = RECIPES[id].r;

      /* Take items from kit */
      for (let i = 0; i < items.length; i++) {

        if (user.inv.max > user.inv.can_select.length || user.inv.n[items[i][0]] > 0) {

          const amount = Math.floor(items[i][1] * 0.8);
          if (!amount) continue;
          this.gather([0, items[i][0], amount]);
        }
      }

      /* Refresh craft buttons */
      user.craft.restart();
    };

    /* You can build your object */
    this.build_ok = function (id) {

      /* Reset delay of auto feed */
      user.auto_feed.delay = 0;

      user.craft.do_craft(id);
    }

    /* New message alert */
    this.new_alert = function (msg) {

      if (!user.alert.text)
        user.alert.text = msg;

      /* If the message is not already displayed or not planned to be displayed */
      else if (msg !== user.alert.text && msg !== user.alert.list[user.alert.list.length - 1])
        user.alert.list.push(msg);
    };

    /* There are no more resources in the map */
    this.no_resources = function () { this.new_alert(LANG[TEXT.NO_MORE_RESOURCES]); };

    /* You survive one more day */
    this.survive = function () {
      let msg;

      if (user.day == 0) msg = LANG[TEXT.SURVIVED_1DAY];
      else msg = LANG[TEXT.SURVIVED] + (user.day + 1) + LANG[TEXT.DAYS];

      this.new_alert(msg);

      user.day++;
    }

    /* The server cannot restore your player */
    this.fail_restore = function () {

      /* Clear previous timeout */
      clearTimeout(_this.timeout_handler);

      /* Reconnecct stop */
      user.reconnect.enabled = false;

      /* Kill user (I mean, not litteraly) */
      user.alive = false;

      /* Store the nickname of the player TODO not used right now */
      this.new_alert(LANG[TEXT.DEAD_SAD]);

      /* Quit the game */
      game.quit(ui.run);
      this.socket.close();
    }

    /* Server is blocked */
    this.blocked = function () {
      /* Server is full stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert(LANG[TEXT.SPAM_ME]);

      /* User can take the control of ui interface again */
      ui.waiting = false;
    };

    /* Server is full */
    this.full = function () {
      /* Server is full stop auto reconnection */
      clearTimeout(this.timeout_handler);

      /* Display error message */
      this.new_alert(LANG[TEXT.SPAM_ME2]);

      /* User can take the control of ui interface again */
      ui.waiting = false;
    };

    /* Update player list */
    this.new_player = function (msg) {
      const id = msg[1];
      const players = world.players;

      players[id].nickname = msg[2];
      players[id].skin = msg[3];
      players[id].accessory = msg[4];
      players[id].baglook = msg[5];
      players[id].book = msg[6];
      players[id].crate = msg[7];
      players[id].dead = msg[8];
      players[id].level = msg[9];
      players[id].score = 0;
      players[id].ldb_label = null;
      players[id].label = null;
      players[id].label_winter = null;
      players[id].alive = true;
    }

    /* Get focus again */
    this.get_focus = function () { sendJson([11]); }

    /* Resource are empty */
    this.empty_res = function () { this.new_alert(LANG[TEXT.EMPTY]); };

    /* Inventory is full */
    this.inv_full = function () { this.new_alert(LANG[TEXT.INV_FULL]); };

    /* User choose a kit */
    this.choose_kit = function (id) {
      sendJson([21, id]);

      user.shop.open = false;
    }

    /* User take a kit */
    this.kit_ok = function (k) {

      const items = KIT[k - 1].items;

      /* Take items from kit */
      for (let i = 0; i < items.length && user.inv.max > user.inv.can_select.length; i++) {

        const item = items[i][1];
        const amount = items[i][0];

        if (items[i][1] === INV.BAG)
          user.inv.update_bag_size(1, 0);
        else
          this.gather([0, item, amount]);
      }
    };

    /* You gathe some resources */
    this.gather = function (ui16) {

      const len = ui16.length;
      const inv = user.inv;

      for (let i = 1; i < len; i += 2) {

        const o = ui16[i];
        const n = ui16[i + 1];

        for (let j = 0; j < inv.can_select.length; j++) {
          if (inv.can_select[j].id == o) {
            inv.n[o] += n;
            break;
          }
        }

        if (j == inv.can_select.length) {
          inv.n[o] = n;
          inv.can_select.push(game.inv_buttons[o]);
          game.update_inv_buttons();
        }
      }

      user.craft.update();
    }

    /* Update gauges */
    this.gauges = function (life, food, cold, thirst, oxygen, warm, bandage) {

      user.gauges.l = life / 100;
      user.gauges.h = food / 100;
      user.gauges.c = cold / 100;
      user.gauges.t = thirst / 100;
      user.gauges.o = oxygen / 100;
      user.gauges.wa = warm / 100;
      user.bandage = bandage
    }

    this.succeed_quest = function (id) { game.quests.modify(id, 2); }

    this.fail_quest = function (id) { game.quests.modify(id, 0); }

    this.claimed = function (id) { game.quests.modify(id, 3); }

    this.gauges_life = function (life, bandage) {

      user.gauges.l = life / 100;
      user.bandage = bandage;
    }

    this.gauges_water = function (water) { user.gauges.t = water / 100; }

    this.gauges_food = function (food) { user.gauges.h = food / 100; }

    this.gauges_warm = function (warm) { user.gauges.wa = warm / 100; }

    this.gauges_cold = function (cold) { user.gauges.c = cold / 100; }


    /* Update time of the game */
    this.get_time = function (d) {
      world.time = d;
      world.transition = true;
      audio.transition = 1;
    }

    this.change_ground = function () {

      document.getElementById("game_body").style.backgroundColor = SPRITE.GROUND[world.time];
    }

    /* Kill player from list */
    this.kill_player = function (id) {

      if (world.mode == WORLD.MODE_HUNGER_GAMES && world.players[id].nickname !== "spectator")
        this.new_alert(world.players[id].nickname + LANG[TEXT.DEAD]);

      world.players[id].alive = false;
    }

    /* Receive new cam position */
    this.set_cam = function (data) {

      const ui16 = new Uint16Array(data);

      /* Correct with local width and height */
      player.cam.change(ui16[1], ui16[2]);
    }

    /* recover focus */
    this.recover_focus = function (data) {
      const ui16 = new Uint16Array(data);

      /* Set camera */
      user.cam.change(ui16[1], ui16[2]);
    }

    /* Something in the map were hitten */
    this.hitten_other = function (ui8, data) {
      const ui16 = new Uint16Array(data);

      const len = (ui8.length - 2) / 4;

      for (let l = 0; l < len; l++) {
        const id = ui16[1 + 2 * l];
        const pid = ui8[4 + 4 * l];
        const angle = (ui8[5 + 4 * l] >> 1) / 127 * pi2;

        const u = world.fast_units[pid * world.max_units + id];
        if (u && u.hit) {

          if (audio.loaded && audio.run)
            audio.hit(ui8[5 + 4 * l] & 1, SOUND_BUILD[u.type], u.x, u.y);

          u.hit.angle = angle;
          u.hit.update = angle;
        }
      }
    }

    /* Something in the map were hitten */
    this.hitten = function (data) {

      const ui16 = new Uint16Array(data);
      const len = (ui16.length - 1) / 4;

      for (let l = 0; l < len; l++) {
        const k = l * 4;
        const i = ui16[1 + k];
        const j = ui16[2 + k];
        const angle = (ui16[3 + k] >> 1) / 127 * pi2;
        const id = ui16[4 + k];

        const tile = MAP.tiles[j][i];
        let o;

        switch (id) {
          case 0: o = tile["p"][0][0]; o.angle = angle; o.update = true; break;//PLANT
          case 1: o = tile["s"][0][0]; o.angle = angle; o.update = true; break;//STONES
          case 2: o = tile["s"][1][0]; o.angle = angle; o.update = true; break;//STONES
          case 3: o = tile["s"][2][0]; o.angle = angle; o.update = true; break;//STONES
          case 4: o = tile["t"][0][0]; o.angle = angle; o.update = true; break;//TREE
          case 5: o = tile["t"][1][0]; o.angle = angle; o.update = true; break;//TREE
          case 6: o = tile["t"][2][0]; o.angle = angle; o.update = true; break;//TREE
          case 7: o = tile["t"][3][0]; o.angle = angle; o.update = true; break;//TREE
          case 8: o = tile["t"][4][0]; o.angle = angle; o.update = true; break;//TREE
          case 9: o = tile["t"][5][0]; o.angle = angle; o.update = true; break;//TREE
          case 10: o = tile["g"][0][0]; o.angle = angle; o.update = true; break;//GOLD
          case 11: o = tile["g"][1][0]; o.angle = angle; o.update = true; break;//GOLD
          case 12: o = tile["g"][2][0]; o.angle = angle; o.update = true; break;//GOLD
          case 13: o = tile["d"][0][0]; o.angle = angle; o.update = true; break;//DIAM
          case 14: o = tile["d"][1][0]; o.angle = angle; o.update = true; break;//DIAM
          case 15: o = tile["d"][2][0]; o.angle = angle; o.update = true; break;//DIAM
          case 16: o = tile["b"][0][0]; o.angle = angle; o.update = true; break;//BTREE
          case 17: o = tile["b"][1][0]; o.angle = angle; o.update = true; break;//BTREE
          case 18: o = tile["b"][2][0]; o.angle = angle; o.update = true; break;//BTREE
          case 19: o = tile["b"][3][0]; o.angle = angle; o.update = true; break;//BTREE
          case 20: o = tile["f"][0][0]; o.angle = angle; o.update = true; break;//FIR
          case 21: o = tile["f"][1][0]; o.angle = angle; o.update = true; break;//FIR
          case 22: o = tile["f"][2][0]; o.angle = angle; o.update = true; break;//FIR
          case 23: o = tile["sw"][0][0]; o.angle = angle; o.update = true; break;//STONE WINTER
          case 24: o = tile["sw"][1][0]; o.angle = angle; o.update = true; break;//STONE WINTER
          case 25: o = tile["sw"][2][0]; o.angle = angle; o.update = true; break;//STONE WINTER
          case 26: o = tile["gw"][0][0]; o.angle = angle; o.update = true; break;//GOLD WINTER
          case 27: o = tile["gw"][1][0]; o.angle = angle; o.update = true; break;//GOLD WINTER
          case 28: o = tile["gw"][2][0]; o.angle = angle; o.update = true; break;//GOLD WINTER
          case 29: o = tile["dw"][0][0]; o.angle = angle; o.update = true; break;//DIAMOND WINTER
          case 30: o = tile["dw"][1][0]; o.angle = angle; o.update = true; break;//DIAMOND WINTER
          case 31: o = tile["dw"][2][0]; o.angle = angle; o.update = true; break;//DIAMOND WINTER
          case 32: o = tile["a"][0][0]; o.angle = angle; o.update = true; break;//AMETHYST
          case 33: o = tile["a"][1][0]; o.angle = angle; o.update = true; break;//AMETHYST
          case 34: o = tile["a"][2][0]; o.angle = angle; o.update = true; break;//AMETHYST
          case 35: o = tile["cs"][0][0]; o.angle = angle; o.update = true; break;//CAVE STONES
          case 36: o = tile["cs"][1][0]; o.angle = angle; o.update = true; break;//CAVE STONES
          case 37: o = tile["cs"][2][0]; o.angle = angle; o.update = true; break;//CAVE STONES
          case 38: o = tile["cs"][3][0]; o.angle = angle; o.update = true; break;//CAVE STONES
          case 40: o = tile["plm"][0][0]; o.angle = angle; o.update = true; break;//PALM
          case 41: o = tile["plm"][1][0]; o.angle = angle; o.update = true; break;//PALM
          case 42: o = tile["plm"][2][0]; o.angle = angle; o.update = true; break;//PALM
          case 50: o = tile["re"][0][0]; o.angle = angle; o.update = true; break;//REIDITE
          case 51: o = tile["re"][1][0]; o.angle = angle; o.update = true; break;//REIDITE
          case 52: o = tile["re"][2][0]; o.angle = angle; o.update = true; break;//REIDITE
          case 55: o = tile["c"][0][0]; o.angle = angle; o.update = true; break;//REIDITE
          case 56: o = tile["m"][0][0]; o.angle = angle; o.update = true; break;//REIDITE
          case 57: o = tile["m"][1][0]; o.angle = angle; o.update = true; break;//REIDITE
          case 58: o = tile["m"][2][0]; o.angle = angle; o.update = true; break;//REIDITE
        }

        if (audio.loaded && audio.run && o)
          audio.hit(ui16[3 + k] & 1, SOUND_NATURE[id], o.x, o.y);
      }
    }

    this.resurrection = function () {

      sendJson([17, user.resurrection.pid, user.resurrection.iid]);
    }

    /* Send wheat to the windmill */
    this.give_wheat = function (windmill, n) {

      sendJson([22, n, windmill.pid, windmill.iid]);
    }

    /* Send wood or flour to the bread oven */
    this.give_bread_oven = function (bread_oven, w, f) {
      if (w) sendJson([25, w, bread_oven.pid, bread_oven.iid]);
      else sendJson([24, f, bread_oven.pid, bread_oven.iid]);
    }

    /* Take bread of the bread oven */
    this.take_bread = function (bread_oven) {
      sendJson([26, bread_oven.pid, bread_oven.iid]);
    }

    /* Claim reward*/
    this.claim_quest_reward = function (quest) {
      sendJson([27, quest]);
    }

    /* Send water (with bucket full) to the well */
    this.give_well = function (well) {
      sendJson([30, well.pid, well.iid]);
    }

    /* Send wood to the extractor */
    this.give_wood_extractor = function (extractor, n) {
      sendJson([38, n, extractor.pid, extractor.iid, extractor.type]);
    }

    /* Send wood to the furnace */
    this.give_wood = function (furnace, n) {
      sendJson([12, n, furnace.pid, furnace.iid]);
    }

    /* Send item to the chest */
    this.give_item = function (chest, id, n) {
      sendJson([8, id, n, chest.pid, chest.iid]);
    }

    /* Take mineral of the extractor */
    this.take_extractor = function (extractor) {
      sendJson([37, extractor.pid, extractor.iid, extractor.type]);
    }

    /* Take flour of the windmill */
    this.take_flour = function (windmill) {
      sendJson([23, windmill.pid, windmill.iid]);
    }

    /* Take item of the chest */
    this.take_chest = function (chest) {
      sendJson([9, chest.pid, chest.iid]);
    }

    /* Take item of the chest */
    this.unlock_chest = function (chest) {
      sendJson([15, chest.pid, chest.iid]);
    }

    /* Take item of the chest */
    this.lock_chest = function (chest) {
      sendJson([16, chest.iid]);
    }

    /* Kick player from your team */
    this.kick_team = function (kick) {
      sendJson([20, user.totem.id, user.team[kick]]);
    }

    /* Join a team */
    this.join_team = function () {
      sendJson([18, user.totem.pid, user.totem.id]);
    }

    /* Leave the current team */
    this.leave_team = function () {
      sendJson([19]);
    }

    /* Lock the current team */
    this.lock_team = function () {
      sendJson([35, user.totem.id]);

      if (document.getElementById("lock_team").innerHTML == "LOCK") {
        user.totem.lock = 1;
        document.getElementById("lock_team").innerHTML = "UNLOCK";
      } else {
        user.totem.lock = 0;
        document.getElementById("lock_team").innerHTML = "LOCK";
      }
    }

    /* Receive units data */
    this.units = function (data, ui8, hard_refresh) {

      const ui16 = new Uint16Array(data);

      if (hard_refresh) world.delete_all_units();

      /*
        var str = ""
        for(var i = 0 ; i < world.units.length ; i++) {
          if (world.units[i].state != S.DIE)
          str += world.units[i].uid + ", ";
        }
        str += '|'
        for(var i = 0 ; i < world.units.length ; i++) {
          if (world.units[i].state == S.DIE)
          str += world.units[i].uid + ", ";
        }
  
        console.log (str);
      */

      const len = (ui8.length - 2) / 18;
      for (let i = 0; i < len; i++) {

        const k8 = 2 + i * 18;
        const k16 = 1 + i * 9;

        const pid = ui8[k8];
        const action = ui16[k16 + 1];
        const id = ui16[k16 + 5];
        const uid = pid * world.max_units + id;

        //if (id != 0) console.log ("pid", pid, "action", action, "id", id, "uid", uid);

        /* We must destroy this player */
        if (action & STATE.DELETE) {
          world.delete_units(uid);
          continue;
        }

        const x = ui16[k16 + 3];
        const y = ui16[k16 + 4];
        const type = ui16[k16 + 2];
        const info = ui16[k16 + 6];
        const speed = ui16[k16 + 7];
        const extra = ui16[k16 + 8];
        const angle = ui8[k8 + 1] / 255 * pi2;

        //if (id != 0) console.log ("x", x, "y", y, "info", info, "type", type, "angle", angle);

        /* Create an object structure */
        if (!world.fast_units[uid]) {

          /* We create an new unit */
          const o = new Item(type, pid, id, x, y, angle, action, info, speed, extra);

          /* We store it into the world */
          world.fast_units[uid] = o;
          world.units[type].push(o);

          continue;
        }

        /* Update this item */
        const u = world.fast_units[uid];
        u.r.x = x;
        u.r.y = y;

        if (pid != 0 && Utils.dist(u, u.r) > CLIENT.LAG_DISTANCE) { u.x = x; u.y = y; }

        if (u.id !== user.id || pid === 0)
          u.nangle = angle;

        u.action |= action;

        /* Update meaning of the information for this units */
        u.info = info;
        u.speed = speed;
        u.extra = extra;

        if (u.update) u.update(action);
      }
    }

    /* Update leaderboard */
    this.leaderboard = function (data) {

      /* Leaderboard is like a pong */
      this.timeout_server = old_timestamp;

      /* Extract data of leaderboard */
      const u = new Uint16Array(data);

      /* Set leaderboard */
      user.ldb.init(u);
    };

    /* Receive the new recipes */
    this.new_recipes = function (recipes) {

      if (OLD_RECIPES !== undefined)
        RECIPES = OLD_RECIPES;

      if (recipes.length > 0) {

        OLD_RECIPES = JSON.parse(JSON.stringify(RECIPES));

        for (let i = 0; i < recipes.length; i++) {
          const r = recipes[i];
          const recipe = RECIPES[r["item"]];
          if (recipe === undefined)
            continue;

          recipe.r = r["recipe"];
          recipe.w = r["workbench"];
          recipe.f = r["fire"];
          recipe.o = r["water"];
          recipe.e = r["well"];
          recipe.time = 1 / r["time"];
        }
      }
    };

    /* Receive a new welcome message */
    this.welcome = function (msg) {

      if (!msg || msg.length === 0)
        user.welcome.message = undefined
      else
        user.welcome.message = create_welcome_text(msg);
    };

    /* Receive chat message */
    this.chat = function (msg) {

      const p = world.fast_units[msg[1] * world.max_units];

      /* If user can see this players */
      if (p) {

        if (world.mode === WORLD.MODE_ZOMBIES && p.skin === WORLD.ZOMBIE_SKIN) {

          if (!user.zombie)
            p.text.push(ZOMBIE_GRUMBLES[Math.floor(Math.random() * ZOMBIE_GRUMBLES.length)]);
          else {
            if (Math.random() > 0.5)
              p.text.push(msg[2] + " ..." + ZOMBIE_GRUMBLE);
            else
              p.text.push(ZOMBIE_GRUMBLE + "... " + msg[2]);
          }

        } else p.text.push(msg[2]);
      }
    }

    /* Select something to craft */
    this.select_craft = function (id) {

      if (user.inv.max === user.inv.can_select.length && RECIPES[id].id2 !== INV.BAG &&
        user.inv.find_item(RECIPES[id].id2) == -1 &&
        !user.inv.free_place(RECIPES[id].r)) {
        this.inv_full();
        return 0;
      }

      sendJson([7, id]);
      return 1;
    }

    /* The player interact with workbench */
    this.workbench = function (val) { user.craft.set_workbench(val); }

    /* The player interact with well */
    this.well = function (val) { user.craft.well = val; user.craft.update(); }

    /* The player interact with fire */
    this.fire = function (val) { user.craft.fire = val; user.craft.update(); }

    /* The player interact with water */
    this.water = function (val) { user.craft.water = val; user.craft.update(); }

    /* The player try to harvests resource with the wrong tool */
    this.dont_harvest = function (can) { this.new_alert(LANG[TEXT.WRONG_TOOL]); }

    /* Server allows user to cancel craft */
    this.cancel_craft = function () {

      /* Refresh craft buttons */
      user.craft.restart();
    }

    /* Receive players position on the minimap */
    this.minimap = function (datas) {
      game.minimap.players = [];

      const p = world.fast_units[user.uid];
      let d = 0;

      for (let i = 1; i < datas.length; i += 2) {

        const pos = {
          x: Math.floor(datas[i] * world.w / 250),
          y: Math.floor(datas[i + 1] * world.h / 250)
        };

        if (p && !d && !user.spectator && Utils.dist(pos, p) < 250) {
          d += 1;
          continue;
        }

        game.minimap.players.push(pos);
      }
    }

    /* Player reborn */
    this.reborn = function () {

      user.resurrection.open = false;
      user.ghost.enabled = false;
      user.ghost.delay = -1;
      user.ghost.label = null;
      user.ghost.sec = null;
      user.ghost.now = -1;
    }

    /* Player become a ghost */
    this.ghost = function (_delay) {

      WORLD.GHOST_DELAY = _delay;

      user.ghost.enabled = true;
      user.ghost.delay = new Date().getTime();
      user.ghost.label = null;
      user.ghost.now = -1;

      /* Remove item from inventory */
      const list = [

        INV.SUPER_HAMMER,

        INV.DRAGON_HEART,

        INV.SWORD_WOOD,
        INV.SWORD,
        INV.SWORD_GOLD,
        INV.SWORD_DIAMOND,
        INV.SWORD_AMETHYST,
        INV.REIDITE_SWORD,
        INV.DRAGON_SWORD,
        INV.LAVA_SWORD,

        INV.PIRATE_SWORD,

        INV.SPEAR,
        INV.WOOD_SPEAR,
        INV.GOLD_SPEAR,
        INV.DIAMOND_SPEAR,
        INV.AMETHYST_SPEAR,
        INV.REIDITE_SPEAR,
        INV.DRAGON_SPEAR,
        INV.LAVA_SPEAR,

        INV.CRAB_SPEAR,

        INV.WOOD_BOW,
        INV.STONE_BOW,
        INV.GOLD_BOW,
        INV.DIAMOND_BOW,
        INV.AMETHYST_BOW,
        INV.REIDITE_BOW,
        INV.DRAGON_BOW,

        INV.WOOD_SHIELD,
        INV.STONE_SHIELD,
        INV.GOLD_SHIELD,
        INV.DIAMOND_SHIELD,
        INV.AMETHYST_SHIELD,
        INV.REIDITE_SHIELD,

        INV.WAND1,
        INV.WAND2,

        INV.PICK_WOOD,
        INV.PICK,
        INV.PICK_GOLD,
        INV.PICK_DIAMOND,
        INV.PICK_AMETHYST,
        INV.PICK_REIDITE,

        INV.SPANNER,

        INV.PITCHFORK,
        INV.PITCHFORK2
      ];

      for (let i = 0; i < list.length; i++) {

        const id = user.inv.find_item(list[i]);
        if (id != -1) user.inv.delete_item(list.length[i], id);
      }

      /* Refresh craft buttons */
      user.craft.restart();
    }

    this.decrease_item2 = function (id, n1, n2) {

      this.decrease_item(id, n1 * 0x100 + n2);
    }

    /* Decrease item of player */
    this.decrease_item = function (id, n) {

      /* Stop any preview */
      user.craft.preview = -1;

      /* Remove item from inventory */
      user.inv.decrease(id, n, user.inv.find_item(id));

      /* Update craft possibility */
      user.craft.update();
    }

    /* The server accept your build */
    this.accept_build = function (id) {

      /* Stop any preview */
      user.craft.preview = -1;

      /* Start delay of building */
      user.build.wait = true;

      /* Consume last item */
      const item = user.inv.find_item(id);
      user.inv.decrease(id, 1, item);

      /* Update craft */
      if (item >= 0 && !user.inv.n[id])
        user.craft.update();

      /* If the building was a totem */
      if (id == INV.TOTEM)
        user.team = [user.id];
    }

    /* Cancel crafting */
    this.cancel_crafting = function () {

      sendJson([31]);
    }

    /* Buy Market */
    this.buy_market = function (v) {

      sendJson([32, v.val, v.id]);
    }

    /* update_sign */
    this.update_sign = function (id, symbol) {

      sendJson([33, id, symbol]);
    }

    /* Send something to build in the map */
    this.send_build = function () {

      const p = world.fast_units[user.uid];
      if (p) {
        sendJson([10, user.craft.preview,
          Math.floor(((p.angle + pi2) % pi2) * 255 / pi2), user.craft.mode]);
      }
    }

    /* Select something in inventory */
    this.select_inv = function (id, i) {

      switch (id) {

        case INV.BANDAGE:
        case INV.PLANT:
        case INV.MEAT:
        case INV.COOKED_MEAT:
        case INV.SANDWICH:
        case INV.BOTTLE_FULL:
        case INV.COOKIE:
        case INV.CAKE:
        case INV.ICE:
        case INV.BREAD:
        case INV.PUMPKIN:
        case INV.TOMATO:
        case INV.CACTUS:
        case INV.CARROT:
        case INV.WATERMELON:
        case INV.ALOE_VERA:
        case INV.GARLIC:
        case INV.FOODFISH:
        case INV.FOODFISH_COOKED:
        case INV.CRAB_STICK:
        case INV.CRAB_LOOT:

          /* Stop any preview */
          user.craft.preview = -1;

          sendJson([5, id]);
          break;

        case INV.WORKBENCH:
        case INV.SPIKE:
        case INV.SEED:
        case INV.WHEAT_SEED:
        case INV.PUMPKIN_SEED:
        case INV.TOMATO_SEED:
        case INV.CARROT_SEED:
        case INV.GARLIC_SEED:
        case INV.THORNBUSH_SEED:
        case INV.WATERMELON_SEED:
        case INV.ALOE_VERA_SEED:
        case INV.FIRE:
        case INV.WALL:
        case INV.STONE_WALL:
        case INV.GOLD_WALL:
        case INV.DIAMOND_WALL:
        case INV.BIG_FIRE:
        case INV.CHEST:
        case INV.RESURRECTION:
        case INV.EMERALD_MACHINE:
        case INV.WOOD_DOOR:
        case INV.STONE_DOOR:
        case INV.GOLD_DOOR:
        case INV.DIAMOND_DOOR:
        case INV.AMETHYST_DOOR:
        case INV.REIDITE_DOOR:

        case INV.WOOD_DOOR_SPIKE:
        case INV.STONE_DOOR_SPIKE:
        case INV.GOLD_DOOR_SPIKE:
        case INV.DIAMOND_DOOR_SPIKE:
        case INV.AMETHYST_DOOR_SPIKE:
        case INV.REIDITE_DOOR_SPIKE:

        case INV.STONE_SPIKE:
        case INV.GOLD_SPIKE:
        case INV.DIAMOND_SPIKE:
        case INV.FURNACE:
        case INV.AMETHYST_WALL:
        case INV.AMETHYST_SPIKE:
        case INV.REIDITE_WALL:
        case INV.REIDITE_SPIKE:
        case INV.BRIDGE:
        case INV.ROOF:
        case INV.PLOT:
        case INV.WINDMILL:
        case INV.EXTRACTOR_MACHINE_STONE:
        case INV.EXTRACTOR_MACHINE_GOLD:
        case INV.EXTRACTOR_MACHINE_DIAMOND:
        case INV.EXTRACTOR_MACHINE_AMETHYST:
        case INV.EXTRACTOR_MACHINE_REIDITE:
        case INV.BED:
        //Christmas
        case INV.GARLAND:

        case INV.WELL:
        case INV.SIGN:
        case INV.BREAD_OVEN:
        case INV.TOTEM:
        case INV.WOOD_TOWER:

          if (!user.zombie) {

            if (user.craft.preview === id)
              user.craft.preview = -1;
            else
              user.craft.preview = id;
          }
          break;

        case INV.SWORD:
        case INV.SWORD_WOOD:
        case INV.SWORD_GOLD:
        case INV.SWORD_DIAMOND:
        case INV.SWORD_AMETHYST:
        case INV.REIDITE_SWORD:
        case INV.PIRATE_SWORD:
        case INV.DRAGON_SWORD:
        case INV.LAVA_SWORD:
        case INV.WOOD_BOW:
        case INV.STONE_BOW:
        case INV.GOLD_BOW:
        case INV.DIAMOND_BOW:
        case INV.AMETHYST_BOW:
        case INV.REIDITE_BOW:
        case INV.DRAGON_BOW:
        case INV.WAND1:
        case INV.WAND2:
        case INV.WOOD_SPEAR:
        case INV.SPEAR:
        case INV.GOLD_SPEAR:
        case INV.DIAMOND_SPEAR:
        case INV.AMETHYST_SPEAR:
        case INV.AMETHYST_REIDITE:
        case INV.DRAGON_SPEAR:
        case INV.LAVA_SPEAR:
        case INV.REIDITE_SPEAR:
        case INV.CRAB_SPEAR:

          if (!user.zombie) {

            /* Stop any preview */
            user.craft.preview = -1;

            const p = world.fast_units[user.uid];

            if (p && p.right === id)
              sendJson([5, INV.HAND]);

            else {
              user.weapon.wait = true;
              sendJson([5, id]);
            }
          }
          break;

        case INV.PICK:
        case INV.PICK_WOOD:
        case INV.PICK_GOLD:
        case INV.PICK_DIAMOND:
        case INV.HAMMER:
        case INV.HAMMER_GOLD:
        case INV.HAMMER_DIAMOND:
        case INV.BOOK:
        case INV.HAMMER_AMETHYST:
        case INV.HAMMER_REIDITE:
        case INV.PICK_AMETHYST:
        case INV.PICK_REIDITE:
        case INV.SUPER_HAMMER:
        case INV.SHOVEL:
        case INV.SHOVEL_GOLD:
        case INV.SHOVEL_DIAMOND:
        case INV.SHOVEL_AMETHYST:
        case INV.SPANNER:
        case INV.MACHETE:
        case INV.PITCHFORK:
        case INV.PITCHFORK2:
        case INV.SADDLE:
        case INV.WATERING_CAN_FULL:
        case INV.WOOD_SHIELD:
        case INV.STONE_SHIELD:
        case INV.GOLD_SHIELD:
        case INV.DIAMOND_SHIELD:
        case INV.AMETHYST_SHIELD:
        case INV.REIDITE_SHIELD:

          if (!user.zombie) {

            /* Stop any preview */
            user.craft.preview = -1;

            const p = world.fast_units[user.uid];

            if (p && p.right === id) {
              sendJson([5, INV.HAND]);
            }

            else sendJson([5, id]);
          }
          break;

        case INV.BOAT:
        case INV.SLED:
        case INV.MOUNT_BOAR:
        case INV.BABY_MAMMOTH:
        case INV.CRAB_BOSS:
        case INV.BABY_DRAGON:
        case INV.BABY_LAVA:
        case INV.HAWK:
        case INV.PLANE:
        case INV.NIMBUS:

          if (!user.zombie) {

            /* Stop any preview */
            user.craft.preview = -1;

            const p = world.fast_units[user.uid];
            sendJson([5, id]);
          }
          break;

        case INV.CROWN_GREEN:
        case INV.CROWN_ORANGE:
        case INV.CROWN_BLUE:
        case INV.WOOD_HELMET:
        case INV.STONE_HELMET:
        case INV.GOLD_HELMET:
        case INV.DIAMOND_HELMET:
        case INV.AMETHYST_HELMET:
        case INV.REIDITE_HELMET:
        case INV.DIAMOND_PROTECTION:
        case INV.AMETHYST_PROTECTION:
        case INV.REIDITE_PROTECTION:
        case INV.DRAGON_HELMET:
        case INV.LAVA_HELMET:
        case INV.WITCH:
        case INV.CROWN_CRAB:
        case INV.SUPER_DIVING_SUIT:

          const p = world.fast_units[user.uid];
          if (p && p.clothe !== id)
            user.helmet.wait = true;

          sendJson([5, id]);
          break;

        case INV.EARMUFFS:
        case INV.HOOD:
        case INV.PEASANT:
        case INV.WINTER_PEASANT:
        case INV.COAT:
        case INV.CAP_SCARF:
        case INV.FUR_HAT:
        case INV.PILOT_HELMET:
        case INV.TURBAN1:
        case INV.TURBAN2:
        //Christmas
        case INV.CHRISTMAS_HAT:
        case INV.ELF_HAT:
        case INV.WINTER_HOOD:
        case INV.EXPLORER_HAT:
        case INV.PIRATE_HAT:
        case INV.DIVING_MASK:
          sendJson([5, id]);
          break;
      }
    }

    /* Delete items in inventory */
    this.delete_inv = function (id) {
      sendJson([6, id]);
    };

    this.delete_inv_ok = function (id) {
      /* Remove item from inventory */
      user.build.wait = true;

      const i = user.inv.find_item(id);
      user.inv.delete_item(id, i);

      user.craft.update();
    };

    /* Recycle one item in inventory */
    this.recycle_inv = function (id, i) {
      sendJson([29, id]);
    };

    /* Delete one item in inventory */
    this.delete_one_inv = function (id, i) {
      sendJson([28, id]);
    };

    this.delete_one_inv_ok = function (id) {

      /* Remove item from inventory */
      user.build.wait = true;

      const i = user.inv.find_item(id);
      user.inv.decrease(id, 1, i);

      user.craft.update();
    };

    this.delete_single_inv = function (data) {
      const id = data[1];
      const amount = data[2];

      /* Remove item from inventory */
      user.build.wait = true;

      const i = user.inv.find_item(id);
      user.inv.decrease(id, amount, i);
      user.craft.update();
    };

    /* Stop attack */
    this.stop_attack = function () { sendJson([14]); };

    /* Send attack */
    this.send_attack = function (angle) {
      sendJson(
        [4, Math.floor(((angle + pi2) % pi2) * 255 / pi2)]);
    }

    /* Send angle */
    this.send_angle = function (angle) {
      sendJson(
        [3, Math.floor(((angle + pi2) % pi2) * 255 / pi2)]);
    }

    /* Send move */
    this.send_move = function (move) {
      sendJson([2, move]);
    }

    /* Send command message */
    this.send_command = function (buffer) {

      /* Send to the server */
      sendJson([36, buffer]);
    }

    /* Send chat message */
    this.send_chat = function (buffer) {

      /* Print your message in the chat */
      const p = world.fast_units[user.uid];
      if (user.zombie) {
        if (Math.random() > 0.5)
          p.text.push(buffer.substring(0, 25) + " ..." + ZOMBIE_GRUMBLE);
        else
          p.text.push(ZOMBIE_GRUMBLE + "... " + buffer.substring(0, 25));
      } else
        p.text.push(buffer);

      /* Send to the server */
      sendJson([0, buffer]);
    }

    /* Move units */
    this.move_units = function (p) {

      const u = player.select.units;

      /* If selection is empty, it's useless to continue */
      if (u.length == 0) return;
      const data = [2]
      const ids = [];

      /* Translate position with camera */
      Utils.sub_vector(p, { x: player.cam.rx, y: player.cam.ry });
      data.push(p.x);
      data.push(p.y);

      /* Store units relative id */
      for (let i = 0; i < u.length; i++) ids.push(u[i].oid);
      data.push(ids);

      sendJson(data);
    }

    /* Update camera */
    this.cam_delay = 0;
    this.last_cam = { i: 0, j: 0 };
    this.update_cam = function () {

      if (old_timestamp - this.cam_delay > CLIENT.CAM_DELAY) {

        this.cam_delay = old_timestamp;

        const c = user.cam;

        /* Update only if needed (because the camera may not move */
        const i = Math.floor(c.x / 100);
        const j = Math.floor(c.y / 100);
        if (this.last_cam.i != i || this.last_cam.j != j) {

          sendJson([1, Math.floor(-c.x), Math.floor(-c.y)]);

          /* Update last reference cam */
          this.last_cam.i = i;
          this.last_cam.j = j;
        }
      }
    }

    /* Try ping */
    this.ping_delay = 0;
    this.try_ping = function () {

      if (old_timestamp - this.ping_delay > CLIENT.PING_DELAY) {

        this.ping_delay = old_timestamp;
        this.ping();
      }
    }

    /* Connection was lost */
    this.lost = function () {

      user.reconnect.enabled = true;

      /* Skip old message */
      if (this._current_id != this.socket._current_id) return;
      this._current_id++;
      this.socket.close();
      client.connect();
    }

    /* Join team */
    this.join_new_team = function (ui8) {

      this.new_alert(LANG[TEXT.JOIN_TEAM]);

      for (let i = 1; i < ui8.length; i++)
        user.team.push(ui8[i]);
    }

    /* New member team */
    this.new_member_team = function (id) {

      this.new_alert(world.players[id].nickname + LANG[TEXT.JOINED_TEAM]);

      user.team.push(id);

      /* Refresh the window if open */
      const div = document.getElementById("team_box");
      if (game.team_buttons_id != -1 && div.style.display == "inline-block")
        game.team_buttons[game.team_buttons_id].action();
    }

    /* Destroy team */
    this.destroy_team = function () {

      this.new_alert(LANG[TEXT.TEAM_DESTROYED]);

      user.totem.wait = true;
      user.team = [];
      document.getElementById("team_box").style.display = "none";
    }

    /* Exclude member of team */
    this.exclude_team = function (id) {

      if (id == user.id) {

        this.new_alert(LANG[TEXT.LEFT_TEAM]);

        user.totem.wait = true;
        user.team = [];
        document.getElementById("team_box").style.display = "none";
      } else {

        this.new_alert(world.players[id].nickname + LANG[TEXT.LEFT_TEAM2]);

        for (let i = 0; i < user.team.length; i++) {

          if (user.team[i] == id) {
            user.team.splice(i, 1);
            break;
          }
        }

        /* Refresh the window if open */
        const div = document.getElementById("team_box");
        if (game.team_buttons_id != -1 && div.style.display == "inline-block")
          game.team_buttons[game.team_buttons_id].action();
      }
    }

    /* Player is dead */
    this.steal_token = function () {
      /* Kill user (I mean, not litteraly) */
      user.alive = false;

      /* Store the nickname of the player TODO not used right now */
      this.new_alert(LANG[TEXT.TOKEN]);

      /* Skip old message */
      if (this._current_id != this.socket._current_id) return;
      this._current_id++;

      /* Quit the game */
      if (!window['LOLIPOP_UI']['state']) restarve.emit('switchUI');

      game.quit(ui.run);
      this.socket.close();
    }

    /* Player is dead */
    this.killed = function (howdie, data) {

      /* Kill user (I mean, not litteraly) */
      user.alive = false;

      const ui16 = new Uint16Array(data);
      const ui32 = new Uint32Array(data);

      user.die.howdie = DIE[howdie][Math.floor(Math.random() * DIE[howdie].length)];
      user.die.score = Utils.simplify_number(world.players[user.id].score);
      user.die.bank = Utils.simplify_number(ui32[1]);
      user.die.kill = ui16[1];

      /* Store the nickname of the player TODO not used right now */
      this.new_alert(LANG[TEXT.YOU_DEAD]);

      /* Skip old message */
      if (this._current_id != this.socket._current_id) return;
      this._current_id++;

      /* Quit the game */
      if (!window['LOLIPOP_UI']['state']) restarve.emit('switchUI');

      game.quit(scoreboard.run);
      this.socket.close();
    }

    /* Send ping to the server */
    this.ping = function () { this.socket.send(CLIENT.PING); }

    /* Check state of socket */
    this.check_state = function () {

      if (this.socket.readyState == 3) {

        this.timeout_server -= CLIENT.TIMEOUT_SERVER;
      }
    }

    /* Check if server is active */
    this.check_pong = function () {

      /* If user loose the focus of windows */
      if (delta > CLIENT.LOOSE_FOCUS) this.timeout_server = old_timestamp;

      /* Ok the connecction is probably dead, we cut it ! */
      if (old_timestamp - this.timeout_server > CLIENT.TIMEOUT_SERVER) {

        this.timeout_server = old_timestamp;
        this.lost();
      }
    }

    /* Handshake, send user information */
    this.handshake = function (msg) {
      if (window['LOLIPOP_UI']['state']) restarve.emit('switchUI');

      /* Do not kill this connection ! */
      clearTimeout(this.timeout_handler);

      // Clean explorer quest
      document.getElementById("exploreForest").src = "graphics/forest-leaf.png";
      document.getElementById("exploreWinter").src = "graphics/winter-flake.png";
      document.getElementById("exploreDesert").src = "graphics/desert-cactus.png";
      document.getElementById("exploreLava").src = "graphics/lava-volcano.png";

      /* Set timeout for server (reinit per ping) */
      this.timeout_server = old_timestamp;

      /* Set gauges */
      user.gauges.cold.ed = user.gauges.cold.em;
      user.gauges.hunger.ed = user.gauges.hunger.em;
      user.gauges.thirst.ed = user.gauges.thirst.em;
      user.gauges.oxygen.ed = user.gauges.oxygen.em;
      user.gauges.warm.ed = user.gauges.warm.em;
      user.gauges.l = 1;
      user.gauges.c = 1;
      user.gauges.h = 1;
      user.gauges.t = 1;
      user.gauges.o = 1;
      user.gauges.wa = 1;

      /* Disable bigmap */
      user.bigmap = false;

      /* Disable info box */
      game.info_box.display = 0;

      /* Set inventory */
      user.inv.can_select = [];
      user.inv.n = [];
      user.inv.max = WORLD.WITHOUT_BAG;
      user.inv.bonus = 0;
      user.inv.bag = 0;
      user.inv.id = -1;

      /* Default UI */
      game.show_recipe_book = 1;
      game.show_clock = 1;
      game.show_quest = 1;
      game.show_market = 1;

      /* User is now alive */
      user.alive = true;

      /* Set drag system */
      user.inv.drag.stop();

      /* Set craft system */
      user.craft.can_craft = [];
      user.craft.crafting = false;
      user.craft.can_build = false;
      user.craft.preview = -1;
      user.craft.id = -1;
      user.craft.workbench = false;
      user.craft.well = false;
      user.craft.fire = false;
      user.craft.water = false;
      user.craft.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1, 1);

      /* Delay weapon */
      user.weapon.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1 / 10, 1);
      user.weapon.wait = false;

      /* Delay helmet */
      user.helmet.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1 / 5, 1);
      user.helmet.wait = false;

      /* Delay build */
      user.build.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1, 1);
      user.build.wait = false;

      /* Delay totem */
      user.totem.id = -1;
      user.totem.pid = -1;
      user.totem.wait = false;
      user.totem.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1 / 30, 1);

      /* Disable craft list */
      game.craft_list.open = false;

      /* Flush players on minimap */
      // game.minimap.players  = [];

      /* Disable options */
      user.show_spectators.enabled = false;

      /* Set mode party */
      world.mode = msg[1];

      /* Get world size */
      if (msg[20] !== undefined && msg[21] !== undefined) {

        world.nw = msg[20];
        world.nh = msg[21];
        world.w = world.nw * world.dw;
        world.h = world.nh * world.dh;
      }

      /* Get custom map configuration */
      world.islands = msg[22];
      world.custom_map = msg[23];

      /* Get welcome message */
      _this.welcome(msg[24]);

      /* Get the new recipes */
      _this.new_recipes(msg[25]);

      /* Get the sand tempest state */
      user.desert.tempest = msg[26];

      /* Reset the blizzard status */
      user.blizzard = 0;

      /* Get the blizzard tempest state */
      user.winter.tempest = msg[27];

      /* Generate the world */
      world.generate_world(msg[19]);

      /* Set time */
      world.time = msg[5];
      world.clock.hour = msg[15];
      world.clock.init = new Date().getTime();

      game.quests.born = msg[16];

      world.transition = false;
      user.day = msg[2];

      /* Reset quests */
      game.quests.reset();

      /* Set team */
      user.team = msg[8];

      /* Clean leaderboard units */
      world.delete_all_units();

      /* Store world size informations */
      world.max_units = msg[7];

      /* Store hanshake data */
      user.id = msg[9];
      user.uid = user.id * world.max_units;

      /* Update uid if sound is loaded */
      if (audio.loaded) {
        audio.players[0].uid = user.uid;
        audio.players[0].free = 0;
      }

      /* Reset move action */
      keyboard.clear_directionnal();

      /* Set camera */
      user.cam.change(msg[3], msg[10]);

      world.players = [];
      const players = world.players;

      /* Create new players */
      for (let i = 0; i < msg[11]; i++)
        players.push(new Player());

      /* Store players information */
      for (let i = 0, l = msg[4]; i < l.length; i++) {
        const p = players[l[i]["i"]];

        p.nickname = l[i]["n"];
        p.skin = l[i]["s"];
        p.accessory = l[i]["a"];
        p.crate = l[i]["c"];
        p.book = l[i]["b"];
        p.dead = l[i]["d"];
        p.baglook = l[i]["g"];
        p.level = l[i]["l"];
        p.score = Utils.restore_number(l[i]["p"]);
        p.alive = true;
      }

      /* Sort leaderboard */
      user.ldb.sort();

      /* Set spectator mode */
      if (world.mode === WORLD.MODE_HUNGER_GAMES &&
        world.players[user.id].nickname === "spectator")
        user.spectator = true;
      else user.spectator = false;

      /* Set zombie */
      if (world.mode === WORLD.MODE_ZOMBIES &&
        world.players[user.id].skin === WORLD.ZOMBIE_SKIN)
        user.zombie = true;
      else user.zombie = false;

      /* Set vampire */
      if (world.mode === WORLD.MODE_VAMPIRES &&
        world.players[user.id].skin === WORLD.VAMPIRE_SKIN)
        user.vampire = true;
      else user.vampire = false;

      /* Memorize token */
      Cookies.set("starve_token", user.token);

      /* Player restored */
      if (msg[12] === 0) {

        /* Set delay of the shop */
        user.shop.delay = 0;

        /* Restore quests */
        game.quests.restore(msg[17]);

        /* Restore inventory */
        const inv = msg[14];
        if (inv[INV.BAG])
          user.inv.update_bag_size(1, 0);

        for (let i = 0; i < inv.length; i++) {

          if (inv[i]) {

            if (i == INV.BAG) continue;
            else if (i == INV.HAND) continue;
            else this.gather([0, i, inv[i]]);
          }
        }

        user.shop.open = false;

      } else {

        /* The player start with a sandworm juice */
        if (world.mode === WORLD.MODE_LEGACY)
          this.gather([0, INV.SANDWORM_JUICE, 1]);

        /* The player start with roof */
        else if (world.mode === WORLD.MODE_VAMPIRES) {
          if (user.vampire)
            this.gather([0, INV.ROOF, 4]);
          else
            this.gather([0, INV.GARLIC_SEED, 3]);
        }

        /* Set delay of the shop */
        if (world.mode === WORLD.MODE_PVP || world.mode === WORLD.MODE_VAMPIRES ||
          world.mode === WORLD.MODE_EXPERIMENTAL || world.mode === WORLD.MODE_LEGACY) {

          user.shop.delay = new Date().getTime();
          user.shop.open = true;
          user.shop.value = msg[13];
          game.shop.init();

        } else {

          user.shop.delay = 0;
          user.shop.open = false;
          user.shop.value = 0;
        }

        user.token_id = msg[12].toString();
      }

      user.ghost.enabled = msg[6];
      user.ghost.delay = -1;
      user.ghost.label = null;
      user.ghost.now = -1;

      Cookies.set("starve_token_id", user.token_id);

      if (user.reconnect.enabled) {
        /* Reset reconnect */
        user.reconnect.rotate = 0;
        user.reconnect.enabled = false;
        /* Quit ui and run game */
      } else {
        ui.quit(game.run);
      }
    }

    /* Connect to a server */
    this.connect = function () {
      /* Reset counter of reconnection */
      this.timeout_number = 0;

      /* Launch connection */
      this.connect_timeout();
    }

    this.connect_timeout = function () {
      const ssl = 0;
      const dns = window['LOLIPOP_SELECTED_SERVER']['h'] + ":" + window['LOLIPOP_SELECTED_SERVER']['p'];

      this.socket = new window.WebSocket("ws" + ((ssl === 1) ? "s" : "") + "://" + dns);
      this.socket["binaryType"] = "arraybuffer";
      this.socket._current_id = this._current_id;

      /* Display message */
      restarve.emit('destroyMessage', 'DOWNLOAD_SERVER_DATA');
      restarve.emit('createMessage', {
        title: 'Connecting',
        actions: [
          {
            text: 'Cancel',
            callback: () => {
              clearTimeout(_this.timeout_handler);
              ui.waiting = false;

              if (!ui.is_run) game.quit(ui.run);

              restarve.emit('destroyMessage', 'GAME_CONNECTING');
              if ('discord' in window) window.discord.update('In game', 'In main menu');
            }
          }
        ],
        progress: {
          show: true,
          fill: 0
        },
        identifier: 'GAME_CONNECTING',
        description: `Connecting to '${this.socket.url}'`,
      });

      /* Set info on Discord RPC */
      if ('discord' in window) window.discord.update('In game', `Connecting..`);

      /* When server send a message */
      this.socket.onmessage = function (evt) {

        /* Skip old message */
        if (this._current_id != _this._current_id) return;

        /* If unicode data */
        if (typeof evt.data == "string") {

          const msg = JSON.parse(evt.data);

          switch (msg[0]) {

            case 0: _this.chat(msg); break;
            case 1: _this.kick(msg[1]); break;
            case 2: _this.new_player(msg); break;
            case 3: _this.handshake(msg); break;
            case 4: _this.message(msg[1]); break;
            case 5: _this.commands(msg); break;
            case 6: _this.welcome(msg[1]); break;
          }

          /* Else raw data */
        } else {

          // Decode data
          const ui8 = new Uint8Array(evt.data);

          switch (ui8[0]) {

            case 0: _this.units(evt.data, ui8, false); break;
            case 1: _this.units(evt.data, ui8, true); break;
            case 2: _this.cancel_craft(); break;
            case 3: _this.gather(new Uint16Array(evt.data)); break;
            case 4: _this.old_version(); break;
            case 5: _this.full(); break;
            case 6: _this.dont_harvest(); break;
            case 7: _this.hitten(evt.data); break;
            case 8: _this.build_stop(ui8[1]); break;
            case 9: _this.build_ok(ui8[1]); break;
            case 10: _this.inv_full(); break;
            case 11: _this.decrease_item(ui8[1], ui8[2]); break;
            case 12: _this.workbench(ui8[1]); break;
            case 13: _this.hitten_other(ui8, evt.data); break;
            case 14: _this.mute(); break;
            case 15: _this.kill_player(ui8[1]); break;
            case 16: _this.gauges(ui8[1], ui8[2], ui8[3],
              ui8[4], ui8[5], ui8[6],
              ui8[7]); break;
            case 17: _this.recover_focus(evt.data); break;
            case 18: _this.empty_res(); break;
            case 19: _this.fire(ui8[1]); break;
            case 20: _this.survive(); break;
            case 21: _this.leaderboard(evt.data); break;
            case 22: _this.get_time(ui8[1]); break;
            case 23: _this.set_cam(evt.data); break;
            case 24: _this.accept_build(ui8[1]); break;
            case 25: _this.killed(ui8[1], evt.data); break;
            case 26: _this.minimap(ui8); break;
            case 27: _this.fail_restore(); break;
            case 28: _this.ghost(ui8[1]); break;
            case 29: _this.reborn(); break;
            case 30: _this.steal_token(); break;
            case 31: _this.join_new_team(ui8); break;
            case 32: _this.exclude_team(ui8[1]); break;
            case 33: _this.new_member_team(ui8[1]); break;
            case 34: _this.destroy_team(); break;
            case 35: _this.kit_ok(ui8[1]); break;
            case 36: _this.water(ui8[1]); break;
            case 37: _this.gauges_life(ui8[1], ui8[2]); break;
            case 38: _this.gauges_food(ui8[1]); break;
            case 39: _this.gauges_water(ui8[1]); break;
            case 40: _this.get_bag(); break;
            case 41: _this.verified_account(ui8); break;
            case 42: _this.succeed_quest(ui8[1]); break;
            case 43: _this.fail_quest(ui8[1]); break;
            case 44: _this.claimed(ui8[1]); break;
            case 45: _this.recycle_ok(ui8[1]); break;
            case 46: _this.recycle_stop(ui8[1]); break;
            case 47: _this.well(ui8[1]); break;
            case 48: _this.no_resources(); break;
            case 50: _this.decrease_item2(ui8[1], ui8[2], ui8[3]); break;
            case 51: _this.blocked(); break;
            case 52: _this.delete_inv_ok(ui8[1]); break;
            case 53: _this.delete_one_inv_ok(ui8[1]); break;
            case 54: _this.account_ok(); break;
            case 55: _this.gauges_warm(ui8[1]); break;
            case 56: _this.gauges_cold(ui8[1]); break;
            case 57: _this.new_version(); break;
            case 58: _this.wrong_password(); break;
            case 59: _this.clean_inventory(); break;
            case 60: _this.hide_shop_kit(); break;
            case 61: user.cam.forcedDelay = 0.2; user.cam.delay = 3; break;
            case 62: _this.delete_single_inv(new Uint16Array(evt.data)); break;
            case 63: _this.hide_clock(); break;
            case 64: _this.hide_recipe_book(); break;
            case 65: _this.hide_quest(); break;
            case 66: _this.hide_market(); break;
            case 67: _this.explorer_quest(ui8[1]); break;
            case 68: _this.sand_tempest(ui8[1]); break;
            case 69: _this.blizzard(ui8[1]); break;
            case 70: _this.blizzard_status(ui8[1]); break;
            case 71: _this.bandage(ui8[1]); break;
          }
        }
      }

      /* When server open connection */
      this.socket.onopen = function () {
        /* Destroy message */
        restarve.emit('destroyMessage', 'GAME_CONNECTING');

        /* Display info on Discord RPC */
        if ('discord' in window) window.discord.update('In game', `Playing on '${client.socket.url}'`);

        clearTimeout(_this.timeout_handler);

        sendJson([
          '', // 0
          screen.width + 200, // 1 
          screen.height + 200, // 2
          [
            window.LOLIPOP_DATA.LOLIPOP_ENV,
            window.LOLIPOP_DATA.LOLIPOP_BUILD_HASH,
            window.LOLIPOP_DATA.PROJECT_VERSION,
            window.LOLIPOP_DATA.PROJECT_VERSION_CHANNEL,
          ], // 3
          user.token, // 4
          user.token_id, // 5
          user.reconnect.enabled ? 1 : 0, // 6
          ui.skin, // 7
          ui.accessory, // 8
          ui.bag, // 9
          ui.book, // 10
          ui.crate, // 11
          ui.dead, // 12
          (userId === undefined) ? 0 : userId, // 13
          (userToken === undefined) ? 0 : userToken.substring(userToken.length - 50), // 14
        ]);
        _this.timeout_handler = setTimeout(_this.timeout, CLIENT.TIMEOUT_TIME);
      };

      /* wait for server */
      this.timeout_handler = setTimeout(_this.timeout, CLIENT.TIMEOUT_TIME);
    }
  }

  function Mouse() {
    this.DOWN = 0, this.UP = 1, this.IDLE = 2, this.IN = 0, this.OUT = 1, this.pos = {
      x: 0,
      y: 0
    };

    this.x_old = 0;
    this.y_old = 0;
    this.angle = 0;
    this.state = this.IDLE;
    this.dist = this.IN;
    this.down = function () {
      this.state = this.DOWN;
    };
    this.up = function () {
      this.state = this.UP;
    };

    this.update = function () {
      if ((this.pos.x != this.x_old) || (this.pos.y != this.y_old)) {
        this.x_old = this.pos.x;
        this.y_old = this.pos.y;
        return true;
      }
      return false;
    };
  }

  function Keyboard() {
    this.set_azerty = function () {
      this.LEFT = 81;
      this.RIGHT = 68;
      this.TOP = 90;
      this.DOWN = 83;
    };
    this.set_qwerty = function () {
      this.LEFT = 65;
      this.RIGHT = 68;
      this.TOP = 87;
      this.BOTTOM = 83;
    };
    this.UP = 0, this.DOWN = 1, this._1 = 49;
    this._2 = 50;
    this._3 = 51;
    this._4 = 52;
    this._5 = 53;
    this.CTRL = 17;
    this.ARROW_LEFT = 37;
    this.ARROW_RIGHT = 39;
    this.ARROW_TOP = 38;
    this.ARROW_BOTTOM = 40;
    this.SPACE = 32;
    this.R = 82;
    this.G = 71;
    this.V = 86;
    this.B = 66;
    this.set_qwerty();
    this.keys = new Array(255);

    for (var i = 0; i < 255; i++)
      this.keys[i] = this.UP;

    this.up = function (evt) {
      const k = Math.min(evt.charCode || evt.keyCode, 255);
      this.keys[k] = this.UP;
    };

    this.down = function (evt) {
      const k = Math.min(evt.charCode || evt.keyCode, 255);
      
      if ((k == this.LEFT) || (k == this.ARROW_LEFT))
        this.press_left();
      else if ((k == this.TOP) || (k == this.ARROW_TOP))
        this.press_top();
      else if ((k == this.DOWN) || (k == this.ARROW_DOWN))
        this.press_bottom();
      else if ((k == this.RIGHT) || (k == this.ARROW_RIGHT))
        this.press_right();

      this.keys[k] = this.DOWN;
      return k;
    };
    this.press_left = function () {
      this.keys[this.RIGHT] = this.UP;
      this.keys[this.ARROW_RIGHT] = this.UP;
    };
    this.press_right = function () {
      this.keys[this.LEFT] = this.UP;
      this.keys[this.ARROW_LEFT] = this.UP;
    };
    this.press_bottom = function () {
      this.keys[this.TOP] = this.UP;
      this.keys[this.ARROW_TOP] = this.UP;
    };
    this.press_top = function () {
      this.keys[this.BOTTOM] = this.UP;
      this.keys[this.ARROW_BOTTOM] = this.UP;
    };
    this.clear_directionnal = function () {
      this.keys[this.RIGHT] = this.UP;
      this.keys[this.ARROW_RIGHT] = this.UP;
      this.keys[this.LEFT] = this.UP;
      this.keys[this.ARROW_LEFT] = this.UP;
      this.keys[this.TOP] = this.UP;
      this.keys[this.ARROW_TOP] = this.UP;
      this.keys[this.BOTTOM] = this.UP;
      this.keys[this.ARROW_BOTTOM] = this.UP;
    };
    this.is_left = function () {
      return this.keys[this.LEFT] || this.keys[this.ARROW_LEFT];
    };
    this.is_right = function () {
      return this.keys[this.RIGHT] || this.keys[this.ARROW_RIGHT];
    };
    this.is_top = function () {
      return this.keys[this.TOP] || this.keys[this.ARROW_TOP];
    };
    this.is_bottom = function () {
      return this.keys[this.BOTTOM] || this.keys[this.ARROW_BOTTOM];
    };
    this.is_ctrl = function () {
      return this.keys[this.CTRL];
    };
    this.is_1 = function () {
      return this.keys[this._1];
    };
    this.is_2 = function () {
      return this.keys[this._2];
    };
    this.is_3 = function () {
      return this.keys[this._3];
    };
    this.is_4 = function () {
      return this.keys[this._4];
    };
    this.is_space = function () {
      return this.keys[this.SPACE];
    };
    this.is_r = function () {
      return this.keys[this.R];
    };
    this.is_g = function () {
      return this.keys[this.G];
    };
    this.is_v = function () {
      return this.keys[this.V];
    };
    this.is_b = function () {
      return this.keys[this.B];
    };
  }

  function draw(timestamp) {
    window.requestAnimationFrame(draw);

    const now = Date.now();
    frame++;

    if (now - start > 1000) {
      const frames = ~~(frame / ((now - start) / 1000));

      start = now;
      frame = 0;

      restarve.emit("updateFPS", frames);
    }

    window.delta = (timestamp - old_timestamp) / 1000;
    old_timestamp = timestamp;

    window.delta = (window.delta > 1) ? 1 : window.delta;

    if (window.game.is_run) {
      game.draw();
    } else {
      window.ctx.clearRect(0, 0, window.canw, window.canh);

      if (window.loader.is_run) window.loader.draw();
      else if (window.ui.is_run) {
        window.ui.update();
        window.ui.draw();
      } else if (window.scoreboard.is_run) window.scoreboard.draw();
    }
  }

  //----------------------------------------------------------------
  // Injecting hooks
  //----------------------------------------------------------------

  const SOCKET_EVENTS_APPLY = [
    ['open', () => (
      // Start updating bandwidth info
      UPDATE_NETWORK_BANDWIDTH_INT = setInterval(UPDATE_NETWORK_BANDWIDTH, 1000, true),
      UPDATE_NETWORK_BANDWIDTH(true)
    )],
    ['close', () => {
      SOCKET_SENT_BYTES = 0;
      SOCKET_RECIEVED_BYTES = 0;

      UPDATE_NETWORK_BANDWIDTH();

      if (typeof UPDATE_NETWORK_BANDWIDTH_INT !== 'boolean') {
        clearInterval(UPDATE_NETWORK_BANDWIDTH_INT);

        UPDATE_NETWORK_BANDWIDTH_INT = false;
      }
    }],
    ['message', event => {
      if (typeof event.data === 'string')
        SOCKET_RECIEVED_BYTES += event.data.length;
      else {
        const u8 = new Uint8Array(event.data);

        if (u8.length)
          SOCKET_RECIEVED_BYTES += u8.length;
      }
    }]
  ];

  const INJECT_HOOKS = () => {
    //----------------------------------------------------------------
    // WebSocket hooks implementation
    //----------------------------------------------------------------
    const APPLY_WEBSOCKET_HOOKS = () => {
      // TODO: fix hooks before obfuscation

      // Existing non-hooked functions
      // const wsSend = WebSocket.prototype.send;
      /**
       * @hook WebSocket.prototype.send
       * @param data {any} - data to send
       * @memberof pro.restarve.hooks.WebSocket
       * @description Hook for sending from normal standard data to an xor encrypted with random offsets
       */
      // WebSocket.prototype.send = function (data) {
      //   let encrypted;
      //   try {
      //     encrypted = msgpack.encode(encrypt(data));
      //   } catch (e) {
      //     throw null;
      //   }
      //   SOCKET_SENT_BYTES += encrypted.length;
      //   return wsSend.apply(this, [encrypted]);
      // };

      /**
       * @hook WebSocket instances
       * @memberof pro.restarve.hooks.WebSocket.Main
       * @description Hooking WebSocket instances
       */
      const restarveWebSocketMain = new Proxy(window.WebSocket, {
        construct(target, args) {
          // Call the our instance of WS
          const instance = new target(...args);

          // Set binary type to arraybuffer
          instance.binaryType = 'arraybuffer';

          if (instance) {

            // Apply all event listeners from const array
            const EVENTS_LENGTH = SOCKET_EVENTS_APPLY.length;
            for (let index = 0; index < EVENTS_LENGTH; index++) {
              const event = SOCKET_EVENTS_APPLY[index];

              if (event) {
                const [name, func] = event;

                instance.addEventListener(name, func);
              }
            }

            return instance;
          }

          return null;
        }
      });

      // Hook WebSocket to our new one
      window.WebSocket = restarveWebSocketMain;
    };

    // Apply all hooks
    APPLY_WEBSOCKET_HOOKS();
  };

  //----------------------------------------------------------------
  // Bootstrap (the one who decides to run)
  //----------------------------------------------------------------

  async function bootstrap() {
    // Framework data verification
    if ('LOLIPOP_DATA' in window) {
      // Check every data to verify
      for (const [key, value] of Object.entries(CHECKS)) {
        if (key in window['LOLIPOP_DATA']) {
          const original = window['LOLIPOP_DATA'][key];
          const vaild = typeof original === typeof value && original === value;

          // Embedded data is not vaild
          if (!vaild) throw "Framework verification failed: Invalid data";
        }
      }
    } else throw "Framework verification failed: No data";

    // Framework libraries verification
    for (const [libName, isLibRequired] of Object.entries(CHECKS_LIBRARIES)) {
      if (isLibRequired) {
        if (!(libName in window))
          throw `Framework verification failed: lib "${libName}" is missing`;
      }
    }

    // Apply framework functionalities
    ANTI_DEBUG();
    INJECT_HOOKS();

    // Initialize game
    window.MAP = [];

    window.fake_world = {};
    window.fake_world.time = ~~(Math.random() * 2)
    window.fake_world.items = [];

    window.game = {};
    window.game.is_run = false;

    window.ui = false;
    window.user = false;
    window.world = false;
    window.scoreboard = false;

    // Devices
    window.mouse = new Mouse();
    window.keyboard = new Keyboard();

    // Network client
    window.client = new NetworkClient;

    // Audio
    window.audio = new window.Audio();

    window.delta = 0;
    window.init_fake_world();

    window.loader = new window.Loader(window.can, window.ctx, function () {
      /* Callback ready statement to new UI */
      restarve.emit('ready');

      /* We loaded all images so we load sprites */
      window.create_images();

      /* Load game */
      window.game = new window.Game(window.can, window.ctx);

      /* Load front page, user interface */
      window.ui = new window.UI(window.can, window.ctx);

      /* Load scoreboard interface */
      window.scoreboard = new window.Scoreboard(window.can, window.ctx);

      /* Load world object */
      window.world = new window.World();

      /* Load user object */
      window.user = new window.User();

      /* All stuff was loaded, so we quit loader and start menu */
      window.loader.quit(function () {
        window.loader.logo.style.display = "none";
        window.ui.run();
      });
    });

    draw(0);
    window.resize_canvas();
    setInterval(window.resize_canvas, 1000);
  }

  bootstrap();
})();