import { delta } from "./canvas";

export const RNG = (function () {

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
    const m = 0x80000000; // 2**31;
    const a = 1103515245;
    const c = 12345;

    let state = seed ? seed : Math.floor(Math.random() * (m - 1));

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

// Represents a 2D vector with x and y coordinates
export function Vector(x, y) {
  this.x = x;
  this.y = y;
}

// Opens a URL in a new tab
export function open_in_new_tab(url) {
  const win = window.open(url, '_blank');
  if (win) win.focus();
}

// Opens a URL in a new browser window with specified features
export function open_in_new_box(url) {
  window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
}

// Compares two objects and returns true if they have the same properties and values
export function compare_object(a, b) {
  for (const i in a) {
    if (a[i] != b[i])
      return false;
  }
  return true;
}

// Compares two arrays, considering nested objects, and returns true if they are equal
export function compare_array(a, b) {
  if (a.length != b.length)
    return false;

  for (let i = 0; i < a.length; i++) {
    if (typeof a == 'object') {
      if (!compare_object(a[i], b[i]))
        return false;
    } else if (a[i] != b[i])
      return false;
  }
  return true;
}

// Copies the content of a source vector to a target vector
export function copy_vector(source, target) {
  target.x = source.x;
  target.y = source.y;
}

// Gets the vector between two points (v1 and v2)
export function get_vector(v1, v2) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  };
}

// Multiplies the components of a vector (v) by a scalar (mul)
export function mul_vector(v, mul) {
  v.x *= mul;
  v.y *= mul;
}

