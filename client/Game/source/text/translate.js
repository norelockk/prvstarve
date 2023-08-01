var LANG = [];

for (var i = 0; i < COUNTER; i++)
  LANG[i] = "";

var DIE = [];

$('.md-languages').on('click', function () {
  $(this).toggleClass('active')
})

$('.md-languages ul li').on('click', function () {

  var v = $(this).text();
  if (v === "English") set_english();
  else if (v === "FranÃ§ais") set_french();
  else if (v === "Deutsch") set_german();
  else if (v === "EspaÃ±ol") set_spanish();
  else if (v === "PortuguÃªs") set_portuguese();
  else if (v === "Ð ÑƒÑÑÐºÐ¸Ð¹") set_russian();
  else if (v === "Polski") set_polish();

  // Reset the tooltips system
  INFO_BOX = [];

  // Reset the build mode indicator
  user.craft.label = [];

  $('.md-languages ul li').removeClass('active');
  $(this).addClass('active');
  $('.md-languages label button').text(v)
});

$('#game_canvas').on('click', function () {
  $('.md-languages').removeClass('active');
  $('.md-select').removeClass('active');
});

/* Determinate language of browser */
var lang = "EN";
var userlang = navigator.language || navigator.userLanguage;
switch (userlang) {

  case "ru": lang = "RU"; break;
  case "en": lang = "EN"; break;
  case "es": lang = "SP"; break;
  case "fr": lang = "FR"; break;
  //case "it" : lang = "IT"; break;
  case "pl": lang = "PL"; break;
  case "de": lang = "DE"; break;
  case "pt": lang = "PT"; break;

}

var next_lang;

if (lang === "FR") {
  $('.md-languages label button').text("FranÃ§ais")
  next_lang = set_french;

} else if (lang === "PL") {
  $('.md-languages label button').text("Polski")
  next_lang = set_polish;

} else if (lang === "PT") {
  $('.md-languages label button').text("PortuguÃªs")
  next_lang = set_portuguese;
} else if (lang === "SP") {
  $('.md-languages label button').text("EspaÃ±ol")
  next_lang = set_spanish;

} else if (lang === "RU") {
  $('.md-languages label button').text("Ð ÑƒÑÑÐºÐ¸Ð¹")
  next_lang = set_russian;

} else if (lang === "DE") {
  $('.md-languages label button').text("Deutsch")
  next_lang = set_german;

} else {
  $('.md-languages label button').text("English")
  next_lang = set_english;
}