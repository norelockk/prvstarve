var can = document.getElementById('game_canvas');
var ctx = can.getContext('2d');
var canw = can.width;
var canh = can.height;
var canw2 = can.width / 2;
var canh2 = can.height / 2;
var canm = {
  x: canw2,
  y: canh2
};
var scale = 1;
var ratio = 1;
var ratio_opt = -1;

can.oncontextmenu = function () {
  return false;
};

function CTI(c) {
  var img = new Image;
  img.src = c.toDataURL('image/png');
  img.width = c.width;
  img.height = c.height;
  img.isLoaded = 1;
  return img;
};

var devicePixelRatio = window.devicePixelRatio || 1;
var backingStoreRatio = ((((ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio) || ctx.msBackingStorePixelRatio) || ctx.oBackingStorePixelRatio) || ctx.backingStorePixelRatio) || 1;

function resize_canvas() {
  if (can.width != window.innerWidth) {
    can.width = window.innerWidth;
    canw = can.width;
    canw2 = can.width / 2;
  }
  if (can.height != window.innerHeight) {
    can.height = window.innerHeight;
    canh = can.height;
    canh2 = can.height / 2;
  }
  canm = {
    x: canw2,
    y: canh2
  };
  var ow = can.width;
  var oh = can.height;
  if (ratio_opt === -1)
    ratio = devicePixelRatio / backingStoreRatio;
  else
    ratio = ratio_opt;
  can.width = ow * ratio;
  can.height = oh * ratio;
  can.style.width = ow + 'px';
  can.style.height = oh + 'px';
  ctx.scale(ratio, ratio);
  if (user) {
    user.cam.rw = ow;
    user.cam.rh = oh;
  }
  if (loader.is_run)
    loader.update();
  else if (ui.is_run)
    ui.update();
  else if (game.is_run)
    game.update();
  else if (scoreboard.is_run)
    scoreboard.update();

};
var game_body = document.getElementById('game_body');
game_body.ondragstart = function () {
  return false;
};
game_body.ondrop = function () {
  return false;
};
game_body.onresize = resize_canvas;

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0;
    (x < vendors.length) && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = (new Date).getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };

})();