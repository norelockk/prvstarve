import { ITEMS, WORLD, STATE, CLIENT, SLOW_DOWN, SPRITE } from './constants';
import { LinearAnimation, RNG, intersect_aabb, get_std_angle, build_vector, norm, add_vector, copy_vector, dist, ease_in_out_quad, ease_out_cubic, ease_in_out_cubic, ease_out_quart, ease_out_quint, Ease } from './utils';
import { delta } from './canvas';
import { world } from './game';

export function Flakes(id, x, y, angle) {
  this.id = id;
  this.speed = (id + 5) * 8;
  this.life = canw / 1366;
  this.x = x;
  this.y = y;
  this.c = Math.cos(angle);
  this.s = Math.sin(angle);
  this.alpha = 0;
}

export function Beach() {
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

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam_vert(y3, p, this.seed3, 18, 16, _left, _right);
    ctx.globalAlpha = 1;
    var p = -((((y - WORLD.LW2SX) - diff_y) + 500) / WORLD.W2EX);
    if (p === 0)
      this.new_seed();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam_vert(y, p, this.seed, 12, 10, _left, _right);
    ctx.globalAlpha = 1;
    if (y2 === -1)
      return;

    var p = -((((y2 - WORLD.LW3SX) - diff_y) + 698) / WORLD.W3EX);
    if (p <= 0.01)
      this.new_seed2();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam_vert(y2, p, this.seed2, 6, 6, _left, _right);
    ctx.globalAlpha = 1;
  };
  this.draw_foams_top = function (y, y2, y3, diff_y, _left, _right) {
    _left -= 30;
    _right += 30;
    var p = -((((-y3 + WORLD.LW1SX) + diff_y) + 2) / WORLD.W1EX);
    if (p === 0)
      this.new_seed3();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam_vert(y3, p, this.seed3, 18, 16, _left, _right);
    ctx.globalAlpha = 1;
    var p = -(((-y + WORLD.LW2SX) + diff_y) / WORLD.W2EX);
    if (p === 0)
      this.new_seed();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam_vert(y, p, this.seed, 12, 10, _left, _right);
    ctx.globalAlpha = 1;
    if (y2 === -1)
      return;

    var p = -(((-y2 + WORLD.LW3SX) + diff_y) / WORLD.W3EX);
    if (p <= 0.01)
      this.new_seed2();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam_vert(y2, p, this.seed2, 6, 6, _left, _right);
    ctx.globalAlpha = 1;
  };
  this.draw_foams_left = function (x, x2, x3, diff_x, _top, _bottom) {
    _top -= 30;
    _bottom += 30;
    var p = -((((-x3 + WORLD.LW1SX) + diff_x) + 2) / WORLD.W1EX);
    if (p === 0)
      this.new_seed3();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam(x3, p, this.seed3, 18, 16, _top, _bottom);
    ctx.globalAlpha = 1;
    var p = -(((-x + WORLD.LW2SX) + diff_x) / WORLD.W2EX);
    if (p === 0)
      this.new_seed();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam(x, p, this.seed, 12, 10, _top, _bottom);
    ctx.globalAlpha = 1;
    if (x2 === -1)
      return;

    var p = -(((-x2 + WORLD.LW3SX) + diff_x) / WORLD.W3EX);
    if (p <= 0.01)
      this.new_seed2();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam(x2, p, this.seed2, 6, 6, _top, _bottom);
    ctx.globalAlpha = 1;
  };
  this.draw_foams_right = function (x, x2, x3, diff_x, _top, _bottom) {
    _top -= 30;
    _bottom += 30;
    var p = -((((x3 - WORLD.LW1SX) - diff_x) - 2) / WORLD.W1EX);
    if (p === 0)
      this.new_seed3();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam(x3, p, this.seed3, 18, 16, _top, _bottom);
    ctx.globalAlpha = 1;
    var p = -((((x - WORLD.LW2SX) - diff_x) + 500) / WORLD.W2EX);
    if (p === 0)
      this.new_seed();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam(x, p, this.seed, 12, 10, _top, _bottom);
    ctx.globalAlpha = 1;
    if (x2 === -1)
      return;

    var p = -((((x2 - WORLD.LW3SX) - diff_x) + 698) / WORLD.W3EX);
    if (p <= 0.01)
      this.new_seed2();

    ctx.globalAlpha = ease_in_out_quad(p);
    this.draw_foam(x2, p, this.seed2, 6, 6, _top, _bottom);
    ctx.globalAlpha = 1;
  };
  this.w1 = {
    r: new Ease(ease_out_cubic, 0, 10, WORLD.W1SX, WORLD.W1SX, WORLD.W1EX),
    l: new Ease(ease_in_out_cubic, 0, 10, WORLD.W1EX, WORLD.W1EX, WORLD.W1SX)
  };
  this.w2 = {
    r: new Ease(ease_out_quart, 0, 10, WORLD.W2SX, WORLD.W2SX, WORLD.W2EX),
    l: new Ease(ease_in_out_quad, 0, 10, WORLD.W2EX, WORLD.W2EX, WORLD.W2SX)
  };
  this.w3 = {
    r: new Ease(ease_out_quint, 0, 10, WORLD.W3SX, WORLD.W3SX, WORLD.W3EX),
    l: new Ease(ease_in_out_quad, 0, 10, WORLD.W3EX, WORLD.W3EX, WORLD.W3SX)
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
}

export function Player() {
  this.nickname = "";
  this.skin = 0;
  this.accessory = 0;
  this.bag = 0;
  this.baglook = 0;
  this.book = 0;
  this.crate = 0;
  this.dead = 0;
  this.level = 0;
  this.label = null;
  this.label_winter = null;
  this.ldb_label = null;
  this.alive = false;
  this.score = 0;
}

