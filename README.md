# SecureDev Studio — Ahmed Smaili & Dahi Mohammed

Site vitrine **white premium** (studio créatif, éditorial, lumineux) du duo
**Ahmed Smaili** / **Dahi Mohammed** (Oujda, Maroc).
HTML5 / CSS3 / JavaScript vanilla / Bootstrap 5 / Bootstrap Icons.
Aucun backend, aucune clé API.

## Identité visuelle (v4 — blanc strict)

Palette : `#FFFFFF` / `#F8F8F6` / `#F1F1EF` / `#E4E4E1` / `#737373` / `#171717`.
Aucun néon, violet ou bleu électrique. Seul le footer est noir (`#171717`).
Typographies : **Manrope** (titres) + **Inter** (texte).

Toutes les anciennes vidéos couleur et effets néon ont été **supprimés** (zéro MP4).
Visuels 100 % monochromes : composition CSS (maquette + code) pour le hero,
photos N&B pour les projets, monogrammes temporaires pour l'équipe
(aucune photo de personne inventée).

## Pages (blanc dominant, footer noir)

| Fichier | Sections |
|---|---|
| `index.html` | Hero éditorial EN + marquee + manifesto + expertises + équipe + CTA |
| `a-propos.html` | Histoire 2 colonnes + méthode en lignes numérotées |
| `competences.html` | Grille 4 expertises (numéro, icône, hairline, hover) + panorama |
| `services.html` | Hero + 5 services détaillés (livrables, technos, référent, WhatsApp pré-rempli) + méthode + livrables + FAQ + CTA noir |
| `equipe.html` | 2 grandes cartes blanches (rôles vérifiés, LinkedIn) |
| `portfolio.html` | Grille asymétrique + images N&B + carte CTA noire, démos labellisées |
| `contact.html` | « Have a project in mind? » + formulaire → WhatsApp + LinkedIn |

## Médias

| Fichier | Poids | Usage |
|---|---|---|
| `assets/images/cables-mono.jpg` | 25 Ko | Baie réseau N&B (compétences, portfolio) |
| `assets/images/code-mono.jpg` | 29 Ko | Code N&B (compétences, portfolio) |

Origines : Pexels, licence gratuite (Dima Krivoy id 1085656, Computer_Scientist id 9566431),
désaturées en N&B. Aucune photo de personne utilisée.

## Contact : WhatsApp + e-mail + LinkedIn

- `SITE_CONFIG.whatsappNumber` (**À CONFIGURER**, format international sans `+`/espaces).
- Soumission noire « Envoyer sur WhatsApp » + bulle flottante monochrome.
- Le formulaire **n'envoie rien** : ouvre `wa.me` pré-rempli (**confirmation dans WhatsApp**)
  ou un `mailto:` de repli. Aucun faux succès.

## Personnalisation (`js/main.js` → `SITE_CONFIG`)

`linkedinAhmedUrl`, `linkedinDahiUrl`, `whatsappNumber` ⚠️, `contactEmail`
(`smailiahmad937@gmail.com` — configuré), `availabilityText`.
Anti-cache : `?v=5` sur CSS/JS (à incrémenter à chaque refonte).

## Informations intégrées — limites inchangées

Extraits publics LinkedIn uniquement (accès direct bloqué, erreur 999 le 14/10/2026).
Hero et titres clés en anglais (clientèle internationale), corps en français.
Crypto/ML et rôle « développeur web » d'Ahmed non affirmés. Photos, numéro WhatsApp,
Upwork, projets clients : espaces réservés signalés.

## Tests effectués

- [x] Serveur local : 11 ressources → 200, 0 échec (7 pages, CSS, JS, 2 images).
- [x] `node --check` OK + smoke test DOM simulé (init sans exception, chemins normal + reduced-motion).
- [x] Couverture CSS : 102 classes utilisées → 0 manquante ; une seule feuille chargée.
- [x] Aucune référence vidéo/couleur restante dans le code ; contraste noir/blanc maximal.
- [ ] Rendu visuel navigateur : **non vérifiable ici** (aucun navigateur/capture disponible).
