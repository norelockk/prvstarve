function Flakes(id, x, y, angle) {
  this.id = id;
  this.speed = (id + 5) * 8;
  this.life = canw / 1366;
  this.x = x;
  this.y = y;
  this.c = Math.cos(angle);
  this.s = Math.sin(angle);
  this.alpha = 0;
};;
mycyph1 = 1;

function User() {
  this.init = function () { };
  this.resurrection = {
    pid: 1,
    iid: 1,
    open: false
  };
  this.well = {
    pid: 1,
    iid: -1,
    open: false
  };
  this.windmill = {
    amount_wheat: 0,
    amount_flour: 0,
    pid: 1,
    iid: -1,
    open: false
  };
  this.extractor = {
    amount_wood: 0,
    amount_mineral: 0,
    type: 0,
    mineral: 0,
    pid: 1,
    iid: -1,
    open: false
  };
  this.bread_oven = {
    amount_wood: 0,
    amount_bread: 0,
    amount_flour: 0,
    pid: 1,
    iid: -1,
    open: false
  };
  this.sign = {
    iid: -1,
    open: false
  };
  this.furnace = {
    amount: 0,
    pid: 1,
    iid: -1,
    open: false
  };
  this.ghost = {
    enabled: false,
    delay: -1,
    label: false,
    now: -1,
    draw: draw_alert_ghost
  };
  this.chest = {
    id: -1,
    amount: 0,
    pid: 1,
    iid: -1,
    open: false,
    lock: false,
    locked: false,
    lockpick: false,
    padlock: false
  };
  this.alive = false;
  this.reconnect = {
    enabled: false,
    rotate: 0
  };
  this.key = Utils.gup("key", window.location.href);
  var egg = Utils.gup("egg", window.location.href);
  if (egg)
    ui.skin = parseInt(egg);

  this.beta = (0 === window.location.href.indexOf("http://starve.io/beta")) ? 1 : 0;
  if (this.key && this.beta) {
    Cookies.set("starve_beta", this.key);
  } else if (this.beta)
    this.key = Cookies.get("starve_beta");

  this.token = Cookies.get("starve_token") ? Cookies.get("starve_token") : Utils.generate_token(CLIENT.TOKEN_LEN);
  this.token_id = Cookies.get("starve_token_id") ? Cookies.get("starve_token_id") : "";

  this.id = 0;
  this.uid = 0;
  this.day = 0;
  this.die = {
    howdie: "",
    score: 0,
    bank: 0,
    kill: 0
  };
  this.account = {
    connected: 0,
    last: (new Date).getTime()
  };
  this.team = [];
  this.in_team = function (id) {
    for (var i = 0; i < this.team.length; i++) {
      if (this.team[i] == id)
        return true;

    }
    return false;
  };
  this.shop = {
    delay: 0,
    time: 0,
    value: 0,
    open: false,
    draw: function () {
      if (this.open) {
        var now = (new Date).getTime();
        this.time = Math.floor((now - this.delay) / 1000);
        if (this.time < 60) {
          game.shop.button.draw(ctx);
        } else {
          document.getElementById("shop_starterkit").style.display = "none";
          this.open = false;
        }
      }
    }
  };
  this.totem = {
    id: -1,
    pid: -1,
    lock: 0,
    timeout: new Utils.LinearAnimation(false, 0, 1, 0, 1 / 30, 1),
    wait: false
  };
  this.helmet = {
    timeout: new Utils.LinearAnimation(false, 0, 1, 0, 1 / 5, 1),
    wait: false
  };
  this.build = {
    timeout: new Utils.LinearAnimation(false, 0, 1, 0, 1, 1),
    wait: false
  };
  this.weapon = {
    timeout: new Utils.LinearAnimation(false, 0, 1, 0, 1 / 10, 1),
    wait: false
  };
  this.cam = new Utils.Ease2d(Utils.ease_out_quad, 0, 0.4, 0, 0, canw2, canh2, canw2, canh2);
  this.cam.delay = 0;
  this.cam.forcedDelay = 0;
  this.cam.update = function () {
    if (this.forcedDelay > 0) {
      this.forcedDelay -= delta;
      return;
    }
    var p = world.fast_units[user.uid];
    if (p) {
      this.delay = 0;
      var x = Math.max(Math.min(canw2 - p.x, -2), (-world.w + 2) + canw);
      var y = Math.max(Math.min(canh2 - p.y, -2), (-world.h + 2) + canh);
      this.ease({
        x: x,
        y: y
      });
    } else {
      this.delay += delta;
      if (this.delay > 3) {
        this.delay = 0;
        if (!user.reconnect.enabled)
          client.get_focus();

      }
    }
  };
  this.cam.w = screen.width;
  this.cam.h = screen.height;
  this.cam.rw = this.cam.w;
  this.cam.rh = this.cam.h;
  this.cam.rx = 0;
  this.cam.ry = 0;
  this.cam.rdw = 0;
  this.cam.rdh = 0;
  this.cam.change = function (x, y) {
    this.x = -Math.min(Math.max(-world.dw * 2, (x - world.dw) - (this.rw / 2)), world.w - this.rw);
    this.y = -Math.min(Math.max(-world.dh * 2, y - ((world.dh + this.rh) / 2)), (world.h - this.rh) + world.dh);
    this.ex = this.x;
    this.ey = this.y;
  };
  this.control = {
    angle: 0,
    timeout: 0,
    previous: 0,
    mouse: 0,
    attack: 0,
    update: function () {
      var p = world.fast_units[user.uid];
      if (p)
        var pos = {
          x: user.cam.x + p.x,
          y: user.cam.y + p.y
        };
      else
        var pos = canm;
      var angle = Utils.get_std_angle(mouse.pos, pos);
      var attacked = false;
      this.mouse += delta;
      if (!mouse.state) {
        if ((p && !(p.action & STATE.ATTACK)) && (this.mouse > CLIENT.ATTACK)) {
          this.attack = 1;
          attacked = true;
          this.mouse = 0;
          client.send_attack(angle);
        }
      }
      if (p) {
        p.angle = angle;
        p.nangle = angle;
      }
      if (!attacked) {
        this.timeout += delta;
        if (this.timeout > CLIENT.ROTATE) {
          this.timeout = 0;
          if (Math.abs(this.angle - angle) > 0.005) {
            client.send_angle(angle);
            this.angle = angle;
          }
        }
      }

      if (user.chat.open)
        return;

      if ('LOLIPOP_CONSOLE' in window && !!window['LOLIPOP_CONSOLE']['state'])
        return;

      if (user.terminal.open)
        return;

      var update = false;
      var move = 0;
      var left = keyboard.is_left();
      if (left)
        move |= 1;

      var right = keyboard.is_right();
      if (right)
        move |= 2;

      var bottom = keyboard.is_bottom();
      if (bottom)
        move |= 4;

      var top = keyboard.is_top();
      if (top)
        move |= 8;

      if (this.previous != move)
        client.send_move(move);

      this.previous = move;
    }
  };
  this.gauges = {
    c: 1,
    l: 1,
    h: 1,
    t: 1,
    o: 1,
    wa: 1,
    warn_cold: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3),
    warn_life: new Utils.LinearAnimation(true, 0, 1, 0, 2, 2),
    warn_hunger: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3),
    warn_thirst: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3),
    warn_oxygen: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3),
    warn_warm: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3),
    cold: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1),
    life: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1),
    hunger: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1),
    thirst: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1),
    oxygen: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1),
    warm: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1),
    update: function () {
      this.warn_cold.update();
      this.warn_life.update();
      this.warn_hunger.update();
      this.warn_thirst.update();
      this.warn_oxygen.update();
      this.warn_warm.update();
      this.cold.ease(this.c);
      this.life.ease(this.l);
      this.hunger.ease(this.h);
      this.thirst.ease(this.t);
      this.oxygen.ease(this.o);
      this.warm.ease(this.wa);
    }
  };
  this.bigmap = false;
  this.spectator = false;
  this.zombie = false;
  this.vampire = false;
  this.inv = {
    max: WORLD.WITHOUT_BAG,
    bonus: 0,
    bag: 0,
    n: [],
    can_select: [],
    update_bag_size: function (_bag, _bonus) {
      if (_bag === 1)
        this.bag = WORLD.BAG_SIZE;

      this.bonus += _bonus;
      this.max = (WORLD.WITHOUT_BAG + this.bonus) + this.bag;
    },
    drag: {
      item: -1,
      img: null,
      _start: 0,
      _move: 0,
      _x: -1,
      _y: -1,
      move: function (mouse) {
        if (this._start && ((mouse.x !== this._x) || (mouse.y !== this._y)))
          this._move = 1;

      },
      start: function (item, mouse) {
        this._x = mouse.x;
        this._y = mouse.y;
        this.item = item;
        this.img = user.inv.can_select[item].info.img[2];
        this._start = 1;
      },
      stop: function () {
        this._start = 0;
        this._move = 0;
        this._x = -1;
        this._y = -1;
      },
      release: function () {
        var item = -1;
        var buttons = user.inv.can_select;
        var ret = 0;
        if (this._start && this._move) {
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].info.state === BUTTON_IN) {
              item = i;
              break;
            }
          }
          if (((item !== -1) && (item !== this.item)) && buttons[this.item]) {
            ret = 1;
            var tmp = buttons[item];
            buttons[item] = buttons[this.item];
            buttons[this.item] = tmp;
            game.update_inv_buttons();
          }
        }
        this.stop();
        return ret;
      },
      draw: function (x, y) {
        if (!this._start || !this._move)
          return;

        ctxDrawImage(ctx, this.img, Math.floor(x - (this.img.width / 2)), Math.floor(y - (this.img.height / 2)));
      }
    },
    free_place: function (r) {
      for (i = 0; i < r.length; i++) {
        if (this.n[r[i][0]] == r[i][1])
          return true;

      }
      return false;
    },
    find_item: function (id) {
      for (var i = 0; i < this.can_select.length; i++) {
        if (this.can_select[i].id == id)
          return i;

      }
      return -1;
    },
    delete_item: function (id, i) {
      this.n[id] = 0;
      this.can_select.splice(i, 1);
      game.update_inv_buttons();
    },
    decrease: function (id, n, i) {
      update = true;
      this.n[id] = Math.max(0, this.n[id] - n);
      if (!this.n[id] && (i >= 0))
        this.delete_item(id, i);

    }
  };
  this.show_spectators = {
    enabled: false,
    translate: {
      x: 0,
      y: 0
    },
    invert: function () {
      if ((world.mode != WORLD.MODE_HUNGER_GAMES) || user.spectator)
        return;

      user.show_spectators.enabled = !user.show_spectators.enabled;
      if (user.show_spectators.enabled)
        game.options.spectator_agree.display = "inline-block";
      else
        game.options.spectator_agree.display = "none";
    }
  };
  game.options.spectator_agree.display = "none";
  this.auto_feed = {
    enabled: false,
    translate: {
      x: 0,
      y: 0
    },
    delay: 0,
    invert: function () {
      user.auto_feed.enabled = !user.auto_feed.enabled;
      if (user.auto_feed.enabled)
        game.options.feed_agree.display = "inline-block";
      else
        game.options.feed_agree.display = "none";
    },
    update: function () {
      if ((!this.enabled || (user.craft.id >= 0)) || game.safe_delete.open)
        return;

      this.delay += delta;
      if (this.delay > 2) {
        this.delay = 0;
        if (user.gauges.h < 0.35) {
          if (user.inv.n[INV.PLANT])
            client.select_inv(INV.PLANT, user.inv.find_item(INV.PLANT));
          else if (user.inv.n[INV.GARLIC])
            client.select_inv(INV.GARLIC, user.inv.find_item(INV.GARLIC));
          else if (user.inv.n[INV.CRAB_STICK])
            client.select_inv(INV.CRAB_STICK, user.inv.find_item(INV.CRAB_STICK));
          else if (user.inv.n[INV.PUMPKIN])
            client.select_inv(INV.PUMPKIN, user.inv.find_item(INV.PUMPKIN));
          else if (user.inv.n[INV.TOMATO])
            client.select_inv(INV.TOMATO, user.inv.find_item(INV.TOMATO));
          else if (user.inv.n[INV.CARROT])
            client.select_inv(INV.CARROT, user.inv.find_item(INV.CARROT));
          else if (user.inv.n[INV.WATERMELON])
            client.select_inv(INV.WATERMELON, user.inv.find_item(INV.WATERMELON));
          else if (user.inv.n[INV.BREAD])
            client.select_inv(INV.BREAD, user.inv.find_item(INV.BREAD));
          else if (user.inv.n[INV.COOKED_MEAT])
            client.select_inv(INV.COOKED_MEAT, user.inv.find_item(INV.COOKED_MEAT));
          else if (user.inv.n[INV.FOODFISH_COOKED])
            client.select_inv(INV.FOODFISH_COOKED, user.inv.find_item(INV.FOODFISH_COOKED));
          else if (user.inv.n[INV.COOKIE])
            client.select_inv(INV.COOKIE, user.inv.find_item(INV.COOKIE));
          else if (user.inv.n[INV.SANDWICH])
            client.select_inv(INV.SANDWICH, user.inv.find_item(INV.SANDWICH));
          else if (user.inv.n[INV.CAKE])
            client.select_inv(INV.CAKE, user.inv.find_item(INV.CAKE));
          else if (user.inv.n[INV.CRAB_LOOT])
            client.select_inv(INV.CRAB_LOOT, user.inv.find_item(INV.CRAB_LOOT));

        } else if (user.gauges.t < 0.35) {
          if (user.inv.n[INV.BOTTLE_FULL])
            client.select_inv(INV.BOTTLE_FULL, user.inv.find_item(INV.BOTTLE_FULL));

        }
      }
    }
  };
  game.options.feed_agree.display = "none";
  this.craft = {
    id: -1,
    id2: -1,
    timeout: new Utils.LinearAnimation(false, 0, 1, 0, 1, 1),
    crafting: false,
    preview: -1,
    mode: 0,
    label: [],
    can_craft: [],
    workbench: false,
    fire: false,
    water: false,
    well: false,
    change_mode: function () {
      this.mode = (this.mode === 0) ? 1 : 0;
    },
    set_workbench: function (val) {
      this.workbench = val;
      var safe = game.safe_delete;
      if (safe.open)
        safe.del(safe.button);

      this.update();
    },
    do_recycle: function (id) {
      var r = RECIPES[id];
      this.id = id;
      this.crafting = true;
      var p = world.fast_units[user.uid];
      this.timeout.max_speed = r.time * 8;
      this.id2 = r.id2;
    },
    do_craft: function (id) {
      var r = RECIPES[id];
      this.id = id;
      this.crafting = true;
      var p = world.fast_units[user.uid];
      if (p && (p.right == INV.BOOK))
        this.timeout.max_speed = r.time * 3;
      else
        this.timeout.max_speed = r.time;
      this.id2 = r.id2;
      for (var i = 0; i < r.r.length; i++) {
        var o = r.r[i];
        user.inv.decrease(o[0], o[1], user.inv.find_item(o[0]));
      }
      game.update_inv_buttons();
    },
    update: function () {
      this.can_craft = [];
      if (game.info_box.craft === 1)
        game.info_box.display = 0;

      for (var k in RECIPES) {
        var r = RECIPES[k];
        var can_craft = true;
        if (!r.r)
          continue;

        for (var i = 0; i < r.r.length; i++) {
          if ((user.inv.max >= WORLD.WITH_BAG) && (r.id === CRAFT.BAG)) {
            can_craft = false;
            break;
          }
          if ((((r.w > this.workbench) || (r.f > this.fire)) || (r.o > this.water)) || (r.e > this.well)) {
            can_craft = false;
            break;
          }
          var o = r.r[i];
          if (!user.inv.n[o[0]] || (user.inv.n[o[0]] < o[1])) {
            can_craft = false;
            break;
          }
        }
        if (can_craft)
          this.can_craft.push(game.craft_buttons[r.id]);

      }
      game.update_craft_buttons();
      game.update_chest_buttons();
      game.update_furnace_button();
      game.update_windmill_button();
      game.update_extractor_button();
      game.update_bread_oven_button();
      game.sign.update_button();
    },
    restart: function () {
      this.id = -1;
      this.crafting = false;
      this.timeout.v = 0;
      this.timeout.o = false;
      this.update();
    }
  };
  this.welcome = {
    message: undefined,
    draw: draw_welcome_message
  };
  this.alert = {
    timeout: new Utils.LinearAnimation(false, 1, 1, 0, 4, 0.3),
    text: "",
    label: null,
    draw: draw_alert,
    list: []
  };
  this.ldb = {
    can: document.createElement("canvas"),
    ids: [],
    update: true,
    translate: {
      x: 0,
      y: 0
    },
    sort: function () {
      var sortable = [];
      var players = world.players;
      for (var i = 0; i < players.length; i++) {
        if (players[i].alive)
          sortable.push({
            id: i,
            s: players[i].score
          });

      }
      sortable.sort(function (a, b) {
        return b.s - a.s;
      });
      this.ids = [];
      for (var i = 0;
        (i < sortable.length) && (i < 10); i++)
        this.ids.push(sortable[i].id);
      this.update = true;
    },
    init: function (u) {
      var players = world.players;
      for (var i = 0; i < players.length; i++)
        players[i].score = 0;
      players[user.id].score = Utils.restore_number(u[1]);
      this.ids = [];
      for (var i = 2; i < u.length; i += 2) {
        this.ids.push(u[i]);
        players[u[i]].score = Utils.restore_number(u[i + 1]);
      }
      this.update = true;
    }
  };
  this.ldb.can.width = 180 * scale;
  this.ldb.can.height = 300 * scale;
  this.ldb.ctx = this.ldb.can.getContext("2d");
  this.terminal = {
    open: false,
    input: document.getElementById('commandInput'),
    contentBox: document.getElementById('commandsBox'),
    style: document.getElementById('commandMainBox').style,
    _print: function (d) {
      this.contentBox.innerHTML += d;
    },
    update: function () {
      this.style.left = Math.floor((canw / 2) - 300) + "px";
      this.style.top = Math.floor((canh / 2) - 250) + "px";
    },
    _clean: function () {
      this.contentBox.innerHTML = "";
    },
    quit: function () {
      this.open = false;
      this.style.display = "none";
    },
    create_array: function (datas) {
      var content = '<table class=\"tableList\">';
      for (var i = 0; i < datas.length; i++) {
        if ((i % 3) === 0)
          content += '<tr>';

        content += ('<td class=\"tableList\">' + datas[i]) + '</td>';
        if ((((i + 1) % 3) === 0) || ((i + 1) === datas.length))
          content += '</tr>';

      }
      content += '</table>';
      return content;
    },
    write_command: function (cmd, isSucceed, answer, content) {
      cmd = !cmd ? "" : cmd;
      isSucceed = !isSucceed ? "" : isSucceed;
      answer = !answer ? "" : answer;
      content = !content ? "" : content;
      var data = "<div class=commandWritten>" + cmd;
      if (isSucceed)
        data += "<div class=commandValidated>";
      else
        data += "<div class=commandUnknown>";
      data += ((answer + "</div>") + content) + "</div>";
      this._print(data);
      this.scroll_down();
    },
    scroll_down: function () {
      this.contentBox["scrollTop"] = this.contentBox["scrollHeight"];
      return;
    },
    commands: function (msg) {
      switch (msg) {
        case "clean":
          this._clean();
          return true;
          break;
        case "list":
          var list = "";
          var players = world.players;
          for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.alive) {
              list += ((player.nickname + ' <span style=\"color:green\">#') + i) + "</span><br />";
            }
          }
          this.write_command("list", 1, "List all connected players", list);
          return true;
          break;
        case "weapon-list":
          this.write_command("Weapons", 1, "List all weapons in the game", this.create_array(["sword_wood", "sword", "sword_gold", "sword_diamond", "sword_amethyst", "sword_reidite", "dragon_sword", "lava_sword", "sword_pirate", "wood_spear", "spear", "gold_spear", "diamond_spear", "amethyst_spear", "reidite_spear", "dragon_spear", "lava_spear", "crab_spear", "wood_bow", "wood_arrow"]));
          return true;
          break;
        case "tool-list":
          this.write_command("Tools", 1, "List all tools in the game", this.create_array(["pick_wood", "pick", "pick_gold", "pick_diamond", "pick_amethyst", "pick_reidite", "hammer", "hammer_gold", "hammer_diamond", "hammer_amethyst", "hammer_reidite", "super_hammer", "shovel", "shovel_gold", "shovel_diamond", "shovel_amethyst", "pitchfork", "pitchfork2", "spanner", "book"]));
          return true;
          break;
        case "survival-list":
          this.write_command("Survival Items", 1, "List all survival items in the game", this.create_array(["fire", "workbench", "bandage", "big_fire", "furnace", "paper", "blue_cord", "lock", "lockpick", "totem", "resurrection", "bridge", "bottle_full", "bottle_empty", "watering_can", "watering_can_full", "windmill", "plot", "bread_oven", "chest", "bucket_empty", "bucket_full", "well", "sign", "roof", "bed", "boat", "sled", "boar", "saddle", "emerald_machine", "extractor_stone", "extractor_gold", "extractor_diamond", "extractor_amethyst", "extractor_reidite_button"]));
          return true;
          break;
        case "resource-list":
          this.write_command("Resources", 1, "List all resources in the game", this.create_array(["wood", "stone", "gold", "diamond", "amethyst", "reidite", "fur", "fur_wolf", "fur_winter", "cord", "scales", "penguin_feather", "flame", "sand", "ground", "ice", "dragon_heart", "lava_heart", "kraken_skin", "special_fur", "special_fur_2", "gemme_green", "gemme_orange", "gemme_blue", "dragon_cube", "dragon_orb", "lava_cube", "lava_orb", "fur_boar", "pitchfork_part", "pilot_glasses", "fur_mammoth"]));
          return true;
          break;
        case "food-list":
          this.write_command("Food", 1, "List all food in the game", this.create_array(["plant", "seed", "meat", "cooked_meat", "flour", "wheat_seed", "cookies", "wild_wheat", "cake", "fish", "cooked_fish", "bread", "sandwich", "pumpkin_seed", "pumpkin", "garlic_seed", "garlic", "thornbush_seed", "thornbush", "crab_stick", "claw", "carrot_seed", "carrot", "tomato_seed", "tomato", "watermelon_seed", "watermelon", "aloe_vera_seed", "aloe_vera", "cactus"]));
          return true;
          break;
        case "hat-list":
          this.write_command("Hats", 1, "List all hats in the game", this.create_array(["earmuffs", "coat", "scarf", "fur_hat", "warm_protection", "warm_protection2", "warm_protection3", "explorer_hat", "pirate_hat", "wood_helmet", "stone_helmet", "gold_helmet", "diamond_helmet", "amethyst_helmet", "reidite_helmet", "dragon_helmet", "lava_helmet", "crab_helmet", "diving_mask", "super_diving_suit", "crown_green", "crown_orange", "crown_blue", "hood", "peasant", "winter_hood", "winter_peasant", "bag", "turban1", "turban2", "pilot_hat"]));
          return true;
          break;
        case "building-list":
          this.write_command("Buildings", 1, "List all buildings in the game", this.create_array(["wall", "stone_wall", "gold_wall", "diamond_wall", "amethyst_wall", "reidite_wall", "spike", "stone_spike", "gold_spike", "diamond_spike", "amethyst_spike", "reidite_spike", "wood_door", "stone_door", "gold_door", "diamond_door", "amethyst_door", "reidite_door", "wood_spike_door", "stone_spike_door", "gold_spike_door", "diamond_spike_door", "amethyst_spike_door", "reidite_spike_door"]));
          return true;
          break;
        case "biome-list":
          this.write_command("Biomes list", 1, "List all available biomes in the game", this.create_array(["forest", "winter", "lava", "sea", "beach", "island", "dragon"]));
          return true;
          break;
        case "help-config":
          this.write_command("Help Configuration", 1, "Learn how to build your customized map", '<div class=\"specialCommandBox\">To get the current map configuration, and modify it, copy the result of <span class=\"commandSynthax\">get-config</span> in a text file and change every parameter you want.</div>To modify the settings, change a number to another with <span class=\"commandSynthax\">set-config</span></br>To modify the map, modify \"important\" section (at the end)<div class=\"infoCommand\">The minimum size of the map is 50x50.</div>\"custom_map\" is used to change the biomes and is written like this :<div class=\"commandSynthax\" style=\"font-size:17px;\">\"custom_map\":[[\"biome\",width,height],...,[\"biome\",width,height]]</div>Biomes are <span class=\"commandSynthax\">\"forest\"</span>, <span class=\"commandSynthax\">\"lava\"</span>, <span class=\"commandSynthax\">\"winter\"</span>, and <span class=\"commandSynthax\">\"dragon\"</span>.');
          return true;
          break;
        case "pos":
          var players = world.units[ITEMS.PLAYERS];
          for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if (p.pid === user.id) {
              this.write_command("pos", 1, (("Your position is " + Math.floor(p.x / 100)) + ":") + Math.floor(p.y / 100));
              return true;
            }
          }
          break;
        case "help-admin":
          this.write_command("help-admin", 1, "List all available commands for admin only", this.create_array(["restart", "m | message", "mt | message-to", "w | welcome", "name", "password", "k | kick", "b | ban", "tp | teleport", "tpa | teleport-all", "tpt | teleport-to", "pos", "heal", "cancel-craft", "da | disable-attack", "pvp | disable-pvp", "dgs | disable-gather-score", "drs | disable-resource", "dms | disable-mob-safety", "ds | disable-shop", "dn | disable-nickname", "dch | disable-chat", "dq | disable-quest", "dd | disable-drop", "ddc | disable-drop-crate", "db | disable-crate", "dwg | disable-warm-gauge", "dk | disable-kit", "dc | disable-craft", "dr | disable-recycling", "disable-clock", "disable-recipes-book", "disable-market", "sb | spawn-building", "fsb | force-spawn-building", "sch | spawn-chest", "spawn-area", "spawn-area-team", "cl | clean-position", "cba | clean-building-all", "ci | clean-inventory", "cia | clean-inventory-all", "harvest", "gs | give-score", "gsa | give-score-all", "rs | reset-score", "rk | reset-kill", "gm | godmode", "instant-craft", "ka | kill-animals", "g | give", "ga | give-to-all", "ri | remove-item", "ria | remove-item-all", "spawn-location", "tm | team-mode", "default-nickname", "mm | murder-mode", "br | battle-royale", "help-config", "gc | get-config", "sc | set-config", "reset-config", "save-config", "reset-event-time"]));
          return true;
          break;
        case "help":
          this.write_command("help", 1, "List all available commands", this.create_array(["clean", "list", "pos", "help-admin", "help", "weapon-list", "tool-list", "survival-list", "resource-list", "food-list", "hat-list", "building-list", "biome-list"]));
          return true;
          break;
      }
      return false;
    },
    _open: function () {
      if ('LOLIPOP_CONSOLE' in window && !!window['LOLIPOP_CONSOLE']['state'])
        return;

      if (!this.open) {
        this.open = true;
        this.style.display = "inline-block";
        this.input.focus();
      }
    },
    _send: function () {
      var msg = this.input.value;
      if (msg && (msg.length > 0)) {
        if (!this.commands(msg))
          client.send_command(this.input.value);

        this.input.value = "";
      }
    }
  };
  this.chat = {
    open: false,
    input: document.getElementById('chat_input'),
    style: document.getElementById('chat_block').style,
    update: function () {
      this.style.left = Math.floor((canw / 2) - 150) + "px";
      this.style.top = Math.floor((canh / 2) + 80) + "px";
    },
    quit: function () {
      this.open = false;
      this.style.display = "none";
      this.input.value = "";
    },
    prefix: '!',
    cmd: {
      "hud": function (param) {
        if (param === "off") {
          var msg = 'Enter \"!hud\" without the quotes to restore the HUD';
          if (!user.alert.text)
            user.alert.text = msg;
          else
            user.alert.list.push(msg);
          game.show_ui = 0;
        } else
          game.show_ui = 1;
      }
    },
    commands: function (msg) {
      if (msg.charAt(0) == this.prefix) {
        var cmd = "";
        var param = "";
        for (var i = 1;
          (i < msg.length) && (msg.charAt(i) != " "); i++)
          cmd += msg.charAt(i);
        i++;
        for (; i < msg.length; i++)
          param += msg.charAt(i);
        var fun = this.cmd[cmd];
        if (fun)
          fun(param);

        return true;
      } else
        return false;
    },
    run: function () {
      if ('LOLIPOP_CONSOLE' in window && !!window['LOLIPOP_CONSOLE']['state']) return;

      if (!this.open) {
        this.open = true;
        this.style.display = "inline-block";
        this.input.focus();
      } else {
        this.open = false;
        this.style.display = "none";
        var msg = this.input.value;
        if (msg) {
          if (!this.commands(msg))
            client.send_chat(this.input.value);

          this.input.value = "";
        }
      }
    }
  };
  this.ash = {
    flakes: [],
    update: function (f) {
      f.y += (delta * 80) * f.s;
      f.x += (delta * 80) * f.c;
      f.life -= delta / 6;
      if (f.life > 0.2)
        f.alpha = Math.min(f.alpha + (delta * 3), 1);
      else
        f.alpha = Math.max(f.alpha - (delta * 1), 0);
    },
    add: function (pos) {
      var length = Math.floor(Math.min(SPRITE.ASHES_NUMBER * (canw / 1366), SPRITE.ASHES_NUMBER + 10) * Math.max(Math.min(world.dist_lava + 1000, 3000) / 3000, 0));
      if (this.flakes.length < length) {
        var id = Math.floor(Math.random() * SPRITE.ASHES_SIZES);
        var x = -user.cam.x + Math.floor(Math.random() * user.cam.w);
        var y = -user.cam.y + Math.floor(Math.random() * user.cam.h);
        var angle = Math.random(Math.PI);
        this.flakes.push(new Flakes(id, x, y, angle));
      }
    }
  };
  this.blizzard = 0;
  this.bandage = 0;
  this.desert = {
    flakes: [],
    tempest: 0,
    tempest_speed: 0,
    update: function (f) {
      f.y += (delta * (200 + (800 * this.tempest_speed))) * f.s;
      f.x += (delta * (200 + (800 * this.tempest_speed))) * f.c;
      f.life -= delta / 6;
      if (f.life > 0.2)
        f.alpha = Math.min(f.alpha + (delta * 3), 1);
      else
        f.alpha = Math.max(f.alpha - (delta * 1), 0);
    },
    add: function (pos) {
      var length = Math.floor(Math.min(((this.tempest_speed + 0.1) * SPRITE.SAND_NUMBER) * (canw / 1366), ((this.tempest_speed + 0.1) * SPRITE.SAND_NUMBER) + 10) * Math.max(Math.min(world.dist_desert + 1000, 3000) / 3000, 0));
      if (this.flakes.length < length) {
        var id = Math.floor(Math.random() * SPRITE.ASHES_SIZES);
        var x = -user.cam.x + Math.floor(Math.random() * user.cam.w);
        var y = -user.cam.y + Math.floor(Math.random() * user.cam.h);
        var angle = Math.random(Math.PI);
        if (user.desert.tempest !== 0)
          x -= user.cam.w / 2;

        this.flakes.push(new Flakes(id, x, y, angle));
      }
    }
  };
  this.winter = {
    flakes: [],
    tempest: 0,
    tempest_speed: 0,
    update: function (f) {
      if (keyboard.is_bottom())
        f.y += (delta * f.speed) * (5.5 + (10 * this.tempest_speed));
      else
        f.y += (delta * f.speed) * (5 + (10 * this.tempest_speed));
      f.life -= delta / 2;
      if (keyboard.is_left())
        f.x += delta * (100 + (400 * this.tempest_speed));
      else if (keyboard.is_right())
        f.x -= delta * (130 - (400 * this.tempest_speed));
      else
        f.x -= delta * (30 - (400 * this.tempest_speed));
      if (f.life > 0.2)
        f.alpha = Math.min(f.alpha + (delta * 3), 1);
      else
        f.alpha = Math.max(f.alpha - (delta * 5), 0);
    },
    add: function (pos) {
      var length = Math.floor(Math.min((((this.tempest_speed * 1.5) + 0.5) * SPRITE.FLAKES_NUMBER) * (canw / 1366), (((this.tempest_speed * 1.5) + 0.5) * SPRITE.FLAKES_NUMBER) + 10) * Math.max(Math.min(world.dist_winter + 1000, 3000) / 3000, 0));
      if (this.flakes.length < length) {
        var id = Math.floor(Math.random() * SPRITE.FLAKES_SIZES);
        var x = -user.cam.x + Math.floor(Math.random() * user.cam.w);
        var y = -user.cam.y + Math.floor(((Math.random() * 400) * scale) - (200 * scale));
        this.flakes.push(new Flakes(id, x, y, 0));
      }
    }
  };

  function Beach() {
    this.seed = 1;
    this.seed2 = 2;
    this.seed3 = 3;
    this.seedv = 1;
    this.seedv2 = 2;
    this.seedv3 = 3;
    this.new_seed = function (x) {
      this.seed = 2 + Math.floor(Math.random() * WORLD.SEED);
    };
    this.new_seed2 = function (x) {
      this.seed2 = 2 + Math.floor(Math.random() * WORLD.SEED);
    };
    this.new_seed3 = function (x) {
      this.seed3 = 2 + Math.floor(Math.random() * WORLD.SEED);
    };
    this.new_seedv = function (x) {
      this.seedv = 2 + Math.floor(Math.random() * WORLD.SEED);
    };
    this.new_seedv2 = function (x) {
      this.seedv2 = 2 + Math.floor(Math.random() * WORLD.SEED);
    };
    this.new_seedv3 = function (x) {
      this.seedv3 = 2 + Math.floor(Math.random() * WORLD.SEED);
    };
    this.draw_foam_vert = function (y, p, seed, r1, r2, _left, _right) {
      for (var i = 1; i < _right;) {
        var j = (i * seed) % RAND_SIZE;
        var v = RANDOM[j];
        if (v < 0.1) {
          r += 50;
          i += 50;
          continue;
        }
        var r = Math.floor((v * r1) + r2);
        if ((i > _left) && (i < _right)) {
          var s = (Math.random() > 0.5) ? (-10 * delta) : (10 * delta);
          var radius = r * p;
          this.bxv[j] = Math.max(-WORLD.FLOAM_X, Math.min(WORLD.FLOAM_X, this.bxv[j] + s));
          this.byv[j] = Math.max(-WORLD.FLOAM_Y, Math.min(WORLD.FLOAM_Y, this.byv[j] + s));
          if (radius > 0) {
            ctx.beginPath();
            ctx.arc((i + user.cam.x) + this.byv[j], (y + this.bxv[j]) - (WORLD.FLOAM_X * 0.8), radius, 0, Math.PI * 2);
            if (world.transition) {
              var shade = world.time ? (1 - world.shade.v) : world.shade.v;
              ctx.fillStyle = get_color_transition(83, 156, 160, 236, 247, 249, shade);
            } else
              ctx.fillStyle = SPRITE.FLOAM_COLOR[world.time];
            ctx.fill();
          }
        }
        i += 2 * r;
      }
    };
    this.draw_foam = function (x, p, seed, r1, r2, _top, _bottom) {
      for (var i = 1; i < _bottom;) {
        var j = (i * seed) % RAND_SIZE;
        var v = RANDOM[j];
        if (v < 0.1) {
          r += 50;
          i += 50;
          continue;
        }
        var r = Math.floor((v * r1) + r2);
        if ((i > _top) && (i < _bottom)) {
          var s = (Math.random() > 0.5) ? (-10 * delta) : (10 * delta);
          var radius = r * p;
          this.bx[j] = Math.max(-WORLD.FLOAM_X, Math.min(WORLD.FLOAM_X, this.bx[j] + s));
          this.by[j] = Math.max(-WORLD.FLOAM_Y, Math.min(WORLD.FLOAM_Y, this.by[j] + s));
          if (radius > 0) {
            ctx.beginPath();
            ctx.arc((x + this.bx[j]) - (WORLD.FLOAM_X * 0.8), (i + user.cam.y) + this.by[j], radius, 0, Math.PI * 2);
            if (world.transition) {
              var shade = world.time ? (1 - world.shade.v) : world.shade.v;
              ctx.fillStyle = get_color_transition(83, 156, 160, 236, 247, 249, shade);
            } else
              ctx.fillStyle = SPRITE.FLOAM_COLOR[world.time];
            ctx.fill();
          }
        }
        i += 2 * r;
      }
    };
    this.draw_foams_bottom = function (y, y2, y3, diff_y, _left, _right) {
      _left -= 30;
      _right += 30;
      var p = -((((y3 - WORLD.LW1SX) - diff_y) - 2) / WORLD.W1EX);
      if (p === 0)
        this.new_seed3();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam_vert(y3, p, this.seed3, 18, 16, _left, _right);
      ctx.globalAlpha = 1;
      var p = -((((y - WORLD.LW2SX) - diff_y) + 500) / WORLD.W2EX);
      if (p === 0)
        this.new_seed();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam_vert(y, p, this.seed, 12, 10, _left, _right);
      ctx.globalAlpha = 1;
      if (y2 === -1)
        return;

      var p = -((((y2 - WORLD.LW3SX) - diff_y) + 698) / WORLD.W3EX);
      if (p <= 0.01)
        this.new_seed2();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam_vert(y2, p, this.seed2, 6, 6, _left, _right);
      ctx.globalAlpha = 1;
    };
    this.draw_foams_top = function (y, y2, y3, diff_y, _left, _right) {
      _left -= 30;
      _right += 30;
      var p = -((((-y3 + WORLD.LW1SX) + diff_y) + 2) / WORLD.W1EX);
      if (p === 0)
        this.new_seed3();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam_vert(y3, p, this.seed3, 18, 16, _left, _right);
      ctx.globalAlpha = 1;
      var p = -(((-y + WORLD.LW2SX) + diff_y) / WORLD.W2EX);
      if (p === 0)
        this.new_seed();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam_vert(y, p, this.seed, 12, 10, _left, _right);
      ctx.globalAlpha = 1;
      if (y2 === -1)
        return;

      var p = -(((-y2 + WORLD.LW3SX) + diff_y) / WORLD.W3EX);
      if (p <= 0.01)
        this.new_seed2();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam_vert(y2, p, this.seed2, 6, 6, _left, _right);
      ctx.globalAlpha = 1;
    };
    this.draw_foams_left = function (x, x2, x3, diff_x, _top, _bottom) {
      _top -= 30;
      _bottom += 30;
      var p = -((((-x3 + WORLD.LW1SX) + diff_x) + 2) / WORLD.W1EX);
      if (p === 0)
        this.new_seed3();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam(x3, p, this.seed3, 18, 16, _top, _bottom);
      ctx.globalAlpha = 1;
      var p = -(((-x + WORLD.LW2SX) + diff_x) / WORLD.W2EX);
      if (p === 0)
        this.new_seed();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam(x, p, this.seed, 12, 10, _top, _bottom);
      ctx.globalAlpha = 1;
      if (x2 === -1)
        return;

      var p = -(((-x2 + WORLD.LW3SX) + diff_x) / WORLD.W3EX);
      if (p <= 0.01)
        this.new_seed2();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam(x2, p, this.seed2, 6, 6, _top, _bottom);
      ctx.globalAlpha = 1;
    };
    this.draw_foams_right = function (x, x2, x3, diff_x, _top, _bottom) {
      _top -= 30;
      _bottom += 30;
      var p = -((((x3 - WORLD.LW1SX) - diff_x) - 2) / WORLD.W1EX);
      if (p === 0)
        this.new_seed3();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam(x3, p, this.seed3, 18, 16, _top, _bottom);
      ctx.globalAlpha = 1;
      var p = -((((x - WORLD.LW2SX) - diff_x) + 500) / WORLD.W2EX);
      if (p === 0)
        this.new_seed();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam(x, p, this.seed, 12, 10, _top, _bottom);
      ctx.globalAlpha = 1;
      if (x2 === -1)
        return;

      var p = -((((x2 - WORLD.LW3SX) - diff_x) + 698) / WORLD.W3EX);
      if (p <= 0.01)
        this.new_seed2();

      ctx.globalAlpha = Utils.ease_in_out_quad(p);
      this.draw_foam(x2, p, this.seed2, 6, 6, _top, _bottom);
      ctx.globalAlpha = 1;
    };
    this.w1 = {
      r: new Utils.Ease(Utils.ease_out_cubic, 0, 10, WORLD.W1SX, WORLD.W1SX, WORLD.W1EX),
      l: new Utils.Ease(Utils.ease_in_out_cubic, 0, 10, WORLD.W1EX, WORLD.W1EX, WORLD.W1SX)
    };
    this.w2 = {
      r: new Utils.Ease(Utils.ease_out_quart, 0, 10, WORLD.W2SX, WORLD.W2SX, WORLD.W2EX),
      l: new Utils.Ease(Utils.ease_in_out_quad, 0, 10, WORLD.W2EX, WORLD.W2EX, WORLD.W2SX)
    };
    this.w3 = {
      r: new Utils.Ease(Utils.ease_out_quint, 0, 10, WORLD.W3SX, WORLD.W3SX, WORLD.W3EX),
      l: new Utils.Ease(Utils.ease_in_out_quad, 0, 10, WORLD.W3EX, WORLD.W3EX, WORLD.W3SX)
    };
    this.t_ = function (w_) {
      var w;
      if (w_.r.x === w_.r.ex) {
        if (w_.l.x === w_.l.ex) {
          w = w_.r;
        } else
          w = w_.l;
      } else
        w = w_.r;
      return w;
    };
    this.t = function (w_) {
      var w;
      if (w_.r.x === w_.r.ex) {
        if (w_.l.x === w_.l.ex) {
          w_.r.restart();
          w_.l.restart();
          w = w_.r;
        } else
          w = w_.l;
      } else
        w = w_.r;
      w.ease(w.ex);
      return w;
    };
    this.bx = [];
    this.by = [];
    this.bxv = [];
    this.byv = [];
    this.init = function () {
      for (var i = 0; i < RAND_SIZE; i++) {
        this.bx[i] = Math.floor(RANDOM[i] * WORLD.FLOAM_X);
        this.by[i] = Math.floor(RANDOM[i] * WORLD.FLOAM_Y);
        this.bxv[i] = Math.floor(RANDOM[i] * WORLD.FLOAM_X);
        this.byv[i] = Math.floor(RANDOM[i] * WORLD.FLOAM_Y);
      }
      this.w1.r.x = this.w1.r.ex;
      this.w2.r.ed = 3.5;
      this.w3.r.ed = 2;
    };
    this.init();
  };;
  this.beach = [];
  for (var i = 0; i < 4; i++)
    this.beach.push(new Beach);
};
