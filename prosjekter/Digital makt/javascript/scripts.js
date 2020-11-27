/*
if space between window and top is greater than 850: make nav change background and font-color
[from jsfiddle:
http://jsfiddle.net/onigetoc/1e8k9q8b/]

make house icon change color (change icon src)
[from https://codepen.io/fabuchao/pen/xwbRaa]
*/


var myNav = $("nav");
var myNavMobile = $(".navMobile");
var myHouse = $("nav ul li a img");


$(window).on("scroll", function() {
  "use strict";
  if ($(window).scrollTop() >= 850) {
    myNav.addClass("scroll");
    myHouse.attr("src", "../ikoner/home-gray.svg");
  } else {
    myNav.removeClass("scroll");
    myHouse.attr("src", "../ikoner/home.svg");
  }
});

$(window).on("scroll", function() {
  "use strict";
  if ($(window).scrollTop() >= 550) {
    myNavMobile.addClass("scroll");
    myHouse.attr("src", "../ikoner/home-gray.svg");
  } else {
    myNavMobile.removeClass("scroll");
    myHouse.attr("src", "../ikoner/home.svg");
  }
});








/*
hamburger menu for mobile nav:
http://www.qdigitalstudio.com/library/responsive-toggle-menu

if the function finds the next .navigation is visible,
toggle its visibility
*/

(function($) {
  $.fn.collapsable = function(options) {
    // iterate and reformat each matched element
    return this.each(function() {
      // cache this:
      var obj = $(this);
      var tree = obj.next('.navigation');
      obj.click(function() {
        if (obj.is(':visible')) {
          tree.toggle();
        }
      });
    });
  };
})(jQuery);

$(document).ready(function() {
    $('.slide-trigger').collapsable();
});
