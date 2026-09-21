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
- **Projets** : chaque `<article class="case">` est autonome (image / texte
  alternés automatiquement). Remplacez `.case__placeholder` par un `<img>`.
- **Coordonnées** : e-mail dans `index.html` (liens `mailto:` + JSON-LD) et
  constante `DEST_EMAIL` en haut de `js/contact.js`.
- **SEO / partage** : balises `<meta>` et bloc `application/ld+json` du `<head>` ;
  prévoir `img/og-image.jpg` (1200×630) et ajuster l'URL `canonical`.

## Page 404

`404.html` tient en un seul écran : le code d'erreur en grand, un libellé,
un bouton. Fond noir et faisceaux animés de l'accueil, point d'accent après
le chiffre comme la marque « Maël. » de la navbar. Rien d'autre — une page
d'erreur n'a rien à faire lire.

Le chiffre est composé en **Bricolage Grotesque** (la police des titres du
site, déjà chargée par l'accueil), poussée à `wght 800` et `opsz 96` : cet
axe optique est prévu pour les grands corps, les contreformes s'ouvrent et
les fûts s'affinent, ce qu'un simple grossissement ne donne pas. Il est
rempli par un dégradé vertical (blanc → gris violacé) appliqué en
`background-clip: text`, sous `@supports` pour que le texte reste visible en
couleur pleine si le navigateur ne connaît pas la propriété.

Deux réglages typographiques valent d'être conservés si vous y touchez :
le point d'accent est en ponctuation suspendue (marges négatives annulant
son avance) sans quoi il décale le « 404 » de la moitié de sa largeur hors
du centre ; et les marges sont exprimées en `em` pour suivre le `clamp()`
de la taille à tous les paliers.

Elle réutilise les composants existants (`.nav`, `.btn-beam`, `.hero__beams`,
`.section--ink`) ; `css/notfound.css` ne définit que la mise en page du bloc.
Aucun script propre à la page, et aucun `.reveal` : le bouton de sortie
s'affiche même si le JavaScript ne s'exécute pas.

Contrastes mesurés sur le rendu : le dégradé va de 18,7:1 à 6,0:1 sur le
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
