import { INFO_BOX, PLAYER_LEVEL, SPRITE, WORLD, ITEMS, EXTRACTORS, INV, CLIENT, STATE } from '../constants';
import { ctxDrawImage, scale, ctx } from '../canvas';
import { game, user } from '../game';
import { dist, simplify_number, get_angle_2, reduceAngle, lerp, ease_out_quad, ease_in_out_quad } from '../utils';
import { BUTTON_CLICK } from './gui';

export function draw_info_box() {
  var box = game.info_box;
  var inv = box.id;
  if ((box.activated === 1) && (box.display === 1)) {
    if (INFO_BOX[inv] === undefined)
      INFO_BOX[inv] = create_info_box(inv);

    if (box.craft === 1)
      ctxDrawImage(ctx, INFO_BOX[inv], box.x, box.y);
    else {
      if (((box.x - 80) + INFO_BOX[inv].width) > canw)
        ctxDrawImage(ctx, INFO_BOX[inv], (canw - INFO_BOX[inv].width) - 10, (box.y - INFO_BOX[inv].height) - 10);
      else
        ctxDrawImage(ctx, INFO_BOX[inv], box.x - 80, (box.y - INFO_BOX[inv].height) - 10);
    }
  }
};

export function draw_slot_number(n, button, push) {
  var img = sprite[SPRITE.SLOT_NUMBER][n];
  var x = button.info.translate.x + (5 * scale);
  var y = button.info.translate.y + (5 * scale);
  if ((button.info.state == BUTTON_CLICK) || push)
    y += scale * 5;

  ctxDrawImage(ctx, img, x, y);
};

export function draw_amount(n, button) {
  if (!sprite[SPRITE.COUNTER][n])
    sprite[SPRITE.COUNTER][n] = create_text(scale, "x" + n, 17, "#FFF");

  var img = sprite[SPRITE.COUNTER][n];
  var x = ((button.info.translate.x + button.info.img[0].width) - img.width) - (14 * scale);
  var y = ((button.info.translate.y + button.info.img[0].height) - img.height) - (19 * scale);
  if (button.info.state == BUTTON_CLICK)
    y += scale * 5;

  ctxDrawImage(ctx, img, x, y);
};

export function draw_well_inventory() {
  if ((((user.chest.open || user.furnace.open) || user.windmill.open) || user.bread_oven.open) || user.extractor.open)
    return;

  user.well.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_WELL;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.WELL].length; i++) {
    var well = world.units[ITEMS.WELL][i];
    var m = dist(well, p);
    if (m < min) {
      min = m;
      user.well.open = true;
      user.well.pid = well.pid;
      user.well.iid = well.id;
    }
  }
};

export function draw_sign_button() {
  if ((((user.chest.open || user.furnace.open) || user.windmill.open) || user.bread_oven.open) || user.extractor.open)
    return;

  user.sign.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_SIGN;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.SIGN].length; i++) {
    var sign = world.units[ITEMS.SIGN][i];
    var m = dist(sign, p);
    if (((m < min) && (sign.info === 0)) && (sign.pid === user.id)) {
      user.sign.open = true;
      min = m;
      user.sign.iid = sign.id;
    }
  }
  if (min < WORLD.DIST_SIGN) {
    var button = game.sign.button;
    button.draw(ctx);
  }
};;

export function draw_bread_oven_inventory() {
  if (((user.chest.open || user.furnace.open) || user.windmill.open) || user.extractor.open)
    return;

  user.bread_oven.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_BREAD_OVEN;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.BREAD_OVEN].length; i++) {
    var bread_oven = world.units[ITEMS.BREAD_OVEN][i];
    var m = dist(bread_oven, p);
    if (m < min) {
      min = m;
      user.bread_oven.open = true;
      user.bread_oven.amount_wood = bread_oven.info & 31;
      user.bread_oven.amount_flour = (bread_oven.info & 992) >> 5;
      user.bread_oven.amount_bread = (bread_oven.info & 31744) >> 10;
      user.bread_oven.pid = bread_oven.pid;
      user.bread_oven.iid = bread_oven.id;
    }
  }
  if (min < WORLD.DIST_BREAD_OVEN) {
    var img = sprite[SPRITE.BREAD_OVEN_UI];
    var button = game.bread_oven_wood_button;
    var x = button.info.translate.x - 32;
    ctxDrawImage(ctx, img, x, 0);
    if (user.bread_oven.amount_wood > 0) {
      button.draw(ctx);
      var n = user.bread_oven.amount_wood;
      if (n > 1)
        draw_amount(n, button);

    }
    var button = game.bread_oven_bread_button;
    if (user.bread_oven.amount_bread > 0) {
      button.draw(ctx);
      var n = user.bread_oven.amount_bread;
      if (n > 1)
        draw_amount(n, button);

    }
    var button = game.bread_oven_flour_button;
    if (user.bread_oven.amount_flour > 0) {
      button.draw(ctx);
      var n = user.bread_oven.amount_flour;
      if (n > 1)
        draw_amount(n, button);

    }
  }
};

export function draw_extractor_inventory() {
  if (user.chest.open || user.furnace.open)
    return;

  user.extractor.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_EXTRACTOR_MACHINE;
  if (!p)
    return;

  for (var j = 0; j < EXTRACTORS.length; j++) {
    var type = EXTRACTORS[j][0];
    var mineral = EXTRACTORS[j][1];
    for (var i = 0; i < world.units[type].length; i++) {
      var extractor = world.units[type][i];
      var m = dist(extractor, p);
      if (m < min) {
        min = m;
        user.extractor.mineral = mineral;
        user.extractor.type = type;
        user.extractor.open = true;
        user.extractor.amount_wood = extractor.info & 255;
        user.extractor.amount_mineral = (extractor.info & 65280) >> 8;
        user.extractor.pid = extractor.pid;
        user.extractor.iid = extractor.id;
      }
    }
  }
  if (min < WORLD.DIST_EXTRACTOR_MACHINE) {
    var img = sprite[SPRITE.EXTRACTOR_CASES];
    var button = game.extractor_wood_button;
    var x = button.info.translate.x - 33;
    ctxDrawImage(ctx, img, x, 0);
    if (user.extractor.amount_wood > 0) {
      button.draw(ctx);
      var n = user.extractor.amount_wood;
      if (n > 1)
        draw_amount(n, button);

    }
    switch (user.extractor.mineral) {
      case INV.STONE:
        var button = game.extractor_stone_button;
        break;
      case INV.GOLD:
        var button = game.extractor_gold_button;
        break;
      case INV.DIAMOND:
        var button = game.extractor_diamond_button;
        break;
      case INV.AMETHYST:
        var button = game.extractor_amethyst_button;
        break;
      case INV.REIDITE:
        var button = game.extractor_reidite_button;
        break;
    }
    if (user.extractor.amount_mineral > 0) {
      button.draw(ctx);
      var n = user.extractor.amount_mineral;
      if (n > 1)
        draw_amount(n, button);

    }
  }
};

export function draw_windmill_inventory() {
  if (user.chest.open || user.furnace.open)
    return;

  user.windmill.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_WINDMILL;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.WINDMILL].length; i++) {
    var windmill = world.units[ITEMS.WINDMILL][i];
    var m = dist(windmill, p);
    if (m < min) {
      min = m;
      user.windmill.open = true;
      user.windmill.amount_wheat = windmill.info & 255;
      user.windmill.amount_flour = (windmill.info & 65280) >> 8;
      user.windmill.pid = windmill.pid;
      user.windmill.iid = windmill.id;
    }
  }
  if (min < WORLD.DIST_WINDMILL) {
    var img = sprite[SPRITE.WINDMILL_CASES];
    var button = game.windmill_wheat_button;
    var x = button.info.translate.x - 33;
    ctxDrawImage(ctx, img, x, 0);
    if (user.windmill.amount_wheat > 0) {
      button.draw(ctx);
      var n = user.windmill.amount_wheat;
      if (n > 1)
        draw_amount(n, button);

    }
    var button = game.windmill_flour_button;
    if (user.windmill.amount_flour > 0) {
      button.draw(ctx);
      var n = user.windmill.amount_flour;
      if (n > 1)
        draw_amount(n, button);

    }
  }
};

export function draw_furnace_inventory() {
  if (user.chest.open)
    return;

  user.furnace.amount = 0;
  user.furnace.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_FURNACE;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.FURNACE].length; i++) {
    var furnace = world.units[ITEMS.FURNACE][i];
    var m = dist(furnace, p);
    if (m < min) {
      min = m;
      user.furnace.open = true;
      user.furnace.amount = furnace.info;
      user.furnace.pid = furnace.pid;
      user.furnace.iid = furnace.id;
    }
  }
  if (min < WORLD.DIST_FURNACE) {
    var img = sprite[SPRITE.FURNACE_SLOT];
    var button = game.furnace_button;
    var x = Math.floor(button.info.translate.x + ((button.info.img[0].width - img.width) / 2));
    var y = Math.floor(button.info.translate.y + ((button.info.img[0].height - img.height) / 2)) + 3;
    ctxDrawImage(ctx, img, x, y);
    if (user.furnace.amount > 0) {
      button.draw(ctx);
      var n = user.furnace.amount;
      if (n > 1)
        draw_amount(n, button);

    }
  }
};

export function draw_resurrection_inventory() {
  user.resurrection.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_RESURRECTION;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.RESURRECTION].length; i++) {
    var resurrection = world.units[ITEMS.RESURRECTION][i];
    var m = dist(resurrection, p);
    if (m < min) {
      min = m;
      user.resurrection.open = true;
      user.resurrection.pid = resurrection.pid;
      user.resurrection.iid = resurrection.id;
    }
  }
  if (min < WORLD.DIST_RESURRECTION)
    game.resurrection.draw(ctx);

};

export function draw_team_buttons() {
  user.totem.id = -1;
  user.totem.pid = -1;
  if ((user.spectator || user.totem.wait) || user.zombie)
    return;

  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_TOTEM;
  if (p) {
    for (var i = 0; i < world.units[ITEMS.TOTEM].length; i++) {
      var totem = world.units[ITEMS.TOTEM][i];
      var m = dist(totem, p);
      if (m < min) {
        min = m;
        user.totem.id = totem.id;
        user.totem.pid = totem.pid;
        user.totem.info = totem.info;
        user.totem.lock = (totem.info & 16) >> 4;
      }
    }
  }
  var before = game.team_buttons_id;
  game.team_buttons_id = -1;
  if ((user.totem.pid != -1) && ((user.team.length == 0) || (user.id == user.totem.pid))) {
    if ((user.team.length == 0) && (user.totem.info >= 8))
      game.team_buttons_id = CLIENT.TEAM_FULL;
    else if (user.team.length == 0)
      game.team_buttons_id = CLIENT.TEAM_JOIN;
    else
      game.team_buttons_id = CLIENT.TEAM_MANAGE;
  } else if ((user.team.length != 0) && (user.team[0] != user.id))
    game.team_buttons_id = CLIENT.TEAM_LEAVE;
  else if ((user.team.length != 0) && (user.team[0] == user.id))
    game.team_buttons_id = CLIENT.TEAM_SHOW;
  else if (user.team.length != 0)
    game.team_buttons_id = CLIENT.TEAM_JOIN;

  if (game.team_buttons_id != -1)
    game.team_buttons[game.team_buttons_id].button.draw(ctx);

  var style = document.getElementById("team_box").style;
  if (((game.team_buttons_id != -1) && (game.team_buttons_id != before)) && (style.display == "inline-block"))
    game.team_buttons[game.team_buttons_id].action();

};

export function draw_chest_inventory() {
  user.chest.id = -1;
  user.chest.lock = false;
  user.chest.locked = false;
  user.chest.lockpick = false;
  user.chest.padlock = false;
  user.chest.open = false;
  var p = world.fast_units[user.uid];
  var min = WORLD.DIST_CHEST;
  if (!p)
    return;

  for (var i = 0; i < world.units[ITEMS.CHEST].length; i++) {
    var chest = world.units[ITEMS.CHEST][i];
    var m = dist(chest, p);
    if (m < min) {
      min = m;
      user.chest.open = true;
      user.chest.id = (chest.action < 2) ? -1 : Math.floor((chest.action - 1) / 2);
      user.chest.amount = chest.info;
      user.chest.pid = chest.pid;
      user.chest.iid = chest.id;
      user.chest.locked = chest.lock;
      user.chest.lock = ((chest.lock && (user.id != chest.pid)) && !user.in_team(chest.pid)) ? true : false;
      user.chest.padlock = (((chest.pid === user.id) && !user.chest.locked) && (user.inv.find_item(INV.LOCK) != -1)) ? true : false;
      if (user.chest.locked && (user.inv.find_item(INV.LOCKPICK) != -1))
        user.chest.lockpick = true;

    }
  }
  if (min < WORLD.DIST_CHEST) {
    var img = sprite[SPRITE.CHEST_SLOT];
    var button = game.chest_buttons[0];
    var x = Math.floor(button.info.translate.x + ((button.info.img[0].width - img.width) / 2));
    var y = Math.floor(button.info.translate.y + ((button.info.img[0].height - img.height) / 2)) + 3;
    ctxDrawImage(ctx, img, x, y);
    if (!user.chest.lock || (user.chest.pid === user.id)) {
      if (user.chest.id >= 0) {
        var button = game.chest_buttons[user.chest.id];
        button.draw(ctx);
        var n = user.chest.amount;
        if (n > 1)
          draw_amount(n, button);

      }
    }
    if (!user.chest.lock) {
      if (user.chest.padlock)
        game.chest_padlock.draw(ctx);

    } else
      game.chest_locked.draw(ctx);
    if (user.chest.lockpick)
      game.chest_lockpick.draw(ctx);

  }
};

export function draw_bigmap() {
  if (!user.bigmap)
    return;

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canw, canh);
  ctx.globalAlpha = 0.8;
  var img = sprite[SPRITE.BIGMAP][world.time];
  var x = canw2 - (img.width / 2);
  var y = canh2 - (img.height / 2);
  ctxDrawImage(ctx, img, x, y);
  ctx.globalAlpha = 1;
  if (game.minimap.marker.x > -1) {
    ctx.fillStyle = "#660000";
    circle(ctx, x + ((game.minimap.marker.x * 3) * scale), y + ((game.minimap.marker.y * 3) * scale), scale * 14);
    ctx.fill();
  }
  var players = game.minimap.players;
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    ctx.fillStyle = !world.time ? "#ff0000" : "#ff0000";
    circle(ctx, x + ((600 * (p.x / (world.nw * 100))) * scale), y + ((600 * (p.y / (world.nh * 100))) * scale), scale * 6);
    ctx.fill();
  }
  var u = world.fast_units[user.uid];
  if (u) {
    ctx.fillStyle = !world.time ? "#e39716" : "#fff";
    circle(ctx, x + ((600 * (u.x / (world.nw * 100))) * scale), y + ((600 * (u.y / (world.nh * 100))) * scale), scale * 12);
    ctx.fill();
  }
};

export function draw_minimap() {
  if (user.inv.can_select.length > 0)
    var minimap = {
      x: game.minimap.translate.x,
      y: game.minimap.translate.y - (120 * scale)
    };
  else
    var minimap = {
      x: game.minimap.translate.x,
      y: game.minimap.translate.y - (50 * scale)
    };
  ctx.globalAlpha = 0.8;
  var img = sprite[SPRITE.MINIMAP][world.time];
  ctxDrawImage(ctx, img, minimap.x, minimap.y);
  ctx.globalAlpha = 1;
  if (game.minimap.marker.x > -1) {
    ctx.fillStyle = "#660000";
    circle(ctx, minimap.x + (game.minimap.marker.x * scale), minimap.y + (game.minimap.marker.y * scale), scale * 5);
    ctx.fill();
  }
  var old_scale = scale;
  var players = game.minimap.players;
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    ctx.fillStyle = !world.time ? "#ff0000" : "#ff0000";
    circle(ctx, minimap.x + ((193 * (p.x / (world.nw * 100))) * scale), minimap.y + ((193 * (p.y / (world.nh * 100))) * scale), scale * 2);
    ctx.fill();
  }
  var u = world.fast_units[user.uid];
  if (u) {
    ctx.fillStyle = !world.time ? "#e39716" : "#fff";
    circle(ctx, minimap.x + ((193 * (u.x / (world.nw * 100))) * scale), minimap.y + ((193 * (u.y / (world.nh * 100))) * scale), scale * 4);
    ctx.fill();
  }
  scale = old_scale;
};
var __BANDAGE__ = [];

export function draw_status() {
  var y = -8;
  if (user.auto_feed.enabled) {
    var img = sprite[SPRITE.AUTO_FEED];
    ctxDrawImage(ctx, img, user.auto_feed.translate.x, user.auto_feed.translate.y + y);
    y += 70;
  }
  if (user.blizzard === 1) {
    var img = sprite[SPRITE.STOP_REGENERATION_BLIZZARD];
    ctxDrawImage(ctx, img, user.auto_feed.translate.x, user.auto_feed.translate.y + y);
    y += 70;
  } else if (((((user.gauges.cold.x < 0.25) || (user.gauges.hunger.x < 0.25)) || (user.gauges.thirst.x < 0.25)) || (user.gauges.oxygen.x < 0.25)) || (user.gauges.warm.x < 0.25)) {
    var img = sprite[SPRITE.STOP_REGENERATION];
    ctxDrawImage(ctx, img, user.auto_feed.translate.x, user.auto_feed.translate.y + y);
    y += 70;
  }
  if (user.bandage > 0) {
    var img = sprite[SPRITE.BANDAGE_ACTIVATED];
    ctxDrawImage(ctx, img, user.auto_feed.translate.x, user.auto_feed.translate.y + y);
    var bandage = __BANDAGE__[user.bandage];
    if (bandage === undefined) {
      bandage = create_text(scale, user.bandage + "", 30, "#FDFDFD", null, null, null, null, null, "#C8BBBF", 6);
      __BANDAGE__[user.bandage] = bandage;
    }
    if (user.bandage < 9)
      ctxDrawImage(ctx, bandage, user.auto_feed.translate.x - 39, (user.auto_feed.translate.y + y) + 20);
    else
      ctxDrawImage(ctx, bandage, user.auto_feed.translate.x - 46, (user.auto_feed.translate.y + y) + 20);
  }
};

export function draw_leaderboard() {
  var ldb = user.ldb;
  var game_ldb = game.leaderboard;
  if (ldb.update) {
    ldb.update = false;
    var ids = ldb.ids;
    var w = game_ldb.can.width;
    var h = game_ldb.can.height;
    var ctx2 = game_ldb.ctx;
    var players = world.players;
    var in_ldb = false;
    ctx2.clearRect(0, 0, w, h);
    ctx2.drawImage(game_ldb.img, 0, 0);
    for (var i = 0; i < ids.length; i++) {
      var p = players[ids[i]];
      if ((world.mode === WORLD.MODE_HUNGER_GAMES) && (p.nickname === "spectator"))
        continue;

      if ((world.mode === WORLD.MODE_ZOMBIES) && (p.skin === WORLD.ZOMBIE_SKIN))
        continue;

      if (ids[i] == user.id) {
        in_ldb = true;
        if ((world.mode === WORLD.MODE_VAMPIRES) && (p.skin === WORLD.VAMPIRE_SKIN))
          color = "#FF0000";
        else
          color = "#FFF";
      } else {
        if ((world.mode === WORLD.MODE_VAMPIRES) && (p.skin === WORLD.VAMPIRE_SKIN))
          color = "#990000";
        else
          color = "#A1BDCD";
      }
      ctx2.drawImage(create_text(scale, "" + (i + 1), 15 * scale, color), 20 * scale, (40 + (i * 22)) * scale);
      if (!p.ldb_label)
        p.ldb_label = create_text(scale, p.nickname, 15 * scale, color, undefined, undefined, undefined, undefined, 110 * scale);

      ctx2.drawImage(p.ldb_label, 39 * scale, (40 + (i * 22)) * scale);
      ctx2.drawImage(create_text(scale, simplify_number(p.score), 15 * scale, color), 156 * scale, (40 + (i * 22)) * scale);
    }
    if (!in_ldb) {
      if (((((((world.mode === WORLD.MODE_PVP) || (world.mode === WORLD.MODE_VAMPIRES)) || (world.mode === WORLD.MODE_LEGACY)) || (world.mode === WORLD.MODE_BR)) || (world.mode === WORLD.MODE_EXPERIMENTAL)) || ((world.mode === WORLD.MODE_HUNGER_GAMES) && !user.spectator)) || ((world.mode === WORLD.MODE_ZOMBIES) && !user.zombie)) {
        ctx2.drawImage(sprite[SPRITE.YOUR_SCORE], 15 * scale, (46 + (i * 22)) * scale);
        ctx2.drawImage(create_text(scale, simplify_number(world.players[user.id].score), 15 * scale, "#FFF"), 100 * scale, (46 + (i * 22)) * scale);
      }
    }
  }
  ctxDrawImage(ctx, game_ldb.can, game_ldb.translate.x, game_ldb.translate.y);
};

export function draw_totem_delay() {
  var totem = user.totem;
  if (totem.wait) {
    var ret = totem.timeout.update();
    ctx.save();
    var img = sprite[SPRITE.DELAY_TEAM];
    var gap = sprite[SPRITE.DELAY_WEAPON].height + (25 * scale);
    ctx.translate(img.width, (game.gauges.translate.y - (188 * scale)) - gap);
    var x = (-img.width / 2) - 2;
    var y = (-img.height / 2) - 4;
    ctxDrawImage(ctx, img, x + 2, y);
    ctx.beginPath();
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = SPRITE.WEAPON_LOADING[world.time];
    ctx.lineCap = "round";
    ctx.arc(0, y + (img.height / 2), 25 * scale, 0, (Math.PI * 2) * totem.timeout.v);
    ctx.stroke();
    ctx.restore();
    if (ret) {
      totem.wait = false;
      totem.timeout.v = 0;
      totem.timeout.o = false;
    }
  }
};

