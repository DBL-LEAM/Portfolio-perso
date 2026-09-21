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
├── 404.html            Page d'erreur (voir « Page 404 » plus bas)
├── .htaccess           Apache/o2switch : branche la 404 (fichier caché)
├── css/
│   ├── base.css        Variables (:root), reset, typographie, liens, boutons, .reveal
│   ├── layout.css      Conteneur, contextes .section--ink / --paper, navbar, footer
│   ├── sections.css    Hero, Parcours, Réalisations, Approche, Contact
│   ├── notfound.css    Page 404 uniquement (chargé entre sections et responsive)
│   └── responsive.css  Toutes les media queries + prefers-reduced-motion
├── js/
│   ├── navigation.js   Navbar au défilement + menu mobile
│   ├── reveal.js       Apparition des sections au défilement
│   ├── contact.js      Formulaire + année du footer
│   └── notfound.js     Page 404 : adresse demandée + section suggérée
└── img/
    ├── mael.png            Photo source du hero (haute résolution, non servie)
    ├── mael-480.webp       Photo du hero — mobile
    ├── mael-768.webp       Photo du hero — tablette
    └── mael-1024.webp      Photo du hero — desktop / écrans rétina
```

Les fichiers CSS sont chargés dans l'ordre `base → layout → sections → responsive`
(l'ordre compte) ; `404.html` insère `notfound.css` avant `responsive.css`, dont
les media queries doivent rester prioritaires. Les scripts sont indépendants et
chargés en `defer`.

## Personnalisation rapide

- **Couleurs / typo** : bloc `:root` de `css/base.css` — `--font-mono` est une
  police système, sans requête réseau, réservée aux fragments techniques de la
  404. Pour rendre une section sombre ou claire, changez sa classe
  `section--ink` ↔ `section--paper` dans `index.html`.
- **Points de rupture** : tout est dans `css/responsive.css`.
- **Photo** : servie en `.webp` responsive (`img/mael-480.webp` / `-768` / `-1024`,
  ~14 à 90 Ko) via `srcset`/`sizes` sur la balise `<img>` du hero — le navigateur
  choisit la taille adaptée à l'écran. Pour changer la photo, remplacez
  `img/mael.png` puis régénérez les 3 tailles (voir script Python utilisé,
  `PIL`/`Pillow`, qualité 82).
- **Projets** : chaque `<article class="case">` est autonome (image / texte
  alternés automatiquement). Remplacez `.case__placeholder` par un `<img>`.
- **Coordonnées** : e-mail dans `index.html` (liens `mailto:` + JSON-LD) et
  constante `DEST_EMAIL` en haut de `js/contact.js`.
- **SEO / partage** : balises `<meta>` et bloc `application/ld+json` du `<head>` ;
  prévoir `img/og-image.jpg` (1200×630) et ajuster l'URL `canonical`.

## Page 404

`404.html` reprend l'ossature de l'accueil (navbar, faisceaux du hero, cadre
navigateur des réalisations, alternance ink / paper, pied de page) plutôt que
d'afficher un grand chiffre décoratif.

Le parti pris tient en une phrase : le site n'ayant **qu'une seule page**, il
n'a qu'une seule adresse valide. Le code d'erreur prend donc la place du
numéro de section (`404 — Hors sommaire`, en regard des `01 — Réalisations`
de l'accueil), et la page se referme sur le sommaire réel des quatre sections.

Deux éléments sont produits à l'exécution par `js/notfound.js` :

- **L'adresse demandée**, reprise dans la barre du cadre navigateur, dans la
  trace HTTP sous le cadre et en dernière ligne du sommaire (filet en
  pointillés, ni numéro ni flèche). Elle est toujours insérée via
  `textContent`, jamais en HTML.
- **La section la plus probable**, déduite de l'adresse par comparaison à une
  liste de mots-clés (`/mes-projets` → Réalisations, `/a-propos` → Parcours,
  `/contct` → Contact). En cas de doute le script ne propose rien : une
  mauvaise suggestion vaut moins que pas de suggestion. Les mots-clés sont
  dans la constante `SECTIONS` en haut du fichier.

Le sommaire n'utilise volontairement pas `.reveal` : c'est le seul chemin de
sortie de la page, il ne doit pas dépendre de l'exécution d'un script.

**Mise en ligne** — Vercel, Netlify, GitHub Pages et Cloudflare Pages
reprennent un `404.html` à la racine sans configuration.

**Apache / LiteSpeed (o2switch, OVH, la plupart des mutualisés)** ne le font
pas : sans directive explicite, le serveur affiche sa propre page « Not
Found ». D'où le fichier `.htaccess` à la racine du dépôt :

```apache
ErrorDocument 404 /404.html
```

Deux points d'attention :

- `.htaccess` commence par un point : la plupart des clients FTP le
  **masquent** par défaut (FileZilla : Serveur → Forcer l'affichage des
  fichiers cachés). S'il n'est pas transféré, rien ne change.
- Si un `.htaccess` existe déjà sur le serveur, y **ajouter** la ligne plutôt
  que d'écraser le fichier : il contient souvent des règles HTTPS ou de
  redirection.

Apache sert alors la page sans rediriger : l'adresse demandée reste dans la
barre du navigateur (nécessaire à `js/notfound.js`) et le code HTTP renvoyé
reste 404. Sur Nginx : `error_page 404 /404.html;` dans le bloc `server`.

Pour ajouter ou renommer une section du site, penser à mettre à jour les
lignes `<li class="map__row">` de `404.html` **et** la liste `SECTIONS` de
`js/notfound.js`.

## Formulaire

Par défaut il ouvre le client mail du visiteur (`mailto:`). Pour un envoi sans
quitter le site, branchez un service (Formspree, EmailJS, API) à l'endroit indiqué
dans `js/contact.js`.
