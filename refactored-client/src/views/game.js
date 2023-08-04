import { game, user, sprite, client, mouse, keyboard, world } from "../game";
import { canw, canh, delta } from '../canvas';
import { SPRITE, QUESTS, INV_INFOS, CLIENT, INV, CRAFT, WORLD, ITEMS, RECIPES } from "../constants";
import { gui_create_button, MOUSE_MOVE, MOUSE_UP, MOUSE_DOWN, get_mouse_pos } from "../graphics/gui";
import { draw_gauges, draw_ui_gear, draw_ui_chat, draw_minimap, draw_leaderboard, draw_status, draw_weapon_switch_delay, draw_helmet_switch_delay, draw_build_delay, draw_totem_delay, draw_ui_inventory, draw_chest_inventory, draw_furance_inventory, draw_well_inventory, draw_windmill_inventory, draw_extractor_inventory, draw_bread_oven_inventory, draw_sign_button, draw_team_buttons, draw_info_box, draw_resurrection_inventory, draw_bigmap, draw_clock, draw_world_with_effect  } from "../graphics/draw";
import Cookies from '../cookies';

export default function Game(can, ctx) {
  var _this = this;
  this.can = can;
  this.ctx = ctx;

  this.show_ui = 1;
  this.show_clock = 1;
  this.show_recipe_book = 1;
  this.show_quest = 1;
  this.team_box = {
    id: document.getElementById("team_box"),
    style: document.getElementById("team_box").style,
    update: function () {
      this.style.left = Math.floor(canw2 - 125) + "px";
      this.style.top = "110px";
    }
  };
  this.sign = {
    open: false,
    breads: 0,
    symbol: document.getElementById("sign_object"),
    symbol_id: 0,
    id: document.getElementById("sign_window"),
    style: document.getElementById("sign_window").style,
    button: gui_create_button(60, 60, "", sprite[SPRITE.SIGN_BUTTON]),
    update_button: function () {
      var x = Math.floor((Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + sprite[SPRITE.INV_WOOD][0].width)) + 35);
      this.button.info.translate.x = x;
      this.button.info.translate.y = 22;
    },
    update: function () {
      this.style.left = Math.floor(canw2 - 150) + "px";
      this.style.top = Math.floor(canh2 - 115) + "px";
    },
    quit: function () {
      game.sign.style.display = "none";
      game.sign.open = false;
    },
    select: function () {
      game.sign.open = !game.sign.open;
      if (game.sign.open)
        game.sign.style.display = "inline-block";
      else
        game.sign.style.display = "none";
    },
    ok: function () {
      client.update_sign(user.sign.iid, game.sign.symbol_id);
      game.sign.select();
    },
    up: function () {
      game.sign.symbol_id = (game.sign.symbol_id === 0) ? (CLIENT.SYMBOL_MAX - 1) : (game.sign.symbol_id - 1);
      game.sign.symbol.src = ('./graphics/sign' + game.sign.symbol_id) + '.png';
    },
    down: function () {
      game.sign.symbol_id = (game.sign.symbol_id + 1) % CLIENT.SYMBOL_MAX;
      game.sign.symbol.src = ('./graphics/sign' + game.sign.symbol_id) + '.png';
    }
  };
  document.getElementById("quit_sign").addEventListener('mouseup', this.sign.select, false);
  document.getElementById("ok_sign").addEventListener('mouseup', this.sign.ok, false);
  document.getElementById("sign_up").addEventListener('mouseup', this.sign.up, false);
  document.getElementById("sign_down").addEventListener('mouseup', this.sign.down, false);
  this.market = {
    open: false,
    id: document.getElementById("shop_market"),
    style: document.getElementById("shop_market").style,
    items: [{
      id: 0,
      name: "wood",
      val: 1,
      b: 1,
      a: 3,
      img_item: SPRITE.INV_WOOD
    }, {
      id: 1,
      name: "stone",
      val: 1,
      b: 1,
      a: 4,
      img_item: SPRITE.INV_STONE
    }, {
      id: 2,
      name: "gold",
      val: 1,
      b: 1,
      a: 6,
      img_item: SPRITE.INV_GOLD
    }, {
      id: 3,
      name: "diamond",
      val: 4,
      b: 4,
      a: 1,
      img_item: SPRITE.INV_DIAMOND
    }, {
      id: 4,
      name: "amethyst",
      val: 8,
      b: 8,
      a: 1,
      img_item: SPRITE.INV_AMETHYST
    }, {
      id: 5,
      name: "reidite",
      val: 16,
      b: 16,
      a: 1,
      img_item: SPRITE.INV_REIDITE
    }, {
      id: 6,
      name: "pumpkin_seed",
      val: 10,
      b: 10,
      a: 1,
      img_item: SPRITE.INV_PUMPKIN_SEED
    }, {
      id: 7,
      name: "carrot_seed",
      val: 16,
      b: 16,
      a: 1,
      img_item: SPRITE.INV_CARROT_SEED
    }, {
      id: 8,
      name: "tomato_seed",
      val: 20,
      b: 20,
      a: 1,
      img_item: SPRITE.INV_TOMATO_SEED
    }, {
      id: 9,
      name: "thornbush_seed",
      val: 30,
      b: 30,
      a: 1,
      img_item: SPRITE.INV_THORNBUSH_SEED
    }, {
      id: 10,
      name: "garlic_seed",
      val: 40,
      b: 40,
      a: 1,
      img_item: SPRITE.INV_GARLIC_SEED
    }, {
      id: 11,
      name: "watermelon_seed",
      val: 60,
      b: 60,
      a: 1,
      img_item: SPRITE.INV_WATERMELON_SEED
    }],
    button: gui_create_button(60, 60, "", sprite[SPRITE.MARKET_BUTTON]),
    update: function () {
      this.style.left = Math.floor(canw2 - 450) + "px";
      this.style.top = Math.floor(canh2 - 270) + "px";
    },
    select: function () {
      game.market.open = !game.market.open;
      if (game.market.open) {
        game.market.style.display = "inline-block";
      } else
        game.market.style.display = "none";
    },
    quit: function () {
      game.market.style.display = "none";
      game.market.open = false;
    },
    buy: function () {
      client.buy_market(this.itemMarket);
    },
    change: function () {
      var id = this.id;
      if (this.itemMarket.a === 1) {
        var value = Math.floor(Number(this.value) * this.itemMarket.b);
        this.itemMarket.val = value;
        document.getElementById(this.itemMarket.name + "_trad_number").innerHTML = value + "";
      } else {
        var value = Math.floor(Number(this.value) / this.itemMarket.a);
        this.itemMarket.val = value;
        document.getElementById(this.itemMarket.name + "_trad_number").innerHTML = value + "";
      }
    }
  };
  document.getElementById("quit_market").addEventListener('mouseup', this.market.quit, false);
  var binding = [
    ['mouseup', this.market.buy, 'buy_'],
    ['click', this.market.change, ''],
    ['change', this.market.change, ''],
    ['keypress', this.market.keypress, '']
  ];
  for (var j = 0; j < this.market.items.length; j++) {
    var item = this.market.items[j];
    document.getElementById(item.name + "_market").src = (sprite[item.img_item][0]._src === undefined) ? sprite[item.img_item][0].src : sprite[item.img_item][0]._src;
    if (item.a === 1) {
      document.getElementById(item.name + "_trad_number").innerHTML = item.b;
      document.getElementById(item.name + "_number").value = 1;
      document.getElementById(item.name + "_number").step = 1;
      document.getElementById(item.name + "_number").min = 1;
      document.getElementById(item.name + "_number").max = Math.floor(255 / item.b);
    } else {
      document.getElementById(item.name + "_trad_number").innerHTML = 1;
      document.getElementById(item.name + "_number").value = item.a;
      document.getElementById(item.name + "_number").step = item.a;
      document.getElementById(item.name + "_number").min = item.a;
    }
    document.getElementById(("buy_" + item.name) + "_number").itemMarket = item;
    document.getElementById(item.name + "_number").itemMarket = item;
    for (let i = 0; i < binding.length; i++)
      document.getElementById((binding[i][2] + item.name) + "_number").addEventListener(binding[i][0], binding[i][1], false);
  }

  this.options = {
    open: false,
    id: document.getElementById("option_in_game"),
    style: document.getElementById("option_in_game").style,
    agree: document.getElementById("agree_ing").style,
    cancel_agree: document.getElementById("cancel_agree_ing").style,
    quests_agree: document.getElementById("quest_agree_ing").style,
    spectator_agree: document.getElementById("spectator_agree_ing").style,
    feed_agree: document.getElementById("auto_feed_agree_ing").style,
    info_box_agree: document.getElementById("info_agree_ing").style,
    aliasing_agree: document.getElementById("pixelated_agree_ing").style,
    button: gui_create_button(60, 60, "", sprite[SPRITE.OPTION_BUTTON]),
    select_options: function () {
      game.options.open = !game.options.open;
      if (game.options.open)
        game.options.style.display = "inline-block";
      else
        game.options.style.display = "none";
    },
    azerty: function () {
      ui.set_azerty();
    },
    qwerty: function () {
      ui.set_qwerty();
    },
    high: function () {
      ui.high_quality();
    },
    low: function () {
      ui.low_quality();
    },
    checkbox: function () {
      game.safe_delete.checkbox();
    },
    cancel_checkbox: function () {
      game.safe_cancel.checkbox();
    },
    quest_checkbox: function () {
      game.quests.checkbox();
    },
    spectator_checkbox: function () {
      user.show_spectators.invert();
    },
    feed_checkbox: function () {
      user.auto_feed.invert();
    },
    quit: function () {
      game.options.style.display = "none";
      game.options.open = false;
    },
    update: function () {
      this.style.left = Math.floor(canw2 - 235) + "px";
      this.style.top = Math.floor(canh2 - 170) + "px";
    }
  };
  document.getElementById("azerty_ing").addEventListener('mouseup', this.options.azerty, false);
  document.getElementById("qwerty_ing").addEventListener('mouseup', this.options.qwerty, false);
  document.getElementById("low_ing").addEventListener('mouseup', this.options.low, false);
  document.getElementById("high_ing").addEventListener('mouseup', this.options.high, false);
  document.getElementById("quit_opt").addEventListener('mouseup', this.options.quit, false);
  document.getElementById("case_agree_opt").addEventListener('mouseup', this.options.checkbox, false);
  document.getElementById("quest_case_agree_opt").addEventListener('mouseup', this.options.quest_checkbox, false);
  document.getElementById("cancel_case_agree_opt").addEventListener('mouseup', this.options.cancel_checkbox, false);
  document.getElementById("spectator_case_agree_opt").addEventListener('mouseup', this.options.spectator_checkbox, false);
  document.getElementById("auto_feed_case_agree_opt").addEventListener('mouseup', this.options.feed_checkbox, false);
  this.safe_cancel = {
    open: false,
    activated: Cookies.get("starve_cancel") ? ((Cookies.get("starve_cancel") === "0") ? 0 : 1) : 1,
    id: document.getElementById("cancel_sure_delete"),
    style: document.getElementById("cancel_sure_delete").style,
    agree: document.getElementById("cancel_agree").style,
    button: 0,
    i: 0,
    quit: function () {
      game.safe_cancel.style.display = "none";
      game.safe_cancel.open = false;
    },
    yes: function () {
      if (user.craft.crafting)
        client.cancel_crafting();

      game.safe_cancel.quit();
    },
    checkbox: function () {
      if (!game.safe_cancel.activated) {
        Cookies.set("starve_cancel", "1");
        game.safe_cancel.agree.display = "none";
        game.options.cancel_agree.display = "inline-block";
      } else {
        Cookies.set("starve_cancel", "0");
        game.safe_cancel.agree.display = "inline-block";
        game.options.cancel_agree.display = "none";
      }
      game.safe_cancel.activated = !game.safe_cancel.activated;
    },
    del: function () {
      if (!this.activated)
        this.yes();
      else {
        this.style.display = "inline-block";
        this.open = true;
      }
    },
    update: function () {
      this.style.left = Math.floor(canw2 - 235) + "px";
      this.style.top = Math.floor(canh2 - 130) + "px";
    }
  };
  this.safe_cancel.id.oncontextmenu = function () {
    return false;
  };
  this.safe_cancel.agree.display = "none";
  if (this.safe_cancel.activated)
    this.options.cancel_agree.display = "inline-block";
  else
    this.options.cancel_agree.display = "none";
  document.getElementById("cancel_yes_delete").addEventListener('mouseup', this.safe_cancel.yes, false);
  document.getElementById("cancel_no_delete").addEventListener('mouseup', this.safe_cancel.quit, false);
  document.getElementById("cancel_case_agree").addEventListener('mouseup', this.safe_cancel.checkbox, false);
  document.addEventListener("cancel_sure_delete", function (e) {
    e.preventDefault();
  }, false);
  this.aliasing = {
    activated: Cookies.get("starve_aliasing") ? ((Cookies.get("starve_aliasing") === "0") ? 0 : 1) : 1,
    set_aliasing: function (val) {
      if (val)
        document.getElementById("game_canvas").style.imageRendering = "pixelated";
      else
        document.getElementById("game_canvas").style.imageRendering = "auto";
    },
    checkbox: function () {
      if (game.aliasing.activated === 0) {
        Cookies.set("starve_aliasing", "1");
        game.aliasing.set_aliasing(1);
        game.options.aliasing_agree.display = "inline-block";
      } else {
        Cookies.set("starve_aliasing", "0");
        game.aliasing.set_aliasing(0);
        game.options.aliasing_agree.display = "none";
      }
      game.aliasing.activated = (game.aliasing.activated + 1) % 2;
    }
  };
  if (this.aliasing.activated === 1)
    this.options.aliasing_agree.display = "inline-block";
  else {
    this.aliasing.set_aliasing(0);
    this.options.aliasing_agree.display = "none";
  }
  document.getElementById("pixelated_case_agree_opt").addEventListener('mouseup', this.aliasing.checkbox, false);
  this.info_box = {
    activated: Cookies.get("starve_info_box") ? ((Cookies.get("starve_info_box") === "0") ? 0 : 1) : 1,
    display: 0,
    x: 0,
    y: 0,
    id: 0,
    craft: 0,
    checkbox: function () {
      if (game.info_box.activated === 0) {
        Cookies.set("starve_info_box", "1");
        game.options.info_box_agree.display = "inline-block";
      } else {
        Cookies.set("starve_info_box", "0");
        game.options.info_box_agree.display = "none";
      }
      game.info_box.activated = (game.info_box.activated + 1) % 2;
    },
    trigger: function (on, button, craft) {
      if (on && this.activated) {
        this.display = 1;
        if (craft === 0)
          this.id = button.id;
        else
          this.id = RECIPES[button.id].id2;
        this.x = button.info.translate.x + 80;
        this.y = button.info.translate.y;
        this.craft = craft;
      }
      return on;
    }
  };
  if (this.info_box.activated === 1)
    this.options.info_box_agree.display = "inline-block";
  else
    this.options.info_box_agree.display = "none";
  document.getElementById("info_case_agree_opt").addEventListener('mouseup', this.info_box.checkbox, false);

  this.safe_delete = {
    open: false,
    activated: Cookies.get("starve_safe") ? ((Cookies.get("starve_safe") === "0") ? 0 : 1) : 1,
    id: document.getElementById("sure_delete"),
    style: document.getElementById("sure_delete").style,
    agree: document.getElementById("agree").style,
    button: 0,
    i: 0,
    quit: function () {
      game.safe_delete.style.display = "none";
      game.safe_delete.open = false;
    },
    all: function () {
      if (!user.build.wait) {
        if (((user.craft.preview < 0) && (user.craft.id < 0)) && !user.ghost.enabled)
          client.delete_inv(game.safe_delete.button);

        game.safe_delete.quit();
      }
    },
    recycle: function () {
      if (user.craft.workbench && !user.build.wait) {
        if (((user.craft.preview < 0) && (user.craft.id < 0)) && !user.ghost.enabled)
          client.recycle_inv(game.safe_delete.button);

        game.safe_delete.quit();
      }
    },
    one: function () {
      if (!user.build.wait) {
        if (((user.craft.preview < 0) && (user.craft.id < 0)) && !user.ghost.enabled)
          client.delete_one_inv(game.safe_delete.button);

        game.safe_delete.quit();
      }
    },
    checkbox: function () {
      if (!game.safe_delete.activated) {
        Cookies.set("starve_safe", "1");
        game.safe_delete.agree.display = "none";
        game.options.agree.display = "inline-block";
      } else {
        Cookies.set("starve_safe", "0");
        game.safe_delete.agree.display = "inline-block";
        game.options.agree.display = "none";
      }
      game.safe_delete.activated = !game.safe_delete.activated;
    },
    del: function (button) {
      this.button = button;
      document.getElementById("item_to_del").src = (sprite[INV_INFOS[button].img][0]._src === undefined) ? sprite[INV_INFOS[button].img][0].src : sprite[INV_INFOS[button].img][0]._src;
      if ((INV_INFOS[button].recycle && !user.zombie) && user.craft.workbench)
        document.getElementById("recycle_delete").style.display = "inline-block";
      else
        document.getElementById("recycle_delete").style.display = "none";
      if (!this.activated)
        this.all();
      else {
        this.style.display = "inline-block";
        this.open = true;
      }
    },
    update: function () {
      this.style.left = Math.floor(canw2 - 235) + "px";
      this.style.top = Math.floor(canh2 - 175) + "px";
    }
  };
  this.safe_delete.agree.display = "none";
  if (this.safe_delete.activated)
    this.options.agree.display = "inline-block";
  else
    this.options.agree.display = "none";
  document.getElementById("one_delete").addEventListener('mouseup', this.safe_delete.one, false);
  document.getElementById("yes_delete").addEventListener('mouseup', this.safe_delete.all, false);
  document.getElementById("recycle_delete").addEventListener('mouseup', this.safe_delete.recycle, false);
  document.getElementById("no_delete").addEventListener('mouseup', this.safe_delete.quit, false);
  document.getElementById("case_agree").addEventListener('mouseup', this.safe_delete.checkbox, false);
  this.shop = {
    open: false,
    kit: -1,
    button: gui_create_button(60, 60, "", sprite[SPRITE.SHOP]),
    id: document.getElementById("shop_starterkit"),
    style: document.getElementById("shop_starterkit").style,
    update: function () {
      this.style.left = Math.floor(canw2 - 300) + "px";
      this.style.top = Math.floor(canh2 - 215) + "px";
    },
    quit: function () {
      game.shop.open = false;
      game.shop.style.display = "none";
    },
    select: function () {
      game.shop.open = !game.shop.open;
      if (!game.shop.open)
        game.shop.style.display = "none";
      else
        game.shop.style.display = "inline-block";
    },
    buy: function () {
      if (game.shop.kit >= 0) {
        client.choose_kit(game.shop.kit);
        game.shop.quit();
      }
    },
    init: function () {
      var price = user.shop.value;
      document.getElementById("points_bank").innerHTML = Utils.simplify_number(price) + " points";
      for (let i = 0; i < KIT.length; i++) {
        if (KIT[i].price > price)
          document.getElementById("starter" + (i + 1)).style["opacity"] = "0.4";
        else
          document.getElementById("starter" + (i + 1)).style["opacity"] = "1";
      }
      for (i = 1; i < 13; i++) {
        document.getElementById("inv_shop" + i).src = "./graphics/empty-shop.png";
        document.getElementById("amount_shop" + i).innerHTML = "";
      }
      document.getElementById("buy_kit").style["opacity"] = "0.2";
    },
    get_starter: function () {
      if (this.id.length > 8)
        var id = Number(this.id.charAt(7) + this.id.charAt(8));
      else
        var id = Number(this.id.charAt(7));
      var s = KIT[id - 1];
      if (user.shop.value >= s.price) {
        game.shop.kit = id;
        document.getElementById("buy_kit").style["opacity"] = "1";
      } else {
        game.shop.kit = -1;
        document.getElementById("buy_kit").style["opacity"] = "0.2";
      }
      s = s.items;
      for (let i = 1, j = 1; i < (s.length + 1); i++) {
        if (s[i - 1][1] === INV.BAG)
          continue;

        document.getElementById("inv_shop" + j).style.display = "inline-block";
        document.getElementById("inv_shop" + j).src = (sprite[INV_INFOS[s[i - 1][1]].img][0]._src === undefined) ? sprite[INV_INFOS[s[i - 1][1]].img][0].src : sprite[INV_INFOS[s[i - 1][1]].img][0]._src;
        document.getElementById("amount_shop" + j).innerHTML = "" + s[i - 1][0];
        j++;
      }
      for (; j < 13; j++) {
        document.getElementById("inv_shop" + j).src = "./graphics/empty-shop.png";
        document.getElementById("amount_shop" + j).innerHTML = "";
      }
    }
  };
  document.getElementById("quit3").addEventListener('mouseup', this.shop.quit, false);
  document.getElementById("buy_kit").addEventListener('mouseup', this.shop.buy, false);
  for (let i = 1; i < 11; i++)
    document.getElementById("starter" + i).addEventListener('mouseup', this.shop.get_starter, false);
  this.quests = {
    open: false,
    activated: Cookies.get("starve_quests") ? ((Cookies.get("starve_quests") === "1") ? 1 : 0) : 0,
    button: gui_create_button(60, 60, "", sprite[SPRITE.QUEST_BUTTON]),
    id: document.getElementById("chronoquest"),
    style: document.getElementById("chronoquest").style,
    update: function () {
      this.style.left = Math.floor(canw2 - 420) + "px";
      this.style.top = Math.floor(canh2 - 270) + "px";
    },
    quit: function () {
      game.quests.style.display = "none";
      game.quests.open = false;
    },
    select: function () {
      game.quests.open = !game.quests.open;
      if (!game.quests.open)
        game.quests.style.display = "none";
      else
        game.quests.style.display = "inline-block";
    },
    list: [],
    reset: function () {
      for (let i = 0; i < QUESTS.length; i++) {
        this.list[i] = 1;
        document.getElementById("timeremain_" + i).style.display = "inline-block";
        document.getElementById("time_finished_" + i).style.display = "none";
        document.getElementById("claim_reward_" + i).style.display = "none";
      }
    },
    timer: 0,
    born: 0,
    update_chrono: function () {
      if (!game.quests.open)
        return;

      var now = (new Date).getTime();
      if ((now - this.timer) < 1000)
        return;

      this.timer = now;
      for (let i = 0; i < QUESTS.length; i++) {
        if (!game.quests.list[i])
          continue;

        var t = QUESTS[i].time - ((now - world.clock.init) + game.quests.born);
        if (t > 960000) {
          document.getElementById("timeremain_" + i).innerHTML = Math.floor(t / 480000) + " days";
        } else if (t > 480000) {
          document.getElementById("timeremain_" + i).innerHTML = Math.floor(t / 480000) + " day";
        } else if (t > 60000) {
          document.getElementById("timeremain_" + i).innerHTML = Math.floor(t / 60000) + " min";
        } else
          document.getElementById("timeremain_" + i).innerHTML = Math.floor(t / 1000) + " sec";
      }
    },
    restore: function (l) {
      for (let i = 0; i < l.length; i++) {
        if (l[i] != 1)
          game.quests.modify_simple(i, l[i]);

      }
    },
    modify_simple: function (id, type) {
      if ((type === 3) && ((id === 11) || (id === 12))) {
        user.inv.update_bag_size(0, 1);
        game.update_inv_buttons();
      }
      document.getElementById("timeremain_" + id).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      if (type > 1) {
        document.getElementById("time_finished_" + id).innerHTML = "SUCCEED";
        document.getElementById("timeremain_" + id).style.display = "none";
      } else if (type === 0) {
        document.getElementById("time_finished_" + id).innerHTML = "FAILED";
        document.getElementById("timeremain_" + id).style.display = "none";
      }
      if (type === 2)
        document.getElementById("claim_reward_" + id).style.display = "inline-block";
      else
        document.getElementById("claim_reward_" + id).style.display = "none";
      document.getElementById("time_finished_" + id).style.display = "inline";
      game.quests.list[id] = 0;
    },
    modify: function (id, type) {
      game.quests.modify_simple(id, type);
      if (game.quests.activated) {
        game.quests.open = true;
        game.quests.style.display = "inline-block";
      }
    },
    checkbox: function () {
      if (!game.quests.activated) {
        Cookies.set("starve_quests", "1");
        game.options.quests_agree.display = "inline-block";
      } else {
        Cookies.set("starve_quests", "0");
        game.options.quests_agree.display = "none";
      }
      game.quests.activated = !game.quests.activated;
    },
    claim: function () {
      var n = Number(this.id.charAt(13));
      var m = Number(this.id.charAt(14));
      if (((this.id.charAt(14) !== "") && (m >= 0)) && (m <= 9))
        n = (n * 10) + m;

      client.claim_quest_reward(n);
    }
  };
  if (this.quests.activated)
    this.options.quests_agree.display = "inline-block";
  else
    this.options.quests_agree.display = "none";
  document.getElementById("quit_chronoquest").addEventListener('mouseup', this.quests.quit, false);
  for (let i = 0; i < QUESTS.length; i++)
    document.getElementById("claim_reward_" + i).addEventListener('mouseup', this.quests.claim, false);
  this.craft_list = {
    open: false,
    button: gui_create_button(60, 60, "", sprite[SPRITE.RECIPE_BUTTON]),
    list: {
      id: document.getElementById("recipe_craft"),
      style: document.getElementById("recipe_craft").style,
      recipes: [],
      category: 0,
      update: function () {
        this.style.left = Math.floor(canw2 - 335) + "px";
        this.style.top = Math.floor(canh2 - 215) + "px";
      },
      quit: function () {
        document.getElementById("recipe_craft").style.display = "none";
        game.craft_list.open = false;
      },
      previous: function () {
        document.getElementById("recipe_craft").style.display = "none";
        document.getElementById("home_craft").style.display = "inline-block";
      },
      get_recipe: function (i) {
        var r = this.recipes[i];
        if (r.o)
          document.getElementById("watercraft").style.display = "inline-block";
        else
          document.getElementById("watercraft").style.display = "none";
        if (r.f)
          document.getElementById("firecraft").style.display = "inline-block";
        else
          document.getElementById("firecraft").style.display = "none";
        if (r.w)
          document.getElementById("workcraft").style.display = "inline-block";
        else
          document.getElementById("workcraft").style.display = "none";
        if (r.e)
          document.getElementById("wellcraft").style.display = "inline-block";
        else
          document.getElementById("wellcraft").style.display = "none";
        var r = r.r;
        for (let i = 0, j = 1; i < r.length; i++) {
          document.getElementById("inv" + j).style.display = "inline-block";
          document.getElementById("inv" + j).src = (sprite[INV_INFOS[r[i][0]].img][0]._src === undefined) ? sprite[INV_INFOS[r[i][0]].img][0].src : sprite[INV_INFOS[r[i][0]].img][0]._src;
          document.getElementById("numb" + j).innerHTML = "" + r[i][1];
          j++;
        }
        for (; j < 6; j++) {
          document.getElementById("inv" + j).style.display = "none";
          document.getElementById("numb" + j).innerHTML = "";
        }
      },
      select: function (category) {
        this.category = category;
        document.getElementById("home_craft").style.display = "none";
        document.getElementById("workcraft").style.display = "none";
        document.getElementById("firecraft").style.display = "none";
        document.getElementById("watercraft").style.display = "none";
        document.getElementById("wellcraft").style.display = "none";
        document.getElementById("recipe_craft").style.display = "inline-block";
        document.getElementById("inv1").style.display = "none";
        document.getElementById("inv2").style.display = "none";
        document.getElementById("inv3").style.display = "none";
        document.getElementById("inv4").style.display = "none";
        document.getElementById("inv5").style.display = "none";
        document.getElementById("numb1").innerHTML = "";
        document.getElementById("numb2").innerHTML = "";
        document.getElementById("numb3").innerHTML = "";
        document.getElementById("numb4").innerHTML = "";
        document.getElementById("numb5").innerHTML = "";
        for (let i = 0, j = 0; i < RECIPES.length; i++) {
          var r = RECIPES[i];
          if (category === r.t) {
            this.recipes[j] = r;
            j++;
            document.getElementById("img_" + j).style.display = "inline-block";
            document.getElementById("img_" + j).src = (sprite[INV_INFOS[r.id2].img][0]._src === undefined) ? sprite[INV_INFOS[r.id2].img][0].src : sprite[INV_INFOS[r.id2].img][0]._src;
          }
        }
        for (j++; j < 49; j++)
          document.getElementById("img_" + j).style.display = "none";
      }
    },
    home: {
      id: document.getElementById("home_craft"),
      style: document.getElementById("home_craft").style,
      update: function () {
        this.style.left = Math.floor(canw2 - 285) + "px";
        this.style.top = Math.floor(canh2 - 170) + "px";
      },
      quit: function () {
        document.getElementById("home_craft").style.display = "none";
        game.craft_list.open = false;
      }
    },
    select_book: function () {
      this.open = !this.open;
      if (!this.open) {
        document.getElementById("home_craft").style.display = "none";
        document.getElementById("recipe_craft").style.display = "none";
      } else
        document.getElementById("home_craft").style.display = "inline-block";
    }
  };
  document.getElementById("quit").addEventListener('mouseup', this.craft_list.home.quit, false);
  document.getElementById("quitmenu").addEventListener('mouseup', this.craft_list.list.quit, false);
  document.getElementById("backhome").addEventListener('mouseup', this.craft_list.list.previous, false);
  document.getElementById("hatcategory").addEventListener('mouseup', function () {
    game.craft_list.list.select(CATEGORY.CLOTHES);
  }, false);
  document.getElementById("weaponcategory").addEventListener('mouseup', function () {
    game.craft_list.list.select(CATEGORY.WEAPONS);
  }, false);
  document.getElementById("toolcategory").addEventListener('mouseup', function () {
    game.craft_list.list.select(CATEGORY.TOOLS);
  }, false);
  document.getElementById("foodcategory").addEventListener('mouseup', function () {
    game.craft_list.list.select(CATEGORY.FOODS);
  }, false);
  document.getElementById("placeablecategory").addEventListener('mouseup', function () {
    game.craft_list.list.select(CATEGORY.UTILS);
  }, false);
  document.getElementById("constructioncategory").addEventListener('mouseup', function () {
    game.craft_list.list.select(CATEGORY.BASES);
  }, false);
  document.getElementById("img_1").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(0);
  }, false);
  document.getElementById("img_2").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(1);
  }, false);
  document.getElementById("img_3").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(2);
  }, false);
  document.getElementById("img_4").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(3);
  }, false);
  document.getElementById("img_5").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(4);
  }, false);
  document.getElementById("img_6").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(5);
  }, false);
  document.getElementById("img_7").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(6);
  }, false);
  document.getElementById("img_8").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(7);
  }, false);
  document.getElementById("img_9").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(8);
  }, false);
  document.getElementById("img_10").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(9);
  }, false);
  document.getElementById("img_11").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(10);
  }, false);
  document.getElementById("img_12").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(11);
  }, false);
  document.getElementById("img_13").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(12);
  }, false);
  document.getElementById("img_14").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(13);
  }, false);
  document.getElementById("img_15").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(14);
  }, false);
  document.getElementById("img_16").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(15);
  }, false);
  document.getElementById("img_17").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(16);
  }, false);
  document.getElementById("img_18").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(17);
  }, false);
  document.getElementById("img_19").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(18);
  }, false);
  document.getElementById("img_20").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(19);
  }, false);
  document.getElementById("img_21").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(20);
  }, false);
  document.getElementById("img_22").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(21);
  }, false);
  document.getElementById("img_23").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(22);
  }, false);
  document.getElementById("img_24").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(23);
  }, false);
  document.getElementById("img_25").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(24);
  }, false);
  document.getElementById("img_26").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(25);
  }, false);
  document.getElementById("img_27").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(26);
  }, false);
  document.getElementById("img_28").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(27);
  }, false);
  document.getElementById("img_29").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(28);
  }, false);
  document.getElementById("img_30").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(29);
  }, false);
  document.getElementById("img_31").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(30);
  }, false);
  document.getElementById("img_32").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(31);
  }, false);
  document.getElementById("img_33").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(32);
  }, false);
  document.getElementById("img_34").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(33);
  }, false);
  document.getElementById("img_35").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(34);
  }, false);
  document.getElementById("img_36").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(35);
  }, false);
  document.getElementById("img_37").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(36);
  }, false);
  document.getElementById("img_38").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(37);
  }, false);
  document.getElementById("img_39").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(38);
  }, false);
  document.getElementById("img_40").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(39);
  }, false);
  document.getElementById("img_41").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(40);
  }, false);
  document.getElementById("img_42").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(41);
  }, false);
  document.getElementById("img_43").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(42);
  }, false);
  document.getElementById("img_44").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(43);
  }, false);
  document.getElementById("img_45").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(44);
  }, false);
  document.getElementById("img_46").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(45);
  }, false);
  document.getElementById("img_47").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(46);
  }, false);
  document.getElementById("img_48").addEventListener('mousedown', function () {
    game.craft_list.list.get_recipe(47);
  }, false);
  this.minimap = {
    translate: {
      x: 0,
      y: 0
    },
    marker: {
      x: -1,
      y: -1
    },
    players: [],
    focus: function (mouse) {
      var y = this.translate.y + ((user.inv.can_select.length > 0) ? -120 : -50);
      if ((((mouse.x > this.translate.x) && (mouse.x < (this.translate.x + 193))) && (mouse.y > y)) && (mouse.y < (y + 193))) {
        this.marker.x = mouse.x - this.translate.x;
        this.marker.y = mouse.y - y;
      }
    }
  };
  this.leaderboard = {
    translate: {
      x: 0,
      y: 0
    },
    img: sprite[SPRITE.LEADERBOARD],
    can: document.createElement('canvas')
  };
  this.leaderboard.can.width = this.leaderboard.img.width;
  this.leaderboard.can.height = this.leaderboard.img.height;
  this.leaderboard.ctx = this.leaderboard.can.getContext('2d');
  this.gauges = {
    translate: {
      x: 0,
      y: 0
    },
    img: sprite[SPRITE.GAUGES],
    draw: draw_gauges,
    y: 0
  };
  this.leave_team = function () {
    div = document.getElementById("team_box");
    div.innerHTML = "";
    div.innerHTML += ('<div id=\"leader\"><img src=\"./graphics/leaderlogo.png\" style=\"width:25px;margin-right:5px;\" ></img>' + world.players[user.team[0]].nickname) + '</div';
    for (let i = 1; i < user.team.length; i++) {
      div.innerHTML += ('<div class=\"nicknames\"> <div style=\"display:inline-block;padding-top:7px;\">' + world.players[user.team[i]].nickname) + '</div></div>';
    }
    div.innerHTML += '<div id=\"leave\" style=\"display:inline-block;\">LEAVE</div></div>';
    div.style.display = "inline-block";
    document.getElementById("leave").addEventListener('click', client.leave_team, false);
  };
  this.show_team = function () {
    div = document.getElementById("team_box");
    div.innerHTML = "";
    div.innerHTML += ('<div id=\"leader\"><img src=\"./graphics/leaderlogo.png\" style=\"width:25px;margin-right:5px;\" ></img>' + world.players[user.team[0]].nickname) + '</div';
    for (let i = 1; i < user.team.length; i++) {
      div.innerHTML += ('<div class=\"nicknames\"> <div style=\"display:inline-block;padding-top:7px;\">' + world.players[user.team[i]].nickname) + '</div></div>';
    }
    div.innerHTML += "</div>";
    div.style.display = "inline-block";
  };
  this.manage_team = function () {
    div = document.getElementById("team_box");
    div.innerHTML = "";
    div.innerHTML += ('<div id=\"leader\"><img src=\"./graphics/leaderlogo.png\" style=\"width:25px;margin-right:5px;\" ></img>' + world.players[user.team[0]].nickname) + '</div';
    for (let i = 1; i < user.team.length; i++)
      div.innerHTML += ((('<div class=\"nicknames\"> <div style=\"display:inline-block;padding-top:7px;\">' + world.players[user.team[i]].nickname) + '</div><div class=\"eject_member\" id=\"eject_member') + i) + '\"><img src=\"./graphics/close-team.png\" style=\"width:20px;padding:5px;\"></img></div>';
    if (user.totem.lock === 0)
      div.innerHTML += '<div id=\"lock_team\" style=\"display:inline-block;\">LOCK</div></div>';
    else
      div.innerHTML += '<div id=\"lock_team\" style=\"display:inline-block;\">UNLOCK</div></div>';
    document.getElementById("lock_team").addEventListener('click', client.lock_team, false);
    div.style.display = "inline-block";
    for (let i = 1; i < user.team.length; i++) {
      switch (i) {
        case 1:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(1);
          }, false);
          break;
        case 2:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(2);
          }, false);
          break;
        case 3:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(3);
          }, false);
          break;
        case 4:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(4);
          }, false);
          break;
        case 5:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(5);
          }, false);
          break;
        case 6:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(6);
          }, false);
          break;
        case 7:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(7);
          }, false);
          break;
        case 8:
          document.getElementById("eject_member" + i).addEventListener('click', function () {
            client.kick_team(8);
          }, false);
          break;
      }
    }
  };
  this.team_buttons = [];
  this.team_buttons[CLIENT.TEAM_LEAVE] = {
    button: gui_create_button(60, 60, "", sprite[SPRITE.TEAM_BUTTON]),
    action: this.leave_team
  };
  this.team_buttons[CLIENT.TEAM_JOIN] = {
    button: gui_create_button(60, 60, "", sprite[SPRITE.TEAM_BUTTON]),
    action: client.join_team
  };
  this.team_buttons[CLIENT.TEAM_MANAGE] = {
    button: gui_create_button(60, 60, "", sprite[SPRITE.MANAGE_TEAM_BUTTON]),
    action: this.manage_team
  };
  this.team_buttons[CLIENT.TEAM_SHOW] = {
    button: gui_create_button(60, 60, "", sprite[SPRITE.SHOW_TEAM_BUTTON]),
    action: this.show_team
  };
  this.team_buttons[CLIENT.TEAM_FULL] = {
    button: gui_create_button(60, 60, "", sprite[SPRITE.FULL_TEAM_BUTTON]),
    action: function () { }
  };
  this.team_buttons_id = -1;
  this.bread_oven_wood_button = gui_create_button(60, 60, "", sprite[SPRITE.BREAD_OVEN_WOOD]);
  this.bread_oven_bread_button = gui_create_button(60, 60, "", sprite[SPRITE.BREAD_OVEN_BREAD]);
  this.bread_oven_flour_button = gui_create_button(60, 60, "", sprite[SPRITE.WINDMILL_FLOUR]);
  this.windmill_wheat_button = gui_create_button(60, 60, "", sprite[SPRITE.WINDMILL_WHEAT_SEED]);
  this.windmill_flour_button = gui_create_button(60, 60, "", sprite[SPRITE.WINDMILL_FLOUR]);
  this.extractor_wood_button = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD]);
  this.extractor_stone_button = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE]);
  this.extractor_gold_button = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD]);
  this.extractor_diamond_button = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND]);
  this.extractor_amethyst_button = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST]);
  this.extractor_reidite_button = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE]);
  this.furnace_button = gui_create_button(60, 60, "", sprite[SPRITE.FURNACE_BUTTON]);
  this.chest_padlock = gui_create_button(60, 60, "", sprite[SPRITE.PADLOCK]);
  this.chest_lockpick = gui_create_button(60, 60, "", sprite[SPRITE.KEY]);
  this.chest_locked = gui_create_button(60, 60, "", sprite[SPRITE.LOCKED]);
  this.resurrection = gui_create_button(120, 120, "", sprite[SPRITE.DRAGON_HEART]);
  this.resurrection.info.translate.x = 10;
  this.resurrection.info.translate.y = 10;
  this.chest_buttons = [];
  this.chest_buttons[INV.SWORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SWORD], 3);
  this.chest_buttons[INV.SWORD].id = INV.SWORD;
  this.chest_buttons[INV.PICK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PICK], 3);
  this.chest_buttons[INV.PICK].id = INV.PICK;
  this.chest_buttons[INV.STONE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE], 3);
  this.chest_buttons[INV.STONE].id = INV.STONE;
  this.chest_buttons[INV.WOOD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD], 3);
  this.chest_buttons[INV.WOOD].id = INV.WOOD;
  this.chest_buttons[INV.PLANT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PLANT], 3);
  this.chest_buttons[INV.PLANT].id = INV.PLANT;
  this.chest_buttons[INV.CACTUS] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CACTUS], 3);
  this.chest_buttons[INV.CACTUS].id = INV.CACTUS;
  this.chest_buttons[INV.GOLD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD], 3);
  this.chest_buttons[INV.GOLD].id = INV.GOLD;
  this.chest_buttons[INV.DIAMOND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND], 3);
  this.chest_buttons[INV.DIAMOND].id = INV.DIAMOND;
  this.chest_buttons[INV.PICK_GOLD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PICK_GOLD], 3);
  this.chest_buttons[INV.PICK_GOLD].id = INV.PICK_GOLD;
  this.chest_buttons[INV.PICK_DIAMOND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PICK_DIAMOND], 3);
  this.chest_buttons[INV.PICK_DIAMOND].id = INV.PICK_DIAMOND;
  this.chest_buttons[INV.SWORD_GOLD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SWORD_GOLD], 3);
  this.chest_buttons[INV.SWORD_GOLD].id = INV.SWORD_GOLD;
  this.chest_buttons[INV.SWORD_WOOD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SWORD_WOOD], 3);
  this.chest_buttons[INV.SWORD_WOOD].id = INV.SWORD_WOOD;
  this.chest_buttons[INV.SWORD_DIAMOND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SWORD_DIAMOND], 3);
  this.chest_buttons[INV.SWORD_DIAMOND].id = INV.SWORD_DIAMOND;
  this.chest_buttons[INV.FIRE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FIRE], 3);
  this.chest_buttons[INV.FIRE].id = INV.FIRE;
  this.chest_buttons[INV.WORKBENCH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WORKBENCH], 3);
  this.chest_buttons[INV.WORKBENCH].id = INV.WORKBENCH;
  this.chest_buttons[INV.SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SEED], 3);
  this.chest_buttons[INV.SEED].id = INV.SEED;
  this.chest_buttons[INV.WALL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WALL], 3);
  this.chest_buttons[INV.WALL].id = INV.WALL;
  this.chest_buttons[INV.SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SPIKE], 3);
  this.chest_buttons[INV.SPIKE].id = INV.SPIKE;
  this.chest_buttons[INV.PICK_WOOD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PICK_WOOD], 3);
  this.chest_buttons[INV.PICK_WOOD].id = INV.PICK_WOOD;
  this.chest_buttons[INV.COOKED_MEAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_COOKED_MEAT], 3);
  this.chest_buttons[INV.COOKED_MEAT].id = INV.COOKED_MEAT;
  this.chest_buttons[INV.MEAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_MEAT], 3);
  this.chest_buttons[INV.MEAT].id = INV.MEAT;
  this.chest_buttons[INV.BIG_FIRE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BIG_FIRE], 3);
  this.chest_buttons[INV.BIG_FIRE].id = INV.BIG_FIRE;
  this.chest_buttons[INV.BANDAGE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BANDAGE], 3);
  this.chest_buttons[INV.BANDAGE].id = INV.BANDAGE;
  this.chest_buttons[INV.CORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CORD], 3);
  this.chest_buttons[INV.CORD].id = INV.CORD;
  this.chest_buttons[INV.STONE_WALL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_WALL], 3);
  this.chest_buttons[INV.STONE_WALL].id = INV.STONE_WALL;
  this.chest_buttons[INV.GOLD_WALL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_WALL], 3);
  this.chest_buttons[INV.GOLD_WALL].id = INV.GOLD_WALL;
  this.chest_buttons[INV.DIAMOND_WALL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_WALL], 3);
  this.chest_buttons[INV.DIAMOND_WALL].id = INV.DIAMOND_WALL;
  this.chest_buttons[INV.WOOD_DOOR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DOOR_WOOD_CLOSE], 3);
  this.chest_buttons[INV.WOOD_DOOR].id = INV.WOOD_DOOR;
  this.chest_buttons[INV.CHEST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CHEST], 3);
  this.chest_buttons[INV.CHEST].id = INV.CHEST;
  this.chest_buttons[INV.STONE_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_SPIKE], 3);
  this.chest_buttons[INV.STONE_SPIKE].id = INV.STONE_SPIKE;
  this.chest_buttons[INV.GOLD_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_SPIKE], 3);
  this.chest_buttons[INV.GOLD_SPIKE].id = INV.GOLD_SPIKE;
  this.chest_buttons[INV.DIAMOND_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_SPIKE], 3);
  this.chest_buttons[INV.DIAMOND_SPIKE].id = INV.DIAMOND_SPIKE;
  this.chest_buttons[INV.FUR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FUR], 3);
  this.chest_buttons[INV.FUR].id = INV.FUR;
  this.chest_buttons[INV.FUR_BOAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FUR_BOAR], 3);
  this.chest_buttons[INV.FUR_BOAR].id = INV.FUR_BOAR;
  this.chest_buttons[INV.FUR_WOLF] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FUR_WOLF], 3);
  this.chest_buttons[INV.FUR_WOLF].id = INV.FUR_WOLF;
  this.chest_buttons[INV.PENGUIN_FEATHER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PENGUIN_FEATHER], 3);
  this.chest_buttons[INV.PENGUIN_FEATHER].id = INV.PENGUIN_FEATHER;
  this.chest_buttons[INV.HAWK_FEATHER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAWK_FEATHER], 3);
  this.chest_buttons[INV.HAWK_FEATHER].id = INV.HAWK_FEATHER;
  this.chest_buttons[INV.VULTURE_FEATHER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_VULTURE_FEATHER], 3);
  this.chest_buttons[INV.VULTURE_FEATHER].id = INV.VULTURE_FEATHER;
  this.chest_buttons[INV.EMERALD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EMERALD], 3);
  this.chest_buttons[INV.EMERALD].id = INV.EMERALD;
  this.chest_buttons[INV.EARMUFFS] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EARMUFFS], 3);
  this.chest_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
  this.chest_buttons[INV.STONE_DOOR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DOOR_STONE_CLOSE], 3);
  this.chest_buttons[INV.STONE_DOOR].id = INV.STONE_DOOR;
  this.chest_buttons[INV.GOLD_DOOR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DOOR_GOLD_CLOSE], 3);
  this.chest_buttons[INV.GOLD_DOOR].id = INV.GOLD_DOOR;
  this.chest_buttons[INV.DIAMOND_DOOR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DOOR_DIAMOND_CLOSE], 3);
  this.chest_buttons[INV.DIAMOND_DOOR].id = INV.DIAMOND_DOOR;
  this.chest_buttons[INV.COAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_COAT], 3);
  this.chest_buttons[INV.COAT].id = INV.COAT;
  this.chest_buttons[INV.WOOD_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_SPEAR], 3);
  this.chest_buttons[INV.WOOD_SPEAR].id = INV.WOOD_SPEAR;
  this.chest_buttons[INV.SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SPEAR], 3);
  this.chest_buttons[INV.SPEAR].id = INV.SPEAR;
  this.chest_buttons[INV.GOLD_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_SPEAR], 3);
  this.chest_buttons[INV.GOLD_SPEAR].id = INV.GOLD_SPEAR;
  this.chest_buttons[INV.DIAMOND_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_SPEAR], 3);
  this.chest_buttons[INV.DIAMOND_SPEAR].id = INV.DIAMOND_SPEAR;
  this.chest_buttons[INV.DRAGON_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_SPEAR], 3);
  this.chest_buttons[INV.DRAGON_SPEAR].id = INV.DRAGON_SPEAR;
  this.chest_buttons[INV.FURNACE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FURNACE], 3);
  this.chest_buttons[INV.FURNACE].id = INV.FURNACE;
  this.chest_buttons[INV.EXPLORER_HAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EXPLORER_HAT], 3);
  this.chest_buttons[INV.EXPLORER_HAT].id = INV.EXPLORER_HAT;
  this.chest_buttons[INV.PIRATE_HAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PIRATE_HAT], 3);
  this.chest_buttons[INV.PIRATE_HAT].id = INV.PIRATE_HAT;
  this.chest_buttons[INV.FLOWER_HAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FLOWER_HAT], 3);
  this.chest_buttons[INV.FLOWER_HAT].id = INV.FLOWER_HAT;
  this.chest_buttons[INV.FUR_HAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FUR_HAT], 3);
  this.chest_buttons[INV.FUR_HAT].id = INV.FUR_HAT;
  this.chest_buttons[INV.TURBAN1] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_TURBAN1], 3);
  this.chest_buttons[INV.TURBAN1].id = INV.TURBAN1;
  this.chest_buttons[INV.TURBAN2] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_TURBAN2], 3);
  this.chest_buttons[INV.TURBAN2].id = INV.TURBAN2;
  this.chest_buttons[INV.WOOD_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_ARROW], 3);
  this.chest_buttons[INV.WOOD_ARROW].id = INV.WOOD_ARROW;
  this.chest_buttons[INV.WOOD_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_BOW], 3);
  this.chest_buttons[INV.WOOD_BOW].id = INV.WOOD_BOW;
  this.chest_buttons[INV.WOOD_SHIELD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_SHIELD], 3);
  this.chest_buttons[INV.WOOD_SHIELD].id = INV.WOOD_SHIELD;
  this.chest_buttons[INV.STONE_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_ARROW], 3);
  this.chest_buttons[INV.STONE_ARROW].id = INV.STONE_ARROW;
  this.chest_buttons[INV.STONE_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_BOW], 3);
  this.chest_buttons[INV.STONE_BOW].id = INV.STONE_BOW;
  this.chest_buttons[INV.STONE_SHIELD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_SHIELD], 3);
  this.chest_buttons[INV.STONE_SHIELD].id = INV.STONE_SHIELD;
  this.chest_buttons[INV.GOLD_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_ARROW], 3);
  this.chest_buttons[INV.GOLD_ARROW].id = INV.GOLD_ARROW;
  this.chest_buttons[INV.GOLD_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_BOW], 3);
  this.chest_buttons[INV.GOLD_BOW].id = INV.GOLD_BOW;
  this.chest_buttons[INV.GOLD_SHIELD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_SHIELD], 3);
  this.chest_buttons[INV.GOLD_SHIELD].id = INV.GOLD_SHIELD;
  this.chest_buttons[INV.DIAMOND_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_ARROW], 3);
  this.chest_buttons[INV.DIAMOND_ARROW].id = INV.DIAMOND_ARROW;
  this.chest_buttons[INV.DIAMOND_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_BOW], 3);
  this.chest_buttons[INV.DIAMOND_BOW].id = INV.DIAMOND_BOW;
  this.chest_buttons[INV.DIAMOND_SHIELD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_SHIELD], 3);
  this.chest_buttons[INV.DIAMOND_SHIELD].id = INV.DIAMOND_SHIELD;
  this.chest_buttons[INV.AMETHYST_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_ARROW], 3);
  this.chest_buttons[INV.AMETHYST_ARROW].id = INV.AMETHYST_ARROW;
  this.chest_buttons[INV.AMETHYST_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_BOW], 3);
  this.chest_buttons[INV.AMETHYST_BOW].id = INV.AMETHYST_BOW;
  this.chest_buttons[INV.AMETHYST_SHIELD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_SHIELD], 3);
  this.chest_buttons[INV.AMETHYST_SHIELD].id = INV.AMETHYST_SHIELD;
  this.chest_buttons[INV.REIDITE_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_ARROW], 3);
  this.chest_buttons[INV.REIDITE_ARROW].id = INV.REIDITE_ARROW;
  this.chest_buttons[INV.REIDITE_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_BOW], 3);
  this.chest_buttons[INV.REIDITE_BOW].id = INV.REIDITE_BOW;
  this.chest_buttons[INV.REIDITE_SHIELD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_SHIELD], 3);
  this.chest_buttons[INV.REIDITE_SHIELD].id = INV.REIDITE_SHIELD;
  this.chest_buttons[INV.DRAGON_ARROW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_ARROW], 3);
  this.chest_buttons[INV.DRAGON_ARROW].id = INV.DRAGON_ARROW;
  this.chest_buttons[INV.DRAGON_BOW] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_BOW], 3);
  this.chest_buttons[INV.DRAGON_BOW].id = INV.DRAGON_BOW;
  this.chest_buttons[INV.WOOD_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_HELMET], 3);
  this.chest_buttons[INV.WOOD_HELMET].id = INV.WOOD_HELMET;
  this.chest_buttons[INV.STONE_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_HELMET], 3);
  this.chest_buttons[INV.STONE_HELMET].id = INV.STONE_HELMET;
  this.chest_buttons[INV.GOLD_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_HELMET], 3);
  this.chest_buttons[INV.GOLD_HELMET].id = INV.GOLD_HELMET;
  this.chest_buttons[INV.DIAMOND_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_HELMET], 3);
  this.chest_buttons[INV.DIAMOND_HELMET].id = INV.DIAMOND_HELMET;
  this.chest_buttons[INV.BOOK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BOOK], 3);
  this.chest_buttons[INV.BOOK].id = INV.BOOK;
  this.chest_buttons[INV.PAPER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PAPER], 3);
  this.chest_buttons[INV.PAPER].id = INV.PAPER;
  this.chest_buttons[INV.BAG] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BAG], 3);
  this.chest_buttons[INV.BAG].id = INV.BAG;
  this.chest_buttons[INV.AMETHYST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST], 3);
  this.chest_buttons[INV.AMETHYST].id = INV.AMETHYST;
  this.chest_buttons[INV.SWORD_AMETHYST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SWORD_AMETHYST], 3);
  this.chest_buttons[INV.SWORD_AMETHYST].id = INV.SWORD_AMETHYST;
  this.chest_buttons[INV.PIRATE_SWORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PIRATE_SWORD], 3);
  this.chest_buttons[INV.PIRATE_SWORD].id = INV.PIRATE_SWORD;
  this.chest_buttons[INV.PICK_AMETHYST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PICK_AMETHYST], 3);
  this.chest_buttons[INV.PICK_AMETHYST].id = INV.PICK_AMETHYST;
  this.chest_buttons[INV.PICK_REIDITE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PICK_REIDITE], 3);
  this.chest_buttons[INV.PICK_REIDITE].id = INV.PICK_REIDITE;
  this.chest_buttons[INV.AMETHYST_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_SPEAR], 3);
  this.chest_buttons[INV.AMETHYST_SPEAR].id = INV.AMETHYST_SPEAR;
  this.chest_buttons[INV.HAMMER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAMMER], 3);
  this.chest_buttons[INV.HAMMER].id = INV.HAMMER;
  this.chest_buttons[INV.HAMMER_GOLD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAMMER_GOLD], 3);
  this.chest_buttons[INV.HAMMER_GOLD].id = INV.HAMMER_GOLD;
  this.chest_buttons[INV.HAMMER_DIAMOND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAMMER_DIAMOND], 3);
  this.chest_buttons[INV.HAMMER_DIAMOND].id = INV.HAMMER_DIAMOND;
  this.chest_buttons[INV.HAMMER_AMETHYST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAMMER_AMETHYST], 3);
  this.chest_buttons[INV.HAMMER_AMETHYST].id = INV.HAMMER_AMETHYST;
  this.chest_buttons[INV.HAMMER_REIDITE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAMMER_REIDITE], 3);
  this.chest_buttons[INV.HAMMER_REIDITE].id = INV.HAMMER_REIDITE;
  this.chest_buttons[INV.AMETHYST_WALL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_WALL], 3);
  this.chest_buttons[INV.AMETHYST_WALL].id = INV.AMETHYST_WALL;
  this.chest_buttons[INV.AMETHYST_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_SPIKE], 3);
  this.chest_buttons[INV.AMETHYST_SPIKE].id = INV.AMETHYST_SPIKE;
  this.chest_buttons[INV.AMETHYST_DOOR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DOOR_AMETHYST_CLOSE], 3);
  this.chest_buttons[INV.AMETHYST_DOOR].id = INV.AMETHYST_DOOR;
  this.chest_buttons[INV.CAP_SCARF] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CAP_SCARF], 3);
  this.chest_buttons[INV.CAP_SCARF].id = INV.CAP_SCARF;
  this.chest_buttons[INV.FUR_WINTER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FUR_WINTER], 3);
  this.chest_buttons[INV.FUR_WINTER].id = INV.FUR_WINTER;
  this.chest_buttons[INV.FUR_MAMMOTH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FUR_MAMMOTH], 3);
  this.chest_buttons[INV.FUR_MAMMOTH].id = INV.FUR_MAMMOTH;
  this.chest_buttons[INV.BLUE_CORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BLUE_CORD], 3);
  this.chest_buttons[INV.BLUE_CORD].id = INV.BLUE_CORD;
  this.chest_buttons[INV.LOCK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LOCK], 3);
  this.chest_buttons[INV.LOCK].id = INV.LOCK;
  this.chest_buttons[INV.DRAGON_HEART] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_HEART], 3);
  this.chest_buttons[INV.DRAGON_HEART].id = INV.DRAGON_HEART;
  this.chest_buttons[INV.LAVA_HEART] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_HEART], 3);
  this.chest_buttons[INV.LAVA_HEART].id = INV.LAVA_HEART;
  this.chest_buttons[INV.RESURRECTION] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_RESURRECTION], 3);
  this.chest_buttons[INV.RESURRECTION].id = INV.RESURRECTION;
  this.chest_buttons[INV.LOCKPICK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LOCKPICK], 3);
  this.chest_buttons[INV.LOCKPICK].id = INV.LOCKPICK;
  this.chest_buttons[INV.TOTEM] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_TOTEM], 3);
  this.chest_buttons[INV.TOTEM].id = INV.TOTEM;
  this.chest_buttons[INV.AMETHYST_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_HELMET], 3);
  this.chest_buttons[INV.AMETHYST_HELMET].id = INV.AMETHYST_HELMET;
  this.chest_buttons[INV.SUPER_HAMMER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SUPER_HAMMER], 3);
  this.chest_buttons[INV.SUPER_HAMMER].id = INV.SUPER_HAMMER;
  this.chest_buttons[INV.BRIDGE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BRIDGE], 3);
  this.chest_buttons[INV.BRIDGE].id = INV.BRIDGE;
  this.chest_buttons[INV.WOOD_TOWER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_TOWER], 3);
  this.chest_buttons[INV.WOOD_TOWER].id = INV.WOOD_TOWER;
  this.chest_buttons[INV.BOAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BOAT], 3);
  this.chest_buttons[INV.BOAT].id = INV.BOAT;
  this.chest_buttons[INV.SLED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SLED], 3);
  this.chest_buttons[INV.SLED].id = INV.SLED;
  this.chest_buttons[INV.PLANE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PLANE], 3);
  this.chest_buttons[INV.PLANE].id = INV.PLANE;
  this.chest_buttons[INV.SADDLE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SADDLE], 3);
  this.chest_buttons[INV.SADDLE].id = INV.SADDLE;
  this.chest_buttons[INV.MOUNT_BOAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_MOUNT_BOAR], 3);
  this.chest_buttons[INV.MOUNT_BOAR].id = INV.MOUNT_BOAR;
  this.chest_buttons[INV.BABY_DRAGON] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BABY_DRAGON], 3);
  this.chest_buttons[INV.BABY_DRAGON].id = INV.BABY_DRAGON;
  this.chest_buttons[INV.BABY_MAMMOTH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BABY_MAMMOTH], 3);
  this.chest_buttons[INV.BABY_MAMMOTH].id = INV.BABY_MAMMOTH;
  this.chest_buttons[INV.BABY_LAVA] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BABY_LAVA], 3);
  this.chest_buttons[INV.BABY_LAVA].id = INV.BABY_LAVA;
  this.chest_buttons[INV.HAWK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HAWK], 3);
  this.chest_buttons[INV.HAWK].id = INV.HAWK;
  this.chest_buttons[INV.CRAB_BOSS] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CRAB_BOSS], 3);
  this.chest_buttons[INV.CRAB_BOSS].id = INV.CRAB_BOSS;
  this.chest_buttons[INV.SAND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SAND], 3);
  this.chest_buttons[INV.SAND].id = INV.SAND;
  this.chest_buttons[INV.BOTTLE_FULL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BOTTLE_FULL], 3);
  this.chest_buttons[INV.BOTTLE_FULL].id = INV.BOTTLE_FULL;
  this.chest_buttons[INV.BOTTLE_EMPTY] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BOTTLE_EMPTY], 3);
  this.chest_buttons[INV.BOTTLE_EMPTY].id = INV.BOTTLE_EMPTY;
  this.chest_buttons[INV.SHOVEL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SHOVEL], 3);
  this.chest_buttons[INV.SHOVEL].id = INV.SHOVEL;
  this.chest_buttons[INV.SHOVEL_GOLD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SHOVEL_GOLD], 3);
  this.chest_buttons[INV.SHOVEL_GOLD].id = INV.SHOVEL_GOLD;
  this.chest_buttons[INV.SHOVEL_DIAMOND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SHOVEL_DIAMOND], 3);
  this.chest_buttons[INV.SHOVEL_DIAMOND].id = INV.SHOVEL_DIAMOND;
  this.chest_buttons[INV.SHOVEL_AMETHYST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SHOVEL_AMETHYST], 3);
  this.chest_buttons[INV.SHOVEL_AMETHYST].id = INV.SHOVEL_AMETHYST;
  this.chest_buttons[INV.SPANNER] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SPANNER], 3);
  this.chest_buttons[INV.SPANNER].id = INV.SPANNER;
  this.chest_buttons[INV.KRAKEN_SKIN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_KRAKEN_SKIN], 3);
  this.chest_buttons[INV.KRAKEN_SKIN].id = INV.KRAKEN_SKIN;
  this.chest_buttons[INV.WATERING_CAN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WATERING_CAN], 3);
  this.chest_buttons[INV.WATERING_CAN].id = INV.WATERING_CAN;
  this.chest_buttons[INV.FLOUR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FLOUR], 3);
  this.chest_buttons[INV.FLOUR].id = INV.FLOUR;
  this.chest_buttons[INV.WHEAT_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WHEAT_SEED], 3);
  this.chest_buttons[INV.WHEAT_SEED].id = INV.WHEAT_SEED;
  this.chest_buttons[INV.COOKIE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_COOKIE], 3);
  this.chest_buttons[INV.COOKIE].id = INV.COOKIE;
  this.chest_buttons[INV.WILD_WHEAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WILD_WHEAT], 3);
  this.chest_buttons[INV.WILD_WHEAT].id = INV.WILD_WHEAT;
  this.chest_buttons[INV.WINDMILL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WINDMILL], 3);
  this.chest_buttons[INV.WINDMILL].id = INV.WINDMILL;
  this.chest_buttons[INV.SUPER_DIVING_SUIT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SUPER_DIVING_SUIT], 3);
  this.chest_buttons[INV.SUPER_DIVING_SUIT].id = INV.SUPER_DIVING_SUIT;
  this.chest_buttons[INV.DIVING_MASK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIVING_MASK], 3);
  this.chest_buttons[INV.DIVING_MASK].id = INV.DIVING_MASK;
  this.chest_buttons[INV.WATERING_CAN_FULL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WATERING_CAN_FULL], 3);
  this.chest_buttons[INV.WATERING_CAN_FULL].id = INV.WATERING_CAN_FULL;
  this.chest_buttons[INV.CAKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CAKE], 3);
  this.chest_buttons[INV.CAKE].id = INV.CAKE;
  this.chest_buttons[INV.BREAD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BREAD], 3);
  this.chest_buttons[INV.BREAD].id = INV.BREAD;
  this.chest_buttons[INV.FOODFISH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FOODFISH], 3);
  this.chest_buttons[INV.FOODFISH].id = INV.FOODFISH;
  this.chest_buttons[INV.FOODFISH_COOKED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FOODFISH_COOKED], 3);
  this.chest_buttons[INV.FOODFISH_COOKED].id = INV.FOODFISH_COOKED;
  this.chest_buttons[INV.SCALES] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SCALES], 3);
  this.chest_buttons[INV.SCALES].id = INV.SCALES;
  this.chest_buttons[INV.GROUND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GROUND], 3);
  this.chest_buttons[INV.GROUND].id = INV.GROUND;
  this.chest_buttons[INV.PLOT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PLOT], 3);
  this.chest_buttons[INV.PLOT].id = INV.PLOT;
  this.chest_buttons[INV.ICE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_ICE], 3);
  this.chest_buttons[INV.ICE].id = INV.ICE;
  this.chest_buttons[INV.BREAD_OVEN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BREAD_OVEN], 3);
  this.chest_buttons[INV.BREAD_OVEN].id = INV.BREAD_OVEN;
  this.chest_buttons[INV.SANDWICH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SANDWICH], 3);
  this.chest_buttons[INV.SANDWICH].id = INV.SANDWICH;
  this.chest_buttons[INV.DRAGON_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_HELMET], 3);
  this.chest_buttons[INV.DRAGON_HELMET].id = INV.DRAGON_HELMET;
  this.chest_buttons[INV.DRAGON_SWORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_SWORD], 3);
  this.chest_buttons[INV.DRAGON_SWORD].id = INV.DRAGON_SWORD;
  this.chest_buttons[INV.DRAGON_ORB] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_ORB], 3);
  this.chest_buttons[INV.DRAGON_ORB].id = INV.DRAGON_ORB;
  this.chest_buttons[INV.DRAGON_CUBE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_CUBE], 3);
  this.chest_buttons[INV.DRAGON_CUBE].id = INV.DRAGON_CUBE;
  this.chest_buttons[INV.LAVA_ORB] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_ORB], 3);
  this.chest_buttons[INV.LAVA_ORB].id = INV.LAVA_ORB;
  this.chest_buttons[INV.LAVA_CUBE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_CUBE], 3);
  this.chest_buttons[INV.LAVA_CUBE].id = INV.LAVA_CUBE;
  this.chest_buttons[INV.CROWN_GREEN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CROWN_GREEN], 3);
  this.chest_buttons[INV.CROWN_GREEN].id = INV.CROWN_GREEN;
  this.chest_buttons[INV.GEMME_GREEN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GEMME_GREEN], 3);
  this.chest_buttons[INV.GEMME_GREEN].id = INV.GEMME_GREEN;
  this.chest_buttons[INV.GEMME_ORANGE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GEMME_ORANGE], 3);
  this.chest_buttons[INV.GEMME_ORANGE].id = INV.GEMME_ORANGE;
  this.chest_buttons[INV.CROWN_ORANGE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CROWN_ORANGE], 3);
  this.chest_buttons[INV.CROWN_ORANGE].id = INV.CROWN_ORANGE;
  this.chest_buttons[INV.GEMME_BLUE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GEMME_BLUE], 3);
  this.chest_buttons[INV.GEMME_BLUE].id = INV.GEMME_BLUE;
  this.chest_buttons[INV.CROWN_BLUE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CROWN_BLUE], 3);
  this.chest_buttons[INV.CROWN_BLUE].id = INV.CROWN_BLUE;
  this.chest_buttons[INV.HOOD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_HOOD], 3);
  this.chest_buttons[INV.HOOD].id = INV.HOOD;
  this.chest_buttons[INV.PEASANT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PEASANT], 3);
  this.chest_buttons[INV.PEASANT].id = INV.PEASANT;
  this.chest_buttons[INV.SPECIAL_FUR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SPECIAL_FUR], 3);
  this.chest_buttons[INV.SPECIAL_FUR].id = INV.SPECIAL_FUR;
  this.chest_buttons[INV.SPECIAL_FUR_2] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SPECIAL_FUR_2], 3);
  this.chest_buttons[INV.SPECIAL_FUR_2].id = INV.SPECIAL_FUR_2;
  this.chest_buttons[INV.WINTER_PEASANT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WINTER_PEASANT], 3);
  this.chest_buttons[INV.WINTER_PEASANT].id = INV.WINTER_PEASANT;
  this.chest_buttons[INV.WINTER_HOOD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WINTER_HOOD], 3);
  this.chest_buttons[INV.WINTER_HOOD].id = INV.WINTER_HOOD;
  this.chest_buttons[INV.BUCKET_FULL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BUCKET_FULL], 3);
  this.chest_buttons[INV.BUCKET_FULL].id = INV.BUCKET_FULL;
  this.chest_buttons[INV.BUCKET_EMPTY] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BUCKET_EMPTY], 3);
  this.chest_buttons[INV.BUCKET_EMPTY].id = INV.BUCKET_EMPTY;
  this.chest_buttons[INV.WELL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WELL], 3);
  this.chest_buttons[INV.WELL].id = INV.WELL;
  this.chest_buttons[INV.SIGN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SIGN], 3);
  this.chest_buttons[INV.SIGN].id = INV.SIGN;
  this.chest_buttons[INV.PUMPKIN_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PUMPKIN_SEED], 3);
  this.chest_buttons[INV.PUMPKIN_SEED].id = INV.PUMPKIN_SEED;
  this.chest_buttons[INV.PUMPKIN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PUMPKIN], 3);
  this.chest_buttons[INV.PUMPKIN].id = INV.PUMPKIN;
  this.chest_buttons[INV.ROOF] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_ROOF], 3);
  this.chest_buttons[INV.ROOF].id = INV.ROOF;
  this.chest_buttons[INV.GARLIC_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GARLIC_SEED], 3);
  this.chest_buttons[INV.GARLIC_SEED].id = INV.GARLIC_SEED;
  this.chest_buttons[INV.GARLIC] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GARLIC], 3);
  this.chest_buttons[INV.GARLIC].id = INV.GARLIC;
  this.chest_buttons[INV.THORNBUSH_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_THORNBUSH_SEED], 3);
  this.chest_buttons[INV.THORNBUSH_SEED].id = INV.THORNBUSH_SEED;
  this.chest_buttons[INV.THORNBUSH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_THORNBUSH], 3);
  this.chest_buttons[INV.THORNBUSH].id = INV.THORNBUSH;
  this.chest_buttons[INV.TOMATO_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_TOMATO_SEED], 3);
  this.chest_buttons[INV.TOMATO_SEED].id = INV.TOMATO_SEED;
  this.chest_buttons[INV.TOMATO] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_TOMATO], 3);
  this.chest_buttons[INV.TOMATO].id = INV.TOMATO;
  this.chest_buttons[INV.CARROT_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CARROT_SEED], 3);
  this.chest_buttons[INV.CARROT_SEED].id = INV.CARROT_SEED;
  this.chest_buttons[INV.CARROT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CARROT], 3);
  this.chest_buttons[INV.CARROT].id = INV.CARROT;
  this.chest_buttons[INV.WATERMELON_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WATERMELON_SEED], 3);
  this.chest_buttons[INV.WATERMELON_SEED].id = INV.WATERMELON_SEED;
  this.chest_buttons[INV.WATERMELON] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WATERMELON], 3);
  this.chest_buttons[INV.WATERMELON].id = INV.WATERMELON;
  this.chest_buttons[INV.ALOE_VERA_SEED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_ALOE_VERA_SEED], 3);
  this.chest_buttons[INV.ALOE_VERA_SEED].id = INV.ALOE_VERA_SEED;
  this.chest_buttons[INV.ALOE_VERA] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_ALOE_VERA], 3);
  this.chest_buttons[INV.ALOE_VERA].id = INV.ALOE_VERA;
  this.chest_buttons[INV.CHRISTMAS_HAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CHRISTMAS_HAT], 3);
  this.chest_buttons[INV.CHRISTMAS_HAT].id = INV.CHRISTMAS_HAT;
  this.chest_buttons[INV.ELF_HAT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_ELF_HAT], 3);
  this.chest_buttons[INV.ELF_HAT].id = INV.ELF_HAT;
  this.chest_buttons[INV.WOOD_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_SPEAR], 3);
  this.chest_buttons[INV.WOOD_SPEAR].id = INV.WOOD_SPEAR;
  this.chest_buttons[INV.DRAGON_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DRAGON_SPEAR], 3);
  this.chest_buttons[INV.DRAGON_SPEAR].id = INV.DRAGON_SPEAR;
  this.chest_buttons[INV.CRAB_STICK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CRAB_STICK], 3);
  this.chest_buttons[INV.CRAB_STICK].id = INV.CRAB_STICK;
  this.chest_buttons[INV.CRAB_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CRAB_SPEAR], 3);
  this.chest_buttons[INV.CRAB_SPEAR].id = INV.CRAB_SPEAR;
  this.chest_buttons[INV.CRAB_LOOT] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CRAB_LOOT], 3);
  this.chest_buttons[INV.CRAB_LOOT].id = INV.CRAB_LOOT;
  this.chest_buttons[INV.BED] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_BED], 3);
  this.chest_buttons[INV.BED].id = INV.BED;
  this.chest_buttons[INV.CROWN_CRAB] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CROWN_CRAB], 3);
  this.chest_buttons[INV.CROWN_CRAB].id = INV.CROWN_CRAB;
  this.chest_buttons[INV.GARLAND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GARLAND], 3);
  this.chest_buttons[INV.GARLAND].id = INV.GARLAND;
  this.chest_buttons[INV.SUGAR_CAN] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SUGAR_CAN], 3);
  this.chest_buttons[INV.SUGAR_CAN].id = INV.SUGAR_CAN;
  this.chest_buttons[INV.CANDY] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_CANDY], 3);
  this.chest_buttons[INV.CANDY].id = INV.CANDY;
  this.plus_buttons = [];
  for (let i = 0; i < 250; i++)
    this.plus_buttons[i] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PLUS]);
  this.inv_buttons = [];
  this.inv_buttons[INV.SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SWORD], 3);
  this.inv_buttons[INV.SWORD].id = INV.SWORD;
  this.inv_buttons[INV.PICK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PICK], 3);
  this.inv_buttons[INV.PICK].id = INV.PICK;
  this.inv_buttons[INV.STONE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE], 3);
  this.inv_buttons[INV.STONE].id = INV.STONE;
  this.inv_buttons[INV.STONE].info.img[2] = this.inv_buttons[INV.STONE].info.img[0];
  this.inv_buttons[INV.WOOD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD], 3);
  this.inv_buttons[INV.WOOD].id = INV.WOOD;
  this.inv_buttons[INV.WOOD].info.img[2] = this.inv_buttons[INV.WOOD].info.img[0];
  this.inv_buttons[INV.PLANT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PLANT], 3);
  this.inv_buttons[INV.PLANT].id = INV.PLANT;
  this.inv_buttons[INV.CACTUS] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CACTUS], 3);
  this.inv_buttons[INV.CACTUS].id = INV.CACTUS;
  this.inv_buttons[INV.GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD], 3);
  this.inv_buttons[INV.GOLD].id = INV.GOLD;
  this.inv_buttons[INV.GOLD].info.img[2] = this.inv_buttons[INV.GOLD].info.img[0];
  this.inv_buttons[INV.DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND], 3);
  this.inv_buttons[INV.DIAMOND].id = INV.DIAMOND;
  this.inv_buttons[INV.DIAMOND].info.img[2] = this.inv_buttons[INV.DIAMOND].info.img[0];
  this.inv_buttons[INV.PICK_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PICK_GOLD], 3);
  this.inv_buttons[INV.PICK_GOLD].id = INV.PICK_GOLD;
  this.inv_buttons[INV.PICK_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PICK_DIAMOND], 3);
  this.inv_buttons[INV.PICK_DIAMOND].id = INV.PICK_DIAMOND;
  this.inv_buttons[INV.SWORD_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SWORD_GOLD], 3);
  this.inv_buttons[INV.SWORD_GOLD].id = INV.SWORD_GOLD;
  this.inv_buttons[INV.SWORD_WOOD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SWORD_WOOD], 3);
  this.inv_buttons[INV.SWORD_WOOD].id = INV.SWORD_WOOD;
  this.inv_buttons[INV.SWORD_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SWORD_DIAMOND], 3);
  this.inv_buttons[INV.SWORD_DIAMOND].id = INV.SWORD_DIAMOND;
  this.inv_buttons[INV.FIRE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FIRE], 3);
  this.inv_buttons[INV.FIRE].id = INV.FIRE;
  this.inv_buttons[INV.WORKBENCH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WORK], 3);
  this.inv_buttons[INV.WORKBENCH].id = INV.WORKBENCH;
  this.inv_buttons[INV.SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SEED], 3);
  this.inv_buttons[INV.SEED].id = INV.SEED;
  this.inv_buttons[INV.WALL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WALL], 3);
  this.inv_buttons[INV.WALL].id = INV.WALL;
  this.inv_buttons[INV.SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SPIKE], 3);
  this.inv_buttons[INV.SPIKE].id = INV.SPIKE;
  this.inv_buttons[INV.PICK_WOOD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PICK_WOOD], 3);
  this.inv_buttons[INV.PICK_WOOD].id = INV.PICK_WOOD;
  this.inv_buttons[INV.COOKED_MEAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_COOKED_MEAT], 3);
  this.inv_buttons[INV.COOKED_MEAT].id = INV.COOKED_MEAT;
  this.inv_buttons[INV.MEAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_MEAT], 3);
  this.inv_buttons[INV.MEAT].id = INV.MEAT;
  this.inv_buttons[INV.BIG_FIRE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BIG_FIRE], 3);
  this.inv_buttons[INV.BIG_FIRE].id = INV.BIG_FIRE;
  this.inv_buttons[INV.BANDAGE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BANDAGE], 3);
  this.inv_buttons[INV.BANDAGE].id = INV.BANDAGE;
  this.inv_buttons[INV.CORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CORD], 3);
  this.inv_buttons[INV.CORD].id = INV.CORD;
  this.inv_buttons[INV.CORD].info.img[2] = this.inv_buttons[INV.CORD].info.img[0];
  this.inv_buttons[INV.STONE_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_WALL], 3);
  this.inv_buttons[INV.STONE_WALL].id = INV.STONE_WALL;
  this.inv_buttons[INV.GOLD_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_WALL], 3);
  this.inv_buttons[INV.GOLD_WALL].id = INV.GOLD_WALL;
  this.inv_buttons[INV.DIAMOND_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_WALL], 3);
  this.inv_buttons[INV.DIAMOND_WALL].id = INV.DIAMOND_WALL;
  this.inv_buttons[INV.WOOD_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DOOR_WOOD_CLOSE], 3);
  this.inv_buttons[INV.WOOD_DOOR].id = INV.WOOD_DOOR;
  this.inv_buttons[INV.CHEST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CHEST], 3);
  this.inv_buttons[INV.CHEST].id = INV.CHEST;
  this.inv_buttons[INV.STONE_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_SPIKE], 3);
  this.inv_buttons[INV.STONE_SPIKE].id = INV.STONE_SPIKE;
  this.inv_buttons[INV.GOLD_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_SPIKE], 3);
  this.inv_buttons[INV.GOLD_SPIKE].id = INV.GOLD_SPIKE;
  this.inv_buttons[INV.DIAMOND_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_SPIKE], 3);
  this.inv_buttons[INV.DIAMOND_SPIKE].id = INV.DIAMOND_SPIKE;
  this.inv_buttons[INV.BAG] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BAG], 3);
  this.inv_buttons[INV.BAG].id = INV.BAG;
  this.inv_buttons[INV.EARMUFFS] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EARMUFFS], 3);
  this.inv_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
  this.inv_buttons[INV.STONE_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DOOR_STONE_CLOSE], 3);
  this.inv_buttons[INV.STONE_DOOR].id = INV.STONE_DOOR;
  this.inv_buttons[INV.GOLD_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DOOR_GOLD_CLOSE], 3);
  this.inv_buttons[INV.GOLD_DOOR].id = INV.GOLD_DOOR;
  this.inv_buttons[INV.DIAMOND_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DOOR_DIAMOND_CLOSE], 3);
  this.inv_buttons[INV.DIAMOND_DOOR].id = INV.DIAMOND_DOOR;
  this.inv_buttons[INV.FUR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FUR], 3);
  this.inv_buttons[INV.FUR].id = INV.FUR;
  this.inv_buttons[INV.FUR].info.img[2] = this.inv_buttons[INV.FUR].info.img[0];
  this.inv_buttons[INV.FUR_BOAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FUR_BOAR], 3);
  this.inv_buttons[INV.FUR_BOAR].id = INV.FUR_BOAR;
  this.inv_buttons[INV.FUR_BOAR].info.img[2] = this.inv_buttons[INV.FUR_BOAR].info.img[0];
  this.inv_buttons[INV.FUR_WOLF] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FUR_WOLF], 3);
  this.inv_buttons[INV.FUR_WOLF].id = INV.FUR_WOLF;
  this.inv_buttons[INV.FUR_WOLF].info.img[2] = this.inv_buttons[INV.FUR_WOLF].info.img[0];
  this.inv_buttons[INV.PENGUIN_FEATHER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PENGUIN_FEATHER], 3);
  this.inv_buttons[INV.PENGUIN_FEATHER].id = INV.PENGUIN_FEATHER;
  this.inv_buttons[INV.HAWK_FEATHER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAWK_FEATHER], 3);
  this.inv_buttons[INV.HAWK_FEATHER].id = INV.HAWK_FEATHER;
  this.inv_buttons[INV.VULTURE_FEATHER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_VULTURE_FEATHER], 3);
  this.inv_buttons[INV.VULTURE_FEATHER].id = INV.VULTURE_FEATHER;
  this.inv_buttons[INV.EMERALD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EMERALD], 3);
  this.inv_buttons[INV.EMERALD].id = INV.EMERALD;
  this.inv_buttons[INV.EARMUFFS] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EARMUFFS], 3);
  this.inv_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
  this.inv_buttons[INV.COAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_COAT], 3);
  this.inv_buttons[INV.COAT].id = INV.COAT;
  this.inv_buttons[INV.WOOD_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_SPEAR], 3);
  this.inv_buttons[INV.WOOD_SPEAR].id = INV.WOOD_SPEAR;
  this.inv_buttons[INV.SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SPEAR], 3);
  this.inv_buttons[INV.SPEAR].id = INV.SPEAR;
  this.inv_buttons[INV.GOLD_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_SPEAR], 3);
  this.inv_buttons[INV.GOLD_SPEAR].id = INV.GOLD_SPEAR;
  this.inv_buttons[INV.DIAMOND_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_SPEAR], 3);
  this.inv_buttons[INV.DIAMOND_SPEAR].id = INV.DIAMOND_SPEAR;
  this.inv_buttons[INV.DRAGON_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_SPEAR], 3);
  this.inv_buttons[INV.DRAGON_SPEAR].id = INV.DRAGON_SPEAR;
  this.inv_buttons[INV.FURNACE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FURNACE], 3);
  this.inv_buttons[INV.FURNACE].id = INV.FURNACE;
  this.inv_buttons[INV.EXPLORER_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EXPLORER_HAT], 3);
  this.inv_buttons[INV.EXPLORER_HAT].id = INV.EXPLORER_HAT;
  this.inv_buttons[INV.PIRATE_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PIRATE_HAT], 3);
  this.inv_buttons[INV.PIRATE_HAT].id = INV.PIRATE_HAT;
  this.inv_buttons[INV.FLOWER_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FLOWER_HAT], 3);
  this.inv_buttons[INV.FLOWER_HAT].id = INV.FLOWER_HAT;
  this.inv_buttons[INV.FUR_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FUR_HAT], 3);
  this.inv_buttons[INV.FUR_HAT].id = INV.FUR_HAT;
  this.inv_buttons[INV.TURBAN1] = gui_create_button(60, 60, "", sprite[SPRITE.INV_TURBAN1], 3);
  this.inv_buttons[INV.TURBAN1].id = INV.TURBAN1;
  this.inv_buttons[INV.TURBAN2] = gui_create_button(60, 60, "", sprite[SPRITE.INV_TURBAN2], 3);
  this.inv_buttons[INV.TURBAN2].id = INV.TURBAN2;
  this.inv_buttons[INV.WOOD_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_BOW], 3);
  this.inv_buttons[INV.WOOD_BOW].id = INV.WOOD_BOW;
  this.inv_buttons[INV.WOOD_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_ARROW], 3);
  this.inv_buttons[INV.WOOD_ARROW].id = INV.WOOD_ARROW;
  this.inv_buttons[INV.WOOD_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_SHIELD], 3);
  this.inv_buttons[INV.WOOD_SHIELD].id = INV.WOOD_SHIELD;
  this.inv_buttons[INV.STONE_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_BOW], 3);
  this.inv_buttons[INV.STONE_BOW].id = INV.STONE_BOW;
  this.inv_buttons[INV.STONE_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_ARROW], 3);
  this.inv_buttons[INV.STONE_ARROW].id = INV.STONE_ARROW;
  this.inv_buttons[INV.STONE_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_SHIELD], 3);
  this.inv_buttons[INV.STONE_SHIELD].id = INV.STONE_SHIELD;
  this.inv_buttons[INV.GOLD_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_BOW], 3);
  this.inv_buttons[INV.GOLD_BOW].id = INV.GOLD_BOW;
  this.inv_buttons[INV.GOLD_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_ARROW], 3);
  this.inv_buttons[INV.GOLD_ARROW].id = INV.GOLD_ARROW;
  this.inv_buttons[INV.GOLD_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_SHIELD], 3);
  this.inv_buttons[INV.GOLD_SHIELD].id = INV.GOLD_SHIELD;
  this.inv_buttons[INV.DIAMOND_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_BOW], 3);
  this.inv_buttons[INV.DIAMOND_BOW].id = INV.DIAMOND_BOW;
  this.inv_buttons[INV.DIAMOND_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_ARROW], 3);
  this.inv_buttons[INV.DIAMOND_ARROW].id = INV.DIAMOND_ARROW;
  this.inv_buttons[INV.DIAMOND_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_SHIELD], 3);
  this.inv_buttons[INV.DIAMOND_SHIELD].id = INV.DIAMOND_SHIELD;
  this.inv_buttons[INV.AMETHYST_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_BOW], 3);
  this.inv_buttons[INV.AMETHYST_BOW].id = INV.AMETHYST_BOW;
  this.inv_buttons[INV.AMETHYST_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_ARROW], 3);
  this.inv_buttons[INV.AMETHYST_ARROW].id = INV.AMETHYST_ARROW;
  this.inv_buttons[INV.AMETHYST_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_SHIELD], 3);
  this.inv_buttons[INV.AMETHYST_SHIELD].id = INV.AMETHYST_SHIELD;
  this.inv_buttons[INV.REIDITE_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_BOW], 3);
  this.inv_buttons[INV.REIDITE_BOW].id = INV.REIDITE_BOW;
  this.inv_buttons[INV.REIDITE_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_ARROW], 3);
  this.inv_buttons[INV.REIDITE_ARROW].id = INV.REIDITE_ARROW;
  this.inv_buttons[INV.REIDITE_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_SHIELD], 3);
  this.inv_buttons[INV.REIDITE_SHIELD].id = INV.REIDITE_SHIELD;
  this.inv_buttons[INV.DRAGON_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_BOW], 3);
  this.inv_buttons[INV.DRAGON_BOW].id = INV.DRAGON_BOW;
  this.inv_buttons[INV.DRAGON_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_ARROW], 3);
  this.inv_buttons[INV.DRAGON_ARROW].id = INV.DRAGON_ARROW;
  this.inv_buttons[INV.WOOD_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_HELMET], 3);
  this.inv_buttons[INV.WOOD_HELMET].id = INV.WOOD_HELMET;
  this.inv_buttons[INV.STONE_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_HELMET], 3);
  this.inv_buttons[INV.STONE_HELMET].id = INV.STONE_HELMET;
  this.inv_buttons[INV.GOLD_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_HELMET], 3);
  this.inv_buttons[INV.GOLD_HELMET].id = INV.GOLD_HELMET;
  this.inv_buttons[INV.DIAMOND_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_HELMET], 3);
  this.inv_buttons[INV.DIAMOND_HELMET].id = INV.DIAMOND_HELMET;
  this.inv_buttons[INV.BOOK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BOOK], 3);
  this.inv_buttons[INV.BOOK].id = INV.BOOK;
  this.inv_buttons[INV.PAPER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PAPER], 3);
  this.inv_buttons[INV.PAPER].id = INV.PAPER;
  this.inv_buttons[INV.PAPER].info.img[2] = this.inv_buttons[INV.PAPER].info.img[0];
  this.inv_buttons[INV.BAG] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BAG], 3);
  this.inv_buttons[INV.BAG].id = INV.BAG;
  this.inv_buttons[INV.AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST], 3);
  this.inv_buttons[INV.AMETHYST].id = INV.AMETHYST;
  this.inv_buttons[INV.AMETHYST].info.img[2] = this.inv_buttons[INV.AMETHYST].info.img[0];
  this.inv_buttons[INV.SWORD_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SWORD_AMETHYST], 3);
  this.inv_buttons[INV.SWORD_AMETHYST].id = INV.SWORD_AMETHYST;
  this.inv_buttons[INV.PIRATE_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PIRATE_SWORD], 3);
  this.inv_buttons[INV.PIRATE_SWORD].id = INV.PIRATE_SWORD;
  this.inv_buttons[INV.PICK_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PICK_AMETHYST], 3);
  this.inv_buttons[INV.PICK_AMETHYST].id = INV.PICK_AMETHYST;
  this.inv_buttons[INV.PICK_REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PICK_REIDITE], 3);
  this.inv_buttons[INV.PICK_REIDITE].id = INV.PICK_REIDITE;
  this.inv_buttons[INV.AMETHYST_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_SPEAR], 3);
  this.inv_buttons[INV.AMETHYST_SPEAR].id = INV.AMETHYST_SPEAR;
  this.inv_buttons[INV.HAMMER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAMMER], 3);
  this.inv_buttons[INV.HAMMER].id = INV.HAMMER;
  this.inv_buttons[INV.HAMMER_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAMMER_GOLD], 3);
  this.inv_buttons[INV.HAMMER_GOLD].id = INV.HAMMER_GOLD;
  this.inv_buttons[INV.HAMMER_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAMMER_DIAMOND], 3);
  this.inv_buttons[INV.HAMMER_DIAMOND].id = INV.HAMMER_DIAMOND;
  this.inv_buttons[INV.HAMMER_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAMMER_AMETHYST], 3);
  this.inv_buttons[INV.HAMMER_AMETHYST].id = INV.HAMMER_AMETHYST;
  this.inv_buttons[INV.HAMMER_REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAMMER_REIDITE], 3);
  this.inv_buttons[INV.HAMMER_REIDITE].id = INV.HAMMER_REIDITE;
  this.inv_buttons[INV.AMETHYST_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_WALL], 3);
  this.inv_buttons[INV.AMETHYST_WALL].id = INV.AMETHYST_WALL;
  this.inv_buttons[INV.AMETHYST_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_SPIKE], 3);
  this.inv_buttons[INV.AMETHYST_SPIKE].id = INV.AMETHYST_SPIKE;
  this.inv_buttons[INV.AMETHYST_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DOOR_AMETHYST_CLOSE], 3);
  this.inv_buttons[INV.AMETHYST_DOOR].id = INV.AMETHYST_DOOR;
  this.inv_buttons[INV.CAP_SCARF] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CAP_SCARF], 3);
  this.inv_buttons[INV.CAP_SCARF].id = INV.CAP_SCARF;
  this.inv_buttons[INV.FUR_WINTER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FUR_WINTER], 3);
  this.inv_buttons[INV.FUR_WINTER].id = INV.FUR_WINTER;
  this.inv_buttons[INV.FUR_WINTER].info.img[2] = this.inv_buttons[INV.FUR_WINTER].info.img[0];
  this.inv_buttons[INV.FUR_MAMMOTH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FUR_MAMMOTH], 3);
  this.inv_buttons[INV.FUR_MAMMOTH].id = INV.FUR_MAMMOTH;
  this.inv_buttons[INV.FUR_MAMMOTH].info.img[2] = this.inv_buttons[INV.FUR_MAMMOTH].info.img[0];
  this.inv_buttons[INV.BLUE_CORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BLUE_CORD], 3);
  this.inv_buttons[INV.BLUE_CORD].id = INV.BLUE_CORD;
  this.inv_buttons[INV.BLUE_CORD].info.img[2] = this.inv_buttons[INV.BLUE_CORD].info.img[0];
  this.inv_buttons[INV.LOCK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LOCK], 3);
  this.inv_buttons[INV.LOCK].id = INV.LOCK;
  this.inv_buttons[INV.LOCK].info.img[2] = this.inv_buttons[INV.LOCK].info.img[0];
  this.inv_buttons[INV.DRAGON_HEART] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_HEART], 3);
  this.inv_buttons[INV.DRAGON_HEART].id = INV.DRAGON_HEART;
  this.inv_buttons[INV.LAVA_HEART] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_HEART], 3);
  this.inv_buttons[INV.LAVA_HEART].id = INV.LAVA_HEART;
  this.inv_buttons[INV.RESURRECTION] = gui_create_button(60, 60, "", sprite[SPRITE.INV_RESURRECTION], 3);
  this.inv_buttons[INV.RESURRECTION].id = INV.RESURRECTION;
  this.inv_buttons[INV.LOCKPICK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LOCKPICK], 3);
  this.inv_buttons[INV.LOCKPICK].id = INV.LOCKPICK;
  this.inv_buttons[INV.TOTEM] = gui_create_button(60, 60, "", sprite[SPRITE.INV_TOTEM], 3);
  this.inv_buttons[INV.TOTEM].id = INV.TOTEM;
  this.inv_buttons[INV.AMETHYST_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_HELMET], 3);
  this.inv_buttons[INV.AMETHYST_HELMET].id = INV.AMETHYST_HELMET;
  this.inv_buttons[INV.SUPER_HAMMER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SUPER_HAMMER], 3);
  this.inv_buttons[INV.SUPER_HAMMER].id = INV.SUPER_HAMMER;
  this.inv_buttons[INV.BRIDGE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BRIDGE], 3);
  this.inv_buttons[INV.BRIDGE].id = INV.BRIDGE;
  this.inv_buttons[INV.WOOD_TOWER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_TOWER], 3);
  this.inv_buttons[INV.WOOD_TOWER].id = INV.WOOD_TOWER;
  this.inv_buttons[INV.BOAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BOAT], 3);
  this.inv_buttons[INV.BOAT].id = INV.BOAT;
  this.inv_buttons[INV.SLED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SLED], 3);
  this.inv_buttons[INV.SLED].id = INV.SLED;
  this.inv_buttons[INV.PLANE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PLANE], 3);
  this.inv_buttons[INV.PLANE].id = INV.PLANE;
  this.inv_buttons[INV.SADDLE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SADDLE], 3);
  this.inv_buttons[INV.SADDLE].id = INV.SADDLE;
  this.inv_buttons[INV.MOUNT_BOAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_MOUNT_BOAR], 3);
  this.inv_buttons[INV.MOUNT_BOAR].id = INV.MOUNT_BOAR;
  this.inv_buttons[INV.CRAB_BOSS] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CRAB_BOSS], 3);
  this.inv_buttons[INV.CRAB_BOSS].id = INV.CRAB_BOSS;
  this.inv_buttons[INV.BABY_DRAGON] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BABY_DRAGON], 3);
  this.inv_buttons[INV.BABY_DRAGON].id = INV.BABY_DRAGON;
  this.inv_buttons[INV.BABY_MAMMOTH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BABY_MAMMOTH], 3);
  this.inv_buttons[INV.BABY_MAMMOTH].id = INV.BABY_MAMMOTH;
  this.inv_buttons[INV.BABY_LAVA] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BABY_LAVA], 3);
  this.inv_buttons[INV.BABY_LAVA].id = INV.BABY_LAVA;
  this.inv_buttons[INV.HAWK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HAWK], 3);
  this.inv_buttons[INV.HAWK].id = INV.HAWK;
  this.inv_buttons[INV.SAND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SAND], 3);
  this.inv_buttons[INV.SAND].id = INV.SAND;
  this.inv_buttons[INV.SAND].info.img[2] = this.inv_buttons[INV.SAND].info.img[0];
  this.inv_buttons[INV.BOTTLE_FULL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BOTTLE_FULL], 3);
  this.inv_buttons[INV.BOTTLE_FULL].id = INV.BOTTLE_FULL;
  this.inv_buttons[INV.BOTTLE_EMPTY] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BOTTLE_EMPTY], 3);
  this.inv_buttons[INV.BOTTLE_EMPTY].id = INV.BOTTLE_EMPTY;
  this.inv_buttons[INV.SHOVEL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SHOVEL], 3);
  this.inv_buttons[INV.SHOVEL].id = INV.SHOVEL;
  this.inv_buttons[INV.SHOVEL_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SHOVEL_GOLD], 3);
  this.inv_buttons[INV.SHOVEL_GOLD].id = INV.SHOVEL_GOLD;
  this.inv_buttons[INV.SHOVEL_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SHOVEL_DIAMOND], 3);
  this.inv_buttons[INV.SHOVEL_DIAMOND].id = INV.SHOVEL_DIAMOND;
  this.inv_buttons[INV.SHOVEL_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SHOVEL_AMETHYST], 3);
  this.inv_buttons[INV.SHOVEL_AMETHYST].id = INV.SHOVEL_AMETHYST;
  this.inv_buttons[INV.SPANNER] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SPANNER], 3);
  this.inv_buttons[INV.SPANNER].id = INV.SPANNER;
  this.inv_buttons[INV.KRAKEN_SKIN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_KRAKEN_SKIN], 3);
  this.inv_buttons[INV.KRAKEN_SKIN].id = INV.KRAKEN_SKIN;
  this.inv_buttons[INV.KRAKEN_SKIN].info.img[2] = this.inv_buttons[INV.KRAKEN_SKIN].info.img[0];
  this.inv_buttons[INV.WATERING_CAN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WATERING_CAN], 3);
  this.inv_buttons[INV.WATERING_CAN].id = INV.WATERING_CAN;
  this.inv_buttons[INV.FLOUR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FLOUR], 3);
  this.inv_buttons[INV.FLOUR].id = INV.FLOUR;
  this.inv_buttons[INV.FLOUR].info.img[2] = this.inv_buttons[INV.FLOUR].info.img[0];
  this.inv_buttons[INV.WHEAT_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WHEAT_SEED], 3);
  this.inv_buttons[INV.WHEAT_SEED].id = INV.WHEAT_SEED;
  this.inv_buttons[INV.COOKIE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_COOKIE], 3);
  this.inv_buttons[INV.COOKIE].id = INV.COOKIE;
  this.inv_buttons[INV.WILD_WHEAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WILD_WHEAT], 3);
  this.inv_buttons[INV.WILD_WHEAT].id = INV.WILD_WHEAT;
  this.inv_buttons[INV.WILD_WHEAT].info.img[2] = this.inv_buttons[INV.WILD_WHEAT].info.img[0];
  this.inv_buttons[INV.WINDMILL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WINDMILL], 3);
  this.inv_buttons[INV.WINDMILL].id = INV.WINDMILL;
  this.inv_buttons[INV.SUPER_DIVING_SUIT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SUPER_DIVING_SUIT], 3);
  this.inv_buttons[INV.SUPER_DIVING_SUIT].id = INV.SUPER_DIVING_SUIT;
  this.inv_buttons[INV.DIVING_MASK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIVING_MASK], 3);
  this.inv_buttons[INV.DIVING_MASK].id = INV.DIVING_MASK;
  this.inv_buttons[INV.WATERING_CAN_FULL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WATERING_CAN_FULL], 3);
  this.inv_buttons[INV.WATERING_CAN_FULL].id = INV.WATERING_CAN_FULL;
  this.inv_buttons[INV.CAKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CAKE], 3);
  this.inv_buttons[INV.CAKE].id = INV.CAKE;
  this.inv_buttons[INV.BREAD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BREAD], 3);
  this.inv_buttons[INV.BREAD].id = INV.BREAD;
  this.inv_buttons[INV.FOODFISH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FOODFISH], 3);
  this.inv_buttons[INV.FOODFISH].id = INV.FOODFISH;
  this.inv_buttons[INV.FOODFISH_COOKED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FOODFISH_COOKED], 3);
  this.inv_buttons[INV.FOODFISH_COOKED].id = INV.FOODFISH_COOKED;
  this.inv_buttons[INV.SCALES] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SCALES], 3);
  this.inv_buttons[INV.SCALES].id = INV.SCALES;
  this.inv_buttons[INV.SCALES].info.img[2] = this.inv_buttons[INV.SCALES].info.img[0];
  this.inv_buttons[INV.GROUND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GROUND], 3);
  this.inv_buttons[INV.GROUND].id = INV.GROUND;
  this.inv_buttons[INV.GROUND].info.img[2] = this.inv_buttons[INV.GROUND].info.img[0];
  this.inv_buttons[INV.PLOT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PLOT], 3);
  this.inv_buttons[INV.PLOT].id = INV.PLOT;
  this.inv_buttons[INV.ICE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_ICE], 3);
  this.inv_buttons[INV.ICE].id = INV.ICE;
  this.inv_buttons[INV.ICE].info.img[2] = this.inv_buttons[INV.ICE].info.img[0];
  this.inv_buttons[INV.BREAD_OVEN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BREAD_OVEN], 3);
  this.inv_buttons[INV.BREAD_OVEN].id = INV.BREAD_OVEN;
  this.inv_buttons[INV.SANDWICH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SANDWICH], 3);
  this.inv_buttons[INV.SANDWICH].id = INV.SANDWICH;
  this.inv_buttons[INV.DRAGON_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_HELMET], 3);
  this.inv_buttons[INV.DRAGON_HELMET].id = INV.DRAGON_HELMET;
  this.inv_buttons[INV.DRAGON_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_SWORD], 3);
  this.inv_buttons[INV.DRAGON_SWORD].id = INV.DRAGON_SWORD;
  this.inv_buttons[INV.DRAGON_ORB] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_ORB], 3);
  this.inv_buttons[INV.DRAGON_ORB].id = INV.DRAGON_ORB;
  this.inv_buttons[INV.DRAGON_ORB].info.img[2] = this.inv_buttons[INV.DRAGON_ORB].info.img[0];
  this.inv_buttons[INV.DRAGON_CUBE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_CUBE], 3);
  this.inv_buttons[INV.DRAGON_CUBE].id = INV.DRAGON_CUBE;
  this.inv_buttons[INV.DRAGON_CUBE].info.img[2] = this.inv_buttons[INV.DRAGON_CUBE].info.img[0];
  this.inv_buttons[INV.LAVA_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_SPEAR], 3);
  this.inv_buttons[INV.LAVA_SPEAR].id = INV.LAVA_SPEAR;
  this.inv_buttons[INV.LAVA_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_SWORD], 3);
  this.inv_buttons[INV.LAVA_SWORD].id = INV.LAVA_SWORD;
  this.inv_buttons[INV.LAVA_ORB] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_ORB], 3);
  this.inv_buttons[INV.LAVA_ORB].id = INV.LAVA_ORB;
  this.inv_buttons[INV.LAVA_ORB].info.img[2] = this.inv_buttons[INV.LAVA_ORB].info.img[0];
  this.inv_buttons[INV.LAVA_CUBE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_CUBE], 3);
  this.inv_buttons[INV.LAVA_CUBE].id = INV.LAVA_CUBE;
  this.inv_buttons[INV.LAVA_CUBE].info.img[2] = this.inv_buttons[INV.LAVA_CUBE].info.img[0];
  this.inv_buttons[INV.CROWN_GREEN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CROWN_GREEN], 3);
  this.inv_buttons[INV.CROWN_GREEN].id = INV.CROWN_GREEN;
  this.inv_buttons[INV.GEMME_GREEN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GEMME_GREEN], 3);
  this.inv_buttons[INV.GEMME_GREEN].id = INV.GEMME_GREEN;
  this.inv_buttons[INV.GEMME_GREEN].info.img[2] = this.inv_buttons[INV.GEMME_GREEN].info.img[0];
  this.inv_buttons[INV.GEMME_ORANGE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GEMME_ORANGE], 3);
  this.inv_buttons[INV.GEMME_ORANGE].id = INV.GEMME_ORANGE;
  this.inv_buttons[INV.GEMME_ORANGE].info.img[2] = this.inv_buttons[INV.GEMME_ORANGE].info.img[0];
  this.inv_buttons[INV.CROWN_ORANGE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CROWN_ORANGE], 3);
  this.inv_buttons[INV.CROWN_ORANGE].id = INV.CROWN_ORANGE;
  this.inv_buttons[INV.GEMME_BLUE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GEMME_BLUE], 3);
  this.inv_buttons[INV.GEMME_BLUE].id = INV.GEMME_BLUE;
  this.inv_buttons[INV.GEMME_BLUE].info.img[2] = this.inv_buttons[INV.GEMME_BLUE].info.img[0];
  this.inv_buttons[INV.CROWN_BLUE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CROWN_BLUE], 3);
  this.inv_buttons[INV.CROWN_BLUE].id = INV.CROWN_BLUE;
  this.inv_buttons[INV.HOOD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_HOOD], 3);
  this.inv_buttons[INV.HOOD].id = INV.HOOD;
  this.inv_buttons[INV.PEASANT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PEASANT], 3);
  this.inv_buttons[INV.PEASANT].id = INV.PEASANT;
  this.inv_buttons[INV.SPECIAL_FUR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SPECIAL_FUR], 3);
  this.inv_buttons[INV.SPECIAL_FUR].id = INV.SPECIAL_FUR;
  this.inv_buttons[INV.SPECIAL_FUR_2] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SPECIAL_FUR_2], 3);
  this.inv_buttons[INV.SPECIAL_FUR_2].id = INV.SPECIAL_FUR_2;
  this.inv_buttons[INV.WINTER_PEASANT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WINTER_PEASANT], 3);
  this.inv_buttons[INV.WINTER_PEASANT].id = INV.WINTER_PEASANT;
  this.inv_buttons[INV.WINTER_HOOD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WINTER_HOOD], 3);
  this.inv_buttons[INV.WINTER_HOOD].id = INV.WINTER_HOOD;
  this.inv_buttons[INV.BUCKET_FULL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BUCKET_FULL], 3);
  this.inv_buttons[INV.BUCKET_FULL].id = INV.BUCKET_FULL;
  this.inv_buttons[INV.BUCKET_EMPTY] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BUCKET_EMPTY], 3);
  this.inv_buttons[INV.BUCKET_EMPTY].id = INV.BUCKET_EMPTY;
  this.inv_buttons[INV.WELL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WELL], 3);
  this.inv_buttons[INV.WELL].id = INV.WELL;
  this.inv_buttons[INV.SIGN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SIGN], 3);
  this.inv_buttons[INV.SIGN].id = INV.SIGN;
  this.inv_buttons[INV.PUMPKIN_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PUMPKIN_SEED], 3);
  this.inv_buttons[INV.PUMPKIN_SEED].id = INV.PUMPKIN_SEED;
  this.inv_buttons[INV.PUMPKIN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PUMPKIN], 3);
  this.inv_buttons[INV.PUMPKIN].id = INV.PUMPKIN;
  this.inv_buttons[INV.GARLIC_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GARLIC_SEED], 3);
  this.inv_buttons[INV.GARLIC_SEED].id = INV.GARLIC_SEED;
  this.inv_buttons[INV.GARLIC] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GARLIC], 3);
  this.inv_buttons[INV.GARLIC].id = INV.GARLIC;
  this.inv_buttons[INV.ROOF] = gui_create_button(60, 60, "", sprite[SPRITE.INV_ROOF], 3);
  this.inv_buttons[INV.ROOF].id = INV.ROOF;
  this.inv_buttons[INV.THORNBUSH_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_THORNBUSH_SEED], 3);
  this.inv_buttons[INV.THORNBUSH_SEED].id = INV.THORNBUSH_SEED;
  this.inv_buttons[INV.THORNBUSH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_THORNBUSH], 3);
  this.inv_buttons[INV.THORNBUSH].id = INV.THORNBUSH;
  this.inv_buttons[INV.CARROT_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CARROT_SEED], 3);
  this.inv_buttons[INV.CARROT_SEED].id = INV.CARROT_SEED;
  this.inv_buttons[INV.CARROT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CARROT], 3);
  this.inv_buttons[INV.CARROT].id = INV.CARROT;
  this.inv_buttons[INV.TOMATO_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_TOMATO_SEED], 3);
  this.inv_buttons[INV.TOMATO_SEED].id = INV.TOMATO_SEED;
  this.inv_buttons[INV.TOMATO] = gui_create_button(60, 60, "", sprite[SPRITE.INV_TOMATO], 3);
  this.inv_buttons[INV.TOMATO].id = INV.TOMATO;
  this.inv_buttons[INV.WATERMELON_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WATERMELON_SEED], 3);
  this.inv_buttons[INV.WATERMELON_SEED].id = INV.WATERMELON_SEED;
  this.inv_buttons[INV.WATERMELON] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WATERMELON], 3);
  this.inv_buttons[INV.WATERMELON].id = INV.WATERMELON;
  this.inv_buttons[INV.ALOE_VERA_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_ALOE_VERA_SEED], 3);
  this.inv_buttons[INV.ALOE_VERA_SEED].id = INV.ALOE_VERA_SEED;
  this.inv_buttons[INV.ALOE_VERA] = gui_create_button(60, 60, "", sprite[SPRITE.INV_ALOE_VERA], 3);
  this.inv_buttons[INV.ALOE_VERA].id = INV.ALOE_VERA;
  this.inv_buttons[INV.CHRISTMAS_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CHRISTMAS_HAT], 3);
  this.inv_buttons[INV.CHRISTMAS_HAT].id = INV.CHRISTMAS_HAT;
  this.inv_buttons[INV.ELF_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_ELF_HAT], 3);
  this.inv_buttons[INV.ELF_HAT].id = INV.ELF_HAT;
  this.inv_buttons[INV.WOOD_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_SPEAR], 3);
  this.inv_buttons[INV.WOOD_SPEAR].id = INV.WOOD_SPEAR;
  this.inv_buttons[INV.DRAGON_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_SPEAR], 3);
  this.inv_buttons[INV.DRAGON_SPEAR].id = INV.DRAGON_SPEAR;
  this.inv_buttons[INV.CRAB_STICK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CRAB_STICK], 3);
  this.inv_buttons[INV.CRAB_STICK].id = INV.CRAB_STICK;
  this.inv_buttons[INV.CRAB_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CRAB_SPEAR], 3);
  this.inv_buttons[INV.CRAB_SPEAR].id = INV.CRAB_SPEAR;
  this.inv_buttons[INV.CRAB_LOOT] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CRAB_LOOT], 3);
  this.inv_buttons[INV.CRAB_LOOT].id = INV.CRAB_LOOT;
  this.inv_buttons[INV.BED] = gui_create_button(60, 60, "", sprite[SPRITE.INV_BED], 3);
  this.inv_buttons[INV.BED].id = INV.BED;
  this.inv_buttons[INV.CROWN_CRAB] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CROWN_CRAB], 3);
  this.inv_buttons[INV.CROWN_CRAB].id = INV.CROWN_CRAB;
  this.inv_buttons[INV.GARLAND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GARLAND], 3);
  this.inv_buttons[INV.GARLAND].id = INV.GARLAND;
  this.inv_buttons[INV.CANDY] = gui_create_button(60, 60, "", sprite[SPRITE.INV_CANDY], 3);
  this.inv_buttons[INV.CANDY].id = INV.CANDY;
  this.inv_buttons[INV.SUGAR_CAN] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SUGAR_CAN], 3);
  this.inv_buttons[INV.SUGAR_CAN].id = INV.SUGAR_CAN;
  this.craft_buttons = [];
  this.craft_buttons[CRAFT.SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SWORD], 3);
  this.craft_buttons[CRAFT.SWORD].id = CRAFT.SWORD;
  this.craft_buttons[CRAFT.PICK] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PICK], 3);
  this.craft_buttons[CRAFT.PICK].id = CRAFT.PICK;
  this.craft_buttons[CRAFT.FIRE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_FIRE], 3);
  this.craft_buttons[CRAFT.FIRE].id = CRAFT.FIRE;
  this.craft_buttons[CRAFT.WORKBENCH] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WORK], 3);
  this.craft_buttons[CRAFT.WORKBENCH].id = CRAFT.WORKBENCH;
  this.craft_buttons[CRAFT.WALL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WALL], 3);
  this.craft_buttons[CRAFT.WALL].id = CRAFT.WALL;
  this.craft_buttons[CRAFT.SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SPIKE], 3);
  this.craft_buttons[CRAFT.SPIKE].id = CRAFT.SPIKE;
  this.craft_buttons[CRAFT.SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SEED], 3);
  this.craft_buttons[CRAFT.SEED].id = CRAFT.SEED;
  this.craft_buttons[CRAFT.PICK_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PICK_GOLD], 3);
  this.craft_buttons[CRAFT.PICK_GOLD].id = CRAFT.PICK_GOLD;
  this.craft_buttons[CRAFT.PICK_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PICK_DIAMOND], 3);
  this.craft_buttons[CRAFT.PICK_DIAMOND].id = CRAFT.PICK_DIAMOND;
  this.craft_buttons[CRAFT.SWORD_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SWORD_GOLD], 3);
  this.craft_buttons[CRAFT.SWORD_GOLD].id = CRAFT.SWORD_GOLD;
  this.craft_buttons[CRAFT.SWORD_WOOD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SWORD_WOOD], 3);
  this.craft_buttons[CRAFT.SWORD_WOOD].id = CRAFT.SWORD_WOOD;
  this.craft_buttons[CRAFT.SWORD_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SWORD_DIAMOND], 3);
  this.craft_buttons[CRAFT.SWORD_DIAMOND].id = CRAFT.SWORD_DIAMOND;
  this.craft_buttons[CRAFT.PICK_WOOD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PICK_WOOD], 3);
  this.craft_buttons[CRAFT.PICK_WOOD].id = CRAFT.PICK_WOOD;
  this.craft_buttons[CRAFT.COOKED_MEAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_COOKED_MEAT], 3);
  this.craft_buttons[CRAFT.COOKED_MEAT].id = CRAFT.COOKED_MEAT;
  this.craft_buttons[CRAFT.BIG_FIRE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BIG_FIRE], 3);
  this.craft_buttons[CRAFT.BIG_FIRE].id = CRAFT.BIG_FIRE;
  this.craft_buttons[CRAFT.BANDAGE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BANDAGE], 3);
  this.craft_buttons[CRAFT.BANDAGE].id = CRAFT.BANDAGE;
  this.craft_buttons[CRAFT.STONE_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_WALL], 3);
  this.craft_buttons[CRAFT.STONE_WALL].id = CRAFT.STONE_WALL;
  this.craft_buttons[CRAFT.GOLD_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_WALL], 3);
  this.craft_buttons[CRAFT.GOLD_WALL].id = CRAFT.GOLD_WALL;
  this.craft_buttons[CRAFT.DIAMOND_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_WALL], 3);
  this.craft_buttons[CRAFT.DIAMOND_WALL].id = CRAFT.DIAMOND_WALL;
  this.craft_buttons[CRAFT.WOOD_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DOOR_WOOD_CLOSE], 3);
  this.craft_buttons[CRAFT.WOOD_DOOR].id = CRAFT.WOOD_DOOR;
  this.craft_buttons[CRAFT.CHEST] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CHEST], 3);
  this.craft_buttons[CRAFT.CHEST].id = CRAFT.CHEST;
  this.craft_buttons[CRAFT.STONE_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_SPIKE], 3);
  this.craft_buttons[CRAFT.STONE_SPIKE].id = CRAFT.STONE_SPIKE;
  this.craft_buttons[CRAFT.GOLD_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_SPIKE], 3);
  this.craft_buttons[CRAFT.GOLD_SPIKE].id = CRAFT.GOLD_SPIKE;
  this.craft_buttons[CRAFT.DIAMOND_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_SPIKE], 3);
  this.craft_buttons[CRAFT.DIAMOND_SPIKE].id = CRAFT.DIAMOND_SPIKE;
  this.craft_buttons[CRAFT.BAG] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BAG], 3);
  this.craft_buttons[CRAFT.BAG].id = CRAFT.BAG;
  this.craft_buttons[CRAFT.EARMUFFS] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EARMUFFS], 3);
  this.craft_buttons[CRAFT.EARMUFFS].id = CRAFT.EARMUFFS;
  this.craft_buttons[CRAFT.STONE_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DOOR_STONE_CLOSE], 3);
  this.craft_buttons[CRAFT.STONE_DOOR].id = CRAFT.STONE_DOOR;
  this.craft_buttons[CRAFT.GOLD_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DOOR_GOLD_CLOSE], 3);
  this.craft_buttons[CRAFT.GOLD_DOOR].id = CRAFT.GOLD_DOOR;
  this.craft_buttons[CRAFT.DIAMOND_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DOOR_DIAMOND_CLOSE], 3);
  this.craft_buttons[CRAFT.DIAMOND_DOOR].id = CRAFT.DIAMOND_DOOR;
  this.craft_buttons[CRAFT.EARMUFFS] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EARMUFFS], 3);
  this.craft_buttons[CRAFT.EARMUFFS].id = CRAFT.EARMUFFS;
  this.craft_buttons[CRAFT.COAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_COAT], 3);
  this.craft_buttons[CRAFT.COAT].id = CRAFT.COAT;
  this.craft_buttons[CRAFT.WOOD_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_SPEAR], 3);
  this.craft_buttons[CRAFT.WOOD_SPEAR].id = CRAFT.WOOD_SPEAR;
  this.craft_buttons[CRAFT.SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SPEAR], 3);
  this.craft_buttons[CRAFT.SPEAR].id = CRAFT.SPEAR;
  this.craft_buttons[CRAFT.GOLD_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_SPEAR], 3);
  this.craft_buttons[CRAFT.GOLD_SPEAR].id = CRAFT.GOLD_SPEAR;
  this.craft_buttons[CRAFT.DIAMOND_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_SPEAR], 3);
  this.craft_buttons[CRAFT.DIAMOND_SPEAR].id = CRAFT.DIAMOND_SPEAR;
  this.craft_buttons[CRAFT.DRAGON_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DRAGON_SPEAR], 3);
  this.craft_buttons[CRAFT.DRAGON_SPEAR].id = CRAFT.DRAGON_SPEAR;
  this.craft_buttons[CRAFT.FURNACE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_FURNACE], 3);
  this.craft_buttons[CRAFT.FURNACE].id = CRAFT.FURNACE;
  this.craft_buttons[CRAFT.EXPLORER_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EXPLORER_HAT], 3);
  this.craft_buttons[CRAFT.EXPLORER_HAT].id = CRAFT.EXPLORER_HAT;
  this.craft_buttons[CRAFT.PIRATE_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PIRATE_HAT], 3);
  this.craft_buttons[CRAFT.PIRATE_HAT].id = CRAFT.PIRATE_HAT;
  this.craft_buttons[CRAFT.FLOWER_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_FLOWER_HAT], 3);
  this.craft_buttons[CRAFT.FLOWER_HAT].id = CRAFT.FLOWER_HAT;
  this.craft_buttons[CRAFT.FUR_HAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_FUR_HAT], 3);
  this.craft_buttons[CRAFT.FUR_HAT].id = CRAFT.FUR_HAT;
  this.craft_buttons[CRAFT.TURBAN1] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_TURBAN1], 3);
  this.craft_buttons[CRAFT.TURBAN1].id = CRAFT.TURBAN1;
  this.craft_buttons[CRAFT.TURBAN2] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_TURBAN2], 3);
  this.craft_buttons[CRAFT.TURBAN2].id = CRAFT.TURBAN2;
  this.craft_buttons[CRAFT.WOOD_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_BOW], 3);
  this.craft_buttons[CRAFT.WOOD_BOW].id = CRAFT.WOOD_BOW;
  this.craft_buttons[CRAFT.WOOD_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_ARROW], 3);
  this.craft_buttons[CRAFT.WOOD_ARROW].id = CRAFT.WOOD_ARROW;
  this.craft_buttons[CRAFT.WOOD_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_SHIELD], 3);
  this.craft_buttons[CRAFT.WOOD_SHIELD].id = CRAFT.WOOD_SHIELD;
  this.craft_buttons[CRAFT.STONE_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_BOW], 3);
  this.craft_buttons[CRAFT.STONE_BOW].id = CRAFT.STONE_BOW;
  this.craft_buttons[CRAFT.STONE_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_ARROW], 3);
  this.craft_buttons[CRAFT.STONE_ARROW].id = CRAFT.STONE_ARROW;
  this.craft_buttons[CRAFT.STONE_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_SHIELD], 3);
  this.craft_buttons[CRAFT.STONE_SHIELD].id = CRAFT.STONE_SHIELD;
  this.craft_buttons[CRAFT.GOLD_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_BOW], 3);
  this.craft_buttons[CRAFT.GOLD_BOW].id = CRAFT.GOLD_BOW;
  this.craft_buttons[CRAFT.GOLD_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_ARROW], 3);
  this.craft_buttons[CRAFT.GOLD_ARROW].id = CRAFT.GOLD_ARROW;
  this.craft_buttons[CRAFT.GOLD_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_SHIELD], 3);
  this.craft_buttons[CRAFT.GOLD_SHIELD].id = CRAFT.GOLD_SHIELD;
  this.craft_buttons[CRAFT.DIAMOND_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_BOW], 3);
  this.craft_buttons[CRAFT.DIAMOND_BOW].id = CRAFT.DIAMOND_BOW;
  this.craft_buttons[CRAFT.DIAMOND_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_ARROW], 3);
  this.craft_buttons[CRAFT.DIAMOND_ARROW].id = CRAFT.DIAMOND_ARROW;
  this.craft_buttons[CRAFT.DIAMOND_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_SHIELD], 3);
  this.craft_buttons[CRAFT.DIAMOND_SHIELD].id = CRAFT.DIAMOND_SHIELD;
  this.craft_buttons[CRAFT.AMETHYST_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_BOW], 3);
  this.craft_buttons[CRAFT.AMETHYST_BOW].id = CRAFT.AMETHYST_BOW;
  this.craft_buttons[CRAFT.AMETHYST_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_ARROW], 3);
  this.craft_buttons[CRAFT.AMETHYST_ARROW].id = CRAFT.AMETHYST_ARROW;
  this.craft_buttons[CRAFT.AMETHYST_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_SHIELD], 3);
  this.craft_buttons[CRAFT.AMETHYST_SHIELD].id = CRAFT.AMETHYST_SHIELD;
  this.craft_buttons[CRAFT.REIDITE_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_BOW], 3);
  this.craft_buttons[CRAFT.REIDITE_BOW].id = CRAFT.REIDITE_BOW;
  this.craft_buttons[CRAFT.REIDITE_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_ARROW], 3);
  this.craft_buttons[CRAFT.REIDITE_ARROW].id = CRAFT.REIDITE_ARROW;
  this.craft_buttons[CRAFT.REIDITE_SHIELD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_SHIELD], 3);
  this.craft_buttons[CRAFT.REIDITE_SHIELD].id = CRAFT.REIDITE_SHIELD;
  this.craft_buttons[CRAFT.DRAGON_BOW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DRAGON_BOW], 3);
  this.craft_buttons[CRAFT.DRAGON_BOW].id = CRAFT.DRAGON_BOW;
  this.craft_buttons[CRAFT.DRAGON_ARROW] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DRAGON_ARROW], 3);
  this.craft_buttons[CRAFT.DRAGON_ARROW].id = CRAFT.DRAGON_ARROW;
  this.craft_buttons[CRAFT.WOOD_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_HELMET], 3);
  this.craft_buttons[CRAFT.WOOD_HELMET].id = CRAFT.WOOD_HELMET;
  this.craft_buttons[CRAFT.STONE_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_HELMET], 3);
  this.craft_buttons[CRAFT.STONE_HELMET].id = CRAFT.STONE_HELMET;
  this.craft_buttons[CRAFT.GOLD_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_HELMET], 3);
  this.craft_buttons[CRAFT.GOLD_HELMET].id = CRAFT.GOLD_HELMET;
  this.craft_buttons[CRAFT.DIAMOND_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_HELMET], 3);
  this.craft_buttons[CRAFT.DIAMOND_HELMET].id = CRAFT.DIAMOND_HELMET;
  this.craft_buttons[CRAFT.BOOK] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BOOK], 3);
  this.craft_buttons[CRAFT.BOOK].id = CRAFT.BOOK;
  this.craft_buttons[CRAFT.PAPER] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PAPER], 3);
  this.craft_buttons[CRAFT.PAPER].id = CRAFT.PAPER;
  this.craft_buttons[CRAFT.BAG] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BAG], 3);
  this.craft_buttons[CRAFT.BAG].id = CRAFT.BAG;
  this.craft_buttons[CRAFT.SWORD_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SWORD_AMETHYST], 3);
  this.craft_buttons[CRAFT.SWORD_AMETHYST].id = CRAFT.SWORD_AMETHYST;
  this.craft_buttons[CRAFT.PIRATE_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PIRATE_SWORD], 3);
  this.craft_buttons[CRAFT.PIRATE_SWORD].id = CRAFT.PIRATE_SWORD;
  this.craft_buttons[CRAFT.PICK_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PICK_AMETHYST], 3);
  this.craft_buttons[CRAFT.PICK_AMETHYST].id = CRAFT.PICK_AMETHYST;
  this.craft_buttons[CRAFT.PICK_REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PICK_REIDITE], 3);
  this.craft_buttons[CRAFT.PICK_REIDITE].id = CRAFT.PICK_REIDITE;
  this.craft_buttons[CRAFT.AMETHYST_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_SPEAR], 3);
  this.craft_buttons[CRAFT.AMETHYST_SPEAR].id = CRAFT.AMETHYST_SPEAR;
  this.craft_buttons[CRAFT.HAMMER] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_HAMMER], 3);
  this.craft_buttons[CRAFT.HAMMER].id = CRAFT.HAMMER;
  this.craft_buttons[CRAFT.HAMMER_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_HAMMER_GOLD], 3);
  this.craft_buttons[CRAFT.HAMMER_GOLD].id = CRAFT.HAMMER_GOLD;
  this.craft_buttons[CRAFT.HAMMER_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_HAMMER_DIAMOND], 3);
  this.craft_buttons[CRAFT.HAMMER_DIAMOND].id = CRAFT.HAMMER_DIAMOND;
  this.craft_buttons[CRAFT.HAMMER_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_HAMMER_AMETHYST], 3);
  this.craft_buttons[CRAFT.HAMMER_AMETHYST].id = CRAFT.HAMMER_AMETHYST;
  this.craft_buttons[CRAFT.HAMMER_REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_HAMMER_REIDITE], 3);
  this.craft_buttons[CRAFT.HAMMER_REIDITE].id = CRAFT.HAMMER_REIDITE;
  this.craft_buttons[CRAFT.AMETHYST_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_WALL], 3);
  this.craft_buttons[CRAFT.AMETHYST_WALL].id = CRAFT.AMETHYST_WALL;
  this.craft_buttons[CRAFT.AMETHYST_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_SPIKE], 3);
  this.craft_buttons[CRAFT.AMETHYST_SPIKE].id = CRAFT.AMETHYST_SPIKE;
  this.craft_buttons[CRAFT.AMETHYST_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DOOR_AMETHYST_CLOSE], 3);
  this.craft_buttons[CRAFT.AMETHYST_DOOR].id = CRAFT.AMETHYST_DOOR;
  this.craft_buttons[CRAFT.CAP_SCARF] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CAP_SCARF], 3);
  this.craft_buttons[CRAFT.CAP_SCARF].id = CRAFT.CAP_SCARF;
  this.craft_buttons[CRAFT.BLUE_CORD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BLUE_CORD], 3);
  this.craft_buttons[CRAFT.BLUE_CORD].id = CRAFT.BLUE_CORD;
  this.craft_buttons[CRAFT.LOCK] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_LOCK], 3);
  this.craft_buttons[CRAFT.LOCK].id = CRAFT.LOCK;
  this.craft_buttons[CRAFT.RESURRECTION] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_RESURRECTION], 3);
  this.craft_buttons[CRAFT.RESURRECTION].id = CRAFT.RESURRECTION;
  this.craft_buttons[CRAFT.LOCKPICK] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_LOCKPICK], 3);
  this.craft_buttons[CRAFT.LOCKPICK].id = CRAFT.LOCKPICK;
  this.craft_buttons[CRAFT.TOTEM] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_TOTEM], 3);
  this.craft_buttons[CRAFT.TOTEM].id = CRAFT.TOTEM;
  this.craft_buttons[CRAFT.AMETHYST_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_HELMET], 3);
  this.craft_buttons[CRAFT.AMETHYST_HELMET].id = CRAFT.AMETHYST_HELMET;
  this.craft_buttons[CRAFT.SUPER_HAMMER] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SUPER_HAMMER], 3);
  this.craft_buttons[CRAFT.SUPER_HAMMER].id = CRAFT.SUPER_HAMMER;
  this.craft_buttons[CRAFT.BRIDGE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BRIDGE], 3);
  this.craft_buttons[CRAFT.BRIDGE].id = CRAFT.BRIDGE;
  this.craft_buttons[CRAFT.WOOD_TOWER] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_TOWER], 3);
  this.craft_buttons[CRAFT.WOOD_TOWER].id = CRAFT.WOOD_TOWER;
  this.craft_buttons[CRAFT.BOAT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BOAT], 3);
  this.craft_buttons[CRAFT.BOAT].id = CRAFT.BOAT;
  this.craft_buttons[CRAFT.SLED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SLED], 3);
  this.craft_buttons[CRAFT.SLED].id = CRAFT.SLED;
  this.craft_buttons[CRAFT.PLANE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PLANE], 3);
  this.craft_buttons[CRAFT.PLANE].id = CRAFT.PLANE;
  this.craft_buttons[CRAFT.SADDLE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SADDLE], 3);
  this.craft_buttons[CRAFT.SADDLE].id = CRAFT.SADDLE;
  this.craft_buttons[CRAFT.MOUNT_BOAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_MOUNT_BOAR], 3);
  this.craft_buttons[CRAFT.MOUNT_BOAR].id = CRAFT.MOUNT_BOAR;
  this.craft_buttons[CRAFT.BABY_DRAGON] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BABY_DRAGON], 3);
  this.craft_buttons[CRAFT.BABY_DRAGON].id = CRAFT.BABY_DRAGON;
  this.craft_buttons[CRAFT.BABY_MAMMOTH] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BABY_MAMMOTH], 3);
  this.craft_buttons[CRAFT.BABY_MAMMOTH].id = CRAFT.BABY_MAMMOTH;
  this.craft_buttons[CRAFT.CRAB_BOSS] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CRAB_BOSS], 3);
  this.craft_buttons[CRAFT.CRAB_BOSS].id = CRAFT.CRAB_BOSS;
  this.craft_buttons[CRAFT.BOTTLE_EMPTY] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BOTTLE_EMPTY], 3);
  this.craft_buttons[CRAFT.BOTTLE_EMPTY].id = CRAFT.BOTTLE_EMPTY;
  this.craft_buttons[CRAFT.BOTTLE_FULL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BOTTLE_FULL], 3);
  this.craft_buttons[CRAFT.BOTTLE_FULL].id = CRAFT.BOTTLE_FULL;
  this.craft_buttons[CRAFT.BOTTLE_FULL_2] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BOTTLE_FULL], 3);
  this.craft_buttons[CRAFT.BOTTLE_FULL_2].id = CRAFT.BOTTLE_FULL_2;
  this.craft_buttons[CRAFT.BOTTLE_FULL_3] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BOTTLE_FULL], 3);
  this.craft_buttons[CRAFT.BOTTLE_FULL_3].id = CRAFT.BOTTLE_FULL_3;
  this.craft_buttons[CRAFT.SHOVEL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SHOVEL], 3);
  this.craft_buttons[CRAFT.SHOVEL].id = CRAFT.SHOVEL;
  this.craft_buttons[CRAFT.SHOVEL_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SHOVEL_GOLD], 3);
  this.craft_buttons[CRAFT.SHOVEL_GOLD].id = CRAFT.SHOVEL_GOLD;
  this.craft_buttons[CRAFT.SHOVEL_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SHOVEL_DIAMOND], 3);
  this.craft_buttons[CRAFT.SHOVEL_DIAMOND].id = CRAFT.SHOVEL_DIAMOND;
  this.craft_buttons[CRAFT.SHOVEL_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SHOVEL_AMETHYST], 3);
  this.craft_buttons[CRAFT.SHOVEL_AMETHYST].id = CRAFT.SHOVEL_AMETHYST;
  this.craft_buttons[CRAFT.SPANNER] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SPANNER], 3);
  this.craft_buttons[CRAFT.SPANNER].id = CRAFT.SPANNER;
  this.craft_buttons[CRAFT.WATERING_CAN] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WATERING_CAN], 3);
  this.craft_buttons[CRAFT.WATERING_CAN].id = CRAFT.WATERING_CAN;
  this.craft_buttons[CRAFT.WHEAT_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WHEAT_SEED], 3);
  this.craft_buttons[CRAFT.WHEAT_SEED].id = CRAFT.WHEAT_SEED;
  this.craft_buttons[CRAFT.COOKIE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_COOKIE], 3);
  this.craft_buttons[CRAFT.COOKIE].id = CRAFT.COOKIE;
  this.craft_buttons[CRAFT.WINDMILL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WINDMILL], 3);
  this.craft_buttons[CRAFT.WINDMILL].id = CRAFT.WINDMILL;
  this.craft_buttons[CRAFT.SUPER_DIVING_SUIT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SUPER_DIVING_SUIT], 3);
  this.craft_buttons[CRAFT.SUPER_DIVING_SUIT].id = CRAFT.SUPER_DIVING_SUIT;
  this.craft_buttons[CRAFT.DIVING_MASK] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIVING_MASK], 3);
  this.craft_buttons[CRAFT.DIVING_MASK].id = CRAFT.DIVING_MASK;
  this.craft_buttons[CRAFT.WATERING_CAN_FULL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WATERING_CAN_FULL], 3);
  this.craft_buttons[CRAFT.WATERING_CAN_FULL].id = CRAFT.WATERING_CAN_FULL;
  this.craft_buttons[CRAFT.CAKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CAKE], 3);
  this.craft_buttons[CRAFT.CAKE].id = CRAFT.CAKE;
  this.craft_buttons[CRAFT.BREAD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BREAD], 3);
  this.craft_buttons[CRAFT.BREAD].id = CRAFT.BREAD;
  this.craft_buttons[CRAFT.FOODFISH_COOKED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_FOODFISH_COOKED], 3);
  this.craft_buttons[CRAFT.FOODFISH_COOKED].id = CRAFT.FOODFISH_COOKED;
  this.craft_buttons[CRAFT.PLOT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PLOT], 3);
  this.craft_buttons[CRAFT.PLOT].id = CRAFT.PLOT;
  this.craft_buttons[CRAFT.BREAD_OVEN] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BREAD_OVEN], 3);
  this.craft_buttons[CRAFT.BREAD_OVEN].id = CRAFT.BREAD_OVEN;
  this.craft_buttons[CRAFT.SANDWICH] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SANDWICH], 3);
  this.craft_buttons[CRAFT.SANDWICH].id = CRAFT.SANDWICH;
  this.craft_buttons[CRAFT.DRAGON_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DRAGON_HELMET], 3);
  this.craft_buttons[CRAFT.DRAGON_HELMET].id = CRAFT.DRAGON_HELMET;
  this.craft_buttons[CRAFT.DRAGON_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DRAGON_SWORD], 3);
  this.craft_buttons[CRAFT.DRAGON_SWORD].id = CRAFT.DRAGON_SWORD;
  this.craft_buttons[CRAFT.CROWN_GREEN] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CROWN_GREEN], 3);
  this.craft_buttons[CRAFT.CROWN_GREEN].id = CRAFT.CROWN_GREEN;
  this.craft_buttons[CRAFT.CROWN_ORANGE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CROWN_ORANGE], 3);
  this.craft_buttons[CRAFT.CROWN_ORANGE].id = CRAFT.CROWN_ORANGE;
  this.craft_buttons[CRAFT.CROWN_BLUE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CROWN_BLUE], 3);
  this.craft_buttons[CRAFT.CROWN_BLUE].id = CRAFT.CROWN_BLUE;
  this.craft_buttons[CRAFT.HOOD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_HOOD], 3);
  this.craft_buttons[CRAFT.HOOD].id = CRAFT.HOOD;
  this.craft_buttons[CRAFT.PEASANT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PEASANT], 3);
  this.craft_buttons[CRAFT.PEASANT].id = CRAFT.PEASANT;
  this.craft_buttons[CRAFT.WINTER_PEASANT] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WINTER_PEASANT], 3);
  this.craft_buttons[CRAFT.WINTER_PEASANT].id = CRAFT.WINTER_PEASANT;
  this.craft_buttons[CRAFT.WINTER_HOOD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WINTER_HOOD], 3);
  this.craft_buttons[CRAFT.WINTER_HOOD].id = CRAFT.WINTER_HOOD;
  this.craft_buttons[CRAFT.BUCKET_FULL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BUCKET_FULL], 3);
  this.craft_buttons[CRAFT.BUCKET_FULL].id = CRAFT.BUCKET_FULL;
  this.craft_buttons[CRAFT.BUCKET_EMPTY] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BUCKET_EMPTY], 3);
  this.craft_buttons[CRAFT.BUCKET_EMPTY].id = CRAFT.BUCKET_EMPTY;
  this.craft_buttons[CRAFT.WELL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WELL], 3);
  this.craft_buttons[CRAFT.WELL].id = CRAFT.WELL;
  this.craft_buttons[CRAFT.SIGN] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_SIGN], 3);
  this.craft_buttons[CRAFT.SIGN].id = CRAFT.SIGN;
  this.craft_buttons[CRAFT.PUMPKIN_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PUMPKIN_SEED], 3);
  this.craft_buttons[CRAFT.PUMPKIN_SEED].id = CRAFT.PUMPKIN_SEED;
  this.craft_buttons[CRAFT.GARLIC_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GARLIC_SEED], 3);
  this.craft_buttons[CRAFT.GARLIC_SEED].id = CRAFT.GARLIC_SEED;
  this.craft_buttons[CRAFT.ROOF] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_ROOF], 3);
  this.craft_buttons[CRAFT.ROOF].id = CRAFT.ROOF;
  this.craft_buttons[CRAFT.THORNBUSH_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_THORNBUSH_SEED], 3);
  this.craft_buttons[CRAFT.THORNBUSH_SEED].id = CRAFT.THORNBUSH_SEED;
  this.craft_buttons[CRAFT.TOMATO_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_TOMATO_SEED], 3);
  this.craft_buttons[CRAFT.TOMATO_SEED].id = CRAFT.TOMATO_SEED;
  this.craft_buttons[CRAFT.CARROT_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CARROT_SEED], 3);
  this.craft_buttons[CRAFT.CARROT_SEED].id = CRAFT.CARROT_SEED;
  this.craft_buttons[CRAFT.WATERMELON_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WATERMELON_SEED], 3);
  this.craft_buttons[CRAFT.WATERMELON_SEED].id = CRAFT.WATERMELON_SEED;
  this.craft_buttons[CRAFT.ALOE_VERA_SEED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_ALOE_VERA_SEED], 3);
  this.craft_buttons[CRAFT.ALOE_VERA_SEED].id = CRAFT.ALOE_VERA_SEED;
  this.craft_buttons[CRAFT.WOOD_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_SPEAR], 3);
  this.craft_buttons[CRAFT.WOOD_SPEAR].id = CRAFT.WOOD_SPEAR;
  this.craft_buttons[CRAFT.DRAGON_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DRAGON_SPEAR], 3);
  this.craft_buttons[CRAFT.DRAGON_SPEAR].id = CRAFT.DRAGON_SPEAR;
  this.craft_buttons[CRAFT.CRAB_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CRAB_SPEAR], 3);
  this.craft_buttons[CRAFT.CRAB_SPEAR].id = CRAFT.CRAB_SPEAR;
  this.craft_buttons[CRAFT.BED] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_BED], 3);
  this.craft_buttons[CRAFT.BED].id = CRAFT.BED;
  this.craft_buttons[CRAFT.CROWN_CRAB] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_CROWN_CRAB], 3);
  this.craft_buttons[CRAFT.CROWN_CRAB].id = CRAFT.CROWN_CRAB;
  this.chest_buttons[INV.PITCHFORK] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PITCHFORK], 3);
  this.chest_buttons[INV.PITCHFORK].id = INV.PITCHFORK;
  this.inv_buttons[INV.PITCHFORK] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PITCHFORK], 3);
  this.inv_buttons[INV.PITCHFORK].id = INV.PITCHFORK;
  this.craft_buttons[CRAFT.PITCHFORK] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PITCHFORK], 3);
  this.craft_buttons[CRAFT.PITCHFORK].id = CRAFT.PITCHFORK;
  this.chest_buttons[INV.PITCHFORK2] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PITCHFORK2], 3);
  this.chest_buttons[INV.PITCHFORK2].id = INV.PITCHFORK2;
  this.inv_buttons[INV.PITCHFORK2] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PITCHFORK2], 3);
  this.inv_buttons[INV.PITCHFORK2].id = INV.PITCHFORK2;
  this.craft_buttons[CRAFT.PITCHFORK2] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PITCHFORK2], 3);
  this.craft_buttons[CRAFT.PITCHFORK2].id = CRAFT.PITCHFORK2;
  this.chest_buttons[INV.MACHETE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_MACHETE], 3);
  this.chest_buttons[INV.MACHETE].id = INV.MACHETE;
  this.inv_buttons[INV.MACHETE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_MACHETE], 3);
  this.inv_buttons[INV.MACHETE].id = INV.MACHETE;
  this.craft_buttons[CRAFT.MACHETE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_MACHETE], 3);
  this.craft_buttons[CRAFT.MACHETE].id = CRAFT.MACHETE;
  this.chest_buttons[INV.PILOT_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PILOT_HELMET], 3);
  this.chest_buttons[INV.PILOT_HELMET].id = INV.PILOT_HELMET;
  this.inv_buttons[INV.PILOT_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PILOT_HELMET], 3);
  this.inv_buttons[INV.PILOT_HELMET].id = INV.PILOT_HELMET;
  this.craft_buttons[CRAFT.PILOT_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_PILOT_HELMET], 3);
  this.craft_buttons[CRAFT.PILOT_HELMET].id = CRAFT.PILOT_HELMET;
  this.chest_buttons[INV.PITCHFORK_PART] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PITCHFORK_PART], 3);
  this.chest_buttons[INV.PITCHFORK_PART].id = INV.PITCHFORK_PART;
  this.inv_buttons[INV.PITCHFORK_PART] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PITCHFORK_PART], 3);
  this.inv_buttons[INV.PITCHFORK_PART].id = INV.PITCHFORK_PART;
  this.chest_buttons[INV.SANDWORM_JUICE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_SANDWORM_JUICE], 3);
  this.chest_buttons[INV.SANDWORM_JUICE].id = INV.SANDWORM_JUICE;
  this.inv_buttons[INV.SANDWORM_JUICE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_SANDWORM_JUICE], 3);
  this.inv_buttons[INV.SANDWORM_JUICE].id = INV.SANDWORM_JUICE;
  this.chest_buttons[INV.PILOT_GLASSES] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_PILOT_GLASSES], 3);
  this.chest_buttons[INV.PILOT_GLASSES].id = INV.PILOT_GLASSES;
  this.inv_buttons[INV.PILOT_GLASSES] = gui_create_button(60, 60, "", sprite[SPRITE.INV_PILOT_GLASSES], 3);
  this.inv_buttons[INV.PILOT_GLASSES].id = INV.PILOT_GLASSES;
  this.chest_buttons[INV.EMERALD_MACHINE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EMERALD_MACHINE], 3);
  this.chest_buttons[INV.EMERALD_MACHINE].id = INV.EMERALD_MACHINE;
  this.inv_buttons[INV.EMERALD_MACHINE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EMERALD_MACHINE], 3);
  this.inv_buttons[INV.EMERALD_MACHINE].id = INV.EMERALD_MACHINE;
  this.craft_buttons[CRAFT.EMERALD_MACHINE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EMERALD_MACHINE], 3);
  this.craft_buttons[CRAFT.EMERALD_MACHINE].id = CRAFT.EMERALD_MACHINE;
  this.chest_buttons[INV.WOOD_DOOR_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WOOD_DOOR_SPIKE], 3);
  this.chest_buttons[INV.WOOD_DOOR_SPIKE].id = INV.WOOD_DOOR_SPIKE;
  this.inv_buttons[INV.WOOD_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WOOD_DOOR_SPIKE], 3);
  this.inv_buttons[INV.WOOD_DOOR_SPIKE].id = INV.WOOD_DOOR_SPIKE;
  this.craft_buttons[CRAFT.WOOD_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WOOD_DOOR_SPIKE], 3);
  this.craft_buttons[CRAFT.WOOD_DOOR_SPIKE].id = CRAFT.WOOD_DOOR_SPIKE;
  this.chest_buttons[INV.STONE_DOOR_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_STONE_DOOR_SPIKE], 3);
  this.chest_buttons[INV.STONE_DOOR_SPIKE].id = INV.STONE_DOOR_SPIKE;
  this.inv_buttons[INV.STONE_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_STONE_DOOR_SPIKE], 3);
  this.inv_buttons[INV.STONE_DOOR_SPIKE].id = INV.STONE_DOOR_SPIKE;
  this.craft_buttons[CRAFT.STONE_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_STONE_DOOR_SPIKE], 3);
  this.craft_buttons[CRAFT.STONE_DOOR_SPIKE].id = CRAFT.STONE_DOOR_SPIKE;
  this.chest_buttons[INV.GOLD_DOOR_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_GOLD_DOOR_SPIKE], 3);
  this.chest_buttons[INV.GOLD_DOOR_SPIKE].id = INV.GOLD_DOOR_SPIKE;
  this.inv_buttons[INV.GOLD_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_GOLD_DOOR_SPIKE], 3);
  this.inv_buttons[INV.GOLD_DOOR_SPIKE].id = INV.GOLD_DOOR_SPIKE;
  this.craft_buttons[CRAFT.GOLD_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_GOLD_DOOR_SPIKE], 3);
  this.craft_buttons[CRAFT.GOLD_DOOR_SPIKE].id = CRAFT.GOLD_DOOR_SPIKE;
  this.chest_buttons[INV.DIAMOND_DOOR_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_DOOR_SPIKE], 3);
  this.chest_buttons[INV.DIAMOND_DOOR_SPIKE].id = INV.DIAMOND_DOOR_SPIKE;
  this.inv_buttons[INV.DIAMOND_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_DOOR_SPIKE], 3);
  this.inv_buttons[INV.DIAMOND_DOOR_SPIKE].id = INV.DIAMOND_DOOR_SPIKE;
  this.craft_buttons[CRAFT.DIAMOND_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_DOOR_SPIKE], 3);
  this.craft_buttons[CRAFT.DIAMOND_DOOR_SPIKE].id = CRAFT.DIAMOND_DOOR_SPIKE;
  this.chest_buttons[INV.AMETHYST_DOOR_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_DOOR_SPIKE], 3);
  this.chest_buttons[INV.AMETHYST_DOOR_SPIKE].id = INV.AMETHYST_DOOR_SPIKE;
  this.inv_buttons[INV.AMETHYST_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_DOOR_SPIKE], 3);
  this.inv_buttons[INV.AMETHYST_DOOR_SPIKE].id = INV.AMETHYST_DOOR_SPIKE;
  this.craft_buttons[CRAFT.AMETHYST_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_DOOR_SPIKE], 3);
  this.craft_buttons[CRAFT.AMETHYST_DOOR_SPIKE].id = CRAFT.AMETHYST_DOOR_SPIKE;
  this.chest_buttons[INV.REIDITE_DOOR_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_DOOR_SPIKE], 3);
  this.chest_buttons[INV.REIDITE_DOOR_SPIKE].id = INV.REIDITE_DOOR_SPIKE;
  this.inv_buttons[INV.REIDITE_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_DOOR_SPIKE], 3);
  this.inv_buttons[INV.REIDITE_DOOR_SPIKE].id = INV.REIDITE_DOOR_SPIKE;
  this.craft_buttons[CRAFT.REIDITE_DOOR_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_DOOR_SPIKE], 3);
  this.craft_buttons[CRAFT.REIDITE_DOOR_SPIKE].id = CRAFT.REIDITE_DOOR_SPIKE;
  this.chest_buttons[INV.REIDITE_WALL] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_WALL], 3);
  this.chest_buttons[INV.REIDITE_WALL].id = INV.REIDITE_WALL;
  this.inv_buttons[INV.REIDITE_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_WALL], 3);
  this.inv_buttons[INV.REIDITE_WALL].id = INV.REIDITE_WALL;
  this.craft_buttons[CRAFT.REIDITE_WALL] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_WALL], 3);
  this.craft_buttons[CRAFT.REIDITE_WALL].id = CRAFT.REIDITE_WALL;
  this.chest_buttons[INV.REIDITE_SPIKE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_SPIKE], 3);
  this.chest_buttons[INV.REIDITE_SPIKE].id = INV.REIDITE_SPIKE;
  this.inv_buttons[INV.REIDITE_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_SPIKE], 3);
  this.inv_buttons[INV.REIDITE_SPIKE].id = INV.REIDITE_SPIKE;
  this.craft_buttons[CRAFT.REIDITE_SPIKE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_SPIKE], 3);
  this.craft_buttons[CRAFT.REIDITE_SPIKE].id = CRAFT.REIDITE_SPIKE;
  this.chest_buttons[INV.REIDITE_DOOR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_DOOR], 3);
  this.chest_buttons[INV.REIDITE_DOOR].id = INV.REIDITE_DOOR;
  this.inv_buttons[INV.REIDITE_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_DOOR], 3);
  this.inv_buttons[INV.REIDITE_DOOR].id = INV.REIDITE_DOOR;
  this.craft_buttons[CRAFT.REIDITE_DOOR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_DOOR], 3);
  this.craft_buttons[CRAFT.REIDITE_DOOR].id = CRAFT.REIDITE_DOOR;
  this.chest_buttons[INV.EXTRACTOR_MACHINE_STONE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_STONE], 3);
  this.chest_buttons[INV.EXTRACTOR_MACHINE_STONE].id = INV.EXTRACTOR_MACHINE_STONE;
  this.inv_buttons[INV.EXTRACTOR_MACHINE_STONE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EXTRACTOR_MACHINE_STONE], 3);
  this.inv_buttons[INV.EXTRACTOR_MACHINE_STONE].id = INV.EXTRACTOR_MACHINE_STONE;
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_STONE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_STONE], 3);
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_STONE].id = CRAFT.EXTRACTOR_MACHINE_STONE;
  this.chest_buttons[INV.EXTRACTOR_MACHINE_GOLD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_GOLD], 3);
  this.chest_buttons[INV.EXTRACTOR_MACHINE_GOLD].id = INV.EXTRACTOR_MACHINE_GOLD;
  this.inv_buttons[INV.EXTRACTOR_MACHINE_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EXTRACTOR_MACHINE_GOLD], 3);
  this.inv_buttons[INV.EXTRACTOR_MACHINE_GOLD].id = INV.EXTRACTOR_MACHINE_GOLD;
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_GOLD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_GOLD], 3);
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_GOLD].id = CRAFT.EXTRACTOR_MACHINE_GOLD;
  this.chest_buttons[INV.EXTRACTOR_MACHINE_DIAMOND] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_DIAMOND], 3);
  this.chest_buttons[INV.EXTRACTOR_MACHINE_DIAMOND].id = INV.EXTRACTOR_MACHINE_DIAMOND;
  this.inv_buttons[INV.EXTRACTOR_MACHINE_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EXTRACTOR_MACHINE_DIAMOND], 3);
  this.inv_buttons[INV.EXTRACTOR_MACHINE_DIAMOND].id = INV.EXTRACTOR_MACHINE_DIAMOND;
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_DIAMOND] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_DIAMOND], 3);
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_DIAMOND].id = CRAFT.EXTRACTOR_MACHINE_DIAMOND;
  this.chest_buttons[INV.EXTRACTOR_MACHINE_AMETHYST] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_AMETHYST], 3);
  this.chest_buttons[INV.EXTRACTOR_MACHINE_AMETHYST].id = INV.EXTRACTOR_MACHINE_AMETHYST;
  this.inv_buttons[INV.EXTRACTOR_MACHINE_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EXTRACTOR_MACHINE_AMETHYST], 3);
  this.inv_buttons[INV.EXTRACTOR_MACHINE_AMETHYST].id = INV.EXTRACTOR_MACHINE_AMETHYST;
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_AMETHYST] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_AMETHYST], 3);
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_AMETHYST].id = CRAFT.EXTRACTOR_MACHINE_AMETHYST;
  this.chest_buttons[INV.EXTRACTOR_MACHINE_REIDITE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EXTRACTOR_MACHINE_REIDITE], 3);
  this.chest_buttons[INV.EXTRACTOR_MACHINE_REIDITE].id = INV.EXTRACTOR_MACHINE_REIDITE;
  this.inv_buttons[INV.EXTRACTOR_MACHINE_REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EXTRACTOR_MACHINE_REIDITE], 3);
  this.inv_buttons[INV.EXTRACTOR_MACHINE_REIDITE].id = INV.EXTRACTOR_MACHINE_REIDITE;
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_EXTRACTOR_MACHINE_REIDITE], 3);
  this.craft_buttons[CRAFT.EXTRACTOR_MACHINE_REIDITE].id = CRAFT.EXTRACTOR_MACHINE_REIDITE;
  this.chest_buttons[INV.FLAME] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FLAME], 3);
  this.chest_buttons[INV.FLAME].id = INV.FLAME;
  this.inv_buttons[INV.FLAME] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FLAME], 3);
  this.inv_buttons[INV.FLAME].id = INV.FLAME;
  this.inv_buttons[INV.FLAME].info.img[2] = this.inv_buttons[INV.FLAME].info.img[0];
  this.chest_buttons[INV.LAVA_HEART] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_HEART], 3);
  this.chest_buttons[INV.LAVA_HEART].id = INV.LAVA_HEART;
  this.inv_buttons[INV.LAVA_HEART] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_HEART], 3);
  this.inv_buttons[INV.LAVA_HEART].id = INV.LAVA_HEART;
  this.inv_buttons[INV.LAVA_HEART].info.img[2] = this.inv_buttons[INV.LAVA_HEART].info.img[0];
  this.chest_buttons[INV.REIDITE] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE], 3);
  this.chest_buttons[INV.REIDITE].id = INV.REIDITE;
  this.inv_buttons[INV.REIDITE] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE], 3);
  this.inv_buttons[INV.REIDITE].id = INV.REIDITE;
  this.inv_buttons[INV.REIDITE].info.img[2] = this.inv_buttons[INV.REIDITE].info.img[0];
  this.chest_buttons[INV.REIDITE_SWORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_SWORD], 3);
  this.chest_buttons[INV.REIDITE_SWORD].id = INV.REIDITE_SWORD;
  this.inv_buttons[INV.REIDITE_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_SWORD], 3);
  this.inv_buttons[INV.REIDITE_SWORD].id = INV.REIDITE_SWORD;
  this.craft_buttons[CRAFT.REIDITE_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_SWORD], 3);
  this.craft_buttons[CRAFT.REIDITE_SWORD].id = CRAFT.REIDITE_SWORD;
  this.chest_buttons[INV.DIAMOND_PROTECTION] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_DIAMOND_PROTECTION], 3);
  this.chest_buttons[INV.DIAMOND_PROTECTION].id = INV.DIAMOND_PROTECTION;
  this.inv_buttons[INV.DIAMOND_PROTECTION] = gui_create_button(60, 60, "", sprite[SPRITE.INV_DIAMOND_PROTECTION], 3);
  this.inv_buttons[INV.DIAMOND_PROTECTION].id = INV.DIAMOND_PROTECTION;
  this.craft_buttons[CRAFT.DIAMOND_PROTECTION] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_DIAMOND_PROTECTION], 3);
  this.craft_buttons[CRAFT.DIAMOND_PROTECTION].id = CRAFT.DIAMOND_PROTECTION;
  this.chest_buttons[INV.AMETHYST_PROTECTION] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_AMETHYST_PROTECTION], 3);
  this.chest_buttons[INV.AMETHYST_PROTECTION].id = INV.AMETHYST_PROTECTION;
  this.inv_buttons[INV.AMETHYST_PROTECTION] = gui_create_button(60, 60, "", sprite[SPRITE.INV_AMETHYST_PROTECTION], 3);
  this.inv_buttons[INV.AMETHYST_PROTECTION].id = INV.AMETHYST_PROTECTION;
  this.craft_buttons[CRAFT.AMETHYST_PROTECTION] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_AMETHYST_PROTECTION], 3);
  this.craft_buttons[CRAFT.AMETHYST_PROTECTION].id = CRAFT.AMETHYST_PROTECTION;
  this.chest_buttons[INV.REIDITE_PROTECTION] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_PROTECTION], 3);
  this.chest_buttons[INV.REIDITE_PROTECTION].id = INV.REIDITE_PROTECTION;
  this.inv_buttons[INV.REIDITE_PROTECTION] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_PROTECTION], 3);
  this.inv_buttons[INV.REIDITE_PROTECTION].id = INV.REIDITE_PROTECTION;
  this.craft_buttons[CRAFT.REIDITE_PROTECTION] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_PROTECTION], 3);
  this.craft_buttons[CRAFT.REIDITE_PROTECTION].id = CRAFT.REIDITE_PROTECTION;
  this.chest_buttons[INV.LAVA_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_HELMET], 3);
  this.chest_buttons[INV.LAVA_HELMET].id = INV.LAVA_HELMET;
  this.inv_buttons[INV.LAVA_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_HELMET], 3);
  this.inv_buttons[INV.LAVA_HELMET].id = INV.LAVA_HELMET;
  this.craft_buttons[CRAFT.LAVA_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_LAVA_HELMET], 3);
  this.craft_buttons[CRAFT.LAVA_HELMET].id = CRAFT.LAVA_HELMET;
  this.chest_buttons[INV.WITCH] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WITCH], 3);
  this.chest_buttons[INV.WITCH].id = INV.WITCH;
  this.inv_buttons[INV.WITCH] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WITCH], 3);
  this.inv_buttons[INV.WITCH].id = INV.WITCH;
  this.craft_buttons[CRAFT.WITCH] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WITCH], 3);
  this.craft_buttons[CRAFT.WITCH].id = CRAFT.WITCH;
  this.chest_buttons[INV.WAND1] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WAND1], 3);
  this.chest_buttons[INV.WAND1].id = INV.WAND1;
  this.inv_buttons[INV.WAND1] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WAND1], 3);
  this.inv_buttons[INV.WAND1].id = INV.WAND1;
  this.craft_buttons[CRAFT.WAND1] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WAND1], 3);
  this.craft_buttons[CRAFT.WAND1].id = CRAFT.WAND1;
  this.chest_buttons[INV.WAND2] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_WAND2], 3);
  this.chest_buttons[INV.WAND2].id = INV.WAND2;
  this.inv_buttons[INV.WAND2] = gui_create_button(60, 60, "", sprite[SPRITE.INV_WAND2], 3);
  this.inv_buttons[INV.WAND2].id = INV.WAND2;
  this.craft_buttons[CRAFT.WAND2] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_WAND2], 3);
  this.craft_buttons[CRAFT.WAND2].id = CRAFT.WAND2;
  this.chest_buttons[INV.NIMBUS] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_NIMBUS], 3);
  this.chest_buttons[INV.NIMBUS].id = INV.NIMBUS;
  this.inv_buttons[INV.NIMBUS] = gui_create_button(60, 60, "", sprite[SPRITE.INV_NIMBUS], 3);
  this.inv_buttons[INV.NIMBUS].id = INV.NIMBUS;
  this.craft_buttons[CRAFT.NIMBUS] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_NIMBUS], 3);
  this.craft_buttons[CRAFT.NIMBUS].id = CRAFT.NIMBUS;
  this.chest_buttons[INV.FIREFLY] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_FIREFLY], 3);
  this.chest_buttons[INV.FIREFLY].id = INV.FIREFLY;
  this.inv_buttons[INV.FIREFLY] = gui_create_button(60, 60, "", sprite[SPRITE.INV_FIREFLY], 3);
  this.inv_buttons[INV.FIREFLY].id = INV.FIREFLY;
  this.craft_buttons[CRAFT.FIREFLY] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_FIREFLY], 3);
  this.craft_buttons[CRAFT.FIREFLY].id = CRAFT.FIREFLY;
  this.chest_buttons[INV.REIDITE_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_SPEAR], 3);
  this.chest_buttons[INV.REIDITE_SPEAR].id = INV.REIDITE_SPEAR;
  this.inv_buttons[INV.REIDITE_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_SPEAR], 3);
  this.inv_buttons[INV.REIDITE_SPEAR].id = INV.REIDITE_SPEAR;
  this.craft_buttons[CRAFT.REIDITE_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_SPEAR], 3);
  this.craft_buttons[CRAFT.REIDITE_SPEAR].id = CRAFT.REIDITE_SPEAR;
  this.chest_buttons[INV.REIDITE_HELMET] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_REIDITE_HELMET], 3);
  this.chest_buttons[INV.REIDITE_HELMET].id = INV.REIDITE_HELMET;
  this.inv_buttons[INV.REIDITE_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.INV_REIDITE_HELMET], 3);
  this.inv_buttons[INV.REIDITE_HELMET].id = INV.REIDITE_HELMET;
  this.craft_buttons[CRAFT.REIDITE_HELMET] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_REIDITE_HELMET], 3);
  this.craft_buttons[CRAFT.REIDITE_HELMET].id = CRAFT.REIDITE_HELMET;
  this.chest_buttons[INV.LAVA_SPEAR] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_SPEAR], 3);
  this.chest_buttons[INV.LAVA_SPEAR].id = INV.LAVA_SPEAR;
  this.inv_buttons[INV.LAVA_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_SPEAR], 3);
  this.inv_buttons[INV.LAVA_SPEAR].id = INV.LAVA_SPEAR;
  this.craft_buttons[CRAFT.LAVA_SPEAR] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_LAVA_SPEAR], 3);
  this.craft_buttons[CRAFT.LAVA_SPEAR].id = CRAFT.LAVA_SPEAR;
  this.chest_buttons[INV.LAVA_SWORD] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_SWORD], 3);
  this.chest_buttons[INV.LAVA_SWORD].id = INV.LAVA_SWORD;
  this.inv_buttons[INV.LAVA_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_SWORD], 3);
  this.inv_buttons[INV.LAVA_SWORD].id = INV.LAVA_SWORD;
  this.craft_buttons[CRAFT.LAVA_SWORD] = gui_create_button(60, 60, "", sprite[SPRITE.CRAFT_LAVA_SWORD], 3);
  this.craft_buttons[CRAFT.LAVA_SWORD].id = CRAFT.LAVA_SWORD;
  this.chest_buttons[INV.LAVA_ORB] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_LAVA_ORB], 3);
  this.chest_buttons[INV.LAVA_ORB].id = INV.LAVA_ORB;
  this.inv_buttons[INV.LAVA_ORB] = gui_create_button(60, 60, "", sprite[SPRITE.INV_LAVA_ORB], 3);
  this.inv_buttons[INV.LAVA_ORB].id = INV.LAVA_ORB;
  this.chest_buttons[INV.EGG0] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EGG0], 3);
  this.chest_buttons[INV.EGG0].id = INV.EGG0;
  this.inv_buttons[INV.EGG0] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EGG0], 3);
  this.inv_buttons[INV.EGG0].id = INV.EGG0;
  this.chest_buttons[INV.EGG1] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EGG1], 3);
  this.chest_buttons[INV.EGG1].id = INV.EGG1;
  this.inv_buttons[INV.EGG1] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EGG1], 3);
  this.inv_buttons[INV.EGG1].id = INV.EGG1;
  this.chest_buttons[INV.EGG2] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EGG2], 3);
  this.chest_buttons[INV.EGG2].id = INV.EGG2;
  this.inv_buttons[INV.EGG2] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EGG2], 3);
  this.inv_buttons[INV.EGG2].id = INV.EGG2;
  this.chest_buttons[INV.EGG3] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EGG3], 3);
  this.chest_buttons[INV.EGG3].id = INV.EGG3;
  this.inv_buttons[INV.EGG3] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EGG3], 3);
  this.inv_buttons[INV.EGG3].id = INV.EGG3;
  this.chest_buttons[INV.EGG4] = gui_create_button(68, 68, "", sprite[SPRITE.CHEST_EGG4], 3);
  this.chest_buttons[INV.EGG4].id = INV.EGG4;
  this.inv_buttons[INV.EGG4] = gui_create_button(60, 60, "", sprite[SPRITE.INV_EGG4], 3);
  this.inv_buttons[INV.EGG4].id = INV.EGG4;
  this.update_craft_buttons = function () {
    var craft = user.craft.can_craft;
    var x = 10;
    var y = 10;
    for (let i = 0; i < craft.length; i++) {
      if ((i > 0) && !(i % 4)) {
        x += craft[0].info.width + 10;
        y = 10;
      }
      craft[i].info.translate.x = x;
      craft[i].info.translate.y = y;
      y += 10 + craft[i].info.height;
    }
  };
  this.update_chest_buttons = function () {
    var x = Math.floor((Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.chest_buttons[0].info.img[0].width)) + 35);
    for (let i = 0; i < this.chest_buttons.length; i++) {
      if (!this.chest_buttons[i])
        continue;

      this.chest_buttons[i].info.translate.x = x;
      this.chest_buttons[i].info.translate.y = 22;
    }
    this.chest_lockpick.info.translate.x = x + 17;
    this.chest_lockpick.info.translate.y = 22 + sprite[SPRITE.CHEST_SLOT].height;
    this.chest_locked.info.translate.x = x + 17;
    this.chest_locked.info.translate.y = 30;
    this.chest_padlock.info.translate.x = x + 17;
    this.chest_padlock.info.translate.y = 22 + sprite[SPRITE.CHEST_SLOT].height;
  };
  this.update_team_buttons = function () {
    var x = Math.floor((canw - sprite[SPRITE.TEAM_BUTTON][0].width) / 2);
    for (let i = 0; i < this.team_buttons.length; i++) {
      this.team_buttons[i].button.info.translate.x = x;
      this.team_buttons[i].button.info.translate.y = -13;
    }
  };
  this.update_bread_oven_button = function () {
    var x = 12 + Math.floor((Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.bread_oven_wood_button.info.img[0].width)) + 35);
    this.bread_oven_wood_button.info.translate.x = x;
    this.bread_oven_wood_button.info.translate.y = 33;
    this.bread_oven_flour_button.info.translate.x = this.bread_oven_wood_button.info.translate.x;
    this.bread_oven_flour_button.info.translate.y = 137;
    this.bread_oven_bread_button.info.translate.x = this.bread_oven_wood_button.info.translate.x;
    this.bread_oven_bread_button.info.translate.y = 240;
  };
  this.update_extractor_button = function () {
    var x = 12 + Math.floor((Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.extractor_wood_button.info.img[0].width)) + 35);
    this.extractor_wood_button.info.translate.x = x;
    this.extractor_wood_button.info.translate.y = 36;
    x += 83;
    this.extractor_stone_button.info.translate.x = x;
    this.extractor_stone_button.info.translate.y = 36;
    this.extractor_gold_button.info.translate.x = x;
    this.extractor_gold_button.info.translate.y = 36;
    this.extractor_diamond_button.info.translate.x = x;
    this.extractor_diamond_button.info.translate.y = 36;
    this.extractor_amethyst_button.info.translate.x = x;
    this.extractor_amethyst_button.info.translate.y = 36;
    this.extractor_reidite_button.info.translate.x = x;
    this.extractor_reidite_button.info.translate.y = 36;
  };
  this.update_windmill_button = function () {
    var x = 12 + Math.floor((Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.windmill_wheat_button.info.img[0].width)) + 35);
    this.windmill_wheat_button.info.translate.x = x;
    this.windmill_wheat_button.info.translate.y = 36;
    x += 83;
    this.windmill_flour_button.info.translate.x = x;
    this.windmill_flour_button.info.translate.y = 36;
  };
  this.update_furnace_button = function () {
    var x = Math.floor((Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.furnace_button.info.img[0].width)) + 35);
    this.furnace_button.info.translate.x = x;
    this.furnace_button.info.translate.y = 22;
  };
  this.update_inv_buttons = function () {
    var inv = user.inv.can_select;
    if (inv.length > 0)
      var center = Math.floor((canw - ((inv[0].info.width + 5) * user.inv.max)) / 2);

    for (let i = 0; i < inv.length; i++) {
      inv[i].info.translate.x = center + ((inv[i].info.width + 5) * i);
      inv[i].info.translate.y = (canh - inv[i].info.width) - 10;
      this.plus_buttons[inv[i].id].info.translate.x = inv[i].info.translate.x + 13;
      this.plus_buttons[inv[i].id].info.translate.y = (inv[i].info.translate.y - this.plus_buttons[inv[i].id].info.img[0].height) - 6;
    }
  };
  var appear_effect_step = 0;
  var appear_effect_max_step = 30;
  var appear_effect = function () {
    _this.update();
    appear_effect_step++;
    if (appear_effect_step == appear_effect_max_step) {
      _this.add_event_listener();
      _this.update();
      return;
    }
    window.setTimeout(appear_effect, 33);
  };
  this.quit = function (fun) {
    if (user.chat.open)
      user.chat.quit();

    if (user.terminal.open)
      user.terminal.quit();

    document.getElementById("team_box").style.display = "none";
    _this.market.style.display = "none";
    _this.market.open = false;
    _this.sign.style.display = "none";
    _this.sign.open = false;
    document.getElementById("shop_starterkit").style.display = "none";
    document.getElementById("home_craft").style.display = "none";
    document.getElementById("recipe_craft").style.display = "none";
    _this.craft_list.open = false;
    document.getElementById("option_in_game").style.display = "none";
    _this.options.open = false;
    document.getElementById("sure_delete").style.display = "none";
    _this.safe_delete.open = false;
    document.getElementById("cancel_sure_delete").style.display = "none";
    _this.safe_cancel.open = false;
    document.getElementById("chronoquest").style.display = "none";
    _this.quests.open = false;
    fun_after_quit = fun;
    _this.remove_event_listener();
    _this.can.style.cursor = _this.cursor0;
    quit_effect_step = -1;
    quit_effect();
  };
  var fun_after_quit;
  var quit_effect_step = -1;
  var quit_effect_max_step = 30;
  var quit_effect = function () {
    _this.update();
    quit_effect_step++;
    if (quit_effect_step == quit_effect_max_step) {
      _this.stop();
      fun_after_quit();
      return;
    }
    window.setTimeout(quit_effect, 33);
  };
  this.is_run = false;
  this.stop = function () {
    this.is_run = false;
  };
  this.run = function () {
    client.change_ground();
    _this.is_run = true;
    quit_effect_step = -1;
    appear_effect_step = 0;
    appear_effect();
  };
  this.update = function () {
    this.leaderboard.translate.x = (canw - this.leaderboard.img.width) - 10;
    this.leaderboard.translate.y = 5;
    world.clock.translate.x = (this.leaderboard.translate.x - sprite[SPRITE.CLOCK][0].width) - 85;
    world.clock.translate.y = 10;
    this.craft_list.button.info.translate.x = (this.leaderboard.translate.x - sprite[SPRITE.RECIPE_BUTTON][0].width) - 10;
    this.craft_list.button.info.translate.y = 10;
    this.quests.button.info.translate.x = (this.leaderboard.translate.x - sprite[SPRITE.QUEST_BUTTON][0].width) - 20;
    this.quests.button.info.translate.y = (this.craft_list.button.info.translate.y + sprite[SPRITE.RECIPE_BUTTON][0].height) + 5;
    this.options.button.info.translate.x = (this.leaderboard.translate.x - sprite[SPRITE.OPTION_BUTTON][0].width) - 20;
    this.options.button.info.translate.y = (this.quests.button.info.translate.y + sprite[SPRITE.OPTION_BUTTON][0].height) + 18;
    this.market.button.info.translate.x = (this.leaderboard.translate.x - sprite[SPRITE.MARKET_BUTTON][0].width) - 20;
    this.market.button.info.translate.y = (this.quests.button.info.translate.y + sprite[SPRITE.MARKET_BUTTON][0].height) + 5;
    user.auto_feed.translate.x = (this.leaderboard.translate.x - 63) - 85;
    user.auto_feed.translate.y = 100;
    user.show_spectators.translate.x = (this.leaderboard.translate.x - sprite[SPRITE.SHOW_SPECTATORS].width) - 85;
    user.show_spectators.translate.y = (user.auto_feed.translate.y + 10) + sprite[SPRITE.AUTO_FEED].height;
    this.minimap.translate.y = (canh - 3) - 193;
    this.minimap.translate.x = (canw - 3) - 193;
    this.gauges.translate.x = 5;
    this.gauges.translate.y = (canh - this.gauges.img.height) - 5;
    this.shop.button.info.translate.x = canw2 - (91 / 2);
    this.shop.button.info.translate.y = 50;
    this.update_craft_buttons();
    this.update_inv_buttons();
    this.update_chest_buttons();
    this.update_furnace_button();
    this.update_windmill_button();
    this.update_extractor_button();
    this.update_bread_oven_button();
    this.update_team_buttons();
    this.sign.update_button();
    draw_team_buttons();
    user.chat.update();
    user.terminal.update();
    this.team_box.update();
    this.craft_list.home.update();
    this.craft_list.list.update();
    this.safe_delete.update();
    this.safe_cancel.update();
    this.quests.update();
    this.shop.update();
    this.options.update();
    this.market.update();
    this.sign.update();
    var move_effect = 0;
    if (appear_effect_step != appear_effect_max_step) {
      var move_effect = (1500 / (appear_effect_step + 1)) - 50;
    }
    if (quit_effect_step != -1) {
      var move_effect = -((1500 / ((quit_effect_max_step - quit_effect_step) + 1)) - 48);
    }
    this.shop.button.info.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    this.leaderboard.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    user.auto_feed.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    user.show_spectators.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    this.craft_list.button.info.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    this.quests.button.info.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    this.options.button.info.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    this.market.button.info.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    world.clock.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    this.gauges.translate.y -= (move_effect < 0) ? move_effect : -move_effect;
    this.minimap.translate.y -= (move_effect < 0) ? move_effect : -move_effect;
  };
  this.draw_UI = function () {
    if ((!user.ghost.enabled && this.show_ui) && !user.zombie)
      draw_ui_crafting();

    draw_ui_gear();
    draw_ui_chat();
    if (this.show_ui) {
      draw_minimap();
      if (this.show_recipe_book === 1)
        this.craft_list.button.draw(ctx);

      if ((((world.mode !== WORLD.MODE_ZOMBIES) && (world.mode !== WORLD.MODE_LEGACY)) && (world.mode !== WORLD.MODE_BR)) && (this.show_quest === 1))
        this.quests.button.draw(ctx);

      this.options.button.draw(ctx);
      if (this.show_market === 1)
        this.market.button.draw(ctx);

      draw_leaderboard();
      draw_status();
      this.gauges.draw();
      draw_weapon_switch_delay();
      draw_helmet_switch_delay();
      draw_build_delay();
      draw_totem_delay();
      draw_ui_inventory();
      draw_chest_inventory();
      draw_furnace_inventory();
      draw_well_inventory();
      draw_windmill_inventory();
      draw_extractor_inventory();
      draw_bread_oven_inventory();
      draw_sign_button();
      draw_team_buttons();
      draw_info_box();
    }
    if (user.ghost.enabled)
      draw_resurrection_inventory();

    draw_bigmap();
    if (this.show_ui && (this.show_clock === 1))
      draw_clock();

    user.welcome.draw();
    user.alert.draw("#FFF", "#000");
    if (this.show_ui) {
      user.ghost.draw();
      user.shop.draw();
      user.inv.drag.draw(mouse.pos.x, mouse.pos.y);
    }
  };
  this.update_scene = function () {
    user.cam.update();
    user.gauges.update();
    if (!user.reconnect.enabled && user.alive) {
      user.control.update();
      user.auto_feed.update();
    }
    world.update();
    this.quests.update_chrono();
  };
  this.draw_scene = function () {
    draw_world_with_effect();
  };
  this.update_connection = function () {
    client.check_state();
    client.check_pong();
    client.try_ping();
    client.update_cam();
  };
  this.draw = function () {
    if (!user.reconnect.enabled && user.alive)
      this.update_connection();

    this.update_scene();
    this.draw_scene();
    this.draw_UI();
  };
  this.trigger_keyup = function (evt) {
    if (user.chat.open && (evt.keyCode === 27))
      user.chat.quit();
    else if (user.terminal.open && (evt.keyCode === 27))
      user.terminal.quit();
    else if (((!user.chat.open && !user.terminal.open) && (evt.keyCode == 79)) && (quit_effect_step == -1))
      user.terminal._open();
    else if ((evt.keyCode == 13) && (quit_effect_step == -1)) {
      if (user.terminal.open)
        user.terminal._send();
      else
        user.chat.run();
    } else if (!user.chat.open && !user.terminal.open) {
      if (evt.keyCode === 82)
        user.auto_feed.invert();
      else if (((evt.keyCode === 80) && (world.mode === WORLD.MODE_HUNGER_GAMES)) && !user.spectator)
        user.show_spectators.invert();
      else if ((evt.keyCode >= 49) && (evt.keyCode <= 57)) {
        if (user.craft.id < 0) {
          let i = evt.keyCode - 49;
          var button = user.inv.can_select[i];
          if (button)
            client.select_inv(button.id, i);

        }
      } else if (evt.keyCode == 89)
        user.bigmap = !user.bigmap;
      else if (evt.keyCode == 71)
        user.craft.change_mode();

    }
    keyboard.up(evt);
  };
  this.trigger_keydown = function (evt) {
    keyboard.down(evt);
    if (((evt.keyCode == 8) && !user.chat.open) && !user.terminal.open)
      evt.preventDefault();

  };
  this.trigger_mousedown = function (evt) {
    mouse.pos = get_mouse_pos(_this.can, evt);
    var click = false;
    if (user.craft.preview < 0)
      _this.minimap.focus(mouse.pos);

    var chest = user.chest;
    if ((user.craft.id < 0) && (chest.id >= 0)) {
      if (!user.chest.lock || (user.chest.pid === user.id))
        click |= _this.chest_buttons[user.chest.id].trigger(_this.can, mouse.pos, MOUSE_DOWN);

    }
    var windmill = user.windmill;
    if (windmill.open && (windmill.amount_flour > 0)) {
      click |= _this.windmill_flour_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
    }
    var extractor = user.extractor;
    if (extractor.open && (extractor.amount_mineral > 0)) {
      click |= _this.extractor_stone_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
      click |= _this.extractor_gold_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
      click |= _this.extractor_diamond_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
      click |= _this.extractor_amethyst_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
      click |= _this.extractor_reidite_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
    }
    var bread_oven = user.bread_oven;
    if (bread_oven.open && (bread_oven.amount_bread > 0)) {
      click |= _this.bread_oven_bread_button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
    }
    if (user.sign.open)
      click |= _this.sign.button.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if (!user.chest.lock) {
      if (user.chest.padlock)
        click |= _this.chest_padlock.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    }
    if (user.chest.lockpick)
      click |= _this.chest_lockpick.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if (((((((user.craft.id < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.options.open) && !_this.market.open) {
      var buttons = user.inv.can_select;
      for (let i = 0; i < buttons.length; i++) {
        var ret = buttons[i].trigger(_this.can, mouse.pos, MOUSE_DOWN);
        click |= ret;
        if (ret)
          user.inv.drag.start(i, mouse.pos);

        if ((((((chest.open && ((chest.id < 0) || (chest.id == buttons[i].id))) || (user.furnace.open && (buttons[i].id === INV.WOOD))) || (user.well.open && (buttons[i].id === INV.BUCKET_FULL))) || (user.bread_oven.open && ((buttons[i].id === INV.WOOD) || (buttons[i].id === INV.FLOUR)))) || (user.windmill.open && (buttons[i].id === INV.WILD_WHEAT))) || (user.extractor.open && (buttons[i].id === INV.WOOD))) {
          click |= _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_DOWN);
        }
      }
    }
    if (user.resurrection.open)
      click |= _this.resurrection.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if (_this.team_buttons_id != -1) {
      click |= _this.team_buttons[_this.team_buttons_id].button.trigger(_this.can, mouse.pos, MOUSE_DOWN);
      if (click)
        var team_button = true;

    } else
      var team_button = false;
    if (((((((((user.craft.id < 0) && (user.craft.preview < 0)) && !team_button) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.market.open) && !user.zombie) {
      var buttons = user.craft.can_craft;
      for (let i = 0; i < buttons.length; i++) {
        click |= buttons[i].trigger(_this.can, mouse.pos, MOUSE_DOWN);
      }
    }
    if (((((((((user.craft.id < 0) && (user.craft.preview < 0)) && user.shop.open) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open)
      click |= _this.shop.button.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if ((((((user.craft.preview < 0) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open)
      click |= _this.craft_list.button.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if ((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open)
      click |= _this.options.button.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if ((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.options.open)
      click |= _this.market.button.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if (((((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.market.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && (world.mode !== WORLD.MODE_ZOMBIES)) && (world.mode !== WORLD.MODE_LEGACY)) && (world.mode !== WORLD.MODE_BR))
      click |= _this.quests.button.trigger(_this.can, mouse.pos, MOUSE_DOWN);

    if (((((((!click && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open) && !_this.sign.open) {
      if (user.craft.preview >= 0)
        client.send_build();
      else if (!team_button)
        mouse.down();

    }
  };
  this.trigger_mouseup = function (evt) {
    mouse.pos = get_mouse_pos(_this.can, evt);
    mouse.up();
    if (user.inv.drag.release())
      return;

    var chest = user.chest;
    var furnace = user.furnace;
    var well = user.well;
    var windmill = user.windmill;
    var extractor = user.extractor;
    var bread_oven = user.bread_oven;
    if (user.control.attack) {
      user.control.attack = 0;
      client.stop_attack();
    }
    if (_this.team_buttons_id != -1) {
      var sel = _this.team_buttons[_this.team_buttons_id].button.trigger(_this.can, mouse.pos, MOUSE_UP);
      var style = document.getElementById("team_box").style;
      if (sel && (style.display == "inline-block")) {
        style.display = "none";
        return;
      } else if (sel)
        _this.team_buttons[_this.team_buttons_id].action();

    }
    if (((user.craft.id < 0) && (chest.id >= 0)) && !_this.safe_delete.open) {
      if (!user.chest.lock || (user.chest.pid === user.id)) {
        var sel = _this.chest_buttons[user.chest.id].trigger(_this.can, mouse.pos, MOUSE_UP);
        if (sel)
          client.take_chest(chest);

      }
    }
    var windmill = user.windmill;
    if ((windmill.open && (windmill.amount_flour > 0)) && !_this.safe_delete.open) {
      var sel = _this.windmill_flour_button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel)
        client.take_flour(windmill);

    }
    var extractor = user.extractor;
    if ((extractor.open && (extractor.amount_mineral > 0)) && !_this.safe_delete.open) {
      switch (extractor.type) {
        case ITEMS.EXTRACTOR_MACHINE_STONE:
          var sel = _this.extractor_stone_button.trigger(_this.can, mouse.pos, MOUSE_UP);
          if (sel)
            client.take_extractor(extractor);

          break;
        case ITEMS.EXTRACTOR_MACHINE_GOLD:
          var sel = _this.extractor_gold_button.trigger(_this.can, mouse.pos, MOUSE_UP);
          if (sel)
            client.take_extractor(extractor);

          break;
        case ITEMS.EXTRACTOR_MACHINE_DIAMOND:
          var sel = _this.extractor_diamond_button.trigger(_this.can, mouse.pos, MOUSE_UP);
          if (sel)
            client.take_extractor(extractor);

          break;
        case ITEMS.EXTRACTOR_MACHINE_AMETHYST:
          var sel = _this.extractor_amethyst_button.trigger(_this.can, mouse.pos, MOUSE_UP);
          if (sel)
            client.take_extractor(extractor);

          break;
        case ITEMS.EXTRACTOR_MACHINE_REIDITE:
          var sel = _this.extractor_reidite_button.trigger(_this.can, mouse.pos, MOUSE_UP);
          if (sel)
            client.take_extractor(extractor);

          break;
      }
    }
    var bread_oven = user.bread_oven;
    if ((bread_oven.open && (bread_oven.amount_bread > 0)) && !_this.safe_delete.open) {
      var sel = _this.bread_oven_bread_button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel)
        client.take_bread(bread_oven);

    }
    if (user.sign.open && !_this.safe_delete.open) {
      var sel = _this.sign.button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel)
        _this.sign.select();

    }
    if (!user.chest.lock && !_this.safe_delete.open) {
      if (user.chest.padlock) {
        sel = _this.chest_padlock.trigger(_this.can, mouse.pos, MOUSE_UP);
        if (sel)
          client.lock_chest(chest);

      }
    }
    if (user.chest.lockpick && !_this.safe_delete.open) {
      sel = _this.chest_lockpick.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel) {
        client.unlock_chest(chest);

      }
    }
    if (user.resurrection.open) {
      var sel = _this.resurrection.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel) {
        client.resurrection();
      }
    }
    if (((user.craft.id < 0) && !user.ghost.enabled) && !_this.safe_delete.open) {
      var buttons = user.inv.can_select;
      for (let i = 0; i < buttons.length; i++) {
        var sel = buttons[i].trigger(_this.can, mouse.pos, MOUSE_UP);
        if (!sel) {
          if (chest.open && ((chest.id < 0) || (chest.id === buttons[i].id))) {
            var sel = _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_UP);
            if (sel && (user.craft.preview < 0))
              client.give_item(chest, buttons[i].id, evt.shiftKey ? 10 : 1);

          } else if (well.open && (buttons[i].id === INV.BUCKET_FULL)) {
            var sel = _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_UP);
            if (sel && (user.craft.preview < 0))
              client.give_well(well);

          } else if (furnace.open && (buttons[i].id === INV.WOOD)) {
            var sel = _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_UP);
            if (sel && (user.craft.preview < 0))
              client.give_wood(furnace, evt.shiftKey ? 10 : 1);

          } else if (windmill.open && (buttons[i].id === INV.WILD_WHEAT)) {
            var sel = _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_UP);
            if (sel && (user.craft.preview < 0))
              client.give_wheat(windmill, evt.shiftKey ? 10 : 1);

          } else if (extractor.open && (buttons[i].id === INV.WOOD)) {
            var sel = _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_UP);
            if (sel && (user.craft.preview < 0))
              client.give_wood_extractor(extractor, evt.shiftKey ? 10 : 1);

          } else if (bread_oven.open && ((buttons[i].id === INV.WOOD) || (buttons[i].id === INV.FLOUR))) {
            var sel = _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_UP);
            if (sel && (user.craft.preview < 0)) {
              if (buttons[i].id === INV.WOOD)
                client.give_bread_oven(bread_oven, evt.shiftKey ? 10 : 1, 0);
              else
                client.give_bread_oven(bread_oven, 0, evt.shiftKey ? 10 : 1);
            }
          }
          continue;
        } else {
          if ((evt.which == 1) && !evt.shiftKey)
            client.select_inv(buttons[i].id, i);
          else if ((((evt.which == 1) && evt.shiftKey) || (evt.which == 3)) && (user.craft.preview < 0))
            _this.safe_delete.del(buttons[i].id);

        }
      }
    }
    if (((((user.craft.id < 0) && (user.craft.preview < 0)) && !user.ghost.enabled) && !_this.safe_delete.open) && !user.zombie) {
      var buttons = user.craft.can_craft;
      for (let i = 0; i < buttons.length; i++) {
        var sel = buttons[i].trigger(_this.can, mouse.pos, MOUSE_UP);
        if (!sel)
          continue;

        ret = client.select_craft(buttons[i].id);
      }
    }
    if (((((((((user.craft.id < 0) && (user.craft.preview < 0)) && user.shop.open) && !_this.market.open) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) {
      var sel = _this.shop.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
      if (sel)
        game.shop.select();

    }

    if ((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open) {
      var sel = _this.options.button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel) {
        _this.options.select_options();
      }
    }
    if (((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.options.open) && (_this.show_market === 1)) {
      var sel = _this.market.button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel) {
        _this.market.select();
      }
    }
    if (((((((user.craft.preview < 0) && !_this.safe_delete.open) && !_this.market.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) && (_this.show_recipe_book === 1)) {
      var sel = _this.craft_list.button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel) {
        _this.craft_list.select_book();
      }
    }
    if ((((((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.market.open) && (world.mode !== WORLD.MODE_ZOMBIES)) && (world.mode !== WORLD.MODE_LEGACY)) && (world.mode !== WORLD.MODE_BR)) && (_this.show_quest === 1)) {
      var sel = _this.quests.button.trigger(_this.can, mouse.pos, MOUSE_UP);
      if (sel) {
        _this.quests.select();
      }
    }
    if (user.craft.crafting && (evt.which == 3))
      _this.safe_cancel.del();

  };

  this.trigger_mousemove = function (evt) {
    mouse.pos = get_mouse_pos(_this.can, evt);
    var cursor = false;
    game.info_box.display = 0;
    user.inv.drag.move(mouse.pos);
    if (_this.team_buttons_id != -1)
      cursor |= _this.team_buttons[_this.team_buttons_id].button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    var windmill = user.windmill;
    if (windmill.open && (windmill.amount_flour > 0))
      cursor |= _this.windmill_flour_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    var extractor = user.extractor;
    if (extractor.open && (extractor.amount_mineral > 0)) {
      cursor |= _this.extractor_stone_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
      cursor |= _this.extractor_gold_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
      cursor |= _this.extractor_diamond_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
      cursor |= _this.extractor_amethyst_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
      cursor |= _this.extractor_reidite_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
    }
    var bread_oven = user.bread_oven;
    if (bread_oven.open && (bread_oven.amount_bread > 0))
      cursor |= _this.bread_oven_bread_button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if (user.sign.open)
      cursor |= _this.sign.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    var chest = user.chest;
    if (((user.craft.id < 0) && (chest.id >= 0)) && !user.ghost.enabled) {
      if (!user.chest.lock || (user.chest.pid === user.id))
        cursor |= _this.chest_buttons[chest.id].trigger(_this.can, mouse.pos, MOUSE_MOVE);

    }
    if (user.resurrection.open)
      cursor |= _this.resurrection.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if (!user.chest.lock && !user.ghost.enabled) {
      if (user.chest.padlock)
        cursor |= _this.chest_padlock.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    }
    if (user.chest.lockpick && !user.ghost.enabled)
      cursor |= _this.chest_lockpick.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if ((user.craft.id < 0) && !user.ghost.enabled) {
      var buttons = user.inv.can_select;
      for (let i = 0; i < buttons.length; i++) {
        var _on = buttons[i].trigger(_this.can, mouse.pos, MOUSE_MOVE);
        cursor |= game.info_box.trigger(_on, buttons[i], 0);
        if ((((((chest.open && ((chest.id < 0) || (chest.id == buttons[i].id))) || (user.furnace.open && (buttons[i].id == INV.WOOD))) || (user.well.open && (buttons[i].id === INV.BUCKET_FULL))) || (user.bread_oven.open && ((buttons[i].id == INV.WOOD) || (buttons[i].id == INV.FLOUR)))) || (user.windmill.open && (buttons[i].id == INV.WILD_WHEAT))) || (user.extractor.open && (buttons[i].id == INV.WOOD))) {
          cursor |= _this.plus_buttons[buttons[i].id].trigger(_this.can, mouse.pos, MOUSE_MOVE);
        }
      }
    }
    if ((((user.craft.id < 0) && (user.craft.preview < 0)) && !user.ghost.enabled) && !user.zombie) {
      var buttons = user.craft.can_craft;
      for (let i = 0; i < buttons.length; i++) {
        var _on = false;
        _on = buttons[i].trigger(_this.can, mouse.pos, MOUSE_MOVE);
        cursor |= game.info_box.trigger(_on, buttons[i], 1);
      }
    }
    if (((((((((user.craft.id < 0) && (user.craft.preview < 0)) && user.shop.open) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open)
      cursor |= _this.shop.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if (((((((user.craft.preview < 0) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open) && (_this.show_recipe_book === 1))
      cursor |= _this.craft_list.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if ((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.market.open)
      cursor |= _this.options.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if (((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.safe_cancel.open) && !_this.quests.open) && !_this.options.open) && (_this.show_market === 1))
      cursor |= _this.market.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);

    if ((((((((((user.craft.preview < 0) && !_this.craft_list.open) && !_this.safe_delete.open) && !_this.options.open) && !_this.safe_cancel.open) && !_this.market.open) && (world.mode !== WORLD.MODE_ZOMBIES)) && (world.mode !== WORLD.MODE_LEGACY)) && (world.mode !== WORLD.MODE_B)) && (_this.show_quest === 1))
      cursor |= _this.quests.button.trigger(_this.can, mouse.pos, MOUSE_MOVE);
  };
  this.add_event_listener = function () {
    window.addEventListener('mousedown', this.trigger_mousedown, false);
    window.addEventListener('mouseup', this.trigger_mouseup, false);
    window.addEventListener('mousemove', this.trigger_mousemove, false);
    window.addEventListener('keyup', this.trigger_keyup, false);
    window.addEventListener('keydown', this.trigger_keydown, false);
  };
  this.remove_event_listener = function () {
    window.removeEventListener('mousedown', this.trigger_mousedown, false);
    window.removeEventListener('mouseup', this.trigger_mouseup, false);
    window.removeEventListener('mousemove', this.trigger_mousemove, false);
    window.removeEventListener('keyup', this.trigger_keyup, false);
    window.removeEventListener('keydown', this.trigger_keydown, false);
  };
};