export function draw_clock() {
  var c = world.clock;
  var img = sprite[SPRITE.CLOCK][world.time];
  ctxDrawImage(ctx, img, c.translate.x, c.translate.y);
  ctx.save();
  ctx.translate(c.translate.x + (img.width / 2), c.translate.y + (img.height / 2));
  world.clock.now = (((new Date).getTime() - c.init) + c.hour) % WORLD.DAY;
  var angle = (((Math.PI * 2) * world.clock.now) / WORLD.DAY) - (Math.PI / 2);
  ctx.rotate(angle);
  ctxDrawImage(ctx, sprite[SPRITE.ARROW_CLOCK], -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_build_delay() {
  var build = user.build;
  if (build.wait) {
    var ret = build.timeout.update();
    ctx.save();
    var img = sprite[SPRITE.DELAY_WALL];
    ctx.translate(img.width - (12 * scale), game.gauges.translate.y - (190 * scale));
    var x = (-img.width / 2) + 9;
    var y = (-img.height / 2) - 4;
    ctxDrawImage(ctx, img, x, y);
    ctx.beginPath();
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = SPRITE.HELMET_LOADING[world.time];
    ctx.lineCap = "round";
    ctx.arc(9, y + (img.height / 2), 25 * scale, 0, (Math.PI * 2) * build.timeout.v);
    ctx.stroke();
    ctx.restore();
    if (ret) {
      build.wait = false;
      build.timeout.v = 0;
      build.timeout.o = false;
    }
  }
};

export function draw_helmet_switch_delay() {
  var helmet = user.helmet;
  if (helmet.wait) {
    var ret = helmet.timeout.update();
    ctx.save();
    var img = sprite[SPRITE.DELAY_HELMET];
    ctx.translate(img.width - (2 * scale), game.gauges.translate.y - (125 * scale));
    var x = (-img.width / 2) + 10;
    var y = (-img.height / 2) - 4;
    ctxDrawImage(ctx, img, x, y);
    ctx.beginPath();
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = SPRITE.HELMET_LOADING[world.time];
    ctx.lineCap = "round";
    ctx.arc(9, y + (img.height / 2), 25 * scale, 0, (Math.PI * 2) * helmet.timeout.v);
    ctx.stroke();
    ctx.restore();
    if (ret) {
      helmet.wait = false;
      helmet.timeout.v = 0;
      helmet.timeout.o = false;
    }
  }
};

export function draw_weapon_switch_delay() {
  var weapon = user.weapon;
  if (weapon.wait) {
    var ret = weapon.timeout.update();
    ctx.save();
    var img = sprite[SPRITE.DELAY_WEAPON];
    ctx.translate(img.width - (2 * scale), game.gauges.translate.y - (60 * scale));
    var x = (-img.width / 2) - 2;
    var y = (-img.height / 2) - 4;
    ctxDrawImage(ctx, img, x, y);
    ctx.beginPath();
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = SPRITE.WEAPON_LOADING[world.time];
    ctx.lineCap = "round";
    ctx.arc(0, y + (img.height / 2), 25 * scale, 0, (Math.PI * 2) * weapon.timeout.v);
    ctx.stroke();
    ctx.restore();
    if (ret) {
      weapon.wait = false;
      weapon.timeout.v = 0;
      weapon.timeout.o = false;
    }
  }
};

export function draw_ui_gear() {
  var craft = user.craft;
  if (craft.crafting) {
    var u = world.fast_units[user.uid];
    ctx.save();
    ctx.translate(user.cam.x + u.x, user.cam.y + u.y);
    var img = sprite[SPRITE.GEAR];
    var x = -img.width / 2;
    var y = (-img.height / 2) - (125 * scale);
    ctxDrawImage(ctx, img, x, y);
    ctx.beginPath();
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = SPRITE.CRAFT_LOADING[world.time];
    ctx.lineCap = "round";
    ctx.arc(0, y + (img.height / 2), 25 * scale, 0, (Math.PI * 2) * craft.timeout.v);
    ctx.stroke();
    ctx.restore();
  }
};

export function draw_ui_crafting() {
  var craft = user.craft;
  if (!craft.crafting && (craft.preview > 0)) {
    var u = world.fast_units[user.uid];
    if (!u)
      return;

    ctx.save();
    if ((INV_INFOS[craft.preview].grid === 0) && (craft.mode === 0)) {
      ctx.translate(user.cam.x + u.x, user.cam.y + u.y);
      ctx.rotate(u.angle);
      ctx.translate(120, 0);
    } else {
      var x = Math.floor(u.x + (Math.cos(u.angle) * 120));
      var y = Math.floor(u.y + (Math.sin(u.angle) * 120));
      x = user.cam.x + ((x - (x % 100)) + 50);
      y = user.cam.y + ((y - (y % 100)) + 50);
      ctx.translate(x, y);
    }
    var img = sprite[craft.preview][world.time];
    ctx.globalAlpha = 0.5;
    ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
    ctx.globalAlpha = 1;
    ctx.restore();
    if (INV_INFOS[craft.preview].grid === 0) {
      if (!craft.label[craft.mode]) {
        if (craft.mode === 0)
          craft.label[0] = create_text(scale, LANG[TEXT.MODE_FREE], 20, "#e2c340");
        else
          craft.label[1] = create_text(scale, LANG[TEXT.MODE_GRID], 20, "#e2c340");
      }
      var img = craft.label[craft.mode];
      ctxDrawImage(ctx, img, canw2 + (-img.width / 2), game.gauges.y - 26);
    }
  }
  if (craft.crafting) {
    var ret = craft.timeout.update();
    for (var i = 0; i < craft.can_craft.length; i++) {
      var button = craft.can_craft[i];
      if (craft.id == button.id) {
        var h = scale * 42;
        var h2 = scale * 17;
        round_rect(ctx, button.info.translate.x, button.info.translate.y + (h * (1 - craft.timeout.v)), button.info.width, (h * craft.timeout.v) + h2, scale * 10);
        ctx.fillStyle = "#55B973";
        ctx.fill();
        ctx.globalAlpha = 0.8;
        button.draw(ctx);
      } else {
        ctx.globalAlpha = 0.5;
        button.draw(ctx);
      }
      ctx.globalAlpha = 1;
    }
    if (ret) {
      craft.crafting = false;
      craft.timeout.v = 0;
      craft.timeout.o = false;
    }
    return true;
  } else {
    for (var i = 0; i < craft.can_craft.length; i++)
      craft.can_craft[i].draw(ctx);
  }
  return false;
};

export function draw_ui_chat() {
  var players = world.units[ITEMS.PLAYERS];
  if ((((((world.mode === WORLD.MODE_PVP) || (world.mode === WORLD.MODE_EXPERIMENTAL)) || (world.mode === WORLD.MODE_ZOMBIES)) || (world.mode === WORLD.MODE_LEGACY)) || (world.mode === WORLD.MODE_BR)) || (world.mode === WORLD.MODE_VAMPIRES) || (world.mode === WORLD.MODE_COMMUNITY)) {
    for (var i = 0; i < players.length; i++) {
      players[i].draw_text();
    }
  } else if (world.mode === WORLD.MODE_HUNGER_GAMES) {
    for (var i = 0; i < players.length; i++) {
      if (user.spectator || user.show_spectators.enabled)
        players[i].draw_text();
      else if (players[i].player.nickname !== "spectator")
        players[i].draw_text();

    }
  }
};

export function draw_ui_inventory() {
  var inv = user.inv;
  var p = world.fast_units[user.uid];
  for (var i = 0; i < inv.can_select.length; i++) {
    var button = inv.can_select[i];
    var push = false;
    var p = world.fast_units[user.uid];
    if (p && ((p.right == button.id) || ((p.clothe == button.id) && (p.clothe > 0)))) {
      push = true;
      ctxDrawImage(ctx, button.info.img[2], button.info.translate.x, button.info.translate.y, button.info.width, button.info.height);
    } else
      button.draw(ctx);
    var n = user.inv.n[button.id];
    if (n > 1)
      draw_amount(n, button);

    if (n > 0)
      draw_slot_number(i, button, push);

    var chest = user.chest;
    if ((chest.open && ((chest.id < 0) || (chest.id == button.id))) && (!chest.lock || (chest.pid == user.id)))
      game.plus_buttons[button.id].draw(ctx);

    var furnace = user.furnace;
    if (furnace.open && (INV.WOOD == button.id))
      game.plus_buttons[button.id].draw(ctx);

    var well = user.well;
    if (well.open && (INV.BUCKET_FULL == button.id))
      game.plus_buttons[button.id].draw(ctx);

    var windmill = user.windmill;
    if (windmill.open && (INV.WILD_WHEAT == button.id))
      game.plus_buttons[button.id].draw(ctx);

    var extractor = user.extractor;
    if (extractor.open && (INV.WOOD == button.id))
      game.plus_buttons[button.id].draw(ctx);

    var bread_oven = user.bread_oven;
    if (bread_oven.open && ((INV.WOOD == button.id) || (INV.FLOUR == button.id)))
      game.plus_buttons[button.id].draw(ctx);

  }
  if (button && (i < inv.max)) {
    var img = sprite[SPRITE.EMPTY_SLOT][2];
    x = button.info.translate.x;
    y = button.info.translate.y;
    for (j = 1; i < inv.max; i++, j++)
      ctxDrawImage(ctx, img, x + (j * (img.width + 5)), y);
  }
};

export function draw_gauges() {
  ctx.save();
  var old_scale = scale;
  if (user.gauges.life.x < 0.25)
    ctx.globalAlpha = user.gauges.warn_life.v;

  var y = (user.inv.can_select.length > 0) ? -70 : 0;
  if (((((user.chest.open || (user.furnace.open && (-1 != user.inv.find_item(INV.WOOD)))) || (user.windmill.open && (-1 != user.inv.find_item(INV.WILD_WHEAT)))) || (user.extractor.open && (-1 != user.inv.find_item(INV.WOOD)))) || (user.well.open && (-1 != user.inv.find_item(INV.BUCKET_FULL)))) || (user.bread_oven.open && ((-1 != user.inv.find_item(INV.WOOD)) || (-1 != user.inv.find_item(INV.FLOUR)))))
    y -= 50 * scale;

  ctx.translate((canw - (950 * scale)) / 2, y);
  ctx.fillStyle = "#69A148";
  ctx.fillRect(this.translate.x + (37 * scale), this.translate.y + (17 * scale), (user.gauges.life.x * 178) * scale, 18 * scale);
  ctx.globalAlpha = 1;
  if (user.gauges.hunger.x < 0.35) {
    ctx.fillStyle = "#8F050A";
    ctx.globalAlpha = user.gauges.warn_hunger.v;
    ctx.fillRect(this.translate.x + (277 * scale), this.translate.y + (17 * scale), 178 * scale, 18 * scale);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#AF352A";
  ctx.fillRect(this.translate.x + (277 * scale), this.translate.y + (17 * scale), (user.gauges.hunger.x * 178) * scale, 18 * scale);
  if (user.gauges.cold.x < 0.35) {
    ctx.fillStyle = "#366B91";
    ctx.globalAlpha = user.gauges.warn_cold.v;
    ctx.fillRect(this.translate.x + (517 * scale), this.translate.y + (17 * scale), 178 * scale, 18 * scale);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#669BB1";
  ctx.fillRect(this.translate.x + (517 * scale), this.translate.y + (17 * scale), (user.gauges.cold.x * 178) * scale, 18 * scale);
  if (user.gauges.cold.x > 0.99) {
    if (user.gauges.warm.x < 0.35) {
      ctx.fillStyle = "#6C4036";
      ctx.globalAlpha = user.gauges.warn_warm.v;
      ctx.fillRect(this.translate.x + (517 * scale), this.translate.y + (17 * scale), 178 * scale, 18 * scale);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "#9C4036";
    ctx.fillRect(this.translate.x + (517 * scale), this.translate.y + (17 * scale), ((1 - user.gauges.warm.x) * 178) * scale, 18 * scale);
  }
  if (user.gauges.thirst.x < 0.35) {
    ctx.fillStyle = "#001A57";
    ctx.globalAlpha = user.gauges.warn_thirst.v;
    ctx.fillRect(this.translate.x + (757 * scale), this.translate.y + (17 * scale), 178 * scale, 18 * scale);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#074A87";
  ctx.fillRect(this.translate.x + (757 * scale), this.translate.y + (17 * scale), (user.gauges.thirst.x * 178) * scale, 18 * scale);
  scale = old_scale;
  ctxDrawImage(ctx, this.img, this.translate.x, this.translate.y);
  this.y = this.translate.y + y;
  ctx.restore();
  if (user.gauges.oxygen.x < 0.99) {
    var x = Math.floor(canw2 - (sprite[SPRITE.OXYGEN].width / 2));
    y += (this.translate.y - sprite[SPRITE.OXYGEN].height) - (5 * scale);
    ctx.fillStyle = "#BBE8EF";
    ctx.fillRect(x + 5, y + (5 * scale), (588 * scale) * user.gauges.oxygen.x, 10 * scale);
    if (user.gauges.oxygen.x < 0.35) {
      ctx.fillStyle = "#9BA8AF";
      ctx.globalAlpha = user.gauges.warn_oxygen.v;
      ctx.fillRect(x + 5, y + 5, 588 * scale, 10 * scale);
      ctx.globalAlpha = 1;
    }
    ctxDrawImage(ctx, sprite[SPRITE.OXYGEN], x, y);
    this.y = y;
  }
};

export function draw_door(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var img = sprite[id][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.restore();
};

export function draw_chest() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  img = sprite[SPRITE.CHEST][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  if (this.lock) {
    img = sprite[SPRITE.LOCK][world.time];
    w = -img.width;
    h = -img.height;
    ctxDrawImage(ctx, img, ((-w / 2) + x) - (1 * scale), (-h / 2) + y, w, h);
  }
  ctx.restore();
};

export function draw_thornbush_seed() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.THORNBUSH_SEED_MOB][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_garlic_seed() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.GARLIC_SEED_MOB][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_pumpkin_seed() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.PUMPKIN_SEED_MOB][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_aloe_vera_mob() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.ALOE_VERA][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_wheat_seed() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.WHEAT_MOB][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_life_small(life) {
  var life = life / 100;
  if (life > 0.8)
    return;

  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.globalAlpha = 0.5;
  circle_angle(ctx, x, y, 18 * scale, life);
  fill_path(ctx, null, "#000000", 18 * scale);
  ctx.globalAlpha = 1;
  circle_angle(ctx, x, y, 18 * scale, life);
  fill_path(ctx, null, SPRITE.BROWN_LIFE[world.time], 6 * scale);
  ctx.restore();
};

export function draw_life(life) {
  var life = life / 100;
  if (life > 0.95)
    return;

  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.globalAlpha = 0.5;
  circle_angle(ctx, x, y, 28 * scale, life);
  fill_path(ctx, null, "#000000", 18 * scale);
  ctx.globalAlpha = 1;
  circle_angle(ctx, x, y, 28 * scale, life);
  fill_path(ctx, null, SPRITE.CRAFT_LOADING[world.time], 6 * scale);
  ctx.restore();
};

export function draw_roof(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var len = sprite[SPRITE.ROOFS].length;
  img = sprite[SPRITE.ROOFS][(this.j + (this.i % 2)) % len][world.time];
  w = -img.width;
  h = -img.height;
  var p = world.fast_units[user.uid];
  if (p && ((user.id === this.pid) || user.in_team(this.pid))) {
    if (dist(this, p) < 550)
      this.opacity = Math.max(this.opacity - delta, 0.3);
    else
      this.opacity = Math.min(this.opacity + delta, 1);
  } else if (p && (dist(this, world.fast_units[user.uid]) < 150))
    this.opacity = Math.max(this.opacity - delta, 0.3);
  else
    this.opacity = Math.min(this.opacity + delta, 1);
  var old = ctx.globalAlpha;
  ctx.globalAlpha *= this.opacity;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.globalAlpha = old;
  ctx.restore();
};

export function draw_garland(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if (this.halo.update())
    this.color += 0.2 + (Math.random() * 0.3);

  img = sprite[SPRITE.GARLANDS][Math.floor(this.id + this.color) % 5][world.time];
  w = -img.width * this.halo.v;
  h = -img.height * this.halo.v;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.restore();
};

export function draw_bed(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if ((id === SPRITE.BED_TOP) && !world.transition) {
    var opacity = 0;
    var players = world.units[ITEMS.PLAYERS];
    for (var i = 0; i < players.length; i++) {
      var dist = dist(players[i], this);
      if ((dist < 140) && (dist > 35)) {
        opacity = 0;
        break;
      } else if (dist <= 35)
        opacity = 1;

    }
    if (opacity === 0)
      this.opacity = Math.max(0.5, this.opacity - (delta / 1.5));
    else
      this.opacity = Math.min(1, this.opacity + (delta / 1.5));
    ctx.globalAlpha = this.opacity;
  }
  img = sprite[id][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.globalAlpha = 1;
  ctx.restore();
};

export function draw_simple_item(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  img = sprite[id][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.restore();
};
var __wave = 0;

export function draw_river_tile(is, ie, js, je, id, t, max, min, rand) {
  if (min === undefined)
    min = 0;

  for (var i = is; i <= ie; i++) {
    for (var j = js; j <= je; j++) {
      var tile = MAP.tiles[i][j];
      if ((tile === undefined) || (tile[t] === undefined))
        continue;

      var object = tile[t];
      var img = sprite[id][world.time][object.river];
      ctxDrawImage(ctx, img, (user.cam.x + object.x) - (img.width / (4 * _scale_object)), (user.cam.y + object.y) - (img.height / (4 * _scale_object)), img.width / (2 * _scale_object), img.height / (2 * _scale_object));
      if (ui.quality) {
        var m = 2147483648;
        var a = 1103515245;
        var c = 12345;
        var _id = (((a * ((i * 1000) + j)) + c) % m) / m;
        if (_id < 0.2) {
          _id = Math.floor(sprite[SPRITE.RIVER_DECO][world.time][object.river].length * (_id * 5));
          var img = sprite[SPRITE.RIVER_DECO][world.time][object.river][_id];
          ctxDrawImage(ctx, img, (user.cam.x + object.x) - (img.width / (4 * _scale_object)), (user.cam.y + object.y) - (img.height / (4 * _scale_object)), img.width / (2 * _scale_object), img.height / (2 * _scale_object));
        } else if (object.current !== 0) {
          var img = sprite[SPRITE.RIVER_WAVE][world.time];
          var _wave = (__wave + ((i % 2) * 30)) % 60;
          ctx.globalAlpha = (_wave < 30) ? (_wave / 30) : (1 - ((_wave - 30) / 30));
          ctxDrawImage(ctx, img, (user.cam.x + object.x) - (img.width / (4 * _scale_object)), (((user.cam.y + object.y) - (img.height / (4 * _scale_object))) - 30) + _wave, img.width / (2 * _scale_object), img.height / (2 * _scale_object));
          ctx.globalAlpha = 1;
        }
      }
    }
  }
};;

export function draw_sand_worm_ground() {
  if ((this.info & 1) === 1)
    this.dig = Math.min(this.dig + delta, 2.2);
  else {
    this.dig = Math.max(this.dig - delta, 0);
    this.groundTimer += delta;
    if (this.groundTimer > 0.1) {
      this.groundTimer = 0;
      var ground = {
        x: (this.x + (Math.random() * 60)) - 30,
        y: (this.y + (Math.random() * 60)) - 30,
        a: 0,
        r: (Math.random() * 30) + 30
      };
      this.ground.push(ground);
    }
  }
  for (var i = 0; i < this.ground.length; i++) {
    var ground = this.ground[i];
    ctx.save();
    ctx.translate(user.cam.x + ground.x, user.cam.y + ground.y);
    ground.a = Math.min(1, ground.a + (delta / 2));
    var _alpha = ground.a;
    if (_alpha < 0.2)
      _alpha *= 5;
    else if (_alpha > 0.8)
      _alpha = (1 - _alpha) * 5;
    else
      _alpha = 1;
    ctx.globalAlpha = _alpha * 0.8;
    circle(ctx, 0, 0, ground.r);
    fill_path(ctx, SPRITE.SAND_WORM_GROUND[world.time]);
    ctx.restore();
    if (ground.a === 1) {
      this.ground.splice(i, 1);
      i--;
    }
  };
};;

export function draw_sand_worm() {
  var img = undefined;
  var imgHurt = undefined;
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.breath.update();
  this.rotate.update();
  if ((this.dig >= 0.1) && (this.dig <= 1.1)) {
    var _alpha = Math.max(0, Math.min(1, this.dig - 0.1));
    if (_alpha < 0.2)
      _alpha *= 5;
    else if (_alpha > 0.8)
      _alpha = (1 - _alpha) * 5;
    else
      _alpha = 1;
    var img = sprite[SPRITE.SAND_WORM1][world.time];
    w = -img.width * this.breath.v;
    h = -img.height * this.breath.v;
    ctx.globalAlpha = _alpha;
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    var imgHurt = sprite[SPRITE.HURT_SAND_WORM1];
  }
  if (this.dig >= 0.9) {
    var _alpha = Math.max(0, Math.min(1, this.dig - 0.9));
    if (_alpha < 0.2)
      _alpha *= 5;
    else
      _alpha = 1;
    var img = sprite[SPRITE.SAND_WORM2][world.time];
    w = -img.width * this.breath.v;
    h = -img.height * this.breath.v;
    ctx.globalAlpha = _alpha;
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    var imgHurt = sprite[SPRITE.HURT_SAND_WORM2];
  }
  if ((this.action & STATE.HURT) && (imgHurt !== undefined)) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = (0.6 - this.hit.v) * _alpha;
    w = -imgHurt.width * this.breath.v;
    h = -imgHurt.height * this.breath.v;
    ctxDrawImage(ctx, imgHurt, -w / 4, -h / 4, w / 2, h / 2);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
};;

export function draw_vulture() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  var dist = dist(this, this.r);
  if (dist > 350)
    this.scale = Math.min(this.scale + (delta / 2), 1.8);
  else
    this.scale = Math.max(this.scale - delta, 1);
  this.breath.update();
  this.rotate.update();
  if (dist < 350)
    this._alpha = Math.max(0, this._alpha - (delta * 2.2));
  else
    this._alpha = Math.min(1, this._alpha + (delta * 2.2));
  img = sprite[SPRITE.VULTURE_GROUND_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.globalAlpha = 1 - this._alpha;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  img = sprite[SPRITE.VULTURE_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.globalAlpha = this._alpha;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = (0.6 - this.hit.v) * (1 - this._alpha);
    var img = sprite[SPRITE.HURT_VULTURE_GROUND];
    w = (-img.width * this.breath.v) * this.scale;
    h = (-img.height * this.breath.v) * this.scale;
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = (0.6 - this.hit.v) * this._alpha;
    var img = sprite[SPRITE.HURT_VULTURE];
    w = (-img.width * this.breath.v) * this.scale;
    h = (-img.height * this.breath.v) * this.scale;
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  img = sprite[SPRITE.VULTURE_WING_LEFT_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.save();
  ctx.translate(-40 * scale, 80 * scale);
  ctx.rotate(this.rotate.v);
  ctx.globalAlpha = this._alpha;
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = (0.6 - this.hit.v) * this._alpha;
    var img = sprite[SPRITE.HURT_VULTURE_WING_LEFT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  img = sprite[SPRITE.VULTURE_WING_RIGHT_ATTACK][world.time];
  ctx.save();
  ctx.translate(40 * scale, 80 * scale);
  ctx.rotate(-this.rotate.v);
  ctx.globalAlpha = this._alpha;
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = (0.6 - this.hit.v) * this._alpha;
    var img = sprite[SPRITE.HURT_VULTURE_WING_RIGHT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();
};

export function draw_hawk() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  var dist = dist(this, this.r);
  if (dist > 350)
    this.scale = Math.min(this.scale + (delta / 2), 1.8);
  else
    this.scale = Math.max(this.scale - delta, 1);
  this.breath.update();
  this.rotate.update();
  if (dist < 350)
    this._alpha = Math.max(0, this._alpha - (delta * 2.2));
  else
    this._alpha = Math.min(1, this._alpha + (delta * 2.2));
  if ((this.info & 1) === 0)
    img = sprite[SPRITE.HAWK_GROUND][world.time];
  else
    img = sprite[SPRITE.HAWK_GROUND_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.globalAlpha = 1 - this._alpha;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if ((this.info & 1) === 0)
    img = sprite[SPRITE.HAWK][world.time];
  else
    img = sprite[SPRITE.HAWK_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.globalAlpha = this._alpha;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = (0.6 - this.hit.v) * (1 - this._alpha);
    var img = sprite[SPRITE.HURT_HAWK_GROUND];
    w = (-img.width * this.breath.v) * this.scale;
    h = (-img.height * this.breath.v) * this.scale;
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = (0.6 - this.hit.v) * this._alpha;
    var img = sprite[SPRITE.HURT_HAWK];
    w = (-img.width * this.breath.v) * this.scale;
    h = (-img.height * this.breath.v) * this.scale;
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  if ((this.info & 1) === 0)
    img = sprite[SPRITE.HAWK_WING_LEFT][world.time];
  else
    img = sprite[SPRITE.HAWK_WING_LEFT_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.save();
  ctx.translate(-20 * scale, 0 * scale);
  ctx.rotate(this.rotate.v);
  ctx.globalAlpha = this._alpha;
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = (0.6 - this.hit.v) * this._alpha;
    var img = sprite[SPRITE.HURT_HAWK_WING_LEFT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  if ((this.info & 1) === 0)
    img = sprite[SPRITE.HAWK_WING_RIGHT][world.time];
  else
    img = sprite[SPRITE.HAWK_WING_RIGHT_ATTACK][world.time];
  ctx.save();
  ctx.translate(20 * scale, 0 * scale);
  ctx.rotate(-this.rotate.v);
  ctx.globalAlpha = this._alpha;
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = (0.6 - this.hit.v) * this._alpha;
    var img = sprite[SPRITE.HURT_HAWK_WING_RIGHT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  ctx.restore();
};

export function draw_baby_lava() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (dist(this, this.r) > 300)
    this.scale = Math.min(this.scale + (delta / 2), 1.8);
  else
    this.scale = Math.max(this.scale - delta, 1);
  this.breath.update();
  this.rotate.update();
  if (this.info === 0)
    img = sprite[SPRITE.BABY_LAVA][world.time];
  else
    img = sprite[SPRITE.BABY_LAVA_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_LAVA];
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  if (this.info === 0)
    img = sprite[SPRITE.BABY_LAVA_WING_LEFT][world.time];
  else
    img = sprite[SPRITE.BABY_LAVA_WING_LEFT_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.save();
  ctx.translate(-40 * scale, 10 * scale);
  ctx.rotate(this.rotate.v);
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_LAVA_WING_LEFT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  if (this.info === 0)
    img = sprite[SPRITE.BABY_LAVA_WING_RIGHT][world.time];
  else
    img = sprite[SPRITE.BABY_LAVA_WING_RIGHT_ATTACK][world.time];
  ctx.save();
  ctx.translate(40 * scale, 10 * scale);
  ctx.rotate(-this.rotate.v);
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_LAVA_WING_RIGHT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.restore();
};

export function draw_baby_dragon() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (dist(this, this.r) > 300)
    this.scale = Math.min(this.scale + (delta / 2), 1.8);
  else
    this.scale = Math.max(this.scale - delta, 1);
  this.breath.update();
  this.rotate.update();
  if (this.info === 0)
    img = sprite[SPRITE.BABY_DRAGON][world.time];
  else
    img = sprite[SPRITE.BABY_DRAGON_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_DRAGON];
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  if (this.info === 0)
    img = sprite[SPRITE.BABY_DRAGON_WING_LEFT][world.time];
  else
    img = sprite[SPRITE.BABY_DRAGON_WING_LEFT_ATTACK][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.save();
  ctx.translate(-40 * scale, 10 * scale);
  ctx.rotate(this.rotate.v);
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_DRAGON_WING_LEFT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  if (this.info === 0)
    img = sprite[SPRITE.BABY_DRAGON_WING_RIGHT][world.time];
  else
    img = sprite[SPRITE.BABY_DRAGON_WING_RIGHT_ATTACK][world.time];
  ctx.save();
  ctx.translate(40 * scale, 10 * scale);
  ctx.rotate(-this.rotate.v);
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_DRAGON_WING_RIGHT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.restore();
};

export function draw_lava_dragon() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (dist(this, this.r) > 300)
    this.scale = Math.min(this.scale + (delta / 2), 1.8);
  else
    this.scale = Math.max(this.scale - delta, 1);
  this.breath.update();
  this.rotate.update();
  img = sprite[SPRITE.LAVA_DRAGON][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_LAVA_DRAGON];
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  img = sprite[SPRITE.LAVA_WING_LEFT][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.save();
  ctx.translate(-60 * scale, 20 * scale);
  ctx.rotate(this.rotate.v);
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_LAVA_WING_LEFT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  img = sprite[SPRITE.LAVA_WING_RIGHT][world.time];
  ctx.save();
  ctx.translate(60 * scale, 20 * scale);
  ctx.rotate(-this.rotate.v);
  ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_LAVA_WING_RIGHT];
    ctxDrawImage(ctx, img, (-w * scale) / 4, (-h * scale) / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.restore();
};

export function draw_dragon() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (dist(this, this.r) > 300)
    this.scale = Math.min(this.scale + (delta / 2), 1.8);
  else
    this.scale = Math.max(this.scale - delta, 1);
  this.breath.update();
  this.rotate.update();
  img = sprite[SPRITE.DRAGON][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_DRAGON];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  img = sprite[SPRITE.WING_LEFT][world.time];
  w = (-img.width * this.breath.v) * this.scale;
  h = (-img.height * this.breath.v) * this.scale;
  ctx.save();
  ctx.translate(-30 * scale, 70 * scale);
  ctx.rotate(this.rotate.v);
  ctxDrawImage(ctx, img, -10 * scale, -40 * scale, w, h);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_WING_LEFT];
    ctxDrawImage(ctx, img, -10 * scale, -40 * scale, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  img = sprite[SPRITE.WING_RIGHT][world.time];
  ctx.save();
  ctx.translate(30 * scale, 70 * scale);
  ctx.rotate(-this.rotate.v);
  ctxDrawImage(ctx, img, (10 * scale) - w, -40 * scale, w, h);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_WING_RIGHT];
    ctxDrawImage(ctx, img, (10 * scale) - w, -40 * scale, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.restore();
};

export function draw_crate(id, _hurt) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (id === SPRITE.GIFT) {
    id = SPRITE.CRATE;
    this.info = 36;
  }
  img = sprite[id][this.info][world.time];
  w = -img.width / 2;
  h = -img.height / 2;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var hurt = get_image_effect(this.info, img, __EFFECT_BOX__);
    ctxDrawImage(ctx, hurt, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_simple_mobs_2(id, hurt) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  img = sprite[id][world.time];
  w = -img.width;
  h = -img.height;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[hurt];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_baby_mammoth() {
  this.breath.update();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.info === 0)
    img = sprite[SPRITE.BABY_MAMMOTH][world.time];
  else
    img = sprite[SPRITE.BABY_MAMMOTH_ATTACK][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BABY_MAMMOTH];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_boar() {
  this.breath.update();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.info === 0)
    img = sprite[SPRITE.BOAR][world.time];
  else
    img = sprite[SPRITE.BOAR_ATTACK][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_BOAR];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_crab_boss() {
  var pi2 = Math.PI / 2;
  var pi4 = Math.PI / 4;
  this.breath.update();
  this.breathl.update();
  this.breathr.update();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.info === 0)
    img = sprite[SPRITE.CRAB_BOSS][world.time];
  else
    img = sprite[SPRITE.CRAB_BOSS_ATTACK][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_CRAB_BOSS];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    if (this.heal.update() && (this.heal.o == false))
      this.action -= STATE.COLD;

    ctx.globalAlpha = 0.6 - this.heal.v;
    var img = sprite[SPRITE.HEAL_CRAB_BOSS];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle + pi4);
  ctx.translate(100, 0);
  ctx.rotate(pi2);
  if (this.info === 0)
    img = sprite[SPRITE.CRAB_BOSS_CLAW_LEFT][world.time];
  else
    img = sprite[SPRITE.CRAB_BOSS_CLAW_LEFT_ATTACK][world.time];
  w = -img.width * this.breathl.v;
  h = -img.height * this.breathl.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_CRAB_BOSS_CLAW_LEFT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    ctx.globalAlpha = 0.6 - this.heal.v;
    var img = sprite[SPRITE.HEAL_CRAB_BOSS_CLAW_LEFT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate((this.angle + pi2) + pi4);
  ctx.translate(100, 0);
  ctx.rotate(pi2);
  if (this.info === 0)
    img = sprite[SPRITE.CRAB_BOSS_CLAW_RIGHT][world.time];
  else
    img = sprite[SPRITE.CRAB_BOSS_CLAW_RIGHT_ATTACK][world.time];
  w = -img.width * this.breathr.v;
  h = -img.height * this.breathr.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_CRAB_BOSS_CLAW_RIGHT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    ctx.globalAlpha = 0.6 - this.heal.v;
    var img = sprite[SPRITE.HEAL_CRAB_BOSS_CLAW_RIGHT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_crab() {
  var pi2 = Math.PI / 2;
  var pi4 = Math.PI / 4;
  this.breath.update();
  this.breathl.update();
  this.breathr.update();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.info === 0)
    img = sprite[SPRITE.CRAB][world.time];
  else
    img = sprite[SPRITE.CRAB_ATTACK][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_CRAB];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    if (this.heal.update() && (this.heal.o == false))
      this.action -= STATE.COLD;

    ctx.globalAlpha = 0.6 - this.heal.v;
    var img = sprite[SPRITE.HEAL_CRAB];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle + pi4);
  ctx.translate(55, 0);
  ctx.rotate(pi2);
  if (this.info === 0)
    img = sprite[SPRITE.CRAB_CLAW_LEFT][world.time];
  else
    img = sprite[SPRITE.CRAB_CLAW_LEFT_ATTACK][world.time];
  w = -img.width * this.breathl.v;
  h = -img.height * this.breathl.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_CRAB_CLAW_LEFT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    ctx.globalAlpha = 0.6 - this.heal.v;
    var img = sprite[SPRITE.HEAL_CRAB_CLAW_LEFT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate((this.angle + pi2) + pi4);
  ctx.translate(55, 0);
  ctx.rotate(pi2);
  if (this.info === 0)
    img = sprite[SPRITE.CRAB_CLAW_RIGHT][world.time];
  else
    img = sprite[SPRITE.CRAB_CLAW_RIGHT_ATTACK][world.time];
  w = -img.width * this.breathr.v;
  h = -img.height * this.breathr.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[SPRITE.HURT_CRAB_CLAW_RIGHT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    ctx.globalAlpha = 0.6 - this.heal.v;
    var img = sprite[SPRITE.HEAL_CRAB_CLAW_RIGHT];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_spell() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.born = Math.min(1, this.born + (delta * 2));
  ctx.globalAlpha = Math.min(1, Math.max(0, dist(this, this.r) / 80)) * this.born;
  this.breath.update();
  img = sprite[SPRITE.SPELL][world.time][this.spell];
  if (this.spell < 2) {
    w = -img.width * this.breath.v;
    h = -img.height * this.breath.v;
  } else {
    if (this.fly === 0) {
      w = -img.width;
      h = -img.height;
    } else {
      w = -img.width * 1.35;
      h = -img.height * 1.35;
    }
  }
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.globalAlpha = 1;
  ctx.restore();
};

export function draw_simple_mobs(id, hurt) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.breath.update();
  img = sprite[id][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[hurt];
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_simple_mobs_hd(id, hurt) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.breath.update();
  img = sprite[id][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    var img = sprite[hurt];
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
};

export function draw_breath_2(id, x, y) {
  ctx.save();
  ctx.translate(user.cam.x + x, user.cam.y + y);
  ctx.rotate(this.angle);
  ctx.translate(this.x - x, this.y - y);
  this.breath.update();
  img = sprite[id][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_breath(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.breath.update();
  img = sprite[id][world.time];
  w = -img.width * this.breath.v;
  h = -img.height * this.breath.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_thornbush() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.PLANT_THORNBUSH_DRIED][world.time];
    else
      var img = sprite[SPRITE.PLANT_THORNBUSH][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_THORNBUSH][world.time];
    else
      var img = sprite[SPRITE.THORNBUSH][world.time];
    ctx.translate(0, img.height / 2);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_garlic() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.PLANT_GARLIC_DRIED][world.time];
    else
      var img = sprite[SPRITE.PLANT_GARLIC][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_GARLIC][world.time];
    else
      var img = sprite[SPRITE.GARLIC][world.time];
    ctx.translate(0, img.height / 2);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_aloe_vera() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.PLANT_ALOE_VERA_DRIED][world.time];
    else
      var img = sprite[SPRITE.PLANT_ALOE_VERA][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_ALOE_VERA][world.time];
    else
      var img = sprite[SPRITE.ALOE_VERA_GROWN][world.time];
    ctx.translate(0, img.height / 2);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_watermelon() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.PLANT_WATERMELON_DRIED][world.time];
    else
      var img = sprite[SPRITE.PLANT_WATERMELON][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_WATERMELON][world.time];
    else
      var img = sprite[SPRITE.WATERMELON][world.time];
    ctx.translate(0, img.height / 2);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_carrot() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.PLANT_CARROT_DRIED][world.time];
    else
      var img = sprite[SPRITE.PLANT_CARROT][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_CARROT][world.time];
    else
      var img = sprite[SPRITE.CARROT][world.time];
    ctx.translate(0, img.height / 2);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_pumpkin() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.PLANT_PUMPKIN_DRIED][world.time];
    else
      var img = sprite[SPRITE.PLANT_PUMPKIN][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_PUMPKIN][world.time];
    else
      var img = sprite[SPRITE.PUMPKIN][world.time];
    ctx.translate(0, img.height / 2);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_wheat() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  var amount = this.info & 15;
  if ((this.info === 10) || (amount === 0)) {
    ctx.rotate(this.angle);
    this.ground.update();
    if (this.info & 16)
      var img = sprite[SPRITE.WHEAT_SEED_DRIED][world.time];
    else
      var img = sprite[SPRITE.WHEAT_SEED][world.time];
    var w = -img.width * this.ground.v;
    var h = -img.height * this.ground.v;
    ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  } else {
    this.wind.update();
    if (this.info & 16)
      var img = sprite[SPRITE.DRIED_WHEAT][world.time];
    else
      var img = sprite[SPRITE.WILD_WHEAT][world.time];
    ctx.translate(0, img.height / 2);
    ctx.rotate(this.wind.v);
    ctxDrawImage(ctx, img, x - (img.width / 2), -img.height + y);
  }
  ctx.restore();
};

export function draw_seed() {
  if (this.info < 10)
    return;

  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  this.ground.update();
  var img = sprite[SPRITE.PLANT_SEED][world.time];
  var w = -img.width * this.ground.v;
  var h = -img.height * this.ground.v;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.restore();
};

export function draw_plant() {
  if (this.info === 10)
    return;

  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if (this.info & 16)
    var img = sprite[SPRITE.DRIED_PLANT][world.time];
  else
    var img = sprite[SPRITE.PLANT_MINI][world.time];
  ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.width / 2) + y);
  ctx.restore();
  var amount = this.info & 15;
  for (var i = 0; i < amount; i++)
    this.fruits[i].draw(SPRITE.FRUIT);
};

export function draw_tomato() {
  if (this.info < 10)
    return;

  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  this.ground.update();
  var img = sprite[SPRITE.PLANT_TOMATO][world.time];
  var w = -img.width * this.ground.v;
  var h = -img.height * this.ground.v;
  ctxDrawImage(ctx, img, (-w / 2) + x, (-h / 2) + y, w, h);
  ctx.restore();
};

export function draw_tomato_fruit() {
  if (this.info === 10)
    return;

  var amount = this.info & 15;
  for (var i = 0; i < amount; i++)
    this.fruits[i].draw(SPRITE.TOMATO, this.x, this.y);
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if (this.info & 16)
    var img = sprite[SPRITE.DRIED_TOMATO_MINI][world.time];
  else
    var img = sprite[SPRITE.TOMATO_MINI][world.time];
  ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.width / 2) + y);
  ctx.restore();
};

export function draw_furnace() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if (this.action == 2)
    img = sprite[SPRITE.FURNACE_ON][world.time];
  else
    img = sprite[SPRITE.FURNACE_OFF][world.time];
  ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.height / 2) + y);
  ctx.restore();
};

export function draw_furnace_ground() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.ground.update();
  ctx.globalAlpha = 0.3;
  var img = sprite[SPRITE.GROUND_FIRE][world.time];
  var w = -img.width * this.ground.v;
  var h = -img.height * this.ground.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.globalAlpha = 1;
  ctx.restore();
};

export function draw_bread_oven_smog() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if ((((this.info & 31) && (this.info & 992)) && ((this.info & 31744) != 31744)) && ((this.smog.length == 0) || (this.smog[this.smog.length - 1] <= SPRITE.SMOG_PUSH)))
    this.smog.push(SPRITE.SMOG);

  for (var i = 0; i < this.smog.length; i++) {
    this.smog[i] = Math.max(0, this.smog[i] - (delta * SPRITE.SMOG_SPEED));
    ctx.globalAlpha = this.smog[i] / 1.3;
    var v = (1 - this.smog[i]) * 40;
    var r = ((1 - this.smog[i]) * 35) + 10;
    circle(ctx, (-68 * scale) + (Math.cos(-this.angle - (Math.PI / 2)) * v), (-20 * scale) + (Math.sin(-this.angle - (Math.PI / 2)) * v), r);
    fill_path(ctx, "#333333");
  }
  ctx.globalAlpha = 1;
  if ((this.smog.length > 0) && (this.smog[0] === 0))
    this.smog.shift();

  ctx.restore();
};

export function draw_fire_ground(id) {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.ground.update();
  ctx.globalAlpha = 0.3;
  var img = sprite[SPRITE.GROUND_FIRE][world.time];
  var w = -img.width * this.ground.v;
  var h = -img.height * this.ground.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.globalAlpha = 1;
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  img = sprite[id][world.time];
  ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.height / 2) + y);
  ctx.restore();
};

export function draw_sign() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if (this.info === 0)
    img = sprite[SPRITE.SIGN][world.time];
  else
    img = sprite[SPRITE.SYMBOLS][world.time][this.info - 1];
  ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.height / 2) + y);
  ctx.restore();
};;

export function draw_bread_oven() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if (((this.info & 31) && (this.info & 992)) && ((this.info & 31744) != 31744)) {
    img = sprite[SPRITE.BREAD_OVEN_ON][world.time];
    ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.height / 2) + y);
    this.up.update();
    var img = sprite[SPRITE.BREAD_LIGHT_UP][world.time];
    var w = -img.width * this.up.v;
    var h = -img.height * this.up.v;
    ctxDrawImage(ctx, img, (-w / 2) + (1 * scale), (-h / 2) + (3 * scale), w, h);
  } else {
    img = sprite[SPRITE.BREAD_OVEN_OFF][world.time];
    ctxDrawImage(ctx, img, (-img.width / 2) + x, (-img.height / 2) + y);
  }
  ctx.restore();
};

