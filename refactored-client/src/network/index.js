import { CLIENT, INV, STATE, RECIPES, KIT, WORLD, pi2, LANG, TEXT, ZOMBIE_GRUMBLE, ZOMBIE_GRUMBLES } from '../constants';
import { ui, game, user, world, MAP, OLD_RECIPES } from '../game';
import { LinearAnimation, dist, simplify_number, restore_number } from '../utils';
import { Item, Player } from '../world';
import { old_timestamp, delta } from '../canvas';
import loadSocket from './socket';

export default function NetworkClient() {
  loadSocket();

  /* WATCH OUT, I"M NOT SURE ABOUT THIS TRICK, IT MAY BE A SOURCE OF BUG *
   * That seem work for use this object in a event listener              */
  const _this = this;

  const sendJson = data => {
    // const encrypted = window.msgpack.encode(encrypt(JSON.stringify(data)));
    // SOCKET_SENT_BYTES += encrypted.length;
    const encrypted = JSON.stringify(data);

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
      _this.new_alert(LANG[TEXT.YOU_CANNOT_JOIN]);

      ui.waiting = false;

      /* User was trying to restore the connection */
      if (user.reconnect.enabled) {

        /* Quit the game */
        game.quit(ui.run);
      }
    } else {
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
      document.getElementById("exploreForest").src = "img/forest-leaf-ok.png";
    else if (biome === 1)
      document.getElementById("exploreWinter").src = "img/winter-flake-ok.png";
    else if (biome === 2)
      document.getElementById("exploreLava").src = "img/lava-volcano-ok.png";
    else if (biome === 3)
      document.getElementById("exploreDesert").src = "img/desert-cactus-ok.png";
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
    user.craft.timeout = new LinearAnimation(false, 0, 1, 0, 1, 1);
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
      for(let i = 0 ; i < world.units.length ; i++) {
        if (world.units[i].state != S.DIE)
        str += world.units[i].uid + ", ";
      }
      str += "|"
      for(let i = 0 ; i < world.units.length ; i++) {
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

      if (pid != 0 && dist(u, u.r) > CLIENT.LAG_DISTANCE) { u.x = x; u.y = y; }

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

      if (p && !d && !user.spectator && dist(pos, p) < 250) {
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
    user.die.score = simplify_number(world.players[user.id].score);
    user.die.bank = simplify_number(ui32[1]);
    user.die.kill = ui16[1];

    /* Store the nickname of the player TODO not used right now */
    this.new_alert(LANG[TEXT.YOU_DEAD]);

    /* Skip old message */
    if (this._current_id != this.socket._current_id) return;
    this._current_id++;

    /* Quit the game */
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
    /* Do not kill this connection ! */
    clearTimeout(this.timeout_handler);

    // Clean explorer quest
    document.getElementById("exploreForest").src = "img/forest-leaf.png";
    document.getElementById("exploreWinter").src = "img/winter-flake.png";
    document.getElementById("exploreDesert").src = "img/desert-cactus.png";
    document.getElementById("exploreLava").src = "img/lava-volcano.png";

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
    user.craft.timeout = new LinearAnimation(false, 0, 1, 0, 1, 1);

    /* Delay weapon */
    user.weapon.timeout = new LinearAnimation(false, 0, 1, 0, 1 / 10, 1);
    user.weapon.wait = false;

    /* Delay helmet */
    user.helmet.timeout = new LinearAnimation(false, 0, 1, 0, 1 / 5, 1);
    user.helmet.wait = false;

    /* Delay build */
    user.build.timeout = new LinearAnimation(false, 0, 1, 0, 1, 1);
    user.build.wait = false;

    /* Delay totem */
    user.totem.id = -1;
    user.totem.pid = -1;
    user.totem.wait = false;
    user.totem.timeout = new LinearAnimation(false, 0, 1, 0, 1 / 30, 1);

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
      p.score = restore_number(l[i]["p"]);
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
    const dns = "127.0.0.1:8888";

    this.socket = new WebSocket("ws" + ((ssl === 1) ? "s" : "") + "://" + dns);
    this.socket._current_id = this._current_id;

    /* When server send a message */
    this.socket.onmessage = function (evt) {

      /* Skip old message */
      if (this._current_id != _this._current_id) return;

      /* If unicode data */
      if (typeof evt.data == "string") {

        const msg = JSON.parse(evt.data);

        switch (msg[0]) {

          case 0: return _this.chat(msg);
          case 1: return _this.kick(msg[1]);
          case 2: return _this.new_player(msg);
          case 3: return _this.handshake(msg);
          case 4: return _this.message(msg[1]);
          case 5: return _this.commands(msg);
          case 6: return _this.welcome(msg[1]);
        }

        /* Else raw data */
      } else {

        // Decode data
        const ui8 = new Uint8Array(evt.data);

        switch (ui8[0]) {

          case 0: return _this.units(evt.data, ui8, false);
          case 1: return _this.units(evt.data, ui8, true);
          case 2: return _this.cancel_craft();
          case 3: return _this.gather(new Uint16Array(evt.data));
          case 4: return _this.old_version();
          case 5: return _this.full();
          case 6: return _this.dont_harvest();
          case 7: return _this.hitten(evt.data);
          case 8: return _this.build_stop(ui8[1]);
          case 9: return _this.build_ok(ui8[1]);
          case 10: return _this.inv_full();
          case 11: return _this.decrease_item(ui8[1], ui8[2]);
          case 12: return _this.workbench(ui8[1]);
          case 13: return _this.hitten_other(ui8, evt.data);
          case 14: return _this.mute();
          case 15: return _this.kill_player(ui8[1]);
          case 16: return _this.gauges(ui8[1], ui8[2], ui8[3],
            ui8[4], ui8[5], ui8[6],
            ui8[7]);
          case 17: return _this.recover_focus(evt.data);
          case 18: return _this.empty_res();
          case 19: return _this.fire(ui8[1]);
          case 20: return _this.survive();
          case 21: return _this.leaderboard(evt.data);
          case 22: return _this.get_time(ui8[1]);
          case 24: return _this.accept_build(ui8[1]);
          case 25: return _this.killed(ui8[1], evt.data);
          case 26: return _this.minimap(ui8);
          case 27: return _this.fail_restore();
          case 28: return _this.ghost(ui8[1]);
          case 29: return _this.reborn();
          case 30: return _this.steal_token();
          case 31: return _this.join_new_team(ui8);
          case 32: return _this.exclude_team(ui8[1]);
          case 33: return _this.new_member_team(ui8[1]);
          case 34: return _this.destroy_team();
          case 35: return _this.kit_ok(ui8[1]);
          case 36: return _this.water(ui8[1]);
          case 37: return _this.gauges_life(ui8[1], ui8[2]);
          case 38: return _this.gauges_food(ui8[1]);
          case 39: return _this.gauges_water(ui8[1]);
          case 40: return _this.get_bag();
          case 41: return _this.verified_account(ui8);
          case 42: return _this.succeed_quest(ui8[1]);
          case 43: return _this.fail_quest(ui8[1]);
          case 44: return _this.claimed(ui8[1]);
          case 45: return _this.recycle_ok(ui8[1]);
          case 46: return _this.recycle_stop(ui8[1]);
          case 47: return _this.well(ui8[1]);
          case 48: return _this.no_resources();
          case 50: return _this.decrease_item2(ui8[1], ui8[2], ui8[3]);
          case 51: return _this.blocked();
          case 52: return _this.delete_inv_ok(ui8[1]);
          case 53: return _this.delete_one_inv_ok(ui8[1]);
          case 54: return _this.account_ok();
          case 55: return _this.gauges_warm(ui8[1]);
          case 56: return _this.gauges_cold(ui8[1]);
          case 57: return _this.new_version();
          case 58: return _this.wrong_password();
          case 59: return _this.clean_inventory();
          case 60: return _this.hide_shop_kit();
          case 61: user.cam.forcedDelay = 0.2; user.cam.delay = 3; break;
          case 62: return _this.delete_single_inv(new Uint16Array(evt.data));
          case 63: return _this.hide_clock();
          case 64: return _this.hide_recipe_book();
          case 65: return _this.hide_quest();
          case 66: return _this.hide_market();
          case 67: return _this.explorer_quest(ui8[1]);
          case 68: return _this.sand_tempest(ui8[1]);
          case 69: return _this.blizzard(ui8[1]);
          case 70: return _this.blizzard_status(ui8[1]);
          case 71: return _this.bandage(ui8[1]);
        }
      }
    }

    /* When server open connection */
    this.socket.onopen = function () {
      clearTimeout(_this.timeout_handler);

      sendJson([
        "", // 0
        screen.width + 200, // 1 
        screen.height + 200, // 2
        [
          'production',
          null,
          [2, 0, 0],
          'release-candidate',
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