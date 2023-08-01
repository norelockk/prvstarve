Utils = {
  open_in_new_tab: function (url) {
    var win = window.open(url, '_blank');
    win.focus();
  },
  open_in_new_box: function (url) {
    window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  },
  compare_object: function (a, b) {
    for (var i in a) {
      if (a[i] != b[i])
        return false;

    }
    return true;
  },
  compare_array: function (a, b) {
    if (a.length != b.length)
      return false;

    for (var i = 0; i < a.length; i++) {
      if (typeof a == 'object') {
        if (!this.compare_object(a[i], b[i]))
          return false;

      } else if (a[i] != b[i])
        return false;

    }
    return true;
  },
  copy_vector: function (source, target) {
    target.x = source.x;
    target.y = source.y;
  },
  get_vector: function (v1, v2) {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y
    };
  },
  mul_vector: function (v, mul) {
    v.x *= mul, v.y *= mul;
  },
  scalar_product: function (v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
  },
  norm: function (v) {
    return Math.sqrt((v.x * v.x) + (v.y * v.y));
  },
  sign: function (a) {
    if (a < 0)
      return -1;
    else
      return 1;
  },
  cross_product: function (v1, v2) {
    return (v1.x * v2.y) - (v1.y * v2.x);
  },
  get_angle_2: function (ax, ay, bx, by) {
    var dy = by - ay;
    var dx = bx - ax;
    return Math.atan2(dy, dx);
  },
  get_angle: function (v1, v2) {
    return Math.acos(this.scalar_product(v1, v2) / (this.norm(v1) * this.norm(v2))) * this.sign(this.cross_product(v1, v2));
  },
  getURLData: function (_name) {
    _url = location.href;
    _name = _name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = ("[\\?&]" + _name) + "=([^&#]*)";
    var _regex = new RegExp(regexS);
    var results = _regex.exec(_url);
    return (results === null) ? null : results[1];
  },
  reduceAngle: function (a1, a2) {
    var PI2 = Math.PI * 2;
    a2 = ((a2 % PI2) + PI2) % PI2;
    if (Math.abs(a1 - a2) > Math.PI) {
      if (a1 > a2)
        return a2 + PI2;
      else
        return a2 - PI2;
    }
    return a2;
  },
  get_std_angle: function (o1, o2) {
    return this.get_angle({
      x: 1,
      y: 0
    }, this.get_vector(o1, o2));
  },
  dist: function (a, b) {
    return Math.sqrt(((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)));
  },
  build_vector: function (d, a) {
    return {
      x: Math.cos(a) * d,
      y: Math.sin(a) * d
    };
  },
  add_vector: function (source, target) {
    source.x += target.x;
    source.y += target.y;
  },
  sub_vector: function (source, target) {
    source.x -= target.x;
    source.y -= target.y;
  },
  translate_vector: function (v, x, y) {
    v.x += x;
    v.y += y;
  },
  translate_new_vector: function (v, x, y) {
    return {
      x: v.x + x,
      y: v.y + y
    };
  },
  move: function (o, d, a) {
    o.x += Math.cos(a) * d;
    o.y += Math.sin(a) * d;
  },
  middle: function (a, b) {
    return Math.floor((a - b) / 2);
  },
  middle_point: function (a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  },
  rand_sign: function () {
    return (Math.random() > 0.5) ? 1 : -1;
  },
  get_rand_pos_in_circle: function (x, y, d) {
    var sx = this.rand_sign();
    var sy = this.rand_sign();
    var a = (Math.random() * Math.PI) / 2;
    return {
      x: Math.floor(x + ((Math.cos(a) * sx) * d)),
      y: Math.floor(y + ((Math.sin(a) * sy) * d))
    };
  },
  Box: function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  },
  randomize_list: function (l) {
    a = [];
    a.push.apply(a, l);
    var ra = [];
    while (a.length > 0) {
      var r = Math.floor(Math.random() * a.length);
      ra.push(a[r]);
      a.splice(r, 1);
    }
    return ra;
  },
  restore_number: function (n) {
    if (n >= 20000)
      n = (n - 20000) * 1000;
    else if (n >= 10000)
      n = (n - 10000) * 100;

    return n;
  },
  simplify_number: function (n) {
    if (typeof n !== "number")
      return "0";
    else if (n >= 10000) {
      var log = Math.floor(Math.log10(n)) - 2;
      var decimal = Math.max(0, 3 - log);
      var s = Math.floor(n / 1000).toString();
      if (decimal) {
        s += "." + ((n % 1000) / 1000).toString().substring(2).substring(0, decimal);;
        for (var i = s.length - 1, zero_counter = 0; i > 0; i--) {
          if (s[i] != '0')
            break;
          else
            zero_counter++;
        }
        s = s.substring(0, s.length - zero_counter);
        if (s[s.length - 1] == '.')
          s = s.substring(0, s.length - 1);

      }
      s += "k";
      return s;
    } else
      return n.toString();
  },
  ease_out_quad: function (t) {
    return t * (2 - t);
  },
  ease_out_cubic: function (t) {
    return (((--t) * t) * t) + 1;
  },
  ease_in_out_quad: function (t) {
    return (t < 0.5) ? ((2 * t) * t) : (-1 + ((4 - (2 * t)) * t));
  },
  ease_in_out_cubic: function (t) {
    return (t < 0.5) ? (((4 * t) * t) * t) : ((((t - 1) * ((2 * t) - 2)) * ((2 * t) - 2)) + 1);
  },
  ease_in_out_quart: function (t) {
    return (t < 0.5) ? ((((8 * t) * t) * t) * t) : (1 - ((((8 * (--t)) * t) * t) * t));
  },
  ease_out_quart: function (t) {
    return 1 - ((((--t) * t) * t) * t);
  },
  ease_out_quint: function (t) {
    return 1 + (((((--t) * t) * t) * t) * t);
  },
  LinearAnimation: function (o, v, max, min, max_speed, min_speed) {
    this.o = o;
    this.v = v;
    this.max = max;
    this.min = min;
    this.max_speed = max_speed;
    this.min_speed = min_speed;
    this.last = 0;
    this.update = function () {
      if (this.o) {
        var v = this.v + (delta * this.max_speed);
        if (v > this.max) {
          this.v = this.max;
          this.o = false;
          return true;
        } else
          this.v = v;
      } else {
        var v = this.v - (delta * this.min_speed);
        if (v < this.min) {
          this.v = this.min;
          this.o = true;
        } else
          this.v = v;
      }
    };
    return false;
  },
  Ease: function (fun, ed, em, sx, x, ex) {
    this.fun = fun;
    this.ed = ed, this.em = em, this.sx = sx, this.x = x, this.ex = ex, this.restart = function () {
      this.x = this.sex;
      this.ed = 0;
    }, this.ease = function (x) {
      if (x !== this.ex) {
        this.ex = x;
        this.sx = this.x;
        this.ed = 0;
      }
      if (this.ex !== this.x) {
        this.ed += delta;
        if (this.ed > this.em)
          this.x = this.ex;
        else {
          var e = this.fun(this.ed / this.em);
          this.x = this.sx + ((this.ex - this.sx) * e);
        }
      }
    };
  },
  Ease2d: function (fun, ed, em, sx, sy, x, y, ex, ey) {
    this.fun = fun;
    this.ed = ed, this.em = em, this.sx = sx, this.sy = sy, this.x = x, this.y = y, this.ex = ex, this.ey = ey, this.ease = function (u) {
      if ((u.x != this.ex) || (u.y != this.ey)) {
        this.ex = u.x;
        this.ey = u.y;
        this.sx = this.x;
        this.sy = this.y;
        this.ed = 0;
      }
      if ((this.ex != this.x) || (this.ey != this.y)) {
        this.ed += delta;
        if (this.ed > this.em) {
          this.x = this.ex;
          this.y = this.ey;
        } else {
          var e = this.fun(this.ed / this.em);
          this.x = this.sx + ((this.ex - this.sx) * e);
          this.y = this.sy + ((this.ey - this.sy) * e);
        }
      }
    };
  },
  generate_token: function (len) {
    var token = "";
    for (var i = 0; i < len; i++) {
      token += String.fromCharCode(48 + Math.floor(Math.random() * 74));
    }
    return token;
  },
  gup: function (name, url) {
    if (!url)
      url = location.href;

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = ("[\\?&]" + name) + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return (results == null) ? null : results[1];
  },
  inside_box: function (p, box) {
    if ((((p.x >= box.x) && (p.x <= (box.x + box.w))) && (p.y >= box.y)) && (p.y <= (box.y + box.h)))
      return true;

    return false;
  },
  intersect_aabb: function (b1x1, b1x2, b1y1, b1y2, b2x1, b2x2, b2y1, b2y2) {
    if ((Math.max(b1x1, b2x1) < Math.min(b1x2, b2x2)) && (Math.max(b1y1, b2y1) < Math.min(b1y2, b2y2)))
      return 1;

    return 0;
  },
  lerp: function (p1, p2, w) {
    return ((1 - w) * p1) + (w * p2);
  },
  escape_html: function (unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
};