/* RNG : random number generator       *
 * LCG : Linear congruential generator */

function RNG(seed) {

  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}

RNG.prototype.random = function () {

  this.state = (this.a * this.state + this.c) % this.m;

  return this.state / this.m;
}

RNG.prototype.set_seed = function (seed) {

  this.state = seed
}

RAND_SIZE = 10000;
RANDOM = [];
var rrr = new RNG();
rrr.set_seed(new Date().getTime());

for (var k = 0; k < RAND_SIZE; k++)
  RANDOM.push(rrr.random());
