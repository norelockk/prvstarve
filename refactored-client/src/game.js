import { Mouse, Keyboard } from './devices';
import NetworkClient from './network';

export const mouse = new Mouse();
export const keyboard = new Keyboard();
export const client = new NetworkClient();

export const sprite = [];

export let MAP = [];
export let COSMETICS = {};
export let MINIMAP_LIST = [];
export let MINIMAP_UTILS = [];

export let ui = { is_run: false };
export let game = {};
export let user;
export let world;
export let loader = { is_run: false };
export let scoreboard = { is_run: false };

export const fake_world = {};

export const init = () => {
  fake_world.time = ~~(Math.random() * 2);
  fake_world.items = [];
};