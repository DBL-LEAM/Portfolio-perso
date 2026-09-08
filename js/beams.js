/* =====================================================================
   beams.js — Faisceaux lumineux animés en fond du hero
   Dessin canvas 2D : traits obliques flous qui remontent en boucle.
   Repli : un seul rendu statique si l'utilisateur préfère moins
   d'animations (prefers-reduced-motion).
   ===================================================================== */

(function () {
  "use strict";

  var canvas = document.querySelector(".hero__beams");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var INTENSITY = 1; // 0.7 = subtil, 0.85 = moyen, 1 = marqué
  var MINIMUM_BEAMS = 20;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var beams = [];
  var frameId = null;
  var dpr = window.devicePixelRatio || 1;

  // Sur petit écran, des faisceaux aussi larges que sur desktop se
  // chevauchent dans les 3 colonnes et finissent en une nappe uniforme peu
  // lisible : on les rétrécit pour qu'ils restent distincts.
  function isNarrowViewport() {
    return window.innerWidth <= 600;
  }

  function createBeam(width, height) {
    var narrow = isNarrowViewport();
    return {
      x: Math.random() * width * 1.5 - width * 0.25,
      y: Math.random() * height * 1.5 - height * 0.25,
      width: (narrow ? 18 + Math.random() * 34 : 30 + Math.random() * 60),
      length: height * 2.5,
      angle: -35 + Math.random() * 10,
      speed: (0.6 + Math.random() * 1.2) * 0.43,
      opacity: (narrow ? 0.16 + Math.random() * 0.17 : 0.08 + Math.random() * 0.1),
      hue: 190 + Math.random() * 70,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: (0.02 + Math.random() * 0.03) * 0.43
    };
  }

  function resetBeam(beam, index, total) {
    var narrow = isNarrowViewport();
    var column = index % 3;
    var spacing = canvas.width / 3;

    beam.y = canvas.height + 100;
    beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
    beam.width = (narrow ? 55 + Math.random() * 55 : 100 + Math.random() * 100);
    beam.speed = (0.5 + Math.random() * 0.4) * 0.43;
    beam.hue = 190 + (index * 70) / total;
    beam.opacity = (narrow ? 0.24 + Math.random() * 0.15 : 0.12 + Math.random() * 0.08);
    return beam;
  }

  function drawBeam(beam) {
    ctx.save();
    ctx.translate(beam.x, beam.y);
    ctx.rotate((beam.angle * Math.PI) / 180);

    // Sur petit écran, des couleurs un peu plus saturées/claires aident les
    // faisceaux à ressortir malgré la faible largeur de l'écran.
    var narrow = isNarrowViewport();
    var sat = narrow ? "92%" : "85%";
    var light = narrow ? "70%" : "65%";

    var pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * INTENSITY;

    var gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
    gradient.addColorStop(0, "hsla(" + beam.hue + ", " + sat + ", " + light + ", 0)");
    gradient.addColorStop(0.1, "hsla(" + beam.hue + ", " + sat + ", " + light + ", " + pulsingOpacity * 0.5 + ")");
    gradient.addColorStop(0.4, "hsla(" + beam.hue + ", " + sat + ", " + light + ", " + pulsingOpacity + ")");
    gradient.addColorStop(0.6, "hsla(" + beam.hue + ", " + sat + ", " + light + ", " + pulsingOpacity + ")");
    gradient.addColorStop(0.9, "hsla(" + beam.hue + ", " + sat + ", " + light + ", " + pulsingOpacity * 0.5 + ")");
    gradient.addColorStop(1, "hsla(" + beam.hue + ", " + sat + ", " + light + ", 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
    ctx.restore();
  }

  function updateCanvasSize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var total = Math.round(MINIMUM_BEAMS * 1.5);
    beams = [];
    for (var i = 0; i < total; i++) {
      beams.push(createBeam(canvas.width, canvas.height));
    }
  }

  function renderStaticFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beams.forEach(function (beam) { drawBeam(beam); });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var total = beams.length;
    beams.forEach(function (beam, index) {
      beam.y -= beam.speed;
      beam.pulse += beam.pulseSpeed;

      if (beam.y + beam.length < -100) {
        resetBeam(beam, index, total);
      }

      drawBeam(beam);
    });

    frameId = requestAnimationFrame(animate);
  }

  updateCanvasSize();

  if (reduceMotion) {
    renderStaticFrame();
  } else {
    animate();
  }

  var resizeTimeout;
  var lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Sur mobile, l'apparition/disparition de la barre d'adresse au scroll
      // déclenche un resize qui ne change que la hauteur : on l'ignore pour
      // ne pas régénérer les faisceaux et faire "sauter" l'animation.
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      updateCanvasSize();
      if (reduceMotion) renderStaticFrame();
    }, 150);
  });

  window.addEventListener("beforeunload", function () {
    if (frameId) cancelAnimationFrame(frameId);
  });
})();