export function World(max_units) {

  this.mode = WORLD.MODE_PVP;

  this.max_units = max_units;

  this.custom_map = 0;
  this.islands = 6;

  this.players = [];
  this.units = [];
  this.fast_units = [];

  this.nw = 260;
  this.nh = 260;
  this.dw = 100;
  this.dh = 100;
  this.w = this.nw * this.dw;
  this.h = this.nh * this.dh;

  this.RNG = new RNG.Random();
  this.biomes = [];

  this.shade = new LinearAnimation(false, 0, 1, 0, 1, 1);
  this.transition = false;

  this.BIOME = [];
  this.BIOME_FOREST = 0;
  this.BIOME_WINTER = 1;
  this.BIOME_LAVA = 2;
  this.BIOME_DRAGON = 3;
  this.BIOME_SEA = 4;
  this.BIOME_DESERT = 10;
  this.BIOME[this.BIOME_FOREST] = {
    isSand: 1,
    day: [0x13, 0x3A, 0x2B],
    night: [0x04, 0x2B, 0x30],
    _color: ["#133a2b", "#042b30"]
  };
  this.BIOME[this.BIOME_SEA] = {
    isSand: 0,
    day: [0x0B, 0x6A, 0x84],
    night: [0x09, 0x37, 0x3F],
    _color: ["#0B6A84", "#09373F"],
  };
  this.BIOME[this.BIOME_WINTER] = {
    isSand: 0,
    day: [0xEB, 0xF2, 0xF0],
    night: [0x13, 0x61, 0x67],
    _color: ["#EBF2F0", "#136167"],
  };
  this.BIOME[this.BIOME_LAVA] = {
    isSand: 0,
    day: [0x2D, 0x20, 0x17],
    night: [0x03, 0x1C, 0x1E],
    _color: ["#2D2017", "#031C1E"],
  };
  this.BIOME[this.BIOME_DRAGON] = {
    isSand: 0,
    day: [0x4A, 0x4A, 0x4A],
    night: [0x18, 0x3D, 0x3C],
    _color: ["#4A4A4A", "#183D3C"],
  };

  this.BIOME[this.BIOME_DESERT] = {
    isSand: 0,
    day: [0xEB, 0xD8, 0xA6],
    night: [0x09, 0x3D, 0x38],
    _color: ["#EBD8A6", "#093D38"]
  };

  this.Biome = function (t, x, y, w, h, v) {

    this.x1 = x * 100;
    this.y1 = y * 100;
    this.w = w * 100;
    this.h = h * 100;
    this.x2 = (x + w) * 100;
    this.y2 = (y + h) * 100;
    this.t = t;
    if (v === undefined)
      this.v = 0xF;
    else
      this.v = v;
  };

  function add_biome(type, wmin, hmin, range, minDist) {

    var w = wmin + Math.floor(world.RNG.get() * range);
    var h = hmin + Math.floor(world.RNG.get() * range);
    var x1 = 10 + Math.floor(world.RNG.get() * (world.nw - w - 20));
    var y1 = 10 + Math.floor(world.RNG.get() * (world.nh - h - 20));
    var x2 = x1 + w;
    var y2 = y1 + h;

    // Check intersection
    for (var i = 0; i < world.biomes.length; i++) {

      var biome = world.biomes[i];
      if (intersect_aabb(x1, x2, y1, y2,
        biome.x1 / 100 - minDist, biome.x2 / 100 + minDist,
        biome.y1 / 100 - minDist, biome.y2 / 100 + minDist) === 1)
        return 0;
    }

    world.biomes.push(new world.Biome(type, x1, y1, w, h, 0xF));

    return 1;
  };

  function add_sea_biome(map, sx, sy) {

    var xMax = sx;
    for (var y = sy; y < world.nh; y++) {

      for (var x = sx; x < world.nw; x++) {

        if (y === sy)
          xMax = Math.max(x, xMax);

        if (x > xMax)
          break;

        // Add a new sea biome
        if (map[y][x] === 1)
          break;

        map[y][x] = 1;
      }

      if (x < xMax)
        break;
    }

    world.biomes.push(new world.Biome(world.BIOME_SEA, sx, sy, xMax - sx + 1, y - sy, 0xF));
  };

  function try_to_add_biome(type, wmin, hmin, range, attempt) {

    for (var i = 0; i < attempt; i++) {

      if (add_biome(type, wmin, hmin, range, 8) === 1)
        break;
    }

    if (i === attempt)
      return 0;
    return 1;
  };

  this.MAX_DIST = -1000000
  this.dist_winter = this.MAX_DIST;
  this.dist_desert = this.MAX_DIST;
  this.dist_lava = this.MAX_DIST;
  this.dist_forest = this.MAX_DIST;
  this.dist_water = this.MAX_DIST;
  this.dist_dragon = this.MAX_DIST;

  this.dist_from_biomes = function (player) {

    var x = player.r.x;
    var y = player.r.y;
    var i = Math.floor(y / 100);
    var j = Math.floor(x / 100);

    player.dist_winter = world.MAX_DIST;
    player.dist_desert = world.MAX_DIST;
    player.dist_lava = world.MAX_DIST;
    player.dist_forest = world.MAX_DIST;
    player.dist_dragon = world.MAX_DIST;
    player.dist_sand = world.MAX_DIST;

    for (var k = 0; world.biomes[k].t !== world.BIOME_SEA; k++) {

      if (world.biomes[k].t === world.BIOME_FOREST) {

        var new_dist = world.dist_from_biome(k, x, y);
        player.dist_forest = Math.max(player.dist_forest, new_dist);

        // Is the player in a beach ?
        if (new_dist > 0 && world.dist_from_sand(k, x, y) === 1)
          player.dist_sand = 1;

      } else if (world.biomes[k].t === world.BIOME_WINTER) {
        player.dist_winter = Math.max(player.dist_winter, world.dist_from_biome(k, x, y));
      } else if (world.biomes[k].t === world.BIOME_DESERT) {
        player.dist_desert = Math.max(player.dist_desert, world.dist_from_biome(k, x, y));
      } else if (world.biomes[k].t === world.BIOME_LAVA) {
        player.dist_lava = Math.max(player.dist_lava, world.dist_from_biome(k, x, y));
      } else if (world.biomes[k].t === world.BIOME_DRAGON) {
        player.dist_dragon = Math.max(player.dist_dragon, world.dist_from_biome(k, x, y));
      }
    }

    if (MAP.tiles[i][j]["iblk"])
      player.dist_sand = 1;

    if (world.find_bridge(j, i))
      player.dist_water = player.MAX_DIST;
    else if (MAP.tiles[i][j]["wtb"] || (player.dist_winter < 0 && player.dist_lava < 0 &&
      player.dist_forest < 0 && player.dist_sand < 0 && player.dist_dragon < 0 &&
      player.dist_desert < 0))
      player.dist_water = 1;
    else player.dist_water = player.MAX_DIST;
  };

  this.update_dist_from_biomes = function (x, y) {

    world.dist_winter = world.MAX_DIST;
    world.dist_desert = world.MAX_DIST;
    world.dist_lava = world.MAX_DIST;
    world.dist_dragon = world.MAX_DIST;
    world.dist_forest = world.MAX_DIST;

    for (var k = 0; world.biomes[k].t !== world.BIOME_SEA; k++) {

      if (world.biomes[k].t === world.BIOME_FOREST)
        world.dist_forest = Math.max(world.dist_forest, world.dist_from_biome(k, x, y));
      else if (world.biomes[k].t === world.BIOME_WINTER)
        world.dist_winter = Math.max(world.dist_winter, world.dist_from_biome(k, x, y));
      else if (world.biomes[k].t === world.BIOME_DESERT)
        world.dist_desert = Math.max(world.dist_desert, world.dist_from_biome(k, x, y));
      else if (world.biomes[k].t === world.BIOME_LAVA) {
        world.dist_lava = Math.max(world.dist_lava, world.dist_from_biome(k, x, y));
      } else if (world.biomes[k].t === world.BIOME_DRAGON)
        world.dist_dragon = Math.max(world.dist_dragon, world.dist_from_biome(k, x, y));
    }

    if (world.dist_winter < 0 && world.dist_dragon < 0 && world.dist_forest < 0 && world.dist_dragon < 0 &&
      world.dist_desert < 0)
      world.dist_water = 1;
    else world.dist_water = world.MAX_DIST;
  };

  this.dist_from_sand = function (bid, x, y) {

    var biome = world.biomes[bid];
    var is_sand = 0;

    x1 = biome.x1 + 30 + (((biome.v & WORLD.LEFT) === 0) ? 150 : 0);
    var d = x - x1;
    if ((biome.v & WORLD.LEFT) > 0 && d > 0 && d < 320)
      is_sand = 1;
    y1 = biome.y1 + 250 + (((biome.v & WORLD.TOP) === 0) ? 150 : 0);
    d = y - y1;
    if ((biome.v & WORLD.TOP) > 0 && d > 0 && d < 320)
      is_sand = 1;
    x2 = biome.x2 + 80 + (((biome.v & WORLD.RIGHT) === 0) ? -200 : 0);
    d = x2 - x;
    if ((biome.v & WORLD.RIGHT) > 0 && d > 0 && d < 320)
      is_sand = 1;
    y2 = biome.y2 - 200 + (((biome.v & WORLD.BOTTOM) === 0) ? -200 : 0);
    d = y2 - y;
    if ((biome.v & WORLD.BOTTOM) > 0 && d > 0 && d < 320)
      is_sand = 1;

    if (x >= x1 && x <= x2 && y >= y1 && y <= y2)
      return is_sand;

    return 0;
  }

  this.dist_from_biome = function (bid, x, y) {

    var biome = world.biomes[bid];
    x1 = biome.x1 + 30;
    y1 = biome.y1 + 250;
    x2 = biome.x2 + 80;
    y2 = biome.y2 - 200;

    if (x >= x1 && x <= x2 && y >= y1 && y <= y2)
      return Math.min(x - x1, x2 - x, y - y1, y2 - y);

    var dist = -1000000;
    if (x - x1 < 0)
      dist = Math.max(dist, x - x1);
    else if (x2 - x < 0)
      dist = Math.max(dist, x2 - x);

    distY = -1000000;
    if (y < y1 || y > y2) {

      if (y - y1 < 0)
        distY = Math.max(distY, y - y1);
      else
        distY = Math.max(distY, y2 - y);

      if (dist !== -1000000 && distY !== -1000000)
        dist = Math.min(dist, distY);
      else
        dist = distY;
    }

    return dist;
  };

  function add_lava(amount, biome_id) {

    var biome = world.biomes[biome_id];

    for (var k = 0, _k = 0; k < amount && _k < 10000; _k++) {

      // Fill the biome with magma
      var y = biome.y1 + world.RNG.get() * biome.h;
      var x = biome.x1 + world.RNG.get() * biome.w;
      var _i = Math.floor(y / 100);
      var _j = Math.floor(x / 100);

      var dist = world.dist_from_biome(biome_id, _j * 100 + 50, _i * 100 + 50);
      if (dist < 600) continue;

      var ok = 1;
      for (var i = _i - 4; (ok === 1) && i <= (_i + 4); i++) {
        for (var j = _j - 4; (ok === 1) && j <= (_j + 4); j++) {

          if (MAP.tiles[i][j] !== undefined)
            ok = 0;
        }
      }

      if (ok === 0) continue;

      render_single_resource(_i, _j, "la", k % 6, 0);

      k++;
    }
  }

  function add_river_line(i, j, size, di, dj, mem, w, h) {

    var w1 = Math.floor(w / 2);
    var w2 = Math.max(1, Math.floor(w / 2));
    var h1 = Math.floor(h / 2);
    var h2 = Math.max(1, Math.floor(h / 2));

    for (var k = 0; k < size; k++) {

      for (var _i = i - h1; _i < i + h2; _i++) {
        for (var _j = j - w1; _j < j + w2; _j++) {
          if (render_single_resource(_i, _j, "wtb", 0, 1) === 1)
            mem.push([_i, _j, 1]);
        }
      }

      i += di;
      j += dj;
    }
  };

  function add_oasis(biome_id, mem) {

    var biome = world.biomes[biome_id];
    var i = Math.floor(biome.y1 / 100);
    var j = Math.floor(biome.x1 / 100);
    var h = Math.floor(biome.h / 100);
    var w = Math.floor(biome.w / 100);
    var h2 = i + Math.floor(h / 2);
    var w2 = j + Math.floor(w / 2);

    for (var k = 0; k < 3; k++) {

      var _i = Math.floor(h2 - 3 + world.RNG.get() * 6);
      var _j = Math.floor(w2 - 3 + world.RNG.get() * 6);
      render_single_resource(_i, _j, "plm", k, 1)
    }

    for (var k = 0; k < 80; k++) {
      var _i = Math.floor(h2 - 3 + world.RNG.get() * 6);
      var _j = Math.floor(w2 - 3 + world.RNG.get() * 6);
      if (render_single_resource(_i, _j, "wtb", 0, 1) === 1)
        mem.push([_i, _j, 0]);
    }
  };

  function add_river(biome_id, mem) {

    var biome = world.biomes[biome_id];
    var i = Math.floor(biome.y1 / 100);
    var j = Math.floor(biome.x1 / 100);
    var h = Math.floor(biome.h / 100);
    var w = Math.floor(biome.w / 100);
    var jMax = j + w;

    var turn = 2;

    // River top - down
    var _h = h;
    var _i = i;
    var _j = j + 10 + Math.floor((w - 20) * world.RNG.get());

    for (var __j = _j - 4; __j < _j + 4; __j++)
      render_single_resource(i - 1, __j, "wtb", 0, 1)

    while (_h > 0) {

      // Top of the river
      if (turn === 2) {

        for (var k = 10; k > 1; k--) {
          add_river_line(_i, _j, 1, 1, 0, mem, k, 1);
          _h -= 1; _i += 1;
        }
        turn = 0;
        continue;
      }

      // End of the river
      if (_h < 10) {

        for (var k = 1; _h > 0; k++) {
          add_river_line(_i, _j, 1, 1, 0, mem, k, 1);
          _h -= 1; _i += 1;
        }
        continue;
      }

      if (turn === 1) {
        var __h = Math.min(_h, Math.floor(1 + 4 * world.RNG.get()));
        var w = 1 + Math.floor(world.RNG.get() * 4);
        add_river_line(_i, _j, __h, 1, 0, mem, w, w);
        turn = 0;
        _h -= __h;
        _i += __h;
        continue;
      }

      turn = 1;
      var __w = Math.floor(1 + 2 * world.RNG.get());
      var ___w = 1 + Math.floor(world.RNG.get() * 4);
      if (_j < j + 16) {
        add_river_line(_i, _j, __w, 0, 1, mem, ___w, ___w);
        _j += __w;
      } else if (_j > jMax - 16) {
        add_river_line(_i, _j, __w, 0, -1, mem, ___w, ___w);
        _j -= __w;
      } else if (world.RNG.get() > 0.5) {
        add_river_line(_i, _j, __w, 0, 1, mem, ___w, ___w);
        _j += __w;
      } else {
        add_river_line(_i, _j, __w, 0, -1, mem, ___w, ___w);
        _j -= __w;
      }
    }

    for (var __j = _j - 1; __j < _j + 2; __j++)
      render_single_resource(_i, __j, "wtb", 0, 1)
  }

  function render_river(biome_id, mem) {

    for (var k = 0; k < mem.length; k++) {

      var _i = mem[k][0];
      var _j = mem[k][1];
      var current = mem[k][2];

      add_single_river(_i, _j, biome_id, current);
    }
  };

  this.add_island = function (type, x, y) {

    // Fill the island with sand block "iblk"
    var _i = y;
    var _j = x;
    render_single_resource(_i, _j, "isl", type, 1);

    for (var k = 0; k < 4; k++) {
      for (var l = 0; l < 3; l++) {
        render_single_resource(_i - l, _j - k, "iblk", 0);
        render_single_resource(_i + l, _j - k, "iblk", 0);
        render_single_resource(_i + l, _j + k, "iblk", 0);
        render_single_resource(_i - l, _j + k, "iblk", 0);
      }
    }

    if (type === 0) {

      for (var k = 0; k < 2; k++) {
        render_single_resource(_i - k, _j - 4, "iblk", 0);
        render_single_resource(_i + k, _j - 4, "iblk", 0);
        render_single_resource(_i - k, _j + 4, "iblk", 0);
        render_single_resource(_i + k, _j + 4, "iblk", 0);
      }
      for (var k = 0; k < 3; k++) {
        render_single_resource(_i - 3, _j + k, "iblk", 0);
        render_single_resource(_i + 3, _j + k, "iblk", 0);
        render_single_resource(_i - 3, _j - k, "iblk", 0);
        render_single_resource(_i + 3, _j - k, "iblk", 0);
      }

      render_single_resource(_i - 2, _j - 4, "iblk", 0);
      render_single_resource(_i - 3, _j - 3, "iblk", 0);
      render_single_resource(_i + 2, _j + 4, "iblk", 0);
      render_single_resource(_i + 3, _j + 3, "iblk", 0);

    } else if (type === 1) {

      for (var k = 0; k < 3; k++) {
        render_single_resource(_i - k, _j - 4, "iblk", 0);
        render_single_resource(_i + k, _j - 4, "iblk", 0);
        render_single_resource(_i - k, _j + 4, "iblk", 0);
        render_single_resource(_i + k, _j + 4, "iblk", 0);
      }
      for (var k = 0; k < 4; k++) {
        render_single_resource(_i - 3, _j + k, "iblk", 0);
        render_single_resource(_i + 3, _j + k, "iblk", 0);
        render_single_resource(_i - 3, _j - k, "iblk", 0);
        render_single_resource(_i + 3, _j - k, "iblk", 0);
      }

    } else if (type === 2) {

      for (var k = 0; k < 2; k++) {
        render_single_resource(_i - k, _j - 4, "iblk", 0);
        render_single_resource(_i + k, _j - 4, "iblk", 0);
        render_single_resource(_i - k, _j + 4, "iblk", 0);
        render_single_resource(_i + k, _j + 4, "iblk", 0);
      }
      for (var k = 0; k < 3; k++) {
        render_single_resource(_i - 3, _j + k, "iblk", 0);
        render_single_resource(_i + 3, _j + k, "iblk", 0);
        render_single_resource(_i - 3, _j - k, "iblk", 0);
        render_single_resource(_i + 3, _j - k, "iblk", 0);
      }
    }


  };

  this.add_islands = function (amount) {

    for (var i = 0; i < world.biomes.length && amount > 0; i++) {

      var biome = world.biomes[i];

      if (biome.t !== world.BIOME_SEA)
        continue;

      if (biome.w > 1800 && biome.h > 1000) {

        var _j = Math.floor((biome.x1 + biome.w / 2) / 100);
        var _i = Math.floor((biome.y1 + biome.h / 2) / 100);
        world.add_island(amount % 3, _j, _i);

        // Fill the island with resources
        for (var k = 0; k < 3; k++) {
          var __i = _i - 2 + Math.floor(world.RNG.get() * 4);
          var __j = _j - 3 + Math.floor(world.RNG.get() * 6);
          if (MAP.tiles[__i][__j]["s"] === undefined)
            render_single_resource(__i, __j, "plm", k);
          var __i = _i - 2 + Math.floor(world.RNG.get() * 4);
          var __j = _j - 3 + Math.floor(world.RNG.get() * 6);
          if (MAP.tiles[__i][__j]["plm"] === undefined)
            render_single_resource(__i, __j, "s", k);
        }

        var __i = _i - 2 + Math.floor(world.RNG.get() * 4);
        var __j = _j - 3 + Math.floor(world.RNG.get() * 6);
        if (MAP.tiles[__i][__j]["plm"] === undefined && MAP.tiles[__i][__j]["s"] === undefined)
          render_single_resource(__i, __j, "p", 0, 1);

        amount--;
      }
    }
  }

  this.generate_world = function (seed) {

    world.RNG.init(seed);

    var attempt = 0;

    // Generate biome
    while (1) {

      attempt++;
      if (attempt > 10000)
        return;

      // Reset biome list
      world.biomes = [];

      if (world.custom_map === 0 && (world.mode === WORLD.MODE_VAMPIRES ||
        world.mode === WORLD.MODE_EXPERIMENTAL || world.mode === WORLD.MODE_PVP))
        world.custom_map = ___MAP___;

      if (world.mode === WORLD.MODE_ZOMBIES) {

        world.biomes.push(new world.Biome(world.BIOME_FOREST, 2, 2, 80, 80, 0xF));

      } else if (world.mode === WORLD.MODE_LEGACY) {

        world.biomes.push(new world.Biome(world.BIOME_FOREST, 2, 2, 150, 150, 0xF));

      } else {

        // Manual designed map
        if (world.custom_map !== 0 && world.custom_map.length > 0 && world.custom_map[0].length > 3) {

          // Biome placement
          for (var b = 0; b < world.custom_map.length; b++) {

            var elt = world.custom_map[b];

            if (elt[0] === 0) {

              var __id = WORLD.BIOME_FOREST;
              switch (elt[1]) {

                case "FOREST": __id = world.BIOME_FOREST; break;
                case "WINTER": __id = world.BIOME_WINTER; break;
                case "DESERT": __id = world.BIOME_DESERT; break;
                case "LAVA": __id = world.BIOME_LAVA; break;
                case "DRAGON": __id = world.BIOME_DRAGON; break;
              }
              world.biomes.push(new world.Biome(__id, elt[2],
                elt[3], elt[4], elt[5], elt[6], elt[7]));
              continue;

            } else break;
          }

          // Random generated map
        } else if (world.custom_map !== 0) {

          for (var b = 0; b < world.custom_map.length; b++) {
            var biome = world.custom_map[b];
            var __id = WORLD.BIOME_FOREST;
            switch (biome[0]) {

              case "FOREST": __id = world.BIOME_FOREST; break;
              case "WINTER": __id = world.BIOME_WINTER; break;
              case "DESERT": __id = world.BIOME_DESERT; break;
              case "LAVA": __id = world.BIOME_LAVA; break;
              case "DRAGON": __id = world.BIOME_DRAGON; break;
            }

            if (try_to_add_biome(__id, biome[1], biome[2], 0, (b + 1) * 10) === 0)
              break;
          }

          if (b !== world.custom_map.length)
            continue;
        }
      }

      break;
    }

    render_minimap();

    // Create a new sea biome
    var map = [];
    for (var i = 0; i < world.nh; i++) {
      map[i] = new Array(world.nw);
      for (var j = 0; j < world.nw; j++)
        map[i][j] = 0;
    }

    // Pre-fill the actual biome
    for (var i = 0; i < world.biomes.length; i++) {

      var biome = world.biomes[i];
      var x2 = biome.x2 / 100;
      var y2 = biome.y2 / 100;
      for (var x = biome.x1 / 100; x <= x2; x++) {
        for (var y = biome.y1 / 100; y <= y2; y++)
          map[y][x] = 1;
      }
    }

    // Fill with the sea biome
    for (var y = 0; y < world.nh; y++) {

      for (var x = 0; x < world.nw; x++) {

        if (map[y][x] === 0)
          add_sea_biome(map, x, y);
      }
    }

    // Add entities to the map
    MAP = { w: world.nw, h: world.nh, tiles: [] };
    for (var i = 0; i < world.nh; i++)
      MAP.tiles[i] = [];

    // Add manually placed islands to the map
    if (world.custom_map !== 0 && world.custom_map.length > 0 && world.custom_map[0].length > 3) {

      for (var b = 0; b < world.custom_map.length; b++) {

        var elt = world.custom_map[b];
        if (elt[1] === "isl")
          world.add_island(elt[2], elt[3], elt[4]);
      }

      // Add randomly placed islands to the map
    } else world.add_islands(world.islands);

    // Add manually placed resources to the map
    if (world.custom_map !== 0 && world.custom_map.length > 0 && world.custom_map[0].length > 3) {

      var mem = [];
      for (var b = 0; b < world.custom_map.length; b++) {

        var elt = world.custom_map[b];
        if (elt[0] !== 1) continue;

        if (elt[1] === "r") {
          render_single_resource(elt[3], elt[2], "wtb", 0, 1);
          mem.push([elt[3], elt[2], elt[4]]);
        } else
          render_single_resource(elt[4], elt[3], elt[1], elt[2], elt[5]);
      }

      render_river(0, mem);
      mem = [];

      // Add randomly placed resources to the map
    } else {
      for (var i = 0; i < world.biomes.length; i++) {

        var biome = world.biomes[i];

        if (world.mode === WORLD.MODE_LEGACY) {

          if (biome.t === world.BIOME_FOREST)
            add_forest_resources_v2(i, biome.w / (100 * 100));

        } else {

          if (biome.t === world.BIOME_FOREST)
            add_forest_resources(i, biome.w / (100 * 100));
          if (biome.t === world.BIOME_LAVA)
            add_lava_resources(i, biome.w / (100 * 100));
          if (biome.t === world.BIOME_WINTER)
            add_winter_resources(i, biome.w / (100 * 100));
          if (biome.t === world.BIOME_DESERT)
            add_desert_resources(i, biome.w / (100 * 100));
          if (biome.t === world.BIOME_DRAGON)
            add_dragon_resources(i);
        }
      }
    }

    // Add resources to the minimap
    render_all_resources_minimap();

    // Add logic layer to the map
    world.map_wrapper(MAP);
  };

  function add_dragon_resources(biome_id) {

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "s", i, 15);
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "a", i, 1);
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "d", i, 1);

    render_corner(biome_id);
  };

  function add_winter_resources(biome_id, size) {

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "s", i, Math.floor(18 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "f", i, Math.floor(24 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "d", i, Math.max(1, Math.floor(2 * size)), 0.3);
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "g", i, Math.floor(6 * size));

    render_corner(biome_id);
  }

  function add_desert_resources(biome_id, size) {

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "s", i, Math.floor(12 * size));

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "m", i, Math.max(1, Math.floor(1 * size)), 0.2);

    add_resources(biome_id, "c", 0, Math.floor(36 * size));

    var mem = [];
    add_oasis(biome_id, mem);
    render_river(biome_id, mem);
    mem = [];
  };

  function add_lava_resources(biome_id, size) {

    add_lava(80 * size, biome_id);

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "s", i, Math.floor(12 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "g", i, Math.floor(6 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "re", i, Math.max(1, Math.floor(1 * size)), 0.2);
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "a", i, Math.max(1, Math.floor(2 * size)));

    render_corner(biome_id);
  }

  function add_forest_resources_v2(biome_id, size) {

    for (var i = 0; i < 6; i++)
      add_resources(biome_id, "t", i, Math.floor(80 * size));
    for (var i = 0; i < 4; i++)
      add_resources(biome_id, "b", i, Math.floor(80 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "s", i, Math.floor(50 * size));

    var mem = [];
    for (var i = 0; i < 6; i++)
      add_river(biome_id, mem);
    render_river(biome_id, mem);
    mem = [];

    add_resources(biome_id, "p", 0, Math.floor(28 * size));

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "g", i, Math.floor(7 * size));

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "d", i, Math.floor(2 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "a", i, Math.floor(1 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "m", i, Math.floor(1 * size));

    add_resources(biome_id, "a", 0, Math.floor(1 * size));

    render_corner(biome_id);
  }

  function add_forest_resources(biome_id, size) {

    for (var i = 0; i < 6; i++)
      add_resources(biome_id, "t", i, Math.floor(20 * size));
    for (var i = 0; i < 4; i++)
      add_resources(biome_id, "b", i, Math.floor(20 * size));
    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "s", i, Math.floor(20 * size));

    var mem = [];
    add_river(biome_id, mem);
    render_river(biome_id, mem);
    mem = [];

    add_resources(biome_id, "p", 0, Math.floor(24 * size));

    for (var i = 0; i < 3; i++)
      add_resources(biome_id, "g", i, Math.floor(5 * size));

    if (world.mode === WORLD.MODE_ZOMBIES) {
      for (var i = 0; i < 3; i++)
        add_resources(biome_id, "d", i, Math.floor(3 * size));
      for (var i = 0; i < 3; i++)
        add_resources(biome_id, "a", i, Math.floor(2 * size));
    }

    render_corner(biome_id);
  }

  function render_corner(biome_id) {

    var biome = world.biomes[biome_id];
    render_single_resource(-3 + Math.floor(biome.y2 / 100), -1 + Math.floor(biome.x2 / 100), "s", 0, 0);
    render_single_resource(3 + Math.floor(biome.y1 / 100), -1 + Math.floor(biome.x2 / 100), "s", 0, 0);
    render_single_resource(-3 + Math.floor(biome.y2 / 100), 1 + Math.floor(biome.x1 / 100), "s", 0, 0);
    render_single_resource(3 + Math.floor(biome.y1 / 100), 1 + Math.floor(biome.x1 / 100), "s", 0, 0);
  };

  function add_resources(biome_id, type, subtype, amount, subpart) {

    var biome = world.biomes[biome_id];

    var x = Math.floor((biome.x1) / 100);
    var y = Math.floor((biome.y1) / 100);
    var w = Math.floor((biome.w) / 100);
    var h = Math.floor((biome.h) / 100);

    if (subpart !== undefined) {

      subpart = 1 - subpart;

      x += Math.floor(w * subpart / 2);
      y += Math.floor(h * subpart / 2);
      w -= Math.floor(w * subpart);
      h -= Math.floor(h * subpart);
    }

    var tiles = MAP.tiles;

    for (var k = 0, l = 0; k < amount; l++) {

      if (l > 50000)
        break;

      var i = y + Math.floor(world.RNG.get() * h);
      var j = x + Math.floor(world.RNG.get() * w);

      var dist = world.dist_from_biome(biome_id, j * 100 + 50, i * 100 + 50);
      if (dist < 400)
        continue;

      // Do not bind same resource type
      var tile = tiles[i][j + 1];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i][j - 1];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i + 1][j];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i - 1][j];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i + 1][j - 1];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i - 1][j + 1];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i + 1][j + 1];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;
      var tile = tiles[i - 1][j - 1];
      if (tile !== undefined && tile[type] !== undefined && tile[type][subtype] !== undefined)
        continue;

      if (tiles[i][j] === undefined) {

        render_single_resource(i, j, type, subtype, 1);
        k++;
      }
    }
  };

  function inside_map(i, j) {

    return (i >= 0 && j >= 0 && i < world.nh && j < world.nw);
  };

  function add_single_river(i, j, biome_id, current) {

    if (!inside_map(i, j))
      return;

    tiles = MAP.tiles;

    if (tiles[i][j] === undefined)
      tiles[i][j] = {}
    if (tiles[i][j]["r"] !== undefined)
      return;

    var code = 0;
    if (inside_map(i - 1, j) && tiles[i - 1][j] !== undefined && tiles[i - 1][j]["wtb"] !== undefined) code += 2
    if (inside_map(i, j - 1) && tiles[i][j - 1] !== undefined && tiles[i][j - 1]["wtb"] !== undefined) code += 8
    if (inside_map(i, j + 1) && tiles[i][j + 1] !== undefined && tiles[i][j + 1]["wtb"] !== undefined) code += 16
    if (inside_map(i + 1, j) && tiles[i + 1][j] !== undefined && tiles[i + 1][j]["wtb"] !== undefined) code += 64
    if (inside_map(i - 1, j - 1) && ((code & (8 + 2)) === (8 + 2)) && tiles[i - 1][j - 1] !== undefined &&
      tiles[i - 1][j - 1]["wtb"] !== undefined)
      code += 1;
    if (inside_map(i - 1, j + 1) && ((code & (16 + 2)) === (16 + 2)) && tiles[i - 1][j + 1] !== undefined &&
      tiles[i - 1][j + 1]["wtb"] !== undefined)
      code += 4;
    if (inside_map(i + 1, j - 1) && ((code & (8 + 64)) === (8 + 64)) && tiles[i + 1][j - 1] !== undefined &&
      tiles[i + 1][j - 1]["wtb"] !== undefined)
      code += 32;
    if (inside_map(i + 1, j + 1) && ((code & (16 + 64)) === (16 + 64)) && tiles[i + 1][j + 1] !== undefined &&
      tiles[i + 1][j + 1]["wtb"] !== undefined)
      code += 128;

    tiles[i][j]["r"] = {};
    tiles[i][j]["r"].river = code;
    tiles[i][j]["r"].current = current;
    tiles[i][j]["r"].dist = world.dist_from_biome(biome_id, j * 100 + 50, i * 100 + 50) - 400;
    tiles[i][j]["r"]["x"] = j * 100 + 50;
    tiles[i][j]["r"]["y"] = i * 100 + 50;
  };

  function render_single_resource(i, j, type, subtype, _show) {

    if (i < 0 || j < 0 || i >= world.nh || j >= world.nw)
      return;

    tiles = MAP.tiles;

    if (tiles[i][j] === undefined)
      tiles[i][j] = {}

    // Avoid doublon
    if (tiles[i][j][type] !== undefined)
      return 0;

    tiles[i][j][type] = [];
    tiles[i][j][type][subtype] = [
      {
        "x": j * 100 + 50,
        "y": i * 100 + 50
      }
    ];

    if (_show === 1)
      add_resource_minimap(type, subtype, i, j);

    return 1;
  };
  this.render_single_resource = render_single_resource;

  function apply_animation(tile, o, anim) {

    if (tile[o]) {
      for (k = 0; k < tile[o].length; k++) {

        if (!tile[o][k])
          continue;

        for (l = 0; l < tile[o][k].length; l++) {
          tile[o][k][l].hit = anim;
          tile[o][k][l].update = false;
          tile[o][k][l].time = 0;
          tile[o][k][l].angle = 0;
        }
      }
    }
  }

  this.map_wrapper = function (MAP) {

    /* Apply wrapper on map */
    for (var i = 0; i < this.nh; i++) {
      for (var j = 0; j < this.nw; j++) {

        if (!MAP.tiles[i])
          MAP.tiles[i] = [];
        if (!MAP.tiles[i][j]) {
          MAP.tiles[i][j] = [];
          continue;
        }

        var tile = MAP.tiles[i][j];

        if (tile["de"] && tile["de"].length > 0) {

          for (var k = 0; k < tile["de"].length; k++) {

            if (tile["de"][k] && tile["de"][k].length > 0) {

              tile["de"] = tile["de"][k][0];
              if (k >= 41 && k <= 49) {

                tile["de"].scale = 3;
                var compo = Math.floor(Math.random() * 3 + 1);
                tile["de"].p = [];
                for (var l = 0; l < compo; l++) {
                  tile["de"].p.push({
                    x: Math.random() * 120 - 60,
                    y: Math.random() * 120 - 60,
                    angle: Math.random() * Math.PI * 2,
                    _id: 41 + Math.floor(Math.random() * 9)
                  });
                }

              } else if (k >= 19 && k <= 26) {

                tile["de"].scale = 3;
                var compo = Math.floor(Math.random() * 3 + 1);
                tile["de"].p = [];
                for (var l = 0; l < compo; l++) {
                  tile["de"].p.push({
                    x: Math.random() * 120 - 60,
                    y: Math.random() * 120 - 60,
                    angle: Math.random() * Math.PI * 2,
                    _id: 19 + Math.floor(Math.random() * 8)
                  });
                }

              } else if (k <= 15 || (k >= 27 && k <= 40)) {
                tile["de"].angle = 0;
                tile["de"].scale = 2;
                tile["de"]._id = k;
              } else {

                tile["de"].angle = Math.random() * Math.PI * 2;
                tile["de"].scale = 1;
                tile["de"]._id = k;
              }

            }
          }
        }

        apply_animation(tile, "p", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "t", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "s", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "g", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "d", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "b", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "f", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "sw", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "gw", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "dw", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "a", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "cs", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "plm", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "re", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "c", new LinearAnimation(false, 1, 1, 0, 10, 10));
        apply_animation(tile, "m", new LinearAnimation(false, 1, 1, 0, 10, 10));
      }
    }
  };

  this.time = SPRITE.DAY;

  this.clock = {

    translate: { x: 0, y: 0 },
    init: 0,
    hour: 0,
    now: 0,
  }

  this.delete_all_units = function () {

    this.fast_units = [];

    for (const [key, _] of Object.entries(ITEMS))
      this.units[ITEMS[key]] = [];

    return;
  };
  this.delete_all_units();

  this.delete_units = function (uid) {

    if (!this.fast_units[uid]) return;
    type = this.fast_units[uid].type;
    this.fast_units[uid] = null;

    /* Remove all units with this uid */
    var units = this.units[type];
    for (var j = 0; j < units.length; j++) {

      if (units[j].uid == uid) {

        units.splice(j, 1);
        return;
      }
    }

    return;
  };

  this.find_tower = function (i, j) {

    for (var k = 0; k < this.units[ITEMS.WOOD_TOWER].length; k++) {

      var b = this.units[ITEMS.WOOD_TOWER][k];
      if (Math.floor(b.x / 100) === j && Math.floor(b.y / 100) === i)
        return 1;
    }

    return 0;
  };

  this.find_bridge = function (i, j) {

    for (var k = 0; k < this.units[ITEMS.BRIDGE].length; k++) {

      var b = this.units[ITEMS.BRIDGE][k];
      if (Math.floor(b.x / 100) == i && Math.floor(b.y / 100) == j)
        return true;
    }

    return false;
  };

  this.move_units = function (list) {

    for (var i = 0; i < list.length; i++) {

      b = list[i];

      /* Update angle */
      if (b.angle != b.nangle) {

        var pi2 = Math.PI * 2;
        b.angle = (b.angle + pi2) % pi2
        b.nangle = (b.nangle + pi2) % pi2

        if (b.angle != b.nangle) {

          var diff = b.nangle - b.angle;

          /* Ease rotation */
          var min = Math.abs(diff);
          if (min > Math.PI) min = Math.PI * 2 - min;
          var rotate = 3 * (min / Math.PI) * WORLD.ROTATE * delta;

          if (diff > Math.PI)
            b.angle -= rotate;
          else if (diff < -Math.PI)
            b.angle += rotate;
          else if (diff < 0)
            b.angle -= rotate;
          else
            b.angle += rotate;

          b.angle = (b.angle + pi2) % pi2
          if (Math.abs(b.angle - b.nangle) < rotate)
            b.angle = b.nangle;
        }
      }

      /* Update position */
      if (b.x != b.r.x || b.y != b.r.y) {

        if (b.action & STATE.IDLE) b.action -= STATE.IDLE;
        b.action |= STATE.WALK;

        var a = get_std_angle(b, b.r) + Math.PI;
        var d = delta * b.speed;
        var v = build_vector(d, a);

        if (norm(v) < norm(get_vector(b, b.r)))
          add_vector(b, v);
        else {
          if (b.action & STATE.WALK) b.action -= STATE.WALK;
          b.action |= STATE.IDLE;

          copy_vector(b.r, b);
        }
      }

      /* Update bubbles of ghost */
      if (b.ghost) {

        var bubbles = b.bubbles;
        var l = bubbles.length;

        if (l === 0 || (l < SPRITE.GHOST_BUBBLES && bubbles[l - 1].life < 0.95))
          bubbles.push({
            id: Math.floor(Math.random() * sprite[SPRITE.BUBBLES][0].length),
            x: Math.floor(b.x + Math.random() * 80 - 40),
            y: Math.floor(b.y + Math.random() * 80 - 40),
            life: 1
          });

        /* Decrease opacity of bubbles */
        for (var j = 0; j < l; j++)
          bubbles[j].life = Math.max(0, bubbles[j].life - delta);

        for (var j = 0; j < l; j++) {
          if (bubbles[j].life === 0) {
            bubbles.splice(j, 1);
            break;
          }
        }
      }

      var has_swim = 0;

      if (b.move_effect && ui.quality) {
        var swim = b.swim;
        var l = swim.length;

        if (b.dist_water > 0 && b.vehicle !== INV.BABY_DRAGON &&
          b.vehicle !== INV.BABY_LAVA && b.vehicle !== INV.PLANE &&
          b.vehicle !== INV.HAWK && b.vehicle !== INV.NIMBUS && !b.ghost) {

          has_swim = 1;
          if (l === 0 || dist(swim[l - 1], b) > SPRITE.SWIM_SPACE) {
            var angle = -b.angle;
            var x = Math.sin(angle) * 45 * scale;
            var y = Math.cos(angle) * 45 * scale;
            swim.push({ x: b.x + x, y: b.y + y, r: 8, alpha: 0.8 });
            swim.push({ x: b.x - x, y: b.y - y, r: 8, alpha: 0.8 });
            swim.push({ x: b.x, y: b.y, r: 24, alpha: 1 });
          }
        }

        /* Decrease opacity and increase radius of swim effect */
        for (var j = 0; j < l; j++) {
          swim[j].alpha = Math.max(0, swim[j].alpha - delta / 2.2);
          swim[j].r += delta * 20;
        }

        if (swim.length > 0 && swim[0].alpha === 0) swim.splice(0, 1);

        /* Update foot print */
        var foot = b.foot;
        var l = foot.length;

        var id = -1;

        var __s = Math.max(0, Math.sign(b.dist_sand));
        var __w = Math.max(0, Math.sign(b.dist_winter));
        var __r = Math.max(0, Math.sign(b.dist_desert));
        var __l = Math.max(0, Math.sign(b.dist_lava));
        var __d = Math.max(0, Math.sign(b.dist_dragon));

        //if ((((__s ^ __w) ^ __l) ^ __d) === 0);
        if (b.dist_sand > 0 || b.dist_desert > 0)
          var id = SPRITE.SAND_STEP;
        else if (b.dist_dragon > 0)
          var id = SPRITE.CAVE_STEP;
        else if (b.dist_winter > 0)
          var id = SPRITE.SNOW_STEP;
        else if (b.dist_lava > 0)
          var id = SPRITE.LAVA_STEP;

        // Set special foot step for mount
        if (b.vehicle === INV.MOUNT_BOAR && (__s | __w | __l | __d) === 1) {
          id = SPRITE.BOAR_STEP;
          var footAngle = b.vehicle_fx2 - Math.PI / 2;
          var footDist = 15;
          var footDist2 = 11;
          var step_space = SPRITE.STEP_SPACE;
        } else if (b.vehicle === INV.BABY_MAMMOTH && (__s | __w | __l | __d) === 1) {
          id = SPRITE.BABY_MAMMOTH_STEP;
          var footAngle = b.vehicle_fx2 - Math.PI / 2;
          var footDist = 21;
          var footDist2 = 16;
          var step_space = SPRITE.STEP_SPACE;
        } else if (b.vehicle === INV.CRAB_BOSS && (__s | __w | __l | __d) === 1) {
          id = SPRITE.CRAB_STEP;
          var footAngle = b.vehicle_fx2 - Math.PI / 2;
          var footRand = Math.random() * 50;
          var footDist = 10 + footRand;
          var footDist2 = 0 + footRand;
          var step_space = SPRITE.STEP_SPACE * 0.9;
        } else {
          var footAngle = b.angle;
          var footDist = 15;
          var footDist2 = 11;
          var step_space = SPRITE.STEP_SPACE;
        }

        if (b.vehicle === INV.BABY_DRAGON || b.vehicle === INV.BABY_LAVA ||
          b.vehicle === INV.NIMBUS || b.vehicle === INV.HAWK || b.vehicle === INV.PLANE || b.ghost);
        else if (b.vehicle === INV.SLED) {

          if (l === 0 || dist(foot[l - 1], b) > SPRITE.TRAIL_SPACE)
            foot.push({
              x: b.x, y: b.y, angle: b.vehicle_fx2,
              alpha: 1, id: SPRITE.SLED_WAVE
            });
        } else if (id != -1 && has_swim === 0) {


          if (l === 0 || dist(foot[l - 1], b) > step_space) {

            b.id_foot++

            if (Math.abs(b.x - b.r.x) > 1 && Math.abs(b.y - b.r.y) > 1) {

              if ((b.r.x > b.x && b.r.y < b.y) || (b.r.x < b.x && b.r.y > b.y)) {
                if (b.id_foot % 2) { var x = -footDist2 * scale; var y = -footDist2 * scale; }
                else { var y = footDist2 * scale; var x = footDist2 * scale; }
              } else {
                if (b.id_foot % 2) { var x = footDist2 * scale; var y = -footDist2 * scale; }
                else { var y = footDist2 * scale; var x = -footDist2 * scale; }
              }

            } else if (b.id_foot % 2) {
              var x = Math.sin(footAngle) * footDist * scale;
              var y = Math.cos(footAngle) * footDist * scale;
            } else {
              var x = -Math.sin(footAngle) * footDist * scale;
              var y = -Math.cos(footAngle) * footDist * scale;
            }

            foot.push({ x: b.x + x, y: b.y + y, angle: footAngle + Math.PI / 2, alpha: 1, id: id });
          }
        }

        /* Decrease opacity of foot step */
        for (var j = 0; j < l; j++) {
          if (foot[j].id === SPRITE.SLED_WAVE)
            foot[j].alpha = Math.max(0, foot[j].alpha - delta * 1.5);
          else
            foot[j].alpha = Math.max(0, foot[j].alpha - delta / 2.85);
        }

        if (foot.length > 0 && foot[0].alpha === 0) foot.splice(0, 1);
      }
    }
  }

  this.update = function () {

    this.move_units(this.units[ITEMS.PLAYERS]);
    this.move_units(this.units[ITEMS.RABBIT]);
    this.move_units(this.units[ITEMS.WOLF]);
    this.move_units(this.units[ITEMS.CRAB]);
    this.move_units(this.units[ITEMS.BOAR]);
    this.move_units(this.units[ITEMS.BABY_MAMMOTH]);
    this.move_units(this.units[ITEMS.CRAB_BOSS]);
    this.move_units(this.units[ITEMS.BABY_DRAGON]);
    this.move_units(this.units[ITEMS.BABY_LAVA]);
    this.move_units(this.units[ITEMS.HAWK]);
    this.move_units(this.units[ITEMS.SPIDER]);
    this.move_units(this.units[ITEMS.FOX]);
    this.move_units(this.units[ITEMS.PENGUIN]);
    this.move_units(this.units[ITEMS.SPELL]);
    this.move_units(this.units[ITEMS.FIREFLY]);
    this.move_units(this.units[ITEMS.BEAR]);
    this.move_units(this.units[ITEMS.MAMMOTH]);
    this.move_units(this.units[ITEMS.VULTURE]);
    this.move_units(this.units[ITEMS.SAND_WORM]);
    this.move_units(this.units[ITEMS.DRAGON]);
    this.move_units(this.units[ITEMS.FLAME]);
    this.move_units(this.units[ITEMS.PIRANHA]);
    this.move_units(this.units[ITEMS.KRAKEN]);
    this.move_units(this.units[ITEMS.LAVA_DRAGON]);
  }

  this.breath = [];
  this.breath[SPRITE.LAKE] = new LinearAnimation(false, 1, 1.05, 1, 0.008, 0.008);
  this.breath[SPRITE.LAKE_DEEP] = new LinearAnimation(false, 1, 1.08, 1, 0.006, 0.006);
  this.breath[SPRITE.WAVE_ONE] = new LinearAnimation(false, 1, 1.02, 1, 0.008, 0.008);
  this.breath[SPRITE.WAVE_TWO] = new LinearAnimation(false, 1, 1.08, 1, 0.006, 0.006);

  this.lava = [];
  this.lava[0] = new LinearAnimation(false, 0.1, 1, 0, 0.6, 0.6);
  this.lava[1] = new LinearAnimation(false, 0.4, 1, 0, 0.6, 0.6);
  this.lava[2] = new LinearAnimation(false, 0.3, 1, 0, 0.6, 0.6);
  this.lava[3] = new LinearAnimation(false, 0.8, 1, 0, 0.6, 0.6);
  this.lava[4] = new LinearAnimation(false, 0.3, 1, 0, 0.6, 0.6);
  this.lava[5] = new LinearAnimation(false, 0.8, 1, 0, 0.6, 0.6);
  this.lava[6] = new LinearAnimation(false, 0.5, 1, 0, 0.6, 0.6);
  this.lava[7] = new LinearAnimation(false, 0.9, 1, 0, 0.6, 0.6);
  this.lava[8] = new LinearAnimation(false, 0.6, 1, 0, 0.6, 0.6);
  this.lava[9] = new LinearAnimation(false, 0.2, 1, 0, 0.6, 0.6);
  this.lava[10] = new LinearAnimation(false, 0.6, 1, 0, 0.6, 0.6);
  this.lava[11] = new LinearAnimation(false, 0.4, 1, 0, 0.6, 0.6);
  this.lava[12] = new LinearAnimation(false, 0.8, 1, 0, 0.6, 0.6);
  this.lava[13] = new LinearAnimation(false, 0.2, 1, 0, 0.6, 0.6);
  this.lava[14] = new LinearAnimation(false, 0.7, 1, 0, 0.6, 0.6);
}

