(function ($) {
  "use strict";

  // MENU
  $(".navbar-collapse a").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  // SCROLL REVEAL
  var revealItems = document.querySelectorAll(".kc-reveal");

  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
      );

      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }
  }

  // SOLID NAVBAR AFTER SCROLLING PAST THE HERO
  var navbar = document.querySelector(".navbar");

  if (navbar) {
    var toggleNavbar = function () {
      navbar.classList.toggle("kc-navbar--solid", window.scrollY > 40);
    };

    toggleNavbar();
    window.addEventListener("scroll", toggleNavbar, { passive: true });
  }
})(window.jQuery);
