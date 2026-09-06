/* =====================================================================
   carousel.js — Pile de cartes des réalisations
   Empilement en profondeur (perspective, scale, décalage vertical),
   une carte active à la fois. Navigation par flèches, pastilles,
   clavier (← →) et swipe horizontal. Le panneau d'informations à
   droite se met à jour avec la carte active.
   ===================================================================== */

(function () {
  "use strict";

  var stage = document.getElementById("cases-stage");
  var info = document.getElementById("cases-info");
  var dotsWrap = document.getElementById("cases-dots");
  var prevBtn = document.querySelector(".cases-nav--prev");
  var nextBtn = document.querySelector(".cases-nav--next");
  if (!stage || !info || !dotsWrap || !prevBtn || !nextBtn) return;

  var cards = Array.prototype.slice.call(stage.querySelectorAll(".case-card"));
  var total = cards.length;
  if (!total) return;

  var FRAME_OFFSET = -24;
  var SCALE_FACTOR = 0.09;
  var MIN_SCALE = 0.7;
  var FRAMES_VISIBLE = 3;
  var INFO_FADE_MS = 160;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var current = 0;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function render(animateInfo) {
    cards.forEach(function (card, i) {
      var offset = i - current;
      var passed = offset < 0;
      var scale = reduceMotion ? 1 : clamp(1 - offset * SCALE_FACTOR, MIN_SCALE, 1);
      var y = reduceMotion ? 0 : clamp(offset * FRAME_OFFSET, FRAME_OFFSET * FRAMES_VISIBLE, 0);

      card.style.transform = "translate(-50%, -50%) translateY(" + y + "px) scale(" + scale + ")";
      card.style.opacity = passed ? "0" : "1";
      card.style.zIndex = String(total - i);
      card.style.pointerEvents = i === current ? "auto" : "none";
      card.setAttribute("aria-hidden", i === current ? "false" : "true");
    });

    var dots = dotsWrap.querySelectorAll(".cases-deck__dot");
    dots.forEach(function (dot, i) {
      dot.setAttribute("aria-selected", i === current ? "true" : "false");
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    var data = cards[current].querySelector(".case-card__data");
    if (!data) return;

    if (!animateInfo || reduceMotion) {
      info.innerHTML = data.innerHTML;
      return;
    }

    info.style.opacity = "0";
    window.setTimeout(function () {
      info.innerHTML = data.innerHTML;
      info.style.opacity = "1";
    }, INFO_FADE_MS);
  }

  function goTo(index) {
    var target = clamp(index, 0, total - 1);
    if (target === current) return;
    current = target;
    render(true);
  }

  dotsWrap.innerHTML = "";
  cards.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "cases-deck__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Réalisation " + (i + 1) + " sur " + total);
    dot.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  prevBtn.addEventListener("click", function () { goTo(current - 1); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); });

  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
  });

  var touchStartX = 0;
  var touchStartY = 0;
  stage.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      goTo(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  render(false);
})();
