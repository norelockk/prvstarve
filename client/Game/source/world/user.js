function Flakes(id, x, y, angle) {
  this.id = id;
  this.speed = (id + 5) * 8;
  this.life = canw / 1366;
  this.x = x;
  this.y = y;
  this.c = Math.cos(angle);
  this.s = Math.sin(angle);
  this.alpha = 0;
};