export function draw_windmill_wings() {
  if (this.hit.update) {
    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  if ((this.info & 255) && ((this.info & 65280) != 65280))
    this.rotate = (this.rotate + (delta * 0.5)) % (Math.PI * 2);

  ctx.save();
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.save();
  ctx.rotate(this.rotate);
  img = sprite[SPRITE.WINDMILL_WINGS][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.save();
  ctx.rotate(this.angl);
  img = sprite[SPRITE.WINDMILL_HEAD][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.restore();
};

export function draw_extractor_stone() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.save();
  if ((this.info & 255) && ((this.info & 65280) != 65280)) {
    x += (Math.random() * 2) - 1;
    y += (Math.random() * 2) - 1;
  }
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.EXTRACTOR_MACHINE_STONE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  if ((this.info & 255) && ((this.info & 65280) != 65280))
    this.rotate = (this.rotate + (delta * 3)) % (Math.PI * 2);

  ctx.rotate(this.rotate);
  img = sprite[SPRITE.EXTRACTOR_MACHINE0_STONE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_extractor_gold() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.save();
  if ((this.info & 255) && ((this.info & 65280) != 65280)) {
    x += (Math.random() * 2) - 1;
    y += (Math.random() * 2) - 1;
  }
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.EXTRACTOR_MACHINE_GOLD][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  if ((this.info & 255) && ((this.info & 65280) != 65280))
    this.rotate = (this.rotate + (delta * 3)) % (Math.PI * 2);

  ctx.rotate(this.rotate);
  img = sprite[SPRITE.EXTRACTOR_MACHINE0_GOLD][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_extractor_diamond() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.save();
  if ((this.info & 255) && ((this.info & 65280) != 65280)) {
    x += (Math.random() * 2) - 1;
    y += (Math.random() * 2) - 1;
  }
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.EXTRACTOR_MACHINE_DIAMOND][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  if ((this.info & 255) && ((this.info & 65280) != 65280))
    this.rotate = (this.rotate + (delta * 3)) % (Math.PI * 2);

  ctx.rotate(this.rotate);
  img = sprite[SPRITE.EXTRACTOR_MACHINE0_DIAMOND][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_extractor_amethyst() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.save();
  if ((this.info & 255) && ((this.info & 65280) != 65280)) {
    x += (Math.random() * 2) - 1;
    y += (Math.random() * 2) - 1;
  }
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.EXTRACTOR_MACHINE_AMETHYST][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  if ((this.info & 255) && ((this.info & 65280) != 65280))
    this.rotate = (this.rotate + (delta * 3)) % (Math.PI * 2);

  ctx.rotate(this.rotate);
  img = sprite[SPRITE.EXTRACTOR_MACHINE0_AMETHYST][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_extractor_reidite() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.save();
  if ((this.info & 255) && ((this.info & 65280) != 65280)) {
    x += (Math.random() * 2) - 1;
    y += (Math.random() * 2) - 1;
  }
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.EXTRACTOR_MACHINE_REIDITE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  if ((this.info & 255) && ((this.info & 65280) != 65280))
    this.rotate = (this.rotate + (delta * 3)) % (Math.PI * 2);

  ctx.rotate(this.rotate);
  img = sprite[SPRITE.EXTRACTOR_MACHINE0_REIDITE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_windmill_head() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  ctx.save();
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.rotate(this.angle);
  img = sprite[SPRITE.WINDMILL][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
};

export function draw_emerald_machine() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  this.rotate1 = (this.rotate1 + (delta * 3)) % (Math.PI * 2);
  this.rotate2 = (this.rotate2 - (delta * 3)) % (Math.PI * 2);
  ctx.save();
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.save();
  ctx.rotate(this.angle);
  img = sprite[SPRITE.EMERALD_MACHINE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.save();
  ctx.rotate(this.rotate1);
  img = sprite[SPRITE.EMERALD_MACHINE_ROTATE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.save();
  ctx.rotate(this.rotate2);
  img = sprite[SPRITE.EMERALD_MACHINE_HOLE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.restore();
};

export function draw_resurrection() {
  if (this.hit.update) {
    if (this.hit.anim.update() && (this.hit.anim.o == false))
      this.hit.update = false;

    var v = (((1 - this.hit.anim.v) * delta) * 600) * scale;
    var x = Math.cos(this.hit.angle - this.angle) * v;
    var y = Math.sin(this.hit.angle - this.angle) * v;
  } else {
    var x = 0;
    var y = 0;
  };
  this.rotate1 = (this.rotate1 + (delta * 3)) % (Math.PI * 2);
  this.rotate2 = (this.rotate2 - (delta * 3)) % (Math.PI * 2);
  ctx.save();
  ctx.translate((user.cam.x + this.x) + x, (user.cam.y + this.y) + y);
  ctx.save();
  ctx.rotate(this.angle);
  img = sprite[SPRITE.RESURRECTION][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.save();
  ctx.rotate(this.rotate1);
  img = sprite[SPRITE.RESURRECTION_ROTATE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.save();
  ctx.rotate(this.rotate2);
  img = sprite[SPRITE.RESURRECTION_HOLE][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.restore();
  ctx.restore();
};

export function draw_emerald_machine_halo() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.halo.update();
  img = sprite[SPRITE.EMERALD_MACHINE_GROUND][world.time];
  w = -img.width * this.halo.v;
  h = -img.height * this.halo.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_resurrection_halo() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.halo.update();
  img = sprite[SPRITE.RESURRECTION_GROUND][world.time];
  w = -img.width * this.halo.v;
  h = -img.height * this.halo.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_furnace_halo() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.halo.update();
  img = sprite[SPRITE.HALO_FIRE][world.time];
  w = -img.width * this.halo.v;
  h = -img.height * this.halo.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_fire_halo() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.angle);
  this.fire.update();
  img = sprite[SPRITE.FIRE][world.time];
  w = -img.width * this.fire.v;
  h = -img.height * this.fire.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  this.halo.update();
  img = sprite[SPRITE.HALO_FIRE][world.time];
  w = -img.width * this.halo.v;
  h = -img.height * this.halo.v;
  ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  ctx.restore();
};

export function draw_player_effect(p) {
  if (p.right >= 0) {
    switch (p.right) {
      case SPRITE.WATERING_CAN_FULL:
        ctx.save();
        var effect1 = (-3 * p.attack.v) / Math.PI;
        if (p.attack.o)
          var effect2 = (-Math.PI / 3) - (((Math.PI / 3) + p.attack.v) / 3);
        else
          var effect2 = p.attack.v;
        ctx.rotate((p.angle - (Math.PI / 2)) + effect2);
        ctx.globalAlpha = effect1 / 1.2;
        circle(ctx, -40 * scale, 90 * scale, 5 * scale);
        fill_path(ctx, "#0B6A84");
        ctx.globalAlpha = effect1 / 1.2;
        circle(ctx, -52 * scale, 100 * scale, 8 * scale);
        fill_path(ctx, "#0B6A84");
        ctx.globalAlpha = effect1 / 1.2;
        circle(ctx, -30 * scale, 95 * scale, 4 * scale);
        fill_path(ctx, "#0B6A84");
        ctx.globalAlpha = 1;
        ctx.restore();
        break;
      case SPRITE.SHOVEL:
      case SPRITE.SHOVEL_GOLD:
      case SPRITE.SHOVEL_DIAMOND:
      case SPRITE.SHOVEL_AMETHYST:
        if (p.fly === 1)
          break;

        if (p.dist_winter > 0)
          var id = SPRITE.ICE_SHOVEL_CO[world.time];
        else if ((p.dist_sand > 0) || (p.dist_desert > 0))
          var id = SPRITE.SAND_SHOVEL_CO[world.time];
        else
          var id = SPRITE.GRD_SHOVEL_CO[world.time];
        var effect1 = (-3 * p.attack.v) / Math.PI;
        if (p.attack.o)
          var effect2 = Math.max((0.5 - (effect1 / 2)) + 0.5, 0);
        else
          var effect2 = Math.max(effect1 / 2, 0);
        if (effect2 === 0)
          p.angle_init = p.angle;

        ctx.save();
        ctx.rotate(p.angle_init - (Math.PI / 2));
        ctx.globalAlpha = effect1;
        var effect3 = (25 * scale) + (effect2 * 25);
        circle(ctx, effect3, 80 * scale, 15 * scale);
        fill_path(ctx, id);
        circle(ctx, -effect3, 80 * scale, 15 * scale);
        fill_path(ctx, id);
        ctx.globalAlpha = 1;
        ctx.restore();
        break;
    }
  }
};

export function draw_player_right_stuff_after(right, x, y) {
  if (right >= 0) {
    img = sprite[right][world.time];
    switch (right) {
      case SPRITE.WOOD_SHIELD:
      case SPRITE.STONE_SHIELD:
      case SPRITE.GOLD_SHIELD:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (0 + x)), (-img.height / 4) + (scale * (y + 35)));
        break;
      case SPRITE.DIAMOND_SHIELD:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (1 + x)), (-img.height / 4) + (scale * (y + 45)));
        break;
      case SPRITE.AMETHYST_SHIELD:
      case SPRITE.REIDITE_SHIELD:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (1 + x)), (-img.height / 4) + (scale * (y + 40)));
        break;
    }
  }
};;

export function draw_player_right_stuff(right, x, y) {
  if (right >= 0) {
    img = sprite[right][world.time];
    switch (right) {
      case SPRITE.PICK:
      case SPRITE.PICK_GOLD:
      case SPRITE.PICK_DIAMOND:
      case SPRITE.PICK_WOOD:
      case SPRITE.PICK_AMETHYST:
      case SPRITE.PICK_REIDITE:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (45 + x)), (-img.height / 2) + (scale * (y + 22)));
        break;
      case SPRITE.SWORD_WOOD:
      case SPRITE.SWORD:
      case SPRITE.SWORD_GOLD:
      case SPRITE.SWORD_DIAMOND:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (47 + x)), (-img.height / 4) + (scale * (y + 45)));
        break;
      case SPRITE.SWORD_AMETHYST:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (52 + x)), (-img.height / 4) + (scale * (y + 45)));
        break;
      case SPRITE.REIDITE_SWORD:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (47 + x)), (-img.height / 4) + (scale * (y + 44)));
        break;
      case SPRITE.PIRATE_SWORD:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (47 + x)), (-img.height / 2) + (scale * (y + 44)));
        break;
      case SPRITE.DRAGON_SWORD:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (40 + x)), (-img.height / 2) + (scale * (y + 65)));
        break;
      case SPRITE.WOOD_SPEAR:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (37 + x)), (-img.height / 4) + (scale * (y + 85)));
        break;
      case SPRITE.REIDITE_SPEAR:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (37 + x)), (-img.height / 4) + (scale * (y + 85)));
        break;
      case SPRITE.PITCHFORK2:
      case SPRITE.PITCHFORK:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (26 + x)), (-img.height / 4) + (scale * (y + 77)));
        break;
      case SPRITE.LAVA_SPEAR:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (37 + x)), (-img.height / 4) + (scale * (y + 85)));
        break;
      case SPRITE.LAVA_SWORD:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (47 + x)), (-img.height / 4) + (scale * (y + 44)));
        break;
      case SPRITE.WOOD_BOW:
      case SPRITE.STONE_BOW:
      case SPRITE.GOLD_BOW:
      case SPRITE.DIAMOND_BOW:
      case SPRITE.AMETHYST_BOW:
      case SPRITE.REIDITE_BOW:
      case SPRITE.DRAGON_BOW:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (37 + x)), (-img.height / 4) + (scale * (y + 30)));
        break;
      case SPRITE.MACHETE:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (47 + x)), (-img.height / 4) + (scale * (y + 35)));
        break;
      case SPRITE.WAND1:
      case SPRITE.WAND2:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (47 + x)), (-img.height / 4) + (scale * (y + 40)));
        break;
      case SPRITE.SADDLE:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (47 + x)), (-img.height / 4) + (scale * (y + 34)));
        break;
      case SPRITE.SPEAR:
      case SPRITE.GOLD_SPEAR:
      case SPRITE.DIAMOND_SPEAR:
      case SPRITE.AMETHYST_SPEAR:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (37 + x)), (-img.height / 4) + (scale * (y + 90)));
        break;
      case SPRITE.CRAB_SPEAR:
        draw_image_transition_hd(right, img, (-img.width / 4) - (scale * (40 + x)), (-img.height / 4) + (scale * (y + 85)));
        break;
      case SPRITE.DRAGON_SPEAR:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (39 + x)), (-img.height / 2) + (scale * (y + 90)));
        break;
      case SPRITE.HAMMER:
      case SPRITE.HAMMER_GOLD:
      case SPRITE.HAMMER_DIAMOND:
      case SPRITE.HAMMER_AMETHYST:
      case SPRITE.HAMMER_REIDITE:
      case SPRITE.SUPER_HAMMER:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (46 + x)), (-img.height / 2) + (scale * (y + 35)));
        break;
      case SPRITE.WATERING_CAN_FULL:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (47 + x)), (-img.height / 2) + (scale * (y + 54)));
        break;
      case SPRITE.SHOVEL:
      case SPRITE.SHOVEL_GOLD:
      case SPRITE.SHOVEL_DIAMOND:
      case SPRITE.SHOVEL_AMETHYST:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (46 + x)), (-img.height / 2) + (scale * (y + 35)));
        break;
      case SPRITE.SPANNER:
        draw_image_transition(right, img, (-img.width / 2) - (scale * (47 + x)), (-img.height / 2) + (scale * (y + 20)));
        break;
    }
  }
};
export function draw_player_clothe(clothe) {
  if (clothe > 0) {
    var img = sprite[clothe][world.time];
    switch (clothe) {
      case SPRITE.WOOD_HELMET:
        draw_image_transition(clothe, img, (-img.width / 2) + (2 * scale), (-img.height / 2) - (scale * 5));
        break;
      case SPRITE.EARMUFFS:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 18));
        break;
      case SPRITE.COAT:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 10));
        break;
      case SPRITE.EXPLORER_HAT:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 19));
        break;
      case SPRITE.PIRATE_HAT:
        draw_image_transition_hd(clothe, img, -img.width / 4, (-img.height / 4) - (20 * scale));
        break;
      case SPRITE.STONE_HELMET:
        draw_image_transition(clothe, img, (-img.width / 2) - (1 * scale), (-img.height / 2) - (scale * 23));
        break;
      case SPRITE.GOLD_HELMET:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 5));
        break;
      case SPRITE.DIAMOND_HELMET:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 2));
        break;
      case SPRITE.AMETHYST_HELMET:
        draw_image_transition(clothe, img, (-img.width / 2) + (1.5 * scale), (-img.height / 2) - (1 * scale));
        break;
      case SPRITE.REIDITE_HELMET:
      case SPRITE.DIAMOND_PROTECTION:
      case SPRITE.AMETHYST_PROTECTION:
      case SPRITE.REIDITE_PROTECTION:
      case SPRITE.TURBAN1:
      case SPRITE.TURBAN2:
      case SPRITE.PILOT_HELMET:
      case SPRITE.LAVA_HELMET:
      case SPRITE.WITCH:
      case SPRITE.FUR_HAT:
      case SPRITE.FLOWER_HAT:
        draw_image_transition_hd(clothe, img, -img.width / 4, (-img.height / 4) + (2 * scale));
        break;
      case SPRITE.CHRISTMAS_HAT:
      case SPRITE.ELF_HAT:
        draw_image_transition(clothe, img, (-img.width / 2) - (5 * scale), (-img.height / 2) - (scale * 2));
        break;
      case SPRITE.CAP_SCARF:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 2));
        break;
      case SPRITE.WINTER_HOOD:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 2));
        break;
      case SPRITE.DIVING_MASK:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (scale * 2));
        break;
      case SPRITE.SUPER_DIVING_SUIT:
        draw_image_transition(clothe, img, (-img.width / 2) + (2 * scale), -img.height / 2);
        break;
      case SPRITE.DRAGON_HELMET:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (5 * scale));
        break;
      case SPRITE.CROWN_GREEN:
      case SPRITE.CROWN_ORANGE:
      case SPRITE.CROWN_BLUE:
        draw_image_transition(clothe, img, (-img.width / 2) - (1 * scale), -img.height / 2);
        break;
      case SPRITE.HOOD:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) + (2 * scale));
        break;
      case SPRITE.PEASANT:
      case SPRITE.WINTER_PEASANT:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) + (8 * scale));
        break;
      case SPRITE.CROWN_CRAB:
        draw_image_transition(clothe, img, -img.width / 2, (-img.height / 2) - (4 * scale));
        break;
    }
  }
};

