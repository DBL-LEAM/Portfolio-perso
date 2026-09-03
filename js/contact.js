/* =====================================================================
   contact.js — Formulaire de contact + année du footer
   Sans backend : on valide puis on ouvre le client mail du visiteur.
   Pour un envoi sans quitter le site, branchez ici votre service
   (Formspree, EmailJS, API…) à la place du bloc "mailto".
   ===================================================================== */

(function () {
  "use strict";

  var DEST_EMAIL = "contact@mael.fr"; // ← votre adresse

  var form = document.getElementById("contact-form");
  var feedback = document.getElementById("form-feedback");

  if (form && feedback) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      feedback.classList.remove("is-error");

      var fields = form.querySelectorAll("input, textarea");
      var firstInvalid = null;

      fields.forEach(function (field) {
        var row = field.closest(".field");
        var invalid = !field.checkValidity();
        row.classList.toggle("is-invalid", invalid);
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        feedback.textContent = "Merci de compléter les champs obligatoires.";
        feedback.classList.add("is-error");
        firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      var subject = "Nouveau projet — " + (data.get("entreprise") || data.get("nom"));
      var body =
        "Nom : " + data.get("nom") + "\n" +
        "Email : " + data.get("email") + "\n" +
        "Entreprise : " + (data.get("entreprise") || "—") + "\n\n" +
        data.get("message");

      window.location.href =
        "mailto:" + DEST_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      feedback.textContent = "Votre messagerie va s'ouvrir. Merci, je vous réponds au plus vite.";
      form.reset();
    });
  }

  /* Année du footer ---------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
