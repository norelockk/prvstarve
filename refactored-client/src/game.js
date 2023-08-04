import { Mouse, Keyboard } from './devices';
import { create_images, init_fake_world } from './graphics/flat';
import { can, ctx } from './canvas';
import NetworkClient from './network';
import set_english from './text/english';
import Loader from './views/loader';
import Game from './views/game';
import UI from './views/ui';
import User from './user';
import Random from './random';

export const RANDOM = [];
export const RAND_SIZE = 10000;

export const mouse = new Mouse();
export const sprite = [];
export const client = new NetworkClient();
export const keyboard = new Keyboard();
export const fake_world = {};

const rrr = new Random();
rrr.set_seed(new Date().getTime());

for (let k = 0; k < RAND_SIZE; k++) RANDOM.push(rrr.random());

export let MAP = [];
export let OLD_RECIPES = undefined;
export let MINIMAP_LIST = [];
export let MINIMAP_UTILS = [];

export let ui = { is_run: false };
export let game = {};
export let user;
export let world;
export let loader = { is_run: false };
export let scoreboard = { is_run: false };

export const install_game = () => {
  // Initialize fake world
  fake_world.time = ~~(Math.random() * 2);
  fake_world.items = [];
  init_fake_world();

  // Set english game translation
  set_english();

  // Setup loader
  loader = new Loader(can, ctx, function() {
    // Load images
    create_images();

    // Load game
    game = new Game(can, ctx);

    // Load UI
    ui = new UI(can, ctx);

    // Load user data
    user = new User();

    loader.quit(function() {
      loader.logo.style.display = "none";
      ui.run();
    })
  });
};