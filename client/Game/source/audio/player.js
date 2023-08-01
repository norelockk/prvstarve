SOUND_PLAYER = {
  DELAY_SWIM: 0.4,
  DELAY_SAND: 0.2,
  DELAY_WALK: 0.2,
  DELAY_SNOW: 0.2,
  FADE_SWIM: 300,
  FADE_SAND: 100,
  FADE_WALK: 100,
  FADE_SNOW: 100,

  WALK: 0,
  SWIM: 1,
  SAND: 2,
  SNOW: 3,

  FACTOR: 4,
  FACTOR2: 2,
}

function SoundPlayerEffect(mom, player, ids) {
  this.mom = mom;
  this.c = 0;
  this.player = player;
  this.ids = ids;
  this.max = ids.length

  this.play = function () {

    this.c = (this.c + 1) % this.max;
    var id = this.ids[this.c];

    this.mom.update_pos(this.player, id);
    this.player["play"](id);
  };
};

function SoundPlayer(sid) {

  this.free = 1;

  this.uid = 0;

  this.mode = -1;
  this.swim = audio.sample.swim[sid];
  this.sand = audio.sample.sand[sid];
  this.walk = audio.sample.walk[sid];
  this.snow = audio.sample.snow[sid];

  this.punch = new SoundPlayerEffect(this, AUDIO.PUNCH.sound, audio.samples.punch[sid]);
  this.weapon = new SoundPlayerEffect(this, AUDIO.WEAPON.sound, audio.samples.weapon[sid]);
  this.dig = new SoundPlayerEffect(this, AUDIO.DIG.sound, audio.samples.dig[sid]);

  this.sid = sid;
  this.x = 0;
  this.y = 0;

  this.move = 0;
  this.delay = SOUND_PLAYER.DELAY;

  this.pos = { x: 0, y: 0 };

  /* Player ambience */
  this.ambience = AUDIO.AMBIENCE.sound;

  this.swing = function (noise) {

    if (noise === CONST_AUDIO.HAND)
      this.punch.play();
    else if (noise === CONST_AUDIO.MISC)
      this.weapon.play();
    else if (noise === CONST_AUDIO.SHOVEL)
      this.dig.play();
  };

  this.detect_position = function (p) {

    if (p.dist_sand > 0)
      return SOUND_PLAYER.SAND;
    else if (p.dist_water > 0)
      return SOUND_PLAYER.SWIM;
    else if (p.dist_winter > 0 || p.dist_lava > 0)
      return SOUND_PLAYER.SNOW;
    else
      return SOUND_PLAYER.WALK;
  }

  this.init = function (uid) {

    this.free = 0;

    this.uid = uid;

    var p = world.fast_units[uid];
    p.sid = this.sid;
    this.mode = this.detect_position(p);

    this.pos.x = p.x;
    this.pos.y = p.y;
  }

  this.clean = function () {

    this.free = 1;
    this.mode = -1;

    this.ambience["stop"](this.swim);
    this.ambience["stop"](this.sand);
    this.ambience["stop"](this.walk);
    this.ambience["stop"](this.snow);
  };

  this.fade = function (id, f) {

    var v = this.ambience["volume"](id) * VOLUME.FX;
    this.ambience["fade"](v, 0, f, id);
  };

  this.update_pos = function (player, id) {

    if (this.move && this.sid) {

      player["pos"](this.x, this.y, -.5, id);
    }
  };

  this.effect = function (id, base, rand, change, mode, delay, f) {

    this.delay = delay;

    if (change && this.mode === mode) {

      var v = this.ambience["volume"](id) * VOLUME.FX;
      if (this.move) {
        var r = (Math.random() * rand + base) * VOLUME.FX;
        this.ambience["fade"](v, r, f, id);
      } else this.ambience["fade"](v, 0, f, id);

    } else if (this.mode != mode && this.move) {

      this.ambience["fade"](0, (base + rand) * VOLUME.FX, f, id);

    } else if (this.move) {

      var v = this.ambience["volume"](id) * VOLUME.FX;
      var r = (Math.random() * rand + base) * VOLUME.FX;
      this.ambience["fade"](v, r, f, id);
    }


    this.update_pos(this.ambience, id);
    this.ambience["play"](id);
  }

  this.update = function () {

    var p = world.fast_units[this.uid];

    /* Delay the effect */
    this.delay -= delta;
    if (this.delay > 0)
      return;

    var change = 0;

    if (p.x != this.pos.x || p.y != this.pos.y) {

      if (!this.move) {
        change = 1;
        this.move = 1;
      }

      this.x = audio.get_x_ext(p.x, SOUND_PLAYER.FACTOR2);
      this.y = audio.get_y_ext(p.y, SOUND_PLAYER.FACTOR2);

    } else {

      if (this.move) {
        change = 1;
        this.move = 0;
      }
    }

    this.pos.x = p.x;
    this.pos.y = p.y;

    mode = this.detect_position(p);
    if (mode != this.mode) {
      if (this.mode === SOUND_PLAYER.SWIM)
        this.fade(this.swim, SOUND_PLAYER.FADE_SWIM);
      else if (this.mode === SOUND_PLAYER.SAND)
        this.fade(this.sand, SOUND_PLAYER.FADE_SAND);
      else if (this.mode === SOUND_PLAYER.WALK)
        this.fade(this.walk, SOUND_PLAYER.FADE_WALK);
      else if (this.mode === SOUND_PLAYER.SNOW)
        this.fade(this.snow, SOUND_PLAYER.FADE_SNOW);
    }

    if (mode === SOUND_PLAYER.SWIM)
      this.effect(this.swim, 0.08, 0.3, change, mode, SOUND_PLAYER.DELAY_SWIM, SOUND_PLAYER.FADE_SWIM);
    else if (mode === SOUND_PLAYER.SAND)
      this.effect(this.sand, 0.2, 0.3, change, mode, SOUND_PLAYER.DELAY_SAND, SOUND_PLAYER.FADE_SAND);
    else if (mode === SOUND_PLAYER.WALK)
      this.effect(this.walk, 0.3, 0.6, change, mode, SOUND_PLAYER.DELAY_WALK, SOUND_PLAYER.FADE_WALK);
    else if (mode === SOUND_PLAYER.SNOW)
      this.effect(this.snow, 0.1, 0.25, change, mode, SOUND_PLAYER.DELAY_SNOW, SOUND_PLAYER.FADE_SNOW);

    this.mode = mode;
  }

  this.check = function () {

    var p = world.fast_units[this.uid];

    /* This player does not exist anymore */
    if (!p) {
      this.clean(p);
      return false;
    }

    return true;
  }
}