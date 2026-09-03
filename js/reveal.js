/* =====================================================================
   reveal.js — Apparition progressive des sections au défilement
   Ajoute la classe .is-visible aux éléments .reveal quand ils
   entrent dans la fenêtre. Repli : tout est affiché si l'API manque.
   ===================================================================== */

(function () {
  "use strict";

  var revealables = document.querySelectorAll(".reveal");
  if (!revealables.length) return;

  if (!("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealables.forEach(function (el) {
    observer.observe(el);
  });
})();
