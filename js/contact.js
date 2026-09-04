/* =====================================================================
   contact.js — Formulaire de contact + année du footer
   Envoi via Formspree (https://formspree.io) : le message part directement
   depuis le formulaire, sans ouvrir la messagerie du visiteur.
   ===================================================================== */

(function () {
  "use strict";

  // ← Remplacez par votre ID de formulaire Formspree (ex: "abcdwxyz")
  var FORMSPREE_ID = "xqpkldeq";
  var FORMSPREE_URL = "https://formspree.io/f/" + FORMSPREE_ID;

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

      var submitBtn = form.querySelector("button[type=submit]");
      var data = new FormData(form);
      feedback.textContent = "Envoi en cours…";
      if (submitBtn) submitBtn.disabled = true;

      fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            feedback.textContent = "Merci, votre message a bien été envoyé ! Je vous réponds au plus vite.";
            form.reset();
          } else {
            return response.json().then(function (payload) {
              throw new Error((payload && payload.error) || "Erreur d'envoi");
            });
          }
        })
        .catch(function () {
          feedback.textContent = "L'envoi a échoué. Réessayez ou écrivez-moi directement par email.";
          feedback.classList.add("is-error");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* Année du footer ---------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
