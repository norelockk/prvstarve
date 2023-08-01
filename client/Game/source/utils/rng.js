var RNG = (function () {

  /** 
   * RNG : random number generator
   * LCG : Linear congruential generator
   * @module RNG
   */

  /**
   * Class to generate random number
   * @param {number} seed 
   * @memberOf module:RNG
   */
  function Random(seed) {

    // LCG using GCC's constants
    var m = 0x80000000; // 2**31;
    var a = 1103515245;
    var c = 12345;

    var state = seed ? seed : Math.floor(Math.random() * (m - 1));

    /**
     * Method to init (or reinit the random generator)
     * @param {number} seed 
     * @memberOf module:RNG
     */
    this.init = function (seed) {

      state = seed ? seed : Math.floor(Math.random() * (m - 1));
    };

    /**
     * Method to get the next random generated number
     * @memberOf module:RNG
     */
    this.get = function () {

      state = (a * state + c) % m;
      return state / m;
    }
  };

  return {

    Random: Random,
  };
})();