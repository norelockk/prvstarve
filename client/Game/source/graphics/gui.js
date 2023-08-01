var ANIMATION_STOP = 0;
var ANIMATION_RUN = 1;
var FOCUS_OUT = 0;
var FOCUS_IN = 1;
var ALIGN_CENTER = 0;
var ALIGN_LEFT = 1;
var STYLE_RETRO = 0;
var STYLE_FLAT = 1;
var KEYDOWN = 0;
var KEYPRESS = 1;
var GET_KEY_OUT = 0;
var GET_KEY_IN = 1;
var MOUSE_MOVE = 0;
var MOUSE_DOWN = 1;
var MOUSE_UP = 2;
var BUTTON_OUT = 0;
var BUTTON_IN = 1;
var BUTTON_CLICK = 2;

function gui_disable_antialiasing(ctx) {
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.oImageSmoothingEnabled = false;
};

function get_mouse_pos(can, evt) {
  var rect = can.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

function gui_render_text(text, font, color, height, width, background, paddingHorz, paddingVert, border, borderColor, opacity, radius, borderText, borderTextWidth, weight) {
  if (text.length === 0)
    text = " ";

  if (paddingHorz === undefined)
    paddingHorz = 0;

  if (paddingVert === undefined)
    paddingVert = 0;

  if (border === undefined)
    border = 0;

  if (borderTextWidth === undefined)
    borderTextWidth = 0;

  var can = document.createElement("canvas");
  var ctx = can.getContext("2d");
  ctx.textBaseline = "middle", ctx.font = ((((weight !== undefined) ? (weight + " ") : '') + height) + "px ") + font;
  if (width !== undefined)
    width = Math.min(ctx.measureText(text).width, width);
  else
    width = ctx.measureText(text).width;
  can.width = width + paddingHorz;
  can.height = height + paddingVert;
  if (background !== undefined) {
    if (opacity !== undefined)
      ctx.globalAlpha = opacity;

    ctx.fillStyle = background;
    if (radius !== undefined) {
      roundRect(ctx, border + 2, border, ((width + paddingHorz) - (border * 2)) - 4, (height + paddingVert) - (border * 2), radius);
      ctx.fill();
    } else
      ctx.fillRect(border, border, (width + paddingHorz) - (border * 2), (height + paddingVert) - (border * 2));
    ctx.globalAlpha = 1;
    if (border !== 0) {
      ctx.lineWidth = border;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    }
  }
  ctx.textBaseline = "middle";
  ctx.font = ((((weight !== undefined) ? (weight + " ") : '') + height) + "px ") + font;
  if (borderText !== undefined) {
    ctx.strokeStyle = borderText;
    ctx.lineWidth = borderTextWidth;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;
    ctx.strokeText(text, Math.floor(paddingHorz / 2), Math.floor(paddingVert / 2) + Math.floor(height / 2), width);
  }
  ctx.fillStyle = color;
  ctx.fillText(text, Math.floor(paddingHorz / 2), Math.floor(paddingVert / 2) + Math.floor(height / 2), width);
  can.w2 = can.width / 2;
  can.h2 = can.height / 2;
  return can;
};;

function gui_create_button(width, height, text, custom_img, hd, breath, callback, x, y, position, active) {
  if (y === undefined)
    y = 0;

  if (x === undefined)
    x = 0;

  if (position === undefined)
    position = 0;

  if (active === undefined)
    active = 1;

  hd = (hd === 3) ? 3 : ((hd === 1) ? 2 : 1);
  if (breath !== 1)
    breath = 0;

  if (custom_img)
    var img = custom_img;

  var button_data = {
    width: width,
    height: height,
    img: img,
    state: BUTTON_OUT,
    translate: {
      x: x,
      y: y,
      _x: x,
      _y: y
    },
    enable_breath: breath,
    breath: 0,
    callback: callback,
    position: position,
    active: active
  };
  var get_img = function () {
    return button_data.img[button_data.state];
  };
  var in_button = function (mouse) {
    var translate = button_data.translate;
    if ((button_data.width === 0) || (button_data.height === 0)) {
      button_data.width = button_data.img[0].width;
      button_data.height = button_data.img[0].height;
    }
    return (((mouse.x > translate.x) && (mouse.x < (translate.x + (button_data.width / hd)))) && (mouse.y > translate.y)) && (mouse.y < (translate.y + (button_data.height / hd)));
  };
  var trigger = function (can, mouse, state) {
    if (in_button(mouse)) {
      if (state == MOUSE_DOWN)
        button_data.state = BUTTON_CLICK;
      else if (state == MOUSE_UP)
        button_data.state = BUTTON_IN;
      else if ((state == MOUSE_MOVE) && (button_data.state != BUTTON_CLICK))
        button_data.state = BUTTON_IN;

      return true;
    }
    button_data.state = BUTTON_OUT;
    return false;
  };
  var breath = function () {
    var s = 0;
    if (button_data.enable_breath === 1) {
      if ((button_data.state === BUTTON_IN) || (button_data.state === BUTTON_CLICK))
        button_data.breath = (button_data.breath + (delta * 1000)) % 1000;
      else if (button_data.breath > 0) {
        button_data.breath = (button_data.breath > 500) ? (button_data.breath + (delta * 1000)) : (button_data.breath - (delta * 1000));
        if ((button_data.breath < 0) || (button_data.breath > 1000))
          button_data.breath = 0;

      }
      s = 0.2 * Utils.ease_in_out_quad((button_data.breath > 500) ? ((1000 - button_data.breath) / 500) : (button_data.breath / 500));
    }
    return s;
  };
  var draw;
  if (hd === 2) {
    draw = function (ctx_target) {
      var s = 1 + breath();
      var img = get_img();
      var w = (button_data.width * s) / 2;
      var h = (button_data.height * s) / 2;
      var _w = (w - (button_data.width / 2)) / 2;
      var _h = (h - (button_data.height / 2)) / 2;
      ctxDrawImage(ctx_target, img, button_data.translate.x - _w, button_data.translate.y - _h, w, h);
    };
  } else if (hd === 3) {
    draw = function (ctx_target) {
      var img = get_img();
      var w = button_data.width;
      var h = button_data.height;
      var _w = (w - button_data.width) / 2;
      var _h = (h - button_data.height) / 2;
      ctxDrawImage(ctx_target, img, button_data.translate.x - _w, button_data.translate.y - _h, w, h);
    };
    hd = 1;
  } else {
    draw = function (ctx_target) {
      var img = get_img();
      ctxDrawImage(ctx_target, img, button_data.translate.x, button_data.translate.y);
    };
  }
  return {
    info: button_data,
    trigger: trigger,
    draw: draw,
    in_button: in_button
  };
};

function gui_create_image_hd(img, active, x, y, position) {
  var translate = {
    x: x,
    y: y,
    _x: x,
    _y: y
  };
  var draw = function (ctx_target) {
    ctxDrawImage(ctx_target, img, translate.x, translate.y, img.width / 2, img.height / 2);
  };
  return {
    translate: translate,
    draw: draw,
    active: active,
    position: position
  };
};

function gui_create_image(img) {
  var translate = {
    x: 0,
    y: 0
  };
  var draw = function (ctx_target) {
    ctxDrawImage(ctx_target, img, translate.x, translate.y);
  };
  return {
    img: img,
    translate: translate,
    draw: draw
  };
};

function gui_create_animation(img, time) {
  if (time === undefined)
    time = 0.033;

  var translate = {
    x: 0,
    y: 0
  };
  var sprite = 0;
  var delay = 0;
  var get_img = function () {
    delay += delta;
    if (delay > time) {
      sprite = (sprite + 1) % img.length;
      delay -= time;
    }
    return img[sprite];
  };
  var draw = function (ctx_target) {
    ctxDrawImage(ctx_target, get_img(), translate.x, translate.y);
  };
  return {
    img: img,
    translate: translate,
    draw: draw
  };
};

function gui_add_breath_effect(img, end, start, speed_start, speed_end, width, height) {
  img.end = end;
  img.start = start;
  img.speed_start = speed_start;
  img.speed_end = speed_end;
  img.width = img.img.width;
  img.height = img.img.height;
  img.scale = (end + start) / 2;
  img.breath = false;
  img.draw = function (ctx) {
    img.translate.x = canw2 - (img.width / 2);
    ctxDrawImage(ctx, img.img, 0, 0, img.img.width, img.img.height, img.translate.x, img.translate.y, img.width, img.height);
  };
};

function gui_breath_effect(img) {
  img.scale += img.breath ? (delta / img.speed_start) : (-delta / img.speed_end);
  if (img.scale > img.end)
    img.breath = false;
  else if (img.scale < img.start)
    img.breath = true;

};