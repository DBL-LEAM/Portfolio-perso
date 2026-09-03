/* =====================================================================
   navigation.js — Navbar
   1. État "scrolled" (filet sous la barre au défilement)
   2. Menu mobile (bouton hamburger)
   ===================================================================== */

(function () {
  "use strict";

  var nav = document.getElementById("nav");
  if (!nav) return;

  /* 1. État "scrolled" ---------------------------------------------- */
  var ticking = false;

  function updateNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateNav();

  /* 2. Menu mobile ------------------------------------------------- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Fermer après un clic sur un lien
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  // Fermer avec Échap
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
})();
