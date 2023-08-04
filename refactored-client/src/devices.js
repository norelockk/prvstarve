export function Mouse() {
  this.DOWN = 0, this.UP = 1, this.IDLE = 2, this.IN = 0, this.OUT = 1, this.pos = {
    x: 0,
    y: 0
  };

  this.x_old = 0;
  this.y_old = 0;
  this.angle = 0;
  this.state = this.IDLE;
  this.dist = this.IN;
  this.down = function () {
    this.state = this.DOWN;
  };
  this.up = function () {
    this.state = this.UP;
  };

  this.update = function () {
    if ((this.pos.x != this.x_old) || (this.pos.y != this.y_old)) {
      this.x_old = this.pos.x;
      this.y_old = this.pos.y;
      return true;
    }
    return false;
  };
}

export function Keyboard() {
  this.set_azerty = function () {
    this.LEFT = 81;
    this.RIGHT = 68;
    this.TOP = 90;
    this.DOWN = 83;
  };
  this.set_qwerty = function () {
    this.LEFT = 65;
    this.RIGHT = 68;
    this.TOP = 87;
    this.BOTTOM = 83;
  };
  this.UP = 0, this.DOWN = 1, this._1 = 49;
  this._2 = 50;
  this._3 = 51;
  this._4 = 52;
  this._5 = 53;
  this.CTRL = 17;
  this.ARROW_LEFT = 37;
  this.ARROW_RIGHT = 39;
  this.ARROW_TOP = 38;
  this.ARROW_BOTTOM = 40;
  this.SPACE = 32;
  this.R = 82;
  this.G = 71;
  this.V = 86;
  this.B = 66;
  this.set_qwerty();
  this.keys = new Array(255);

  for (let i = 0; i < 255; i++)
    this.keys[i] = this.UP;

  this.up = function (evt) {
    const k = Math.min(evt.charCode || evt.keyCode, 255);
    this.keys[k] = this.UP;
  };

  this.down = function (evt) {
    const k = Math.min(evt.charCode || evt.keyCode, 255);

    if ((k == this.LEFT) || (k == this.ARROW_LEFT))
      this.press_left();
    else if ((k == this.TOP) || (k == this.ARROW_TOP))
      this.press_top();
    else if ((k == this.DOWN) || (k == this.ARROW_DOWN))
      this.press_bottom();
    else if ((k == this.RIGHT) || (k == this.ARROW_RIGHT))
      this.press_right();

    this.keys[k] = this.DOWN;
    return k;
  };
  this.press_left = function () {
    this.keys[this.RIGHT] = this.UP;
    this.keys[this.ARROW_RIGHT] = this.UP;
  };
  this.press_right = function () {
    this.keys[this.LEFT] = this.UP;
    this.keys[this.ARROW_LEFT] = this.UP;
  };
  this.press_bottom = function () {
    this.keys[this.TOP] = this.UP;
    this.keys[this.ARROW_TOP] = this.UP;
  };
  this.press_top = function () {
    this.keys[this.BOTTOM] = this.UP;
    this.keys[this.ARROW_BOTTOM] = this.UP;
  };
  this.clear_directionnal = function () {
    this.keys[this.RIGHT] = this.UP;
    this.keys[this.ARROW_RIGHT] = this.UP;
    this.keys[this.LEFT] = this.UP;
    this.keys[this.ARROW_LEFT] = this.UP;
    this.keys[this.TOP] = this.UP;
    this.keys[this.ARROW_TOP] = this.UP;
    this.keys[this.BOTTOM] = this.UP;
    this.keys[this.ARROW_BOTTOM] = this.UP;
  };
  this.is_left = function () {
    return this.keys[this.LEFT] || this.keys[this.ARROW_LEFT];
  };
  this.is_right = function () {
    return this.keys[this.RIGHT] || this.keys[this.ARROW_RIGHT];
  };
  this.is_top = function () {
    return this.keys[this.TOP] || this.keys[this.ARROW_TOP];
  };
  this.is_bottom = function () {
    return this.keys[this.BOTTOM] || this.keys[this.ARROW_BOTTOM];
  };
  this.is_ctrl = function () {
    return this.keys[this.CTRL];
  };
  this.is_1 = function () {
    return this.keys[this._1];
  };
  this.is_2 = function () {
    return this.keys[this._2];
  };
  this.is_3 = function () {
    return this.keys[this._3];
  };
  this.is_4 = function () {
    return this.keys[this._4];
  };
  this.is_space = function () {
    return this.keys[this.SPACE];
  };
  this.is_r = function () {
    return this.keys[this.R];
  };
  this.is_g = function () {
    return this.keys[this.G];
  };
  this.is_v = function () {
    return this.keys[this.V];
  };
  this.is_b = function () {
    return this.keys[this.B];
  };
}