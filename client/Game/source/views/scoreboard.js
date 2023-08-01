function open_twitter() {
  Utils.open_in_new_box(((('https://twitter.com/intent/tweet?text=I%20survived%20' + user.day) + '%20days%20with%20') + user.die.score) + '%20points%20in%20http%3A%2F%2Fstarve.io%2F%20%23starve.io');
};

function open_facebook() {
  Utils.open_in_new_box('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.starve.io%2F&display=popup&ref=plugin&src=like&kid_directed_site=0');
};

function Scoreboard(can, ctx) {
  this.can = can;
  this.ctx = ctx;
  var _this = this;
  this.enable_interface = false;
  this.sb = {
    id: document.getElementById("scoreboard"),
    style: document.getElementById("scoreboard").style,
    height: 0,
    translate: {
      x: 0,
      y: 0
    },
    update: function () {
      this.style.left = this.translate.x + "px";
      this.style.top = this.translate.y + "px";
    },
    init: function () {
      this.id.innerHTML = (((((((((((((((((((((((((('<div style=\"position:absolute;\"> <img src=\"./graphics/scoreboard.png\"style=\"width:250px;transform:translate(125px, -80px);\"> </img> </div><div><div id=\"whokilled\">' + user.die.howdie) + '</div></div><div class=\"deco\" style=\"margin-top:35px;\"></div><div class=\"deco\"></div><div><div class=\"stats\"> ') + LANG[TEXT.DAYS_SURVIVED]) + ' : ') + user.day) + '</div><div class=\"stats\"> ') + LANG[TEXT.KILL]) + ' : ') + user.die.kill) + '</div></div>') + '<div id=\"flexDisplay\"><div id=\"score\"> ') + LANG[TEXT.SCORE]) + ' : ') + user.die.score) + '</div><div id=\"breadWon\"><span id=\"breadWonInner\">0</span><img src=\"./graphics/golden-bread.png\" style=\"width:50px;margin-left:-25px;transform: translate(37px, 8px);\"></img></div></div><div><div id=\"points\"> ') + user.die.bank) + ' ') + LANG[TEXT.POINTS]) + '</div></div><div id=\"shop_points\">') + LANG[TEXT.KIT_NEXT]) + '</div><div style=\"display:inline-block;\"><div class=\"social\" id=\"tttwitter\">') + LANG[TEXT.TWITTER]) + '</div><div class=\"social\" id=\"fffacebook\">') + LANG[TEXT.FACEBOOK]) + '</div></div><div id=\"bbback\">') + LANG[TEXT.BACK_TO_THE_GAME]) + '</div>';
      this.style.display = 'inline-block';
      document.getElementById("tttwitter").addEventListener("mouseup", open_twitter, false);
      document.getElementById("bbback").addEventListener("mouseup", function () {
        scoreboard.quit(ui.run);
      }, false);
      document.getElementById("fffacebook").addEventListener("mouseup", open_facebook, false);
      this.height = Math.floor(this.id.clientHeight / 2);
      getBreadAndScore();
    }
  };
  var appear_effect_step = 0;
  var appear_effect_max_step = 30;
  var appear_effect = function () {
    _this.update();
    appear_effect_step++;
    if (appear_effect_step == appear_effect_max_step) {
      _this.update();
      return;
    }
    window.setTimeout(appear_effect, 33);
  };
  this.quit = function (fun) {
    if (_this.enable_interface === true) {
      _this.enable_interface = false;
      fun_after_quit = fun;
      quit_effect_step = -1;
      quit_effect();
    }
  };
  var fun_after_quit;
  var quit_effect_step = -1;
  var quit_effect_max_step = 30;
  var quit_effect = function () {
    _this.update();
    quit_effect_step++;
    if (quit_effect_step == quit_effect_max_step) {
      _this.stop();
      _this.sb.style.display = 'none';
      fun_after_quit();
      return;
    }
    window.setTimeout(quit_effect, 33);
  };
  this.is_run = false;
  this.stop = function () {
    this.is_run = false;
  };
  this.run = function () {
    document.getElementById("game_body").style.backgroundColor = SPRITE.GROUND[fake_world.time];
    _this.sb.init();
    _this.is_run = true;
    _this.enable_interface = true;
    
    quit_effect_step = -1;
    appear_effect_step = 0;
    appear_effect();
  };
  this.update = function () {
    this.sb.translate.x = Math.floor(canw2 - 275);
    this.sb.translate.y = Math.floor((canh2 - this.sb.height) - 28);

    if ((appear_effect_step != appear_effect_max_step) || (quit_effect_step != -1)) {
      var move_effect = 0;
      if (appear_effect_step != appear_effect_max_step) {
        var move_effect = (1500 / (appear_effect_step + 1)) - 50;
      }
      if (quit_effect_step != -1) {
        var move_effect = -((1750 / ((quit_effect_max_step - quit_effect_step) + 1)) - 48);
      }
      this.sb.translate.y -= move_effect;
    }
    this.sb.update();
  };
  this.draw = function () {
    draw_fake_world();
    user.alert.draw("#FFF", "#000");
  };
};