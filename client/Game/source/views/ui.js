function UI(can, ctx) {
  this.can = can;
  this.ctx = ctx;
  if (window.navigator.userAgent.indexOf("Edge") > -1) {
    this.cursor0 = "default";
    this.cursor1 = "pointer";
  } else {
    this.cursor0 = "url(\'img/cursor0.png\'), default";
    this.cursor1 = "url(\'img/cursor1.png\'), pointer";
  }
  var _this = this;
  this.waiting = false;
  this.in_this_view = 0;
  this.current_mode_score = -1;
  this.loading = {
    translate: {
      x: 0,
      y: 0
    },
    angle: 0,
    img: sprite[SPRITE.GEAR2],
    draw: function () {
      this.angle += delta * 2;
      ctx.save();
      ctx.translate(this.translate.x + (this.img.width / 2), this.translate.y + (this.img.height / 2));
      ctx.rotate(this.angle);
      ctxDrawImage(ctx, this.img, -this.img.width / 2, -this.img.height / 2);
      ctx.restore();
    }
  };

  this.bread = 0;
  this.previous_bread = -1;
  this.bread_img = undefined;
  this.new_nickname = "";
  this.previous_new_nickname = "";
  this.new_nickname_img = undefined;

  this.xp = 0;
  this.xp_dest = 0;
  this.firstName = 0;
  this.kill = 0;
  this.death = 0;
  this.time = 0;
  this.score = 0;
  this.scoreTotal = 0;
  this.bestKill = 0;
  this.bestTime = 0;
  this.bestScore = 0;
  this.seasons = [];
  this.kit = -1;
  this.previous_kit_hour = -1;
  this.previous_kit_min = -1;
  this.kit_img_min = undefined;
  this.kit_img_hour = undefined;
  this.privateServerTime = -1;
  this.previous_privateServerTime_day = -1;
  this.previous_privateServerTime_hour = -1;
  this.previous_privateServerTime_min = -1;
  this.privateServerTime_img_min = undefined;
  this.privateServerTime_img_hour = undefined;
  this.privateServerTime_img_day = undefined;
  this.cosmetic_name = undefined;
  this.cosmetic_author = undefined;
  this.profile_season = 3;
  this.breath = 0;

  function CosmeticSelector(___type, first, ___setter, firstId, unlock) {
    var __this = this;
    var last = first + 9;
    var cursor = 0;
    var currentId = firstId;
    for (var i = first; i < last; i++) {
      _this.buttons[i].info.callback = onClickCosmetic;
      _this.buttons[i].info.cosmeticType = ___type;
    }

    function loadText() {
      var info = ___type[currentId];
      ui.cosmetic_name = gui_render_text(info.name, "\'Baloo Paaji\', sans-serif", "#EFE4B4", 30, 350, undefined, 10, 8);
      if (info.level !== undefined)
        ui.cosmetic_author = gui_render_text("Level " + info.level, "\'Baloo Paaji\', sans-serif", "#EFE4B4", 30, 250, undefined, 10, 8);
      else
        ui.cosmetic_author = gui_render_text("by " + info.author, "\'Baloo Paaji\', sans-serif", "#EFE4B4", 30, 250, undefined, 10, 8);
    };;

    function onClickCosmetic() {
      if ((currentId === this.cosmeticId) || (this.cosmeticId === -1))
        return;

      if (this.unlocked > 0) {
        if (first === FIRST_BUTTON_SKIN)
          update_subview(__LOCKED_SKIN__, __HIDE__, "none");
        else
          update_subview(__LOCKED_ACC__, __HIDE__, "none");
      } else {
        if (first === FIRST_BUTTON_SKIN)
          update_subview(__LOCKED_SKIN__, __DISPLAY__, "inline-block");
        else
          update_subview(__LOCKED_ACC__, __DISPLAY__, "inline-block");
      }
      currentId = this.cosmeticId;
      ___setter(this.cosmeticId);
      loadText();
    };;

    function moveNext() {
      if (((cursor * 3) + 9) < ___type.length)
        cursor++;

      __this.initSelector();
    };;

    function movePrevious() {
      if (cursor > 0)
        cursor--;

      __this.initSelector();
    };;

    function initSelector() {
      for (var i = first, j = cursor * 3;
        (i < last) && (j < ___type.length); i++, j++) {
        if ((___type[j].rarity === RARITY.SPECIAL) && (unlock[j] === 0)) {
          _this.buttons[i].info.cosmeticId = -1;
          _this.buttons[i].info.active = __HIDE__;
          continue;
        }
        _this.buttons[i].info.cosmeticId = j;
        for (var k = 0; k < 3; k++) {
          _this.buttons[i].info.img[k] = RARITY_BUTTON[___type[j].rarity][k];
          _this.buttons[i].info.active = __DISPLAY__;
          _this.buttons[i].info.unlocked = unlock[j];
        }
      }
      for (; i < last; i++) {
        _this.buttons[i].info.cosmeticId = -1;
        _this.buttons[i].info.active = __HIDE__;
      }
      loadText();
    };;
    this.initSelector = initSelector;
    _this.buttons[last].info.callback = movePrevious;
    _this.buttons[last + 1].info.callback = moveNext;
  };;
  this.settings = false;
  this.quality = Cookies.get("starve_quality") ? Cookies.get("starve_quality") : "high";
  if (this.quality === "high") {
    document.getElementById("high_ing").style.backgroundColor = "#B56D18";
    document.getElementById("low_ing").style.backgroundColor = "#3A2A0D";
    this.quality = 1;
  } else {
    document.getElementById("low_ing").style.backgroundColor = "#B56D18";
    document.getElementById("high_ing").style.backgroundColor = "#3A2A0D";
    this.quality = 0;
  }
  this.high_quality = function () {
    document.getElementById("high_ing").style.backgroundColor = "#B56D18";
    document.getElementById("low_ing").style.backgroundColor = "#3A2A0D";
    Cookies.set("starve_quality", "high", {
      expires: 30
    });
    document.getElementById("input_ratio").value = 1;
    game.change_ratio();
    ui.quality = 1;
  };
  this.low_quality = function () {
    document.getElementById("high_ing").style.backgroundColor = "#3A2A0D";
    document.getElementById("low_ing").style.backgroundColor = "#B56D18";
    Cookies.set("starve_quality", "low", {
      expires: 30
    });
    document.getElementById("input_ratio").value = 0.5 / (devicePixelRatio / backingStoreRatio);
    game.change_ratio();
    ui.quality = 0;
  };
  if ((Cookies.get("starve_mapping") === undefined) && (lang === "FR")) {
    keyboard.set_azerty();
    this.mapping = "azerty";
  } else
    this.mapping = Cookies.get("starve_mapping") ? Cookies.get("starve_mapping") : "qwerty";
  if (this.mapping == "azerty") {
    keyboard.set_azerty();
    document.getElementById("azerty_ing").style.backgroundColor = "#B56D18";
    document.getElementById("qwerty_ing").style.backgroundColor = "#3A2A0D";
  } else {
    document.getElementById("qwerty_ing").style.backgroundColor = "#B56D18";
    document.getElementById("azerty_ing").style.backgroundColor = "#3A2A0D";
  }
  this.set_azerty = function () {
    keyboard.set_azerty();
    document.getElementById("azerty_ing").style.backgroundColor = "#B56D18";
    document.getElementById("qwerty_ing").style.backgroundColor = "#3A2A0D";
    Cookies.set("starve_mapping", "azerty", {
      expires: 30
    });
  };
  this.set_qwerty = function () {
    keyboard.set_qwerty();
    document.getElementById("azerty_ing").style.backgroundColor = "#3A2A0D";
    document.getElementById("qwerty_ing").style.backgroundColor = "#B56D18";
    Cookies.set("starve_mapping", "qwerty", {
      expires: 30
    });
  };

  function init_skin() {
    var ct = Number(Cookies.get("starve_crate"));
    var dd = Number(Cookies.get("starve_dead"));
    var bk = Number(Cookies.get("starve_book"));
    var bg = Number(Cookies.get("starve_bag"));
    var sk = Number(Cookies.get("starve_skin"));
    var ac = Number(Cookies.get("starve_accessory"));
    _this.skin = sk ? sk : 0;
    _this.book = bk ? bk : 0;
    _this.crate = ct ? ct : 1;
    _this.accessory = ac ? ac : 0;
    _this.bag = bg ? bg : 0;
    _this.dead = dd ? dd : 0;
  };;
  init_skin();
  this.unlock = {};
  this.unlock.skin = [];
  this.unlock.bag = [];
  this.unlock.book = [];
  this.unlock.crate = [];
  this.unlock.dead = [];
  this.unlock.accessory = [];
  this.day_mode = 0;

  function unlock_cosmetics() {
    var cosmetic = COSMETICS.SKIN;
    for (var i = 0; i < cosmetic.length; i++) {
      if (cosmetic[i].rarity === RARITY.FREE)
        _this.unlock.skin[i] = 1;
      else
        _this.unlock.skin[i] = 0;
    }
    var cosmetic = COSMETICS.ACCESSORY;
    for (var i = 0; i < cosmetic.length; i++) {
      if (cosmetic[i].rarity === RARITY.FREE)
        _this.unlock.accessory[i] = 1;
      else
        _this.unlock.accessory[i] = 0;
    }
    var cosmetic = COSMETICS.BAG;
    for (var i = 0; i < cosmetic.length; i++) {
      if (cosmetic[i].rarity === RARITY.FREE)
        _this.unlock.bag[i] = 1;
      else
        _this.unlock.bag[i] = 0;
    }
    var cosmetic = COSMETICS.BOOK;
    for (var i = 0; i < cosmetic.length; i++) {
      if (cosmetic[i].rarity === RARITY.FREE)
        _this.unlock.book[i] = 1;
      else
        _this.unlock.book[i] = 0;
    }
    var cosmetic = COSMETICS.CRATE;
    for (var i = 0; i < cosmetic.length; i++) {
      if (cosmetic[i].rarity === RARITY.FREE) {
        _this.unlock.crate[i] = 1;
        _this.unlock.dead[i] = 1;
      } else {
        _this.unlock.crate[i] = 0;
        _this.unlock.dead[i] = 0;
      }
    }
  };;
  this.unlock_cosmetics = unlock_cosmetics;
  unlock_cosmetics();

  var appear_effect_step = 0;
  var appear_effect_max_step = 30;
  var appear_effect = function () {
    _this.update();
    appear_effect_step++;
    if (appear_effect_step == appear_effect_max_step) {
      _this.add_event_listener();
      _this.in_this_view = true;
      _this.update();
      return;
    }
    window.setTimeout(appear_effect, 33);
  };
  this.quit = function (fun) {
    fun_after_quit = fun;
    _this.remove_event_listener();
    _this.in_this_view = 0;
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
      // Cookies.set("starve_nickname", _this.nickname.input.value, {
      //   expires: 30
      // });
      // _this.nickname.style.display = "none";
      // _this.server_list.style.display = "none";
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
    document.getElementById("game_body").style.backgroundColor = SPRITE.GROUND[fake_world.time];
    // _this.nickname.style.display = "inline-block";
    // _this.server_list.style.display = "inline-block";
    _this.waiting = false;
    _this.is_run = true;
    quit_effect_step = -1;
    appear_effect_step = 0;
    appear_effect();
  };
  this.update_component = function (component, effect) {
    if (component === undefined || typeof component === 'undefined')
      return;

    effect = (effect < 0) ? -effect : effect;
    if ((component.position & __MIDDLE_X__) === __MIDDLE_X__) {
      if ((component.position & __LEFT__) === __LEFT__)
        component.translate.x = (canw2 + component.translate._x) - effect;
      else if ((component.position & __RIGHT__) === __RIGHT__)
        component.translate.x = (canw2 + component.translate._x) + effect;
      else
        component.translate.x = canw2 + component.translate._x;
    } else if ((component.position & __LEFT__) === __LEFT__)
      component.translate.x = component.translate._x - effect;
    else if ((component.position & __RIGHT__) === __RIGHT__)
      component.translate.x = (canw - component.translate._x) + effect;
    else
      component.translate.x = component.translate._x;
    if ((component.position & __MIDDLE_Y__) === __MIDDLE_Y__) {
      if ((component.position & __TOP__) === __TOP__)
        component.translate.y = (canh2 + component.translate._y) - effect;
      else if ((component.position & __BOTTOM__) === __BOTTOM__)
        component.translate.y = (canh2 + component.translate._y) + effect;
      else
        component.translate.y = canh2 + component.translate._y;
    } else if ((component.position & __TOP__) === __TOP__)
      component.translate.y = component.translate._y - effect;
    else if ((component.position & __BOTTOM__) === __BOTTOM__)
      component.translate.y = (canh + component.translate._y) + effect;
    else
      component.translate.y = component.translate._y;
    if (component.style !== undefined) {
      component.style.left = Math.floor(component.translate.x) + "px";
      component.style.top = Math.floor(component.translate.y) + "px";
    }
  };
  this.update = function () {
    var effect = 0;
    if ((appear_effect_step != appear_effect_max_step) || (quit_effect_step != -1)) {
      if (appear_effect_step != appear_effect_max_step)
        var effect = (1500 / (appear_effect_step + 1)) - 50;

      if (quit_effect_step != -1)
        var effect = -((1750 / ((quit_effect_max_step - quit_effect_step) + 1)) - 48);

    }
    for (var i = 0; i < this.bkgd.length; i++)
      this.update_component(this.bkgd[i], effect);
    for (var i = 0; i < this.buttons.length; i++)
      this.update_component(this.buttons[i].info, effect);
    for (var i = 0; i < this.css.length; i++)
      this.update_component(this.css[i], effect);
    this.loading.translate.x = (canw - this.loading.img.width) / 2;
    this.loading.translate.y = 0;
    if ((appear_effect_step != appear_effect_max_step) || (quit_effect_step != -1)) {
      var move_effect = 0;
      if (appear_effect_step != appear_effect_max_step) {
        var move_effect = (1500 / (appear_effect_step + 1)) - 50;
      }
      if (quit_effect_step != -1) {
        var move_effect = -((1750 / ((quit_effect_max_step - quit_effect_step) + 1)) - 48);
      }
      this.loading.translate.y -= (move_effect > 0) ? move_effect : -move_effect;
    }
  };

  this.draw = function () {
    draw_fake_world();

    for (var i = 2; i < this.bkgd.length; i++) {
      if (this.bkgd[i].active === __DISPLAY__)
        this.bkgd[i].draw(ctx);

    }

    if ((this.current_view & __GAME__) === __GAME__)
      this.buttons[GAME_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __COSMETICS__) === __COSMETICS__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __SKIN__) === __SKIN__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __BAG__) === __BAG__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __CRATE__) === __CRATE__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __BOOK__) === __BOOK__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __ACCESSORY__) === __ACCESSORY__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;
    else if ((this.current_view & __LOOT__) === __LOOT__)
      this.buttons[COSMETICS_BUTTON].info.state = BUTTON_CLICK;


    if (((this.current_view & __GAME__) === __GAME__)) {
      if (this.buttons[NORMAL_MODE].in_button(mouse.pos))
        this.buttons[NORMAL_MODE].hint = Math.min(1, this.buttons[NORMAL_MODE].hint + (delta * 1.5));
      else
        this.buttons[NORMAL_MODE].hint = Math.max(0, this.buttons[NORMAL_MODE].hint - (delta * 1.5));
      if (this.buttons[FOREST_MODE].in_button(mouse.pos))
        this.buttons[FOREST_MODE].hint = Math.min(1, this.buttons[FOREST_MODE].hint + (delta * 1.5));
      else
        this.buttons[FOREST_MODE].hint = Math.max(0, this.buttons[FOREST_MODE].hint - (delta * 1.5));
      if (this.buttons[MODE_COMMUNITY].in_button(mouse.pos))
        this.buttons[MODE_COMMUNITY].hint = Math.min(1, this.buttons[MODE_COMMUNITY].hint + (delta * 1.5));
      else
        this.buttons[MODE_COMMUNITY].hint = Math.max(0, this.buttons[MODE_COMMUNITY].hint - (delta * 1.5));
      if (this.buttons[MODE_EXPERIMENTAL].in_button(mouse.pos))
        this.buttons[MODE_EXPERIMENTAL].hint = Math.min(1, this.buttons[MODE_EXPERIMENTAL].hint + (delta * 1.5));
      else
        this.buttons[MODE_EXPERIMENTAL].hint = Math.max(0, this.buttons[MODE_EXPERIMENTAL].hint - (delta * 1.5));
      if (this.buttons[ZOMBIE_MODE].in_button(mouse.pos))
        this.buttons[ZOMBIE_MODE].hint = Math.min(1, this.buttons[ZOMBIE_MODE].hint + (delta * 1.5));
      else
        this.buttons[ZOMBIE_MODE].hint = Math.max(0, this.buttons[ZOMBIE_MODE].hint - (delta * 1.5));
      if (this.buttons[VAMPIRE_MODE].in_button(mouse.pos))
        this.buttons[VAMPIRE_MODE].hint = Math.min(1, this.buttons[VAMPIRE_MODE].hint + (delta * 1.5));
      else
        this.buttons[VAMPIRE_MODE].hint = Math.max(0, this.buttons[VAMPIRE_MODE].hint - (delta * 1.5));
    }
    var _r = 1;

    for (var i = 1; i < this.buttons.length; i++) {
      if (this.buttons[i].info.active === __DISPLAY__)
        this.buttons[i].draw(ctx);

    }
    this.bkgd[0].draw(ctx);
    this.buttons[0].draw(ctx);
    if ((this.current_view & ((((__COSMETICS__ | __BAG__) | __BOOK__) | __SKIN__) | __ACCESSORY__)) > 1) {
      var _x = ((this.current_view & (((__BAG__ | __BOOK__) | __SKIN__) | __ACCESSORY__)) > 1) ? -190 : 0;
      var img = sprite[SPRITE.BAG][this.bag][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) + _x, 183, img.width / 2, img.height / 2);
      this.breath = (this.breath + (delta * 1000)) % 2000;
      var v = (4.5 * (this.breath < 1000)) ? (this.breath / 1000) : ((2000 - this.breath) / 1000);
      var img = sprite[SPRITE.BOOK][this.book][this.day_mode];
      ctxDrawImage(ctx, img, (((canw2 - (img.width / 4)) - 62) + v) + _x, 240, img.width / 2, img.height / 2);
      var img = sprite[SPRITE.HAND][this.skin][this.day_mode];
      ctxDrawImage(ctx, img, (((canw2 - (img.width / 4)) - 54) + v) + _x, 272, img.width / 2, img.height / 2);
      ctxDrawImage(ctx, img, (((canw2 - (img.width / 4)) + 54) - v) + _x, 272, img.width / 2, img.height / 2);
      var img = sprite[SPRITE.BODY][this.skin][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) + _x, 222, img.width / 2, img.height / 2);
      var img = sprite[SPRITE.ACCESSORY][this.accessory][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) + _x, 222, img.width / 2, img.height / 2);
    }
    if ((this.current_view & __COSMETICS__) === __COSMETICS__) {
      var img = sprite[SPRITE.CRATE][this.crate][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) - 61, 406 - (img.height / 4), img.width / 2, img.height / 2);
      var img = sprite[SPRITE.CRATE][this.dead][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) + 53, 406 - (img.height / 4), img.width / 2, img.height / 2);
    }
    if ((this.current_view & __CRATE__) === __CRATE__) {
      var img = sprite[SPRITE.CRATE][this.dead][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) - 200, 268 - (img.height / 4), img.width / 2, img.height / 2);
    }
    if ((this.current_view & __LOOT__) === __LOOT__) {
      var img = sprite[SPRITE.CRATE][this.crate][this.day_mode];
      ctxDrawImage(ctx, img, (canw2 - (img.width / 4)) - 200, 268 - (img.height / 4), img.width / 2, img.height / 2);
    }
    if ((this.current_view & (((((__BAG__ | __BOOK__) | __SKIN__) | __ACCESSORY__) | __CRATE__) | __LOOT__)) > 1) {
      for (var i = 1; i < this.buttons.length; i++) {
        if ((this.buttons[i].view & this.current_view) === 0)
          continue;

        var button = this.buttons[i].info;
        if (button.cosmeticId >= 0) {
          var img = button.cosmeticType[button.cosmeticId].day;
          ctxDrawImage(ctx, img, (button.translate.x - (img.width / 8)) + 44.5, (button.translate.y - (img.height / 8)) + 45.5, img.width / 4, img.height / 4);
          if (button.unlocked !== 1) {
            var img = IMAGES.RED_LOCKED;
            ctxDrawImage(ctx, img, (button.translate.x - (img.width / 4)) + 44.5, (button.translate.y - (img.height / 4)) + 44.5, img.width / 2, img.height / 2);
          }
        }
      }
      var img = this.cosmetic_name;
      ctxDrawImage(ctx, img, canw2 - 312, 375, img.width / 2, img.height / 2);
      var img = this.cosmetic_author;
      ctxDrawImage(ctx, img, canw2 - 312, 395, img.width / 2, img.height / 2);
    }

    var hint = this.buttons[NORMAL_MODE].hint;
    if (hint > 0) {
      var img = IMAGES.NORMAL_MODE_HOVER;
      ctxDrawImage(ctx, img, canw2 - (img.width / 4), -36 - ((img.height * Utils.ease_in_out_quad(1 - hint)) / 2), img.width / 2, img.height / 2);
    }
    var hint = this.buttons[FOREST_MODE].hint;
    if (hint > 0) {
      var img = IMAGES.FOREST_MODE_HOVER;
      ctxDrawImage(ctx, img, canw2 - (img.width / 4), -36 - ((img.height * Utils.ease_in_out_quad(1 - hint)) / 2), img.width / 2, img.height / 2);
    }
    var hint = this.buttons[MODE_COMMUNITY].hint;
    if (hint > 0) {
      var img = IMAGES.MODE_COMMUNITY_HOVER;
      ctxDrawImage(ctx, img, canw2 - (img.width / 4), -36 - ((img.height * Utils.ease_in_out_quad(1 - hint)) / 2), img.width / 2, img.height / 2);
    }
    var hint = this.buttons[MODE_EXPERIMENTAL].hint;
    if (hint > 0) {
      var img = IMAGES.MODE_EXPERIMENTAL_HOVER;
      ctxDrawImage(ctx, img, canw2 - (img.width / 4), -36 - ((img.height * Utils.ease_in_out_quad(1 - hint)) / 2), img.width / 2, img.height / 2);
    }
    var hint = this.buttons[VAMPIRE_MODE].hint;
    if (hint > 0) {
      var img = IMAGES.VAMPIRE_MODE_HOVER;
      ctxDrawImage(ctx, img, canw2 - (img.width / 4), -36 - ((img.height * Utils.ease_in_out_quad(1 - hint)) / 2), img.width / 2, img.height / 2);
    }
    var hint = this.buttons[ZOMBIE_MODE].hint;
    if (hint > 0) {
      var img = IMAGES.ZOMBIE_MODE_HOVER;
      ctxDrawImage(ctx, img, canw2 - (img.width / 4), -36 - ((img.height * Utils.ease_in_out_quad(1 - hint)) / 2), img.width / 2, img.height / 2);
    }


    user.alert.draw("#FFF", "#000");
    if (_this.waiting)
      this.loading.draw();

  };
  var COUNTER = 0;
  var __GAME__ = Math.pow(2, COUNTER++);
  var __COSMETICS__ = Math.pow(2, COUNTER++);
  var __BUY__ = Math.pow(2, COUNTER++);
  this.__BUY__ = __BUY__;
  var __LOCKED_SKIN__ = Math.pow(2, COUNTER++);
  var __LOCKED_ACC__ = Math.pow(2, COUNTER++);

  var __SKIN__ = Math.pow(2, COUNTER++);
  var __CRATE__ = Math.pow(2, COUNTER++);
  var __BAG__ = Math.pow(2, COUNTER++);
  var __BOOK__ = Math.pow(2, COUNTER++);
  var __ACCESSORY__ = Math.pow(2, COUNTER++);
  var __LOOT__ = Math.pow(2, COUNTER++);

  this.current_view = __GAME__;

  function update_subview(view, mode, _css) {
    for (var i = 0; i < _this.bkgd.length; i++) {
      if ((_this.bkgd[i].view & view) !== 0)
        _this.bkgd[i].active = mode;

    }
    for (var i = 0; i < _this.buttons.length; i++) {
      if ((_this.buttons[i].view & view) !== 0)
        _this.buttons[i].info.active = mode;

    }
    for (var i = 0; i < _this.css.length; i++) {
      if ((_this.css[i].view & view) !== 0)
        _this.css[i].style.display = _css;

    }
  };;
  var assetInfo = [];

  function correct_selected_skin() {
    var ct = Number(Cookies.get("starve_crate"));
    var dd = Number(Cookies.get("starve_dead"));
    var bk = Number(Cookies.get("starve_book"));
    var bg = Number(Cookies.get("starve_bag"));
    var sk = Number(Cookies.get("starve_skin"));
    var ac = Number(Cookies.get("starve_accessory"));
    if (!(ui.unlock.skin[ui.skin] > 0))
      ui.skin = !(ui.unlock.skin[sk] > 0) ? 0 : sk;

    if (!(ui.unlock.book[ui.book] > 0))
      ui.book = !(ui.unlock.book[bk] > 0) ? 0 : bk;

    if (!(ui.unlock.dead[ui.dead] > 0))
      ui.dead = !(ui.unlock.dead[dd] > 0) ? 0 : dd;

    if (!(ui.unlock.crate[ui.crate] > 0))
      ui.crate = !(ui.unlock.crate[ct] > 0) ? 0 : ct;

    if (!(ui.unlock.accessory[ui.accessory] > 0))
      ui.accessory = !(ui.unlock.accessory[ac] > 0) ? 0 : ac;

    if (!(ui.unlock.bag[ui.bag] > 0))
      ui.bag = !(ui.unlock.bag[bg] > 0) ? 0 : bg;

  };;

  function select_subview(view) {
    if (_this.in_this_view === false)
      return;

    update_subview(__LOCKED_SKIN__, __HIDE__, "none");
    update_subview(__LOCKED_ACC__, __HIDE__, "none");
    correct_selected_skin();
    if ((view === _this.current_view))
      return;

    update_subview(_this.current_view, __HIDE__, "none");
    _this.current_view = view;
    update_subview(_this.current_view, __DISPLAY__, "inline-block");
  };;
  this.select_subview = select_subview;

  this.play_game = function () {
    if (_this.waiting === false) {
      user.reconnect.enabled = false;
      _this.waiting = true;

      correct_selected_skin();
      client.connect();
    }
  };
  var __LEFT__ = 1;
  var __RIGHT__ = 2;
  var __TOP__ = 4;
  var __BOTTOM__ = 8;
  var __MIDDLE_X__ = 16;
  var __MIDDLE_Y__ = 32;
  var __NO_HD__ = 0;
  var __HD__ = 1;
  var __NO_BREATH__ = 0;
  var __BREATH__ = 1;
  var __HIDE__ = 0;
  var __DISPLAY__ = 1;
  // if (window.innerWidth < 1300) {
  //   this.nickname = {
  //     id: document.getElementById("nickname_block"),
  //     style: document.getElementById("nickname_block").style,
  //     input: document.getElementById("nickname_input"),
  //     active: __DISPLAY__,
  //     position: __TOP__ | __LEFT__,
  //     view: __GAME__,
  //     translate: {
  //       x: 0,
  //       y: 0,
  //       _x: 200,
  //       _y: 184
  //     }
  //   };
  // } else {
  //   this.nickname = {
  //     id: document.getElementById("nickname_block"),
  //     style: document.getElementById("nickname_block").style,
  //     input: document.getElementById("nickname_input"),
  //     active: __DISPLAY__,
  //     position: __TOP__ | __MIDDLE_X__,
  //     view: __GAME__,
  //     translate: {
  //       x: 0,
  //       y: 0,
  //       _x: -180,
  //       _y: 184
  //     }
  //   };
  // }
  // this.nickname.id.addEventListener("keyup", function (event) {
  //   event.preventDefault();
  //   if (((event.keyCode == 13) && !_this.waiting) && !_this.settings)
  //     _this.play_game();

  // });
  // this.nickname.input.value = Cookies.get("starve_nickname") ? Cookies.get("starve_nickname") : "";
  // if (window.innerWidth < 1300)
  //   this.server_list = {
  //     id: document.getElementById("servselect"),
  //     style: document.getElementById("servselect").style,
  //     active: __DISPLAY__,
  //     position: __TOP__ | __LEFT__,
  //     view: __GAME__,
  //     translate: {
  //       x: 0,
  //       y: 0,
  //       _x: 208,
  //       _y: 225
  //     }
  //   };
  // else
  //   this.server_list = {
  //     id: document.getElementById("servselect"),
  //     style: document.getElementById("servselect").style,
  //     active: __DISPLAY__,
  //     position: __TOP__ | __MIDDLE_X__,
  //     view: __GAME__,
  //     translate: {
  //       x: 0,
  //       y: 0,
  //       _x: -180,
  //       _y: 225
  //     }
  //   };

  COUNTER = 0;
  this.css = [];
  // this.css[COUNTER++] = this.nickname;
  // this.css[COUNTER++] = this.server_list;
  COUNTER = 0;
  this.bkgd = [];

  if (window.innerWidth < 1300)
    this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.LOGO_INTERFACE, __DISPLAY__, 200, 100, __TOP__ | __LEFT__);
  else
    this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.LOGO_INTERFACE, __DISPLAY__, -753 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __GAME__;

  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.SKINS_BOX, __HIDE__, -1425 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __COSMETICS__;

  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.ACCESSORIES_BOX, __HIDE__, -1366 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __ACCESSORY__;
  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.BAG_BOX, __HIDE__, -1366 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __BAG__;
  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.BOOK_BOX, __HIDE__, -1366 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __BOOK__;
  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.CRATE_BOX, __HIDE__, -1366 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __CRATE__;
  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.LOOT_BOX, __HIDE__, -1366 / 4, 100, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __LOOT__;

  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.LOCKED_CUSTOM_ALERT, __HIDE__, -758 / 4, -5, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __LOCKED_ACC__;
  this.bkgd[COUNTER] = gui_create_image_hd(IMAGES.LOCKED_SKIN_ALERT, __HIDE__, -758 / 4, -5, __TOP__ | __MIDDLE_X__);
  this.bkgd[COUNTER++].view = __LOCKED_SKIN__;

  COUNTER = 0;
  this.buttons = [];

  if (window.innerWidth < 1300)
    this.buttons[COUNTER] = gui_create_button(202, 97, "", [IMAGES.PLAY_BUTTON_OUT, IMAGES.PLAY_BUTTON_IN, IMAGES.PLAY_BUTTON_CLICK], __HD__, __NO_BREATH__, this.play_game, 462, 235, __TOP__ | __LEFT__, __DISPLAY__);
  else
    this.buttons[COUNTER] = gui_create_button(202, 97, "", [IMAGES.PLAY_BUTTON_OUT, IMAGES.PLAY_BUTTON_IN, IMAGES.PLAY_BUTTON_CLICK], __HD__, __NO_BREATH__, this.play_game, 74, 235, __TOP__ | __MIDDLE_X__, __DISPLAY__);

  this.buttons[COUNTER++].view = __GAME__;

  COSMETICS_BUTTON = COUNTER++;
  this.buttons[COSMETICS_BUTTON] = gui_create_button(236, 165, "", [IMAGES.ICONS_BG_BUTTON_OUT, IMAGES.ICONS_BG_BUTTON_IN, IMAGES.ICONS_BG_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -5, 257, __LEFT__, __DISPLAY__);
  this.buttons[COUNTER++] = gui_create_button(236, 165, "", [IMAGES.SKINS_ICON, IMAGES.SKINS_ICON, IMAGES.SKINS_ICON], __HD__, __BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -5, 257, __LEFT__, __DISPLAY__);
  GAME_BUTTON = COUNTER++;
  this.buttons[GAME_BUTTON] = gui_create_button(236, 165, "", [IMAGES.ICONS_BG_BUTTON_OUT, IMAGES.ICONS_BG_BUTTON_IN, IMAGES.ICONS_BG_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__GAME__);
  }, -5, 178, __LEFT__, __DISPLAY__);
  this.buttons[COUNTER++] = gui_create_button(236, 165, "", [IMAGES.START_ICON, IMAGES.START_ICON, IMAGES.START_ICON], __HD__, __BREATH__, function () {
    select_subview(__GAME__);
  }, -5, 178, __LEFT__, __DISPLAY__);


  var NORMAL_MODE = COUNTER++;
  if (window.innerWidth < 1300)
    this.buttons[NORMAL_MODE] = gui_create_button(266, 176, "", [IMAGES.NORMAL_MODE_OUT, IMAGES.NORMAL_MODE_IN, IMAGES.NORMAL_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_PVP);
    }, 150, 300, __LEFT__ | __TOP__, __DISPLAY__);
  else
    this.buttons[NORMAL_MODE] = gui_create_button(266, 176, "", [IMAGES.NORMAL_MODE_OUT, IMAGES.NORMAL_MODE_IN, IMAGES.NORMAL_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_PVP);
    }, -340, 100, __MIDDLE_X__ | __TOP__, __DISPLAY__);
  this.buttons[NORMAL_MODE].view = __GAME__;
  this.buttons[NORMAL_MODE].hint = 0;
  var FOREST_MODE = COUNTER++;
  if (window.innerWidth < 1300)
    this.buttons[FOREST_MODE] = gui_create_button(266, 176, "", [IMAGES.FOREST_MODE_OUT, IMAGES.FOREST_MODE_IN, IMAGES.FOREST_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_LEGACY);
    }, 150, 400, __LEFT__ | __TOP__, __DISPLAY__);
  else
    this.buttons[FOREST_MODE] = gui_create_button(266, 176, "", [IMAGES.FOREST_MODE_OUT, IMAGES.FOREST_MODE_IN, IMAGES.FOREST_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_LEGACY);
    }, -340, 200, __MIDDLE_X__ | __TOP__, __DISPLAY__);
  this.buttons[FOREST_MODE].view = __GAME__;
  this.buttons[FOREST_MODE].hint = 0;
  var MODE_COMMUNITY = COUNTER++;
  if (window.innerWidth < 1300)
    this.buttons[MODE_COMMUNITY] = gui_create_button(266, 176, "", [IMAGES.MODE_COMMUNITY_OUT, IMAGES.MODE_COMMUNITY_IN, IMAGES.MODE_COMMUNITY_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_COMMUNITY);
    }, 450, 300, __LEFT__ | __TOP__, __DISPLAY__);
  else
    this.buttons[MODE_COMMUNITY] = gui_create_button(266, 176, "", [IMAGES.MODE_COMMUNITY_OUT, IMAGES.MODE_COMMUNITY_IN, IMAGES.MODE_COMMUNITY_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_COMMUNITY);
    }, -340, 300, __MIDDLE_X__ | __TOP__, __DISPLAY__);
  this.buttons[MODE_COMMUNITY].view = __GAME__;
  this.buttons[MODE_COMMUNITY].hint = 0;
  var ZOMBIE_MODE = COUNTER++;
  if (window.innerWidth < 1300)
    this.buttons[ZOMBIE_MODE] = gui_create_button(266, 176, "", [IMAGES.ZOMBIE_MODE_OUT, IMAGES.ZOMBIE_MODE_IN, IMAGES.ZOMBIE_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_ZOMBIES);
    }, 300, 300, __LEFT__ | __TOP__, __DISPLAY__);
  else
    this.buttons[ZOMBIE_MODE] = gui_create_button(266, 176, "", [IMAGES.ZOMBIE_MODE_OUT, IMAGES.ZOMBIE_MODE_IN, IMAGES.ZOMBIE_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_ZOMBIES);
    }, 204, 100, __MIDDLE_X__ | __TOP__, __DISPLAY__);
  this.buttons[ZOMBIE_MODE].view = __GAME__;
  this.buttons[ZOMBIE_MODE].hint = 0;
  var VAMPIRE_MODE = COUNTER++;
  if (window.innerWidth < 1300)
    this.buttons[VAMPIRE_MODE] = gui_create_button(266, 176, "", [IMAGES.VAMPIRE_MODE_OUT, IMAGES.VAMPIRE_MODE_IN, IMAGES.VAMPIRE_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_VAMPIRES);
    }, 300, 400, __LEFT__ | __TOP__, __DISPLAY__);
  else
    this.buttons[VAMPIRE_MODE] = gui_create_button(266, 176, "", [IMAGES.VAMPIRE_MODE_OUT, IMAGES.VAMPIRE_MODE_IN, IMAGES.VAMPIRE_MODE_CLICK], __HD__, __NO_BREATH__, function () {
      client.select_gamemode(WORLD.MODE_VAMPIRES);
    }, 204, 200, __MIDDLE_X__ | __TOP__, __DISPLAY__);
  this.buttons[VAMPIRE_MODE].view = __GAME__;
  this.buttons[VAMPIRE_MODE].hint = 0;
  var MODE_EXPERIMENTAL = COUNTER++;
  this.buttons[MODE_EXPERIMENTAL] = gui_create_button(266, 176, "", [IMAGES.MODE_EXPERIMENTAL_OUT, IMAGES.MODE_EXPERIMENTAL_IN, IMAGES.MODE_EXPERIMENTAL_CLICK], __HD__, __NO_BREATH__, function () {
    client.select_gamemode(WORLD.MODE_EXPERIMENTAL);
  }, (window.innerWidth < 1300) ? 450 : 204, (window.innerWidth < 1300) ? 400 : 300, ((window.innerWidth < 1300) ? __LEFT__ : __MIDDLE_X__) | __TOP__, __DISPLAY__);
  this.buttons[MODE_EXPERIMENTAL].view = __GAME__;
  this.buttons[MODE_EXPERIMENTAL].hint = 0;

  this.login_restore_data = function (data) {
    ui.buttons[ui.LOGIN_BUTTON].info.active = 0;
    ui.buttons[ui.PROFILE_BUTTON].info.active = 1;
    ui.buttons[ui.PROFILE_BUTTON_2].info.active = 1;
    init_skin();

    ui.bread = data["bread"];
    var seasons = data["seasons"];
    var lastSeason = seasons[seasons.length - 1];
    ui.seasons = seasons;
    _this.update_score(lastSeason["score"]);
    ui.score = lastSeason["score"];
    ui.kill = lastSeason["kill"];
    ui.death = lastSeason["death"];
    ui.time = lastSeason["time"];
    ui.bestScore = lastSeason["bestScore"];
    ui.bestKill = lastSeason["bestKill"];
    ui.bestTime = lastSeason["bestTime"];
    ui.scoreTotal = lastSeason["scoreTotal"];
    ui.firstName = data["firstName"];
    document.getElementById("serverAddressInput").value = "https://starve.io/?server=" + data["privateServer"];
    if (ui.firstName === undefined)
      ui.firstName = 0;

    ui.privateServerTime = Date.now() + data["privateServerTime"];
    if (Number(data["privateServerTime"]) > 0)
      ui.privateServerTime = Date.now() + Number(data["privateServerTime"]);

    ui.kit = Date.now() + data["kit"];
    if (Number(data["kit"]) > 0)
      ui.kit = Date.now() + Number(data["kit"]);

    var cosmetic = COSMETICS.SKIN;
    for (var i = 0; i < data["skins"].length; i++) {
      var v = data["skins"][i];
      if (v > 0) {
        for (var j = 0; j < cosmetic.length; j++) {
          if (cosmetic[j].id === i)
            _this.unlock.skin[j] = 1;

        }
      }
    }
    var cosmetic = COSMETICS.ACCESSORY;
    for (var i = 0; i < data["accessories"].length; i++) {
      var v = data["accessories"][i];
      if (v > 0) {
        for (var j = 0; j < cosmetic.length; j++) {
          if (cosmetic[j].id === i)
            _this.unlock.accessory[j] = 1;

        }
      }
    }
    var cosmetic = COSMETICS.BOOK;
    for (var i = 0; i < data["books"].length; i++) {
      var v = data["books"][i];
      if (v > 0) {
        for (var j = 0; j < cosmetic.length; j++) {
          if (cosmetic[j].id === i)
            _this.unlock.book[j] = 1;

        }
      }
    }
    var cosmetic = COSMETICS.BAG;
    for (var i = 0; i < data["bags"].length; i++) {
      var v = data["bags"][i];
      if (v > 0) {
        for (var j = 0; j < cosmetic.length; j++) {
          if (cosmetic[j].id === i)
            _this.unlock.bag[j] = 1;

        }
      }
    }
    var cosmetic = COSMETICS.CRATE;
    for (var i = 0; i < data["crates"].length; i++) {
      var v = data["crates"][i];
      if (v > 0) {
        for (var j = 0; j < cosmetic.length; j++) {
          if (cosmetic[j].id === i) {
            _this.unlock.crate[j] = 1;
            _this.unlock.dead[j] = 1;
          }
        }
      }
    }
  };

  this.buttons[COUNTER] = gui_create_button(323, 112, "", [IMAGES.SKIN_BUTTON_OUT, IMAGES.SKIN_BUTTON_IN, IMAGES.SKIN_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__SKIN__);
    skinSelector.initSelector();
  }, -315, 185, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __COSMETICS__;
  this.buttons[COUNTER] = gui_create_button(323, 112, "", [IMAGES.ACCESSORY_BUTTON_OUT, IMAGES.ACCESSORY_BUTTON_IN, IMAGES.ACCESSORY_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__ACCESSORY__);
    accessorySelector.initSelector();
  }, -315, 321, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __COSMETICS__;
  this.buttons[COUNTER] = gui_create_button(323, 112, "", [IMAGES.BAG_BUTTON_OUT, IMAGES.BAG_BUTTON_IN, IMAGES.BAG_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__BAG__);
    bagSelector.initSelector();
  }, 153, 185, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __COSMETICS__;
  this.buttons[COUNTER] = gui_create_button(323, 112, "", [IMAGES.BOOK_BUTTON_OUT, IMAGES.BOOK_BUTTON_IN, IMAGES.BOOK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__BOOK__);
    bookSelector.initSelector();
  }, 153, 321, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __COSMETICS__;
  this.buttons[COUNTER] = gui_create_button(323, 112, "", [IMAGES.CRATE_BUTTON_OUT, IMAGES.CRATE_BUTTON_IN, IMAGES.CRATE_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__CRATE__);
    deadSelector.initSelector();
  }, 153, 463, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __COSMETICS__;
  this.buttons[COUNTER] = gui_create_button(323, 112, "", [IMAGES.LOOT_BUTTON_OUT, IMAGES.LOOT_BUTTON_IN, IMAGES.LOOT_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__LOOT__);
    crateSelector.initSelector();
  }, -315, 463, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __COSMETICS__;

  RARITY_BUTTON = [];
  RARITY_BUTTON[RARITY.FREE] = [IMAGES.FREE_ITEM_OUT, IMAGES.FREE_ITEM_IN, IMAGES.FREE_ITEM_CLICK];
  RARITY_BUTTON[RARITY.WOOD] = [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK];
  RARITY_BUTTON[RARITY.STONE] = [IMAGES.STONE_ITEM_OUT, IMAGES.STONE_ITEM_IN, IMAGES.STONE_ITEM_CLICK];
  RARITY_BUTTON[RARITY.GOLD] = [IMAGES.GOLD_ITEM_OUT, IMAGES.GOLD_ITEM_IN, IMAGES.GOLD_ITEM_CLICK];
  RARITY_BUTTON[RARITY.DIAMOND] = [IMAGES.DIAMOND_ITEM_OUT, IMAGES.DIAMOND_ITEM_IN, IMAGES.DIAMOND_ITEM_CLICK];
  RARITY_BUTTON[RARITY.AMETHYST] = [IMAGES.AMETHYST_ITEM_OUT, IMAGES.AMETHYST_ITEM_IN, IMAGES.AMETHYST_ITEM_CLICK];
  RARITY_BUTTON[RARITY.REIDITE] = [IMAGES.REIDITE_ITEM_OUT, IMAGES.REIDITE_ITEM_IN, IMAGES.REIDITE_ITEM_CLICK];
  RARITY_BUTTON[RARITY.LEVEL] = [IMAGES.LEVEL_ITEM_OUT, IMAGES.LEVEL_ITEM_IN, IMAGES.LEVEL_ITEM_CLICK];
  RARITY_BUTTON[RARITY.SPECIAL] = [IMAGES.SPECIAL_ITEM_OUT, IMAGES.SPECIAL_ITEM_IN, IMAGES.SPECIAL_ITEM_CLICK];
  FIRST_BUTTON_SKIN = COUNTER;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_PREVIOUS_OUT, IMAGES.SKIN_PREVIOUS_IN, IMAGES.SKIN_PREVIOUS_CLICK], __HD__, __NO_BREATH__, undefined, -61, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_NEXT_OUT, IMAGES.SKIN_NEXT_IN, IMAGES.SKIN_NEXT_CLICK], __HD__, __NO_BREATH__, undefined, 260, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  this.buttons[COUNTER] = gui_create_button(115, 73, "", [IMAGES.BACK_BUTTON_OUT, IMAGES.BACK_BUTTON_IN, IMAGES.BACK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -320, 470, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __SKIN__;
  FIRST_BUTTON_ACCESSORY = COUNTER;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_PREVIOUS_OUT, IMAGES.SKIN_PREVIOUS_IN, IMAGES.SKIN_PREVIOUS_CLICK], __HD__, __NO_BREATH__, undefined, -61, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_NEXT_OUT, IMAGES.SKIN_NEXT_IN, IMAGES.SKIN_NEXT_CLICK], __HD__, __NO_BREATH__, undefined, 260, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  this.buttons[COUNTER] = gui_create_button(115, 73, "", [IMAGES.BACK_BUTTON_OUT, IMAGES.BACK_BUTTON_IN, IMAGES.BACK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -320, 470, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __ACCESSORY__;
  FIRST_BUTTON_LOOT = COUNTER;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_PREVIOUS_OUT, IMAGES.SKIN_PREVIOUS_IN, IMAGES.SKIN_PREVIOUS_CLICK], __HD__, __NO_BREATH__, undefined, -61, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_NEXT_OUT, IMAGES.SKIN_NEXT_IN, IMAGES.SKIN_NEXT_CLICK], __HD__, __NO_BREATH__, undefined, 260, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  this.buttons[COUNTER] = gui_create_button(115, 73, "", [IMAGES.BACK_BUTTON_OUT, IMAGES.BACK_BUTTON_IN, IMAGES.BACK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -320, 470, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __LOOT__;
  FIRST_BUTTON_BAG = COUNTER;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_PREVIOUS_OUT, IMAGES.SKIN_PREVIOUS_IN, IMAGES.SKIN_PREVIOUS_CLICK], __HD__, __NO_BREATH__, undefined, -61, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_NEXT_OUT, IMAGES.SKIN_NEXT_IN, IMAGES.SKIN_NEXT_CLICK], __HD__, __NO_BREATH__, undefined, 260, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  this.buttons[COUNTER] = gui_create_button(115, 73, "", [IMAGES.BACK_BUTTON_OUT, IMAGES.BACK_BUTTON_IN, IMAGES.BACK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -320, 470, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BAG__;
  FIRST_BUTTON_BOOK = COUNTER;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_PREVIOUS_OUT, IMAGES.SKIN_PREVIOUS_IN, IMAGES.SKIN_PREVIOUS_CLICK], __HD__, __NO_BREATH__, undefined, -61, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_NEXT_OUT, IMAGES.SKIN_NEXT_IN, IMAGES.SKIN_NEXT_CLICK], __HD__, __NO_BREATH__, undefined, 260, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  this.buttons[COUNTER] = gui_create_button(115, 73, "", [IMAGES.BACK_BUTTON_OUT, IMAGES.BACK_BUTTON_IN, IMAGES.BACK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -320, 470, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __BOOK__;
  FIRST_BUTTON_CRATE = COUNTER;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, -29, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 65, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 205, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 300, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(178, 182, "", [IMAGES.WOOD_ITEM_OUT, IMAGES.WOOD_ITEM_IN, IMAGES.WOOD_ITEM_CLICK], __HD__, __NO_BREATH__, undefined, 159, 395, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_PREVIOUS_OUT, IMAGES.SKIN_PREVIOUS_IN, IMAGES.SKIN_PREVIOUS_CLICK], __HD__, __NO_BREATH__, undefined, -61, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(39, 122, "", [IMAGES.SKIN_NEXT_OUT, IMAGES.SKIN_NEXT_IN, IMAGES.SKIN_NEXT_CLICK], __HD__, __NO_BREATH__, undefined, 260, 315, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;
  this.buttons[COUNTER] = gui_create_button(115, 73, "", [IMAGES.BACK_BUTTON_OUT, IMAGES.BACK_BUTTON_IN, IMAGES.BACK_BUTTON_CLICK], __HD__, __NO_BREATH__, function () {
    select_subview(__COSMETICS__);
  }, -320, 470, __MIDDLE_X__ | __TOP__, __HIDE__);
  this.buttons[COUNTER++].view = __CRATE__;

  var skinSelector = new CosmeticSelector(COSMETICS.SKIN, FIRST_BUTTON_SKIN, function (v) {
    ui.skin = v;
    if (ui.unlock.skin[v] === 1)
      Cookies.set("starve_skin", "" + v, {
        expires: 30
      });

  }, this.skin, this.unlock.skin);
  var bagSelector = new CosmeticSelector(COSMETICS.BAG, FIRST_BUTTON_BAG, function (v) {
    ui.bag = v;
    if (ui.unlock.bag[v] === 1)
      Cookies.set("starve_bag", "" + v, {
        expires: 30
      });

  }, this.bag, this.unlock.bag);
  var bookSelector = new CosmeticSelector(COSMETICS.BOOK, FIRST_BUTTON_BOOK, function (v) {
    ui.book = v;
    if (ui.unlock.book[v] === 1)
      Cookies.set("starve_book", "" + v, {
        expires: 30
      });

  }, this.book, this.unlock.book);
  var deadSelector = new CosmeticSelector(COSMETICS.CRATE, FIRST_BUTTON_CRATE, function (v) {
    ui.dead = v;
    if (ui.unlock.dead[v] === 1)
      Cookies.set("starve_dead", "" + v, {
        expires: 30
      });

  }, this.dead, this.unlock.dead);
  var crateSelector = new CosmeticSelector(COSMETICS.CRATE, FIRST_BUTTON_LOOT, function (v) {
    ui.crate = v;
    if (ui.unlock.crate[v] === 1)
      Cookies.set("starve_crate", "" + v, {
        expires: 30
      });

  }, this.crate, this.unlock.crate);
  var accessorySelector = new CosmeticSelector(COSMETICS.ACCESSORY, FIRST_BUTTON_ACCESSORY, function (v) {
    ui.accessory = v;
    if (ui.unlock.accessory[v] === 1)
      Cookies.set("starve_accessory", "" + v, {
        expires: 30
      });

  }, this.accessory, this.unlock.accessory);
  this.trigger_mousedown = function (evt) {
    mouse.pos = get_mouse_pos(_this.can, evt);
    for (var i = 0; i < _this.buttons.length; i++) {
      if (_this.buttons[i].info.active === __DISPLAY__)
        _this.buttons[i].trigger(_this.can, mouse.pos, MOUSE_DOWN);

    }
  };
  this.trigger_mouseup = function (evt) {
    mouse.pos = get_mouse_pos(_this.can, evt);
    for (var i = 0; i < _this.buttons.length; i++) {
      var button = _this.buttons[i];
      if (button.info.active === __DISPLAY__) {
        if (button.trigger(_this.can, mouse.pos, MOUSE_UP)) {
          button.info.callback();
          return;
        }
      }
    }
  };
  this.current_cursor = false;
  this.trigger_mousemove = function (evt) {
    mouse.pos = get_mouse_pos(_this.can, evt);
    var cursor = false;
    for (var i = 0; i < _this.buttons.length; i++) {
      if (_this.buttons[i].info.active === __DISPLAY__)
        cursor |= _this.buttons[i].trigger(_this.can, mouse.pos, MOUSE_MOVE);

    }
  };
  this.add_event_listener = function () {
    window.addEventListener('mousedown', this.trigger_mousedown, false);
    window.addEventListener('mouseup', this.trigger_mouseup, false);
    window.addEventListener('mousemove', this.trigger_mousemove, false);
  };
  this.remove_event_listener = function () {
    window.removeEventListener('mousedown', this.trigger_mousedown, false);
    window.removeEventListener('mouseup', this.trigger_mouseup, false);
    window.removeEventListener('mousemove', this.trigger_mousemove, false);
  };
};