import { ui, game, loader, scoreboard } from "./game";

export const CTI = c => {
  const image = new Image;

  image.src = c.toDataURL('image/png');
  image.width = c.width;
  image.height = c.height;
  image.isLoaded = 1;

  return image;
};

export const can = document.getElementById("game_canvas") ?? document.querySelector("#game_canvas");
export const ctx = can.getContext("2d");

export let canw = can && can instanceof HTMLCanvasElement ? can.width : 0;
export let canw2 = canw / 2;

export let canh = can && can instanceof HTMLCanvasElement ? can.height : 0;
export let canh2 = canh / 2;

export let canm = {
  x: canw2,
  y: canh2
};

export let scale = 1;

export const resize = () => {
  if (can.width !== window.innerWidth) {
    can.width = window.innerWidth;
    canw = can.width;
    canw2 = canw / 2;
  }

  if (can.height !== window.innerHeight) {
    can.height = window.innerHeight;
    canh = can.height;
    canh2 = canh / 2;
  }

  canm.x = canw2;
  canm.y = canh2;

  can.style.width = canw + 'px';
  can.style.height = canh + 'px';
};

export let delta = 0;
export let old_timestamp = 0;

export const render = (timestamp = 0) => {
  window.requestAnimationFrame(render);

  delta = (timestamp - old_timestamp) / 1000;
  old_timestamp = timestamp;

  delta = delta > 1 ? 1 : delta;

  if (game.is_run) game.draw();
  else {
    ctx.clearRect(0, 0, canw, canh);

    if (loader.is_run)
      loader.draw();
    else if (ui.is_run) {
      ui.update();
      ui.draw();
    } else if (scoreboard.is_run)
      scoreboard.draw();
  }
};

export function ctxDrawImage(ctx, img, b, c, d, e, f, g, h, i) {
  if ((img.tryLoad === undefined) || (img.tryLoad() === 1)) {
    if (i !== undefined)
      ctx.drawImage(img, b, c, Math.max(1, d), Math.max(1, e), f, g, h, i);
    else if (e !== undefined)
      ctx.drawImage(img, b, c, d, e);
    else
      ctx.drawImage(img, b, c);
  }
};