export function draw_vehicle() {
  if (this.ghost || (this.vehicle === 0))
    return;

  if ((this.x != this.r.x) || (this.y != this.r.y)) {
    var angle = (get_angle_2(this.x, this.y, this.r.x, this.r.y) + (Math.PI / 2)) % (Math.PI * 2);
    this.vehicle_fx2 = reduceAngle(angle, this.vehicle_fx2);
    this.vehicle_fx2 = lerp(this.vehicle_fx2, angle, 0.018);
  }
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  ctx.rotate(this.vehicle_fx2);
  if (this.vehicle === INV.BOAT) {
    if ((this.speed > 50) || (this.vehicle_fx1 > 0)) {
      if (this.speed > 50)
        this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + delta);
      else
        this.vehicle_fx1 = Math.max(0, this.vehicle_fx1 - delta);
      ctx.globalAlpha = this.vehicle_fx1;
      var img = sprite[SPRITE.BOAT_WAVE][world.time];
      draw_image_transition_hd(SPRITE.BOAT_WAVE, img, -img.width / 4, -img.height / 4);
      ctx.globalAlpha = 1;
    }
    var img = sprite[SPRITE.BOAT][world.time];
    draw_image_transition_hd(SPRITE.BOAT, img, -img.width / 4, -img.height / 4);
  } else if (this.vehicle === INV.HAWK) {
    this.vehicle_fx5 = lerp(this.vehicle_fx5, this.speed, 0.018);
    this.vehicle_fx4.update();
    if (this.speed > 85)
      this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + (delta / 4));
    else
      this.vehicle_fx1 = Math.max(0.1, this.vehicle_fx1 - delta);
    var img = sprite[SPRITE.HAWK_TAMED][world.time];
    draw_image_transition_hd(SPRITE.HAWK_TAMED, img, -img.width / 4, -img.height / 4);
    img = sprite[SPRITE.HAWK_WING_LEFT_TAMED][world.time];
    w = -img.width;
    h = -img.height;
    ctx.save();
    ctx.translate(-20 * scale, -20 * scale);
    ctx.rotate(this.vehicle_fx4.v * this.vehicle_fx1);
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.restore();
    img = sprite[SPRITE.HAWK_WING_RIGHT_TAMED][world.time];
    ctx.save();
    ctx.translate(20 * scale, -20 * scale);
    ctx.rotate(-this.vehicle_fx4.v * this.vehicle_fx1);
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.restore();
  } else if (this.vehicle === INV.BABY_LAVA) {
    this.vehicle_fx5 = lerp(this.vehicle_fx5, this.speed, 0.018);
    this.vehicle_fx4.update();
    if (this.speed > 85)
      this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + (delta / 4));
    else
      this.vehicle_fx1 = Math.max(0.1, this.vehicle_fx1 - delta);
    var img = sprite[SPRITE.BABY_LAVA_TAMED][world.time];
    draw_image_transition_hd(SPRITE.BABY_LAVA_TAMED, img, -img.width / 4, -img.height / 4);
    img = sprite[SPRITE.BABY_LAVA_WING_LEFT_TAMED][world.time];
    w = -img.width;
    h = -img.height;
    ctx.save();
    ctx.translate(-40 * scale, -45 * scale);
    ctx.rotate(this.vehicle_fx4.v * this.vehicle_fx1);
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.restore();
    img = sprite[SPRITE.BABY_LAVA_WING_RIGHT_TAMED][world.time];
    ctx.save();
    ctx.translate(40 * scale, -45 * scale);
    ctx.rotate(-this.vehicle_fx4.v * this.vehicle_fx1);
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.restore();
  } else if (this.vehicle === INV.BABY_DRAGON) {
    this.vehicle_fx5 = lerp(this.vehicle_fx5, this.speed, 0.018);
    this.vehicle_fx4.update();
    if (this.speed > 85)
      this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + (delta / 4));
    else
      this.vehicle_fx1 = Math.max(0.1, this.vehicle_fx1 - delta);
    var img = sprite[SPRITE.BABY_DRAGON_TAMED][world.time];
    draw_image_transition_hd(SPRITE.BABY_DRAGON_TAMED, img, -img.width / 4, -img.height / 4);
    img = sprite[SPRITE.BABY_DRAGON_WING_LEFT_TAMED][world.time];
    w = -img.width;
    h = -img.height;
    ctx.save();
    ctx.translate(-40 * scale, -45 * scale);
    ctx.rotate(this.vehicle_fx4.v * this.vehicle_fx1);
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.restore();
    img = sprite[SPRITE.BABY_DRAGON_WING_RIGHT_TAMED][world.time];
    ctx.save();
    ctx.translate(40 * scale, -45 * scale);
    ctx.rotate(-this.vehicle_fx4.v * this.vehicle_fx1);
    ctxDrawImage(ctx, img, -w / 4, -h / 4, w / 2, h / 2);
    ctx.restore();
  } else if (this.vehicle === INV.NIMBUS) {
    this.vehicle_fx5 = lerp(this.vehicle_fx5, this.speed, 0.018);
    var img = sprite[SPRITE.NIMBUS][world.time];
    draw_image_transition_hd(SPRITE.NIMBUS, img, -img.width / 4, -img.height / 4);
  } else if (this.vehicle === INV.PLANE) {
    this.vehicle_fx5 = lerp(this.vehicle_fx5, this.speed, 0.018);
    var img = sprite[SPRITE.PLANE][world.time];
    draw_image_transition_hd(SPRITE.PLANE, img, -img.width / 4, -img.height / 4);
  } else if (this.vehicle === INV.SLED) {
    var img = sprite[SPRITE.SLED][world.time];
    draw_image_transition_hd(SPRITE.SLED, img, -img.width / 4, -img.height / 4);
  } else if (this.vehicle === INV.BABY_MAMMOTH) {
    var img = sprite[SPRITE.BABY_MAMMOTH_TAMED][world.time];
    if (this.speed > 85)
      this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + (delta / 4));
    else
      this.vehicle_fx1 = Math.max(0, this.vehicle_fx1 - delta);
    this.vehicle_fx3 += delta * 60;
    if (this.vehicle_fx3 > 60)
      this.vehicle_fx3 -= 60;

    var move = this.vehicle_fx1 * (-6 + (12 * ((this.vehicle_fx3 < 30) ? (this.vehicle_fx3 / 30) : (1 - ((this.vehicle_fx3 - 30) / 30)))));
    draw_image_transition_hd(SPRITE.BABY_MAMMOTH_TAMED, img, -img.width / 4, (-img.height / 4) + move);
  } else if (this.vehicle === INV.MOUNT_BOAR) {
    var img = sprite[SPRITE.BOAR_TAMED][world.time];
    if (this.speed > 85)
      this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + (delta / 4));
    else
      this.vehicle_fx1 = Math.max(0, this.vehicle_fx1 - delta);
    this.vehicle_fx3 += delta * 60;
    if (this.vehicle_fx3 > 60)
      this.vehicle_fx3 -= 60;

    var move = this.vehicle_fx1 * (-6 + (12 * ((this.vehicle_fx3 < 30) ? (this.vehicle_fx3 / 30) : (1 - ((this.vehicle_fx3 - 30) / 30)))));
    draw_image_transition_hd(SPRITE.BOAR_TAMED, img, -img.width / 4, (-img.height / 4) + move);
  } else if (this.vehicle === INV.CRAB_BOSS) {
    var pi2 = Math.PI / 2;
    var pi4 = Math.PI / 4;
    var img = sprite[SPRITE.CRAB_BOSS_TAMED][world.time];
    if (this.speed > 85)
      this.vehicle_fx1 = Math.min(1, this.vehicle_fx1 + (delta / 4));
    else
      this.vehicle_fx1 = Math.max(0, this.vehicle_fx1 - delta);
    this.vehicle_fx3 += delta * 60;
    if (this.vehicle_fx3 > 60)
      this.vehicle_fx3 -= 60;

    var move = this.vehicle_fx1 * (-6 + (12 * ((this.vehicle_fx3 < 30) ? (this.vehicle_fx3 / 30) : (1 - ((this.vehicle_fx3 - 30) / 30)))));
    draw_image_transition_hd(SPRITE.CRAB_BOSS_TAMED, img, (-img.width / 4) + move, -img.height / 4);
    ctx.restore();
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate((Math.PI + this.vehicle_fx2) + pi4);
    ctx.translate(120, move);
    ctx.rotate(pi2);
    img = sprite[SPRITE.CRAB_BOSS_CLAW_LEFT][world.time];
    w = -img.width;
    h = -img.height;
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(((Math.PI + this.vehicle_fx2) + pi2) + pi4);
    ctx.translate(120, move);
    ctx.rotate(pi2);
    img = sprite[SPRITE.CRAB_BOSS_CLAW_RIGHT][world.time];
    w = -img.width;
    h = -img.height;
    ctxDrawImage(ctx, img, -w / 2, -h / 2, w, h);
  }
  ctx.restore();
};
__EFFECT_HURT__ = 0;
__EFFECT_HEAL__ = 1;
__EFFECT_COLD__ = 2;
__EFFECT_HUNGER__ = 3;
__EFFECT_BOX__ = 4;
__IMAGE_EFFECT__ = [
  [],
  [],
  [],
  [],
  []
];
__IMAGE_EFFECT_COLOR__ = ["#BB0000", "#00BB00", "#1CE7E0", "#DBE71C", "#BB0000"];

export function get_image_effect(image_id, image, effect) {
  if (image.tryLoad() !== 1)
    return image;

  var image_effect = __IMAGE_EFFECT__[effect][image_id];
  if (image_effect === undefined) {
    image_effect = document.createElement("canvas");
    var context = image_effect.getContext("2d");
    var width = image.width;
    var height = image.height;
    image_effect.width = width;
    image_effect.height = height;
    context.drawImage(image, 0, 0);
    context.globalCompositeOperation = "source-in";
    context.fillStyle = __IMAGE_EFFECT_COLOR__[effect];
    context.fillRect(0, 0, width, height);
    __IMAGE_EFFECT__[effect][image_id] = image_effect;
  }
  return image_effect;
};;