// Calculates the scalar product of two vectors (v1 and v2)
export function scalar_product(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

// Calculates the Euclidean norm (magnitude) of a vector (v)
export function norm(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

// Returns the sign of a number (1 if positive, -1 if negative, 0 if zero)
export function sign(a) {
  if (a < 0) {
    return -1;
  } else {
    return 1;
  }
}

// Calculates the cross product of two vectors (v1 and v2)
export function cross_product(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
}

// Calculates the angle between two points (ax, ay) and (bx, by) with respect to the x-axis
export function get_angle_2(ax, ay, bx, by) {
  const dy = by - ay;
  const dx = bx - ax;
  return Math.atan2(dy, dx);
}

// Calculates the angle (in radians) between two vectors (v1 and v2)
export function get_angle(v1, v2) {
  return (
    Math.acos(scalar_product(v1, v2) / (norm(v1) * norm(v2))) * sign(cross_product(v1, v2))
  );
}

// Extracts the value of a query parameter from the URL
export function getURLData(_name) {
  _name = _name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

  const _url = location.href;
  const regexS = "[\\?&]" + _name + "=([^&#]*)";
  const _regex = new RegExp(regexS);
  const results = _regex.exec(_url);
  
  return results === null ? null : results[1];
}

// Reduces an angle to its standard form (between -π to π)
export function reduceAngle(a1, a2) {
  const PI2 = Math.PI * 2;
  a2 = ((a2 % PI2) + PI2) % PI2;
  if (Math.abs(a1 - a2) > Math.PI) {
    if (a1 > a2) return a2 + PI2;
    else return a2 - PI2;
  }
  return a2;
}

// Calculates the standard angle between two points (o1 and o2) with respect to the x-axis
export function get_std_angle(o1, o2) {
  return get_angle({ x: 1, y: 0 }, get_vector(o1, o2));
}

// Calculates the Euclidean distance between two points (a and b)
export function dist(a, b) {
  return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
}

// Builds a new vector with given distance (d) and angle (a) from the origin
export function build_vector(d, a) {
  return {
    x: Math.cos(a) * d,
    y: Math.sin(a) * d,
  };
}

// Adds the components of a source vector to a target vector
export function add_vector(source, target) {
  source.x += target.x;
  source.y += target.y;
}

// Subtracts the components of a source vector from a target vector
export function sub_vector(source, target) {
  source.x -= target.x;
  source.y -= target.y;
}

// Translates a vector by adding x and y values to it
export function translate_vector(v, x, y) {
  v.x += x;
  v.y += y;
}

// Translates a vector by creating a new vector with added x and y values
export function translate_new_vector(v, x, y) {
  return {
    x: v.x + x,
    y: v.y + y,
  };
}

// Moves a point (o) in a direction (d) with a specified distance (a)
export function move(o, d, a) {
  o.x += Math.cos(a) * d;
  o.y += Math.sin(a) * d;
}

// Calculates the middle point between two numbers (a and b)
export function middle(a, b) {
  return Math.floor((a - b) / 2);
}

// Calculates the middle point between two vectors (a and b)
export function middle_point(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

// Returns a random sign (1 or -1)
export function rand_sign() {
  return Math.random() > 0.5 ? 1 : -1;
}

// Generates a random position within a circle defined by the center (x, y) and diameter (d)
export function get_rand_pos_in_circle(x, y, d) {
  const sx = rand_sign();
  const sy = rand_sign();
  const a = (Math.random() * Math.PI) / 2;
  return {
    x: Math.floor(x + Math.cos(a) * sx * d),
    y: Math.floor(y + Math.sin(a) * sy * d),
  };
}

// Represents a 2D bounding box
export function Box(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

// Randomizes the order of elements in an array
export function randomize_list(l) {
  const a = [];
  a.push.apply(a, l);

  const ra = [];

  while (a.length > 0) {
    const r = Math.floor(Math.random() * a.length);
    ra.push(a[r]);
    a.splice(r, 1);
  }

  return ra;
}

// Restores a number from a scaled representation used for storage
export function restore_number(n) {
  if (n >= 20000) n = (n - 20000) * 1000;
  else if (n >= 10000) n = (n - 10000) * 100;

  return n;
}

// Simplifies a large number by converting it to a short representation (e.g., 10,000 to "10k")
export function simplify_number(n) {
  if (typeof n !== "number") return "0";
  else if (n >= 10000) {
    const log = Math.floor(Math.log10(n)) - 2;
    const decimal = Math.max(0, 3 - log);
    const s = Math.floor(n / 1000).toString();
    if (decimal) {
      s +=
        "." +
        ((n % 1000) / 1000)
          .toString()
          .substring(2)
          .substring(0, decimal);
      for (let i = s.length - 1, zero_counter = 0; i > 0; i--) {
        if (s[i] != "0") break;
        else zero_counter++;
      }
      s = s.substring(0, s.length - zero_counter);
      if (s[s.length - 1] == ".") s = s.substring(0, s.length - 1);
    }
    s += "k";
    return s;
  } else return n.toString();
}

// Easing functions
export function ease_out_quad(t) {
  return t * (2 - t);
}
export function ease_out_cubic(t) {
  return t * t * t + 1;
}
export function ease_in_out_quad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
export function ease_in_out_cubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
export function ease_in_out_quart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}
export function ease_out_quart(t) {
  return 1 - (--t) * t * t * t;
}
export function ease_out_quint(t) {
  return 1 + (--t) * t * t * t * t;
}

// Represents a linear animation that oscillates between two values
export function LinearAnimation(o, v, max, min, max_speed, min_speed) {
  this.o = o;
  this.v = v;
  this.max = max;
  this.min = min;
  this.max_speed = max_speed;
  this.min_speed = min_speed;
  this.last = 0;
  this.update = function () {
    if (this.o) {
      const v = this.v + delta * this.max_speed;
      if (v > this.max) {
        this.v = this.max;
        this.o = false;
        return true;
      } else this.v = v;
    } else {
      const v = this.v - delta * this.min_speed;
      if (v < this.min) {
        this.v = this.min;
        this.o = true;
      } else this.v = v;
    }
  };
  return false;
}

// Represents an easing export function that animates a value
export function Ease(fun, ed, em, sx, x, ex) {
  this.fun = fun;
  this.ed = ed;
  this.em = em;
  this.sx = sx;
  this.x = x;
  this.ex = ex;
  this.restart = function () {
    this.x = this.sex;
    this.ed = 0;
  };
  this.ease = function (x) {
    if (x !== this.ex) {
      this.ex = x;
      this.sx = this.x;
      this.ed = 0;
    }
    if (this.ex !== this.x) {
      this.ed += delta;
      if (this.ed > this.em) this.x = this.ex;
      else {
        const e = this.fun(this.ed / this.em);
        this.x = this.sx + (this.ex - this.sx) * e;
      }
    }
  };
}

// Represents an easing export function that animates two values (x and y)
export function Ease2d(fun, ed, em, sx, sy, x, y, ex, ey) {
  this.fun = fun;
  this.ed = ed;
  this.em = em;
  this.sx = sx;
  this.sy = sy;
  this.x = x;
  this.y = y;
  this.ex = ex;
  this.ey = ey;
  this.ease = function (u) {
    if (u.x != this.ex || u.y != this.ey) {
      this.ex = u.x;
      this.ey = u.y;
      this.sx = this.x;
      this.sy = this.y;
      this.ed = 0;
    }
    if (this.ex != this.x || this.ey != this.y) {
      this.ed += delta;
      if (this.ed > this.em) {
        this.x = this.ex;
        this.y = this.ey;
      } else {
        const e = this.fun(this.ed / this.em);
        this.x = this.sx + (this.ex - this.sx) * e;
        this.y = this.sy + (this.ey - this.sy) * e;
      }
    }
  };
}

// Generates a random alphanumeric token of the given length
export function generate_token(len) {
  let token = "";
  for (let i = 0; i < len; i++) {
    token += String.fromCharCode(48 + Math.floor(Math.random() * 74));
  }
  return token;
}

// Gets the value of a query parameter from the URL
export function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regexS = ("[\\?&]" + name) + "=([^&#]*)";
  const regex = new RegExp(regexS);
  const results = regex.exec(url);
  return results == null ? null : results[1];
}

// Checks if a point (vector) is inside a bounding box
export function inside_box(p, box) {
  if (
    p.x >= box.x &&
    p.x <= box.x + box.w &&
    p.y >= box.y &&
    p.y <= box.y + box.h
  )
    return true;

  return false;
}

// Checks if two axis-aligned bounding boxes intersect
export function intersect_aabb(b1x1, b1x2, b1y1, b1y2, b2x1, b2x2, b2y1, b2y2) {
  if (
    Math.max(b1x1, b2x1) < Math.min(b1x2, b2x2) &&
    Math.max(b1y1, b2y1) < Math.min(b1y2, b2y2)
  )
    return 1;

  return 0;
}

// Linear interpolation between two values with a weight
export function lerp(p1, p2, w) {
  return (1 - w) * p1 + w * p2;
}

// Escapes HTML entities to prevent XSS attacks
export function escape_html(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}