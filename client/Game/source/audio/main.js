function Audio() {
  this.run = 0;
  this.loaded = 0;
  this.transition = 0;

  /* Relative position compute */
  this.get_x = function (x) { return 100 * (x / world.w); };
  this.get_y = function (y) { return 100 * (y / world.h); };

  this.get_x_ext = function (x, f) {

    x = this.get_x(x) - this.ltr.x;
    return this.ltr.x + f * x;
  };

  this.get_y_ext = function (y, f) {

    /* I somehow only keep right and left stereo */
    y = Math.abs(this.get_y(y) - this.ltr.y);
    return this.ltr.y + f * y;
  };

  /* Sample */
  this.sample = {};
  this.samples = {};
  this.player = {};

  /* Play available sample */
  this.play_sample = function (p, s, x, y) {

    for (var i = 0; i < s.length; i++) {

      var id = s[i];
      if (p["playing"](id))
        continue;

      p["pos"](x, y, -.5, id);
      p["play"](id);

      return true;
    }

    return false;
  };

  this.hit = function (id, sound, x, y) {

    x = this.get_x_ext(x, SOUND_PLAYER.FACTOR)
    y = this.get_y_ext(y, SOUND_PLAYER.FACTOR)

    console.log("HIT", id, sound, x, y, SOUND_PLAYER.FACTOR);
    // Hit with hand
    if (!id)
      this.play_sample(this.player.hand, this.sample.hand, x, y);
    else {
      if (sound === 1)
        this.play_sample(this.player.hstone, this.sample.hstone, x, y);
      else if (sound === 0)
        this.play_sample(this.player.hwood, this.sample.hwood, x, y);
    }
  }

  /* Listener position */
  this.ltr = {
    x: 0,
    y: 0,
  };
  this.oldp = {
    x: 0,
    y: 0,
  }

  this.area = {};
  this.players = [];

  this.ambience = function (p, update) {

    for (var a in this.area) {

      var area = this.area[a];
      area.check(p);

      if (area.inside) {

        /* ambience effect */
        if (world.clock.now < CONST_AUDIO.DISABLE_EFFECT)
          area.effect();

        /* Update position of ambience sound */
        if (update) area.update(p, this.ltr);

        /* transition when the night fall / day... */
        if (this.transition)
          area.transition();
      }
    }

    if (this.transition)
      this.transition = 0;
  };

  /* Hook players with sound effect */
  this.hook_players = function () {

    var l = [];

    for (var i = 0; i < this.players.length; i++) {

      var p = this.players[i];
      if (p.free)
        l.push(i);
      else if (!p.free && !world.fast_units[p.uid]) {
        p.clean();
        l.push(i);
      }
    }

    var players = world.units[ITEMS.PLAYERS];
    for (var i = 0, j = 0; i < players.length && j < l.length; i++) {

      var p = players[i];

      /*Spectator have no sound effect */
      if ((world.mode == WORLD.MODE_HUNGER_GAMES &&
        world.players[p.id].nickname === "spectator") ||
        p.sid !== -1 || p.uid === user.uid)
        continue;

      this.players[l[j]].init(p.uid)
      j++;
    }
  }

  /* Players effect */
  this.players_effect = function () {

    this.hook_players();

    for (var i = 0; i < this.players.length; i++) {

      var p = this.players[i];
      if (p.free || !p.check()) continue;

      p.update();
    }
  }

  /* Update position of the listener */
  this.update_listener = function (p) {

    /* We update only if player move */
    if (this.oldp.x === p.x && this.oldp.y === p.y)
      return 0;

    this.oldp.x = p.x;
    this.oldp.y = p.y;

    this.ltr.x = this.get_x(p.x);
    this.ltr.y = this.get_y(p.y);
    Howler["pos"](this.ltr.x, this.ltr.y, 0);

    return 1;
  };

  /* schedule effect of games */
  this.scheduler = function () {

    if (!this.run || !this.loaded)
      return;

    var p = world.fast_units[user.uid];
    if (!p) return;
    p.sid = 0;

    /* Update player position */
    var update = this.update_listener(p);

    /* Ambience effect */
    if (world.mode !== WORLD.MODE_ZOMBIES &&
      world.mode !== WORLD.MODE_LEGACY &&
      world.mode !== WORLD.MODE_BR)
      this.ambience(p, update);

    /* Players effect */
    this.players_effect();
  }

  /* Effect when crafting */
  this.load_sound = function () {

    var ret = null;

    for (var sound in AUDIO) {

      var s = AUDIO[sound]
      if (typeof (s) === 'object' && s.path) {
        s.sound = new Howl({

          "src": s.path,
          "volume": 0,
          //"html5"  : true,
          "sprite": s.sprite,
        });
      }

      /* Load sample */
      for (var a in s.sample) {

        var n = s.sample[a];
        var l = [];
        console.log(a);
        for (var i = 0; i < n; i++) {

          var id = s.sound["play"](a);
          s.sound["stop"](id);

          /* We stop the sound when we reach the volume 0 */
          s.sound["on"]('fade', function (id) {

            if (!this["volume"](id)) {
              console.log(id, "OUT");
              this["stop"](id);
            }
          }, id);

          l.push(id);
        }

        if (l.length > 1)
          audio.sample[a] = l;
        else audio.sample[a] = l[0];
        audio.player[a] = s.sound;
      }
    }
  };

  this.volume_sample = function (s, p, v) {

    for (var i = 0; i < s.length; i++)
      p["volume"](v, s[i]);
  };

  this.organize_samples = function (samples, player, l1, l2, prefix, volume) {

    var s = samples;

    for (var i = 0; i < l1; i++) {

      var sl = s[i] = [];

      for (j = 0; j < l2; j++) {
        sl[j] = audio.sample[prefix + j][i];
        player.sound["volume"](volume, sl[j]);
      }
    }
  };

  this.init = function () {
    /* Load the sound in the game */
    audio.load_sound();

    /* Reorganize samples */
    audio.samples.punch = [];
    audio.samples.weapon = [];
    audio.samples.dig = [];
    audio.organize_samples(audio.samples.punch, AUDIO.PUNCH, CONST_AUDIO.PLAYERS, 3, "p", 0.15);
    audio.organize_samples(audio.samples.weapon, AUDIO.WEAPON, CONST_AUDIO.PLAYERS, 4, "w", 0.15);
    audio.organize_samples(audio.samples.dig, AUDIO.DIG, CONST_AUDIO.PLAYERS, 3, "d", 0.09);

    /* Set the volume */
    audio.volume_sample(audio.sample.hand, audio.player.hand, 0.15);
    audio.volume_sample(audio.sample.hwood, audio.player.hwood, 0.2);
    audio.volume_sample(audio.sample.hstone, audio.player.hstone, 1);

    /* Load areas sound */
    audio.area.sea = new SoundArea(
      CONST_AUDIO.SEA_DELAY,
      this.sample.seanight, this.sample.seaday,
      CONST_AUDIO.SEA_FADE, 0.05, 0.4,
      AUDIO.AMBIENCE.sound,
      CONST_AUDIO.TRANSITION,
      { x: SPRITE.SEE_BIOME_X, y: SPRITE.WINTER_BIOME_Y, w: world.w, h: world.h },
      { x: SPRITE.SEE_BIOME_X - 2300, y: SPRITE.WINTER_BIOME_Y - 4000, w: world.w, h: world.h },
      { x: SPRITE.SEE_BIOME_X - 1500, y: SPRITE.WINTER_BIOME_Y - 2000, w: world.w, h: world.h });
    audio.area.forest = new SoundArea(
      CONST_AUDIO.FOREST_DELAY,
      this.sample.forestnight, this.sample.forestday,
      CONST_AUDIO.FOREST_FADE, 0.03, 0.25,
      AUDIO.AMBIENCE.sound,
      CONST_AUDIO.TRANSITION,
      { x: 0, y: SPRITE.WINTER_BIOME_Y + 800, w: SPRITE.SEE_BIOME_X - 2300, h: world.h },
      { x: -100, y: SPRITE.WINTER_BIOME_Y - 300, w: SPRITE.SEE_BIOME_X - 100, h: world.h },
      { x: -100, y: SPRITE.WINTER_BIOME_Y + 400, w: SPRITE.SEE_BIOME_X - 1400, h: world.h });
    audio.area.snow = new SoundArea(
      CONST_AUDIO.FOREST_DELAY,
      this.sample.snownight, this.sample.snowday,
      CONST_AUDIO.SNOW_FADE, 0.01, 0.22,
      AUDIO.AMBIENCE.sound,
      CONST_AUDIO.TRANSITION,
      { x: -100, y: -100, w: world.w + 200, h: SPRITE.WINTER_BIOME_Y - 1000 },
      { x: -100, y: -100, w: world.w + 200, h: SPRITE.WINTER_BIOME_Y + 600 },
      { x: -100, y: -100, w: world.w + 200, h: SPRITE.WINTER_BIOME_Y + 100 });

    /* Load players sound */
    for (var i = 0; i < CONST_AUDIO.PLAYERS; i++)
      audio.players[i] = new SoundPlayer(i);

    /* Init for the current player */
    audio.players[0].init(user.uid);

    audio.loaded = 1;
  };

  this.launch = function () {
    if (!this.transition && world.clock.now < CONST_AUDIO.DISABLE_EFFECT)
      this.transition = 1;
  };

  this.quit = function () {
    if (!this.run || !this.loaded)
      return;

    for (var s in audio.sample) {

      var sound = audio.sample[s];

      if (typeof (sound) === 'object') {

        for (var i = 0; i < sound.length; i++)
          audio.player[s]["stop"](sound[i]);

      } else audio.player[s]["stop"](sound);
    }

    for (var i = 0; i < audio.players.length; i++)
      audio.players[i].clean();
  };

  this.select = function () {

    if (!audio.run) {

      if (!audio.loaded)
        audio.init();

      audio.players[0].uid = user.uid;
      audio.players[0].free = 0;

      audio.launch();

    } else audio.quit();

    audio.run = !audio.run;
  };
};