export function draw_player() {
  var isShield = 0;
  switch (this.right) {
    case SPRITE.WOOD_SHIELD:
    case SPRITE.STONE_SHIELD:
    case SPRITE.GOLD_SHIELD:
    case SPRITE.DIAMOND_SHIELD:
    case SPRITE.AMETHYST_SHIELD:
    case SPRITE.REIDITE_SHIELD:
      var isShield = 1;
      break;
  }
  if (this.ghost) {
    for (var i = 0; i < this.bubbles.length; i++) {
      var b = this.bubbles[i];
      if (b.life > 0.5)
        var alpha = 1 - ((b.life - 0.5) * 2);
      else
        var alpha = b.life * 2;
      ctx.globalAlpha = alpha;
      var img = sprite[SPRITE.BUBBLES][world.time][b.id];
      ctxDrawImage(ctx, img, (user.cam.x + b.x) - (img.width / 2), (user.cam.y + b.y) - (img.height / 2));
      ctx.globalAlpha = 1;
    }
    return;
  }
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  world.dist_from_biomes(this);
  if (this.action & STATE.ATTACK) {
    draw_player_effect(this);
  }
  ctx.save();
  ctx.rotate(this.angle - (Math.PI / 2));
  if (!(this.action & STATE.ATTACK)) {
    if ((this.action & STATE.IDLE) || (this.vehicle !== 0)) {
      this.idle.update();
    } else if (this.action & STATE.WALK) {
      this.walk.update();
    }
  }
  var x = this.idle.v;
  var y = this.walk.v;
  var spriteid;
  if (this.clothe === SPRITE.WINTER_HOOD) {
    img = sprite[SPRITE.GLOVES_HOOD][world.time];
    spriteid = SPRITE.GLOVES_HOOD;
  } else if (this.clothe === SPRITE.DIAMOND_PROTECTION) {
    img = sprite[SPRITE.GLOVES_DIAMOND_PROTECTION][world.time];
    spriteid = SPRITE.GLOVES_DIAMOND_PROTECTION;
  } else if (this.clothe === SPRITE.AMETHYST_PROTECTION) {
    img = sprite[SPRITE.GLOVES_AMETHYST_PROTECTION][world.time];
    spriteid = SPRITE.GLOVES_AMETHYST_PROTECTION;
  } else if (this.clothe === SPRITE.REIDITE_PROTECTION) {
    img = sprite[SPRITE.GLOVES_REIDITE_PROTECTION][world.time];
    spriteid = SPRITE.GLOVES_REIDITE_PROTECTION;
  } else if (this.superzombie) {
    img = sprite[SPRITE.ZOMBIE_HAND][world.time];
    spriteid = SPRITE.ZOMBIE_HAND;
  } else {
    img = sprite[SPRITE.HAND][this.skin][world.time];
    spriteid = SPRITE.HAND;
  }
  shadow = sprite[SPRITE.HAND_SHADOW][world.time];
  var hand = img;
  var handid = spriteid;
  if (this.action & STATE.ATTACK) {
    if (this.attack.update() && (this.attack.o == false)) {
      this.hand = !this.hand;
      this.action -= STATE.ATTACK;
      if (this.uid == user.uid)
        user.control.mouse = 0;

    }
    if (this.right >= 0)
      this.hand = true;

    var right = this.hand ? this.attack.v : (-this.attack.v / 3);
    var left = this.hand ? (this.attack.v / 3) : -this.attack.v;
    if (this.superzombie) {
      ctx.save();
      ctx.rotate(right);
      draw_image_transition(spriteid, img, (-img.width / 2) - (scale * (66 + x)), (-img.height / 2) + ((5 + y) * scale));
      ctx.restore();
      ctx.save();
      ctx.rotate(left);
      draw_image_transition(spriteid, img, (-img.width / 2) + (scale * (66 + x)), (-img.height / 2) + ((5 + y) * scale));
      ctx.restore();
    } else {
      if (isShield === 0) {
        if (this.right === SPRITE.WOOD_BOW)
          right = -ease_out_quad(-right);

        ctx.save();
        ctx.rotate(right);
        draw_image_transition(SPRITE.HAND_SHADOW, shadow, (-shadow.width / 2) - (scale * (49 + x)), (-shadow.height / 2) + ((15 + y) * scale));
        if (this.right === SPRITE.BOOK) {
          var _img = sprite[this.right][this.book][world.time];
          draw_image_transition_hd_2(this.right, this.book, _img, (-_img.width / 4) - (scale * (62 + x)), (-_img.height / 4) + (scale * (y + 18)));
        } else
          draw_player_right_stuff(this.right, x, y);
        if (spriteid >= SPRITE.GLOVES_DIAMOND_PROTECTION)
          draw_image_transition_hd(spriteid, img, (-img.width / 4) - (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else if (spriteid !== SPRITE.GLOVES_HOOD) {
          draw_image_transition_hd_2(spriteid, this.skin, img, (-img.width / 4) - (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        } else
          draw_image_transition(spriteid, img, (-img.width / 2) - (scale * (49 + x)), (-img.height / 2) + ((11 + y) * scale));
        ctx.restore();
        ctx.save();
        ctx.rotate(left);
        draw_image_transition(SPRITE.HAND_SHADOW, shadow, (-shadow.width / 2) + (scale * (49 + x)), (-shadow.height / 2) + ((15 + y) * scale));
        if (spriteid >= SPRITE.GLOVES_DIAMOND_PROTECTION)
          draw_image_transition_hd(spriteid, img, (-img.width / 4) + (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else if (spriteid !== SPRITE.GLOVES_HOOD)
          draw_image_transition_hd_2(spriteid, this.skin, img, (-img.width / 4) + (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else
          draw_image_transition(spriteid, img, (-img.width / 2) + (scale * (49 + x)), (-img.height / 2) + ((11 + y) * scale));
        ctx.restore();
      }
    }
  } else {
    if (this.superzombie) {
      draw_image_transition(spriteid, img, (-img.width / 2) - (scale * (66 + x)), (-img.height / 2) + ((5 + y) * scale));
      draw_image_transition(spriteid, img, (-img.width / 2) + (scale * (66 + x)), (-img.height / 2) + ((5 + y) * scale));
    } else {
      if (isShield === 0) {
        draw_image_transition(SPRITE.HAND_SHADOW, shadow, (-shadow.width / 2) - (scale * (49 + x)), (-shadow.height / 2) + ((15 + y) * scale));
        if (this.right === SPRITE.BOOK) {
          var _img = sprite[this.right][this.book][world.time];
          draw_image_transition_hd_2(this.right, this.book, _img, (-_img.width / 4) - (scale * (62 + x)), (-_img.height / 4) + (scale * (y + 18)));
        } else
          draw_player_right_stuff(this.right, x, y);
        if (spriteid >= SPRITE.GLOVES_DIAMOND_PROTECTION)
          draw_image_transition_hd(spriteid, img, (-img.width / 4) - (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else if (spriteid !== SPRITE.GLOVES_HOOD)
          draw_image_transition_hd_2(spriteid, this.skin, img, (-img.width / 4) - (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else
          draw_image_transition(spriteid, img, (-img.width / 2) - (scale * (49 + x)), (-img.height / 2) + ((11 + y) * scale));
        draw_image_transition(SPRITE.HAND_SHADOW, shadow, (-shadow.width / 2) + (scale * (49 + x)), (-shadow.height / 2) + ((15 + y) * scale));
        if (spriteid >= SPRITE.GLOVES_DIAMOND_PROTECTION)
          draw_image_transition_hd(spriteid, img, (-img.width / 4) + (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else if (spriteid !== SPRITE.GLOVES_HOOD)
          draw_image_transition_hd_2(spriteid, this.skin, img, (-img.width / 4) + (scale * (49 + x)), (-img.height / 4) + ((11 + y) * scale));
        else
          draw_image_transition(spriteid, img, (-img.width / 2) + (scale * (49 + x)), (-img.height / 2) + ((11 + y) * scale));
      }
    }
  }
  if (this.bag && (this.clothe < 1)) {
    var img = sprite[SPRITE.BAG][this.baglook][world.time];
    draw_image_transition_hd_2(SPRITE.BAG, this.baglook, img, -img.width / 4, (-img.height / 4) - (39 * scale));
  }
  if (this.superzombie) {
    var img = sprite[SPRITE.ZOMBIE_BODY][world.time];
    draw_image_transition(SPRITE.ZOMBIE_BODY, img, -img.width / 2, -img.height / 2);
    this.move_head.update();
    img = sprite[SPRITE.ZOMBIE_HEAD][world.time];
    draw_image_transition(SPRITE.ZOMBIE_HEAD, img, -img.width / 2, (-img.height / 2) + this.move_head.v);
  } else {
    var img = sprite[SPRITE.BODY][this.skin][world.time];
    if (this.clothe !== SPRITE.WINTER_HOOD) {
      draw_image_transition_hd_2(SPRITE.BODY, this.skin, img, -img.width / 4, -img.height / 4);
      if (this.accessory > 0) {
        var img = sprite[SPRITE.ACCESSORY][this.accessory][world.time];
        draw_image_transition_hd_2(SPRITE.ACCESSORY, this.accessory, img, -img.width / 4, -img.height / 4);
      }
    }
  }
  if (this.action & STATE.HEAL) {
    if (this.heal.update() && (this.heal.o == false))
      this.action -= STATE.HEAL;

    ctx.globalAlpha = 0.6 - this.heal.v;
    if (this.superzombie) {
      var img = sprite[SPRITE.ZOMBIE_HEAL];
      ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
    } else {
      var img = get_image_effect(this.skin, sprite[SPRITE.BODY][this.skin][0], __EFFECT_HEAL__);
      ctxDrawImage(ctx, img, img.width / 4, img.height / 4, -img.width / 2, -img.height / 2);
    }
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.WEB) {
    if (this.web.update() && (this.web.o == false))
      this.action -= STATE.WEB;

    ctx.globalAlpha = 0.6 - this.web.v;
    var img = sprite[SPRITE.WEB];
    ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.HURT) {
    if (this.hit.update() && (this.hit.o == false))
      this.action -= STATE.HURT;

    ctx.globalAlpha = 0.6 - this.hit.v;
    if (this.superzombie) {
      var img = sprite[SPRITE.ZOMBIE_HURT];
      ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
    } else {
      var img = get_image_effect(this.skin, sprite[SPRITE.BODY][this.skin][0], __EFFECT_HURT__);
      ctxDrawImage(ctx, img, img.width / 4, img.height / 4, -img.width / 2, -img.height / 2);
    }
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.COLD) {
    if (this.freeze.update() && (this.freeze.o == false))
      this.action -= STATE.COLD;

    ctx.globalAlpha = 0.6 - this.freeze.v;
    var img = get_image_effect(this.skin, sprite[SPRITE.BODY][this.skin][0], __EFFECT_COLD__);
    ctxDrawImage(ctx, img, img.width / 4, img.height / 4, -img.width / 2, -img.height / 2);
    ctx.globalAlpha = 1;
  }
  if (this.action & STATE.HUNGER) {
    if (this.starve.update() && (this.starve.o == false))
      this.action -= STATE.HUNGER;

    ctx.globalAlpha = 0.6 - this.starve.v;
    if (this.superzombie) {
      var img = sprite[SPRITE.ZOMBIE_HUNGER];
      ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
    } else {
      var img = get_image_effect(this.skin, sprite[SPRITE.BODY][this.skin][0], __EFFECT_HUNGER__);
      ctxDrawImage(ctx, img, img.width / 4, img.height / 4, -img.width / 2, -img.height / 2);
    }
    ctx.globalAlpha = 1;
  }
  draw_player_clothe(this.clothe);
  if (isShield === 1) {
    if (this.action & STATE.ATTACK)
      x += this.attack.v * 15;

    draw_image_transition(SPRITE.HAND_SHADOW, shadow, (-shadow.width / 2) - (scale * 26), (-shadow.height / 2) + (((31 + y) + x) * scale));
    if (handid >= SPRITE.GLOVES_DIAMOND_PROTECTION)
      draw_image_transition_hd(handid, hand, (-hand.width / 4) - (scale * 26), (-hand.height / 4) + (((27 + y) + x) * scale));
    else if (handid !== SPRITE.GLOVES_HOOD)
      draw_image_transition_hd_2(handid, this.skin, hand, (-hand.width / 4) - (scale * 26), (-hand.height / 4) + (((27 + y) + x) * scale));
    else
      draw_image_transition(handid, hand, (-hand.width / 2) - (scale * 26), (-hand.height / 2) + (((27 + y) + x) * scale));
    draw_image_transition(SPRITE.HAND_SHADOW, shadow, (-shadow.width / 2) + (scale * 26), (-shadow.height / 2) + (((31 + y) + x) * scale));
    if (handid >= SPRITE.GLOVES_DIAMOND_PROTECTION)
      draw_image_transition_hd(handid, hand, (-hand.width / 4) + (scale * 26), (-hand.height / 4) + (((27 + y) + x) * scale));
    else if (handid !== SPRITE.GLOVES_HOOD)
      draw_image_transition_hd_2(handid, this.skin, hand, (-hand.width / 4) + (scale * 26), (-hand.height / 4) + (((27 + y) + x) * scale));
    else
      draw_image_transition(handid, hand, (-hand.width / 2) + (scale * 26), (-hand.height / 2) + (((27 + y) + x) * scale));
    draw_player_right_stuff_after(this.right, 0, y + x);
  }
  ctx.restore();
  if ((this.clothe !== SPRITE.HOOD) && (this.clothe !== SPRITE.WINTER_HOOD)) {
    if (this.dist_winter > 0) {
      if (!this.player.label_winter)
        this.player.label_winter = create_text(scale, this.player.nickname, 20, "#187484", "#000", 2, null, null, 300 * scale);

      var img = this.player.label_winter;
    } else {
      if (!this.player.label)
        this.player.label = create_text(scale, this.player.nickname, 20, "#FFF", "#000", 2, null, null, 300 * scale);

      var img = this.player.label;
    }
    if (world.day == SPRITE.NIGHT)
      ctx.globalAlpha = 0.5;

    var x = Math.floor(-img.width / 2);
    var y = Math.floor((-img.height / 2) - (70 * scale));
    ctxDrawImage(ctx, img, x, y);
    if (this.player.level > 0) {
      var x2 = (x + img.width) + 5;
      img = sprite[SPRITE.VERIFIED];
      if (PLAYER_LEVEL[this.player.level] === undefined)
        PLAYER_LEVEL[this.player.level] = create_text(scale, ("[" + this.player.level) + "]", 20, "#F9E8A2", "#000", 2, null, null, 50 * scale);

      ctxDrawImage(ctx, PLAYER_LEVEL[this.player.level], x2, y);
    }
    ctx.globalAlpha = 1;
  } else {
    var y = Math.floor(-70 * scale);
    var x = Math.floor(sprite[SPRITE.ICON_MEMBER].width / 1.5);
  }
  if (user.in_team(this.pid)) {
    if (this.pid == user.team[0])
      var img = sprite[SPRITE.ICON_LEADER];
    else
      var img = sprite[SPRITE.ICON_MEMBER];
    ctxDrawImage(ctx, img, (x - img.width) - 5, y - 6);
  }
  ctx.restore();
};

export function draw_alert_ghost() {
  if (this.enabled && (this.delay >= 0)) {
    var real = (new Date).getTime();
    var time = real - this.delay;
    var alpha = (time % 1000) / 1000;
    if (alpha > 0.5) {
      alpha = 1 - ((alpha - 0.5) * 2);
    } else
      alpha *= 2;
    time = Math.floor(time / 1000);
    if (time < WORLD.GHOST_DELAY) {
      time = WORLD.GHOST_DELAY - time;
      if (!this.label) {
        this.label = create_text(scale, " seconds before you die", 40, "#660000", null, null, null, null, null, "#000", 10);
      }
      if ((this.now != time) || !this.sec) {
        this.now = time;
        this.sec = create_text(scale, "" + time, 40, "#660000", null, null, null, null, null, "#000", 10);
      }
      ctxDrawImage(ctx, this.label, (canw - this.label.width) / 2, 100 * scale);
      ctx.globalAlpha = alpha;
      ctxDrawImage(ctx, this.sec, (((canw - this.label.width) / 2) - this.sec.width) + (15 * scale), 100 * scale);
      ctx.globalAlpha = 1;
    }
  }
};

export function draw_welcome_message() {
  if (this.message !== undefined) {
    var y = (user.inv.can_select.length > 0) ? -95 : 0;
    ctxDrawImage(ctx, this.message, 0, (canh - this.message.height) + y);
  }
};;

export function draw_alert(color, stroke) {
  if (this.text) {
    if (!this.timeout.o)
      ctx.globalAlpha = 1;
    else
      ctx.globalAlpha = 1 - this.timeout.v;
    if (!this.label)
      this.label = create_text(scale, this.text, 40, color, null, null, null, null, null, stroke, 10);

    ctxDrawImage(ctx, this.label, (canw - this.label.width) / 2, 50 * scale);
    ctx.globalAlpha = 1;
    if (this.timeout.update() && (this.timeout.o == false)) {
      this.text = this.list.shift();
      this.label = null;
    }
  }
};

export function draw_chat() {
  ctx.save();
  ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
  if (this.text.length > 0) {
    for (var i = 0;
      (i < this.text.length) && (i < 2); i++) {
      if (!this.label[i]) {
        this.label[i] = create_message(scale, this.text[i]);
        this.text_effect[i] = 0;
        this.text_move[i] = 0;
      }
      if (i === 1)
        this.text_move[0] = ease_in_out_quad(this.text_ease) * 30;

    }
    this.text_effect[0] += delta;
    if (this.text.length > 1) {
      this.text_ease = Math.min(this.text_ease + delta, 1);
      if ((this.text_effect[0] > 1) && (this.text_ease > 0.5))
        this.text_effect[1] += delta;

    }
    for (var i = 0;
      (i < this.text.length) && (i < 2); i++) {
      var effect = this.text_effect[i];
      if (effect > 0) {
        if (effect < 0.25)
          ctx.globalAlpha = effect * 4;
        else if (effect > 3.75)
          ctx.globalAlpha = Math.max((4 - effect) * 4, 0);
        else
          ctx.globalAlpha = 1;
        ctxDrawImage(ctx, this.label[i], -this.label[i].width / 2, (-this.text_move[i] + (-this.label[i].height / 2)) - (110 * scale));
      }
    }
    if (this.text_effect[0] > 4) {
      this.text_effect.shift();
      this.text.shift();
      this.text_move.shift();
      this.label.shift();
      this.text_ease = 0;
    }
  }
  ctx.restore();
};
var __effect = 0;

export function draw_objects_effect(is, ie, js, je, id, t, max, min) {
  if (min === undefined)
    min = 0;

  for (var k = max; k >= min; k--) {
    for (var i = is; i <= ie; i++) {
      for (var j = js; j <= je; j++) {
        var tile = MAP.tiles[i][j];
        if (!tile || !tile[t])
          continue;

        var o = tile[t][k];
        if (o === undefined)
          continue;

        for (var l = 0; l < o.length; l++) {
          var object = o[l];
          var img = sprite[id][world.time][k];
          var _effect = (__effect + ((i + j) * 3)) % 60;
          var effect = (_effect < 30) ? (_effect / 30) : (1 - ((_effect - 30) / 30));
          var w = -img.width * (1 + ((0.9 * effect) / 30));
          var h = -img.height * (1 + ((0.9 * effect) / 30));
          _effect = (__effect + ((i + j) * 7)) % 60;
          effect = (_effect < 30) ? (_effect / 30) : (1 - ((_effect - 30) / 30));
          var _alpha = ctx.globalAlpha;
          ctx.globalAlpha = (0.9 + (effect * 0.1)) * _alpha;
          ctxDrawImage(ctx, img, (user.cam.x + object.x) - (w / 2), (user.cam.y + object.y) - (h / 2), w, h);
          ctx.globalAlpha = _alpha;
        }
      }
    }
  }
};

export function draw_breath_objects(is, ie, js, je, id, t, max, min) {
  if (min === undefined)
    min = 0;

  world.breath[id].update();
  for (var k = max; k >= min; k--) {
    for (var i = is; i <= ie; i++) {
      for (var j = js; j <= je; j++) {
        var tile = MAP.tiles[i][j];
        if (!tile || !tile[t])
          continue;

        var o = tile[t][k];
        if (o === undefined)
          continue;

        for (var l = 0; l < o.length; l++) {
          var object = o[l];
          if (object.update) {
            if (object.hit.update() && (object.hit.o == false)) {
              object.update = false;
            }
            var v = (((1 - object.hit.v) * delta) * 600) * scale;
            var x = Math.cos(object.angle) * v;
            var y = Math.sin(object.angle) * v;
          } else {
            var x = 0;
            var y = 0;
          };
          var img = sprite[id][world.time][k];
          var w = -img.width * world.breath[id].v;
          var h = -img.height * world.breath[id].v;
          ctxDrawImage(ctx, img, ((user.cam.x + object.x) - (w / 2)) + x, ((user.cam.y + object.y) - (h / 2)) + y, w, h);
        }
      }
    }
  }
};
var randweb = [];
for (var i = 0; i < 100; i++) {
  var r = 1;
  if (Math.random() < 0.25)
    r = 0;

  randweb.push(r);
}
_scale_object = 1;

export function draw_map_objects(is, ie, js, je, id, t, max, min, rand) {
  if (min === undefined)
    min = 0;

  for (var k = max; k >= min; k--) {
    for (var i = is; i <= ie; i++) {
      for (var j = js; j <= je; j++) {
        if ((rand > 0) && (randweb[(i + (j * rand)) % randweb.length] === 1))
          continue;

        var tile = MAP.tiles[i][j];
        if ((tile === undefined) || (tile[t] === undefined))
          continue;

        var o = tile[t][k];
        if (o === undefined)
          continue;

        for (var l = 0; l < o.length; l++) {
          var object = o[l];
          if (object.update) {
            if (object.hit.update() && (object.hit.o == false)) {
              object.update = false;
            }
            var v = (((1 - object.hit.v) * delta) * 600) * scale;
            var x = Math.cos(object.angle) * v;
            var y = Math.sin(object.angle) * v;
          } else {
            var x = 0;
            var y = 0;
          };
          var img = sprite[id][world.time][k];
          ctxDrawImage(ctx, img, ((user.cam.x + object.x) - (img.width / (2 * _scale_object))) + x, ((user.cam.y + object.y) - (img.height / (2 * _scale_object))) + y, img.width / _scale_object, img.height / _scale_object);
        }
      }
    }
  }
};

export function draw_map_decorations(is, ie, js, je, id, t, max, min, rand) {
  if (min === undefined)
    min = 0;

  for (var i = is; i <= ie; i++) {
    for (var j = js; j <= je; j++) {
      var tile = MAP.tiles[i][j];
      if ((tile === undefined) || (tile[t] === undefined))
        continue;

      var o = tile[t];
      if (o === undefined)
        continue;

      if (o.scale === 1) {
        var img = sprite[id][world.time][o._id];
        ctx.save();
        ctx.translate(user.cam.x + o.x, user.cam.y + o.y);
        ctx.rotate(o.angle);
        ctxDrawImage(ctx, img, -img.width / 4, -img.height / 4, img.width / 2, img.height / 2);
        ctx.restore();
      } else if (o.scale === 3) {
        for (var k = 0; k < o.p.length; k++) {
          ctx.save();
          ctx.translate(user.cam.x + o.x, user.cam.y + o.y);
          ctx.rotate(o.p[k].angle);
          var img = sprite[id][world.time][o.p[k]._id];
          ctxDrawImage(ctx, img, (-img.width / 3) + o.p[k].x, (-img.height / 3) + o.p[k].y, img.width / 1.5, img.height / 1.5);
          ctx.restore();
        }
      } else {
        var img = sprite[id][world.time][o._id];
        ctx.save();
        ctx.translate(user.cam.x + o.x, user.cam.y + o.y);
        ctx.rotate(o.angle);
        ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();
      }
    }
  }
};

export function draw_lava_effect(is, ie, js, je, id, t, max, min, rand) {
  if (min === undefined)
    min = 0;

  for (var k = max; k >= min; k--) {
    for (var i = is; i <= ie; i++) {
      for (var j = js; j <= je; j++) {
        var tile = MAP.tiles[i][j];
        if ((tile === undefined) || (tile[t] === undefined))
          continue;

        var o = tile[t][k];
        if (o === undefined)
          continue;

        for (var l = 0; l < o.length; l++) {
          var object = o[l];
          if (object.update) {
            if (object.hit.update() && (object.hit.o == false)) {
              object.update = false;
            }
            var v = (((1 - object.hit.v) * delta) * 600) * scale;
            var x = Math.cos(object.angle) * v;
            var y = Math.sin(object.angle) * v;
          } else {
            var x = 0;
            var y = 0;
          };
          for (var _k = 0; _k < _bubble[k].amount; _k++) {
            if (world.lava[_k].last !== old_timestamp) {
              world.lava[_k].update();
              world.lava[_k].last = old_timestamp;
            }
            var img = sprite[SPRITE.LAVA_BUBBLE][world.time][_bubble[k].pos[_k].t];
            var w = -img.width * world.lava[_k].v;
            var h = -img.height * world.lava[_k].v;
            ctxDrawImage(ctx, img, (((user.cam.x + object.x) - (w / 4)) + x) + _bubble[k].pos[_k].x, (((user.cam.y + object.y) - (h / 4)) + y) + _bubble[k].pos[_k].y, w / 2, h / 2);
          }
        }
      }
    }
  }
};
_bubble = [{
  amount: 10,
  pos: [{
    x: -128,
    y: -20,
    t: 0
  }, {
    x: -86,
    y: -4,
    t: 1
  }, {
    x: -60,
    y: -74,
    t: 2
  }, {
    x: -22,
    y: -144,
    t: 0
  }, {
    x: -58,
    y: 86,
    t: 0
  }, {
    x: 3,
    y: -30,
    t: 0
  }, {
    x: 65,
    y: -115,
    t: 1
  }, {
    x: 118,
    y: -50,
    t: 0
  }, {
    x: 73,
    y: 15,
    t: 1
  }, {
    x: 67,
    y: 79,
    t: 0
  }]
}, {
  amount: 5,
  pos: [{
    x: -45,
    y: -26,
    t: 0
  }, {
    x: -45,
    y: 20,
    t: 2
  }, {
    x: 10,
    y: -60,
    t: 1
  }, {
    x: 52,
    y: -17,
    t: 1
  }, {
    x: 14,
    y: 45,
    t: 0
  }]
}, {
  amount: 3,
  pos: [{
    x: -30,
    y: 3,
    t: 2
  }, {
    x: 7,
    y: -38,
    t: 2
  }, {
    x: 37,
    y: 5,
    t: 2
  }]
}, {
  amount: 11,
  pos: [{
    x: -74,
    y: -87,
    t: 2
  }, {
    x: -11,
    y: -10,
    t: 1
  }, {
    x: -99,
    y: 17,
    t: 1
  }, {
    x: -66,
    y: 84,
    t: 0
  }, {
    x: -55,
    y: 123,
    t: 1
  }, {
    x: 10,
    y: 81,
    t: 2
  }, {
    x: 52,
    y: 50,
    t: 0
  }, {
    x: 138,
    y: 9,
    t: 1
  }, {
    x: 104,
    y: -28,
    t: 0
  }, {
    x: 67,
    y: -56,
    t: 2
  }, {
    x: 5,
    y: -112,
    t: 0
  }]
}, {
  amount: 6,
  pos: [{
    x: -33,
    y: -66,
    t: 2
  }, {
    x: -58,
    y: 10,
    t: 0
  }, {
    x: -19,
    y: 44,
    t: 1
  }, {
    x: 44,
    y: 20,
    t: 0
  }, {
    x: 53,
    y: -36,
    t: 2
  }, {
    x: 7,
    y: -62,
    t: 0
  }]
}, {
  amount: 3,
  pos: [{
    x: -19,
    y: -25,
    t: 1
  }, {
    x: -29,
    y: 13,
    t: 2
  }, {
    x: 12,
    y: 12,
    t: 0
  }]
}];
var _js = 0;
var _je = 0;
var _is = 0;
var _ie = 0;

export function draw_world() {
  var js = _js;
  var je = _je;
  var is = _is;
  var ie = _ie;
  if (ui.quality)
    draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.LAKE_EDGE, "l", 2);

  if (ui.quality)
    draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.LAVA_GROUND, "la", 5);

  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.MAGMA, "la", 5);
  draw_map_transition(draw_breath_objects, is, ie, js, je, SPRITE.LAKE, "l", 2);
  if (ui.quality) {
    draw_map_transition(draw_lava_effect, is, ie, js, je, SPRITE.MAGMA, "la", 5);
    draw_map_transition(draw_breath_objects, is, ie, js, je, SPRITE.LAKE_DEEP, "l", 2);
  }
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.MARKER, "ma", 3);
  var sand_worm = world.units[ITEMS.SAND_WORM];
  for (var i = 0; i < sand_worm.length; i++)
    sand_worm[i].draw_ground();
  var players = world.units[ITEMS.PLAYERS];
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    for (var j = 0; j < p.swim.length; j++)
      draw_swim(p.swim[j]);
  }
  var bridge = world.units[ITEMS.BRIDGE];
  for (var i = 0; i < bridge.length; i++) {
    draw_transition(bridge[i], SPRITE.BRIDGE);
    bridge[i].draw_life(bridge[i].info);
  }
  var furnace = world.units[ITEMS.FURNACE];
  for (var i = 0; i < furnace.length; i++) {
    if (furnace[i].action == 2)
      draw_bg_transition(furnace[i]);

  }
  var fire = world.units[ITEMS.FIRE];
  for (var i = 0; i < fire.length; i++)
    draw_bg_transition(fire[i], SPRITE.WOOD_FIRE);
  var resurrection = world.units[ITEMS.RESURRECTION];
  for (var i = 0; i < resurrection.length; i++)
    draw_bg_transition(resurrection[i]);
  var emerald_machine = world.units[ITEMS.EMERALD_MACHINE];
  for (var i = 0; i < emerald_machine.length; i++)
    draw_bg_transition(emerald_machine[i]);
  var big_fire = world.units[ITEMS.BIG_FIRE];
  for (var i = 0; i < big_fire.length; i++)
    draw_bg_transition(big_fire[i], SPRITE.BIG_FIRE_WOOD);
  var sign = world.units[ITEMS.SIGN];
  for (var i = 0; i < sign.length; i++)
    draw_transition(sign[i]);
  var plot = world.units[ITEMS.PLOT];
  for (var i = 0; i < plot.length; i++)
    draw_transition(plot[i], SPRITE.PLOT);
  var seed = world.units[ITEMS.SEED];
  for (var i = 0; i < seed.length; i++)
    draw_bg_transition(seed[i]);
  var seed = world.units[ITEMS.TOMATO_SEED];
  for (var i = 0; i < seed.length; i++)
    draw_bg_transition(seed[i]);
  var seed = world.units[ITEMS.SEED];
  for (var i = 0; i < seed.length; i++)
    draw_fg_transition(seed[i]);
  var carrot = world.units[ITEMS.CARROT_SEED];
  for (var i = 0; i < carrot.length; i++)
    if (((carrot[i].info & 15) === 0) || (carrot[i].info === 10))
      draw_transition(carrot[i]);

  var watermelon = world.units[ITEMS.WATERMELON_SEED];
  for (var i = 0; i < watermelon.length; i++)
    if (((watermelon[i].info & 15) === 0) || (watermelon[i].info === 10))
      draw_transition(watermelon[i]);

  var aloe_vera = world.units[ITEMS.ALOE_VERA_SEED];
  for (var i = 0; i < aloe_vera.length; i++)
    if (((aloe_vera[i].info & 15) === 0) || (aloe_vera[i].info === 10))
      draw_transition(aloe_vera[i]);

  var wheat = world.units[ITEMS.WHEAT_MOB];
  for (var i = 0; i < wheat.length; i++)
    draw_transition(wheat[i], SPRITE.WHEAT_SEED);
  var garlic = world.units[ITEMS.GARLIC_SEED];
  for (var i = 0; i < garlic.length; i++)
    if (((garlic[i].info & 15) === 0) || (garlic[i].info === 10))
      draw_transition(garlic[i]);

  var thornbush = world.units[ITEMS.THORNBUSH_SEED];
  for (var i = 0; i < thornbush.length; i++)
    if (((thornbush[i].info & 15) === 0) || (thornbush[i].info === 10))
      draw_transition(thornbush[i]);

  var pumpkin = world.units[ITEMS.PUMPKIN_SEED];
  for (var i = 0; i < pumpkin.length; i++)
    if (((pumpkin[i].info & 15) === 0) || (pumpkin[i].info === 10))
      draw_transition(pumpkin[i]);

  var wheat = world.units[ITEMS.WHEAT_SEED];
  for (var i = 0; i < wheat.length; i++)
    draw_transition(wheat[i]);
  var crate = world.units[ITEMS.CRATE];
  for (var i = 0; i < crate.length; i++)
    draw_transition(crate[i], SPRITE.CRATE, SPRITE.HURT_DEAD_BOX);
  var dead_box = world.units[ITEMS.DEAD_BOX];
  for (var i = 0; i < dead_box.length; i++)
    draw_transition(dead_box[i], SPRITE.CRATE, SPRITE.HURT_DEAD_BOX);
  var gift = world.units[ITEMS.GIFT];
  for (var i = 0; i < gift.length; i++)
    draw_transition(gift[i], SPRITE.GIFT, SPRITE.HURT_GIFT);
  var door = world.units[ITEMS.WOOD_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info & 1)
      draw_transition(door[i], SPRITE.DOOR_WOOD_OPEN);

  }
  var door = world.units[ITEMS.STONE_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info & 1)
      draw_transition(door[i], SPRITE.DOOR_STONE_OPEN);

  }
  var door = world.units[ITEMS.GOLD_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_GOLD_OPEN);

  }
  var door = world.units[ITEMS.DIAMOND_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_DIAMOND_OPEN);

  }
  var door = world.units[ITEMS.AMETHYST_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_AMETHYST_OPEN);

  }
  var door = world.units[ITEMS.REIDITE_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_GOLD_OPEN);

  }
  var door = world.units[ITEMS.WOOD_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info & 1)
      draw_transition(door[i], SPRITE.DOOR_WOOD_OPEN);

  }
  var door = world.units[ITEMS.STONE_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info & 1)
      draw_transition(door[i], SPRITE.DOOR_STONE_OPEN);

  }
  var door = world.units[ITEMS.GOLD_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_GOLD_OPEN);

  }
  var door = world.units[ITEMS.DIAMOND_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_DIAMOND_OPEN);

  }
  var door = world.units[ITEMS.AMETHYST_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_AMETHYST_OPEN);

  }
  var door = world.units[ITEMS.REIDITE_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (door[i].info)
      draw_transition(door[i], SPRITE.DOOR_GOLD_OPEN);

  }
  var rabbit = world.units[ITEMS.RABBIT];
  for (var i = 0; i < rabbit.length; i++)
    draw_transition(rabbit[i], SPRITE.RABBIT, SPRITE.HURT_RABBIT);
  var bed = world.units[ITEMS.BED];
  for (var i = 0; i < bed.length; i++)
    draw_transition(bed[i], SPRITE.BED);
  var sand_worm = world.units[ITEMS.SAND_WORM];
  for (var i = 0; i < sand_worm.length; i++)
    draw_transition(sand_worm[i], SPRITE.SAND_WORM, SPRITE.HURT_SAND_WORM);
  var spell = world.units[ITEMS.SPELL];
  for (var i = 0; i < spell.length; i++) {
    if (spell[i].fly === 0)
      draw_transition(spell[i]);

  }
  var players = world.units[ITEMS.PLAYERS];
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    if (((((players[i].vehicle !== INV.BABY_DRAGON) && (players[i].vehicle !== INV.BABY_LAVA)) && (players[i].vehicle !== INV.HAWK)) && (players[i].vehicle !== INV.PLANE)) && (players[i].vehicle !== INV.NIMBUS)) {
      if (p.tower === 0) {
        if (p.tower_fx > 0.001) {
          p.tower_fx = lerp(p.tower_fx, 0, 0.018);
          var spd = 1 + (0.18 * Math.min(1, Math.max(p.tower_fx, 0) / 100));
          ctx.save();
          ctx.scale(spd, spd);
          user.cam.x /= spd;
          user.cam.y /= spd;
          p.x /= spd;
          p.y /= spd;
          p.r.x /= spd;
          p.r.y /= spd;
          p.draw_vehicle();
          p.draw();
          user.cam.x *= spd;
          user.cam.y *= spd;
          p.x *= spd;
          p.y *= spd;
          p.r.x *= spd;
          p.r.y *= spd;
          ctx.restore();
        } else {
          p.fly = 0;
          p.draw_vehicle();
          p.draw();
        }
      }
    } else if (p.speed <= 180) {
      ctx.save();
      var spd = 1 + (0.35 * Math.min(1, Math.max(p.vehicle_fx5 - 30, 0) / 180));
      ctx.scale(spd, spd);
      user.cam.x /= spd;
      user.cam.y /= spd;
      p.x /= spd;
      p.y /= spd;
      p.r.x /= spd;
      p.r.y /= spd;
      p.fly = 0;
      p.draw_vehicle();
      p.draw();
      user.cam.x *= spd;
      user.cam.y *= spd;
      p.x *= spd;
      p.y *= spd;
      p.r.x *= spd;
      p.r.y *= spd;
      ctx.restore();
    }
  }
  var bed = world.units[ITEMS.BED];
  for (var i = 0; i < bed.length; i++)
    draw_transition(bed[i], SPRITE.BED_TOP);
  var crab = world.units[ITEMS.CRAB];
  for (var i = 0; i < crab.length; i++)
    draw_transition(crab[i]);
  var fox = world.units[ITEMS.FOX];
  for (var i = 0; i < fox.length; i++)
    draw_transition(fox[i], SPRITE.FOX, SPRITE.HURT_FOX);
  var boar = world.units[ITEMS.BOAR];
  for (var i = 0; i < boar.length; i++)
    draw_transition(boar[i]);
  var wolf = world.units[ITEMS.WOLF];
  for (var i = 0; i < wolf.length; i++)
    draw_transition(wolf[i], SPRITE.WOLF, SPRITE.HURT_WOLF);
  var baby_dragon = world.units[ITEMS.BABY_DRAGON];
  for (var i = 0; i < baby_dragon.length; i++)
    draw_transition(baby_dragon[i], SPRITE.BABY_DRAGON, SPRITE.HURT_BABY_DRAGON);
  var baby_lava = world.units[ITEMS.BABY_LAVA];
  for (var i = 0; i < baby_lava.length; i++)
    draw_transition(baby_lava[i], SPRITE.BABY_LAVA, SPRITE.HURT_BABY_LAVA);
  var carrot = world.units[ITEMS.CARROT_SEED];
  for (var i = 0; i < carrot.length; i++)
    if (((carrot[i].info & 15) !== 0) && (carrot[i].info !== 10))
      draw_transition(carrot[i]);

  var watermelon = world.units[ITEMS.WATERMELON_SEED];
  for (var i = 0; i < watermelon.length; i++)
    if (((watermelon[i].info & 15) !== 0) && (watermelon[i].info !== 10))
      draw_transition(watermelon[i]);

  var aloe_vera = world.units[ITEMS.ALOE_VERA_MOB];
  for (var i = 0; i < aloe_vera.length; i++)
    draw_transition(aloe_vera[i], SPRITE.ALOE_VERA);
  var aloe_vera = world.units[ITEMS.ALOE_VERA_SEED];
  for (var i = 0; i < aloe_vera.length; i++)
    if (((aloe_vera[i].info & 15) !== 0) && (aloe_vera[i].info !== 10))
      draw_transition(aloe_vera[i]);

  var seed = world.units[ITEMS.TOMATO_SEED];
  for (var i = 0; i < seed.length; i++)
    draw_fg_transition(seed[i]);
  var garlic = world.units[ITEMS.GARLIC_SEED];
  for (var i = 0; i < garlic.length; i++)
    if (((garlic[i].info & 15) !== 0) && (garlic[i].info !== 10))
      draw_transition(garlic[i]);

  var thornbush = world.units[ITEMS.THORNBUSH_SEED];
  for (var i = 0; i < thornbush.length; i++)
    if (((thornbush[i].info & 15) !== 0) && (thornbush[i].info !== 10))
      draw_transition(thornbush[i]);

  var pumpkin = world.units[ITEMS.PUMPKIN_SEED];
  for (var i = 0; i < pumpkin.length; i++)
    if (((pumpkin[i].info & 15) !== 0) && (pumpkin[i].info !== 10))
      draw_transition(pumpkin[i]);

  var treasure = world.units[ITEMS.TREASURE_CHEST];
  for (var i = 0; i < treasure.length; i++)
    draw_transition(treasure[i], SPRITE.TREASURE_CHEST, SPRITE.HURT_TREASURE_CHEST);
  var kraken = world.units[ITEMS.KRAKEN];
  for (var i = 0; i < kraken.length; i++)
    draw_transition(kraken[i], SPRITE.KRAKEN, SPRITE.HURT_KRAKEN);
  var pira = world.units[ITEMS.PIRANHA];
  for (var i = 0; i < pira.length; i++)
    draw_transition(pira[i], SPRITE.PIRANHA, SPRITE.HURT_PIRANHA);
  var spider = world.units[ITEMS.SPIDER];
  for (var i = 0; i < spider.length; i++)
    draw_transition(spider[i], SPRITE.SPIDER, SPRITE.HURT_SPIDER);
  var penguin = world.units[ITEMS.PENGUIN];
  for (var i = 0; i < penguin.length; i++)
    draw_transition(penguin[i], SPRITE.PENGUIN, SPRITE.HURT_PENGUIN);
  var bear = world.units[ITEMS.BEAR];
  for (var i = 0; i < bear.length; i++)
    draw_transition(bear[i], SPRITE.BEAR, SPRITE.HURT_BEAR);
  var baby_mammoth = world.units[ITEMS.BABY_MAMMOTH];
  for (var i = 0; i < baby_mammoth.length; i++)
    draw_transition(baby_mammoth[i]);
  var flame = world.units[ITEMS.FLAME];
  for (var i = 0; i < flame.length; i++)
    draw_transition(flame[i], SPRITE.FIRE_MOB, SPRITE.HURT_FIRE_MOB);
  var crab_boss = world.units[ITEMS.CRAB_BOSS];
  for (var i = 0; i < crab_boss.length; i++)
    draw_transition(crab_boss[i]);
  var mammoth = world.units[ITEMS.MAMMOTH];
  for (var i = 0; i < mammoth.length; i++)
    draw_transition(mammoth[i], SPRITE.MAMMOTH, SPRITE.HURT_MAMMOTH);
  var dragon = world.units[ITEMS.DRAGON];
  for (var i = 0; i < dragon.length; i++) {
    if (dragon[i].scale === 1)
      draw_transition(dragon[i], SPRITE.DRAGON, SPRITE.HURT_DRAGON);

  }
  var dragon = world.units[ITEMS.LAVA_DRAGON];
  for (var i = 0; i < dragon.length; i++) {
    if (dragon[i].scale === 1)
      draw_transition(dragon[i], SPRITE.LAVA_DRAGON, SPRITE.HURT_LAVA_DRAGON);

  }
  var chest = world.units[ITEMS.CHEST];
  for (var i = 0; i < chest.length; i++)
    draw_transition(chest[i]);
  var workbench = world.units[ITEMS.WORKBENCH];
  for (var i = 0; i < workbench.length; i++)
    draw_transition(workbench[i], SPRITE.WORKBENCH);
  var furnace = world.units[ITEMS.FURNACE];
  for (var i = 0; i < furnace.length; i++)
    draw_transition(furnace[i]);
  var bread_oven = world.units[ITEMS.BREAD_OVEN];
  for (var i = 0; i < bread_oven.length; i++)
    draw_transition(bread_oven[i]);
  var door = world.units[ITEMS.WOOD_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.DOOR_WOOD_CLOSE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.STONE_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.DOOR_STONE_CLOSE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.GOLD_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.DOOR_GOLD_CLOSE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.DIAMOND_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.DOOR_DIAMOND_CLOSE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.AMETHYST_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.DOOR_AMETHYST_CLOSE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.REIDITE_DOOR];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.REIDITE_DOOR);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.WOOD_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.WOOD_DOOR_SPIKE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.STONE_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.STONE_DOOR_SPIKE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.GOLD_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.GOLD_DOOR_SPIKE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.DIAMOND_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.DIAMOND_DOOR_SPIKE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.AMETHYST_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.AMETHYST_DOOR_SPIKE);

    door[i].draw_life(door[i].info >> 1);
  }
  var door = world.units[ITEMS.REIDITE_DOOR_SPIKE];
  for (var i = 0; i < door.length; i++) {
    if (!(door[i].info & 1))
      draw_transition(door[i], SPRITE.REIDITE_DOOR_SPIKE);

    door[i].draw_life(door[i].info >> 1);
  }
  var wall = world.units[ITEMS.WALL];
  for (var i = 0; i < wall.length; i++) {
    draw_transition(wall[i], SPRITE.WALL);
    wall[i].draw_life(wall[i].info);
  }
  var wall = world.units[ITEMS.STONE_WALL];
  for (var i = 0; i < wall.length; i++) {
    draw_transition(wall[i], SPRITE.STONE_WALL);
    wall[i].draw_life(wall[i].info);
  }
  var wall = world.units[ITEMS.GOLD_WALL];
  for (var i = 0; i < wall.length; i++) {
    draw_transition(wall[i], SPRITE.GOLD_WALL);
    wall[i].draw_life(wall[i].info);
  }
  var wall = world.units[ITEMS.DIAMOND_WALL];
  for (var i = 0; i < wall.length; i++) {
    draw_transition(wall[i], SPRITE.DIAMOND_WALL);
    wall[i].draw_life(wall[i].info);
  }
  var wall = world.units[ITEMS.AMETHYST_WALL];
  for (var i = 0; i < wall.length; i++) {
    draw_transition(wall[i], SPRITE.AMETHYST_WALL);
    wall[i].draw_life(wall[i].info);
  }
  var wall = world.units[ITEMS.REIDITE_WALL];
  for (var i = 0; i < wall.length; i++) {
    draw_transition(wall[i], SPRITE.REIDITE_WALL);
    wall[i].draw_life(wall[i].info);
  }
  var spike = world.units[ITEMS.SPIKE];
  for (var i = 0; i < spike.length; i++) {
    draw_transition(spike[i], SPRITE.SPIKE);
    spike[i].draw_life(spike[i].info);
  }
  var spike = world.units[ITEMS.STONE_SPIKE];
  for (var i = 0; i < spike.length; i++) {
    draw_transition(spike[i], SPRITE.STONE_SPIKE);
    spike[i].draw_life(spike[i].info);
  }
  var spike = world.units[ITEMS.GOLD_SPIKE];
  for (var i = 0; i < spike.length; i++) {
    draw_transition(spike[i], SPRITE.GOLD_SPIKE);
    spike[i].draw_life(spike[i].info);
  }
  var spike = world.units[ITEMS.DIAMOND_SPIKE];
  for (var i = 0; i < spike.length; i++) {
    draw_transition(spike[i], SPRITE.DIAMOND_SPIKE);
    spike[i].draw_life(spike[i].info);
  }
  var spike = world.units[ITEMS.AMETHYST_SPIKE];
  for (var i = 0; i < spike.length; i++) {
    draw_transition(spike[i], SPRITE.AMETHYST_SPIKE);
    spike[i].draw_life(spike[i].info);
  }
  var spike = world.units[ITEMS.REIDITE_SPIKE];
  for (var i = 0; i < spike.length; i++) {
    draw_transition(spike[i], SPRITE.REIDITE_SPIKE);
    spike[i].draw_life(spike[i].info);
  }
  var well = world.units[ITEMS.WELL];
  for (var i = 0; i < well.length; i++) {
    var w = well[i];
    if (w.info > 0)
      draw_transition(w, SPRITE.WELL_FULL);
    else
      draw_transition(w, SPRITE.WELL_EMPTY);
  }
  var totem = world.units[ITEMS.TOTEM];
  for (var i = 0; i < totem.length; i++)
    draw_transition(totem[i], SPRITE.TOTEM);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.GOLD, "g", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.GOLD_WINTER, "gw", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.DIAMOND, "d", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.DIAMOND_WINTER, "dw", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.PLANT, "p", 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.EMERALD, "m", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.AMETHYST, "a", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.REIDITE, "re", 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.SHADOW_CAVE_STONES, "cs", 3, 3);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.SHADOW_CAVE_STONES, "cs", 2, 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.SHADOW_CAVE_STONES, "cs", 1, 1);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.SHADOW_CAVE_STONES, "cs", 0, 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.CAVE_STONES, "cs", 3, 3);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.CAVE_STONES, "cs", 2, 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.CAVE_STONES, "cs", 1, 1);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.CAVE_STONES, "cs", 0, 0);
  var fruits = world.units[ITEMS.FRUIT];
  for (var i = 0; i < fruits.length; i++) {
    for (var j = 0; j < fruits[i].info; j++)
      draw_transition(fruits[i].fruits[j], SPRITE.FRUIT);
  }
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.STONES, "s", 2);
  var extractor = world.units[ITEMS.EXTRACTOR_MACHINE_STONE];
  for (var i = 0; i < extractor.length; i++)
    draw_transition(extractor[i]);
  var extractor = world.units[ITEMS.EXTRACTOR_MACHINE_GOLD];
  for (var i = 0; i < extractor.length; i++)
    draw_transition(extractor[i]);
  var extractor = world.units[ITEMS.EXTRACTOR_MACHINE_DIAMOND];
  for (var i = 0; i < extractor.length; i++)
    draw_transition(extractor[i]);
  var extractor = world.units[ITEMS.EXTRACTOR_MACHINE_AMETHYST];
  for (var i = 0; i < extractor.length; i++)
    draw_transition(extractor[i]);
  var extractor = world.units[ITEMS.EXTRACTOR_MACHINE_REIDITE];
  for (var i = 0; i < extractor.length; i++)
    draw_transition(extractor[i]);
  var windmill = world.units[ITEMS.WINDMILL];
  for (var i = 0; i < windmill.length; i++)
    draw_bg_transition(windmill[i]);
  var fire = world.units[ITEMS.FIRE];
  for (var i = 0; i < fire.length; i++)
    draw_fg_transition(fire[i]);
  var fire = world.units[ITEMS.BIG_FIRE];
  for (var i = 0; i < fire.length; i++)
    draw_fg_transition(fire[i]);
  var furnace = world.units[ITEMS.FURNACE];
  for (var i = 0; i < furnace.length; i++) {
    if (furnace[i].action == 2)
      draw_fg_transition(furnace[i]);

  }
  var bread_oven = world.units[ITEMS.BREAD_OVEN];
  for (var i = 0; i < bread_oven.length; i++) {
    draw_fg_transition(bread_oven[i]);
  }
  var resurrection = world.units[ITEMS.RESURRECTION];
  for (var i = 0; i < resurrection.length; i++)
    draw_fg_transition(resurrection[i]);
  var emerald_machine = world.units[ITEMS.EMERALD_MACHINE];
  for (var i = 0; i < emerald_machine.length; i++) {
    draw_fg_transition(emerald_machine[i]);
    emerald_machine[i].draw_life(emerald_machine[i].info);
  }
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.CACTUS, "c", 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.TREE, "t", 5, 4);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.FIR, "f", 2, 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.PALM, "plm", 0, 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.TREE_BRANCH, "b", 3, 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.TREE, "t", 3, 2);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.TREE_BRANCH, "b", 1, 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.FIR, "f", 1, 1);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.PALM, "plm", 1, 1);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.TREE, "t", 1, 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.FIR, "f", 0, 0);
  draw_map_transition(draw_map_objects, is, ie, js, je, SPRITE.PALM, "plm", 2, 2);
  var windmill = world.units[ITEMS.WINDMILL];
  for (var i = 0; i < windmill.length; i++)
    draw_fg_transition(windmill[i]);
  var tower = world.units[ITEMS.WOOD_TOWER];
  for (var i = 0; i < tower.length; i++)
    draw_transition(tower[i], SPRITE.WOOD_TOWER);
  var players = world.units[ITEMS.PLAYERS];
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    if ((p.tower === 1) && ((p.speed < 180) || (((((p.vehicle !== INV.BABY_DRAGON) && (p.vehicle !== INV.BABY_LAVA)) && (p.vehicle !== INV.NIMBUS)) && (p.vehicle !== INV.HAWK)) && (p.vehicle !== INV.PLANE)))) {
      p.tower_fx = lerp(p.tower_fx, 100, 0.018);
      var spd = 1 + (0.18 * Math.min(1, Math.max(p.tower_fx, 0) / 100));
      ctx.save();
      ctx.scale(spd, spd);
      user.cam.x /= spd;
      user.cam.y /= spd;
      p.x /= spd;
      p.y /= spd;
      p.r.x /= spd;
      p.r.y /= spd;
      p.draw_vehicle();
      p.draw();
      user.cam.x *= spd;
      user.cam.y *= spd;
      p.x *= spd;
      p.y *= spd;
      p.r.x *= spd;
      p.r.y *= spd;
      ctx.restore();
    }
  }
  var roof = world.units[ITEMS.ROOF];
  for (var i = 0; i < roof.length; i++) {
    draw_transition(roof[i], SPRITE.ROOF);
    roof[i].draw_life(roof[i].info);
  }
  var firefly = world.units[ITEMS.FIREFLY];
  for (var i = 0; i < firefly.length; i++)
    draw_transition(firefly[i], SPRITE.FIREFLY, SPRITE.HURT_FIREFLY);
  var garland = world.units[ITEMS.GARLAND];
  for (var i = 0; i < garland.length; i++)
    draw_transition(garland[i], SPRITE.GARLAND);
  var players = world.units[ITEMS.PLAYERS];
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    if ((((((p.vehicle === INV.BABY_DRAGON) || (p.vehicle === INV.BABY_LAVA)) || (p.vehicle === INV.NIMBUS)) || (p.vehicle === INV.HAWK)) || (p.vehicle === INV.PLANE)) && (p.speed > 180)) {
      p.fly = 1;
      ctx.save();
      var spd = 1 + (0.35 * Math.min(1, Math.max(p.vehicle_fx5 - 30, 0) / 180));
      ctx.scale(spd, spd);
      user.cam.x /= spd;
      user.cam.y /= spd;
      p.x /= spd;
      p.y /= spd;
      p.r.x /= spd;
      p.r.y /= spd;
      p.draw_vehicle();
      p.draw();
      user.cam.x *= spd;
      user.cam.y *= spd;
      p.x *= spd;
      p.y *= spd;
      p.r.x *= spd;
      p.r.y *= spd;
      ctx.restore();
    }
  }
  var spell = world.units[ITEMS.SPELL];
  for (var i = 0; i < spell.length; i++) {
    if (spell[i].fly === 1)
      draw_transition(spell[i]);

  }
  var dragon = world.units[ITEMS.DRAGON];
  for (var i = 0; i < dragon.length; i++) {
    if (dragon[i].scale > 1)
      draw_transition(dragon[i], SPRITE.DRAGON, SPRITE.HURT_DRAGON);

  }
  var dragon = world.units[ITEMS.LAVA_DRAGON];
  for (var i = 0; i < dragon.length; i++) {
    if (dragon[i].scale > 1)
      draw_transition(dragon[i], SPRITE.LAVA_DRAGON, SPRITE.HURT_LAVA_DRAGON);

  }
  var hawk = world.units[ITEMS.HAWK];
  for (var i = 0; i < hawk.length; i++)
    draw_transition(hawk[i], SPRITE.HAWK, SPRITE.HURT_HAWK);
  var vulture = world.units[ITEMS.VULTURE];
  for (var i = 0; i < vulture.length; i++)
    draw_transition(vulture[i], SPRITE.VULTURE, SPRITE.HURT_VULTURE);
  __effect += delta * 15;
  if (__effect > 60)
    __effect -= 60;

  draw_map_transition(draw_objects_effect, is, ie, js, je, SPRITE.FOG, "fo", 2);
  draw_map_transition(draw_objects_effect, is, ie, js, je, SPRITE.FOD, "fod", 2);
};

