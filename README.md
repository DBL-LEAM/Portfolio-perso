# Portfolio — Maël

Site statique : **HTML5 + CSS3 + JavaScript vanilla**, sans dépendance ni build.
Ouvrez `index.html` dans un navigateur, ou servez le dossier (`npx serve`, Live Server…).

## Parti pris

Direction éditoriale / suisse : angles droits (aucun `border-radius`), filets fins
comme fil conducteur, forte typographie (**Playfair Display** + **Inter**),
alternance de sections **sombres** (`--ink`) et **claires** (`--paper`) pour
casser l'uniformité. Une seule couleur d'accent, réservée aux numéros de section
et à un lien.

## Arborescence

```
portfolio/
├── index.html          Page unique ; la navbar fait défiler vers les sections
├── css/
│   ├── base.css        Variables (:root), reset, typographie, liens, boutons, .reveal
│   ├── layout.css      Conteneur, contextes .section--ink / --paper, navbar, footer
│   ├── sections.css    Hero, Parcours, Réalisations, Approche, Contact
│   └── responsive.css  Toutes les media queries + prefers-reduced-motion
├── js/
│   ├── navigation.js   Navbar au défilement + menu mobile
│   ├── reveal.js       Apparition des sections au défilement
│   └── contact.js      Formulaire + année du footer
└── img/
    └── mael.png        Photo du hero
```

Les fichiers CSS sont chargés dans l'ordre `base → layout → sections → responsive`
(l'ordre compte). Les 3 scripts sont indépendants et chargés en `defer`.

## Personnalisation rapide

- **Couleurs / typo** : bloc `:root` de `css/base.css`. Pour rendre une section
  sombre ou claire, changez sa classe `section--ink` ↔ `section--paper` dans `index.html`.
- **Points de rupture** : tout est dans `css/responsive.css`.
- **Photo** : `img/mael.png`. Le fichier actuel est lourd (~2,5 Mo) — exportez une
  version **.webp ou .jpg optimisée (< 300 Ko)**, puis ajustez `src` et
  `width`/`height` sur la balise `<img>` du hero.
- **Projets** : chaque `<article class="case">` est autonome (image / texte
  alternés automatiquement). Remplacez `.case__placeholder` par un `<img>`.
- **Coordonnées** : e-mail dans `index.html` (liens `mailto:` + JSON-LD) et
  constante `DEST_EMAIL` en haut de `js/contact.js`.
- **SEO / partage** : balises `<meta>` et bloc `application/ld+json` du `<head>` ;
  prévoir `img/og-image.jpg` (1200×630) et ajuster l'URL `canonical`.

## Formulaire

Par défaut il ouvre le client mail du visiteur (`mailto:`). Pour un envoi sans
quitter le site, branchez un service (Formspree, EmailJS, API) à l'endroit indiqué
dans `js/contact.js`.
