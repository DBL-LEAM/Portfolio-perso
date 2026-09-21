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
│   └── contact.js      Formulaire + année du footer
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
- **Projets** : chaque `<article class="case-card">` de `#cases-stage` est
  autonome — la capture dans son `.browser`, le texte dans son
  `.case-card__data` (masqué, recopié dans le panneau par `js/carousel.js`).
  Dupliquez un article pour ajouter une réalisation : pastilles et flèches
  suivent tout seuls. Pour signaler un projet en chantier, ajoutez
  `<span class="case__wip">Maquette en cours</span>` dans son `.case__meta`.
- **Contrôles du carrousel** : les flèches sont deux tuiles de verre fumé à
  angles vifs (`.cases-nav`), encadrant les pastilles. La section étant d'une
  couleur unie, un `blur` seul n'y produirait rien : ce sont `saturate` et
  `brightness` du `backdrop-filter` qui agissent, et la vitre est teintée
  sombre plutôt qu'éclaircie — du verre clair sur du crème est invisible. La
  tuile reste translucide (elle rend vers `rgb(99,96,95)` là où, opaque, elle
  vaudrait `rgb(14,13,17)`). Un reflet oblique la balaie au survol, retiré
  sous `prefers-reduced-motion` où il ne serait qu'un éclair.
  La pastille active s'allonge en barre via un pseudo-élément, donc sans
  décaler ses voisines.
  Attention à l'anneau de focus des flèches : la règle globale le pose à 3px
  **à l'extérieur** dans la couleur du texte, soit du crème sur du crème. Il
  est donc redéfini en `outline-offset: -5px`, à l'intérieur du verre.
- **Coordonnées** : e-mail dans `index.html` (liens `mailto:` + JSON-LD) et
  constante `DEST_EMAIL` en haut de `js/contact.js`.
- **SEO / partage** : balises `<meta>` et bloc `application/ld+json` du `<head>` ;
  prévoir `img/og-image.jpg` (1200×630) et ajuster l'URL `canonical`.

## Page 404

`404.html` tient en un seul écran : le code d'erreur en grand, un libellé,
un bouton. Fond noir et faisceaux animés de l'accueil, point d'accent après
le chiffre comme la marque « Maël. » de la navbar. Rien d'autre — une page
d'erreur n'a rien à faire lire.

Le chiffre est composé en **Unbounded**, la police du titre du hero, et le
libellé en **Bricolage Grotesque**, celle des titres de section — les deux
sont déjà chargées par l'accueil, la page n'ajoute aucune requête. Le
chiffre est rempli par un dégradé vertical (blanc → gris violacé) appliqué
en `background-clip: text`, sous `@supports` pour qu'il reste visible en
couleur pleine si le navigateur ne connaît pas la propriété.

Deux réglages de calage valent d'être conservés si vous y touchez, tous
deux vérifiés au pixel sur le rendu :

- Le point d'accent est en **ponctuation suspendue** : une marge droite
  négative annule son avance (15,5px à 1440px), sans quoi il pousse le
  « 404 » de la moitié de cette valeur hors du centre. La valeur dépend des
  métriques d'Unbounded — à réajuster si la police du chiffre change.
- Le libellé porte un `margin-right` négatif égal à son interlettrage : la
  dernière lettre traîne son approche, qui décalerait le mot vers la gauche.

Les deux marges sont en `em`, donc valables à tous les paliers du `clamp()`.

Elle réutilise les composants existants (`.nav`, `.btn-beam`, `.hero__beams`,
`.section--ink`) ; `css/notfound.css` ne définit que la mise en page du bloc.
Aucun script propre à la page, et aucun `.reveal` : le bouton de sortie
s'affiche même si le JavaScript ne s'exécute pas.

Contrastes mesurés sur le rendu : le dégradé va de 18,7:1 à 5,9:1 sur le
fond noir, au-dessus du minimum de 3:1 des grands corps comme du 4,5:1 du
texte courant.

Le bloc occupe exactement la hauteur restante sous la navbar via un `body` en
flex — la hauteur de la barre n'est jamais codée en dur (elle vaut 75px, et
non 74, une fois compté le filet du dessous). En paysage sur mobile, une media
query réduit le chiffre pour que tout tienne sans défilement.

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
barre du navigateur et le code HTTP renvoyé reste 404. Sur Nginx :
`error_page 404 /404.html;` dans le bloc `server`.

## Formulaire

Par défaut il ouvre le client mail du visiteur (`mailto:`). Pour un envoi sans
quitter le site, branchez un service (Formspree, EmailJS, API) à l'endroit indiqué
dans `js/contact.js`.