export function draw_bg_transition(o, a) {
  if (world.transition) {
    ctx.globalAlpha = 1;
    o.draw_bg(a);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    o.draw_bg(a);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    o.draw_bg(a);
};

export function draw_fg_transition(o, a) {
  if (world.transition) {
    ctx.globalAlpha = 1;
    o.draw_fg(a);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    o.draw_fg(a);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    o.draw_fg(a);
};

export function draw_image_transition_2(id1, id2, img, x, y) {
  if (world.transition) {
    ctx.globalAlpha = 1;
    ctxDrawImage(ctx, sprite[id1][id2][world.time], x, y);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    ctxDrawImage(ctx, sprite[id1][id2][world.time], x, y);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    ctxDrawImage(ctx, img, x, y);
};

export function draw_image_transition(id, img, x, y) {
  if (world.transition) {
    ctx.globalAlpha = 1;
    ctxDrawImage(ctx, sprite[id][world.time], x, y);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    ctxDrawImage(ctx, sprite[id][world.time], x, y);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    ctxDrawImage(ctx, img, x, y);
};

export function draw_image_transition_hd_2(id1, id2, img, x, y) {
  var w = img.width;
  var h = img.height;
  var w2 = Math.floor(w / 2);
  var h2 = Math.floor(h / 2);
  if (world.transition) {
    ctx.globalAlpha = 1;
    ctxDrawImage(ctx, sprite[id1][id2][world.time], 0, 0, w, h, x, y, w2, h2);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    ctxDrawImage(ctx, sprite[id1][id2][world.time], 0, 0, w, h, x, y, w2, h2);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    ctxDrawImage(ctx, sprite[id1][id2][world.time], 0, 0, w, h, x, y, w2, h2);
};

export function draw_image_transition_hd(id, img, x, y) {
  var w = img.width;
  var h = img.height;
  var w2 = Math.floor(w / 2);
  var h2 = Math.floor(h / 2);
  if (world.transition) {
    ctx.globalAlpha = 1;
    ctxDrawImage(ctx, sprite[id][world.time], 0, 0, w, h, x, y, w2, h2);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    ctxDrawImage(ctx, sprite[id][world.time], 0, 0, w, h, x, y, w2, h2);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    ctxDrawImage(ctx, img, 0, 0, w, h, x, y, w2, h2);
};

export function draw_swim(s) {
  ctx.globalAlpha = s.alpha;
  circle(ctx, s.x + user.cam.x, s.y + user.cam.y, s.r);
  fill_path(ctx, SPRITE.SWIM_COLOR[world.time]);
  ctx.globalAlpha = 1;
};

export function draw_foot(f) {
  ctx.save();
  ctx.translate(user.cam.x + f.x, user.cam.y + f.y);
  ctx.rotate(f.angle);
  ctx.globalAlpha = f.alpha;
  var img = sprite[f.id][world.time];
  ctxDrawImage(ctx, img, -img.width / 2, -img.height / 2);
  ctx.globalAlpha = 1;
  ctx.restore();
};

export function draw_imgs_transition(id, i, x, y, alpha) {
  if (world.transition && (alpha == 1)) {
    ctx.globalAlpha = 1;
    ctxDrawImage(ctx, sprite[id][world.time][i], x, y);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    ctxDrawImage(ctx, sprite[id][world.time][i], x, y);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else {
    ctx.globalAlpha = alpha;
    ctxDrawImage(ctx, sprite[id][world.time][i], x, y);
    ctx.globalAlpha = 1;
  }
};

export function draw_transition(o, a1, a2) {
  if (world.transition) {
    ctx.globalAlpha = 1;
    o.draw(a1, a2);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    o.draw(a1, a2);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    o.draw(a1, a2);
};

export function draw_map_transition(fun, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
  if (world.transition) {
    ctx.globalAlpha = 1;
    fun(a1, a2, a3, a4, a5, a6, a7, a8, a9);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1 - world.shade.v;
    fun(a1, a2, a3, a4, a5, a6, a7, a8, a9);
    world.time = world.time ? 0 : 1;
    ctx.globalAlpha = 1;
  } else
    fun(a1, a2, a3, a4, a5, a6, a7, a8, a9);
};

export function get_color_transition(r1, g1, b1, r2, g2, b2, shade) {
  var color = "#";
  var c = Math.floor((r2 * shade) + ((1 - shade) * r1));
  color += (c < 16) ? ("0" + c.toString(16)) : c.toString(16);
  var c = Math.floor((g2 * shade) + ((1 - shade) * g1));
  color += (c < 16) ? ("0" + c.toString(16)) : c.toString(16);
  var c = Math.floor((b2 * shade) + ((1 - shade) * b1));
  color += (c < 16) ? ("0" + c.toString(16)) : c.toString(16);
  return color;
};

export function draw_simple_ground() {
  if (world.transition) {
    var shade = world.time ? (1 - world.shade.v) : world.shade.v;
    ctx.fillStyle = get_color_transition(4, 43, 48, 19, 58, 43, shade);
  } else
    ctx.fillStyle = SPRITE.GROUND[world.time];
  ctx.fillRect(0, 0, canw, canh);
};;

export function draw_ground() {
  for (var i = world.biomes.length - 1; i >= 0; i--) {
    var biome = world.biomes[i];
    if (biome.t === world.BIOME_SEA) {
      var info = world.BIOME[biome.t];
      if ((((-user.cam.x >= ((biome.x1 - 230) - canw)) && (-user.cam.x <= (biome.x2 + 330))) && (-user.cam.y >= (biome.y1 - canh))) && (-user.cam.y <= (biome.y2 + 100))) {
        var x2 = biome.x2;
        if (biome.t !== world.BIOME_SEA)
          x2 -= 610;

        var x1 = biome.x1;
        if (biome.t !== world.BIOME_SEA)
          x1 += 610;

        var y2 = biome.y2;
        if (biome.t !== world.BIOME_SEA)
          y2 -= 610;

        var y1 = biome.y1;
        if (biome.t !== world.BIOME_SEA)
          y1 += 610;

        if (world.transition) {
          var shade = world.time ? (1 - world.shade.v) : world.shade.v;
          ctx.fillStyle = get_color_transition(info.night[0], info.night[1], info.night[2], info.day[0], info.day[1], info.day[1], shade);
        } else
          ctx.fillStyle = info._color[world.time];
        var _left = Math.max(((user.cam.x + x1) - 2) - 230, 0);
        var _right = Math.max((((-user.cam.x + canw) - x2) - 330) - 2, 0);
        var _top = Math.max((user.cam.y + y1) - 2, 0);
        var _bottom = Math.max((((-user.cam.y + canh) - y2) - 100) - 2, 0);
        ctx.beginPath();
        ctx.fillRect(_left, _top, (canw - _right) - _left, (canh - _top) - _bottom);
      }
    }
  }
  for (var i = world.biomes.length - 1; i >= 0; i--) {
    var biome = world.biomes[i];
    if (biome.t !== world.BIOME_SEA) {
      var x2 = biome.x2;
      if (biome.t !== world.BIOME_SEA)
        x2 -= 400;

      var x1 = biome.x1;
      if (biome.t !== world.BIOME_SEA)
        x1 += 400;

      var y2 = biome.y2;
      if (biome.t !== world.BIOME_SEA)
        y2 -= 300;

      var y1 = biome.y1;
      if (biome.t !== world.BIOME_SEA)
        y1 += 300;

      if ((((((biome.v & WORLD.RIGHT) === 0) && (-user.cam.x >= ((x2 - canw) + 120))) && (-user.cam.x <= (x2 + 820))) && (-user.cam.y >= ((y1 + 88) - canh))) && (-user.cam.y <= (y2 + 50))) {
        draw_beach_sand_right(x2, y1 + 88, y2 - 88, user.beach[0], world.BIOME[biome.t], biome.v & WORLD.RIGHT);
        draw_beach_right(x2, y1 + 88, y2 - 88, user.beach[0], world.BIOME[biome.t], biome.v & WORLD.RIGHT);
      }
      if ((((((biome.v & WORLD.LEFT) === 0) && (-user.cam.x >= ((x1 - canw) - 700))) && (-user.cam.x <= (x1 - 20))) && (-user.cam.y >= ((y1 + 88) - canh))) && (-user.cam.y <= (y2 + 50))) {
        draw_beach_sand_left(x1, y1 + 88, y2 - 88, user.beach[1], world.BIOME[biome.t], biome.v & WORLD.LEFT);
        draw_beach_left(x1, y1 + 88, y2 - 88, user.beach[1], world.BIOME[biome.t], biome.v & WORLD.LEFT);
      }
      if ((((((biome.v & WORLD.BOTTOM) === 0) && (-user.cam.x >= ((x1 - 235) - canw))) && (-user.cam.x <= (x2 + 350))) && (-user.cam.y >= ((y2 - canh) - 275))) && (-user.cam.y <= (y2 + 490))) {
        draw_beach_sand_bottom(y2 - 230, x1 - 230, x2 + 230, user.beach[2], world.BIOME[biome.t], biome.v & WORLD.BOTTOM);
        draw_beach_bottom(y2 - 230, x1 - 230, x2 + 230, user.beach[2], world.BIOME[biome.t], biome.v & WORLD.BOTTOM);
      }
      if ((((((biome.v & WORLD.TOP) === 0) && (-user.cam.x >= ((x1 - 235) - canw))) && (-user.cam.x <= (x2 + 350))) && (-user.cam.y >= ((y1 - canh) - 390))) && (-user.cam.y <= (y1 + 315))) {
        draw_beach_sand_top(y1 + 310, x1 - 230, x2 + 230, user.beach[3], world.BIOME[biome.t], biome.v & WORLD.TOP);
        draw_beach_top(y1 + 310, x1 - 230, x2 + 230, user.beach[3], world.BIOME[biome.t], biome.v & WORLD.TOP);
      }
    }
  }
  for (var i = world.biomes.length - 1; i >= 0; i--) {
    var biome = world.biomes[i];
    if (biome.t !== world.BIOME_SEA) {
      var x2 = biome.x2;
      if (biome.t !== world.BIOME_SEA)
        x2 -= 400;

      var x1 = biome.x1;
      if (biome.t !== world.BIOME_SEA)
        x1 += 400;

      var y2 = biome.y2;
      if (biome.t !== world.BIOME_SEA)
        y2 -= 300;

      var y1 = biome.y1;
      if (biome.t !== world.BIOME_SEA)
        y1 += 300;

      if ((((((biome.v & WORLD.RIGHT) !== 0) && (-user.cam.x >= ((x2 - canw) + 120))) && (-user.cam.x <= (x2 + 820))) && (-user.cam.y >= ((y1 + 88) - canh))) && (-user.cam.y <= (y2 + 50))) {
        draw_beach_sand_right(x2, y1 + 88, y2 - 88, user.beach[0], world.BIOME[biome.t], biome.v & WORLD.RIGHT);
      }
      if ((((((biome.v & WORLD.LEFT) !== 0) && (-user.cam.x >= ((x1 - canw) - 700))) && (-user.cam.x <= (x1 - 20))) && (-user.cam.y >= ((y1 + 88) - canh))) && (-user.cam.y <= (y2 + 50))) {
        draw_beach_sand_left(x1, y1 + 88, y2 - 88, user.beach[1], world.BIOME[biome.t], biome.v & WORLD.LEFT);
      }
      if ((((((biome.v & WORLD.BOTTOM) !== 0) && (-user.cam.x >= ((x1 - 235) - canw))) && (-user.cam.x <= (x2 + 350))) && (-user.cam.y >= ((y2 - canh) - 275))) && (-user.cam.y <= (y2 + 490))) {
        draw_beach_sand_bottom(y2 - 230, x1 - 230, x2 + 230, user.beach[2], world.BIOME[biome.t], biome.v & WORLD.BOTTOM);
      }
      if ((((((biome.v & WORLD.TOP) !== 0) && (-user.cam.x >= ((x1 - 235) - canw))) && (-user.cam.x <= (x2 + 350))) && (-user.cam.y >= ((y1 - canh) - 390))) && (-user.cam.y <= (y1 + 315))) {
        draw_beach_sand_top(y1 + 310, x1 - 230, x2 + 230, user.beach[3], world.BIOME[biome.t], biome.v & WORLD.TOP);
      }
    }
  }
  for (var i = world.biomes.length - 1; i >= 0; i--) {
    var biome = world.biomes[i];
    if (biome.t !== world.BIOME_SEA) {
      var info = world.BIOME[biome.t];
      if ((((-user.cam.x >= ((biome.x1 - 230) - canw)) && (-user.cam.x <= (biome.x2 + 330))) && (-user.cam.y >= (biome.y1 - canh))) && (-user.cam.y <= (biome.y2 + 100))) {
        var x2 = biome.x2;
        if (biome.t !== world.BIOME_SEA) {
          if ((biome.v & WORLD.RIGHT) === 0)
            x2 -= 414;
          else
            x2 -= 610;
        }
        var x1 = biome.x1;
        if (biome.t !== world.BIOME_SEA) {
          if ((biome.v & WORLD.LEFT) === 0)
            x1 += 414;
          else
            x1 += 610;
        }
        var y2 = biome.y2;
        if (biome.t !== world.BIOME_SEA) {
          if ((biome.v & WORLD.BOTTOM) === 0)
            y2 -= 414;
          else
            y2 -= 610;
        }
        var y1 = biome.y1;
        if (biome.t !== world.BIOME_SEA) {
          if ((biome.v & WORLD.TOP) === 0)
            y1 += 414;
          else
            y1 += 610;
        }
        if (world.transition) {
          var shade = world.time ? (1 - world.shade.v) : world.shade.v;
          ctx.fillStyle = get_color_transition(info.night[0], info.night[1], info.night[2], info.day[0], info.day[1], info.day[2], shade);
        } else
          ctx.fillStyle = info._color[world.time];
        var _left = Math.max(((user.cam.x + x1) - 2) - 230, 0);
        var _right = Math.max((((-user.cam.x + canw) - x2) - 330) - 2, 0);
        var _top = Math.max((user.cam.y + y1) - 2, 0);
        var _bottom = Math.max((((-user.cam.y + canh) - y2) - 100) - 2, 0);
        ctx.beginPath();
        ctx.fillRect(_left, _top, (canw - _right) - _left, (canh - _top) - _bottom);
      }
    }
  }
  if (ui.quality) {
    draw_map_transition(draw_breath_objects, _is, _ie, _js, _je, SPRITE.WAVE_TWO, "isl", 2);
    draw_map_transition(draw_breath_objects, _is, _ie, _js, _je, SPRITE.WAVE_ONE, "isl", 2);
  }
  draw_map_transition(draw_map_objects, _is, _ie, _js, _je, SPRITE.ISLAND, "isl", 2);
  if (ui.quality)
    draw_map_transition(draw_map_decorations, _is, _ie, _js, _je, SPRITE.DECORATION, "de");

  var players = world.units[ITEMS.PLAYERS];
  for (var i = 0; i < players.length; i++) {
    var p = players[i];
    for (var j = 0; j < p.foot.length; j++)
      draw_foot(p.foot[j]);
  }
  __wave += delta * 40;
  if (__wave > 60)
    __wave -= 60;

  draw_map_transition(draw_river_tile, _is, _ie, _js, _je, SPRITE.RIVER, "r", 0);
  for (var i = 0; i < world.biomes.length; i++) {
    var biome = world.biomes[i];
    if (biome.t !== world.BIOME_SEA) {
      var x2 = biome.x2;
      if (biome.t !== world.BIOME_SEA)
        x2 -= 400;

      var x1 = biome.x1;
      if (biome.t !== world.BIOME_SEA)
        x1 += 400;

      var y2 = biome.y2;
      if (biome.t !== world.BIOME_SEA)
        y2 -= 300;

      var y1 = biome.y1;
      if (biome.t !== world.BIOME_SEA)
        y1 += 300;

      if ((((((biome.v & WORLD.RIGHT) > 0) && (-user.cam.x >= ((x2 - canw) + 120))) && (-user.cam.x <= (x2 + 820))) && (-user.cam.y >= ((y1 + 88) - canh))) && (-user.cam.y <= (y2 + 50)))
        draw_beach_right(x2, y1 + 88, y2 - 88, user.beach[0], world.BIOME[biome.t], biome.v & WORLD.RIGHT);

      if ((((((biome.v & WORLD.LEFT) > 0) && (-user.cam.x >= ((x1 - canw) - 700))) && (-user.cam.x <= (x1 - 20))) && (-user.cam.y >= ((y1 + 88) - canh))) && (-user.cam.y <= (y2 + 50)))
        draw_beach_left(x1, y1 + 88, y2 - 88, user.beach[1], world.BIOME[biome.t], biome.v & WORLD.LEFT);

      if ((((((biome.v & WORLD.BOTTOM) > 0) && (-user.cam.x >= ((x1 - 235) - canw))) && (-user.cam.x <= (x2 + 350))) && (-user.cam.y >= ((y2 - canh) - 275))) && (-user.cam.y <= (y2 + 490)))
        draw_beach_bottom(y2 - 230, x1 - 230, x2 + 230, user.beach[2], world.BIOME[biome.t], biome.v & WORLD.BOTTOM);

      if ((((((biome.v & WORLD.TOP) > 0) && (-user.cam.x >= ((x1 - 235) - canw))) && (-user.cam.x <= (x2 + 350))) && (-user.cam.y >= ((y1 - canh) - 390))) && (-user.cam.y <= (y1 + 315)))
        draw_beach_top(y1 + 310, x1 - 230, x2 + 230, user.beach[3], world.BIOME[biome.t], biome.v & WORLD.TOP);

    }
  }
};;

export function draw_ash() {
  var ash = user.ash;
  var flakes = ash.flakes;
  for (var i = 0; i < flakes.length; i++) {
    var f = flakes[i];
    ash.update(f);
    draw_imgs_transition(SPRITE.ASHES, f.id, user.cam.x + f.x, user.cam.y + f.y, f.alpha);
  }
  for (var i = 0; i < flakes.length; i++) {
    var f = flakes[i];
    if ((((f.life <= 0) || (f.x > (-user.cam.x + canw))) || (f.x < -user.cam.x)) || (f.y > (-user.cam.y + canh)))
      flakes.splice(i, 1);

  }
  var pos = -user.cam.y;
  if (world.dist_lava > -1000)
    ash.add(pos);

};

export function draw_winter() {
  var winter = user.winter;
  if (winter.tempest === 0)
    winter.tempest_speed = Math.max(0, winter.tempest_speed - (delta / 10));
  else
    winter.tempest_speed = Math.min(1, winter.tempest_speed + (delta / 10));
  var flakes = winter.flakes;
  for (var i = 0; i < flakes.length; i++) {
    var f = flakes[i];
    winter.update(f);
    draw_imgs_transition(SPRITE.FLAKES, f.id, user.cam.x + f.x, user.cam.y + f.y, f.alpha);
  }
  for (var i = 0; i < flakes.length; i++) {
    var f = flakes[i];
    if ((((f.life <= 0) || (f.x > (-user.cam.x + canw))) || (f.x < -user.cam.x)) || (f.y > (-user.cam.y + canh)))
      flakes.splice(i, 1);

  }
  var pos = -user.cam.y;
  if (world.dist_winter > -1000)
    winter.add(pos);

};

export function draw_desert() {
  var desert = user.desert;
  if (desert.tempest === 0)
    desert.tempest_speed = Math.max(0, desert.tempest_speed - (delta / 10));
  else
    desert.tempest_speed = Math.min(1, desert.tempest_speed + (delta / 10));
  var flakes = desert.flakes;
  for (var i = 0; i < flakes.length; i++) {
    var f = flakes[i];
    desert.update(f);
    draw_imgs_transition(SPRITE.DESERT, f.id, user.cam.x + f.x, user.cam.y + f.y, f.alpha);
  }
  for (var i = 0; i < flakes.length; i++) {
    var f = flakes[i];
    if ((((f.life <= 0) || (f.x > (-user.cam.x + canw))) || (f.x < (-user.cam.x - (user.cam.w / 2)))) || (f.y > (-user.cam.y + canh)))
      flakes.splice(i, 1);

  }
  var pos = -user.cam.y;
  if (world.dist_desert > -1000)
    desert.add(pos);

};;

export function draw_beach_sand_left(xMin, yMin, yMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_x = (user.cam.x + xMin) - 700;
  var _top = Math.max(user.cam.y + yMin, 0);
  var _bottom = Math.max(((-user.cam.y + canh) - yMax) - 100, 0);
  var diff_y = _top;
  var mycanh = (canh - _top) - _bottom;
  if (hasWave)
    var wx = beach.t(w1).x;
  else
    var wx = w1.r.x;
  var d = diff_x + WORLD.LW1SX;
  var w1x = d,
    w1y = diff_y,
    w1w = wx + WORLD.W1SX,
    w1h = mycanh;
  d += (wx + WORLD.W1SX) - 2;
  var od3 = d;
  if (hasWave)
    var wx = beach.t(w2).x;
  else
    var wx = w2.r.x;
  var d2 = ((diff_x + WORLD.LW2SX) - d) + wx;
  var w2x = d,
    w2y = diff_y,
    w2w = d2,
    w2h = mycanh;
  d += d2 - 2;
  var od = d - 2;
  if (hasWave)
    var wx = beach.t(w3).x;
  else
    var wx = w3.r.x;
  d2 = ((diff_x + WORLD.LW3SX) - d) + wx;
  if (od < ((d + d2) - 3)) {
    var w3ok = true;
    var w3x = d,
      w3y = diff_y,
      w3w = d2,
      w3h = mycanh;
    d += d2 - 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_x + WORLD.LSANDX) - d;
  if ((hasWave > 0) && (biome.isSand === 1)) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 77, 72, 252, 239, 187, shade);
    } else
      ctx.fillStyle = SPRITE.SAND_COLOR[world.time];
    ctx.fillRect(d, diff_y, d2, mycanh);
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(biome.night[0], biome.night[1], biome.night[2], biome.day[0], biome.day[1], biome.day[2], shade);
    } else
      ctx.fillStyle = biome._color[world.time];
    ctx.fillRect(d, diff_y, d2, mycanh);
  }
};

export function draw_beach_left(xMin, yMin, yMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_x = (user.cam.x + xMin) - 700;
  var _top = Math.max(user.cam.y + yMin, 0);
  var _bottom = Math.max(((-user.cam.y + canh) - yMax) - 100, 0);
  var diff_y = _top;
  var mycanh = (canh - _top) - _bottom;
  if (hasWave)
    var w = beach.t(w1);
  else
    var w = w1.r;
  var d = diff_x + WORLD.LW1SX;
  var w1x = d,
    w1y = diff_y,
    w1w = w.x + WORLD.W1SX,
    w1h = mycanh;
  d += (w.x + WORLD.W1SX) - 2;
  var od3 = d;
  if (hasWave)
    var w = beach.t(w2);
  else
    var w = w2.r;
  var d2 = ((diff_x + WORLD.LW2SX) - d) + w.x;
  var w2x = d,
    w2y = diff_y,
    w2w = d2,
    w2h = mycanh;
  d += d2 - 2;
  var od = d - 2;
  if (hasWave)
    var w = beach.t(w3);
  else
    var w = w3.r;
  d2 = ((diff_x + WORLD.LW3SX) - d) + w.x;
  if (od < ((d + d2) - 3)) {
    var w3ok = true;
    var w3x = d,
      w3y = diff_y,
      w3w = d2,
      w3h = mycanh;
    d += d2 - 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_x + WORLD.LSANDX) - d;
  if (world.transition) {
    var shade = world.time ? (1 - world.shade.v) : world.shade.v;
    ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
  } else
    ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  ctx.fillRect(w1x, w1y, w1w, w1h);
  if (hasWave) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 70, 76, 42, 139, 155, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_2_COLOR[world.time];
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  }
  ctx.fillRect(w2x, w2y, w2w, w2h);
  if (w3ok) {
    if (hasWave) {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(17, 94, 96, 169, 214, 211, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_1_COLOR[world.time];
    } else {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
    }
    ctx.fillRect(w3x, w3y, w3w, w3h);
  }
  if (ui.quality && hasWave)
    beach.draw_foams_left(od, od2, od3, diff_x, -user.cam.y + w1y, (-user.cam.y + w1y) + w1h);

};;

export function draw_beach_sand_top(yMin, xMin, xMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_y = (user.cam.y + yMin) - 700;
  var _left = Math.max(user.cam.x + xMin, 0);
  var _right = Math.max(((-user.cam.x + canw) - xMax) - 100, 0);
  var diff_x = _left;
  var mycanw = (canw - _left) - _right;
  if (hasWave)
    var wx = beach.t(w1).x;
  else
    var wx = w1.r.x;
  var d = diff_y + WORLD.LW1SX;
  var w1x = diff_x,
    w1y = d,
    w1h = wx + WORLD.W1SX,
    w1w = mycanw;
  d += (wx + WORLD.W1SX) - 2;
  var od3 = d;
  if (hasWave)
    var wx = beach.t(w2).x;
  else
    var wx = w2.r.x;
  var d2 = ((diff_y + WORLD.LW2SX) - d) + wx;
  var w2y = d,
    w2x = diff_x,
    w2h = d2,
    w2w = mycanw;
  d += d2 - 2;
  var od = d - 2;
  if (hasWave)
    var wx = beach.t(w3).x;
  else
    var wx = w3.r.x;
  d2 = ((diff_y + WORLD.LW3SX) - d) + wx;
  if (od < ((d + d2) - 3)) {
    var w3ok = true;
    var w3y = d,
      w3x = diff_x,
      w3h = d2,
      w3w = mycanw;
    d += d2 - 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_y + WORLD.LSANDX) - d;
  if ((hasWave > 0) && (biome.isSand === 1)) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 77, 72, 252, 239, 187, shade);
    } else
      ctx.fillStyle = SPRITE.SAND_COLOR[world.time];
    ctx.fillRect(diff_x, d, mycanw, d2);
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(biome.night[0], biome.night[1], biome.night[2], biome.day[0], biome.day[1], biome.day[2], shade);
    } else
      ctx.fillStyle = biome._color[world.time];
    ctx.fillRect(diff_x, d, mycanw, d2);
  }
};;

