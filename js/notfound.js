/* =====================================================================
   notfound.js — Page 404
   1. Affiche l'adresse réellement demandée (barre du cadre navigateur,
      trace HTTP, dernière ligne du sommaire)
   2. Compare cette adresse aux quatre sections du site et propose la plus
      proche quand il y en a une

   Tout passe par textContent : le chemin vient de l'URL, donc de
   l'extérieur, et n'est jamais interprété comme du HTML.
   ===================================================================== */

(function () {
  "use strict";

  var MAX_AFFICHE = 90; // au-delà, l'adresse est coupée à l'affichage

  /* Les quatre sections de index.html, avec les mots-clés par lesquels un
     visiteur (ou un vieux lien) peut raisonnablement les désigner. */
  var SECTIONS = [
    {
      id: "realisations",
      label: "Réalisations",
      mots: ["realisations", "realisation", "projets", "projet", "portfolio",
        "travaux", "work", "works", "sites", "site", "references", "cases"]
    },
    {
      id: "parcours",
      label: "Parcours",
      mots: ["parcours", "apropos", "about", "moi", "profil", "bio", "cv",
        "competences", "skills", "experience", "me"]
    },
    {
      id: "methode",
      label: "Méthode",
      mots: ["methode", "method", "process", "processus", "demarche", "etapes",
        "services", "service", "prestations", "tarifs"]
    },
    {
      id: "contact",
      label: "Contact",
      mots: ["contact", "contacter", "devis", "email", "mail", "ecrire", "hello"]
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Normalisation                                                      */
  /* ------------------------------------------------------------------ */

  /* Minuscules, sans accent, sans ponctuation : « /Nos-Réalisations.php »
     devient « nos-realisations ». */
  function normaliser(texte) {
    return texte
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\.(html?|php|aspx?|jsp)$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /* Distance de Levenshtein, version à une seule ligne de travail :
     assez pour rattraper une faute de frappe ou un pluriel oublié. */
  function distance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    var ligne = [];
    var i, j;
    for (j = 0; j <= b.length; j++) ligne[j] = j;

    for (i = 1; i <= a.length; i++) {
      var precedent = ligne[0];
      ligne[0] = i;
      for (j = 1; j <= b.length; j++) {
        var actuel = ligne[j];
        ligne[j] = Math.min(
          ligne[j] + 1,                                        // suppression
          ligne[j - 1] + 1,                                    // insertion
          precedent + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1) // substitution
        );
        precedent = actuel;
      }
    }
    return ligne[b.length];
  }

  /* Cherche la section la plus proche du chemin demandé. Renvoie null
     plutôt qu'une approximation douteuse : une mauvaise suggestion est
     pire que pas de suggestion. */
  function trouverSection(chemin) {
    var segments = normaliser(chemin).split("-").filter(Boolean);
    if (!segments.length) return null;

    // On teste les segments seuls puis leurs paires (« a-propos », « mes-projets »).
    var candidats = segments.slice();
    for (var s = 0; s < segments.length - 1; s++) {
      candidats.push(segments[s] + "-" + segments[s + 1]);
    }

    var meilleur = null;
    var meilleurScore = Infinity;

    SECTIONS.forEach(function (section) {
      section.mots.forEach(function (mot) {
        candidats.forEach(function (candidat) {
          var score;

          if (candidat === mot) {
            score = 0;
          } else if (candidat.length >= 4 && mot.length >= 4 &&
            (candidat.indexOf(mot) !== -1 || mot.indexOf(candidat) !== -1)) {
            score = 1;
          } else if (Math.abs(candidat.length - mot.length) > 2) {
            // Longueurs trop éloignées : ce n'est pas une faute de frappe.
            score = Infinity;
          } else {
            /* Tolérance par paliers. Sous 5 lettres, aucune faute n'est
               admise : « cafe » ne doit pas devenir « cases », ni « mon »
               devenir « moi ». */
            var tolerance = mot.length > 8 ? 2 : (mot.length >= 5 ? 1 : 0);
            var d = tolerance ? distance(candidat, mot) : Infinity;
            score = d <= tolerance ? 1 + d : Infinity;
          }

          if (score < meilleurScore) {
            meilleurScore = score;
            meilleur = section;
          }
        });
      });
    });

    return meilleurScore <= 3 ? meilleur : null;
  }

  /* ------------------------------------------------------------------ */
  /* Adresse demandée                                                   */
  /* ------------------------------------------------------------------ */

  /* Certains hébergeurs passent l'adresse d'origine en paramètre
     (?p=… sur GitHub Pages, ?url=… ailleurs) : on la préfère au chemin
     du document, qui vaudrait sinon « /404.html ». */
  function cheminDemande() {
    var params = new URLSearchParams(window.location.search);
    var brut = params.get("p") || params.get("url") || params.get("path");

    if (!brut) {
      // Page ouverte directement (aperçu local) : le fichier 404 lui-même
      // n'est pas une information utile, mieux vaut ne rien afficher.
      if (/(^|\/)404(\.html?)?$/.test(window.location.pathname)) return "";
      brut = window.location.pathname + window.location.search;
    }

    try {
      brut = decodeURIComponent(brut);
    } catch (e) {
      /* séquence d'échappement invalide : on garde la forme encodée */
    }

    brut = brut.replace(/[\u0000-\u001f\u007f]/g, ""); // caractères de contrôle
    if (brut.charAt(0) !== "/") brut = "/" + brut;
    return brut;
  }

  function tronquer(texte) {
    return texte.length > MAX_AFFICHE
      ? texte.slice(0, MAX_AFFICHE - 1) + "…"
      : texte;
  }

  /* ------------------------------------------------------------------ */
  /* Affichage                                                          */
  /* ------------------------------------------------------------------ */

  var chemin = cheminDemande();

  // Barre d'adresse du cadre navigateur
  var url = document.getElementById("nf-url");
  if (url) {
    url.textContent = chemin
      ? window.location.host + tronquer(chemin)
      : window.location.host + "/…";
  }

  // Dernière ligne du sommaire
  var ligneVide = document.getElementById("nf-path");
  if (ligneVide && chemin) ligneVide.textContent = tronquer(chemin);

  // Trace HTTP : le verbe et le chemin, plus la page d'où l'on vient si
  // elle appartient au site (c'est alors un lien cassé de mon côté).
  var trace = document.getElementById("nf-trace");
  if (trace && chemin) {
    var lignes = [
      ["réponse", "HTTP 404 — Not Found"],
      ["requête", "GET " + tronquer(chemin)]
    ];

    if (document.referrer && document.referrer.indexOf(window.location.origin) === 0) {
      var depuis = document.referrer.slice(window.location.origin.length) || "/";
      lignes.push(["origine", tronquer(depuis)]);
    }

    trace.textContent = "";
    lignes.forEach(function (paire) {
      var ligneTrace = document.createElement("span");
      ligneTrace.className = "nf__trace-row";

      var libelle = document.createElement("span");
      libelle.textContent = paire[0];

      var valeur = document.createElement("b");
      valeur.textContent = paire[1];

      ligneTrace.appendChild(libelle);
      ligneTrace.appendChild(valeur);
      trace.appendChild(ligneTrace);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Suggestion                                                         */
  /* ------------------------------------------------------------------ */

  var section = chemin ? trouverSection(chemin) : null;
  if (!section) return;

  // Ligne du sommaire correspondante : repère d'accent + étiquette.
  var ligne = document.querySelector('.map__row[data-section="' + section.id + '"]');
  if (ligne) {
    ligne.classList.add("is-suggested");

    var titre = ligne.querySelector(".map__title");
    if (titre) {
      var etiquette = document.createElement("span");
      etiquette.className = "map__tag";
      etiquette.textContent = "probablement ici";
      titre.appendChild(document.createTextNode(" "));
      titre.appendChild(etiquette);
    }
  }

  // Rappel en haut de page, près du titre.
  var hint = document.getElementById("nf-hint");
  if (hint) {
    var lien = document.createElement("a");
    lien.className = "link-arrow";
    lien.href = "index.html#" + section.id;
    lien.textContent = section.label;

    hint.appendChild(document.createTextNode("Vous cherchiez peut-être "));
    hint.appendChild(lien);
    hint.classList.add("is-active");
  }
})();
