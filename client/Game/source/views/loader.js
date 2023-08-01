function Loader(can, ctx, after_loading_stuff) {
  this.can = can;
  this.ctx = ctx;
  this.logo = {
    translate: {
      x: 0,
      y: 0
    },
    style: document.getElementById("loading").style,
    update: function () {
      this.style.left = this.translate.x + "px";
      this.style.top = Math.floor(this.translate.y) + "px";
    }
  };
  this.logo.style.position = "absolute";
  this.logo.style.display = "inline-block";
  this.logo.update();
  this.is_run = true;
  this.stop = function () {
    this.is_run = false;
  };
  this.loading = {
    total: 1
  };
  var _this = this;
  var fun_after_quit = function () { };
  var quit_effect_step = 0;
  var quit_effect_max_step = 40;
  this.quit_effect = function () {
    _this.update();
    quit_effect_step++;
    if (quit_effect_step == quit_effect_max_step) {
      _this.stop();
      fun_after_quit();
      return;
    }
    window.setTimeout(_this.quit_effect, 33);
  };

  this.quit = function (fun) {
    fun_after_quit = fun;
    _this.quit_effect();
  };

  function need_to_load_this_image(name) {
    if ((name.indexOf("normal-mode") !== -1) || (name.indexOf("player0") !== -1))
      return 1;

    if (((((((((((((((((((((((((((((((((((((((name.indexOf("day-bag") !== -1) || (name.indexOf("night-bag") !== -1)) || (name.indexOf("day-book") !== -1)) || (name.indexOf("night-book") !== -1)) || (name.indexOf("day-player") !== -1)) || (name.indexOf("night-player") !== -1)) || (name.indexOf("day-accessory") !== -1)) || (name.indexOf("night-accessory") !== -1)) || (name.indexOf("day-crate") !== -1)) || (name.indexOf("night-crate") !== -1)) || (name.indexOf("day-skin") !== -1)) || (name.indexOf("night-skin") !== -1)) || (name.indexOf("day-river") !== -1)) || (name.indexOf("night-river") !== -1)) || (name.indexOf("day-river") !== -1)) || (name.indexOf("night-river") !== -1)) || (name.indexOf("day-rock") !== -1)) || (name.indexOf("night-rock") !== -1)) || (name.indexOf("day-flower") !== -1)) || (name.indexOf("night-flower") !== -1)) || (name.indexOf("day-leaf") !== -1)) || (name.indexOf("night-leaf") !== -1)) || (name.indexOf("day-herb") !== -1)) || (name.indexOf("night-herb") !== -1)) || (name.indexOf("day-shell") !== -1)) || (name.indexOf("night-shell") !== -1)) || (name.indexOf("day-hand-skin") !== -1)) || (name.indexOf("night-hand-skin") !== -1)) || (name.indexOf("bignight") !== -1)) || (name.indexOf("bigday") !== -1)) || (name.indexOf("bigzday") !== -1)) || (name.indexOf("bigznight") !== -1)) || (name.indexOf("day-lava-") !== -1)) || (name.indexOf("night-lava-") !== -1)) || (name.indexOf("-click.png") !== -1)) || (name.indexOf("-in.png") !== -1)) || (name.indexOf("-fog") !== -1)) || (name.indexOf("-lava") !== -1)) || (name.indexOf("pebblecompo") !== -1))
      return 0;

    return 1;
  };;
  var number_img_to_load = Object.keys(IMAGES).length;
  for (var img in IMAGES) {
    if (need_to_load_this_image(IMAGES[img]) === 0)
      number_img_to_load--;
  }

  var my_loader_fun = function () {
    if (this.isLoaded !== 0)
      return this.isLoaded;

    this.isLoaded = 2;
    this.src = this._src;
    return 0;
  };

  var my_onload_fun = function (a) {
    this.isLoaded = 1;
  };

  var my_onerror_fun = function () {
    var _src = this.src;
    var _wait = (need_to_load_this_image(_src) === 0) ? 10000 : 2000;

    setTimeout(function () {
      for (var i in DUMP_IMAGES) {
        if (_src.indexOf(DUMP_IMAGES[i]) !== -1) {
          IMAGES[i] = new Image;
          IMAGES[i].onload = my_onload_fun;
          IMAGES[i].onerror = my_onerror_fun;
          IMAGES[i].src = _src;
          break;
        }
      }
    }, _wait);
  };

  function load_images(priority) {
    for (var i in IMAGES) {
      var src = IMAGES[i];
      if (typeof src !== "string")
        continue;

      if (need_to_load_this_image(src) !== priority)
        continue;

      IMAGES[i] = new Image;
      IMAGES[i].isLoaded = 0;
      IMAGES[i].onload = my_onload_fun;
      IMAGES[i].onerror = my_onerror_fun;
      IMAGES[i].tryLoad = my_loader_fun;

      IMAGES[i]._src = src;
    }
  };
  load_images(1);
  load_images(0);
  create_text(1, "l", 20, "#000");
  _load_images();
  this.update = function () {
    this.logo.translate.x = (canw - 500) / 2;
    this.logo.translate.y = (canh - 150) / 2;
    var move_effect = (2500 / ((quit_effect_max_step - quit_effect_step) + 1)) - 48;
    this.logo.translate.y -= move_effect;
    this.logo.update();
  };
  this.logo.update();
  this.draw = function () {
    try {
      draw_fake_world();
    } catch (e) { };
    this.update();
  };

  setTimeout(after_loading_stuff, 100);
};