export function draw_beach_top(yMin, xMin, xMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_y = (user.cam.y + yMin) - 700;
  var _left = Math.max(user.cam.x + xMin, 0);
  var _right = Math.max(((-user.cam.x + canw) - xMax) - 100, 0);
  var diff_x = _left;
  var mycanw = (canw - _left) - _right;
  if (hasWave)
    var w = beach.t(w1);
  else
    var w = w1.r;
  var d = diff_y + WORLD.LW1SX;
  var w1x = diff_x,
    w1y = d,
    w1h = w.x + WORLD.W1SX,
    w1w = mycanw;
  d += (w.x + WORLD.W1SX) - 2;
  var od3 = d;
  if (hasWave)
    var w = beach.t(w2);
  else
    var w = w2.r;
  var d2 = ((diff_y + WORLD.LW2SX) - d) + w.x;
  var w2y = d,
    w2x = diff_x,
    w2h = d2,
    w2w = mycanw;
  d += d2 - 2;
  var od = d - 2;
  if (hasWave)
    var w = beach.t(w3);
  else
    var w = w3.r;
  d2 = ((diff_y + WORLD.LW3SX) - d) + w.x;
  if (od < ((d + d2) - 3)) {
    var w3ok = true;
    var w3y = d,
      w3x = diff_x,
      w3h = d2,
      w3w = mycanw;
    d += d2 - 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_y + WORLD.LSANDX) - d;
  if (world.transition) {
    var shade = world.time ? (1 - world.shade.v) : world.shade.v;
    ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
  } else
    ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  ctx.fillRect(w1x, w1y, w1w, w1h);
  if (hasWave) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 70, 76, 42, 139, 155, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_2_COLOR[world.time];
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  }
  ctx.fillRect(w2x, w2y, w2w, w2h);
  if (w3ok) {
    if (hasWave) {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(17, 94, 96, 169, 214, 211, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_1_COLOR[world.time];
    } else {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
    }
    ctx.fillRect(w3x, w3y, w3w, w3h);
  }
  if (ui.quality && hasWave)
    beach.draw_foams_top(od, od2, od3, diff_y, -user.cam.x + w1x, (-user.cam.x + w1x) + w1w);

};;

