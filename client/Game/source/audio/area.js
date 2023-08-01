function SoundArea(delay, night, day, fade, r_base, r_seed, player, transition_delay, source, outside, inside) {
  this.r = 1;
  this.delay = delay;
  this.max_delay = delay;
  this.night = night;
  this.day = day;
  this.fade = fade;
  this.r_base = r_base;
  this.r_seed = r_seed;
  this.player = player
  this.transition_delay = transition_delay;
  this.source = source;
  this.source.lx = source.x + source.w;
  this.source.by = source.y + source.h;
  this.outside_box = outside;
  this.inside_box = inside;
  this.inside = 0;

  /* Hackish fix :/, but I hope this work */
  this.hackish = { d: 5, m: 5 };

  /* Add effects in order to extend small samples */
  this.effect = function () {

    this.delay -= delta;
    if (this.delay < 0) {

      this.delay = this.max_delay;

      var n = AUDIO.AMBIENCE.sound["playing"](this.night);
      var d = AUDIO.AMBIENCE.sound["playing"](this.day);

      if (n && !d) {

        var v = this.player["volume"](this.night) * VOLUME.AMB;
        var r = (Math.random() * this.r_seed + this.r_base) * VOLUME.AMB;
        this.player["fade"](v, r, this.fade, this.night);

      } else if (!n && d) {

        var v = this.player["volume"](this.day) * VOLUME.AMB;
        var r = (Math.random() * this.r_seed + this.r_base) * VOLUME.AMB;
        this.player["fade"](v, r, this.fade, this.day);
      }
    }
  };

  /* When the night fall, or day rise... */
  this.transition = function () {

    /* delayed next effect */
    this.delay = this.max_delay;
    this.hackish.d = this.hackish.m;

    if (world.time) {

      this.player["fade"](0, this.r_base * VOLUME.AMB, this.transition_delay, this.night);
      this.player["play"](this.night);
      if (this.player["playing"](this.day)) {
        var v = this.player["volume"](this.day) * VOLUME.AMB;
        this.player["fade"](v, 0, this.transition_delay, this.day);
      }

    } else {

      this.player["fade"](0, this.r_base * VOLUME.AMB, this.transition_delay, this.day);
      this.player["play"](this.day);
      if (this.player["playing"](this.night)) {
        var v = this.player["volume"](this.night) * VOLUME.AMB;
        this.player["fade"](v, 0, this.transition_delay, this.night);
      }
    }
  }

  /* Is player in this area ? */
  this.check = function (p) {

    /* Is the player go outside the box ? */
    if (this.inside) {

      if (!Utils.inside_box(p, this.outside_box)) {

        this.inside = 0;
        if (this.player["playing"](this.night)) {
          var v = this.player["volume"](this.night) * VOLUME.AMB;
          this.player["fade"](v, 0, this.transition_delay, this.night);
        }
        if (this.player["playing"](this.day)) {
          var v = this.player["volume"](this.day) * VOLUME.AMB;
          this.player["fade"](v, 0, this.transition_delay, this.day);
        }

        /* Fix a strange bug, force the transition */
      } else if (!audio.transition && world.clock.now < CONST_AUDIO.DISABLE_EFFECT) {

        if (world.time) {

          if (!this.player["playing"](this.night)) {

            this.hackish.d -= delta;
            if (this.hackish.d < 0)
              this.transition();
          }

        } else {

          if (!this.player["playing"](this.day)) {

            this.hackish.d -= delta;
            if (this.hackish.d < 0)
              this.transition();
          }
        }
      }

    } else {

      if (Utils.inside_box(p, this.inside_box)) {

        //console.log ("INSIDE");
        this.inside = 1;
        if (!audio.transition && world.clock.now < CONST_AUDIO.DISABLE_EFFECT)
          this.transition()
      }
    }
  }

  /* Update location to the source */
  this.update = function (p, ltr) {

    var x, y;
    if (p.x < this.source.x)
      x = audio.get_x(this.source.x);
    else if (p.x > this.source.lx)
      x = audio.get_x(this.source.lx);
    else x = ltr.x;

    if (p.y < this.source.y)
      y = audio.get_y(this.source.y);
    else if (p.y > this.source.by)
      y = audio.get_y(this.source.by);
    else y = ltr.y;

    this.player["pos"](x, y, -.5, this.night);
    this.player["pos"](x, y, -.5, this.day);
  };
}
