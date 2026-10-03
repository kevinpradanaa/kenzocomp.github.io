//jquery-click-scroll
//by syamsul'isul' Arifin
//updated: safe handling for missing sections + responsive nav offset

(function ($) {
  "use strict";

  var SECTION_IDS = ["section_1", "section_2", "section_3", "section_4", "section_5"];

  function navOffset() {
    var $nav = $(".navbar");
    return $nav.length ? $nav.outerHeight() : 0;
  }

  function sectionTop(id) {
    var $section = $("#" + id);
    return $section.length ? $section.offset().top : null;
  }

  function setActive(index) {
    var $links = $(".navbar-nav .nav-item .nav-link");
    $links.removeClass("active");
    $links.eq(index).addClass("active");
  }

  function updateActiveSection() {
    var scrollTop = $(document).scrollTop() + navOffset() + 1;
    var activeIndex = 0;

    $.each(SECTION_IDS, function (index, id) {
      var top = sectionTop(id);
      if (top !== null && scrollTop >= top) {
        activeIndex = index;
      }
    });

    setActive(activeIndex);
  }

  $(document).on("scroll", updateActiveSection);

  $(".click-scroll").on("click", function (event) {
    var target = $(this).attr("href");
    var top = target ? sectionTop(target.replace("#", "")) : null;

    if (top === null) {
      return;
    }

    event.preventDefault();
    $("html, body").animate({ scrollTop: top - navOffset() + 1 }, 400);
  });

  $(function () {
    updateActiveSection();
  });
})(window.jQuery);