export function draw_beach_sand_right(xMin, yMin, yMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_x = (user.cam.x + xMin) + 820;
  var _top = Math.max(user.cam.y + yMin, 0);
  var _bottom = Math.max(((-user.cam.y + canh) - yMax) - 100, 0);
  var diff_y = _top;
  var mycanh = (canh - _top) - _bottom;
  if (hasWave)
    var wx = beach.t(w1).x;
  else
    var wx = w1.r.x;
  var d = diff_x + WORLD.LW1SX;
  var w1x = d,
    w1y = diff_y,
    w1w = -wx + WORLD.W1SX,
    w1h = mycanh;
  d += (-wx + WORLD.W1SX) + 2;
  var od3 = d;
  if (hasWave)
    var wx = beach.t(w2).x;
  else
    var wx = w2.r.x;
  var d2 = ((diff_x - WORLD.LW2SX) - d) - wx;
  var w2x = d,
    w2y = diff_y,
    w2w = d2,
    w2h = mycanh;
  d += d2 + 2;
  var od = d - 2;
  if (hasWave)
    var wx = beach.t(w3).x;
  else
    var wx = w3.r.x;
  d2 = ((diff_x - WORLD.LW3SX) - d) - wx;
  if (od > (d + d2)) {
    var w3ok = true;
    var w3x = d,
      w3y = diff_y,
      w3w = d2,
      w3h = mycanh;
    d += d2 + 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_x - WORLD.LSANDX) - d;
  if ((hasWave > 0) && (biome.isSand === 1)) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 77, 72, 252, 239, 187, shade);
    } else
      ctx.fillStyle = SPRITE.SAND_COLOR[world.time];
    ctx.fillRect(d, diff_y, d2, mycanh);
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(biome.night[0], biome.night[1], biome.night[2], biome.day[0], biome.day[1], biome.day[2], shade);
    } else
      ctx.fillStyle = biome._color[world.time];
    ctx.fillRect(d, diff_y, d2, mycanh);
  }
};;

export function draw_beach_right(xMin, yMin, yMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_x = (user.cam.x + xMin) + 820;
  var _top = Math.max(user.cam.y + yMin, 0);
  var _bottom = Math.max(((-user.cam.y + canh) - yMax) - 100, 0);
  var diff_y = _top;
  var mycanh = (canh - _top) - _bottom;
  if (hasWave)
    var w = beach.t(w1);
  else
    var w = w1.r;
  var d = diff_x + WORLD.LW1SX;
  var w1x = d,
    w1y = diff_y,
    w1w = -w.x + WORLD.W1SX,
    w1h = mycanh;
  d += (-w.x + WORLD.W1SX) + 2;
  var od3 = d;
  if (hasWave)
    var w = beach.t(w2);
  else
    var w = w2.r;
  var d2 = ((diff_x - WORLD.LW2SX) - d) - w.x;
  var w2x = d,
    w2y = diff_y,
    w2w = d2,
    w2h = mycanh;
  d += d2 + 2;
  var od = d - 2;
  if (hasWave)
    var w = beach.t(w3);
  else
    var w = w3.r;
  d2 = ((diff_x - WORLD.LW3SX) - d) - w.x;
  if (od > (d + d2)) {
    var w3ok = true;
    var w3x = d,
      w3y = diff_y,
      w3w = d2,
      w3h = mycanh;
    d += d2 + 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_x - WORLD.LSANDX) - d;
  if (world.transition) {
    var shade = world.time ? (1 - world.shade.v) : world.shade.v;
    ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
  } else
    ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  ctx.fillRect(w1x, w1y, w1w, w1h);
  if (hasWave) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 70, 76, 42, 139, 155, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_2_COLOR[world.time];
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  }
  ctx.fillRect(w2x, w2y, w2w, w2h);
  if (w3ok) {
    if (hasWave) {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(17, 94, 96, 169, 214, 211, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_1_COLOR[world.time];
    } else {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
    }
    ctx.fillRect(w3x, w3y, w3w, w3h);
  }
  if (ui.quality && hasWave)
    beach.draw_foams_right(od, od2, od3, diff_x, -user.cam.y + w1y, (-user.cam.y + w1y) + w1h);

};;

export function draw_beach_sand_bottom(yMin, xMin, xMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_y = (user.cam.y + yMin) + 710;
  var _left = Math.max(user.cam.x + xMin, 0);
  var _right = Math.max(((-user.cam.x + canw) - xMax) - 100, 0);
  var diff_x = _left;
  var mycanw = (canw - _left) - _right;
  if (hasWave)
    var wx = beach.t(w1).x;
  else
    var wx = w1.r.x;
  var d = diff_y + WORLD.LW1SX;
  var w1y = d,
    w1x = diff_x,
    w1h = -wx + WORLD.W1SX,
    w1w = mycanw;
  d += (-wx + WORLD.W1SX) + 2;
  var od3 = d;
  if (hasWave)
    var wx = beach.t(w2).x;
  else
    var wx = w2.r.x;
  var d2 = ((diff_y - WORLD.LW2SX) - d) - wx;
  var w2y = d,
    w2x = diff_x,
    w2h = d2,
    w2w = mycanw;
  d += d2 + 2;
  var od = d - 2;
  if (hasWave)
    var wx = beach.t(w3).x;
  else
    var wx = w3.r.x;
  d2 = ((diff_y - WORLD.LW3SX) - d) - wx;
  if (od > (d + d2)) {
    var w3ok = true;
    var w3y = d,
      w3x = diff_x,
      w3h = d2,
      w3w = mycanw;
    d += d2 + 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_y - WORLD.LSANDX) - d;
  if ((hasWave > 0) && (biome.isSand === 1)) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 77, 72, 252, 239, 187, shade);
    } else
      ctx.fillStyle = SPRITE.SAND_COLOR[world.time];
    ctx.fillRect(diff_x, d, mycanw, d2);
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(biome.night[0], biome.night[1], biome.night[2], biome.day[0], biome.day[1], biome.day[2], shade);
    } else
      ctx.fillStyle = biome._color[world.time];
    ctx.fillRect(diff_x, d, mycanw, d2);
  }
};;

export function draw_beach_bottom(yMin, xMin, xMax, beach, biome, hasWave) {
  var w1 = beach.w1;
  var w2 = beach.w2;
  var w3 = beach.w3;
  var diff_y = (user.cam.y + yMin) + 710;
  var _left = Math.max(user.cam.x + xMin, 0);
  var _right = Math.max(((-user.cam.x + canw) - xMax) - 100, 0);
  var diff_x = _left;
  var mycanw = (canw - _left) - _right;
  if (hasWave)
    var w = beach.t(w1);
  else
    var w = w1.r;
  var d = diff_y + WORLD.LW1SX;
  var w1y = d,
    w1x = diff_x,
    w1h = -w.x + WORLD.W1SX,
    w1w = mycanw;
  d += (-w.x + WORLD.W1SX) + 2;
  var od3 = d;
  if (hasWave)
    var w = beach.t(w2);
  else
    var w = w2.r;
  var d2 = ((diff_y - WORLD.LW2SX) - d) - w.x;
  var w2y = d,
    w2x = diff_x,
    w2h = d2,
    w2w = mycanw;
  d += d2 + 2;
  var od = d - 2;
  if (hasWave)
    var w = beach.t(w3);
  else
    var w = w3.r;
  d2 = ((diff_y - WORLD.LW3SX) - d) - w.x;
  if (od > (d + d2)) {
    var w3ok = true;
    var w3y = d,
      w3x = diff_x,
      w3h = d2,
      w3w = mycanw;
    d += d2 + 2;
    var od2 = d;
  } else {
    var w3ok = false;
    d = od;
    var od2 = -1;
  }
  d2 = (diff_y - WORLD.LSANDX) - d;
  if (world.transition) {
    var shade = world.time ? (1 - world.shade.v) : world.shade.v;
    ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
  } else
    ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  ctx.fillRect(w1x, w1y, w1w, w1h);
  if (hasWave) {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(15, 70, 76, 42, 139, 155, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_2_COLOR[world.time];
  } else {
    if (world.transition) {
      var shade = world.time ? (1 - world.shade.v) : world.shade.v;
      ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
    } else
      ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
  }
  ctx.fillRect(w2x, w2y, w2w, w2h);
  if (w3ok) {
    if (hasWave) {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(17, 94, 96, 169, 214, 211, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_1_COLOR[world.time];
    } else {
      if (world.transition) {
        var shade = world.time ? (1 - world.shade.v) : world.shade.v;
        ctx.fillStyle = get_color_transition(9, 55, 63, 11, 106, 132, shade);
      } else
        ctx.fillStyle = SPRITE.WATER_3_COLOR[world.time];
    }
    ctx.fillRect(w3x, w3y, w3w, w3h);
  }
  if (ui.quality && hasWave)
    beach.draw_foams_bottom(od, od2, od3, diff_y, -user.cam.x + w1x, (-user.cam.x + w1x) + w1w);

};;

export function draw_world_with_effect() {
  ctx.globalAlpha = 1;
  if (world.transition)
    var ret = world.shade.update();

  world.update_dist_from_biomes(-user.cam.x, -user.cam.y);
  _js = Math.max(Math.floor(-user.cam.x / world.dw) - 5, 0);
  _je = Math.min(Math.floor((-user.cam.x + user.cam.w) / world.dw) + 4, world.nw - 1);
  _is = Math.max(Math.floor(-user.cam.y / world.dh) - 3, 0);
  _ie = Math.min(Math.floor((-user.cam.y + user.cam.h) / world.dh) + 3, world.nh - 1);
  draw_ground();
  draw_world();
  if (((ui.quality && (world.mode !== WORLD.MODE_ZOMBIES)) && (world.mode !== WORLD.MODE_LEGACY)) && (world.mode !== WORLD.MODE_BR)) {
    draw_desert();
    draw_winter();
    draw_ash();
  }
  if (world.transition) {
    if (ret) {
      world.transition = false;
      world.shade.v = 0;
      world.shade.o = false;
    }
  }
};