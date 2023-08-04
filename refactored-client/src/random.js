export default function Random(seed) {
  this.m = 0x80000000;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}

Random.prototype.random = function () {
  this.state = (this.a * this.state + this.c) % this.m;

  return this.state / this.m;
}

Random.prototype.set_seed = function (seed) {
  this.state = seed;
}