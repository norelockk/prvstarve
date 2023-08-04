import './assets/style.css';
import { can, render, resize } from './canvas';
import { install_game } from './game';

const game_body = document.getElementById("game_body") ?? document.querySelector("#game_body");

game_body.ondrop = () => false;
game_body.onresize = resize;
game_body.ondragstart = () => false;

can.oncontextmenu = () => false;

resize();
render();
install_game();