export function Item(type, pid, id, x, y, angle, action, info, speed, extra) {

  this.type = type;
  this.pid = pid;
  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.nangle = angle;
  this.action = action;
  this.info = info;
  this.extra = extra;
  this.r = { x: x, y: y };
  this.speed = speed;

  if (world) this.uid = pid * world.max_units + id;

  switch (type) {

    case ITEMS.PLAYERS:

      this.player = world.players[this.pid];
      this.skin = this.player.skin;

      this.baglook = this.player.baglook;
      this.book = this.player.book;
      this.accessory = this.player.accessory;

      this.dist_forest = -1000000;
      this.dist_lava = -1000000;
      this.dist_winter = -1000000;
      this.dist_desert = -1000000;
      this.dist_water = -1000000;
      this.dist_sand = -1000000;
      this.dist_dragon = -1000000;

      this.zombie = (world.mode === WORLD.MODE_ZOMBIES && this.skin === WORLD.ZOMBIE_SKIN) ? true : false;
      this.vampire = (world.mode === WORLD.MODE_VAMPIRES && this.skin === WORLD.VAMPIRE_SKIN) ? true : false;
      this.superzombie = (this.zombie && this.player.nickname === "  ") ? true : false;
      this.foot = [];
      this.tower = 0;
      this.move_effect = true;
      this.id_foot = 0;
      this.fly = 0;
      this.swim = [];
      this.r = { x: x, y: y };
      this.draw = draw_player;
      this.draw_vehicle = draw_vehicle;
      this.vehicle_fx1 = 0;
      this.vehicle_fx2 = 0;
      this.vehicle_fx3 = 0;
      this.vehicle_fx4 = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.vehicle_fx5 = 0;
      this.tower_fx = 0;

      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      this.heal = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      this.freeze = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      this.starve = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      this.idle = new LinearAnimation(true, 0, 2.25, -1.5, 3.75, 7.5);
      this.walk = new LinearAnimation(true, 0, 7.5, -3, 22.5, 33.75);
      this.attack = new LinearAnimation(false, 0, 0, -Math.PI / 3, 6, 9);
      this.slow_attack = 0;
      this.web = new LinearAnimation(false, 0.6, 0.6, 0, 1, 3);
      this.move_head = (this.superzombie) ? new LinearAnimation(true, 0, 2.25, -1.5, 2.75, 5.5) : 0;
      this.angle_init = 0;
      this.text_ease = 0;
      this.text_effect = [];
      this.text_move = [];
      this.text = [];
      this.label = [];
      this.draw_text = draw_chat;
      this.hand = true;
      this.right = -1;
      this.vehicle = -1;
      this.action = STATE.IDLE;
      this.collide = false;
      this.clothe = 0;
      this.ghost = false;
      this.bubbles = [];
      this.bag = 0;
      this.sid = -1;

      this.update = function (action) {

        if (this.info & 0x8000) { this.collide = true; this.info = ~0x8000 & this.info; }
        else this.collide = false;

        if (this.info & 0x4000) { this.info = ~0x4000 & this.info; this.bag = 1; }
        else this.bag = 0;

        this.clothe = Math.floor(this.info / 128);
        this.info -= 128 * this.clothe;
        if (this.info === INV.HAND || this.superzombie)
          this.right = -1;
        else this.right = this.info;

        this.tower = world.find_tower(Math.floor(this.r.y / 100), Math.floor(this.r.x / 100));
        this.vehicle = this.extra & 0xFF;

        /* If player is a ghost */
        if (this.right === WORLD.GHOST)
          this.ghost = true;
        else this.ghost = false;

        if (SLOW_DOWN[this.right])
          this.weapon = true;
        else this.weapon = false;

        /* Player is stuck */
        if (action & STATE.WEB) {

          this.web.o = false;
          this.web.v = 0.6;

        } else if (action & STATE.COLD) {

          this.freeze.o = false;
          this.freeze.v = 0.6;

        } else if (action & STATE.HEAL) {

          this.heal.o = false;
          this.heal.v = 0.6;
        }

        if (action & STATE.HUNGER) {

          this.starve.o = false;
          this.starve.v = 0.6;
        }

        if (action & STATE.HURT) {

          this.hit.o = false;
          this.hit.v = 0.6;
        }

        if (action & STATE.ATTACK) {
          this.slow_attack = CLIENT.SLOW_ATTACK;

          if (audio.run && this.sid !== -1)
            audio.players[this.sid].swing(SOUND[this.right]);
        }
      }

      this.update();

      break;

    case ITEMS.EMERALD_MACHINE:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      }
      this.draw_bg = draw_emerald_machine_halo;
      this.draw_fg = draw_emerald_machine;
      this.halo = new LinearAnimation(false, 1, 1.23, 1.18, 0.01, 0.01);
      this.rotate1 = 0;
      this.rotate2 = 0;
      this.draw_life = draw_life;

      break;

    case ITEMS.RESURRECTION:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      }
      this.draw_bg = draw_resurrection_halo;
      this.draw_fg = draw_resurrection;
      this.halo = new LinearAnimation(false, 1, 1.23, 1.18, 0.01, 0.01);
      this.rotate1 = 0;
      this.rotate2 = 0;

      break;

    case ITEMS.FIRE:
    case ITEMS.BIG_FIRE:

      this.draw_bg = draw_fire_ground;
      this.draw_fg = draw_fire_halo;
      this.fire = new LinearAnimation(false, 1, 1.03, 0.98, 0.3, 0.3);
      this.ground = new LinearAnimation(false, 1, 1.23, 1.18, 0.01, 0.01);
      this.halo = new LinearAnimation(false, 1, 1.23, 1.18, 0.01, 0.01);
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      }

      break;

    case ITEMS.TOMATO_SEED:

      this.draw_bg = draw_tomato;
      this.draw_fg = draw_tomato_fruit;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      }

      this.fruits = [];
      for (var i = 0; i < 3; i++)
        this.fruits.push({
          draw: draw_breath_2,
          breath: new LinearAnimation(false, 0.90 + Math.random() * 0.15,
            1.05, 0.90, 0.2, 0.2),
        });

      this.fruits[0].x = this.x - 16.5; this.fruits[0].y = this.y - 15.5;
      this.fruits[0].angle = this.angle;
      this.fruits[1].x = this.x + 36; this.fruits[1].y = this.y + 17;
      this.fruits[1].angle = this.angle;
      this.fruits[2].x = this.x - 18.5; this.fruits[2].y = this.y + 39;
      this.fruits[2].angle = this.angle;
      break;

    case ITEMS.SEED:

      this.draw_bg = draw_seed;
      this.draw_fg = draw_plant;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      }

      this.fruits = [];
      for (var i = 0; i < 3; i++)
        this.fruits.push({
          draw: draw_breath,
          breath: new LinearAnimation(false, 0.90 + Math.random() * 0.15,
            1.05, 0.90, 0.2, 0.2),
        });

      this.fruits[0].x = this.x - 16.5; this.fruits[0].y = this.y - 15.5;
      this.fruits[1].x = this.x - 5.5; this.fruits[1].y = this.y + 7.5;
      this.fruits[2].x = this.x + 18; this.fruits[2].y = this.y - 5;
      break;

    case ITEMS.BABY_MAMMOTH:

      this.draw = draw_baby_mammoth;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.BOAR:

      this.draw = draw_boar;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.CRAB_BOSS:

      this.draw = draw_crab_boss;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.breathl = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.breathr = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      this.heal = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.CRAB:

      this.draw = draw_crab;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.breathl = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.breathr = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      this.heal = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.FLAME:

      this.draw = draw_simple_mobs_hd;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.FIREFLY:

      this.draw = draw_simple_mobs;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.5, 0.5);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.SPELL:

      this.spell = this.info & 0xF;
      this.fly = this.extra & 1;
      this.born = 0;
      this.x = this.info;
      this.y = this.extra;
      this.draw = draw_spell;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.6, 0.6);
      break;

    case ITEMS.RABBIT:
    case ITEMS.WOLF:
    case ITEMS.SPIDER:
    case ITEMS.FOX:
    case ITEMS.BEAR:
    case ITEMS.MAMMOTH:
    case ITEMS.PIRANHA:
    case ITEMS.KRAKEN:
    case ITEMS.PENGUIN:

      this.draw = draw_simple_mobs;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.SIGN:
      this.draw = draw_sign;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.BREAD_OVEN:
      this.draw_fg = draw_bread_oven_smog;
      this.draw = draw_bread_oven;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.up = new LinearAnimation(false, 1, 1.03, 0.98, 0.1, 0.1);
      this.smog = [];
      break;

    /*Christmas*/
    case ITEMS.GIFT:
      this.angle = Math.random() * Math.PI / 2;

    case ITEMS.CRATE:
    case ITEMS.DEAD_BOX:
      this.draw = draw_crate;
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.TREASURE_CHEST:
      this.draw = draw_simple_mobs_2;
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.LAVA_DRAGON:
      this.scale = 1;
      this.draw = draw_lava_dragon;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.SAND_WORM:

      this.dig = 0;
      this.ground = [];
      this.groundTimer = 0;
      this.draw_ground = draw_sand_worm_ground;
      this.draw = draw_sand_worm;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.VULTURE:

      this.x = this.info;
      this.y = this.extra;
      this.scale = 1;
      this._alpha = 0;
      this.draw = draw_vulture;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.HAWK:

      this.x = this.info;
      this.y = this.extra;
      this.scale = 1;
      this._alpha = 0;
      this.draw = draw_hawk;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.BABY_LAVA:

      this.scale = 1;
      this.draw = draw_baby_lava;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.BABY_DRAGON:

      this.scale = 1;
      this.draw = draw_baby_dragon;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.DRAGON:

      this.scale = 1;
      this.draw = draw_dragon;
      this.breath = new LinearAnimation(false, 0.90 + Math.random() * 0.15,
        1.05, 0.90, 0.2, 0.2);
      this.rotate = new LinearAnimation(false, 0, 0, -Math.PI / 6, 0.5, 1);
      this.hit = new LinearAnimation(false, 0.6, 0.6, 0, 5, 3);
      break;

    case ITEMS.FRUIT:

      this.fruits = [];
      for (var i = 0; i < 5; i++)
        this.fruits.push({
          draw: draw_breath,
          breath: new LinearAnimation(false, 0.90 + Math.random() * 0.15,
            1.05, 0.90, 0.2, 0.2),
        });

      switch (this.id % 3) {

        case 0:
          this.fruits[0].x = this.x - 20.5; this.fruits[0].y = this.y - 22.5;
          this.fruits[1].x = this.x - 35.5; this.fruits[1].y = this.y + 7.5;
          this.fruits[2].x = this.x + 7.5; this.fruits[2].y = this.y - 30;
          this.fruits[3].x = this.x + 22.5; this.fruits[3].y = this.y;
          this.fruits[4].x = this.x - 7.5; this.fruits[4].y = this.y + 14.5;
          break;

        case 1:
          this.fruits[0].x = this.x - 30.5; this.fruits[0].y = this.y - 22.5;
          this.fruits[1].x = this.x - 15.5; this.fruits[1].y = this.y + 7.5;
          this.fruits[2].x = this.x + 15.5; this.fruits[2].y = this.y - 30;
          this.fruits[3].x = this.x + 12.5; this.fruits[3].y = this.y + 5;
          this.fruits[4].x = this.x - 40.5; this.fruits[4].y = this.y + 14.5;
          break;

        case 2:
          this.fruits[0].x = this.x - 20.5; this.fruits[0].y = this.y - 20.5;
          this.fruits[1].x = this.x - 35.5; this.fruits[1].y = this.y + 15.5;
          this.fruits[2].x = this.x + 7.5; this.fruits[2].y = this.y - 17;
          this.fruits[3].x = this.x + 22.5; this.fruits[3].y = this.y + 5;
          this.fruits[4].x = this.x - 7.5; this.fruits[4].y = this.y + 1.5;
          break;
      }

      break;

    case ITEMS.WHEAT_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_wheat;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      this.wind = new LinearAnimation(false, 0, Math.PI / 30, -Math.PI / 30, 0.06, 0.06);
      break;

    case ITEMS.THORNBUSH_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_thornbush;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      break;


    case ITEMS.GARLIC_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_garlic;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      break;

    case ITEMS.CARROT_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_carrot;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      break;

    case ITEMS.ALOE_VERA_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_aloe_vera;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      break;

    case ITEMS.WATERMELON_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_watermelon;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      break;

    case ITEMS.PUMPKIN_SEED:

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw = draw_pumpkin;
      this.ground = new LinearAnimation(false, 0.90, 1.05, 0.90, 0.2, 0.2);
      break;

    case ITEMS.EXTRACTOR_MACHINE_STONE:

      this.draw = draw_extractor_stone;
      this.rotate = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.EXTRACTOR_MACHINE_GOLD:

      this.draw = draw_extractor_gold;
      this.rotate = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;
    case ITEMS.EXTRACTOR_MACHINE_DIAMOND:

      this.draw = draw_extractor_diamond;
      this.rotate = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.EXTRACTOR_MACHINE_AMETHYST:

      this.draw = draw_extractor_amethyst;
      this.rotate = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.EXTRACTOR_MACHINE_REIDITE:

      this.draw = draw_extractor_reidite;
      this.rotate = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.WINDMILL:

      this.draw_bg = draw_windmill_head;
      this.draw_fg = draw_windmill_wings;
      this.rotate = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.ROOF:

      this.draw = draw_roof;
      this.j = Math.floor(this.x / 100);
      this.i = Math.floor(this.y / 100);
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.opacity = 1;
      this.draw_life = draw_life_small;
      break;

    //Christmas
    case ITEMS.GARLAND:

      this.draw = draw_garland;
      this.halo = new LinearAnimation(false, 1, 1.15, 1, 0.30, 0.30);
      this.color = 0;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.PLOT:
    case ITEMS.WORKBENCH:
    case ITEMS.WOOD_TOWER:
    case ITEMS.WELL:
    case ITEMS.TOTEM:

      this.draw = draw_simple_item;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      break;

    case ITEMS.BRIDGE:

      this.draw = draw_simple_item;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw_life = draw_life_small;
      break;

    case ITEMS.WALL:
    case ITEMS.STONE_WALL:
    case ITEMS.GOLD_WALL:
    case ITEMS.DIAMOND_WALL:
    case ITEMS.AMETHYST_WALL:
    case ITEMS.REIDITE_WALL:

    case ITEMS.SPIKE:
    case ITEMS.STONE_SPIKE:
    case ITEMS.GOLD_SPIKE:
    case ITEMS.DIAMOND_SPIKE:
    case ITEMS.AMETHYST_SPIKE:
    case ITEMS.REIDITE_SPIKE:

      this.draw = draw_simple_item;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.draw_life = draw_life;
      break;

    case ITEMS.BED:

      this.draw = draw_bed;
      this.opacity = 1;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      var rest = this.angle % (Math.PI / 2);
      if (rest < Math.PI / 4)
        this.angle -= rest;
      else
        this.angle += (Math.PI / 2) - rest;

      break;

    case ITEMS.WHEAT_MOB:
      this.draw = draw_wheat_seed;
      this.angle = Math.random() * Math.PI * 2;
      break

    case ITEMS.ALOE_VERA_MOB:
      this.draw = draw_aloe_vera_mob;
      this.angle = Math.random() * Math.PI * 2;
      break

    case ITEMS.PUMPKIN_MOB:
      this.draw = draw_pumpkin_seed;
      this.angle = Math.random() * Math.PI * 2;
      break

    case ITEMS.GARLIC_MOB:
      this.draw = draw_garlic_seed;
      this.angle = Math.random() * Math.PI * 2;
      break

    case ITEMS.THORNBUSH_MOB:
      this.draw = draw_thornbush_seed;
      this.angle = Math.random() * Math.PI * 2;
      break

    case ITEMS.CHEST:
      this.update = function (action) {

        this.lock = (this.info & 0x2000) ? 1 : 0;
        this.info = this.info & 0x1FFF;
        this.action = action;
      };

      this.draw = draw_chest;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.lock = 0;

      this.update(this.action);
      break;

    case ITEMS.WOOD_DOOR_SPIKE:
    case ITEMS.STONE_DOOR_SPIKE:
    case ITEMS.GOLD_DOOR_SPIKE:
    case ITEMS.DIAMOND_DOOR_SPIKE:
    case ITEMS.AMETHYST_DOOR_SPIKE:
    case ITEMS.REIDITE_DOOR_SPIKE:
    case ITEMS.WOOD_DOOR:
    case ITEMS.STONE_DOOR:
    case ITEMS.GOLD_DOOR:
    case ITEMS.DIAMOND_DOOR:
    case ITEMS.AMETHYST_DOOR:
    case ITEMS.REIDITE_DOOR:

      this.draw = draw_door;
      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      }
      this.draw_life = draw_life;
      break;

    case ITEMS.FURNACE:
      this.draw_bg = draw_furnace_ground;
      this.draw = draw_furnace;
      this.draw_fg = draw_furnace_halo;
      this.ground = new LinearAnimation(false, 1, 1.23, 1.18, 0.02, 0.02);
      this.halo = new LinearAnimation(false, 1, 1.23, 1.18, 0.04, 0.04);

      this.hit = {
        anim: new LinearAnimation(false, 1, 1, 0, 10, 10),
        update: false,
        angle: 0
      };
      this.update = function (action) { this.action = action; };
      break;
  }
}